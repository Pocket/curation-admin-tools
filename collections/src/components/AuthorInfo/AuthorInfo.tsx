import React, { useState } from 'react';
import { Box, CardMedia, Grid, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { Button, Modal } from '../';
import { AuthorModel } from '../../api';
import { useStyles } from './AuthorInfo.styles';
import { FileWithPath, useDropzone } from 'react-dropzone';

interface AuthorInfoProps {
  /**
   * An object with everything author-related in it.
   */
  author: AuthorModel;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = (props): JSX.Element => {
  const { author } = props;
  const classes = useStyles();

  const hasImage = author.imageUrl && author.imageUrl.length > 0;

  const [imageUploadOpen, setImageUploadOpen] = useState<boolean>(false);

  const handleImageUploadClose = () => {
    setImageUploadOpen(false);
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
  });

  const uploadedImages = acceptedFiles.map((file: FileWithPath) => (
    <p key={file.path}>
      Name: {file.name}
      <br />
      Size: {file.size} bytes
      <br />
      Type: {file.type}
    </p>
  ));

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            src={hasImage ? author.imageUrl : '/placeholders/author.svg'}
            alt={author.name}
            className={classes.image}
            onClick={() => {
              setImageUploadOpen(true);
            }}
          />
          <Modal open={imageUploadOpen} handleClose={handleImageUploadClose}>
            <Box {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag and drop an image here, or click to select one</p>
              {uploadedImages.length > 0 ? <h4>About to upload:</h4> : null}
              {uploadedImages}
            </Box>
          </Modal>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>{author.active ? 'Active' : 'Inactive'}</span>
          </Typography>
          <ReactMarkdown>{author.bio}</ReactMarkdown>
        </Grid>
      </Grid>
    </>
  );
};
