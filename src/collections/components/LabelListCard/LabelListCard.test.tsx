import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { LabelListCard } from './LabelListCard';
import { Label } from '../../../api/generatedTypes';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

describe('The LabelListCard component', () => {
  let label: Label;

  beforeEach(() => {
    label = {
      externalId: '124abc',
      name: 'region-east-africa',
    };
  });

  it('shows label name', () => {
    render(
      <MemoryRouter>
        <LabelListCard label={label} />
      </MemoryRouter>
    );

    const name = screen.getByText(/region-east-africa/i);
    expect(name).toBeInTheDocument();
  });
});
