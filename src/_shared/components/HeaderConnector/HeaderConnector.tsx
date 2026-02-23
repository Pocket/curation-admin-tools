import React from 'react';
import { Header, MenuLink } from '../Header/Header';
import { useMozillaAuth } from '../../hooks';

interface HeaderConnectorProps {
  /**
   * The name of the Admin UI, i.e. 'Curated Corpus'
   */
  productName: string;

  /**
   * The URL path of the Admin UI, e.g. `/curated-corpus`
   */
  productLink: string;

  /**
   * A list of links that appear in the mobile Drawer menu
   */
  menuLinks: MenuLink[];
}

export const HeaderConnector: React.FC<HeaderConnectorProps> = (
  props,
): JSX.Element => {
  const { productName, productLink, menuLinks } = props;

  const { authService, parsedIdToken } = useMozillaAuth();

  return (
    <Header
      hasUser={authService.getUser() != null}
      onLogout={() => {
        authService.logout();
      }}
      menuLinks={menuLinks}
      parsedIdToken={parsedIdToken}
      productName={productName}
      productLink={productLink}
    />
  );
};
