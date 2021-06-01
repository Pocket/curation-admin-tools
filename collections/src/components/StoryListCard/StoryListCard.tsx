import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FormikValues } from 'formik';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapse,
  Grid,
  Hidden,
  Paper,
  Typography,
} from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import {
  StoryModel,
  useDeleteCollectionStoryMutation,
  useUpdateCollectionStoryMutation,
} from '../../api';
import { transformAuthors } from '../../utils/transformAuthors';
import { ImageUpload, StoryForm } from '../';
import { useStyles } from './StoryListCard.styles';
import { useNotifications } from '../../hooks/useNotifications';
import { FormikHelpers } from 'formik/dist/types';
import { CollectionStoryAuthor } from '../../api/generatedTypes';

interface StoryListCardProps {
  story: StoryModel;

  refetch: () => void;
}

/**
 * A compact card that displays story information
 *
 * @param props
 */
export const StoryListCard: React.FC<StoryListCardProps> = (props) => {
  const classes = useStyles();
  const { showNotification } = useNotifications();
  const { story, refetch } = props;

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  // prepare the "delete story" mutation
  const [deleteStory] = useDeleteCollectionStoryMutation();

  // prepare the "update story" mutation
  const [updateStory] = useUpdateCollectionStoryMutation();

  const onDelete = (): void => {
    deleteStory({
      variables: {
        externalId: story.externalId,
      },
    })
      .then(() => {
        // manually refresh the cache
        refetch();

        showNotification(
          `Deleted "${story.title.substring(0, 50)}..."`,
          'success'
        );
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
      });
  };

  const onUpdate = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // prepare authors! They need to be an array of objects again
    const authors = transformAuthors(values.authors);

    updateStory({
      variables: {
        externalId: story.externalId,
        url: values.url,
        title: values.title,
        excerpt: values.excerpt,
        publisher: values.publisher,
        // NB: not updating the image here. Uploads are handled separately
        imageUrl: story.imageUrl,
        authors,
      },
    })
      .then(() => {
        // manually refresh the cache
        refetch();

        showNotification(
          `Updated "${story.title.substring(0, 50)}..."`,
          'success'
        );
        setShowEditForm(false);
        formikHelpers.setSubmitting(false);
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
        formikHelpers.setSubmitting(false);
      });
  };

  /**
   * Save the S3 URL we get back from the API to the collection record
   */
  const handleImageUploadSave = (url: string): void => {
    // get rid of the __typename property as the mutation variable
    // doesn't expect to receive it
    const authors = story.authors.map((author) => {
      return { name: author.name, sortOrder: author.sortOrder };
    });

    updateStory({
      variables: {
        // We send these because we have to
        externalId: story.externalId,
        url: story.url,
        title: story.title,
        excerpt: story.excerpt,
        publisher: story.publisher ?? '',
        authors: authors,
        // This is the only field that needs updating
        imageUrl: url,
      },
    })
      .then(() => {
        showNotification(
          `Saved image for "${story.title.substring(0, 50)}..."`,
          'success'
        );
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
      });
  };

  // Work out a comma-separated list of authors if there are any for this story
  const displayAuthors = story.authors
    ?.map((author: CollectionStoryAuthor) => {
      return author.name;
    })
    .join(', ');

  // The &middot; character is only needed if the story has authors as it separates
  // the list of authors and the name of the publisher.
  // There appears to be no way to display an HTML special character conditionally
  // (well, except for setting innerHTML directly) other than assigning it to a variable
  const middot = '\u00b7';

  return (
    <>
      <Card variant="outlined" square className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <ImageUpload
              entity={story}
              placeholder="/placeholders/story.svg"
              onImageSave={handleImageUploadSave}
            />
          </Grid>
          <Grid item xs={7} sm={8}>
            <Typography
              className={classes.title}
              variant="h3"
              align="left"
              gutterBottom
            >
              <a href={story.url}>{story.title}</a>
            </Typography>
            <Typography
              className={classes.subtitle}
              variant="subtitle2"
              color="textSecondary"
              component="span"
              align="left"
            >
              <span>{displayAuthors}</span>
              {displayAuthors.length > 0 && ` ${middot} `}
              <span>{story.publisher}</span>
            </Typography>
            <Hidden smDown implementation="css">
              <Typography component="div">
                <ReactMarkdown className="compact-markdown">
                  {story.excerpt ? story.excerpt : ''}
                </ReactMarkdown>
              </Typography>
            </Hidden>
          </Grid>
          <Grid item xs={1} sm={1}>
            <ButtonGroup orientation="vertical" variant="text" color="primary">
              <Button color="primary" onClick={toggleEditForm}>
                <EditIcon />
              </Button>
              <Button color="primary" onClick={onDelete}>
                <DeleteOutlineIcon />
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>

        <Collapse in={showEditForm}>
          <Paper elevation={4}>
            <Box p={2} mt={3}>
              <Box mb={2}>
                <h3>Edit Story</h3>
              </Box>
              <StoryForm
                key={story.externalId}
                story={story}
                showAllFields={true}
                showPopulateButton={false}
                onCancel={toggleEditForm}
                onSubmit={onUpdate}
              />
            </Box>
          </Paper>
        </Collapse>
      </Card>
    </>
  );
};
