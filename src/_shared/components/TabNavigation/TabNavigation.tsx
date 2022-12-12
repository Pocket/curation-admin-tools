import React from 'react';
import { AppBar, Tabs, TabsProps as MuiTabsProps } from '@mui/material';
import { curationPalette } from '../../../theme';

interface TabsProps {
  /**
   * Event types in Material UI are quite inflexible for some components
   * and need to be overriden with event signatures we actually use.
   * @param event
   * @param value
   */
  onChange: (event: React.ChangeEvent<unknown>, value: string) => void;
}

/**
 * TabNavigation - a wrapper component for custom tabs (see Tab, TabLink, and TabPanel)
 * that are passed as children.
 */
export const TabNavigation: React.FC<
  Omit<MuiTabsProps, 'onChange'> & TabsProps
> = (props) => {
  const { value, onChange, children } = props;

  return (
    <AppBar
      color="default"
      position="static"
      sx={{
        backgroundColor: curationPalette.white,
        boxShadow: 'none',
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          boxShadow: '0px 2px 3px -3px black',
        }}
      >
        {children}
      </Tabs>
    </AppBar>
  );
};
