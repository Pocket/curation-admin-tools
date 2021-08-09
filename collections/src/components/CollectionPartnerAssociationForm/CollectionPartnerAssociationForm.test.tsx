import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CollectionPartner,
  CollectionPartnerAssociation,
  CollectionPartnershipType,
} from '../../api/collection-api/generatedTypes';
import { CollectionPartnerAssociationForm } from './CollectionPartnerAssociationForm';

describe('The CollectionPartnerAssociationForm component', () => {
  let association: CollectionPartnerAssociation;
  let partners: CollectionPartner[];
  let handleSubmit = jest.fn();

  beforeEach(() => {
    association = {
      externalId: '123-abc',
      type: CollectionPartnershipType.Partnered,
      partner: {
        externalId: 'cde-456',
        name: 'Wellness Storm',
        url: 'https://getpocket.com/',
        imageUrl: 'https://www.test.com/image.png',
        blurb:
          "Star stuff harvesting star light the only home we've ever known " +
          'explorations finite but unbounded a mote of dust suspended in ' +
          'a sunbeam citizens of distant epochs. ',
      },
    };

    partners = [
      {
        externalId: 'cde-456',
        name: 'Wellness Storm',
        url: 'https://getpocket.com/',
        imageUrl: 'https://www.test.com/image.png',
        blurb:
          "Star stuff harvesting star light the only home we've ever known " +
          'explorations finite but unbounded a mote of dust suspended in ' +
          'a sunbeam citizens of distant epochs. ',
      },
      {
        externalId: '789-xyz',
        name: 'The Cosmos Awaits',
        url: 'https://www.example.com/',
        imageUrl: 'http://placeimg.com/640/480/people?random=494',
        blurb:
          'The sky calls to us vanquish the impossible hundreds of thousands' +
          ' a very small stage in a vast cosmic arena white dwarf network' +
          ' of wormholes?',
      },
      {
        externalId: '999-qwerty',
        name: 'Billions upon billions',
        url: 'https://www.example.com/',
        imageUrl: 'http://placeimg.com/640/480/people?random=494',
        blurb:
          'The softly dancing ship of the imagination from which we spring ' +
          'gathered by gravity with pretty stories for which there is little' +
          ' good evidence and billions upon billions upon billions upon ' +
          'billions upon billions upon billions upon billions.',
      },
    ];
  });

  it('renders successfully', () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('shows two action buttons by default', () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('only shows one button if not in edit mode', () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
        editMode={false}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(1);
  });

  it('has the requisite fields', () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    const typeField = screen.getByLabelText('Type');
    expect(typeField).toBeInTheDocument();

    const partnerField = screen.getByLabelText('Partner');
    expect(partnerField).toBeInTheDocument();

    const nameField = screen.getByLabelText('Name');
    expect(nameField).toBeInTheDocument();

    const urlField = screen.getByLabelText('URL');
    expect(urlField).toBeInTheDocument();

    const blurbField = screen.getByLabelText('Blurb');
    expect(blurbField).toBeInTheDocument();
  });

  it('validates the "type" field', async () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    const typeField = screen.getByLabelText(/type/i) as HTMLSelectElement;

    // There is no apparent way to submit a non-existent option, so all that can
    // be done here is switch to the other type and check that it works
    await waitFor(() => {
      userEvent.selectOptions(typeField, [CollectionPartnershipType.Sponsored]);
    });

    const chosenOption = screen.getByRole('option', {
      name: CollectionPartnershipType.Sponsored,
    }) as HTMLOptionElement;
    expect(chosenOption.selected).toBe(true);

    // Check that the other option is no longer selected
    const otherOption = screen.getByRole('option', {
      name: CollectionPartnershipType.Partnered,
    }) as HTMLOptionElement;
    expect(otherOption.selected).toBe(false);
  });

  it('validates the "partner" field', async () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    const partnerField = screen.getByLabelText(/partner/i) as HTMLSelectElement;

    // There is no apparent way to submit a non-existent option, so all that can
    // be done here is switch to the other type and check that it works
    await waitFor(() => {
      userEvent.selectOptions(partnerField, [partners[2].externalId]);
    });

    const chosenOption = screen.getByRole('option', {
      name: partners[2].name,
    }) as HTMLOptionElement;
    expect(chosenOption.selected).toBe(true);

    // Check that the other option is no longer selected
    const otherOption = screen.getByRole('option', {
      name: association.partner.name,
    }) as HTMLOptionElement;
    expect(otherOption.selected).toBe(false);
  });

  it('validates the "name" field', async () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    const nameField = screen.getByLabelText(/name/i);
    const saveButton = screen.getByText(/save/i);

    // Submit a name that is too short (cutoff is just two characters)
    userEvent.clear(nameField);
    userEvent.type(nameField, 'B');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter at least two characters/i)
    ).toBeInTheDocument();

    // Submit a longer name
    userEvent.clear(nameField);
    userEvent.type(nameField, 'Boots');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter at least two characters/i)
    ).not.toBeInTheDocument();

    // Since we're not modifying any other test data, and the default test data
    // we have is more than enough for all the form inputs, the form should be
    // submitted successfully
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('validates the "url" field', async () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    const urlField = screen.getByLabelText(/url/i);
    const saveButton = screen.getByText(/save/i);

    // Submit a URL that is too short (under ten characters)
    userEvent.clear(urlField);
    userEvent.type(urlField, 'https');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter at least 10 characters/i)
    ).toBeInTheDocument();

    // Submit a longer url
    userEvent.clear(urlField);
    userEvent.type(urlField, 'https://sample-website.com/');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter at least 10 characters/i)
    ).not.toBeInTheDocument();

    // Since we're not modifying any other test data, and the default test data
    // we have is more than enough for all the form inputs, the form should be
    // submitted successfully
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('validates the "blurb" field', async () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );

    const blurbField = screen.getByLabelText(/blurb/i);
    const saveButton = screen.getByText(/save/i);

    // Submit a description that is too short (under ten characters)
    userEvent.clear(blurbField);
    userEvent.type(blurbField, 'Something');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter at least 10 characters/i)
    ).toBeInTheDocument();

    // Submit a longer url
    userEvent.clear(blurbField);
    userEvent.type(
      blurbField,
      'The sky calls to us vastness is bearable ' +
        'only through love courage of our questions kindling the energy hidden in ' +
        "matter the only home we've ever known courage of our questions?"
    );
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter at least 10 characters/i)
    ).not.toBeInTheDocument();

    // Since we're not modifying any other test data, and the default test data
    // we have is more than enough for all the form inputs, the form should be
    // submitted successfully
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('has markdown preview tabs on the blurb fields', () => {
    render(
      <CollectionPartnerAssociationForm
        association={association}
        partners={partners}
        onSubmit={handleSubmit}
      />
    );
    const writeTabs = screen.getAllByText(/write/i);
    expect(writeTabs.length).toEqual(1);

    const previewTabs = screen.getAllByText(/preview/i);
    expect(previewTabs.length).toEqual(1);
  });
});
