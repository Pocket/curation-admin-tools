import React, { useState } from 'react';
import { Button, Collapse } from '@mui/material';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { Collection } from '../../../api/generatedTypes';
import { StyledChipComponent } from '../../../_shared/styled';

interface ChipLabelsListProps {
  /**
   * An object with everything collection-related in it.
   * Except for stories.
   */
  collection: Omit<Collection, 'stories'>;
}

/**
 * A custom styled chip label list component to display labels and expand more/less button.
 *
 * @param props
 */
export const ChipLabelsList: React.FC<ChipLabelsListProps> = (props) => {
  const { collection } = props;

  // expand more/less button state
  const [expandButtonToggled, setExpandButtonToggle] = useState(true);

  // onMouseDown event is used when pressing the mouse button on the expand button.
  // this event is needed in order to fire logic as soon as the mouse is pressed, instead of waiting for the full click.
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // invert
    setExpandButtonToggle(!expandButtonToggled);
  };

  // onClick event fires after a full click on a button. This event is also needed
  // to prevent the clickable collection card component to fire its chain of reactions
  // having both onMouseDown & onClick events allows to control the button inside a clickable
  // component
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setExpandButtonToggle(expandButtonToggled);
  };

  return (
    <span>
      {/* display only the first two labels if label length > 2*/}
      {collection.labels &&
        collection.labels.length > 2 && [
          collection.labels.slice(0, 2).map((data) => {
            return (
              <span key={data?.externalId}>
                <StyledChipComponent
                  key={data?.externalId}
                  variant="outlined"
                  label={data?.name}
                  icon={<LabelOutlinedIcon />}
                />{' '}
              </span>
            );
          }),
          <Button
            key="expand-button"
            variant="text"
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            endIcon={expandButtonToggled ? <ExpandMore /> : <ExpandLess />}
          >
            {expandButtonToggled
              ? '+ ' + collection.labels.slice(2).length
              : ''}
          </Button>,
          <br key="brk-line1" />,
          <br key="brk-line2" />,
          <Collapse
            key="expand-labels"
            in={!expandButtonToggled}
            timeout="auto"
            unmountOnExit
          >
            {/* display the rest of the labels under the expand button*/}
            {collection.labels.slice(2).map((data) => {
              return (
                <span key={data?.externalId}>
                  <StyledChipComponent
                    key={data?.externalId}
                    variant="outlined"
                    label={data?.name}
                    icon={<LabelOutlinedIcon />}
                  />{' '}
                </span>
              );
            })}
          </Collapse>,
        ]}{' '}
      {/* display labels where length <= 2*/}
      {collection.labels &&
        collection.labels.length <= 2 &&
        collection.labels.map((data) => {
          return (
            <span key={data?.externalId}>
              <StyledChipComponent
                key={data?.externalId}
                variant="outlined"
                label={data?.name}
                icon={<LabelOutlinedIcon />}
              />{' '}
            </span>
          );
        })}
    </span>
  );
};
