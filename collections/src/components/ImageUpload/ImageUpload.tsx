import React, { useState } from 'react';
import { Box, CardMedia, Grid, Typography } from '@material-ui/core';
import Dropzone, { FileWithPath } from 'react-dropzone';
import {
  AuthorModel,
  CollectionModel,
  StoryModel,
  useImageUploadMutation,
} from '../../api';
import { Button, Modal } from '../';
import { useStyles } from './ImageUpload.styles';
import { formatFileSize } from '../../utils/formatFileSize';

interface ImageUploadProps {
  entity: AuthorModel | CollectionModel | StoryModel;

  placeholder: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = (props): JSX.Element => {
  const classes = useStyles();
  const { entity, placeholder } = props;

  const [imageUploadOpen, setImageUploadOpen] = useState<boolean>(false);
  const [uploadInfo, setUploadInfo] = useState<JSX.Element[] | null>(null);
  const [imageData, setImageData] = useState<{
    contents: string;
    size: number;
    height: number;
    width: number;
  }>({ contents: '', size: 0, height: 0, width: 0 });

  const hasImage = entity.imageUrl && entity.imageUrl.length > 0;

  const handleClose = () => {
    setImageUploadOpen(false);
  };

  const [uploadImage] = useImageUploadMutation();

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    // Show information about the uploaded file
    const uploads = acceptedFiles.map((file: FileWithPath) => {
      // Get the actual file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        const contents = e.target?.result;

        const image = new Image() as HTMLImageElement;
        if (typeof contents === 'string') {
          image.src = contents;

          image.onload = function () {
            // Yes, even declaring the image as HTMLImageElement is not enough
            // to convince TypeScript. Bringing out the big guns
            setImageData({
              contents,
              size: file.size,
              // @ts-ignore
              height: this.naturalHeight,
              // @ts-ignore
              width: this.naturalWidth,
            });
          };
        }
      };

      return (
        <Typography align="center" key={file.path}>
          Name: {file.name}
          <br />
          Size: {formatFileSize(file.size)}
          <br />
          Type: {file.type}
        </Typography>
      );
    });
    setUploadInfo(uploads);
  };

  const onSave = () => {
    // Let's upload this thing to S3!
    uploadImage({
      variables: {
        image: imageData.contents,
        height: imageData.height,
        width: imageData.width,
        fileSizeBytes: imageData.size,
      },
    })
      .then((data) => {
        console.log(data);
        // TODO: add a notification, set image to new src
      })
      .catch((error) => {
        // TODO: send some errors up the chain
      });
  };

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
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps({
                    className: classes.dropzone,
                    accept: 'image/*',
                    maxFiles: 1,
                    multiple: false,
                  })}
                  pt={2}
                >
                  <input {...getInputProps()} />
                  <Typography align="center">
                    Drag and drop an image here, or click to select one
                  </Typography>
                  <Box pt={4}>
                    {uploadInfo && uploadInfo.length > 0 ? (
                      <Typography variant="h6" align="center">
                        Selected:
                      </Typography>
                    ) : null}
                    {uploadInfo}
                  </Box>
                </Box>
              )}
            </Dropzone>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Box p={1}>
                <Button buttonType="positive" type="submit" onClick={onSave}>
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
