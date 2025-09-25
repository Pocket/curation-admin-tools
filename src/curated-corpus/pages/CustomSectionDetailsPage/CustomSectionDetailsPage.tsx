import React, { useState } from 'react';
import {
  CustomSectionDetails,
  EditCorpusItemAction,
  RejectCorpusItemAction,
} from '../../components';
import { RemoveSectionItemAction } from '../../components/actions/RemoveSectionItemAction/RemoveSectionItemAction';
import { ActionScreen, SectionItem } from '../../../api/generatedTypes';
import { useParams } from 'react-router-dom';
import { useToggle } from '../../../_shared/hooks';

export const CustomSectionDetailsPage: React.FC = () => {
  const { surfaceGuid } = useParams<{ surfaceGuid: string }>();
  const [editItemModalOpen, toggleEditModal] = useToggle(false);
  const [rejectItemModalOpen, toggleRejectModal] = useToggle(false);
  const [removeSectionItemModalOpen, toggleRemoveSectionItemModal] =
    useToggle(false);
  const [currentSectionItem, setCurrentSectionItem] = useState<
    Omit<SectionItem, '__typename'> | undefined
  >();

  return (
    <>
      <CustomSectionDetails
        setCurrentSectionItem={setCurrentSectionItem}
        toggleEditModal={toggleEditModal}
        toggleRejectModal={toggleRejectModal}
        toggleRemoveSectionItemModal={toggleRemoveSectionItemModal}
        scheduledSurfaceGuid={surfaceGuid || ''}
      />

      {currentSectionItem?.approvedItem && (
        <>
          <EditCorpusItemAction
            item={currentSectionItem.approvedItem}
            actionScreen={ActionScreen.Sections}
            modalOpen={editItemModalOpen}
            toggleModal={toggleEditModal}
          />
          <RejectCorpusItemAction
            item={currentSectionItem.approvedItem}
            actionScreen={ActionScreen.Sections}
            modalOpen={rejectItemModalOpen}
            toggleModal={toggleRejectModal}
          />
          <RemoveSectionItemAction
            sectionItem={currentSectionItem}
            modalOpen={removeSectionItemModalOpen}
            toggleModal={toggleRemoveSectionItemModal}
          />
        </>
      )}
    </>
  );
};
