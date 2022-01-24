import React, { useState } from 'react';
import { Box, Grid, LinearProgress } from '@material-ui/core';
import { v5 as uuidv5 } from 'uuid';

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
  CuratedStatus,
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
import { downloadAndUploadApprovedItemImageToS3 } from '../../helpers/helperFunctions';

interface AddProspectFormProps {
  onCancel: VoidFunction;
  toggleAddProspectModal: VoidFunction;
}

export const AddProspectForm: React.FC<
  AddProspectFormProps & SharedFormButtonsProps
> = (props) => {
  const { onCancel, toggleAddProspectModal } = props;

  const { runMutation } = useRunMutation();

  const [itemUrl, setItemUrl] = useState<string>('');
  const [createApprovedItemInput, setCreateApprovedItemInput] =
    useState<CreateApprovedCuratedCorpusItemInput>();

  const { showNotification } = useNotifications();
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);

  // call parser for metadata
  const [getUrlMetadata, { data: urlMetadata }] = useGetUrlMetadataLazyQuery({
    client: client,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const approvedItem = {
        prospectId: uuidv5(
          data.getUrlMetadata.url,
          '9edace02-b9c6-4705-a0d6-16476438557b'
        ),
        url: data.getUrlMetadata.url,
        title: data.getUrlMetadata.title ?? '',
        excerpt: data.getUrlMetadata.excerpt ?? '',
        status: CuratedStatus.Corpus,
        language: data.getUrlMetadata.language ?? '',
        publisher: data.getUrlMetadata.publisher ?? '',
        imageUrl: data.getUrlMetadata.imageUrl ?? '',
        topic: '',
        isCollection: data.getUrlMetadata.isCollection ?? false,
        isSyndicated: data.getUrlMetadata.isSyndicated ?? false,
        isTimeSensitive: false,
      };
      setCreateApprovedItemInput(approvedItem);
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

  const closeBothModals = () => {
    toggleApprovedItemModal();
    toggleAddProspectModal();
  };

  // prepare create approved item mutation
  const [createApprovedItemMutation] =
    useCreateApprovedCuratedCorpusItemMutation();

  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // call back which will be called after clicking save on the edit form
  const createApprovedItem = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    //build an approved item
    const languageCode = values.language === 'English' ? 'en' : 'de';
    const curationStatus = values.curationStatus.toUpperCase();
    const topic = values.topic.toUpperCase();
    const imageUrl = urlMetadata?.getUrlMetadata.imageUrl!;
    //TODO: use download and upload image helper function

    // upload item image to s3
    const s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
      imageUrl,
      uploadApprovedItemImage
    );

    // build approved item
    const approvedItem = {
      prospectId: uuidv5(values.url, '9edace02-b9c6-4705-a0d6-16476438557b'),
      url: values.url,
      title: values.title,
      excerpt: values.excerpt,
      status: curationStatus,
      language: languageCode,
      publisher: values.publisher,
      imageUrl: s3ImageUrl,
      topic,
      isCollection: values.collection,
      isTimeSensitive: values.timeSensitive,
      isSyndicated: values.syndicated,
    };

    // call the create approved item mutation
    runMutation(
      createApprovedItemMutation,
      { variables: { data: { ...approvedItem } } },
      'Item successfully added to the curated corpus.',
      () => {
        console.log('item created');
        closeBothModals();
        formikHelpers.setSubmitting(false);
      }
    );
  };

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
        approvedItem={
          {
            ...createApprovedItemInput,
            externalId: '',
            createdAt: 0,
            createdBy: 'sso-user',
            updatedAt: 0,
          } as ApprovedCuratedCorpusItem
        }
      />
    </>
  );
};
