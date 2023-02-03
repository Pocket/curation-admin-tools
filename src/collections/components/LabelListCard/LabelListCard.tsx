import React from 'react';
import { Button, ButtonGroup, Card, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Label } from '../../../api/generatedTypes';
import { curationPalette } from '../../../theme';
import { LabelModal } from '../../components';
import { useToggle } from '../../../_shared/hooks';

interface LabelListCardProps {
  /**
   * An object with everything label-related in it.
   */
  label: Label;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;
}

/**
 * A compact card that displays label name.
 *
 * @param props
 */
export const LabelListCard: React.FC<LabelListCardProps> = (props) => {
  const { label, refetch } = props;
  const [labelModalOpen, toggleLabelModal] = useToggle(false);
  return (
    <Card
      variant="outlined"
      square
      sx={{
        margin: 'auto',
        padding: '1.25rem 0.25rem',
        border: 0,
        borderBottom: `1px solid ${curationPalette.lightGrey}`,
        cursor: 'pointer',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={8} sm={10}>
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            sx={{
              fontSize: '1.25rem',
              fontWeight: 500,
            }}
          >
            {label.name}
            <LabelModal
              isOpen={labelModalOpen}
              toggleModal={toggleLabelModal}
              modalTitle="Edit Label"
              refetch={refetch}
              runUpdateLabelMutation={true} // this modal is in charge of updating a label, so passing flag
              label={label} // we also need to pass the label data to update
            />
            <ButtonGroup orientation="vertical" color="primary" variant="text">
              <Button
                color="primary"
                onClick={toggleLabelModal}
                data-testid="edit-label-button"
              >
                <EditIcon />
              </Button>
            </ButtonGroup>
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};
