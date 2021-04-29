import React, { useState } from 'react';
import slugify from 'slugify';
import * as yup from 'yup';
import { FormikValues, useFormik } from 'formik';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  FormControlLabel,
  Grid,
  LinearProgress,
  Switch,
  TextField,
} from '@material-ui/core';
import { AuthorModel } from '../../api';
import { Button, CustomTabType, TabSet, TabPanel } from '../';

interface AuthorFormProps {
  /**
   * An object with everything author-related in it.
   */
  author: AuthorModel;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues) => void;

  /**
   * Do we need to show the cancel button? Not on the 'Add Author' page
   * True by default
   */
  showCancelButton?: boolean;

  /**
   * What to do if the user clicks on the Cancel button
   */
  onCancel?: () => void;
}

/**
 * A form for adding authors or editing information for existing authors
 */
export const AuthorForm: React.FC<AuthorFormProps> = (props): JSX.Element => {
  const { author, showCancelButton = true, onCancel, onSubmit } = props;

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      name: author.name ?? '',
      slug: author.slug ?? '',
      bio: author.bio ?? '',
      active: author.active ?? true,
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup
        .string()
        .required('Please enter the full name of the author')
        .min(6),
      slug: yup
        .string()
        .required(
          'Please enter a slug or use the "Suggest slug" button to generate one from the name of the author'
        )
        .min(6),
      bio: yup.string(),
      active: yup.boolean().required(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  /**
   * Suggest a slug for the author - works off the "name" field
   */
  const suggestSlug = () => {
    const newSlug = slugify(formik.values.name, { lower: true });
    formik.setFieldValue('slug', newSlug);
  };

  // set the default tab
  const [value, setValue] = useState<string>('write');

  // switch to active tab when user clicks on tab heading
  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: string
  ): void => {
    setValue(newValue);
  };

  // Define the set of tabs that we're going to show on this page
  const tabs: CustomTabType[] = [
    {
      label: 'Write',
      pathname: 'write',
      hasLink: false,
    },
    {
      label: 'Preview',
      pathname: 'preview',
      hasLink: false,
    },
  ];

  return (
    <form name="author-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="name"
            label="Full name"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            variant="outlined"
            {...formik.getFieldProps('name')}
            error={!!(formik.touched.name && formik.errors.name)}
            helperText={formik.errors.name ? formik.errors.name : null}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <TextField
                id="slug"
                label="Slug"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
                variant="outlined"
                {...formik.getFieldProps('slug')}
                error={!!(formik.touched.slug && formik.errors.slug)}
                helperText={formik.errors.slug ? formik.errors.slug : null}
              />
            </Box>
            <Box alignSelf="center" ml={1}>
              <Button buttonType="hollow" onClick={suggestSlug}>
                Suggest&nbsp;slug
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TabSet currentTab={value} handleChange={handleChange} tabs={tabs} />
          <TabPanel value={value} index="write">
            <TextField
              id="bio"
              label="Bio"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              multiline
              rows={12}
              size="small"
              variant="outlined"
              {...formik.getFieldProps('bio')}
              error={!!(formik.touched.bio && formik.errors.bio)}
              helperText={formik.errors.bio ? formik.errors.bio : null}
            />
          </TabPanel>
          <TabPanel value={value} index="preview">
            <Box style={{ minHeight: '14rem' }}>
              <ReactMarkdown>
                {formik.values.bio ? formik.values.bio : 'Nothing to preview'}
              </ReactMarkdown>
            </Box>
          </TabPanel>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={formik.values.active}
                {...formik.getFieldProps('active')}
              />
            }
            label={formik.values.active ? 'Active' : 'Inactive'}
            labelPlacement="end"
          />
        </Grid>

        {formik.isSubmitting && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Box p={1}>
              <Button buttonType="positive" type="submit">
                Save
              </Button>
            </Box>
            {showCancelButton && (
              <Box p={1}>
                <Button buttonType="hollow-neutral" onClick={onCancel}>
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
