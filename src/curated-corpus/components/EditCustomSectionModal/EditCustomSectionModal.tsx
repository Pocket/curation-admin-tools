import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { CustomSectionFormConnector } from '../';
import { Section } from '../../../api/generatedTypes';

interface EditCustomSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section;
  scheduledSurfaceGuid: string;
  onSuccess?: () => void;
}

export const EditCustomSectionModal: React.FC<EditCustomSectionModalProps> = ({
  isOpen,
  onClose,
  section,
  scheduledSurfaceGuid,
  onSuccess,
}) => {
  const handleSuccess = () => {
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleDelete = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Custom Section</DialogTitle>
      <DialogContent sx={{ pt: 3, overflow: 'visible' }}>
        <CustomSectionFormConnector
          scheduledSurfaceGuid={scheduledSurfaceGuid}
          onSuccess={handleSuccess}
          onCancel={onClose}
          onDelete={handleDelete}
          existingSection={section}
          isEditMode={true}
        />
      </DialogContent>
    </Dialog>
  );
};
