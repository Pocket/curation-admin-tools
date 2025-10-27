import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AddSectionItemModal } from './AddSectionItemModal';
import { getApprovedItemByUrl } from '../../../api/queries/getApprovedItemByUrl';
import { getUrlMetadata } from '../../../api/queries/getUrlMetadata';
import { CuratedStatus, CorpusItemSource } from '../../../api/generatedTypes';

describe('AddSectionItemModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockToggleApprovedItemModal = jest.fn();
  const mockSetApprovedItem = jest.fn();
  const mockSetIsRecommendation = jest.fn();
  const mockSetIsManualSubmission = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    sectionId: 'section-123',
    sectionTitle: 'Test Section',
    existingSectionItems: [],
    toggleApprovedItemModal: mockToggleApprovedItemModal,
    setApprovedItem: mockSetApprovedItem,
    setIsRecommendation: mockSetIsRecommendation,
    setIsManualSubmission: mockSetIsManualSubmission,
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddSectionItemModal {...defaultProps} />
      </MockedProvider>,
    );

    expect(screen.getByText('Add Item to Test Section')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Enter the URL of the article you want to add to this section.',
      ),
    ).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddSectionItemModal {...defaultProps} isOpen={false} />
      </MockedProvider>,
    );

    expect(
      screen.queryByText('Add Item to Test Section'),
    ).not.toBeInTheDocument();
  });

  it('should show error for invalid URL', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddSectionItemModal {...defaultProps} />
      </MockedProvider>,
    );

    const urlInput = screen.getByLabelText('Article URL');
    const submitButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(urlInput, { target: { value: 'not-a-valid-url' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });
  });

  it('should disable submit button when URL is empty', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddSectionItemModal {...defaultProps} />
      </MockedProvider>,
    );

    const urlInput = screen.getByLabelText('Article URL');
    const submitButton = screen.getByRole('button', { name: /add item/i });

    // Button should be disabled when URL field is empty
    expect(urlInput).toHaveValue('');
    expect(submitButton).toBeDisabled();
  });

  it('should show error if URL already exists in section', async () => {
    const existingSectionItems = [
      {
        approvedItem: {
          url: 'https://example.com/article',
          externalId: 'item-1',
        },
      },
    ];

    const mocks = [
      {
        request: {
          query: getUrlMetadata,
          variables: { url: 'https://example.com/article' },
        },
        result: {
          data: {
            getUrlMetadata: {
              url: 'https://example.com/article',
              title: 'Article',
              excerpt: 'Excerpt',
              authors: '',
              imageUrl: '',
              publisher: 'Publisher',
              language: 'en',
              isCollection: false,
              isSyndicated: false,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddSectionItemModal
          {...defaultProps}
          existingSectionItems={existingSectionItems}
        />
      </MockedProvider>,
    );

    const urlInput = screen.getByLabelText('Article URL');
    const submitButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(urlInput, {
      target: { value: 'https://example.com/article' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('This item is already in this section.'),
      ).toBeInTheDocument();
    });
  });

  it('should handle existing corpus item', async () => {
    const mockExistingItem = {
      externalId: 'existing-item-123',
      url: 'https://example.com/existing-article',
      title: 'Existing Article',
      excerpt: 'This is an existing article',
      authors: [],
      imageUrl: 'https://example.com/image.jpg',
      publisher: 'Example Publisher',
      language: 'EN',
      topic: 'TECHNOLOGY',
      status: CuratedStatus.Corpus,
      source: CorpusItemSource.Manual,
    };

    const mocks = [
      {
        request: {
          query: getUrlMetadata,
          variables: { url: 'https://example.com/existing-article' },
        },
        result: {
          data: {
            getUrlMetadata: {
              url: 'https://example.com/existing-article',
              title: 'Existing Article',
              excerpt: 'This is an existing article',
              authors: '',
              imageUrl: 'https://example.com/image.jpg',
              publisher: 'Example Publisher',
              language: 'en',
              isCollection: false,
              isSyndicated: false,
            },
          },
        },
      },
      {
        request: {
          query: getApprovedItemByUrl,
          variables: { url: 'https://example.com/existing-article' },
        },
        result: {
          data: {
            getApprovedCorpusItemByUrl: mockExistingItem,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddSectionItemModal {...defaultProps} />
      </MockedProvider>,
    );

    const urlInput = screen.getByLabelText('Article URL');
    const submitButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(urlInput, {
      target: { value: 'https://example.com/existing-article' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetApprovedItem).toHaveBeenCalledWith(
        expect.objectContaining({
          externalId: 'existing-item-123',
          title: 'Existing Article',
        }),
      );
      expect(mockSetIsRecommendation).toHaveBeenCalledWith(false);
      expect(mockSetIsManualSubmission).toHaveBeenCalledWith(true);
      expect(mockToggleApprovedItemModal).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should handle new item with metadata', async () => {
    const mockMetadata = {
      url: 'https://example.com/new-article',
      title: 'New Article Title',
      excerpt: 'This is a new article excerpt',
      authors: 'John Doe, Jane Smith',
      imageUrl: 'https://example.com/new-image.jpg',
      publisher: 'New Publisher',
      language: 'en',
      topic: 'BUSINESS',
      isCollection: false,
      isTimeSensitive: false,
      isSyndicated: false,
    };

    const mocks = [
      {
        request: {
          query: getApprovedItemByUrl,
          variables: { url: 'https://example.com/new-article' },
        },
        result: {
          data: {
            getApprovedCorpusItemByUrl: null,
          },
        },
      },
      {
        request: {
          query: getUrlMetadata,
          variables: { url: 'https://example.com/new-article' },
        },
        result: {
          data: {
            getUrlMetadata: mockMetadata,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AddSectionItemModal {...defaultProps} />
      </MockedProvider>,
    );

    const urlInput = screen.getByLabelText('Article URL');
    const submitButton = screen.getByRole('button', { name: /add item/i });

    fireEvent.change(urlInput, {
      target: { value: 'https://example.com/new-article' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetApprovedItem).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Article Title',
          excerpt: 'This is a new article excerpt',
          language: 'EN',
          topic: 'BUSINESS',
        }),
      );
      expect(mockSetIsRecommendation).toHaveBeenCalledWith(false);
      expect(mockSetIsManualSubmission).toHaveBeenCalledWith(true);
      expect(mockToggleApprovedItemModal).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddSectionItemModal {...defaultProps} />
      </MockedProvider>,
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should enable submit button when URL is entered', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddSectionItemModal {...defaultProps} />
      </MockedProvider>,
    );

    const urlInput = screen.getByLabelText('Article URL');
    const submitButton = screen.getByRole('button', { name: /add item/i });

    // Initially disabled
    expect(submitButton).toBeDisabled();

    // Should enable when URL is entered
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    expect(submitButton).not.toBeDisabled();
  });
});
