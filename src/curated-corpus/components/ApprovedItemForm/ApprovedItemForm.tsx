import React, { useState } from 'react';

import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { validationSchema } from './ApprovedItemForm.validation';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import {
  topics,
  languages,
  curationStatusOptions,
} from '../../helpers/definitions';
import {
  ApprovedItemFormBody,
  ApprovedItemFormBodyProps,
} from './ApprovedItemFormBody';

interface ApprovedItemFormProps {
  /**
   * The approved item that needs to be edited.
   */
  approvedItem: ApprovedCuratedCorpusItem;

  /**
   * On submit handle function called on the 'Save' button click
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  onCancel: VoidFunction;
}

/**
 * This component houses all the logic and data that
 * will be used in this form. The logic and data is passed down
 * to ApprovedItemFormBody component which is responsible for only displaying
 * and editing data.
 *
 */

export const ApprovedItemForm: React.FC<ApprovedItemFormProps> = (
  props
): JSX.Element => {
  const { approvedItem, onSubmit, onCancel } = props;

  //TODO: @Herraj - add state variables and logic for holding the new form input values
  const [isShortLived, setIsShortLived] = useState<boolean>(
    approvedItem.isShortLived
  );

  const approvedItemCorpus = curationStatusOptions.find(
    (item) => item.code === approvedItem.status
  )?.name;

  const approvedItemTopic = topics.find(
    (item) => item.code === approvedItem.topic
  )?.name;

  const approvedItemLanguage = languages.find(
    (item) => item.code.toLowerCase() === approvedItem.language
  )?.name;

  const formik = useFormik({
    initialValues: {
      url: approvedItem.url,
      title: approvedItem.title,
      publisher: approvedItem.publisher,
      language: approvedItemLanguage ?? '',
      topic: approvedItemTopic ?? '',
      curationStatus: approvedItemCorpus ?? '',
      shortLived: approvedItem.isShortLived,
      syndicated: approvedItem.isSyndicated,
      collection: approvedItem.isCollection,
      excerpt: approvedItem.excerpt,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  const toggleIsShortLived = (): void => {
    setIsShortLived(!isShortLived);
  };

  const approvedItemFormBodyProps: ApprovedItemFormBodyProps = {
    approvedItem: approvedItem,
    formik: formik,
    topics: topics,
    languages: languages,
    curationStatus: curationStatusOptions,
    isSyndicated: approvedItem.isSyndicated,
    isCollection: approvedItem.isCollection,
    isShortLived: isShortLived,
    toggleIsShortLived: toggleIsShortLived,
    onCancel: onCancel,
  };
  return <ApprovedItemFormBody {...approvedItemFormBodyProps} />;
};
