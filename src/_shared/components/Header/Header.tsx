import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Container,
  Drawer,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import pocketLogo from '../../assets/PKTLogoRounded_RGB.png';
import pocketShield from '../../assets/pocket-shield.svg';
import { useStyles } from './Header.styles';
import { IDToken } from '../../hooks';

export interface MenuLink {
  text: string;
  url: string;
}

interface HeaderProps {
  /**
   * Whether there is a valid logged-in user
   */
  hasUser: boolean;

  /**
   * A list of links that appear in the mobile Drawer menu
   */
  menuLinks: MenuLink[];

  /**
   * The logged-in user info we have available
   */
  parsedIdToken: IDToken | null;

  /**
   * The URL path of the Admin UI, e.g. `/curated-corpus`
   */
  productLink: string;

  /**
   * The name of the Admin UI, i.e. 'Collections'
   */
  productName: string;
}

/**
 * Page header for all pages that authorised users see.
 */
export const Header: React.FC<HeaderProps> = (props): JSX.Element => {
  const classes = useStyles();
  const { hasUser, parsedIdToken, productName, productLink, menuLinks } = props;

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar className={classes.appBar} position="absolute">
        <Container maxWidth="lg" disableGutters>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Hidden smDown implementation="css">
                  <Grid item sm={4}>
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
                    <IconButton aria-label="menu" onClick={handleDrawerOpen}>
                      <MenuIcon fontSize="large" />
                    </IconButton>
                    <Drawer
                      className={classes.drawer}
                      anchor="left"
                      open={open}
                      variant="temporary"
                      classes={{
                        paper: classes.drawerPaper,
                      }}
                    >
                      <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <List className={classes.menuList}>
                        {menuLinks.map((link: MenuLink) => {
                          return (
                            <ListItem
                              className={classes.menuLink}
                              button
                              component={Link}
                              to={link.url}
                              key={link.url}
                              onClick={handleDrawerClose}
                            >
                              <ListItemText primary={link.text} />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Drawer>
                  </Grid>
                </Hidden>
                <Hidden mdUp implementation="css">
                  <Grid item xs={1}>
                    <Link to="/">
                      <img
                        className={classes.logoMobile}
                        src={pocketShield}
                        alt="Pocket Logo"
                      />
                    </Link>
                  </Grid>
                </Hidden>

                <Grid item xs={8} sm={6}>
                  <h1 className={classes.product}>
                    <Link to={productLink} className={classes.productLink}>
                      {productName}
                    </Link>
                  </h1>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Hidden smDown implementation="css">
                  <Grid item sm={8}>
                    <List className={classes.appBarList}>
                      {menuLinks.map((link: MenuLink) => {
                        return (
                          <ListItem
                            className={classes.appBarLink}
                            button
                            component={Link}
                            to={link.url}
                            key={link.url}
                          >
                            <ListItemText primary={link.text} />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                </Hidden>

                {hasUser && parsedIdToken && (
                  <Grid item sm={1}>
                    <Avatar
                      alt={parsedIdToken.name}
                      src={parsedIdToken.picture}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </AppBar>
    </>
  );
};
