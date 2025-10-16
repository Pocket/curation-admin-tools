import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  useGetApprovedItemByUrlLazyQuery,
  useGetUrlMetadataLazyQuery,
  CuratedStatus,
  CorpusItemSource,
  UrlMetadata,
} from '../../../api/generatedTypes';

interface AddSectionItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  sectionTitle: string;
  onSuccess?: () => void;
  existingSectionItems?: Array<{
    approvedItem: { url: string; externalId: string };
  }>;
  toggleApprovedItemModal: () => void;
  setApprovedItem: (item: any) => void;
  setIsRecommendation: (value: boolean) => void;
  setIsManualSubmission: (value: boolean) => void;
}

export const AddSectionItemModal: React.FC<AddSectionItemModalProps> = ({
  isOpen,
  onClose,
  sectionId,
  sectionTitle,
  onSuccess,
  existingSectionItems = [],
  toggleApprovedItemModal,
  setApprovedItem,
  setIsRecommendation,
  setIsManualSubmission,
}) => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if item already exists in corpus
  const [checkApprovedItem] = useGetApprovedItemByUrlLazyQuery({
    fetchPolicy: 'no-cache',
  });

  // Get URL metadata from parser
  const [getUrlMetadata] = useGetUrlMetadataLazyQuery({
    fetchPolicy: 'no-cache',
  });

  const handleClose = () => {
    // Reset state when closing
    setUrl('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      setError('Please enter a valid URL');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // First check if this URL is already in the section
      const normalizedUrl = url.trim();
      const isUrlAlreadyInSection = existingSectionItems.some(
        (item) => item.approvedItem.url === normalizedUrl,
      );

      if (isUrlAlreadyInSection) {
        setError('This item is already in this section.');
        setIsSubmitting(false);
        return;
      }

      // Step 1: Check if the item already exists in the corpus
      const checkResult = await checkApprovedItem({
        variables: { url: normalizedUrl },
      });

      if (checkResult.data?.getApprovedCorpusItemByUrl) {
        // Item already exists in corpus
        const existingItem = checkResult.data.getApprovedCorpusItemByUrl;

        // Check if this item is already in the current section
        const isAlreadyInSection = existingSectionItems.some(
          (item) => item.approvedItem.externalId === existingItem.externalId,
        );

        if (isAlreadyInSection) {
          setError('This item is already in this section.');
          setIsSubmitting(false);
          return;
        }

        // Set the existing item for editing/review
        setApprovedItem(existingItem);
        setIsRecommendation(false); // Custom sections are Corpus items
        setIsManualSubmission(true);

        // Hide this modal and show the ApprovedItem modal
        handleClose();
        toggleApprovedItemModal();

        setIsSubmitting(false);
        return;
      }

      // Step 2: Item doesn't exist, get metadata from parser
      const metadataResult = await getUrlMetadata({
        variables: { url: normalizedUrl },
      });

      if (!metadataResult.data?.getUrlMetadata) {
        throw new Error('Failed to fetch article metadata');
      }

      const metadata = metadataResult.data.getUrlMetadata;
      const legacyMetadata = metadata as UrlMetadata & {
        image?: string | null;
        topic?: string | null;
        isTimeSensitive?: boolean | null;
      };

      // Parse authors correctly
      const authorsArray = metadata.authors
        ? metadata.authors.split(',').map((name: string) => ({
            name: name.trim(),
            sortOrder: 0,
          }))
        : [];

      const legacyImage = legacyMetadata.image ?? null;

      // Transform metadata to approved item format for the form
      const approvedItemFromMetadata = {
        url: normalizedUrl,
        title: metadata.title || 'Untitled Article',
        excerpt: metadata.excerpt || 'No excerpt available.',
        authors: authorsArray,
        imageUrl: metadata.imageUrl || legacyImage || '',
        publisher: metadata.publisher || metadata.domain || 'Unknown',
        language: metadata.language ? metadata.language.toUpperCase() : 'EN',
        topic: legacyMetadata.topic || '',
        status: CuratedStatus.Corpus,
        source: CorpusItemSource.Manual,
        isCollection: metadata.isCollection || false,
        isTimeSensitive: legacyMetadata.isTimeSensitive || false,
        isSyndicated: metadata.isSyndicated || false,
        externalId: '', // Will be set when saved
      };

      // Set the item data for the ApprovedItem form
      setApprovedItem(approvedItemFromMetadata);
      setIsRecommendation(false); // Custom sections are Corpus items
      setIsManualSubmission(true);

      // Hide this modal and show the ApprovedItem modal
      handleClose();
      toggleApprovedItemModal();

      setIsSubmitting(false);
    } catch (err: any) {
      console.error('Error in add section item flow:', err);

      // Check for specific error messages
      if (err.message?.includes('already exists')) {
        setError('This item already exists in the section.');
      } else if (err.message?.includes('invalid URL')) {
        setError('The URL appears to be invalid. Please check and try again.');
      } else {
        setError(
          'Failed to fetch item metadata. Please check the URL and try again.',
        );
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={!isSubmitting ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Item to {sectionTitle}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the URL of the article you want to add to this section.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            label="Article URL"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null); // Clear error when user types
            }}
            error={!!error && !url}
            disabled={isSubmitting}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isSubmitting) {
                handleSubmit();
              }
            }}
          />
          {isSubmitting && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography
                variant="body2"
                sx={{ mt: 1, color: 'text.secondary' }}
              >
                Processing article and adding to section...
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !url.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
