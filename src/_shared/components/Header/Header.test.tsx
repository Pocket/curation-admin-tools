import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Header, MenuLink } from './Header';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

describe('The Header component', () => {
  let menuLinks: MenuLink[];

  beforeEach(() => {
    menuLinks = [
      {
        text: 'Link One',
        url: '/collections/',
      },
      {
        text: 'Link Two',
        url: '/authors/',
      },
      {
        text: 'Link Three',
        url: '/search/',
      },
    ];
  });

  it('renders successfully', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Header
            hasUser={false}
            menuLinks={menuLinks}
            onLogout={jest.fn()}
            parsedIdToken={null}
            productLink="/something"
            productName="Collections"
          />
        </ThemeProvider>
      </MemoryRouter>,
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
        <ThemeProvider theme={theme}>
          <Header
            hasUser={false}
            menuLinks={menuLinks}
            onLogout={jest.fn()}
            parsedIdToken={null}
            productLink="/something"
            productName="Collections"
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Menu links are actual links and not buttons in MUI 5, hooray!
    const link1 = screen.getByRole('link', { name: menuLinks[0].text });
    expect(link1).toBeInTheDocument();
    expect(link1).toHaveAttribute('href', menuLinks[0].url);

    const link2 = screen.getByRole('link', { name: menuLinks[1].text });
    expect(link2).toBeInTheDocument();
    expect(link2).toHaveAttribute('href', menuLinks[1].url);

    const link3 = screen.getByRole('link', { name: menuLinks[2].text });
    expect(link3).toBeInTheDocument();
    expect(link3).toHaveAttribute('href', menuLinks[2].url);
  });
});
