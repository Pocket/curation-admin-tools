import React from 'react';
import { CustomSectionsPage } from './CustomSectionsPage';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

describe('CustomSectionsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <MockedProvider mocks={[]} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });

  it('renders inside the required providers', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/custom-sections']}>
        <MockedProvider mocks={[]} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('mounts successfully with Apollo MockedProvider', () => {
    const { container } = render(
      <MemoryRouter>
        <MockedProvider mocks={[]} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>
    );
    const rootElement = container.querySelector('div');
    expect(rootElement).toBeInTheDocument();
  });
});