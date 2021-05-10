import React from 'react';
import { Card, CardMedia, Grid, Hidden, Typography } from '@material-ui/core';
import { StoryModel } from '../../api';
import { useStyles } from './StoryListCard.styles';
import ReactMarkdown from 'react-markdown';

interface StoryListCardProps {
  story: StoryModel;
}

/**
 * A compact card that displays story information
 *
 * @param props
 */
export const StoryListCard: React.FC<StoryListCardProps> = (props) => {
  const classes = useStyles();
  const { story } = props;

  return (
    <Card variant="outlined" square className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={3} sm={2}>
          <CardMedia
            component="img"
            src={
              story.imageUrl && story.imageUrl.length > 0
                ? story.imageUrl
                : '/placeholders/story.svg'
            }
            alt={story.title}
            className={classes.image}
          />
        </Grid>
        <Grid item xs={8} sm={10}>
          <Typography
            className={classes.title}
            variant="h3"
            align="left"
            gutterBottom
          >
            {story.title}
          </Typography>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>
              {story.authors
                .map((author: { name: string }) => {
                  return author.name;
                })
                .join(', ')}
            </span>{' '}
            &middot; <span>{story.publisher}</span>
          </Typography>
          <Hidden smDown implementation="css">
            <Typography noWrap component="div">
              <ReactMarkdown className="compact-markdown">
                {story.excerpt ? story.excerpt.substring(0, 100) : ''}
              </ReactMarkdown>
            </Typography>
          </Hidden>
        </Grid>
      </Grid>
    </Card>
  );
};
