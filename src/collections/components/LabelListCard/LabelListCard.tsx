import React from 'react';
import { Card, Grid, Typography } from '@mui/material';
import { Label } from '../../../api/generatedTypes';
import { curationPalette } from '../../../theme';

interface LabelListCardProps {
  /**
   * An object with everything label-related in it.
   */
  label: Label;
}

/**
 * A compact card that displays label name.
 *
 * @param props
 */
export const LabelListCard: React.FC<LabelListCardProps> = (props) => {
  const { label } = props;
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
        '&:active': {
          backgroundColor: curationPalette.lightGrey,
        },
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
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};
