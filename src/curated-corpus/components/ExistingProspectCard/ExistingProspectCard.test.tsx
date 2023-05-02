import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Prospect,
  ProspectType,
  Topics,
} from '../../../api/generatedTypes';
import { ExistingProspectCard } from './ExistingProspectCard';
import { ScheduledSurfaces } from '../../helpers/definitions';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

describe('The ExistingProspectCard component', () => {
  let prospect: Prospect;
  const onSchedule = jest.fn();
  const onDismissProspect = jest.fn();

  beforeEach(() => {
    prospect = {
      id: '123-abc',
      prospectId: '123-abc',
      title: 'How To Win Friends And Influence People with DynamoDB',
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      prospectType: ProspectType.Counts,
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
      language: CorpusLanguage.De,
      publisher: 'Amazing Inventions',
      topic: Topics.Technology,
      approvedCorpusItem: {
        externalId: '456-cde',
        title: 'How To Win Friends And Influence People with DynamoDB',
        url: 'http://www.test.com/how-to',
        imageUrl: 'https://placeimg.com/640/480/people?random=495',
        excerpt:
          'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
        language: CorpusLanguage.De,
        publisher: 'Amazing Inventions',
        topic: Topics.Technology,
        createdAt: 111,
        createdBy: 'sso|zorg',
        updatedAt: 111,
        updatedBy: 'sso|zorg',
        isCollection: false,
        isSyndicated: false,
        isTimeSensitive: false,
        source: CorpusItemSource.Prospect,
        status: CuratedStatus.Recommendation,
        authors: [{ name: 'Marie Curie', sortOrder: 1 }],
        scheduledSurfaceHistory: [],
      },
    };
  });

  it('should show basic prospect metadata', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospect.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    // The image is present and the alt text is the item title
    const photo = screen.getByAltText(prospect.title!);
    expect(photo).toBeInTheDocument();

    // The link to the prospect is present and well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(prospect.url));
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about dynamo/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('should show language correctly', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospect.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });

  it('should show topic correctly', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospect.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    expect(screen.getByText(/^technology$/i)).toBeInTheDocument();
  });

  it('should render card with excerpt', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospect.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    expect(screen.getByText(prospect.excerpt!)).toBeInTheDocument();
  });

  it('should not render "syndicated" tag for non-syndicated articles', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospect.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    expect(screen.queryByText('Syndicated')).not.toBeInTheDocument();
  });

  it('should render "syndicated" tag for syndicated articles', () => {
    // Update the mock so that it becomes a syndicated article.
    prospect.approvedCorpusItem!.isSyndicated = true;

    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospect.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    expect(screen.queryByText('Syndicated')).toBeInTheDocument();
  });

  it('should render curated item card with the action buttons', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospect.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    const scheduleButton = screen.getByRole('button', {
      name: /Schedule/i,
    });
    const dismissProspectButton = screen.getByTestId('dismissButton');

    expect(scheduleButton).toBeInTheDocument();
    expect(dismissProspectButton).toBeInTheDocument();
  });

  it('should render schedule history component', async () => {
    /**
     * We have separate units tests testing ScheduleHistory component in details in its corresponding test file
     * This test only tests if the ScheduleHistory component renders within this component
     */

    // creating a prospect with an schedule history
    const prospectWithScheduleHistory = {
      ...prospect,
      approvedCorpusItem: {
        ...prospect.approvedCorpusItem!,
        authors: [{ name: 'Marie Curie', sortOrder: 1 }],
        scheduledSurfaceHistory: [
          {
            createdBy: 'ad|Mozilla-LDAP|aperson',
            externalId: 'bogus-external-id',
            scheduledDate: '2022-02-08',
            scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
          },
        ],
      },
    };

    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ExistingProspectCard
              item={prospectWithScheduleHistory.approvedCorpusItem!}
              prospectId={prospect.prospectId}
              onSchedule={onSchedule}
              onDismissProspect={onDismissProspect}
            />
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    );

    // the button when clicked shows us the recent scheduled runs
    const recentScheduledRunsButton = screen.getByRole('button', {
      name: /view recently scheduled/i,
    });

    expect(recentScheduledRunsButton).toBeInTheDocument();
  });
});
