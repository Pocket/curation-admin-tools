import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import {
  Header,
  MainContentWrapper,
  MenuLink,
} from '../../../_shared/components';

/**
 * Prospects landing page
 */
export const ProspectsLandingPage = (): JSX.Element => {
  // Get the base path (/prospects)
  const { path } = useRouteMatch();

  const menuLinks: MenuLink[] = [
    {
      text: 'Prospects',
      url: `${path}/prospects/`,
    },
    {
      text: 'Links',
      url: `${path}/222/`,
    },
    {
      text: 'Links',
      url: `${path}/333/`,
    },
  ];

  return (
    <>
      <Header productName="Prospect Curation" menuLinks={menuLinks} />
      <MainContentWrapper>
        <h2>Prospects! Hooray!</h2>
      </MainContentWrapper>
    </>
  );
};
