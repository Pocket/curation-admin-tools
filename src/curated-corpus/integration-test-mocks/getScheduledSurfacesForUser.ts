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
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.SyndicatedNew,
      ProspectType.SyndicatedRerun,
      ProspectType.CountsLogisticApproval,
      ProspectType.HybridLogisticApproval,
      ProspectType.Approved,
      ProspectType.TimespentLogisticApproval,
    ],
  },
  {
    name: 'New Tab (de-DE)',
    guid: 'NEW_TAB_DE_DE',
    ianaTimezone: 'Europe/Berlin',
    prospectTypes: [
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.DomainAllowlist,
    ],
  },
  {
    name: 'New Tab (en-GB)',
    guid: 'NEW_TAB_EN_GB',
    ianaTimezone: 'Europe/London',
    prospectTypes: [
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.Approved,
    ],
  },
  {
    name: 'New Tab (en-INTL)',
    guid: 'NEW_TAB_EN_INTL',
    ianaTimezone: 'Asia/Kolkata',
    prospectTypes: [
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.Approved,
    ],
  },
  {
    name: 'Pocket Hits (en-US)',
    guid: 'POCKET_HITS_EN_US',
    ianaTimezone: 'America/New_York',
    prospectTypes: [
      ProspectType.TopSaved,
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.CountsLogisticApproval,
      ProspectType.HybridLogisticApproval,
    ],
  },
  {
    name: 'Pocket Hits (de-DE)',
    guid: 'POCKET_HITS_DE_DE',
    ianaTimezone: 'Europe/Berlin',
    prospectTypes: [
      ProspectType.TopSaved,
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.DomainAllowlist,
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
  allScheduledSurfaces
);

/**
 * Return the first two available surfaces - corresponds to access to some
 * of the available surfaces.
 */
export const mock_TwoScheduledSurfaces = constructMock(
  'getScheduledSurfacesForUser',
  getScheduledSurfacesForUser,
  allScheduledSurfaces.slice(0, 2)
);

/**
 * Return only one surface - in this case, one of the Pocket Hits surfaces.
 */
export const mock_OneScheduledSurface = constructMock(
  'getScheduledSurfacesForUser',
  getScheduledSurfacesForUser,
  allScheduledSurfaces.slice(4, 5)
);
