import React from 'react';
import { CustomSectionsPage } from './CustomSectionsPage';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { getScheduledSurfacesForUser } from '../../../api/queries/getScheduledSurfacesForUser';

const mocks = [
  {
    request: {
      query: getScheduledSurfacesForUser,
    },
    result: {
      data: {
        getScheduledSurfacesForUser: [
          {
            guid: 'NEW_TAB_EN_US',
            name: 'New Tab (en-US)',
            prospectTypes: ['ORGANIC_TIMESPENT', 'SYNDICATED_NEW'],
            ianaTimezone: 'America/New_York',
          },
          {
            guid: 'NEW_TAB_DE_DE',
            name: 'New Tab (de-DE)',
            prospectTypes: ['ORGANIC_TIMESPENT'],
            ianaTimezone: 'Europe/Berlin',
          },
        ],
      },
    },
  },
];

describe('CustomSectionsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );
    expect(container).toBeTruthy();
  });

  it('renders inside the required providers', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/custom-sections']}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('mounts successfully with Apollo MockedProvider', () => {
    const { container } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );
    const rootElement = container.querySelector('div');
    expect(rootElement).toBeInTheDocument();
  });
});
