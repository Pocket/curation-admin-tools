import React, { useState } from 'react';
import { AuthorModel } from '../../api';
import {
  Box,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from '@material-ui/core';
import { Button } from '../';

interface EditAuthorFormProps {
  /**
   * An object with everything author-related in it.
   */
  author: AuthorModel;
}

export const AuthorForm: React.FC<EditAuthorFormProps> = (
  props
): JSX.Element => {
  const [author, setAuthor] = useState<AuthorModel>(props.author);

  /**
   * Update form field values on change.
   */
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const name = event.target.name as keyof typeof author;

    setAuthor({
      ...author,
      [name]: event.target.value,
    });
  };

  /**
   * Update the switch on change
   */
  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor({ ...author, ['active']: event.target.checked });
  };

  return (
    <form name="author-form">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="name"
            name="name"
            label="Full name"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            variant="outlined"
            value={author.name ?? ''}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <TextField
                id="slug"
                name="slug"
                label="Slug"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
                variant="outlined"
                value={author.slug ?? ''}
                onChange={handleChange}
              />
            </Box>
            <Box alignSelf="center" ml={1}>
              <Button buttonType="hollow">Suggest&nbsp;slug</Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="bio"
            name="bio"
            label="Bio"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rows={12}
            size="small"
            variant="outlined"
            value={author.bio ?? ''}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={author.active}
                onChange={handleSwitch}
              />
            }
            name="isActive"
            label={author.active ? 'Active' : 'Inactive'}
            labelPlacement="end"
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Box p={1}>
              <Button buttonType="positive">Save</Button>
            </Box>
            <Box p={1}>
              <Button buttonType="hollow-neutral">Cancel</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
