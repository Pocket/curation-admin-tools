import React from 'react';
import { Grid, Container, AppBar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { curationPalette } from '../../theme';
import pocketLogo from '../../assets/PKTLogoRounded_RGB.png';
import pocketShield from '../../assets/pocket-shield.svg';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    padding: '0.5rem 0 0.25rem 0',
    backgroundColor: curationPalette.white,
    boxShadow: '0px 4px 10px rgba(148, 148, 148, 0.3)',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
    [theme.breakpoints.up('md')]: {
      padding: '0.75rem 0',
    },
  },
  logo: {
    width: '100px',
  },
  logoMobile: {
    width: '20px',
    paddingTop: '4px',
  },
}));

/**
 * Page header for all pages that authorised users see.
 */
export const Header: React.FC = (): JSX.Element => {
  const classes = useStyles();
  return (
    <>
      <AppBar className={classes.appBar} position="absolute">
        <Container maxWidth="md" disableGutters>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Hidden smDown implementation="css">
              <Grid item sm={2}>
                <Link to="/">
                  <img
                    className={classes.logo}
                    src={pocketLogo}
                    alt="Home Page"
                  />
                </Link>
              </Grid>
            </Hidden>

            <Hidden mdUp implementation="css">
              <Grid item xs={1}>
                <IconButton aria-label="menu">
                  <MenuIcon fontSize="large" />
                </IconButton>
              </Grid>
            </Hidden>
            <Hidden mdUp implementation="css">
              <Grid item xs={1}>
                <img
                  className={classes.logoMobile}
                  src={pocketShield}
                  alt="Pocket Logo"
                />
              </Grid>
            </Hidden>
            <Grid item xs={4} sm={3}></Grid>
          </Grid>
        </Container>
      </AppBar>
    </>
  );
};
