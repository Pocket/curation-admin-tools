import React from 'react';
import { Box, Card, CardContent, Link, Typography } from '@mui/material';

import { ShareableListModal } from '../../components';
import { Button } from '../../../_shared/components';
import { useToggle } from '../../../_shared/hooks';
import { ShareableListComplete } from '../../../api/generatedTypes';
import { curationPalette } from '../../../theme';

interface ShareableListCardProps {
  /**
   * An object with everything rejected curated item-related in it.
   */
  list: ShareableListComplete;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;
}

export const ShareableListCard: React.FC<ShareableListCardProps> = (
  props
): JSX.Element => {
  const { list, refetch } = props;
  const [shareableListModalOpen, toggleShareableListModal] = useToggle(false);

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
          variant="h3"
          align="left"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          <Link
            href={`https://getpocket.com/sharedlists/${list.externalId}/${list.slug}/`}
            target="_blank"
            sx={{
              textDecoration: 'none',
              color: curationPalette.pocketBlack,
            }}
          >
            {list.title}
          </Link>
        </Typography>
        <Box display="flex">
          <ShareableListModal
            isOpen={shareableListModalOpen}
            toggleModal={toggleShareableListModal}
            modalTitle="Moderate List"
            refetch={refetch}
            shareableList={list}
            runModerateShareableListMutation={true} // this modal is in charge of moderating a list, so passing flag
          />
          <Button
            buttonType="positive"
            variant="text"
            onClick={toggleShareableListModal}
          >
            Moderate List
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
