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
import { Modal, SharedFormButtons } from '../../../_shared/components';
import { FileUploadInfo } from '../../../_shared/components/FileUploadInfo/FileUploadInfo';
import { useStyles } from './ImageUpload.styles';
import { useNotifications } from '../../../_shared/hooks';
import {
  ApprovedCorpusItem,
  useUploadApprovedCorpusItemImageMutation,
  MutationUploadApprovedCorpusItemImageArgs,
} from '../../../api/generatedTypes';
import { readImageFileFromDisk } from '../../helpers/helperFunctions';
import { ApprovedItemFromProspect } from '../../helpers/definitions';

interface ImageUploadProps {
  /**
   * Approved item entity
   */
  entity: ApprovedCorpusItem | ApprovedItemFromProspect;

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
  onImageSave?: (url: string) => void;
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

  // This state variable stores the image/file data read from the disk
  const [imageData, setImageData] = useState<
    MutationUploadApprovedCorpusItemImageArgs | undefined
  >(undefined);

  // This state variable stores the image url. Default/initial value is
  // of the image on the entity. If the entity doesn't have one, the placeholder
  // string is used. This is set to the s3 url if the user uploads a new image
  const [imageSrc, setImageSrc] = useState<string>(entity.imageUrl);

  // Close the image upload modal when user clicks away or presses the "Cancel" button
  const handleClose = () => {
    setImageUploadOpen(false);
  };

  // prepare the upload to S3 mutation
  const [uploadApprovedItemImage] = useUploadApprovedCorpusItemImageMutation();

  // Process the file the user chose from their PC/mobile device,
  // show file info to the user and set data to use in upload mutation
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const uploads = acceptedFiles.map((file: FileWithPath, index: number) => {
      readImageFileFromDisk(file, () => {
        setImageData({
          data: file,
        });
      });

      // Generate the output to show to the user
      return <FileUploadInfo key={index} file={file} />;
    });
    // Set the output, once available, to a state variable to be used in the main component
    setUploadInfo(uploads);
  };

  const onSave = () => {
    setUploadInProgress(true);

    // call the mutation function to upload image to s3
    uploadApprovedItemImage({
      variables: { image: imageData?.data },
    })
      .then((data) => {
        setUploadInProgress(false);

        // pull the returned s3 image url into a variable
        const s3ImageUrl = data.data?.uploadApprovedCorpusItemImage.url;

        // if the image upload to s3 was successful
        if (s3ImageUrl) {
          setImageSrc(s3ImageUrl);
          setImageUploadOpen(false);
          showNotification('Image successfully uploaded to S3', 'success');

          //Execute the onImageSave callback if provided by parent
          onImageSave && onImageSave(s3ImageUrl);
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
          src={imageSrc || placeholder}
          className={imageSrc ? classes.image : classes.placeholder}
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
                  <input
                    {...getInputProps()}
                    data-testid="curated-corpus-image-upload-input"
                    type="file"
                  />
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
            <Box mt={2}>
              <SharedFormButtons onCancel={handleClose} onSave={onSave} />
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
