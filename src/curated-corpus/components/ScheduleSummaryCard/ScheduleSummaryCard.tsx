import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export type StoriesSummary = {
  /**
   * The name of the line item in the table to be displayed.
   * Example: topic.
   */
  name: string;

  /**
   * The number associated with the line item.
   * Example: number of stories for a given topic.
   */
  count: number;
};

interface ScheduleSummaryCardProps {
  /**
   * Words that go into the header on top of the table.
   */
  headingCopy: string;

  /**
   * List of items to display in table format.
   */
  items: StoriesSummary[];
}

/**
 * Display a summary of scheduled stories for a given grouping
 * (for example, topic or publisher).
 *
 * @param props
 * @constructor
 */
export const ScheduleSummaryCard: React.FC<ScheduleSummaryCardProps> = (
  props,
): JSX.Element => {
  const { headingCopy, items } = props;

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{headingCopy}</TableCell>
              <TableCell align="right">#</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              return (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    {item.count > 0 ? item.count : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
