import React from 'react';
import { Typography } from '@material-ui/core';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { StoryListCard } from '../';
import { CollectionStory } from '../../api/collection-api/generatedTypes';

interface CollectionStoryListProps {
  /**
   * All the stories that belong to a collection
   */
  stories: CollectionStory[];

  /**
   *
   */
  showFromPartner: boolean;

  /**
   * A callback function that will run a mutation every time a story's order
   * in the list is updated
   * @param result
   */
  reorder: (result: DropResult) => void;

  /**
   * A special Apollo Client helper that fetches updated query results
   * from the API on demand - here we pass it on to StoryListCard
   * that runs it if a story is deleted.
   */
  refetch: () => void;
}

/**
 * This component displays a list of stories for a collection and allows users
 * to drag and drop stories to change the order they appear in the collection.
 *
 * @param props
 * @constructor
 */
export const ReorderableCollectionStoryList: React.FC<
  CollectionStoryListProps
> = (props): JSX.Element => {
  const { stories, showFromPartner, reorder, refetch } = props;

  return (
    <DragDropContext onDragEnd={reorder}>
      <Droppable droppableId="characters">
        {(provided) => (
          <Typography
            component="div"
            className="characters"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {stories.map((story: CollectionStory, index: number) => {
              return (
                <Draggable
                  key={story.externalId}
                  draggableId={story.externalId}
                  index={index}
                >
                  {(provided) => {
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
                          refetch={refetch}
                          showFromPartner={showFromPartner}
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
  );
};
