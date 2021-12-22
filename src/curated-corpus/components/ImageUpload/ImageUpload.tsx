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
  Collection,
  CollectionAuthor,
  CollectionPartner,
  CollectionPartnerAssociation,
  CollectionStory,
} from '../../../collections/api/collection-api/generatedTypes';
import {
  ApprovedCuratedCorpusItem,
  MutationUploadApprovedCuratedCorpusItemImageArgs,
  useUploadApprovedCuratedCorpusItemImageMutation,
} from '../../api/curated-corpus-api/generatedTypes';

interface ImageUploadProps {
  /**
   * Any entity with a customizable image
   */
  entity:
    | Omit<Collection, 'stories'>
    | CollectionAuthor
    | CollectionPartner
    | CollectionPartnerAssociation
    | CollectionStory
    | ApprovedCuratedCorpusItem;

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

  /**
   * Called when the image has been changed (successfully uploaded to S3) for an approved item.
   * This only toggles the boolean state variable in its direct parent ApprovedItemForm
   * OnImageSave is also doing the same thing but it's being drilled down by 3 levels above
   * TODO: @Herraj - need to do some refactoring here
   */
  onImageChanged?: (value: string) => void;
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

/**
 *
 * TODO: @Herraj - Try to make this a re-usable component
 * I copied this to the shared components directory thinking it could be
 * use as a re-usable component. It was tightly coupled with Collection API mutations,
 * where this is copied from
 */

export const ImageUpload: React.FC<ImageUploadProps> = (props): JSX.Element => {
  const classes = useStyles();
  const { entity, placeholder, onImageSave, onImageChanged } = props;
  const { showNotification } = useNotifications();

  // These state vars are used to show/hide the file upload modal and progress bar
  const [imageUploadOpen, setImageUploadOpen] = useState<boolean>(false);
  const [uploadInfo, setUploadInfo] = useState<JSX.Element[] | null>(null);
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

  // This one is for the uploaded file itself
  const [imageData, setImageData] = useState<
    MutationUploadApprovedCuratedCorpusItemImageArgs | undefined
  >(undefined);

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
  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // Process the file the user chose from their PC/mobile device,
  // show file info to the user and set data to use in upload mutation
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const uploads = acceptedFiles.map((file: FileWithPath, index: number) => {
      // Get the actual file
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // Load it
      reader.onloadend = (e) => {
        const contents = e.target?.result;

        // Load the contents of this file to an image element
        const image = new Image() as HTMLImageElement;
        if (typeof contents === 'string') {
          image.src = contents;

          // Set the variables we'll use later when saving the file to S3
          image.onload = function () {
            setImageData({
              data: file,
            });
          };
        }
      };

      // Generate the output to show to the user
      return <FileUploadInfo key={index} file={file} />;
    });
    // Set the output, once available, to a state variable to be used in the main component
    setUploadInfo(uploads);
  };

  const onSave = () => {
    setUploadInProgress(true);
    // Let's upload this thing to S3!
    uploadApprovedItemImage({
      variables: { image: imageData?.data },
    })
      .then((data) => {
        setUploadInProgress(false);

        if (data.data && data.data.uploadApprovedCuratedCorpusItemImage) {
          setImageSrc(data.data.uploadApprovedCuratedCorpusItemImage.url);
          setImageUploadOpen(false);
          setHasImage(true);
          showNotification('Image successfully uploaded to S3', 'success');

          // This calls the updateApprovedItem mutation to map the new image url
          // to the current item that is being edited
          onImageSave &&
            onImageSave(data.data.uploadApprovedCuratedCorpusItemImage.url);
          // This changes the state variable in the direct parent, ApprovedItemForm
          // to enable/disable the save button on the form
          onImageChanged &&
            onImageChanged(data.data.uploadApprovedCuratedCorpusItemImage.url);
        }
      })
      .catch((error) => {
        console.log(error);
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
            <Box mt={2}>
              <SharedFormButtons onCancel={handleClose} onSave={onSave} />
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
