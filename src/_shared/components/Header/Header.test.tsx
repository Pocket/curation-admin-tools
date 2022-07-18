import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Header, MenuLink } from './Header';

describe('The Header component', () => {
  let menuLinks: MenuLink[];

  beforeEach(() => {
    menuLinks = [
      {
        text: 'Collections',
        url: '/collections/',
      },
      {
        text: 'Authors',
        url: '/authors/',
      },
      {
        text: 'Search',
        url: '/search/',
      },
    ];
  });

  it('renders successfully', () => {
    render(
      <MemoryRouter>
        <Header
          hasUser={false}
          menuLinks={menuLinks}
          onLogout={jest.fn()}
          parsedIdToken={null}
          productLink="/something"
          productName="Collections"
        />
      </MemoryRouter>
    );

    // There are two logos: one for desktop, one for mobile
    const logos = screen.getAllByRole('img');

    logos.forEach((logo) => {
      expect(logo).toBeInTheDocument();
    });

    const productName = screen.getByRole('heading');
    expect(productName).toBeInTheDocument();
    expect(productName).toHaveTextContent(/collections/i);
  });

  it('shows navigation links', () => {
    render(
      <MemoryRouter>
        <Header
          hasUser={false}
          menuLinks={menuLinks}
          onLogout={jest.fn()}
          parsedIdToken={null}
          productLink="/something"
          productName="Collections"
        />
      </MemoryRouter>
    );
    const links = screen.getAllByRole('button');

    // the extra button is the menu button in the top left corner on mobile screens
    expect(links.length).toEqual(menuLinks.length + 1);
  });
});
