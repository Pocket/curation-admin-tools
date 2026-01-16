import { ProspectType, ScheduledSurface } from '../../api/generatedTypes';
import { getScheduledSurfacesForUser } from '../../api/queries/getScheduledSurfacesForUser';
import { constructMock } from './utils';

/**
 * The source array with all the scheduled surfaces available in the Curation Tool.
 */
const allScheduledSurfaces: ScheduledSurface[] = [
  {
    name: 'New Tab (en-US)',
    guid: 'NEW_TAB_EN_US',
    ianaTimezone: 'America/New_York',
    prospectTypes: [
      ProspectType.Counts,
      ProspectType.Timespent,
      ProspectType.Recommended,
      ProspectType.TopSaved,
      ProspectType.DomainAllowlist,
      ProspectType.Dismissed,
      ProspectType.Counts,
      ProspectType.TitleUrlModeled,
      ProspectType.RssLogistic,
      ProspectType.RssLogisticRecent,
      ProspectType.SlateSchedulerV2,
      ProspectType.PublisherSubmitted,
    ],
  },
  {
    name: 'New Tab (de-DE)',
    guid: 'NEW_TAB_DE_DE',
    ianaTimezone: 'Europe/Berlin',
    prospectTypes: [
      ProspectType.Counts,
      ProspectType.Timespent,
      ProspectType.DomainAllowlist,
      ProspectType.Dismissed,
      ProspectType.TitleUrlModeled,
      ProspectType.PublisherSubmitted,
    ],
  },
  {
    name: 'New Tab (en-GB)',
    guid: 'NEW_TAB_EN_GB',
    ianaTimezone: 'Europe/London',
    prospectTypes: [
      ProspectType.Counts,
      ProspectType.Timespent,
      ProspectType.Recommended,
      ProspectType.Dismissed,
    ],
  },
  {
    name: 'New Tab (en-CA)',
    guid: 'NEW_TAB_EN_CA',
    ianaTimezone: 'America/Toronto',
    prospectTypes: [],
  },
  {
    name: 'New Tab (en-IE)',
    guid: 'NEW_TAB_EN_IE',
    ianaTimezone: 'Europe/Dublin',
    prospectTypes: [],
  },
  {
    name: 'New Tab (en-INTL)',
    guid: 'NEW_TAB_EN_INTL',
    ianaTimezone: 'Asia/Kolkata',
    prospectTypes: [
      ProspectType.Counts,
      ProspectType.Timespent,
      ProspectType.Recommended,
      ProspectType.TitleUrlModeled,
      ProspectType.Dismissed,
    ],
  },
  {
    name: 'Pocket Hits (en-US)',
    guid: 'POCKET_HITS_EN_US',
    ianaTimezone: 'America/New_York',
    prospectTypes: [
      ProspectType.Counts,
      ProspectType.TopSaved,
      ProspectType.Timespent,
      ProspectType.Dismissed,
      ProspectType.TitleUrlModeled,
    ],
  },
  {
    name: 'Pocket Hits (de-DE)',
    guid: 'POCKET_HITS_DE_DE',
    ianaTimezone: 'Europe/Berlin',
    prospectTypes: [
      ProspectType.Counts,
      ProspectType.Timespent,
      ProspectType.TopSaved,
      ProspectType.DomainAllowlist,
      ProspectType.TitleUrlModeled,
    ],
  },
  {
    name: 'Sandbox',
    guid: 'SANDBOX',
    ianaTimezone: 'America/New_York',
    prospectTypes: [],
  },
];

/**
 * Return all the available surfaces - corresponds to full user privileges
 */
export const mock_AllScheduledSurfaces = constructMock(
  'getScheduledSurfacesForUser',
  getScheduledSurfacesForUser,
  undefined,
  allScheduledSurfaces,
);

/**
 * Return the first two available surfaces - corresponds to access to some
 * of the available surfaces.
 */
export const mock_TwoScheduledSurfaces = constructMock(
  'getScheduledSurfacesForUser',
  getScheduledSurfacesForUser,
  undefined,
  allScheduledSurfaces.slice(0, 2),
);

/**
 * Return only one surface - in this case, one of the Pocket Hits surfaces.
 */
export const mock_OneScheduledSurface = constructMock(
  'getScheduledSurfacesForUser',
  getScheduledSurfacesForUser,
  undefined,
  allScheduledSurfaces.filter((s) => s.guid === 'POCKET_HITS_EN_US'),
);
