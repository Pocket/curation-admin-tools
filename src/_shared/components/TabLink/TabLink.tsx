import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { Chip } from '../../components';
import { curationPalette } from '../../../theme';

interface TabLinkProps {
  /**
   * Optional number of articles loaded on the tab.
   */
  count?: number;

  /**
   * Whether the current tab is active.
   */
  isCurrentTab: boolean;
}

/**
 * Used for routing between various subpages available as tabs, i.e.
 * Prospects/Snoozed/Approved/Rejected. Optionally shows a Chip with
 * the number of articles available on that tab.
 */
// eslint-disable-next-line react/display-name
export const TabLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & TabLinkProps
>((props, ref): JSX.Element => {
  const { count, children, isCurrentTab, ...otherProps } = props;
  const showChip = !!(count && count > 0);

  // workaround to make sure the chip on the active tab is highlighted.
  const color = isCurrentTab ? 'primary' : 'default';

  // don't show the exact number of articles if there is more
  // than a thousand of entries
  const chipLabel = count && count > 999 ? '999+' : count;

  return (
    <Link {...otherProps} ref={ref}>
      <Box>
        {children}
        <Chip
          label={
            showChip ? (
              chipLabel
            ) : (
              <CircularProgress
                size={14}
                sx={{
                  color: curationPalette.white,
                }}
              />
            )
          }
          size="small"
          color={color}
        />
      </Box>
    </Link>
  );
});
