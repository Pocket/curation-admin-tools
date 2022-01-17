import React from 'react';
import { useFormik } from 'formik';
import { validationSchema } from './AddProspectForm.validation';

import { useGetApprovedItemByUrlLazyQuery } from '../../api/curated-corpus-api/generatedTypes';

import { Grid } from '@material-ui/core';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { useNotifications } from '../../../_shared/hooks';

interface AddProspectFormProps {
  onCancel: VoidFunction;
}

export const AddProspectForm: React.FC<
  AddProspectFormProps & SharedFormButtonsProps
> = (props) => {
  const { onCancel } = props;

  // const { runMutation } = useRunMutation();

  // TODO: implement below logic:
  // check if url exists --> yes --> show error (not working as expected)
  // call getUrlMetadata query for the url --> show ApprovedItemForm component with data returned
  // call create approved item mutation

  //TODO: fix YUP url validation (only works for https://...)

  const [getApprovedItemByUrl, { data }] = useGetApprovedItemByUrlLazyQuery();

  const { showNotification } = useNotifications();

  const formik = useFormik({
    initialValues: {
      itemUrl: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      getApprovedItemByUrl({
        variables: {
          url: values.itemUrl,
        },
      });

      data?.getApprovedCuratedCorpusItemByUrl &&
        showNotification('Prospect already exists', 'error');
    },
  });

  return (
    <>
      {console.log('query response: ', data)}
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
    </>
  );
};
