import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { CustomSectionFormConnector } from '../';

interface CreateCustomSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledSurfaceGuid: string;
  onSuccess?: (sectionId?: string) => void;
}

export const CreateCustomSectionModal: React.FC<
  CreateCustomSectionModalProps
> = ({ isOpen, onClose, scheduledSurfaceGuid, onSuccess }) => {
  const handleSuccess = (sectionId?: string) => {
    onClose();
    if (onSuccess) {
      onSuccess(sectionId);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create a Custom Section</DialogTitle>
      <DialogContent>
        <CustomSectionFormConnector
          scheduledSurfaceGuid={scheduledSurfaceGuid}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
