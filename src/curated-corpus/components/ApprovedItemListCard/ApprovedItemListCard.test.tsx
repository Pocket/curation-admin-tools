import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { ApprovedItemListCard } from './ApprovedItemListCard';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { ScheduledSurfaces } from '../../helpers/definitions';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

describe('The ApprovedItemListCard component', () => {
  let item: ApprovedCorpusItem = getTestApprovedItem();

  it('shows basic approved item information', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // The photo is present and the alt text is the item title
    const photo = screen.getByAltText(item.title);
    expect(photo).toBeInTheDocument();

    // The link to the approved item page is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(item.url));
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about react/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('shows curated status correctly', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Shows 'Recommendation' status for a recommended story -
    // shortened to just "Rec" in the UI
    const recommendation = screen.getByText(/^Rec/i);
    expect(recommendation).toBeInTheDocument();

    // Doesn't show the other two possible curated item states
    const corpus = screen.queryByText(/^corpus/i);
    expect(corpus).not.toBeInTheDocument();
    const decline = screen.queryByText(/^decline/i);
    expect(decline).not.toBeInTheDocument();
  });

  it('shows language correctly', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });

  it('shows topic correctly', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Health & Fitness')).toBeInTheDocument();
  });

  it('should render approved item card with excerpt', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(item.excerpt)).toBeInTheDocument();
  });

  it('should not render any extra flags if item does not have these props', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText(/collection/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/syndicated/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/time sensitive/i)).not.toBeInTheDocument();
  });

  it('should render any extra flags if item has these props set', () => {
    item = {
      ...item,
      isCollection: true,
      isTimeSensitive: true,
      isSyndicated: true,
    };

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/collection/i)).toBeInTheDocument();
    expect(screen.getByText(/syndicated/i)).toBeInTheDocument();
    expect(screen.getByText(/time sensitive/i)).toBeInTheDocument();
  });

  it('should show multiple authors as a comma-separated string', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(flattenAuthors(item.authors))).toBeInTheDocument();
  });

  it('should show a single author correctly', () => {
    item = {
      ...item,
      authors: [{ name: 'Agatha Christie', sortOrder: 1 }],
    };

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Agatha Christie')).toBeInTheDocument();
  });

  it('should render ScheduleHistory component', () => {
    item = {
      ...item,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2022-08-01',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2022-08-02',
          scheduledSurfaceGuid: 'NEW_TAB_DE_DE',
        },
      ],
    };

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ApprovedItemListCard item={item} />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // fetch the view recently scheduled button
    const scheduleHistoryButton = screen.getByText(/view recently scheduled/i);

    // assert that ScheduleHistory component rendered successfully
    expect(scheduleHistoryButton).toBeInTheDocument();

    userEvent.click(scheduleHistoryButton);

    // assert that the copy changed on the above button
    expect(screen.getByText(/hide recently scheduled/i)).toBeInTheDocument();

    // fetch and assert that the first scheduled history entry details are rendered successfully
    expect(screen.getByText(/aperson/i)).toBeInTheDocument();
    expect(screen.getByText(/August 1, 2022/i)).toBeInTheDocument();
    expect(screen.getByText('New Tab (en-US)')).toBeInTheDocument();

    // fetch and assert that the second scheduled history entry details are rendered successfully
    expect(screen.getByText(/bperson/i)).toBeInTheDocument();
    expect(screen.getByText(/August 2, 2022/i)).toBeInTheDocument();
    expect(screen.getByText('New Tab (de-DE)')).toBeInTheDocument();

    userEvent.click(scheduleHistoryButton);

    // assert that the copy changed to the original one on the above button
    expect(screen.getByText(/view recently scheduled/i)).toBeInTheDocument();
  });
});
