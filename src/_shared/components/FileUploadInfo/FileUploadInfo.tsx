import React from 'react';
import { FileWithPath } from 'react-dropzone';
import { Typography } from '@mui/material';
import { formatFileSize } from '../../utils/formatFileSize';

interface FileUploadInfoProps {
  /**
   * The blob that's about to be uploaded from a user's device
   */
  file: FileWithPath;
}

/**
 * This component is used to show file information on the image upload modal
 * once the user picked an image to use on their PC/device and the browser
 * processed it.
 *
 * @param props
 * @constructor
 */
export const FileUploadInfo: React.FC<FileUploadInfoProps> = (
  props
): JSX.Element => {
  const { file } = props;

  return (
    <Typography align="center" component="div">
      <Typography component="p">Name: {file.name}</Typography>
      <Typography component="p">Size: {formatFileSize(file.size)}</Typography>
      <Typography component="p">Type: {file.type}</Typography>
    </Typography>
  );
};
