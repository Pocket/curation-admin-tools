import React, { useState } from 'react';
import { Box, CardMedia, Grid, Typography } from '@material-ui/core';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { AuthorModel, CollectionModel, StoryModel } from '../../api';
import { Button, Modal } from '../';
import { useStyles } from './ImageUpload.styles';

interface ImageUploadProps {
  entity: AuthorModel | CollectionModel | StoryModel;

  placeholder: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = (props): JSX.Element => {
  const classes = useStyles();
  const { entity, placeholder } = props;

  const hasImage = entity.imageUrl && entity.imageUrl.length > 0;

  const [imageUploadOpen, setImageUploadOpen] = useState<boolean>(false);

  const handleClose = () => {
    setImageUploadOpen(false);
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
  });

  const uploadedImages = acceptedFiles.map((file: FileWithPath) => (
    <Typography align="center" key={file.path}>
      Name: {file.name}
      <br />
      Size: {file.size} bytes
      <br />
      Type: {file.type}
    </Typography>
  ));

  return (
    <>
      <CardMedia
        component="img"
        src={hasImage ? entity.imageUrl : placeholder}
        className={classes.image}
        onClick={() => {
          setImageUploadOpen(true);
        }}
      />
      <Modal open={imageUploadOpen} handleClose={handleClose}>
        <Grid container>
          <Grid item xs={12}>
            <Box {...getRootProps({ className: classes.dropzone })} pt={2}>
              <input {...getInputProps()} />
              <Typography align="center">
                Drag and drop an image here, or click to select one
              </Typography>
              <Box pt={4}>
                {uploadedImages.length > 0 ? (
                  <Typography variant="h6" align="center">
                    Selected:
                  </Typography>
                ) : null}
                {uploadedImages}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Box p={1}>
                <Button buttonType="positive" type="submit">
                  Save
                </Button>
              </Box>
              <Box p={1}>
                <Button buttonType="hollow-neutral" onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
