import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { useMutation } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  GetOpenGraphFieldsDocument,
  GetUrlMetadataDocument,
  Topics,
} from '../../../api/generatedTypes';
import { ApprovedItemForm } from './ApprovedItemForm';
import { uploadApprovedItemImage } from '../../../api/mutations/uploadApprovedItemImage';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

// Mock useMutation for tests that need to control loading state
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(),
}));

const mockUseMutation = useMutation as jest.Mock;

describe('The ApprovedItemForm component', () => {
  let item: ApprovedCorpusItem;
  const onSubmit = jest.fn();
  const onCancel = jest.fn();
  const onImageSave = jest.fn();

  beforeEach(() => {
    // Reset useMutation to use actual implementation by default
    mockUseMutation.mockImplementation(
      jest.requireActual('@apollo/client').useMutation,
    );
  });

  const buildQueryMocks = (url: string, excerpt: string) => [
    {
      request: {
        query: GetOpenGraphFieldsDocument,
        variables: { url },
      },
      result: {
        data: {
          getOpenGraphFields: {
            description: excerpt,
          },
        },
      },
    },
    {
      request: {
        query: GetUrlMetadataDocument,
        variables: { url },
      },
      result: {
        data: {
          getUrlMetadata: {
            url,
            imageUrl: '',
            publisher: '',
            datePublished: null,
            domain: url,
            title: '',
            excerpt,
            language: '',
            isSyndicated: false,
            isCollection: false,
            authors: [],
          },
        },
      },
    },
  ];

  beforeEach(() => {
    item = {
      externalId: '123-abc',
      prospectId: '123-xyz',
      title: 'How To Win Friends And Influence People with React',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=494',
      excerpt:
        'Everything You Wanted to Know About React and Were Afraid To Ask',
      hasTrustedDomain: true,
      language: CorpusLanguage.De,
      authors: [
        { name: 'One Author', sortOrder: 1 },
        { name: 'Two Authors', sortOrder: 2 },
      ],
      publisher: 'Amazing Inventions',
      datePublished: '2025-12-11 09:30:00',
      topic: Topics.HealthFitness,
      source: CorpusItemSource.Prospect,
      status: CuratedStatus.Recommendation,
      isCollection: false,
      isSyndicated: false,
      isTimeSensitive: false,
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635114926,
      scheduledSurfaceHistory: [],
    };
  });

  const renderApprovedItemForm = (
    itemOverrides: Partial<ApprovedCorpusItem> = {},
    mocks?: any[],
  ) => {
    const approvedItemWithOverrides = { ...item, ...itemOverrides };
    const mergedMocks =
      mocks ??
      buildQueryMocks(
        approvedItemWithOverrides.url,
        approvedItemWithOverrides.excerpt,
      );

    render(
      <MockedProvider mocks={mergedMocks}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ApprovedItemForm
              approvedItem={approvedItemWithOverrides}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onImageSave={onImageSave}
            />
          </SnackbarProvider>
        </ThemeProvider>
      </MockedProvider>,
    );
  };

  it('should render all the form fields with correct initial values', () => {
    renderApprovedItemForm();

    const url = screen.getByLabelText(/Item URL/);
    expect(url).toBeInTheDocument();
    expect(url).toHaveValue(item.url);

    const title = screen.getByLabelText(/Title/);
    expect(title).toBeInTheDocument();
    expect(title).toHaveValue(item.title);

    const publisher = screen.getByLabelText(/Publisher/);
    expect(publisher).toBeInTheDocument();
    expect(publisher).toHaveValue(item.publisher);

    const authors = screen.getByLabelText(/Authors/);
    expect(authors).toBeInTheDocument();
    expect(authors).toHaveValue(flattenAuthors(item.authors));

    const excerpt = screen.getByLabelText(/Excerpt/);
    expect(excerpt).toBeInTheDocument();
    expect(excerpt).toHaveValue(item.excerpt);

    // Check for the value we send to the API ("DE" here)
    const language = screen.getByLabelText(/Language/);
    expect(language).toBeInTheDocument();
    expect(language).toHaveValue(item.language);

    // Make sure the display name for this language is correct, too ("German")
    // (need to check both for a select field!)
    const displayLanguage = screen.getByDisplayValue(/German/);
    expect(displayLanguage).toBeInTheDocument();

    // Check for the value we send to the API ("HEALTH_FITNESS" here)
    const topic = screen.getByLabelText(/Topic/);
    expect(topic).toBeInTheDocument();
    expect(topic).toHaveValue(Topics.HealthFitness);
    // Make sure the display name for this topic is correct, too ("Health & Fitness")
    const displayTopic = screen.getByDisplayValue(/Health & Fitness/);
    expect(displayTopic).toBeInTheDocument();

    // Check for the field value ("RECOMMENDATION" here)
    const curationStatus = screen.getByLabelText(/Curation Status/);
    expect(curationStatus).toBeInTheDocument();
    expect(curationStatus).toHaveValue(CuratedStatus.Recommendation);
    // Make sure the display name is correct, too ("Recommendation")
    const displayStatus = screen.getByDisplayValue(/Recommendation/);
    expect(displayStatus).toBeInTheDocument();

    const timeSensitive = screen.getByLabelText(/Time Sensitive/);
    expect(timeSensitive).toBeInTheDocument();
    expect(timeSensitive).toHaveProperty('checked', item.isTimeSensitive);

    const collection = screen.getByLabelText(/Collection/);
    expect(collection).toBeInTheDocument();
    expect(collection).toHaveProperty('checked', item.isCollection);

    const syndicated = screen.getByLabelText(/Syndicated/);
    expect(syndicated).toBeInTheDocument();
    expect(syndicated).toHaveProperty('checked', item.isSyndicated);

    // hidden fields
    const datePublished = screen.getByLabelText(/datePublished/);
    expect(datePublished).toBeInTheDocument();
    // make sure the date time value is converted to just a date
    expect(datePublished).toHaveValue('2025-12-11');

    const source = screen.getByLabelText(/source/);
    expect(source).toBeInTheDocument();
    expect(source).toHaveValue(item.source);
  });

  it('should render the ImageUpload component', () => {
    renderApprovedItemForm();

    //This is fetching the 'Update Image' text in the ImageUpload component
    const imageUpload = screen.getByText(/Update Image/i);

    expect(imageUpload).toBeInTheDocument();
  });

  it('should render form buttons', () => {
    renderApprovedItemForm();

    const saveButton = screen.getByText(/^Save$/);
    const cancelButton = screen.getByText(/Cancel/);

    // Buttons from the SharedFormButtons component
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  describe('Publisher domain save actions', () => {
    // Create a mock MutationResult with all required properties
    const createMockMutationResult = (loading: boolean) => ({
      loading,
      called: false,
      client: {},
      reset: jest.fn(),
    });

    it('should hide save buttons when domain info is unavailable', () => {
      renderApprovedItemForm({
        url: 'not-a-valid-url',
        publisher: 'Test Publisher',
      });

      expect(screen.queryByText(/^Save for /i)).not.toBeInTheDocument();
    });

    it('should disable save buttons when publisher is empty', () => {
      const mockMutation = jest.fn().mockResolvedValue({ data: {} });
      mockUseMutation.mockReturnValue([
        mockMutation,
        createMockMutationResult(false),
      ]);

      renderApprovedItemForm({
        publisher: '',
        url: 'https://news.example.com/story',
      });

      const saveButton = screen.getByRole('button', {
        name: /Save for example.com/i,
      });

      expect(saveButton).toBeDisabled();
    });

    it('should call mutation with correct variables for subdomains', async () => {
      const mockMutation = jest.fn().mockResolvedValue({ data: {} });
      mockUseMutation.mockReturnValue([
        mockMutation,
        createMockMutationResult(false),
      ]);

      renderApprovedItemForm({
        url: 'https://www.news.example.com/story',
      });

      const subdomainButton = screen.getByRole('button', {
        name: /Save for news.example.com/i,
      });

      await waitFor(() => {
        userEvent.click(subdomainButton);
      });

      await waitFor(() => {
        expect(mockMutation).toHaveBeenCalledWith({
          variables: {
            data: {
              domainName: 'news.example.com',
              publisher: item.publisher,
            },
          },
        });
      });
    });

    it('should show loading state while saving publisher', () => {
      const mockMutation = jest.fn().mockResolvedValue({ data: {} });
      mockUseMutation.mockReturnValue([
        mockMutation,
        createMockMutationResult(true),
      ]);

      renderApprovedItemForm({
        url: 'https://news.example.com/story',
      });

      const loadingButtons = screen.getAllByRole('button', {
        name: /Saving .*example\.com/i,
      });

      expect(loadingButtons).toHaveLength(2);
      loadingButtons.forEach((button) => expect(button).toBeDisabled());
      expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    });
  });

  describe('When the form fields are edited', () => {
    it('should call the onSave callback for the save button', async () => {
      renderApprovedItemForm();

      const title = screen.getByLabelText(/Title/);
      userEvent.type(title, 'test title');

      const saveButton = screen.getByRole('button', {
        name: /^save$/i,
      });
      await waitFor(() => {
        userEvent.click(saveButton);
      });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should call the onCancel callback for the cancel button', async () => {
      renderApprovedItemForm();

      const title = screen.getByLabelText(/Title/);
      userEvent.type(title, 'test title');

      const cancelButton = screen.getByRole('button', {
        name: /cancel/i,
      });
      await waitFor(() => {
        userEvent.click(cancelButton);
      });
      expect(onCancel).toHaveBeenCalled();
    });

    it('should set imageUrl field when a new image is uploaded', async () => {
      // create a test file
      const file = new File(['hello'], 'hello.png', { type: 'image/png' });

      // mock request and response for the image upload mutation
      // variables and result field has to match how we send/receive
      // variables/data for the real mutation
      const mocks = [
        ...buildQueryMocks(item.url, item.excerpt),
        {
          request: {
            query: uploadApprovedItemImage,
            variables: {
              image: undefined,
            },
          },
          result: {
            data: {
              uploadApprovedCorpusItemImage: {
                url: file.name,
              },
            },
          },
        },
      ];

      renderApprovedItemForm({}, mocks);

      // fetch the update image button
      const updateImageButton = screen.getByRole('button', {
        name: /update image/i,
      });

      userEvent.click(updateImageButton);

      // get the input html element for us to upload the file
      const imageUploadInput = await screen.findByTestId(
        'curated-corpus-image-upload-input',
      );

      // upload the test file by executing an upload event
      await waitFor(() => {
        userEvent.upload(imageUploadInput, file);
      });

      // this gets the save button on the image upload component and not on the form
      const saveButton = await screen.findByRole('button', {
        name: /^save$/i,
      });

      // This executes the upload mutation and the subsequent callback
      await waitFor(() => {
        userEvent.click(saveButton);
      });

      // fetch the imageUrl field that is on the form
      const imageUrlField = (await screen.findByLabelText(
        'imageUrl',
      )) as HTMLInputElement;

      await waitFor(() => {
        expect(onImageSave).toHaveBeenCalled();
      });

      expect(imageUrlField.value).toEqual(file.name);
    });
  });

  describe('When the form fields are NOT edited', () => {
    it('should call the onSave callback for the save button ', async () => {
      renderApprovedItemForm();

      const saveButton = screen.getByRole('button', {
        name: /^save$/i,
      });

      await waitFor(() => {
        userEvent.click(saveButton);
      });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should NOT call the onSave callback if it does not have an image', async () => {
      const itemWithoutImage = { ...item, imageUrl: '' };

      renderApprovedItemForm(itemWithoutImage);

      const saveButton = screen.getByRole('button', {
        name: /^save$/i,
      });

      await waitFor(() => {
        userEvent.click(saveButton);
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
