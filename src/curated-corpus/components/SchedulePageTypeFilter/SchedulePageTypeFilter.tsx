import React, { ReactElement } from 'react';
import { MenuItem } from '@mui/material';
import { Button } from '../../../_shared/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StyledMenu } from '../../../_shared/styled';
import {
  ScheduledCorpusItem,
  ScheduledItemSource,
} from '../../../api/generatedTypes';

interface SchedulePageTypeFilterProps {
  /**
   * Scheduled items for a given date - to summarise in the filters.
   */
  scheduledItems: ScheduledCorpusItem[];
}

/**
 * Display a summary of scheduled stories for a given grouping
 * (for example, topic or publisher).
 *
 * @param props
 * @constructor
 */
export const SchedulePageTypeFilter: React.FC<SchedulePageTypeFilterProps> = (
  props
): ReactElement => {
  const { scheduledItems } = props;

  const itemTypeList = scheduledItems.map((item: ScheduledCorpusItem) => {
    if (item.source == ScheduledItemSource.Ml) {
      return item.source;
    }
    if (item.approvedItem.isSyndicated) {
      return 'Syndicated';
    }
    if (item.approvedItem.isCollection) {
      return 'Collections';
    }
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
        id="types-filters-button"
        aria-controls={open ? 'types-filters-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Types 3
      </Button>

      <StyledMenu
        id="types-filters-menu"
        MenuListProps={{
          'aria-labelledby': 'types-filters-button',
        }}
        slotProps={{
          paper: {
            style: {
              maxHeight: 300,
              width: '20ch',
            },
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disableRipple>All {scheduledItems.length}</MenuItem>

        {itemTypeList.map((type) => {
          return (
            // <MenuItem disableRipple onClick={handleClose} key={type.name}>
            //   {type.name} {type.count}
            // </MenuItem>
            <MenuItem disableRipple onClick={handleClose} key={type}>
              {type}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </>
  );
};
