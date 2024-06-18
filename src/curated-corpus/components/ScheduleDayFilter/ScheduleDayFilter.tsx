import React, { ReactElement } from 'react';
import { Button } from '../../../_shared/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { ScheduleDayFilterOptions, ScheduleSummary } from '../';
import { StyledMenu } from '../../../_shared/styled';
import { MenuItem } from '@mui/material';

interface ScheduleDayFilterProps {
  /**
   * Options to show in the filter dropdown.
   */
  filterData: ScheduleSummary[];

  /**
   * The copy to show on the filter button, e.g. "Topics" or "Publishers"
   */
  filterName: string;

  /**
   * For the "All items" option (default): how many items there are.
   */
  itemCount: number;

  /**
   * Callback to set filters on the Schedule Page
   */
  setFilters: React.Dispatch<React.SetStateAction<ScheduleDayFilterOptions>>;
}

/**
 * Display a dropdown menu with a summary of how many stories are available
 * for each of the filter options. Allow users to interact with the menu;
 * highlight the chosen option and send it up to the parent component to apply
 * the filters.
 *
 * @param props
 * @constructor
 */
export const ScheduleDayFilter: React.FC<ScheduleDayFilterProps> = (
  props,
): ReactElement => {
  const { filterData, filterName, itemCount, setFilters } = props;

  // State management for the dropdown menu options
  // (lifted from the docs: https://mui.com/material-ui/react-menu/)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    value: string,
  ) => {
    setSelectedIndex(index);
    setFilters((filters: any) => {
      // Reset each filter to 'All' before applying the current filter
      for (const prop in filters) {
        filters[prop] = 'All';
      }

      // Apply the current filter
      return { ...filters, [filterName]: value };
    });

    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
        id={`${filterName}-filters-button`}
        aria-controls={open ? `${filterName}-filters-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ textTransform: 'capitalize' }}
      >
        {filterName} {filterData.length}
      </Button>

      <StyledMenu
        id={`${filterName}-filters-menu`}
        MenuListProps={{
          'aria-labelledby': `${filterName}-filters-button`,
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
        <MenuItem
          disableRipple
          selected={-1 === selectedIndex}
          onClick={(event) => handleMenuItemClick(event, -1, 'All')}
        >
          All {itemCount}
        </MenuItem>

        {filterData.map((filter, index) => {
          return (
            <MenuItem
              disabled={filter.count < 1}
              disableRipple
              key={filter.name}
              selected={index === selectedIndex}
              onClick={(event) =>
                handleMenuItemClick(event, index, filter.name)
              }
            >
              {/* Capitalise the ML filter only - as we filter by an object property (string),
              we need to keep the type name ("Ml") as it comes from the graph everywhere else */}
              {filter.name === 'Ml' ? 'ML' : filter.name} {filter.count}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </>
  );
};
