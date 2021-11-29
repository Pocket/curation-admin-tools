import * as yup from 'yup';
import { RejectionReason } from '../../api/curated-corpus-api/generatedTypes';

export const validationSchema = yup
  .object({
    [RejectionReason.Paywall]: yup.boolean(),
    [RejectionReason.PoliticalOpinion]: yup.boolean(),
    [RejectionReason.OffensiveMaterial]: yup.boolean(),
    [RejectionReason.TimeSensitive]: yup.boolean(),
    [RejectionReason.Misinformation]: yup.boolean(),
    [RejectionReason.Other]: yup.boolean(),
  })
  .test('reasonRequired', '', (obj) => {
    // If at least one checkbox was selected, let the form validation pass
    if (
      obj[RejectionReason.Paywall] ||
      obj[RejectionReason.PoliticalOpinion] ||
      obj[RejectionReason.OffensiveMaterial] ||
      obj[RejectionReason.TimeSensitive] ||
      obj[RejectionReason.Misinformation] ||
      obj[RejectionReason.Other]
    ) {
      return true;
    }

    return new yup.ValidationError(
      'Please specify at least one rejection reason.',
      null,
      'reasonRequired'
    );
  });
