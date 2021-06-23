import React, { useState } from 'react';
import {
  Box,
  Button as MuiButton,
  Card,
  CardActions,
  CardMedia,
  Grid,
  Hidden,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Dropzone, { FileWithPath } from 'react-dropzone';
import { Button, Modal } from '../';
import { useStyles } from './ImageUpload.styles';
import { formatFileSize } from '../../utils/formatFileSize';
import { useNotifications } from '../../hooks/useNotifications';
import {
  Collection,
  CollectionAuthor,
  CollectionStory,
  useImageUploadMutation,
} from '../../api/collection-api/generatedTypes';

interface ImageUploadProps {
  /**
   * Any entity with a customizable image
   */
  entity: Omit<Collection, 'stories'> | CollectionAuthor | CollectionStory;

  /**
   * A path to a placeholder image to show if no image is available
   */
  placeholder: string;

  /**
   * A method to call once the image is uploaded to S3 - this typically executes
   * another mutation linking the freshly uploaded image to the entity
   *
   * @param url
   */
  onImageSave: (url: string) => void;
}

/**
 * A component that displays an image for an entity such as a Collection or
 * CollectionAuthor, or a placeholder if no image is available.
 *
 * On click, this component opens up a modal with a drag'n'droppable area
 * where the user can upload a new image.
 *
 * @param props
 * @constructor
 */
export const ImageUpload: React.FC<ImageUploadProps> = (props): JSX.Element => {
  const classes = useStyles();
  const { entity, placeholder, onImageSave } = props;
  const { showNotification } = useNotifications();

  // These state vars are used to show/hide the file upload modal and progress bar
  const [imageUploadOpen, setImageUploadOpen] = useState<boolean>(false);
  const [uploadInfo, setUploadInfo] = useState<JSX.Element[] | null>(null);
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

  // These are for the uploaded file itself
  const [file, setFile] = useState<any>(null);
  const [imageData, setImageData] = useState<{
    contents: string;
    size: number;
    height: number;
    width: number;
  }>({ contents: '', size: 0, height: 0, width: 0 });

  // And these ones are for figuring out whether to show the uploaded image
  // or a placeholder
  const [imageSrc, setImageSrc] = useState<string>(entity.imageUrl);
  const [hasImage, setHasImage] = useState<boolean>(
    !!(imageSrc && imageSrc.length > 0)
  );

  // Close the image upload modal when user clicks away or presses the "Cancel" button
  const handleClose = () => {
    setImageUploadOpen(false);
  };

  // prepare the upload to S3 mutation
  const [uploadImage] = useImageUploadMutation();

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    // Show information about the uploaded file
    const uploads = acceptedFiles.map((file: FileWithPath) => {
      setFile(file);
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
    setUploadInProgress(true);

    // Let's upload this thing to S3!
    uploadImage({
      variables: {
        image: file,
        height: imageData.height,
        width: imageData.width,
        fileSizeBytes: imageData.size,
      },
    })
      .then((data) => {
        setUploadInProgress(false);

        if (data.data && data.data.collectionImageUpload) {
          setImageSrc(data.data.collectionImageUpload.url);
          setImageUploadOpen(false);
          setHasImage(true);
          showNotification('Image successfully uploaded to S3', 'success');

          // Pass the URL to the parent component function
          onImageSave(data.data.collectionImageUpload.url);
        }
      })
      .catch((error) => {
        setUploadInProgress(false);
        showNotification(error.message, 'error');
      });
  };

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          src={hasImage ? imageSrc : placeholder}
          className={hasImage ? classes.image : classes.placeholder}
          onClick={() => {
            setImageUploadOpen(true);
          }}
        />
        <CardActions disableSpacing={true} className={classes.cardActions}>
          <MuiButton
            size="small"
            color="primary"
            onClick={() => {
              setImageUploadOpen(true);
            }}
          >
            <CloudUploadIcon className={classes.uploadIcon} />
            <Hidden smDown implementation="css">
              Update image
            </Hidden>
          </MuiButton>
        </CardActions>
      </Card>

      <Modal open={imageUploadOpen} handleClose={handleClose}>
        <Grid container>
          <Grid item xs={12}>
            <Dropzone onDrop={onDrop} maxFiles={1} accept="image/*">
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps({
                    className: classes.dropzone,
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
                    {uploadInProgress && (
                      <Box pt={3} mx={2}>
                        <LinearProgress />
                      </Box>
                    )}
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
