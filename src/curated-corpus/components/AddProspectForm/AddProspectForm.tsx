import React, { useState } from 'react';
import { Box, Grid, LinearProgress } from '@material-ui/core';

import { useFormik, FormikHelpers, FormikValues } from 'formik';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';

import { validationSchema } from './AddProspectForm.validation';
import { useStyles } from './AddProspectForm.styles';

import { client as prospectApiClient } from '../../api/prospect-api/client';
import {
  ApprovedCuratedCorpusItem,
  CreateApprovedCuratedCorpusItemInput,
  useCreateApprovedCuratedCorpusItemMutation,
  useGetApprovedItemByUrlLazyQuery,
  useUploadApprovedCuratedCorpusItemImageMutation,
} from '../../api/curated-corpus-api/generatedTypes';
import { useGetUrlMetadataLazyQuery } from '../../api/prospect-api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import { ApprovedItemModal } from '..';
import {
  downloadAndUploadApprovedItemImageToS3,
  transformUrlMetaDataToApprovedItem,
  transformFormInputToCreateApprovedItemInput,
} from '../../helpers/helperFunctions';

interface AddProspectFormProps {
  onCancel: VoidFunction;
  toggleAddProspectModal: VoidFunction;
}

/**
 * This component houses all the logic and data that will be used in this form.
 */
export const AddProspectForm: React.FC<
  AddProspectFormProps & SharedFormButtonsProps
> = (props) => {
  // get styles
  const classes = useStyles();

  // de-structure props
  const { onCancel, toggleAddProspectModal } = props;

  // state variable to store the itemUrl field from the form
  const [itemUrl, setItemUrl] = useState<string>('');

  // state variable to store the approved item built after
  // getting the item metadata
  const [approvedItem, setApprovedItem] = useState<ApprovedCuratedCorpusItem>();

  // set up some hooks
  const { showNotification } = useNotifications();
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);

  // function to toggle both modals
  const toggleApprovedItemAndProspectModal = () => {
    toggleApprovedItemModal();
    toggleAddProspectModal();
  };

  // prepare the runMutation helper hook
  const { runMutation } = useRunMutation();

  // prepare mutation hook to upload image to s3
  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // prepare mutation hook to create approved item
  const [createApprovedItemMutation] =
    useCreateApprovedCuratedCorpusItemMutation();

  // lazy query to check if url already exists in the corpus
  const [getApprovedItemByUrl] = useGetApprovedItemByUrlLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const approvedItem = data?.getApprovedCuratedCorpusItemByUrl;

      // show error toast if the url exists already
      if (approvedItem) {
        showNotification('This URL already exists in the Corpus', 'error');
        return;
      }

      // fetch metadata for url if it doesn't exist in the corpus
      if (approvedItem === null) {
        getUrlMetadata({
          variables: {
            url: itemUrl,
          },
        });
      }
    },
  });

  // lazy query to get metadata for an url
  const [getUrlMetadata] = useGetUrlMetadataLazyQuery({
    client: prospectApiClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      // create an approved item object from the url metadata to be consumed by the edit form
      const approvedItem = transformUrlMetaDataToApprovedItem(
        data.getUrlMetadata,
        false
      );

      // set state variable so that it can be used by the edit form
      setApprovedItem(approvedItem);
      // show edit form
      toggleApprovedItemModal();
    },
  });

  // callback which will be called after clicking save on the edit form
  // it uploads the item's image to S3 first and then calls the mutation to
  // create a new approved item with s3 image url
  const createApprovedItem = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    // upload item image to s3
    const s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
      values.imageUrl,
      uploadApprovedItemImage
    );

    // build an approved item using the helper and replace the imageUrl with the s3ImageUrl
    const createApprovedItemInput: CreateApprovedCuratedCorpusItemInput = {
      ...transformFormInputToCreateApprovedItemInput(values),
      imageUrl: s3ImageUrl,
    };
    // call the create approved item mutation
    runMutation(
      createApprovedItemMutation,
      { variables: { data: { ...createApprovedItemInput } } },
      'Item successfully added to the curated corpus.',
      () => {
        toggleApprovedItemAndProspectModal();
        formikHelpers.setSubmitting(false);
      }
    );
  };

  // set up formik object for this form
  const formik = useFormik({
    initialValues: {
      itemUrl: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      setItemUrl(values.itemUrl);
      getApprovedItemByUrl({
        variables: {
          url: values.itemUrl,
        },
      });

      formikHelpers.resetForm();
    },
  });

  return (
    <>
      <form
        name="add-prospect-form"
        onSubmit={formik.handleSubmit}
        className={classes.root}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormikTextField
              id="itemUrl"
              label="Item URL"
              fieldProps={formik.getFieldProps('itemUrl')}
              fieldMeta={formik.getFieldMeta('itemUrl')}
            ></FormikTextField>

            <SharedFormButtons onCancel={onCancel} />
          </Grid>
        </Grid>
      </form>

      {formik.isSubmitting && (
        <Grid item xs={12}>
          <Box mb={3}>
            <LinearProgress />
          </Box>
        </Grid>
      )}

      <ApprovedItemModal
        heading="Review prospect"
        isOpen={approvedItemModalOpen}
        onSave={createApprovedItem}
        toggleModal={toggleApprovedItemAndProspectModal}
        approvedItem={approvedItem!}
      />
    </>
  );
};
