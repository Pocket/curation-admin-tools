import React, { useState } from 'react';
import { CustomTabType, TabPanel, TabSet } from '../';
import { Box, Link } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  /**
   * The form field displayed on the first tab
   */
  children: JSX.Element;

  /**
   * The height of the preview element in rem - so that the rest of the form
   * doesn't jump around too much.
   */
  minHeight: number;

  /**
   * The value of the form field - for rendering into markdown
   */
  source: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = (
  props
): JSX.Element => {
  const { children, minHeight, source } = props;

  // set the default tab
  const [value, setValue] = useState<string>('write');

  // switch to active tab when user clicks on tab heading
  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: string
  ): void => {
    setValue(newValue);
  };

  // Define the set of tabs that we're going to show on this page
  const tabs: CustomTabType[] = [
    {
      label: 'Write',
      pathname: 'write',
      hasLink: false,
    },
    {
      label: 'Preview',
      pathname: 'preview',
      hasLink: false,
    },
  ];

  return (
    <>
      <TabSet currentTab={value} handleChange={handleChange} tabs={tabs} />
      <TabPanel value={value} index="write">
        {children}
      </TabPanel>
      <TabPanel value={value} index="preview">
        <Box style={{ minHeight: `${minHeight}rem` }}>
          <ReactMarkdown>
            {source ? source : 'Nothing to preview'}
          </ReactMarkdown>
        </Box>
      </TabPanel>
      <Link
        href="https://getpocket.atlassian.net/wiki/spaces/PE/pages/2105606280/Pocket+Markdown"
        target="_blank"
        rel="noreferrer"
      >
        👉 Pocket Markdown reference
      </Link>
    </>
  );
};
