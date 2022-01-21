import React, { useState } from 'react';
import { Box, Grid, LinearProgress } from '@material-ui/core';
import { v5 as uuidv5 } from 'uuid';

import { useFormik } from 'formik';
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
  useGetApprovedItemByUrlLazyQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import { useGetUrlMetadataLazyQuery } from '../../api/prospect-api/generatedTypes';
import {
  useNotifications,
  //useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import { ApprovedItemModal } from '..';

interface AddProspectFormProps {
  onCancel: VoidFunction;
  toggleAddProspectModal: VoidFunction;
}

export const AddProspectForm: React.FC<
  AddProspectFormProps & SharedFormButtonsProps
> = (props) => {
  const { onCancel, toggleAddProspectModal } = props;

  //TODO: figure out logic for how to send the mutation function down to the form
  //const { runMutation } = useRunMutation();

  const [itemUrl, setItemUrl] = useState<string>('');
  const [createApprovedItemInput, setCreateApprovedItemInput] =
    useState<CreateApprovedCuratedCorpusItemInput>();

  const { showNotification } = useNotifications();
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);

  // call parser for metadata
  const [getUrlMetadata] = useGetUrlMetadataLazyQuery({
    client: client,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const approvedItem = {
        prospectId: uuidv5(data.getUrlMetadata.url, 'manual'),
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
        isOpen={approvedItemModalOpen}
        onSave={() => {
          alert('form submitted');
        }}
        toggleModal={() => {
          toggleApprovedItemModal();
          toggleAddProspectModal();
        }}
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
