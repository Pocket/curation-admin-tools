import React from 'react';
import { useParams } from 'react-router-dom';
import {
  ActionScreen,
  useApprovedCorpusItemByExternalIdQuery,
} from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Typography,
} from '@mui/material';
import {
  ApprovedItemCurationHistory,
  ApprovedItemInfo,
  EditCorpusItemAction,
  RejectCorpusItemAction,
  ScheduleCorpusItemAction,
} from '../../components';
import { useToggle } from '../../../_shared/hooks';

/**
 * This page displays all the details and schedule history of a single corpus item.
 *
 * @constructor
 */
export const CorpusItemPage: React.FC = (): JSX.Element => {
  // Retrieve the external ID for the corpus item from the URL
  const params = useParams<{ id: string }>();

  // Query the API for data
  const { loading, error, data, refetch } =
    useApprovedCorpusItemByExternalIdQuery({
      variables: {
        externalId: params.id,
      },
    });

  /**
   * Keep track of whether the "Reject this item" modal is open or not.
   */
  const [rejectModalOpen, toggleRejectModal] = useToggle(false);

  /**
   * Keep track of whether the "Schedule this item" modal is open or not.
   */
  const [scheduleModalOpen, toggleScheduleModal] = useToggle(false);

  /**
   * Keep track of whether the "Edit this item" modal is open or not.
   */
  const [editModalOpen, toggleEditModal] = useToggle(false);
  return (
    <>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {/* The API query returns null if there is no match. Let's cater for it */}
      {data && data.approvedCorpusItemByExternalId === null && (
        <>
          <h1>🤦&nbsp;Oh no!</h1>
          <Box my={3}>
            <Alert severity="info" variant="filled">
              A corpus item with ID of &quot;{params.id}&quot; could not be
              found.
              <br />
              <br />
              Note that you will also see this message if you have just moved
              this corpus item to the Rejected corpus.
            </Alert>
          </Box>
        </>
      )}
      {data && data.approvedCorpusItemByExternalId !== null && (
        <>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={8}>
              <h1>
                {data.approvedCorpusItemByExternalId?.title}
                <Typography variant="subtitle2" component="div">
                  Corpus Item
                </Typography>
              </h1>

              <ApprovedItemInfo item={data.approvedCorpusItemByExternalId!} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <h2>Actions</h2>
              <Box alignSelf="center" marginBottom={3}>
                <ButtonGroup
                  orientation="horizontal"
                  color="primary"
                  variant="text"
                >
                  <Button color="primary" onClick={toggleScheduleModal}>
                    Schedule
                  </Button>
                  <Button color="secondary" onClick={toggleRejectModal}>
                    Reject
                  </Button>
                  <Button color="primary" onClick={toggleEditModal}>
                    Edit
                  </Button>
                </ButtonGroup>
              </Box>

              <ApprovedItemCurationHistory
                item={data.approvedCorpusItemByExternalId!}
              />
            </Grid>
          </Grid>
          <RejectCorpusItemAction
            item={data.approvedCorpusItemByExternalId!}
            actionScreen={ActionScreen.Corpus}
            modalOpen={rejectModalOpen}
            toggleModal={toggleRejectModal}
            refetch={refetch}
          />
          <ScheduleCorpusItemAction
            item={data.approvedCorpusItemByExternalId!}
            modalOpen={scheduleModalOpen}
            toggleModal={toggleScheduleModal}
            refetch={refetch}
            actionScreen={ActionScreen.Corpus}
          />
          <EditCorpusItemAction
            item={data.approvedCorpusItemByExternalId!}
            actionScreen={ActionScreen.Corpus}
            modalOpen={editModalOpen}
            toggleModal={toggleEditModal}
            refetch={refetch}
          />
        </>
      )}
    </>
  );
};
