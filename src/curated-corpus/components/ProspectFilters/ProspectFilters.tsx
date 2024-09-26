import React from 'react';
import {
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Prospect } from '../../../api/generatedTypes';
import { DropDownFilter } from '../DropDownFilter/DropDownFilter';
// import { ProspectDropDownFilter } from '../ProspectDropDownFilter/ProspectDropDownFilter';
import { getDisplayTopic, getGroupedTopicData } from '../../helpers/topics';
import { curationPalette } from '../../../theme';

export interface ProspectFilerOptions {
  topics: string;
}

interface ProspectFiltersProps {
  /**
   * prospect items - to summarise in the filters
   */
  prospects: Prospect[];

  /**
   * Callback to set filters on the Prospecting Page
   */
  setProspectMetadataFilters: React.Dispatch<
    React.SetStateAction<ProspectFilerOptions>
  >;
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

  /**
   * Boolean flag to represent the state of sortByTimeToRead toggle in the parent component
   * (prospecting page)
   */
  sortByTimeToRead: boolean;

  /**
   * Function to toggle sortByTimeToRead in the parent component (prospecting page)
   */
  handleSortByTimeToRead: VoidFunction;
}

/**
 * This component contains markup for a publisher filter and exclude/include
 * switch & topic filter used on the Prospecting page.
 *
 * @param props
 * @constructor
 */
export const ProspectFilters: React.FC<ProspectFiltersProps> = (
  props,
): JSX.Element => {
  const {
    prospects,
    setProspectMetadataFilters,
    excludePublisherSwitch,
    filterByPublisher,
    sortByPublishedDate,
    setFilterByPublisher,
    onChange,
    onSortByPublishedDate,
    sortByTimeToRead,
    handleSortByTimeToRead,
  } = props;

  // Extract all topics from prospects item data
  const topics =
    prospects.map((prospect: Prospect) => getDisplayTopic(prospect.topic)) ??
    [];

  const topicList = getGroupedTopicData(topics, true, false);

  return (
    <Grid container justifyContent={'flex-start'}>
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
          labelPlacement={'top'} // Ensures the label is on top of the switch
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
          label={'Published Date'}
          labelPlacement={'top'} // Ensures the label is on top of the switch
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          sx={{ mx: 2, mb: 2 }}
          control={
            <Switch
              checked={sortByTimeToRead}
              onChange={handleSortByTimeToRead}
            />
          }
          label={'Time to Read'}
          labelPlacement={'top'} // Ensures the label is on top of the switch
        />
      </FormGroup>
      {/*Topic Filter*/}
      {prospects.length > 0 && (
        <FormGroup sx={{ mx: 1, mb: 2 }}>
          <Typography
            sx={{ fontSize: '1.0rem', color: curationPalette.regularGrey }}
          >
            Filter by Topics:
          </Typography>
          <DropDownFilter
            filterData={topicList}
            filterName="topics"
            itemCount={prospects.length}
            setProspectFilters={setProspectMetadataFilters}
          />
        </FormGroup>
      )}
    </Grid>
  );
};
