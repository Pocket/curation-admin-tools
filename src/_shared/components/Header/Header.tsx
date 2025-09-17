import React from 'react';
import { Avatar, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import mozillaLogoFallback from '../../assets/mozilla-logo-bw-rgb.png';
import { IDToken } from '../../hooks';
import { StyledAppBar } from '../../styled';

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
  const { hasUser, onLogout, menuLinks, parsedIdToken, productName } = props;
  const location = useLocation();

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
        sx={{
          backgroundColor: '#B24000',
          boxShadow: '0px 4px 10px rgba(148, 148, 148, 0.3)',
          borderBottom: 'none',
          padding: '0.75rem 0',
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexFlow: 'wrap',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <img
                  src={`${process.env.PUBLIC_URL || ''}/mozilla-logo-bw-1.svg`}
                  alt="Mozilla"
                  style={{ height: '32px' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      mozillaLogoFallback;
                  }}
                />
                <span
                  style={{
                    borderLeft: '1px solid #CCCCCC',
                    height: '24px',
                    margin: '0 16px',
                  }}
                />
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    fontFamily:
                      'Graphik Web, proxima-nova, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {productName}
                </span>
              </div>

              <nav style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {menuLinks
                  .filter((link: MenuLink) => {
                    // Remove trailing slash from both paths for comparison
                    const currentPath = location.pathname.replace(/\/$/, '');
                    const linkPath = link.url.replace(/\/$/, '');
                    return currentPath !== linkPath;
                  })
                  .map((link: MenuLink) => (
                    <Link
                      to={link.url}
                      key={link.url}
                      style={{
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: 400,
                        fontFamily:
                          'Graphik Web, proxima-nova, "Helvetica Neue", Helvetica, Arial, sans-serif',
                      }}
                    >
                      {link.text}
                    </Link>
                  ))}
              </nav>
            </div>

            {hasUser && parsedIdToken && (
              <div style={{ flexShrink: 0 }}>
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
              </div>
            )}
          </div>
        </Container>
      </StyledAppBar>
    </>
  );
};
