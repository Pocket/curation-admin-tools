import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import { useStyles } from './LabelListCard.styles';
import { Label } from '../../../api/generatedTypes';

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
  const classes = useStyles();
  const { label } = props;
  return (
    <Card variant="outlined" square className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={10}>
          <Typography
            className={classes.title}
            variant="h3"
            align="left"
            gutterBottom
          >
            {label.name}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};
