import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormikHelpers, FormikValues } from 'formik';
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import { DateTime } from 'luxon';
import { useMutation } from '@apollo/client';
import {
  ApprovedCorpusItem,
  SectionItem,
  SectionStatus,
  CreateSectionItemInput,
  CreateApprovedCorpusItemInput,
  useGetSectionsWithSectionItemsQuery,
  useCreateSectionItemMutation,
  useCreateApprovedCorpusItemMutation,
  ActionScreen,
  CuratedStatus,
  CorpusItemSource,
  CorpusLanguage,
} from '../../../api/generatedTypes';
import { deleteCustomSection } from '../../../api/mutations/deleteCustomSection';
import { disableEnableSection } from '../../../api/mutations/disableEnableSection';
import { removeSectionItem } from '../../../api/mutations/removeSectionItem';
import { SectionItemCardWrapper } from '../SectionItemCardWrapper/SectionItemCardWrapper';
import {
  AddSectionItemModal,
  ApprovedItemModal,
  DuplicateProspectModal,
  EditCustomSectionModal,
  DeleteConfirmationModal,
  RemoveSectionItemModal,
} from '..';
import { HandleApiResponse } from '../../../_shared/components';
import { useToggle, useRunMutation } from '../../../_shared/hooks';
import { getIABCategoryTreeLabel } from '../../helpers/helperFunctions';
import { curationPalette } from '../../../theme';
import { ApprovedItemFromProspect } from '../../helpers/definitions';

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
  const { runMutation } = useRunMutation();
  const [deleteSectionMutation] = useMutation(deleteCustomSection);
  const [disableEnableMutation] = useMutation(disableEnableSection);
  const [removeItemMutation] = useMutation(removeSectionItem);
  const [createSectionItem] = useCreateSectionItemMutation();
  const [createApprovedItem] = useCreateApprovedCorpusItemMutation();

  // State for modals
  const [addItemModalOpen, toggleAddItemModal] = useToggle(false);
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);
  const [duplicateProspectModalOpen, toggleDuplicateProspectModal] =
    useToggle(false);
  const [editSectionModalOpen, toggleEditSectionModal] = useToggle(false);
  const [deleteModalOpen, toggleDeleteModal] = useToggle(false);
  const [removeItemModalOpen, toggleRemoveItemModal] = useToggle(false);

  // State for current items
  const [approvedItem, setApprovedItem] = useState<
    ApprovedCorpusItem | undefined
  >();
  const [isRecommendation, setIsRecommendation] = useState<boolean>(false);
  const [, setIsManualSubmission] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<SectionItem | undefined>();

  const blankApprovedItem: ApprovedItemFromProspect = {
    __typename: 'ApprovedCorpusItem',
    externalId: '',
    authors: [],
    createdAt: 0,
    createdBy: '',
    datePublished: null,
    excerpt: '',
    hasTrustedDomain: false,
    imageUrl: '',
    isCollection: false,
    isSyndicated: false,
    isTimeSensitive: false,
    language: CorpusLanguage.En,
    prospectId: null,
    publisher: '',
    scheduledSurfaceHistory: [],
    source: CorpusItemSource.Manual,
    status: CuratedStatus.Recommendation,
    title: '',
    topic: '',
    updatedAt: 0,
    updatedBy: null,
    url: '',
  };

  // Fetch sections data and filter for the specific section
  const { data, loading, error, refetch } = useGetSectionsWithSectionItemsQuery(
    {
      variables: { scheduledSurfaceGuid: scheduledSurfaceGuid },
      fetchPolicy: 'cache-and-network',
    },
  );

  // Find the specific section by externalId
  const sections = data?.getSectionsWithSectionItems || [];
  const section = sections.find((s) => s.externalId === sectionId);

  const handleToggleDisable = async () => {
    if (!section) return;

    await runMutation(
      disableEnableMutation,
      {
        variables: {
          data: {
            externalId: section.externalId,
            disabled: !section.disabled,
          },
        },
      },
      section.disabled
        ? 'Section enabled successfully'
        : 'Section disabled successfully',
      () => {
        refetch();
      },
      () => {
        // Error handling
      },
    );
  };

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
            backgroundColor: curationPalette.lightRed,
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

  const handleSaveApprovedItem = async (values: any, formikHelpers: any) => {
    if (!section) {
      return;
    }

    try {
      let itemToAdd = approvedItem;

      // If the item doesn't have an externalId, it's a new item we need to create
      if (!approvedItem?.externalId) {
        // Transform authors - check if it's already an array or needs conversion
        const authorsArray = Array.isArray(values.authors)
          ? values.authors
          : values.authors
            ? values.authors.split(',').map((name: string) => ({
                name: name.trim(),
                sortOrder: 0,
              }))
            : [];

        // Transform the values into the format needed for creating an approved item
        const createItemData: CreateApprovedCorpusItemInput = {
          url: values.url,
          title: values.title,
          excerpt: values.excerpt,
          status:
            (values.curationStatus as CuratedStatus | undefined) ??
            CuratedStatus.Recommendation,
          language:
            (values.language as CorpusLanguage | undefined) ??
            CorpusLanguage.En,
          authors: authorsArray,
          publisher: values.publisher,
          datePublished: values.datePublished,
          source:
            (values.source as CorpusItemSource | undefined) ??
            CorpusItemSource.Manual,
          imageUrl: values.imageUrl,
          topic: values.topic || '',
          isCollection: values.collection || false,
          isTimeSensitive: values.timeSensitive || false,
          isSyndicated: values.syndicated || false,
          actionScreen: ActionScreen.Sections,
          scheduledSurfaceGuid,
        };

        // Create the approved item first
        const { data } = await createApprovedItem({
          variables: { data: createItemData },
        });

        if (data?.createApprovedCorpusItem) {
          itemToAdd = data.createApprovedCorpusItem;
        } else {
          throw new Error('Failed to create approved item');
        }
      }

      // Now add the item to the section
      if (itemToAdd?.externalId) {
        const input: CreateSectionItemInput = {
          sectionExternalId: section.externalId,
          approvedItemExternalId: itemToAdd.externalId,
          // Determine the next rank by taking the highest existing rank (defaulting gaps to 0)
          // and incrementing it so new items always append to the end without duplicates.
          rank:
            Math.max(
              0,
              ...(section.sectionItems?.map((item) => item.rank || 0) || []),
            ) + 1,
        };

        await runMutation(
          createSectionItem,
          {
            variables: {
              data: input,
            },
          },
          'Item created and added to section successfully',
          () => {
            // Close the modal first
            toggleApprovedItemModal();

            // Clear state immediately
            setApprovedItem(undefined);

            formikHelpers.setSubmitting(false);

            // Refetch to update the section items list
            refetch();
          },
          () => {
            formikHelpers.setSubmitting(false);
          },
        );
      }
    } catch (error) {
      formikHelpers.setSubmitting(false);
    }
  };

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
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${curationPalette.border}`,
          mb: 3,
        }}
      >
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
                  backgroundColor: curationPalette.veryLightGrey,
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
          <Box display="flex" gap={2} ml={3} alignItems="center">
            {/* Disable/Enable Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={!section.disabled}
                  onChange={handleToggleDisable}
                  color="primary"
                />
              }
              label={section.disabled ? 'Disabled' : 'Enabled'}
            />

            {/* Edit and Delete buttons */}
            <IconButton
              size="small"
              onClick={toggleEditSectionModal}
              sx={{
                '&:hover': { backgroundColor: curationPalette.veryLightGrey },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={toggleDeleteModal}
              sx={{
                '&:hover': { backgroundColor: curationPalette.lightRed },
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Section Items */}
      <Box sx={{ mt: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{
              color: curationPalette.pocketBlack,
              fontWeight: 500,
              lineHeight: '1.2125em',
            }}
          >
            Section Items
          </Typography>
          {section.sectionItems && section.sectionItems.length > 0 && (
            <Button
              variant="contained"
              onClick={toggleAddItemModal}
              size="small"
            >
              Add Items
            </Button>
          )}
        </Box>
        {section.sectionItems && section.sectionItems.length > 0 && (
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
                  setItemToRemove(item);
                  toggleRemoveItemModal();
                }}
                scheduledSurfaceGuid={scheduledSurfaceGuid}
              />
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {(!section.sectionItems || section.sectionItems.length === 0) && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              border: `1px solid ${curationPalette.border}`,
              mt: 3,
            }}
          >
            <Typography color="text.secondary">
              No items in this section yet
            </Typography>
            <Button
              variant="contained"
              onClick={toggleAddItemModal}
              sx={{ mt: 2 }}
            >
              Add Items
            </Button>
          </Paper>
        )}
      </Box>

      {/* Modal for adding items */}
      <AddSectionItemModal
        isOpen={addItemModalOpen}
        onClose={toggleAddItemModal}
        sectionId={sectionId}
        sectionTitle={section.title}
        existingSectionItems={section.sectionItems}
        toggleApprovedItemModal={toggleApprovedItemModal}
        setApprovedItem={setApprovedItem}
        setIsRecommendation={setIsRecommendation}
        setIsManualSubmission={setIsManualSubmission}
        onSuccess={() => {
          refetch();
        }}
      />

      {(approvedItem || approvedItemModalOpen) && (
        <ApprovedItemModal
          approvedItem={approvedItem || blankApprovedItem}
          isOpen={approvedItemModalOpen}
          isRecommendation={isRecommendation}
          toggleModal={() => {
            // Force blur to release focus trap
            const activeElement = document.activeElement as HTMLElement;
            if (activeElement && activeElement.blur) {
              activeElement.blur();
            }

            // Close modal and clear state
            toggleApprovedItemModal();
            setApprovedItem(undefined);
          }}
          onSave={handleSaveApprovedItem}
        />
      )}

      {approvedItem && duplicateProspectModalOpen && (
        <DuplicateProspectModal
          isOpen={duplicateProspectModalOpen}
          approvedItem={approvedItem}
          toggleModal={toggleDuplicateProspectModal}
        />
      )}

      {/* Edit Section Modal */}
      {section && (
        <EditCustomSectionModal
          isOpen={editSectionModalOpen}
          onClose={toggleEditSectionModal}
          section={section}
          scheduledSurfaceGuid={scheduledSurfaceGuid}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={toggleDeleteModal}
        onConfirm={async () => {
          if (section) {
            await runMutation(
              deleteSectionMutation,
              {
                variables: {
                  externalId: section.externalId,
                },
              },
              'Custom section deleted successfully',
              () => {
                toggleDeleteModal();
                history.push(`/curated-corpus/custom-sections/`);
              },
              () => {
                toggleDeleteModal();
              },
            );
          }
        }}
      />

      {/* Remove Item Modal - reuses the same modal as ML sections */}
      {itemToRemove && (
        <RemoveSectionItemModal
          itemTitle={itemToRemove.approvedItem.title}
          isOpen={removeItemModalOpen}
          onSave={(values: FormikValues, formikHelpers: FormikHelpers<any>) => {
            // Run the mutation with the selected removal reasons from the form
            runMutation(
              removeItemMutation,
              {
                variables: {
                  data: {
                    externalId: itemToRemove.externalId,
                    deactivateReasons: values.removalReasons,
                  },
                },
              },
              'Item removed from section successfully',
              () => {
                toggleRemoveItemModal();
                setItemToRemove(undefined);
                formikHelpers.setSubmitting(false);
                refetch();
              },
              () => {
                formikHelpers.setSubmitting(false);
              },
            );
          }}
          toggleModal={() => {
            toggleRemoveItemModal();
            setItemToRemove(undefined);
          }}
        />
      )}
    </Box>
  );
};
