import React from 'react';
import { Tab, TabNavigation } from '../';

/**
 * Appending 'Type' to the name of this interface so that it's not confused with any
 * tab-related components elsewhere in the repository.
 */
export interface CustomTabType {
  /**
   * The name of the tab, i.e. "Approved".
   */
  label: string;

  /**
   * The number of items on this tab - fetched from the API, hence undefined initially.
   */
  count?: number;

  /**
   * The path for the tab link, i.e. "/prospects/approved/".
   */
  pathname: string;

  /**
   * Whether this tab needs a link at all
   */
  hasLink?: boolean;
}

interface TabSetProps {
  /**
   * The tab to be highlighted as active.
   */
  currentTab: string;

  /**
   * This function handles switching from tab to tab. It needs to be lifted up
   * to the parent component that uses it since it is needed both here and in
   * TabPanel components used to display the data underneath each tab.
   */
  handleChange: (
    event: React.ChangeEvent<unknown>,
    newCurrentTab: string,
  ) => void;

  /**
   * The list of tabs to display on the page.
   */
  tabs: CustomTabType[];
}

/**
 * This component produces a ready-to-use set of tabs with links and pills indicating
 * the number of items accessible under each tab.
 */
export const TabSet: React.FC<TabSetProps> = (props): JSX.Element => {
  const { currentTab, handleChange, tabs } = props;

  return (
    <TabNavigation value={currentTab} onChange={handleChange}>
      {tabs.map((tab: CustomTabType) => {
        return (
          <Tab
            key={tab.pathname}
            count={tab.count}
            hasLink={tab.hasLink}
            label={tab.label}
            to={tab.pathname}
            value={tab.pathname}
            isCurrentTab={currentTab == tab.pathname}
          />
        );
      })}
    </TabNavigation>
  );
};
