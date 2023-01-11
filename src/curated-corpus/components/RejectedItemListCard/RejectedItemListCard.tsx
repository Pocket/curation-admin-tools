import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FaceIcon from '@mui/icons-material/Face';
import CategoryIcon from '@mui/icons-material/Category';

import { RejectedCorpusItem } from '../../../api/generatedTypes';
import { curationPalette } from '../../../theme';

interface RejectedItemListCardProps {
  /**
   * An object with everything rejected curated item-related in it.
   */
  item: RejectedCorpusItem;
}

export const RejectedItemListCard: React.FC<RejectedItemListCardProps> = (
  props
): JSX.Element => {
  const { item } = props;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          padding: '0.5rem',
        }}
      >
        <Typography
          gutterBottom
          sx={{
            fontSize: '0.875rem',
            color: curationPalette.neutral,
          }}
        >
          {item.publisher ?? 'N/A'}
        </Typography>
        <Typography
          variant="h3"
          align="left"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          <Link
            href={item.url}
            target="_blank"
            sx={{
              textDecoration: 'none',
              color: curationPalette.pocketBlack,
            }}
          >
            {item.title ?? 'N/A'}
          </Link>
        </Typography>
      </CardContent>

      {/* Push the rest of the elements to the bottom of the card. */}
      <Box sx={{ flexGrow: 1 }} />

      <List dense>
        <ListItem>
          <ListItemIcon
            sx={{
              minWidth: '2rem',
            }}
          >
            <ThumbDownIcon />
          </ListItemIcon>
          <ListItemText
            primary={item.reason}
            sx={{
              textTransform: 'capitalize',
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon
            sx={{
              minWidth: '2rem',
            }}
          >
            <FaceIcon />
          </ListItemIcon>
          <ListItemText
            primary={item.createdBy}
            sx={{
              textTransform: 'capitalize',
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon
            sx={{
              minWidth: '2rem',
            }}
          >
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText
            primary={item.topic ?? 'N/A'}
            sx={{
              textTransform: 'capitalize',
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon
            sx={{
              minWidth: '2rem',
            }}
          >
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            primary={item.language ? item.language.toUpperCase() : 'N/A'}
          />
        </ListItem>
      </List>
    </Card>
  );
};
