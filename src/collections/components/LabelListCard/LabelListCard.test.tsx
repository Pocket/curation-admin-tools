import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LabelListCard } from './LabelListCard';
import { Label } from '../../../api/generatedTypes';

describe('The LabelListCard component', () => {
  let label: Label;

  beforeEach(() => {
    label = {
      externalId: '124abc',
      name: 'region-east-africa',
    };
  });

  it('shows label name and edit button', () => {
    render(
      <MemoryRouter>
        <LabelListCard label={label} refetch={jest.fn()} />
      </MemoryRouter>,
    );

    const name = screen.getByText(/region-east-africa/i);
    expect(name).toBeInTheDocument();

    const editButton = screen.getByTestId('edit-label-button');
    expect(editButton).toBeInTheDocument();
  });
});
