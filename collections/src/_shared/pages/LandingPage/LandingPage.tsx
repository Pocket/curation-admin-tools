import React from 'react';
import { Header, MainContentWrapper, MenuLink } from '../../components';
//import { Link } from 'react-router-dom';

export const LandingPage = (): JSX.Element => {
  const menuLinks: MenuLink[] = [
    {
      text: 'Collections',
      url: '/collections',
    },
    {
      text: 'Prospects',
      url: '/prospects',
    },
  ];

  return (
    <>
      <Header productName="Curation Tools" menuLinks={menuLinks} />
      <MainContentWrapper>
        <h2>TADA! Landing page</h2>
      </MainContentWrapper>
    </>
  );
};
