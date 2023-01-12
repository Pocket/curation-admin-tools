import React from 'react';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import {
  CardMedia,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { getDisplayTopic } from '../../helpers/topics';

interface ApprovedItemInfoProps {
  /**
   * The Approved Corpus Item
   */
  item: ApprovedCorpusItem;
}

/**
 * This component shows most of the data available for a curated corpus item.
 * For use on the Curated Item page.
 *
 * @param props
 * @constructor
 */
export const ApprovedItemInfo: React.FC<ApprovedItemInfoProps> = (
  props
): JSX.Element => {
  const { item } = props;

  // prefixing the item's imageUrl with the pocket-image-cache url to format it to a size of 600x300
  const formattedImageUrl =
    `https://pocket-image-cache.com/600x300/filters:format(jpg):extract_focal()/`.concat(
      encodeURIComponent(item.imageUrl)
    );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  <h3>URL</h3>
                </TableCell>
                <TableCell align="left">
                  <Typography component="span" align="left">
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.url}
                    </a>
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  <h3>Publisher</h3>
                </TableCell>
                <TableCell align="left">
                  <Typography>{item.publisher}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  <h3>Authors</h3>
                </TableCell>
                <TableCell align="left">
                  <Typography>{flattenAuthors(item.authors)}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  <h3>Excerpt</h3>
                </TableCell>
                <TableCell align="left">
                  <Typography>{item.excerpt}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  <h3>Topic</h3>
                </TableCell>
                <TableCell align="left">
                  <Typography>{getDisplayTopic(item.topic)}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  <h3>Language</h3>
                </TableCell>
                <TableCell align="left">
                  <Typography>{item.language}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  <h3>Details</h3>
                </TableCell>
                <TableCell align="left">
                  <Typography>
                    {item.isTimeSensitive ? 'Time-sensitive' : null}
                  </Typography>{' '}
                  <Typography>
                    {item.isCollection ? 'Collection' : null}
                  </Typography>{' '}
                  <Typography>
                    {item.isSyndicated ? 'Syndicated' : null}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sm={4}>
        <CardMedia component="img" src={formattedImageUrl} alt={item.title} />
      </Grid>
    </Grid>
  );
};
