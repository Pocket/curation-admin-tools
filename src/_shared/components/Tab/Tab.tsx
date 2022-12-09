import React from 'react';
import {
  LinkProps,
  Tab as MuiTab,
  TabProps as MuiTabProps,
} from '@mui/material';
import { TabLink } from '../';

interface TabProps {
  /**
   * Optional number of articles in that tab
   */
  count?: number;

  /**
   * Tabs use a Link-based component for routing.
   */
  component?: LinkProps;

  /**
   * The TabLink component that is rendered inside the Tab
   * needs to know if the tab is selected but we can't use
   * the Tab.selected property as it won't be forwarded to the
   * TabLink component; a custom property is needed.
   */
  isCurrentTab?: boolean;

  /**
   * The route for the TabLink component.
   */
  to?: string;

  /**
   * Whether this tab has a clickable link to another page
   */
  hasLink?: boolean;
}

/**
 * A custom Tab component that uses TabLink (a customised Link
 * from react-router-dom) to display a tab with, optionally,
 * the number of items under that tab.
 */
export const Tab: React.FC<MuiTabProps & TabProps> = (props): JSX.Element => {
  const { count, label, value } = props;

  // Destructure `hasLink` property from ~280 others so that it doesn't get
  // passed down to the child component.
  // We use it here to set the link component if the tab needs a working link
  // with a route to elsewhere in the app
  const { hasLink, ...otherProps } = props;

  // Pass an additional `tabSelected` property to the TabLink component if needed
  //const tabLinkProps = hasLink ? { tabSelected } : {};
  // {...tabLinkProps}

  return (
    <MuiTab
      component={hasLink ? TabLink : undefined}
      count={count}
      label={label}
      value={value}
      sx={{
        textTransform: 'none',
        fontWeight: 400,
        fontSize: '1rem',
      }}
      {...otherProps}
    />
  );
};
