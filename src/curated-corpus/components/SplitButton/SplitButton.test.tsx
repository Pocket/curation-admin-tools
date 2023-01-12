import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SplitButton } from './SplitButton';
import { DropdownOption } from '../../helpers/definitions';
import FilterListIcon from '@mui/icons-material/Filter';
import userEvent from '@testing-library/user-event';

describe('The SplitButton component', () => {
  const onClick = jest.fn();

  const options: DropdownOption[] = [
    { code: 'test1', name: 'Option 1' },
    { code: 'test2', name: 'Option 2' },
  ];

  it('renders with required props', () => {
    render(<SplitButton onMenuOptionClick={onClick} options={options} />);

    // The first dropdown option should be displayed as the button label
    const button = screen.getByText(/option 1/i);

    expect(button).toBeInTheDocument();
  });

  it('renders with optional icon', () => {
    render(
      <SplitButton
        icon={<FilterListIcon fontSize="large" data-testid="my-filter-icon" />}
        onMenuOptionClick={onClick}
        options={options}
      />
    );

    const icon = screen.getByTestId('my-filter-icon');
    expect(icon).toBeInTheDocument();
  });

  it('updates selected option', async () => {
    render(<SplitButton onMenuOptionClick={onClick} options={options} />);
    const dropdownArrow = screen.getByLabelText(/dropdown options/i);

    await waitFor(() => {
      userEvent.click(dropdownArrow);
    });

    // The second option in the dropdown should now be visible
    const option2 = screen.getByText(/option 2/i);
    expect(option2).toBeInTheDocument();

    await waitFor(() => {
      userEvent.click(option2);
    });

    expect(onClick).toHaveBeenCalled();
  });
});
