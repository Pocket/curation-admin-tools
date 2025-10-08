import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import {
  FormikSelectField,
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { getValidationSchema } from './ScheduleItemForm.validation';
import {
  ManualScheduleReason,
  ScheduledSurface,
  Section,
  SectionStatus,
  ActivitySource,
  useGetSectionsWithSectionItemsQuery,
} from '../../../api/generatedTypes';
import { ScheduleSummaryConnector } from '../ScheduleSummaryConnector/ScheduleSummaryConnector';
import { formatFormLabel } from '../../helpers/helperFunctions';
import { useToggle } from '../../../_shared/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { curationPalette } from '../../../theme';

interface ScheduleItemFormProps {
  /**
   * The UUID of the Approved Curated Item about to be scheduled.
   */
  approvedItemExternalId: string;

  /**
   * What to do when the user picks a date.
   */
  handleDateChange: (date: any, value?: string | null | undefined) => void;

  /**
   * The list of Scheduled Surfaces the logged-in user has access to.
   */
  scheduledSurfaces: ScheduledSurface[];

  /**
   * If a default value for the Scheduled Surface dropdown needs to be set,
   * here is the place to specify it.
   */
  scheduledSurfaceGuid?: string;

  /**
   * Whether to lock the scheduled surface dropdown to just the value sent through
   * in the `scheduledSurfaceGuid` variable.
   */
  disableScheduledSurface?: boolean;

  /**
   * Whether to show the optional manual schedule reasons.
   */
  showManualScheduleReasons?: boolean;

  /**
   * Whether to expand the Topic & Publisher summary.
   */
  expandSummary?: boolean;

  /**
   *
   * Note that null is an option here to keep MUI types happy, nothing else.
   */
  selectedDate: DateTime | null;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
}

export const ScheduleItemForm: React.FC<
  ScheduleItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const {
    approvedItemExternalId,
    handleDateChange,
    scheduledSurfaces,
    scheduledSurfaceGuid,
    disableScheduledSurface = false,
    showManualScheduleReasons = false,
    expandSummary = false,
    selectedDate,
    onCancel,
    onSubmit,
  } = props;

  const tomorrow = DateTime.local().plus({ days: 1 });

  // Run the lookup query for scheduled items on loading the component,
  // so that users can see straight away how many stories have already
  // been scheduled for the default date (tomorrow).
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    setRefreshData(true);
    handleDateChange(selectedDate);
  }, []);

  // if a scheduledSurfaceGuid was not supplied (meaning this is a manually
  // added item), check to see if the user only has access to a single
  // scheduled surface. if so, auto-select that one. if they have access to
  // multiple, the default value should be an empty string (as react does *not*
  // like `null` or `undefined` in this case).
  const selectedScheduledSurfaceGuid =
    scheduledSurfaceGuid ||
    (scheduledSurfaces.length === 1 ? scheduledSurfaces[0].guid : '');

  // whether the "Other" checkbox is selected, this will give us
  // an indication if the reason comment field should be enabled or disabled
  const [isOtherSelected, setOtherReason] = useToggle(false);

  // update "Other" checkbox status
  const handleOtherCheckbox = () => {
    setOtherReason();
  };

  const formik = useFormik({
    initialValues: {
      scheduledSurfaceGuid: selectedScheduledSurfaceGuid,
      approvedItemExternalId,
      scheduledDate: selectedDate,
      customSectionIds: [],
      [ManualScheduleReason.Evergreen]: false,
      [ManualScheduleReason.FormatDiversity]: false,
      [ManualScheduleReason.PublisherDiversity]: false,
      [ManualScheduleReason.TimeSensitiveExplainer]: false,
      [ManualScheduleReason.TimeSensitiveNews]: false,
      [ManualScheduleReason.TopicDiversity]: false,
      [ManualScheduleReason.Trending]: false,
      [ManualScheduleReason.UnderTheRadar]: false,
      OTHER: false,
      manualScheduleReason: '',
      reasonComment: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: getValidationSchema(
      scheduledSurfaces,
      showManualScheduleReasons,
    ),
    onSubmit: (values, formikHelpers) => {
      // Make sure the date is the one selected by the user
      // (Without this, Formik passes on the initial date = tomorrow.)
      values.scheduledDate = selectedDate;

      // Populate the 'manualScheduleReason' field value with
      // a comma-separated list of reasons.
      const reasons: string[] = [];
      for (const [key, value] of Object.entries(values)) {
        if (value === true) {
          reasons.push(key);
        }
      }
      values.manualScheduleReason = reasons.join(',');

      onSubmit(values, formikHelpers);
    },
  });

  // Get available custom sections for the selected scheduled surface
  const { data: sectionsData, refetch: refetchSections } =
    useGetSectionsWithSectionItemsQuery({
      variables: {
        scheduledSurfaceGuid:
          formik.values.scheduledSurfaceGuid || scheduledSurfaceGuid || '',
      },
      skip: !formik.values.scheduledSurfaceGuid && !scheduledSurfaceGuid,
    });

  // Refetch sections when scheduled surface changes
  useEffect(() => {
    if (formik.values.scheduledSurfaceGuid) {
      refetchSections();
    }
  }, [formik.values.scheduledSurfaceGuid, refetchSections]);

  // Filter for active custom sections (non-ML sections with createSource="MANUAL")
  // Include disabled sections, exclude expired sections
  const customSections =
    sectionsData?.getSectionsWithSectionItems?.filter(
      (section: Section) =>
        section.active &&
        section.createSource === ActivitySource.Manual &&
        section.status !== SectionStatus.Expired,
    ) || [];

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <form name="schedule-item-form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <FormikSelectField
              id="scheduledSurfaceGuid"
              label="Choose a Scheduled Surface"
              disabled={
                (scheduledSurfaceGuid as unknown as boolean) &&
                disableScheduledSurface
              }
              fieldProps={formik.getFieldProps('scheduledSurfaceGuid')}
              fieldMeta={formik.getFieldMeta('scheduledSurfaceGuid')}
            >
              <option aria-label="None" value="" />
              {scheduledSurfaces.map((scheduledSurface: ScheduledSurface) => {
                return (
                  <option
                    value={scheduledSurface.guid}
                    key={scheduledSurface.guid}
                  >
                    {scheduledSurface.name}
                  </option>
                );
              })}
            </FormikSelectField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Choose a date"
              inputFormat="MM/dd/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              disablePast
              openTo="day"
              maxDate={tomorrow.plus({ days: 365 })}
              disableMaskedInput
              renderInput={(params: any) => (
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  id="scheduled-date"
                  {...params}
                />
              )}
            />
          </Grid>

          {/* Custom Sections Dropdown */}
          {customSections.length > 0 && formik.values.scheduledSurfaceGuid && (
            <Grid item xs={12}>
              <TextField
                select
                SelectProps={{
                  multiple: true,
                }}
                fullWidth
                size="small"
                variant="outlined"
                id="customSectionIds"
                label="Add to Custom Sections (Optional)"
                value={formik.values.customSectionIds || []}
                onChange={(e) =>
                  formik.setFieldValue('customSectionIds', e.target.value)
                }
                helperText="Select one or more custom sections to add this item to"
              >
                {customSections.map((section: Section) => {
                  const statusLabel =
                    section.status === SectionStatus.Scheduled
                      ? ' (Scheduled)'
                      : section.status === SectionStatus.Live
                        ? ' (Live)'
                        : '';
                  const disabledLabel = section.disabled ? ' (Disabled)' : '';
                  return (
                    <MenuItem
                      key={section.externalId}
                      value={section.externalId}
                    >
                      {section.title}
                      {statusLabel}
                      {disabledLabel}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          )}

          <Grid
            container
            alignItems="stretch"
            spacing={3}
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Box mt={3}>
                <Accordion defaultExpanded={expandSummary}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ maxHeight: '2rem' }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      Expand to see Topic &amp; Publisher distribution
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {formik.values.scheduledSurfaceGuid &&
                      formik.values.scheduledSurfaceGuid.length > 0 && (
                        <Grid item xs={12}>
                          <ScheduleSummaryConnector
                            date={selectedDate!}
                            scheduledSurfaceGuid={
                              formik.values.scheduledSurfaceGuid
                            }
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                          />
                        </Grid>
                      )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>

          {showManualScheduleReasons && (
            <>
              <Grid item xs={12}>
                <hr color={curationPalette.primary} />
                <h2>Select Reason for Manually Adding Item</h2>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  {Object.values(ManualScheduleReason)
                    .slice(0, 4) // first four reasons in the first column
                    .map((value) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              {...formik.getFieldProps({
                                name: value,
                              })}
                            />
                          }
                          label={formatFormLabel(value)}
                          key={value}
                        />
                      );
                    })}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormGroup>
                  {Object.values(ManualScheduleReason)
                    .slice(4, 8) // remaining four reasons in the second column
                    .map((value) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              {...formik.getFieldProps({
                                name: value,
                              })}
                            />
                          }
                          label={formatFormLabel(value)}
                          key={value}
                        />
                      );
                    })}

                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        {...formik.getFieldProps({
                          name: 'OTHER',
                        })}
                        // onChange doesn't always work, onClick does the job
                        onClick={handleOtherCheckbox}
                      />
                    }
                    label="OTHER"
                  />
                  <FormikTextField
                    disabled={!isOtherSelected}
                    id="reasonComment"
                    label="Reason Comment"
                    fieldProps={formik.getFieldProps('reasonComment')}
                    fieldMeta={formik.getFieldMeta('reasonComment')}
                    autoFocus
                    multiline
                    minRows={1}
                  />
                </FormGroup>
              </Grid>
            </>
          )}

          {formik.isSubmitting && (
            <Grid item xs={12}>
              <Box mb={3}>
                <LinearProgress />
              </Box>
            </Grid>
          )}
        </Grid>
        <Box display="none">
          <TextField
            type="hidden"
            id="approvedItemExternalId"
            label="approvedItemExternalId"
            {...formik.getFieldProps('approvedItemExternalId')}
          />
        </Box>

        <Box mb={2}>
          {formik.errors && formik.errors.manualScheduleReason && (
            <FormHelperText error>
              {formik.errors.manualScheduleReason}
            </FormHelperText>
          )}
        </Box>

        <SharedFormButtons onCancel={onCancel} />
      </form>
    </LocalizationProvider>
  );
};
