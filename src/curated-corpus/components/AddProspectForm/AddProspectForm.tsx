import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Grid } from '@material-ui/core';

import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';

import { validationSchema } from './AddProspectForm.validation';
import { client } from '../../api/prospect-api/client';
import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
  useGetApprovedItemByUrlLazyQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import { useGetUrlMetadataLazyQuery } from '../../api/prospect-api/generatedTypes';
import { useNotifications } from '../../../_shared/hooks';
import { ApprovedItemModal } from '..';

interface AddProspectFormProps {
  onCancel: VoidFunction;
}

export const AddProspectForm: React.FC<
  AddProspectFormProps & SharedFormButtonsProps
> = (props) => {
  const { onCancel } = props;

  // const { runMutation } = useRunMutation();

  // TODO: implement below logic:
  // check if url exists --> yes --> show error (done)
  // call getUrlMetadata query for the url --> show ApprovedItemForm component with data returned
  // call create approved item mutation

  const [approvedItem, setApprovedItem] = useState<ApprovedCuratedCorpusItem>();

  //TODO: fix this abomination
  const [getUrlMetadata, { data }] = useGetUrlMetadataLazyQuery({
    client: client,
    onCompleted: (data) => {
      const approvedItem = {
        prospectId: '',
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
        createdAt: 0,
        createdBy: '',
        externalId: '',
        updatedAt: 0,
      };
      console.log(approvedItem);
      setApprovedItem(approvedItem);
    },
  });

  const [itemUrl, setItemUrl] = useState<string>('');

  const [getApprovedItemByUrl] = useGetApprovedItemByUrlLazyQuery({
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

  const { showNotification } = useNotifications();

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
      {data && (
        <ApprovedItemModal
          isOpen={true}
          onSave={() => {
            alert('form submitted');
          }}
          toggleModal={() => {
            return;
          }}
          approvedItem={approvedItem!}
        />
      )}
    </>
  );
};
