import { ScheduleItemForm } from '../ScheduleItemForm/ScheduleItemForm';
import React from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import {
  HandleApiResponse,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { useGetNewTabsForUserQuery } from '../../api/curated-corpus-api/generatedTypes';

interface ScheduleItemFormConnectorProps {
  /**
   * The UUID of the Approved Curated Item about to be scheduled.
   */
  approvedItemExternalId: string;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
}

export const ScheduleItemFormConnector: React.FC<
  ScheduleItemFormConnectorProps & SharedFormButtonsProps
> = (props) => {
  const { approvedItemExternalId, onCancel, onSubmit } = props;

  // Get the list of New Tabs the currently logged-in user has access to.
  const { data, loading, error } = useGetNewTabsForUserQuery();

  return (
    <>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {data && (
        <ScheduleItemForm
          approvedItemExternalId={approvedItemExternalId}
          newTabs={data?.getNewTabsForUser}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </>
  );
};
