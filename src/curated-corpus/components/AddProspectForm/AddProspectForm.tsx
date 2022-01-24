import React, { useState } from 'react';
import { Box, Grid, LinearProgress } from '@material-ui/core';

import { useFormik, FormikHelpers, FormikValues } from 'formik';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';

import { validationSchema } from './AddProspectForm.validation';
import { client } from '../../api/prospect-api/client';
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

export const AddProspectForm: React.FC<
  AddProspectFormProps & SharedFormButtonsProps
> = (props) => {
  //de-structure props
  const { onCancel, toggleAddProspectModal } = props;

  //set up state variables
  const [itemUrl, setItemUrl] = useState<string>('');
  const [approvedItem, setApprovedItem] = useState<ApprovedCuratedCorpusItem>();

  // set up some hooks
  const { showNotification } = useNotifications();
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);

  // function to toggle both modals
  const closeBothModals = () => {
    toggleApprovedItemModal();
    toggleAddProspectModal();
  };

  // prepare mutation hook
  const { runMutation } = useRunMutation();

  // prepare upload image to s3 mutation
  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // prepare create approved item mutation
  const [createApprovedItemMutation] =
    useCreateApprovedCuratedCorpusItemMutation();

  // Lazy query to get metadata for an url.
  const [getUrlMetadata] = useGetUrlMetadataLazyQuery({
    client: client,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const approvedItem = transformUrlMetaDataToApprovedItem(
        data.getUrlMetadata,
        false
      );

      setApprovedItem(approvedItem);
      toggleApprovedItemModal();
    },
  });

  // query to check if url already exists in the corpus
  const [getApprovedItemByUrl] = useGetApprovedItemByUrlLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const approvedItem = data?.getApprovedCuratedCorpusItemByUrl;
      if (approvedItem) {
        showNotification('This URL already exists in the Corpus', 'error');
        return;
      }
      if (approvedItem === null) {
        getUrlMetadata({
          variables: {
            url: itemUrl,
          },
        });
      }
    },
  });

  // call back which will be called after clicking save on the edit form
  const createApprovedItem = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    // upload item image to s3
    const s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
      values.imageUrl,
      uploadApprovedItemImage
    );

    //build an approved item and replace the imageUrl with the s3ImageUrl
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
        console.log('item created');
        closeBothModals();
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
      <form name="add-prospect-form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ width: '800px' }}>
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
        toggleModal={closeBothModals}
        approvedItem={approvedItem!}
      />
    </>
  );
};
