import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import { DateTime } from 'luxon';
import {
  ApprovedCorpusItem,
  Prospect,
  SectionItem,
  SectionStatus,
  useGetSectionsWithSectionItemsQuery,
} from '../../../api/generatedTypes';
import { SectionItemCardWrapper } from '../SectionItemCardWrapper/SectionItemCardWrapper';
import {
  AddProspectModal,
  ApprovedItemModal,
  DuplicateProspectModal,
} from '..';
import { HandleApiResponse } from '../../../_shared/components';
import { useToggle } from '../../../_shared/hooks';
import { getIABCategoryTreeLabel } from '../../helpers/helperFunctions';
import { curationPalette } from '../../../theme';

interface CustomSectionDetailsProps {
  /**
   * Callback to set the current section item (to work on, e.g. edit or remove)
   */
  setCurrentSectionItem: React.Dispatch<
    React.SetStateAction<Omit<SectionItem, '__typename'> | undefined>
  >;
  /**
   * A toggle function for the "Edit this item" modal
   */
  toggleEditModal: VoidFunction;
  /**
   * A toggle function for the "Reject this item" modal
   */
  toggleRejectModal: VoidFunction;
  /**
   * A toggle function for the "Remove this section item" modal
   */
  toggleRemoveSectionItemModal: VoidFunction;
  /**
   * The scheduled surface guid for the current surface
   */
  scheduledSurfaceGuid: string;
}

