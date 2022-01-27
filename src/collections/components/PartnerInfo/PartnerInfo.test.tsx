import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PartnerInfo } from './PartnerInfo';
import { CollectionPartner } from '../../../api/generatedTypes';
import { MockedProvider } from '@apollo/client/testing';

describe('The PartnerInfo component', () => {
  let partner: CollectionPartner;

  beforeEach(() => {
    partner = {
      externalId: '123-abc',
      name: 'Conniption Constitution',
      url: 'https://test.com/',
      imageUrl: 'http://placeimg.com/640/480/tech',
      blurb:
        'Incidunt corrupti earum. Quasi aut qui magnam eum. ' +
        'Quia non dolores voluptatem est aut. Id officiis nulla est.\n \r' +
        'Harum et velit debitis. Quia assumenda commodi et dolor. ' +
        'Ut dicta veritatis perspiciatis suscipit. ' +
        'Aspernatur reprehenderit laboriosam voluptates ut. Ut minus aut est.',
    };
  });

  it('shows basic partner information', () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <PartnerInfo partner={partner} />
        </MemoryRouter>
      </MockedProvider>
    );

    // The link to the partner site is present
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(partner.url));

    // The partner blurb is present
    const blurb = screen.getByText(/voluptatem est aut/i);
    expect(blurb).toBeInTheDocument();
  });
});
