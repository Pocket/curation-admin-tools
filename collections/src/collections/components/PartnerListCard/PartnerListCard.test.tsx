import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { PartnerListCard } from './PartnerListCard';
import { CollectionPartner } from '../../api/collection-api/generatedTypes';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

describe('The PartnerListCard component', () => {
  let partner: CollectionPartner;

  beforeEach(() => {
    partner = {
      externalId: '123-abc',
      name: 'Constellation Consolation',
      url: 'https://getpocket.com/',
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
      <MemoryRouter>
        <PartnerListCard partner={partner} />
      </MemoryRouter>
    );

    // The partner image is present and the alt text is the partner's name
    const image = screen.getByAltText(partner.name);
    expect(image).toBeInTheDocument();

    // The link to the partner page is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(partner.externalId)
    );

    // The blurb is also present
    const blurb = screen.getByText(/voluptatem est aut/i);
    expect(blurb).toBeInTheDocument();
  });

  it("links to an individual partner's page", () => {
    const history = createMemoryHistory({
      initialEntries: ['/collections/partners/'],
    });

    render(
      <MockedProvider>
        <Router history={history}>
          <PartnerListCard partner={partner} />
        </Router>
      </MockedProvider>
    );

    // While the entire card is a giant link, we can click on
    // anything we like within that link - i.e., the partners's name
    userEvent.click(screen.getByText(partner.name));
    expect(history.location.pathname).toEqual(
      `/collections/partners/${partner.externalId}/`
    );

    // Let's go back to the Partners page
    history.goBack();
    expect(history.location.pathname).toEqual('/collections/partners/');

    // And click on the image this time
    userEvent.click(screen.getByRole('img'));
    expect(history.location.pathname).toEqual(
      `/collections/partners/${partner.externalId}/`
    );
  });
});
