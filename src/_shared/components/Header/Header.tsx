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
                        src={mozillaLogo}
                        alt="Home Page"
                        style={{
                          width: '100px',
                          paddingRight: '0.5rem',
                          marginTop: '0.25rem',
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
                    sx={
                      /* Override Typography styles here as otherwise they don't
                     take effect in the styled component - my guess is the variant
                      applied takes precedence over styles in the `styled` component */
                      {
                        fontWeight: 500,
                      }
                    }
                  >
                    <StyledProductHeadingLink to={productLink}>
                      {productName}
                    </StyledProductHeadingLink>
                  </StyledProductHeading>
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
                  <Grid
                    item
                    sm={12}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <List
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: 0,
                        flexWrap: 'nowrap', // Prevents wrapping
                        justifyContent: 'flex-end', // Keeps alignment the same
                      }}
                    >
                      {menuLinks.map((link: MenuLink) => (
                        <ListItem
                          component={StyledAppBarLink}
                          to={link.url}
                          key={link.url}
                          sx={{
                            padding: '0 0.75rem',
                            minWidth: 'auto',
                          }}
                        >
                          <ListItemText primary={link.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Hidden>

                {hasUser && parsedIdToken && (
                  <Grid item sm={1}>
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
