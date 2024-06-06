import React from 'react';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { SxProps } from '@mui/system';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import {
  getCuratorNameFromLdap,
  getFormattedImageUrl,
  getScheduledSurfaceName,
} from '../../helpers/helperFunctions';

import { curationPalette } from '../../../theme';

import { DateTime } from 'luxon';

interface ScheduleHistoryModalProps {
  /**
   * An approved corpus item object
   */
  item: ApprovedCorpusItem;

  /**
   * Boolean flag to open or close this modal
   */
  isOpen: boolean;

  /**
   * Callback to toggle this modal on or off
   */
  toggleModal: VoidFunction;
}

const cardSxCssStyles: SxProps = {
  maxWidth: '100%',
  borderRadius: '8px',
};

const cardHeaderSxCssStyles: SxProps = {
  display: 'flex',
  alignItems: 'start',
  maxWidth: '100%',
  height: '20%',
  backgroundColor: '#F9F9FB',
};

export const ScheduleHistoryModal: React.FC<ScheduleHistoryModalProps> = (
  props,
): JSX.Element => {
  const { item, isOpen, toggleModal } = props;

  const avatar = (
    <Avatar
      srcSet={getFormattedImageUrl(item.imageUrl)}
      variant="rounded"
      alt={item.title}
      sx={{ width: '200px', height: '100%' }}
    />
  );

  const getDisplayDate = (date: string) => {
    return DateTime.fromFormat(date, 'yyyy-MM-dd')
      .setLocale('en')
      .toLocaleString(DateTime.DATE_FULL);
  };

  return (
    <Dialog open={isOpen} onClose={toggleModal} fullWidth={true} maxWidth="md">
      <Card sx={cardSxCssStyles}>
        <CardHeader
          sx={cardHeaderSxCssStyles}
          avatar={avatar}
          title={item.publisher}
          titleTypographyProps={{
            variant: 'subtitle2',
            fontWeight: 'regular',
          }}
          subheader={item.title}
          subheaderTypographyProps={{
            variant: 'h6',
            fontWeight: '500',
            color: curationPalette.pocketBlack,
          }}
        />
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="medium"
            sx={{ marginLeft: '0.7rem' }}
          >
            Recently Scheduled
          </Typography>
          <List>
            {item.scheduledSurfaceHistory.map((history) => {
              return (
                <>
                  <ListItem
                    key={history.externalId}
                    alignItems="flex-start"
                    sx={{ justifyContent: 'space-between' }}
                  >
                    <ListItemText
                      primary={getDisplayDate(history.scheduledDate)}
                      primaryTypographyProps={{ fontWeight: '500' }}
                      sx={{ width: '30%' }}
                    />

                    <ListItemText
                      primary={getCuratorNameFromLdap(history.createdBy)}
                      sx={{ width: '30%' }}
                    />

                    <ListItemText
                      primary={getScheduledSurfaceName(
                        history.scheduledSurfaceGuid,
                      )}
                      sx={{ width: '30%' }}
                    />
                  </ListItem>
                  <Divider variant="middle" sx={{ bgcolor: '#E0E0E6' }} />
                </>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Dialog>
  );
};
