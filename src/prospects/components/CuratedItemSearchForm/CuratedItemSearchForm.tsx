import React from 'react';
import { FormikValues } from 'formik';

interface CuratedItemSearchFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues) => void;
}

/**
 * A form for filtering and searching approved Curated Items.
 */
export const CuratedItemSearchForm: React.FC<CuratedItemSearchFormProps> = (
  props
): JSX.Element => {
  const { onSubmit } = props;

  return <h1>This is a form</h1>;
};
