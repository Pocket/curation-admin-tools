import { Label } from '../../api/generatedTypes';

/**
 *
 */
export const validateLabels = (
  availableLabels: Label[],
  selectedLabels: Label[]
): boolean => {
  if (selectedLabels.length === 0) {
    return true;
  }

  if (selectedLabels.length === 1) {
    return false;
  }

  // pull out external ids for selected labels
  const selectedLabelsExternalIds = selectedLabels.map(
    (label) => label.externalId
  );

  // pull out external ids for available labels
  const availableLabelsExternalIds = availableLabels.map(
    (label) => label.externalId
  );

  return selectedLabelsExternalIds.some((labelExternalId) =>
    availableLabelsExternalIds.includes(labelExternalId)
  );
};
