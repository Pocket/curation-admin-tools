import React from 'react';
import {
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
} from '@mui/material';

interface ProspectPublisherFilterProps {
  /**
   * What to filter the publisher by. For example, entering 'new' will
   * filter for "New York Times" and any other publisher containing the string
   * "new"
   */
  filterByPublisher: string;

  /**
   * Text field form control. Updates the value of `filterByPublisher` passed
   * down from the parent component.
   * @param value
   */
  setFilterByPublisher: (value: string) => void;

  /**
   * Updates the label on the include/exclude switch.
   */
  onChange: VoidFunction;

  /**
   * Updates the label on the include/exclude switch for published date
   */
  onSortByPublishedDate: VoidFunction;

  /**
   * The value of the switch. Defaults to true - to exclude publisher -
   * in the parent component (Prospecting page).
   */
  excludePublisherSwitch: boolean;

  /**
   * The value of the switch. Defaults to true - to sort by published date -
   * in the parent component (Prospecting page).
   */
  sortByPublishedDate: boolean;
}

/**
 * This component contains markup for a publisher filter and exclude/include
 * switch used on the Prospecting page.
 *
 * @param props
 * @constructor
 */
export const ProspectPublisherFilter: React.FC<ProspectPublisherFilterProps> = (
  props
): JSX.Element => {
  const {
    excludePublisherSwitch,
    filterByPublisher,
    sortByPublishedDate,
    setFilterByPublisher,
    onChange,
    onSortByPublishedDate,
  } = props;

  return (
    <Grid container justifyContent={'flex-end'}>
      <TextField
        id="filterByPublisher"
        label="Filter by Publisher"
        size="small"
        variant="outlined"
        value={filterByPublisher}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFilterByPublisher(event.target.value);
        }}
      ></TextField>
      <FormGroup>
        <FormControlLabel
          sx={{ mx: 2, mb: 2 }}
          control={
            <Switch checked={excludePublisherSwitch} onChange={onChange} />
          }
          label={excludePublisherSwitch ? 'Exclude' : 'Include'}
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          sx={{ mx: 2, mb: 2 }}
          control={
            <Switch
              checked={sortByPublishedDate}
              onChange={onSortByPublishedDate}
            />
          }
          label={'Sort by Published Date'}
        />
      </FormGroup>
    </Grid>
  );
};
