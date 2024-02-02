import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { SuggestedScheduleItemListCard } from './SuggestedScheduleItemListCard';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { ScheduledSurfaces } from '../../helpers/definitions';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

describe('The SuggestedScheduleItemListCard component', () => {
  let item: ApprovedCorpusItem = getTestApprovedItem();
  const currentScheduledDate = '2024-01-20';

  const onMoveToBottom = jest.fn();
  const onEdit = jest.fn();
  const onReschedule = jest.fn();
  const onUnschedule = jest.fn();

  it('shows basic scheduled item information', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    // The image is present and the alt text is the item title
    const image = screen.getByAltText(item.title);
    expect(image).toBeInTheDocument();

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

  it('should render topic overlay label', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Health & Fitness')).toBeInTheDocument();
  });

  it('should render excerpt', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(item.excerpt)).toBeInTheDocument();
  });

  it('should not render any extra flags if item does not have these props', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/collection/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/syndicated/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/time sensitive/i)).not.toBeInTheDocument();
  });

  it('should render time sensitive label if item has this prop', () => {
    item = {
      ...item,
      isTimeSensitive: true,
    };

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/time sensitive/i)).toBeInTheDocument();
  });

  it('should show multiple authors as a comma-separated string', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
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
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Agatha Christie')).toBeInTheDocument();
  });

  // TODO implement once we have publicationDate property on a corpus item in the corpus DB
  it.todo('should render publication date next to author and publisher');

  it('should render ScheduleHistory component', () => {
    item = {
      ...item,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2022-08-01',
          scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2022-08-02',
          scheduledSurfaceGuid: ScheduledSurfaces[1].guid,
        },
      ],
    };

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    // fetch the recently scheduled clickable overlay / button
    const recentlyScheduledButton = screen.getByTestId(
      /last-scheduled-overlay/i
    );

    // assert that the "last scheduled ..." overlay is rendered
    expect(recentlyScheduledButton).toBeInTheDocument();

    userEvent.click(recentlyScheduledButton);

    // fetch and assert that the first scheduled history entry details are rendered successfully
    expect(screen.getByText(/aperson/i)).toBeInTheDocument();
    expect(screen.getByText(/August 1, 2022/i)).toBeInTheDocument();
    expect(screen.getByText('New Tab (en-US)')).toBeInTheDocument();

    // fetch and assert that the second scheduled history entry details are rendered successfully
    expect(screen.getByText(/bperson/i)).toBeInTheDocument();
    expect(screen.getByText(/August 2, 2022/i)).toBeInTheDocument();
    expect(screen.getByText('New Tab (de-DE)')).toBeInTheDocument();

    // assert that the copy changed to the original one on the above button
    expect(screen.getByText(/recently scheduled/i)).toBeInTheDocument();
  });

  it('should render all four card action buttons', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'edit' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 're-schedule' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'unschedule' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'move to bottom' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'reject' })).toBeInTheDocument();
  });

  it('should call onUnschedule when "Unschedule" button is clicked', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    userEvent.click(
      screen.getByRole('button', {
        name: /unschedule/i,
      })
    );

    expect(onUnschedule).toHaveBeenCalled();
  });

  it('should call onReschedule when "Re-schedule" button is clicked', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    userEvent.click(
      screen.getByRole('button', {
        name: /re-schedule/i,
      })
    );

    expect(onReschedule).toHaveBeenCalled();
  });

  it('should call onMoveToBottom when "Move to bottom" button is clicked', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    userEvent.click(
      screen.getByRole('button', {
        name: /move to bottom/i,
      })
    );

    expect(onMoveToBottom).toHaveBeenCalled();
  });

  it('should call onEdit when "Edit" button is clicked', () => {
    const onEdit = jest.fn();

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <SuggestedScheduleItemListCard
            item={item}
            currentScheduledDate={currentScheduledDate}
            onEdit={onEdit}
            onUnschedule={onUnschedule}
            onReschedule={onReschedule}
            onMoveToBottom={onMoveToBottom}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    userEvent.click(
      screen.getByRole('button', {
        name: /Edit/i,
      })
    );

    expect(onEdit).toHaveBeenCalled();
  });

  it.todo('should call onReject when "Reject" button is clicked');
});
