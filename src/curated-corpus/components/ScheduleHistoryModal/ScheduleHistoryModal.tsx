import React from 'react';
import {
  Avatar,
  Dialog,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardHeader,
  CardContent,
  SxProps,
} from '@mui/material';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import {
  getFormattedImageUrl,
  getCuratorNameFromLdap,
  getScheduledSurfaceName,
} from '../../helpers/helperFunctions';

import { curationPalette } from '../../../theme';

import { DateTime } from 'luxon';

interface ScheduleHistoryModalProps {
  item: ApprovedCorpusItem;

  isOpen: boolean;

  toggleModal: VoidFunction;
}

const cardSxCssStyles: SxProps = {
  width: '100%',
  borderRadius: '8px',
};

const cardHeaderSxCssStyles: SxProps = {
  display: 'flex',
  width: '100%',
  alignItems: 'start',
  backgroundColor: '#F9F9FB',
};

export const ScheduleHistoryModal: React.FC<ScheduleHistoryModalProps> = (
  props
): JSX.Element => {
  const { item, isOpen, toggleModal } = props;

  console.log(getFormattedImageUrl(item.imageUrl));
  //TODO look into image cache dimensions for avatar image
  const avatar = (
    <Avatar
      srcSet={getFormattedImageUrl(item.imageUrl)}
      variant="rounded"
      alt={item.title}
      sx={{ width: '200px', height: '150px' }}
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
            variant: 'h6',
            fontWeight: 'regular',
          }}
          subheader={item.title}
          subheaderTypographyProps={{
            variant: 'h5',
            fontWeight: '500',
            color: curationPalette.pocketBlack,
          }}
        />
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="medium"
            sx={{ marginLeft: '0.7rem' }}
          >
            Recently Scheduled
          </Typography>
          <List>
            {item.scheduledSurfaceHistory.map((history) => {
              return (
                <>
                  <ListItem key={history.externalId}>
                    <ListItemText
                      primary={getDisplayDate(history.scheduledDate)}
                    />

                    <ListItemText
                      primary={getCuratorNameFromLdap(history.createdBy)}
                    />

                    <ListItemText
                      primary={getScheduledSurfaceName(
                        history.scheduledSurfaceGuid
                      )}
                    />
                  </ListItem>
                  <Divider
                    variant="middle"
                    component="li"
                    sx={{ bgcolor: '#E0E0E6', height: 1.1 }}
                  />
                </>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Dialog>
  );
};