export const CustomSectionDetails: React.FC<CustomSectionDetailsProps> = ({
  setCurrentSectionItem,
  toggleEditModal,
  toggleRejectModal,
  toggleRemoveSectionItemModal,
  scheduledSurfaceGuid,
}) => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const history = useHistory();

  // State for modals
  const [addProspectModalOpen, toggleAddProspectModal] = useToggle(false);
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);
  const [duplicateProspectModalOpen, toggleDuplicateProspectModal] =
    useToggle(false);

  // State for current items
  const [, setCurrentProspect] = useState<Prospect | undefined>();
  const [approvedItem, setApprovedItem] = useState<
    ApprovedCorpusItem | undefined
  >();
  const [isRecommendation, setIsRecommendation] = useState<boolean>(false);
  const [, setIsManualSubmission] = useState<boolean>(true);

  // Fetch sections data and filter for the specific section
  const { data, loading, error } = useGetSectionsWithSectionItemsQuery({
    variables: { scheduledSurfaceGuid: scheduledSurfaceGuid },
    fetchPolicy: 'cache-and-network',
  });

  // Find the specific section by externalId
  const section = data?.getSectionsWithSectionItems?.find(
    (s) => s.externalId === sectionId,
  );

  const getStatusChip = () => {
    if (!section) return null;

    const status = section.status as SectionStatus | null;

    if (status === SectionStatus.Disabled || section.disabled) {
      return (
        <Chip
          label="Disabled"
          size="small"
          sx={{
            backgroundColor: curationPalette.lightGrey,
            color: curationPalette.regularGrey,
            fontWeight: 500,
          }}
        />
      );
    }

    if (status === SectionStatus.Expired) {
      return (
        <Chip
          label="Expired"
          size="small"
          sx={{
            backgroundColor: '#FFF0F0',
            color: curationPalette.secondary,
            fontWeight: 500,
          }}
        />
      );
    }

    if (status === SectionStatus.Scheduled) {
      return (
        <Chip
          label="Scheduled"
          size="small"
          sx={{
            backgroundColor: curationPalette.lightGrey,
            color: curationPalette.regularGrey,
            fontWeight: 500,
          }}
        />
      );
    }

    if (status === SectionStatus.Live || section.active) {
      return (
        <Chip
          label="Live"
          size="small"
          sx={{
            backgroundColor: curationPalette.lightGreen,
            color: curationPalette.primary,
            fontWeight: 500,
          }}
        />
      );
    }

    return null;
  };

  if (loading) {
    return <HandleApiResponse loading={loading} error={error} />;
  }

  if (error || !section) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          sx={{ mb: 3 }}
        >
          Back to Custom Sections
        </Button>
        <HandleApiResponse
          loading={false}
          error={error || new Error('Section not found')}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with back button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          sx={{ mb: 2 }}
        >
          Back to Custom Sections
        </Button>
      </Box>

      {/* Section Header */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #E0E0E6', mb: 3 }}>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box flex={1}>
            {/* Title and Status */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography
                variant="h4"
                sx={{
                  color: curationPalette.pocketBlack,
                  fontWeight: 500,
                  lineHeight: '1.2125em',
                }}
              >
                {section.title}
              </Typography>
              {getStatusChip()}
            </Box>

            {/* Description/Subtitle */}
            {section.description && (
              <Typography
                variant="body1"
                sx={{ color: curationPalette.regularGrey, mb: 2 }}
              >
                {section.description}
              </Typography>
            )}

            {/* Hero Title & Description */}
            {(section.heroTitle || section.heroDescription) && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: '#F5F5F7',
                  borderRadius: 1,
                }}
              >
                {section.heroTitle && (
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Hero: {section.heroTitle}
                  </Typography>
                )}
                {section.heroDescription && (
                  <Typography
                    variant="body2"
                    sx={{ color: curationPalette.regularGrey }}
                  >
                    {section.heroDescription}
                  </Typography>
                )}
              </Box>
            )}

            {/* Metadata Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body2">
                  {section.startDate
                    ? DateTime.fromISO(section.startDate).toFormat(
                        'MMM dd, yyyy',
                      )
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body2">
                  {section.endDate
                    ? DateTime.fromISO(section.endDate).toFormat('MMM dd, yyyy')
                    : 'Indefinite'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Section Items
                </Typography>
                <Typography variant="body2">
                  {section.sectionItems?.length || 0} items
                </Typography>
              </Grid>
            </Grid>

            {/* IAB Category */}
            {section.iab && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  variant="outlined"
                  color="primary"
                  label={getIABCategoryTreeLabel(
                    'IAB-3.0',
                    section.iab.categories[0],
                  )}
                  icon={<AdUnitsIcon />}
                />
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1} ml={3}>
            {/* Edit and Delete buttons */}
            <IconButton
              size="small"
              sx={{
                '&:hover': { backgroundColor: '#F5F5F7' },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                '&:hover': { backgroundColor: '#FFF0F0' },
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Section Items */}
      {section.sectionItems && section.sectionItems.length > 0 && (
        <>
          <Typography
            variant="h5"
            sx={{
              color: curationPalette.pocketBlack,
              fontWeight: 500,
              lineHeight: '1.2125em',
              marginBottom: '1em',
              marginTop: '1em',
            }}
          >
            Section Items
          </Typography>
          <Grid container spacing={2}>
            {section.sectionItems.map((item: SectionItem) => (
              <SectionItemCardWrapper
                key={item.externalId}
                item={item.approvedItem}
                onEdit={() => {
                  setCurrentSectionItem(item);
                  toggleEditModal();
                }}
                onReject={() => {
                  setCurrentSectionItem(item);
                  toggleRejectModal();
                }}
                onRemove={() => {
                  setCurrentSectionItem(item);
                  toggleRemoveSectionItemModal();
                }}
                scheduledSurfaceGuid={scheduledSurfaceGuid}
              />
            ))}
          </Grid>
        </>
      )}

      {/* Empty State */}
      {(!section.sectionItems || section.sectionItems.length === 0) && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '1px solid #E0E0E6',
            mt: 3,
          }}
        >
          <Typography color="text.secondary">
            No items in this section yet
          </Typography>
          <Button
            variant="contained"
            onClick={() => toggleAddProspectModal()}
            sx={{
              mt: 2,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              WebkitTapHighlightColor: 'transparent',
              outline: 0,
              border: 0,
              margin: '16px 0 0 0',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              WebkitAppearance: 'none',
              textDecoration: 'none',
              fontSize: '0.875rem',
              lineHeight: 1.75,
              minWidth: 64,
              padding: '6px 16px',
              borderRadius: '4px',
              transition:
                'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              color: '#FFFFFF',
              boxShadow:
                '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
              fontWeight: 500,
              textTransform: 'none',
              backgroundColor: '#008078',
              '&:hover': {
                backgroundColor: '#006660',
              },
            }}
          >
            Add Items
          </Button>
        </Paper>
      )}

      {/* Modals for adding items */}
      <AddProspectModal
        isOpen={addProspectModalOpen}
        toggleModal={toggleAddProspectModal}
        toggleApprovedItemModal={toggleApprovedItemModal}
        toggleDuplicateProspectModal={toggleDuplicateProspectModal}
        setCurrentProspect={setCurrentProspect}
        setApprovedItem={setApprovedItem}
        setIsRecommendation={setIsRecommendation}
        setIsManualSubmission={setIsManualSubmission}
      />

      {approvedItem && (
        <ApprovedItemModal
          approvedItem={approvedItem}
          isOpen={approvedItemModalOpen}
          isRecommendation={isRecommendation}
          toggleModal={toggleApprovedItemModal}
          onSave={() => {
            // Handle save action
            toggleApprovedItemModal();
          }}
        />
      )}

      {approvedItem && duplicateProspectModalOpen && (
        <DuplicateProspectModal
          isOpen={duplicateProspectModalOpen}
          approvedItem={approvedItem}
          toggleModal={toggleDuplicateProspectModal}
        />
      )}
    </Box>
  );
};
