import React, { ReactElement, useState } from 'react';
import { Button } from '../../../_shared/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ScheduleDayFilterOptions, StoriesSummary } from '../';
import { ProspectFilterOptions } from '../ProspectFilters/ProspectFilters';
import { StyledMenu } from '../../../_shared/styled';
import { MenuItem } from '@mui/material';

interface DropDownFilterProps {
  /**
   * Options to show in the filter dropdown.
   */
  filterData: StoriesSummary[];
  /**
   * The copy to show on the filter button, e.g. "Topics" or "Publishers"
   */
  filterName: string;
  /**
   * For the "All items" option (default): how many items there are.
   */
  itemCount: number;
  /**
   * Callback to set filters on the Schedule Page or Prospecting Page
   */
  setFilters: React.Dispatch<
    React.SetStateAction<ScheduleDayFilterOptions | ProspectFilterOptions>
  >;
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
export const DropDownFilter: React.FC<DropDownFilterProps> = (
  props,
): ReactElement => {
  const { filterData, filterName, itemCount, setFilters } = props;

  // State management for the dropdown menu options
  // (lifted from the docs: https://mui.com/material-ui/react-menu/)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [, setSelectedOption] = useState<string>('All');
  const open = Boolean(anchorEl);

  // Function to get the total number of available filter options (don't include filters with 0 data points)
  const getAvailableFilterCount = () => {
    return filterData.filter((filter) => filter.count > 0).length;
  };

  const availableFilterCount = getAvailableFilterCount();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    value: string,
  ) => {
    setSelectedIndex(index);
    setSelectedOption(value);

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
        {/* Display filter name and count */}
        {filterName} {availableFilterCount}
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
          selected={selectedIndex === -1}
          onClick={(event) => handleMenuItemClick(event, -1, 'All')}
        >
          All {itemCount}
        </MenuItem>

        {filterData.map((filter, index) => (
          <MenuItem
            disabled={filter.count < 1}
            disableRipple
            key={filter.name}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index, filter.name)}
          >
            {/* Capitalise the ML filter only - as we filter by an object property (string),
              we need to keep the type name ("Ml") as it comes from the graph everywhere else */}
            {filter.name === 'Ml' ? 'ML' : filter.name} {filter.count}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};
