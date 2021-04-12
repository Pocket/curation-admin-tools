import React from 'react';
import { Grid, Container, AppBar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import pocketLogo from '../../assets/PKTLogoRounded_RGB.png';
import pocketShield from '../../assets/pocket-shield.svg';
import { useStyles } from './Header.styles';

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
