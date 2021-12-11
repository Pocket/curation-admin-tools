import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Prospect } from '../../api/prospect-api/generatedTypes';
import { SnackbarProvider } from 'notistack';
import { ApolloProvider } from '@apollo/client';
import { client } from '../../api/curated-corpus-api/client';
import { ProspectItemForm } from './ProspectItemForm';
import userEvent from '@testing-library/user-event';

describe('The ProspectItemForm component', () => {
  let prospect: Prospect;
  const onSubmit = jest.fn();
  const onCancel = jest.fn();
  const onImageSave = jest.fn();

  beforeEach(() => {
    prospect = {
      id: '123-abc',
      title: 'How To Win Friends And Influence People with DynamoDB',
      newTab: 'EN_US',
      prospectType: 'organic-timespent',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
      language: 'de',
      publisher: 'Amazing Inventions',
      topic: 'Technology',
      createdAt: 1635014926,
      domain: 'some-test-domain',
      isCollection: true,
      isSyndicated: false,
      saveCount: 5,
    };
  });

  it('should render all the form fields with correct initial values', () => {
    render(
      <ApolloProvider client={client}>
        <SnackbarProvider maxSnack={3}>
          <ProspectItemForm
            prospectItem={prospect}
            isRecommendation={true}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onImageSave={onImageSave}
          />
        </SnackbarProvider>
      </ApolloProvider>
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

    const excerpt = screen.getByLabelText(/Excerpt/);
    expect(excerpt).toBeInTheDocument();
    expect(excerpt).toHaveValue(item.excerpt);

    const language = screen.getByLabelText(/Language/);
    expect(language).toBeInTheDocument();
    expect(language).toHaveValue('German');

    const topic = screen.getByLabelText(/Topic/);
    expect(topic).toBeInTheDocument();
    expect(topic).toHaveValue('Technology');

    const curationStatus = screen.getByLabelText(/Curation Status/);
    expect(curationStatus).toBeInTheDocument();
    expect(curationStatus).toHaveValue('Recommendation');

    const shortLived = screen.getByLabelText(/Short Lived/);
    expect(shortLived).toBeInTheDocument();
    expect(shortLived).toHaveProperty('checked', item.isShortLived);

    const collection = screen.getByLabelText(/Collection/);
    expect(collection).toBeInTheDocument();
    expect(collection).toHaveProperty('checked', item.isCollection);

    const syndicated = screen.getByLabelText(/Syndicated/);
    expect(syndicated).toBeInTheDocument();
    expect(syndicated).toHaveProperty('checked', item.isSyndicated);
  });

  it('should render the ImageUpload component', () => {
    render(
      <ApolloProvider client={client}>
        <SnackbarProvider maxSnack={3}>
          <ApprovedItemForm
            approvedItem={item}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onImageSave={onImageSave}
          />
        </SnackbarProvider>
      </ApolloProvider>
    );

    //This is fetching the 'Update Image' text in the ImageUpload component
    const imageUpload = screen.getByText(/Update Image/i);

    expect(imageUpload).toBeInTheDocument();
  });

  it('should render form buttons', () => {
    render(
      <ApolloProvider client={client}>
        <SnackbarProvider maxSnack={3}>
          <ApprovedItemForm
            approvedItem={item}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onImageSave={onImageSave}
          />
        </SnackbarProvider>
      </ApolloProvider>
    );

    const saveButton = screen.getByText(/Save/);
    const cancelButton = screen.getByText(/Cancel/);

    // Buttons from the SharedFormButtons component
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  describe('When the form fields are edited', () => {
    it('should call the onSave callback for the save button ', async () => {
      render(
        <ApolloProvider client={client}>
          <SnackbarProvider maxSnack={3}>
            <ApprovedItemForm
              approvedItem={item}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onImageSave={onImageSave}
            />
          </SnackbarProvider>
        </ApolloProvider>
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

    it('should call the onCancel callback for the cancel button ', async () => {
      render(
        <ApolloProvider client={client}>
          <SnackbarProvider maxSnack={3}>
            <ApprovedItemForm
              approvedItem={item}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onImageSave={onImageSave}
            />
          </SnackbarProvider>
        </ApolloProvider>
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
  });

  describe('When the form fields are NOT edited', () => {
    it('should NOT call the onSave callback for the save button ', async () => {
      render(
        <ApolloProvider client={client}>
          <SnackbarProvider maxSnack={3}>
            <ApprovedItemForm
              approvedItem={item}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onImageSave={onImageSave}
            />
          </SnackbarProvider>
        </ApolloProvider>
      );

      const saveButton = screen.getByRole('button', {
        name: /save/i,
      });

      expect(saveButton).toBeDisabled();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
