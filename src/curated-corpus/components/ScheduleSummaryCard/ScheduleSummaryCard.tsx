import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

export type ScheduleSummary = {
  name: string;
  count: number;
};

interface ScheduleSummaryCardProps {
  headingCopy: string;
  items: ScheduleSummary[];
}

/**
 * Display a summary of scheduled stories for a given grouping
 * (for example, topic or publisher).
 *
 * @param props
 * @constructor
 */
export const ScheduleSummaryCard: React.FC<ScheduleSummaryCardProps> = (
  props
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
                <React.Fragment key={item.name}>
                  <TableRow>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
