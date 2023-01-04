import React, { useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { curationPalette } from '../../../theme';
import { DropdownOption } from '../../helpers/definitions';

interface SplitButtonProps {
  /**
   * An optional icon to show alongside the chosen menu option.
   */
  icon?: JSX.Element;
  /**
   * Do some custom processing once a user selected a menu option
   *
   * @param option
   */
  onMenuOptionClick: (option: DropdownOption) => void;

  /**
   * A list of options to display in the dropdown.
   */
  options: DropdownOption[];

  /**
   * The approximate width of the button. "Small" is 4 rem and "Medium" is 9 rem.
   */
  size?: 'small' | 'medium';
}

/**
 * A fancy split button component that takes in a list of options and a function
 * to run when an option from the dropdown menu is chosen.
 *
 * Heavily inspired by the Split Button example in
 * https://v4.mui.com/components/button-group/#split-button
 * @constructor
 */
export const SplitButton: React.FC<SplitButtonProps> = (props) => {
  const { icon, onMenuOptionClick, options, size = 'medium' } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // If options have been updated, reset the selected value to the first one.
  useEffect(() => {
    setSelectedIndex(0);
  }, [options]);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
    code: string
  ) => {
    setSelectedIndex(index);
    setOpen(false);

    // Do custom processing in a function passed from the parent component.
    onMenuOptionClick(options[index]);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="text"
        ref={anchorRef}
        aria-label="split button"
        sx={{ color: curationPalette.pocketBlack }}
      >
        <Button
          sx={{
            color: curationPalette.pocketBlack,
            minWidth: size === 'small' ? '4rem' : '9rem',
          }}
        >
          {icon}{' '}
          {/* If the selected option no longer exists after the split button
           was reloaded with different data, show the default option instead
           as the button label */}
          {options[selectedIndex]
            ? options[selectedIndex].name
            : options[0].name}
        </Button>
        <Button
          sx={{ color: curationPalette.pocketBlack }}
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="dropdown options"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        sx={{ zIndex: 2 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.code}
                      selected={index === selectedIndex}
                      onClick={(event) =>
                        handleMenuItemClick(event, index, option.code)
                      }
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
