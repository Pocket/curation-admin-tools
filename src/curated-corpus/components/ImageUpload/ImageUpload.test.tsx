import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUpload } from './ImageUpload';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
} from '../../../api/generatedTypes';
import { SnackbarProvider } from 'notistack';
import { MockedProvider } from '@apollo/client/testing';
import { formatFileSize } from '../../../_shared/utils/formatFileSize';

describe('The ImageUpload component', () => {
  let entity: ApprovedCorpusItem;
  const placeholder = 'test-placeholder';
  const onImageSave = jest.fn();

  beforeEach(() => {
    entity = {
      externalId: '123-abc',
      prospectId: '123-xyz',
      title: 'How To Win Friends And Influence People with React',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=494',
      excerpt:
        'Everything You Wanted to Know About React and Were Afraid To Ask',
      language: CorpusLanguage.De,
      publisher: 'Amazing Inventions',
      topic: 'TECHNOLOGY',
      status: CuratedStatus.Recommendation,
      isCollection: false,
      isSyndicated: false,
      isTimeSensitive: false,
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635114926,
      scheduledSurfaceHistory: [],
      source: CorpusItemSource.Prospect,
    };
  });

  it('should render all elements when update image button is clicked', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <ImageUpload
            entity={entity}
            placeholder={placeholder}
            onImageSave={onImageSave}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const updateImageButton = screen.getByRole('button', {
      name: /update image/i,
    });

    userEvent.click(updateImageButton);

    const saveButton = await screen.findByRole('button', { name: /save/i });
    const cancelButton = await screen.findByRole('button', { name: /cancel/i });

    // get the input html element for us to upload the file
    const imageUploadInput = await screen.findByTestId(
      'curated-corpus-image-upload-input'
    );

    // get the drop zone element
    const dropZone = await screen.findByText(
      /Drag and drop an image here, or click to select one/i
    );

    // assert that input html element is rendered
    expect(imageUploadInput).toBeInTheDocument();
    // assert that drag and drop box is rendered
    expect(dropZone).toBeInTheDocument();

    // assert both buttons are rendered
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('should render image info when a new image is uploaded', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <ImageUpload
            entity={entity}
            placeholder={placeholder}
            onImageSave={onImageSave}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const updateImageButton = screen.getByRole('button', {
      name: /update image/i,
    });

    userEvent.click(updateImageButton);

    const imageUploadInput = await screen.findByTestId(
      'curated-corpus-image-upload-input'
    );

    // upload the test file by executing an upload event
    await waitFor(() => {
      userEvent.upload(imageUploadInput, file);
    });

    // fetch the 'Selected:' text that renders after a successful upload
    const fileSelectedText = await screen.findByText(/selected:/i);
    expect(fileSelectedText).toBeInTheDocument();

    // fetch the file attributes when they get rendered
    const fileName = (await screen.findByText(
      /name:/i
    )) as HTMLParagraphElement;
    const fileSize = (await screen.findByText(
      /size:/i
    )) as HTMLParagraphElement;
    const fileType = (await screen.findByText(
      /type:/i
    )) as HTMLParagraphElement;

    // assert the uploaded file attributes match our file
    expect(fileName.textContent?.replace('Name:', '').trim()).toEqual(
      file.name
    );
    expect(fileSize.textContent?.replace('Size:', '').trim()).toEqual(
      formatFileSize(file.size)
    );
    expect(fileType.textContent?.replace('Type:', '').trim()).toEqual(
      file.type
    );
  });
});
