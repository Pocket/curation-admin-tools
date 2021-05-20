import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Collapse,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  CollectionForm,
  CollectionInfo,
  HandleApiResponse,
  ImageUpload,
  ScrollToTop,
  StoryForm,
  StoryListCard,
} from '../../components';
import {
  CollectionModel,
  StoryModel,
  useGetAuthorsQuery,
  useGetCollectionByExternalIdQuery,
  useGetCollectionStoriesQuery,
  useUpdateCollectionMutation,
  useCreateCollectionStoryMutation,
  useImageUploadMutation,
  useUpdateCollectionStorySortOrderMutation,
} from '../../api';
import { useNotifications } from '../../hooks/useNotifications';
import { FormikValues } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import {
  GetCollectionByExternalIdDocument,
  GetCollectionStoriesDocument,
} from '../../api/generatedTypes';
import { transformAuthors } from '../../utils/transformAuthors';

interface CollectionPageProps {
  collection?: CollectionModel;
}

export const CollectionPage = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // prepare the "update collection" mutation
  // has to be done at the top level of the component because it's a hook
  const [updateCollection] = useUpdateCollectionMutation();

  // prepare the "create story" mutation
  const [createStory] = useCreateCollectionStoryMutation();

  // prepare the "update story sort order" mutation
  const [updateStorySortOrder] = useUpdateCollectionStorySortOrderMutation();

  // prepare the upload to S3 mutation
  const [uploadImage] = useImageUploadMutation();

  /**
   * If a Collection object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<CollectionPageProps>();

  const [collection, setCollection] = useState<CollectionModel | undefined>(
    location.state?.collection
      ? // Deep clone a read-only object that comes from the routing
        JSON.parse(JSON.stringify(location.state?.collection))
      : undefined
  );

  /**
   * If the user came directly to this page (i.e., via a bookmarked page),
   * fetch the Collection info from the the API.
   */
  const params = useParams<{ id: string }>();
  const { loading, error, data } = useGetCollectionByExternalIdQuery({
    variables: {
      externalId: params.id,
    },
    // Skip query if collection object was delivered via the routing
    // This is needed because hooks can only be called at the top level
    // of the component.
    skip: typeof collection === 'object',
  });

  if (data) {
    //Collection is a read only object when returned from Apollo, if we want to
    // update it we have to stringify and then parse it
    setCollection(JSON.parse(JSON.stringify(data.getCollection)));
  }

  // Load authors for the dropdown in the edit form
  const {
    loading: authorsLoading,
    error: authorsError,
    data: authorsData,
  } = useGetAuthorsQuery();

  // Load collection stories - deliberately in a separate query
  const {
    loading: storiesLoading,
    error: storiesError,
    data: storiesData,
  } = useGetCollectionStoriesQuery({
    variables: {
      id: params.id,
    },
  });

  // Let's keep stories in state to be able to reorder them with drag'n'drop
  const [stories, setStories] = useState<StoryModel[] | undefined>(undefined);
  // And update the state variable when data is loaded
  useEffect(() => {
    setStories(storiesData?.getCollection?.stories);
  }, [storiesData]);

  // for adding new stories, keep track of what the next story order value should be
  const [storySortOrder, setStorySortOrder] = useState<number>(1);
  useEffect(() => {
    if (stories && stories.length > 0) {
      const lastStorySortOrder = stories[stories.length - 1].sortOrder ?? 0;
      setStorySortOrder(lastStorySortOrder + 1);
    }
  }, [stories]);

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  /**
   * Collect "edit collection" form data and send it to the API.
   * Update components on page if updates have been saved successfully
   */
  const handleSubmit = (values: FormikValues): void => {
    updateCollection({
      variables: {
        externalId: collection!.externalId,
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        intro: values.intro,
        status: values.status,
        authorExternalId: values.authorExternalId,
      },
      refetchQueries: [
        {
          query: GetCollectionByExternalIdDocument,
          variables: {
            externalId: collection!.externalId,
          },
        },
      ],
    })
      .then(({ data }) => {
        showNotification('Collection updated successfully!', 'success');

        if (collection) {
          collection.title = data?.updateCollection?.title!;
          collection.slug = data?.updateCollection?.slug!;
          collection.excerpt = data?.updateCollection?.excerpt;
          collection.intro = data?.updateCollection?.intro;
          collection.status = data?.updateCollection?.status!;
          collection.authors = data?.updateCollection?.authors!;
          toggleEditForm();
        }
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
      });
  };

  /**
   * Save the S3 URL we get back from the API to the collection record
   */
  const handleImageUploadSave = (url: string): void => {
    updateCollection({
      variables: {
        // We keep most things as they are
        externalId: collection!.externalId,
        title: collection!.title,
        slug: collection!.slug,
        excerpt: collection!.excerpt,
        status: collection!.status,
        // This is the only (?) piece of the backend part of the frontend code
        // that is not ready for multiple authors
        authorExternalId: collection!.authors[0].externalId,

        // This is the only field that needs updating
        imageUrl: url,
      },
      refetchQueries: [
        {
          query: GetCollectionByExternalIdDocument,
          variables: {
            externalId: collection!.externalId,
          },
        },
      ],
    })
      .then(({ data }) => {
        if (collection) {
          collection.imageUrl = data?.updateCollection?.imageUrl!;
          showNotification(
            `Image saved to "${collection.title.substring(0, 50)}..."`,
            'success'
          );
        }
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
      });
  };

  // make sure we regenerate the 'Add Story' form each time a new story
  // has been added
  const [addStoryFormKey, setAddStoryFormKey] = useState(1);

  /**
   * Save a new story - a multi-step process
   * @param values
   */
  const handleCreateStorySubmit = (values: FormikValues): void => {
    // If the parser returned an image, let's upload it to S3
    // First, side-step CORS issues that prevent us from downloading
    // the image directly from the publisher
    const parserImageUrl =
      'https://pocket-image-cache.com/x/filters:no_upscale():format(jpg)/' +
      encodeURIComponent(values.imageUrl);

    // Get the file
    fetch(parserImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Upload the file to S3
        uploadImage({
          variables: {
            image: blob,
            height: 0,
            width: 0,
            fileSizeBytes: blob.size,
          },
        })
          .then((data) => {
            if (data.data && data.data.collectionImageUpload) {
              showNotification('Image successfully uploaded to S3', 'success');

              // Prepare authors. They need to be an array of objects again
              const authors = transformAuthors(values.authors);

              // Save the new story with the S3 URL
              createStory({
                variables: {
                  collectionExternalId: params.id,
                  url: values.url,
                  title: values.title,
                  excerpt: values.excerpt,
                  publisher: values.publisher,
                  imageUrl: data.data.collectionImageUpload.url,
                  authors,
                  sortOrder: storySortOrder,
                },
                refetchQueries: [
                  {
                    query: GetCollectionStoriesDocument,
                    variables: {
                      id: params.id,
                    },
                  },
                ],
              })
                .then((data) => {
                  showNotification(
                    `Added "${data.data?.createCollectionStory?.title.substring(
                      0,
                      50
                    )}..."`,
                    'success'
                  );
                  setAddStoryFormKey(addStoryFormKey + 1);
                })
                .catch((error: Error) => {
                  showNotification(error.message, 'error');
                });
            }
          })
          .catch((error) => {
            showNotification(error.message, 'error');
          });
      });
  };

  // provide an empty story object for the 'Add story' form
  const emptyStory: StoryModel = {
    externalId: '',
    url: '',
    title: '',
    excerpt: null,
    authors: [
      {
        name: '',
        sortOrder: 0,
      },
    ],
    publisher: null,
    imageUrl: null,
    sortOrder: null,
  };

  /**
   * Save the new sort order of stories
   * @param result
   */
  const onDragEnd = (result: DropResult) => {
    // if a story was dragged out of the list, let it snap back to where it was
    // without an error in the console
    if (!result.destination) return;

    // save the new order of stories to state
    const reorderedStories = Array.from(stories!);
    const [story] = reorderedStories.splice(result.source.index, 1);
    reorderedStories.splice(result.destination.index, 0, story);
    setStories(reorderedStories);

    // save the new order of stories to the database
    reorderedStories.forEach((story: StoryModel, index: number) => {
      const newSortOrder = index + 1;

      // update each affected story with the new sort order
      if (story.sortOrder !== newSortOrder) {
        updateStorySortOrder({
          variables: {
            externalId: story.externalId,
            sortOrder: newSortOrder,
          },
        })
          .then(() => {
            showNotification(
              `Order updated for "${story.title.substring(0, 50)}..."`,
              'success'
            );
          })
          .catch((error: Error) => {
            showNotification(error.message, 'error');
          });
      }
    });
  };

  return (
    <>
      <ScrollToTop />
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {collection && (
        <>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <h1>
                {collection.title}
                <Typography variant="subtitle2" component="div">
                  Collection
                </Typography>
              </h1>
            </Box>
            <Box alignSelf="center">
              <Button color="primary" onClick={toggleEditForm}>
                <EditIcon />
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <ImageUpload
                entity={collection}
                placeholder="/placeholders/collection.svg"
                onImageSave={handleImageUploadSave}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <CollectionInfo collection={collection} />
            </Grid>
          </Grid>

          <Collapse in={showEditForm}>
            <Paper elevation={4}>
              <Box p={2} mt={3}>
                <Box mb={2}>
                  <h3>Edit Collection</h3>
                </Box>
                {!authorsData && (
                  <HandleApiResponse
                    loading={authorsLoading}
                    error={authorsError}
                  />
                )}

                {authorsData && authorsData.getCollectionAuthors && (
                  <CollectionForm
                    authors={authorsData.getCollectionAuthors.authors}
                    collection={collection}
                    onSubmit={handleSubmit}
                    editMode={true}
                  />
                )}
              </Box>
            </Paper>
          </Collapse>

          <Box mt={3}>
            <h2>Stories</h2>
            {!storiesData && (
              <HandleApiResponse
                loading={storiesLoading}
                error={storiesError}
              />
            )}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="characters">
                {(provided, snapshot) => (
                  <Typography
                    component="div"
                    className="characters"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {stories &&
                      stories.map((story: StoryModel, index: number) => {
                        return (
                          <Draggable
                            key={story.externalId}
                            draggableId={story.externalId}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <Typography
                                  component="div"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <StoryListCard
                                    key={story.externalId}
                                    story={story}
                                    collectionExternalId={
                                      collection!.externalId
                                    }
                                  />
                                </Typography>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </Typography>
                )}
              </Droppable>
            </DragDropContext>
          </Box>

          <Paper elevation={4}>
            <Box p={2} mt={3}>
              <Box mb={2}>
                <h3>Add Story</h3>
              </Box>
              <StoryForm
                key={addStoryFormKey}
                onSubmit={handleCreateStorySubmit}
                story={emptyStory}
              />
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};
