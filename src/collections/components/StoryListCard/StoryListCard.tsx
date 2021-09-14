import React from 'react';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapse,
  Grid,
  Paper,
} from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import { transformAuthors } from '../../utils/transformAuthors';
import { ImageUpload, StoryCard, StoryForm } from '../';
import { useStyles } from './StoryListCard.styles';
import { useRunMutation, useToggle } from '../../../_shared/hooks';
import {
  CollectionStory,
  useDeleteCollectionStoryMutation,
  useUpdateCollectionStoryImageUrlMutation,
  useUpdateCollectionStoryMutation,
} from '../../api/collection-api/generatedTypes';

interface StoryListCardProps {
  /**
   * A story that belongs to one or more collections
   */
  story: CollectionStory;

  /**
   * A helper method that requests the list of stories from the API
   * whenever the cache needs updating, i.e. after one of the stories
   * was deleted.
   */
  refetch: () => void;

  /**
   * Whether to show in the edit form the 'From Partner' switch.
   * This value comes from a collection partnership, and is not available
   * from within the story object itself.
   */
  showFromPartner: boolean;
}

/**
 * A Collection Story card component that is responsible for an awful lot of things:
 * displaying all the controls for a story, i.e image upload, edit and delete buttons,
 * running the update/delete/upload new image mutations - the lot!
 *
 * @param props
 */
export const StoryListCard: React.FC<StoryListCardProps> = (props) => {
  const classes = useStyles();
  const { story, refetch, showFromPartner } = props;
  const [showEditForm, toggleEditForm] = useToggle();

  // Get a helper function that will execute a mutation and show notifications
  const { runMutation } = useRunMutation();

  // Prepare the "delete story" mutate function
  const [deleteStory] = useDeleteCollectionStoryMutation();

  // Delete the story when the user requests this action
  const onDelete = (): void => {
    runMutation(
      deleteStory,
      {
        variables: {
          externalId: story.externalId,
        },
      },
      'Story deleted successfully',
      refetch
    );
  };

  // 1. Prepare the "update story" mutation
  const [updateStory] = useUpdateCollectionStoryMutation();
  // 3. Update the story when the user submits the form
  const onUpdate = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // prepare authors! They need to be an array of objects again
    const authors = transformAuthors(values.authors);

    // Set out all the values that are going to be updated
    const variables = {
      externalId: story.externalId,
      url: values.url,
      title: values.title,
      excerpt: values.excerpt,
      publisher: values.publisher,
      // NB: not updating the image here. Uploads are handled separately
      imageUrl: story.imageUrl,
      authors,
      fromPartner: values.fromPartner,
    };

    // Run the mutation
    runMutation(
      updateStory,
      { variables },
      'Story updated successfully',
      () => {
        toggleEditForm();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch
    );
  };

  // prepare the "update story image url" mutation
  const [updateStoryImageUrl] = useUpdateCollectionStoryImageUrlMutation();

  /**
   * Save the S3 URL we get back from the API to the collection story record
   */
  const handleImageUploadSave = (url: string): void => {
    runMutation(
      updateStoryImageUrl,
      {
        variables: {
          externalId: story.externalId,
          imageUrl: url,
        },
      },
      'Image saved successfully'
    );
  };

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
            <StoryCard story={story} />
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
                editMode={true}
                onCancel={toggleEditForm}
                onSubmit={onUpdate}
                showFromPartner={showFromPartner}
              />
            </Box>
          </Paper>
        </Collapse>
      </Card>
    </>
  );
};
