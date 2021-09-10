import React from 'react';
import { Container } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  mainContent: {
    maxWidth: 1000,
    marginTop: '7.5rem',
    [theme.breakpoints.down('sm')]: {
      marginTop: '5.5rem',
    },
  },
}));

interface MainContentWrapperProps {
  /**
   * Any content that needs to be wrapped
   */
  children: JSX.Element | JSX.Element[];
}

/**
 * Wraps any children passed to it into a fixed width, centered container
 *
 * @param props: MainContentWrapperProps
 * @returns JSX.Element Wrapped content
 */
export const MainContentWrapper: React.FC<MainContentWrapperProps> = (
  props
): JSX.Element => {
  const classes = useStyles();

  return (
    <Container className={classes.mainContent}>{props.children}</Container>
  );
};
