import React from 'react';
import { useFormik } from 'formik';
import { validationSchema } from './AddProspectForm.validation';

import { Grid } from '@material-ui/core';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
  Modal,
} from '../../../_shared/components';
// import { useRunMutation } from '../../../_shared/hooks';
import { useGetApprovedItemByUrlLazyQuery } from '../../api/curated-corpus-api/generatedTypes';

interface AddProspectModalProps {
  isOpen: boolean;

  toggleModal: VoidFunction;
}

/**
 * This component houses all the logic and data that will be used in this form.
 */

export const AddProspectModal: React.FC<
  AddProspectModalProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  //const [itemUrl] = useState<string>('');
  const { isOpen, toggleModal } = props;

  //add toggle logic

  // add mutation logic
  // use useRunMutation hook
  // const { runMutation } = useRunMutation();
  const [getApprovedItemByUrl, { data }] = useGetApprovedItemByUrlLazyQuery();
  // check if url exists and then hydrate

  const formik = useFormik({
    initialValues: {
      itemUrl: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      console.log(values.itemUrl);
      getApprovedItemByUrl({
        variables: { url: values.itemUrl },
      });

      // TODO: this works but but not as expected something async maybe?
      console.table(data);
      if (data?.getApprovedCuratedCorpusItemByUrl.url === values.itemUrl) {
        alert('Item already exists');
        formikHelpers.setSubmitting(false);
        formikHelpers.resetForm();
        toggleModal();
      }
    },
  });

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container>
        <Grid item xs={12}>
          <form name="add-prospect-form" onSubmit={formik.handleSubmit}>
            <FormikTextField
              id="itemUrl"
              label="Item URL"
              fieldProps={formik.getFieldProps('itemUrl')}
              fieldMeta={formik.getFieldMeta('itemUrl')}
            ></FormikTextField>
            <SharedFormButtons onCancel={toggleModal} />
          </form>
        </Grid>
      </Grid>
    </Modal>
  );
};
