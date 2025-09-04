import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormHelperText,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import {
  FormikSelectField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { getValidationSchema } from './ScheduleItemForm.validation';
import {
  ManualScheduleReason,
  ScheduledSurface,
} from '../../../api/generatedTypes';
import { ScheduleSummaryConnector } from '../ScheduleSummaryConnector/ScheduleSummaryConnector';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  const formik = useFormik({
    initialValues: {
      scheduledSurfaceGuid: selectedScheduledSurfaceGuid,
      approvedItemExternalId,
      scheduledDate: selectedDate,
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
              inputFormat="MMMM d, yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              disablePast
              openTo="day"
              maxDate={tomorrow.plus({ days: 365 })}
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
