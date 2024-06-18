import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Topics,
} from '../../../api/generatedTypes';
import { ApprovedItemForm } from './ApprovedItemForm';
import { uploadApprovedItemImage } from '../../../api/mutations/uploadApprovedItemImage';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

describe('The ApprovedItemForm component', () => {
  let item: ApprovedCorpusItem;
  const onSubmit = jest.fn();
  const onCancel = jest.fn();
  const onImageSave = jest.fn();

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

  it('should render all the form fields with correct initial values', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ApprovedItemForm
              approvedItem={item}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onImageSave={onImageSave}
            />
          </SnackbarProvider>
        </ThemeProvider>
      </MockedProvider>,
    );

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
  });

  it('should render the ImageUpload component', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ApprovedItemForm
              approvedItem={item}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onImageSave={onImageSave}
            />
          </SnackbarProvider>
        </ThemeProvider>
      </MockedProvider>,
    );

    //This is fetching the 'Update Image' text in the ImageUpload component
    const imageUpload = screen.getByText(/Update Image/i);

    expect(imageUpload).toBeInTheDocument();
  });

  it('should render form buttons', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ApprovedItemForm
              approvedItem={item}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onImageSave={onImageSave}
            />
          </SnackbarProvider>
        </ThemeProvider>
      </MockedProvider>,
    );

    const saveButton = screen.getByText(/Save/);
    const cancelButton = screen.getByText(/Cancel/);

    // Buttons from the SharedFormButtons component
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  describe('When the form fields are edited', () => {
    it('should call the onSave callback for the save button', async () => {
      render(
        <MockedProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <ApprovedItemForm
                approvedItem={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onImageSave={onImageSave}
              />
            </SnackbarProvider>
          </ThemeProvider>
        </MockedProvider>,
      );

      const title = screen.getByLabelText(/Title/);
      userEvent.type(title, 'test title');

      const saveButton = screen.getByRole('button', {
        name: /save/i,
      });
      await waitFor(() => {
        userEvent.click(saveButton);
      });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should call the onCancel callback for the cancel button', async () => {
      render(
        <MockedProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <ApprovedItemForm
                approvedItem={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onImageSave={onImageSave}
              />
            </SnackbarProvider>
          </ThemeProvider>
        </MockedProvider>,
      );

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

      render(
        <MockedProvider mocks={mocks}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <ApprovedItemForm
                approvedItem={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onImageSave={onImageSave}
              />
            </SnackbarProvider>
          </ThemeProvider>
        </MockedProvider>,
      );

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
        name: /save/i,
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
      render(
        <MockedProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <ApprovedItemForm
                approvedItem={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onImageSave={onImageSave}
              />
            </SnackbarProvider>
          </ThemeProvider>
        </MockedProvider>,
      );

      const saveButton = screen.getByRole('button', {
        name: /save/i,
      });

      await waitFor(() => {
        userEvent.click(saveButton);
      });
      expect(onSubmit).toHaveBeenCalled();
    });

    it('should NOT call the onSave callback if it does not have an image', async () => {
      const itemWithoutImage = { ...item, imageUrl: '' };

      render(
        <MockedProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <ApprovedItemForm
                approvedItem={itemWithoutImage}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onImageSave={onImageSave}
              />
            </SnackbarProvider>
          </ThemeProvider>
        </MockedProvider>,
      );

      const saveButton = screen.getByRole('button', {
        name: /save/i,
      });

      await waitFor(() => {
        userEvent.click(saveButton);
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
