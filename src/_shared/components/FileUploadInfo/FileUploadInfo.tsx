import React from 'react';
import { FileWithPath } from 'react-dropzone';
import { Typography } from '@material-ui/core';
import { formatFileSize } from '../../../_shared/utils/formatFileSize';
import { useStyles } from './FileUploadInfo.styles';

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
  const classes = useStyles();

  return (
    <Typography align="center" component="div">
      <p className={classes.p}>Name: {file.name}</p>
      <p className={classes.p}>Size: {formatFileSize(file.size)}</p>
      <p className={classes.p}>Type: {file.type}</p>
    </Typography>
  );
};
