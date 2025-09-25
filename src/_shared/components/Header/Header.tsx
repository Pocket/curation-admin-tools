import React, { useState } from 'react';
import {
  Avatar,
  Container,
  Drawer,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import mozillaLogo from '../../assets/mozilla-logo-bw-rgb.png';
import mozillaIcon from '../../assets/mozilla-icon-bw-rgb.svg';
import { IDToken } from '../../hooks';
import { curationPalette } from '../../../theme';
import {
  StyledAppBar,
  StyledAppBarLink,
  StyledDrawerHeader,
  StyledProductHeading,
  StyledProductHeadingLink,
} from '../../styled';
import { config } from '../../../config';

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
   * What to do when the user clicks the "Log out" button
   */
  onLogout: VoidFunction;

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
  const {
    hasUser,
    onLogout,
    menuLinks,
    parsedIdToken,
    productName,
    productLink,
  } = props;

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [userMenuEl, setUserMenuEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuEl(event.currentTarget);
  };

  const handleClose = () => {
    setUserMenuEl(null);
  };

  return (
    <>
      <StyledAppBar
        position="absolute"
        sx={
          // Turn the header colour brick red in development environments.
          // Apply here as this property won't be overwritten in the styled component.
          {
            backgroundColor: config.isProduction
              ? curationPalette.white
              : curationPalette.secondary,
          }
        }
      >
        <Container maxWidth="lg" disableGutters>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ minHeight: '48px' }}
          >
            <Grid item xs={5}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                sx={{ height: '100%' }}
              >
                <Hidden smDown implementation="css">
                  <Grid item sm={4}>
                    <Link to="/">
                      <img
                        src={mozillaLogo}
                        alt="Home Page"
                        style={{
                          width: '100px',
                          paddingRight: '0.5rem',
                          display: 'block',
                        }}
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
                      anchor="left"
                      open={open}
                      variant="temporary"
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      <StyledDrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                          <CloseIcon />
                        </IconButton>
                      </StyledDrawerHeader>
                      <List
                        sx={{
                          padding: '0.5rem 1rem',
                        }}
                      >
                        {menuLinks.map((link: MenuLink) => {
                          return (
                            <ListItem
                              component={Link}
                              to={link.url}
                              key={link.url}
                              onClick={handleDrawerClose}
                              sx={{
                                borderBottom: `1px solid ${curationPalette.lightGrey}`,
                                color: curationPalette.pocketBlack,
                              }}
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
                        src={mozillaIcon}
                        alt="Mozilla Logo"
                        style={{
                          width: '2rem',
                          paddingTop: '0.375rem',
                        }}
                      />
                    </Link>
                  </Grid>
                </Hidden>

                <Grid item xs={6} sm={6}>
                  <StyledProductHeading
                    variant="h5"
                    sx={{
                      fontWeight: 500,
                      margin: '0 !important',
                      marginTop: '0 !important',
                      marginBottom: '0 !important',
                      display: 'flex',
                      alignItems: 'center',
                      height: 'auto',
                      lineHeight: 1,
                    }}
                  >
                    <StyledProductHeadingLink to={productLink}>
                      {productName}
                    </StyledProductHeadingLink>
                  </StyledProductHeading>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={7}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                sx={{ height: '100%' }}
              >
                <Hidden smDown implementation="css">
                  <Grid
                    item
                    sm={10}
                    md={11}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      paddingLeft: '7px',
                    }}
                  >
                    {menuLinks.map((link: MenuLink) => (
                      <StyledAppBarLink
                        to={link.url}
                        key={link.url}
                        style={{
                          padding: '10px 8px',
                          whiteSpace: 'nowrap',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          display: 'inline-block',
                          lineHeight: 'normal',
                        }}
                      >
                        {link.text}
                      </StyledAppBarLink>
                    ))}
                  </Grid>
                </Hidden>

                {hasUser && parsedIdToken && (
                  <Grid
                    item
                    sm={2}
                    md={1}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <IconButton
                      aria-controls="user-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <Avatar
                        alt={parsedIdToken.name}
                        src={parsedIdToken.picture}
                      />
                    </IconButton>
                    <Menu
                      id="user-menu"
                      anchorEl={userMenuEl}
                      keepMounted
                      open={Boolean(userMenuEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={onLogout}>Log Out</MenuItem>
                    </Menu>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </StyledAppBar>
    </>
  );
};
