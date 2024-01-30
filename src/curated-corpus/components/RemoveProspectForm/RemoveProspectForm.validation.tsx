import * as yup from 'yup';
import { RemovalReason } from '../../../api/generatedTypes';

export const validationSchema = yup
  .object({
    [RemovalReason.ArticleQuality]: yup.boolean(),
    [RemovalReason.Commercial]: yup.boolean(),
    [RemovalReason.Controversial]: yup.boolean(),
    [RemovalReason.HeadlineQuality]: yup.boolean(),
    [RemovalReason.Inappropriate]: yup.boolean(),
    [RemovalReason.Niche]: yup.boolean(),
    [RemovalReason.NoImage]: yup.boolean(),
    [RemovalReason.OneSided]: yup.boolean(),
    [RemovalReason.Outdated]: yup.boolean(),
    [RemovalReason.Paywall]: yup.boolean(),
    [RemovalReason.PoliticalOpinion]: yup.boolean(),
    [RemovalReason.Publisher]: yup.boolean(),
    [RemovalReason.Redundant]: yup.boolean(),
    [RemovalReason.SetSimilarity]: yup.boolean(),
    [RemovalReason.TimeSensitive]: yup.boolean(),
    [RemovalReason.Topic]: yup.boolean(),
    otherReason: yup
      .string()
      .max(100, 'Reason is too long, cannot exceed 100 characters.'), // max 50 chars for now
  })
  .test('removalReason', '', (obj) => {
    // If at least one checkbox was selected, let the form validation pass
    if (
      obj[RemovalReason.ArticleQuality] ||
      obj[RemovalReason.Commercial] ||
      obj[RemovalReason.Controversial] ||
      obj[RemovalReason.HeadlineQuality] ||
      obj[RemovalReason.Inappropriate] ||
      obj[RemovalReason.Niche] ||
      obj[RemovalReason.NoImage] ||
      obj[RemovalReason.OneSided] ||
      obj[RemovalReason.Outdated] ||
      obj[RemovalReason.Paywall] ||
      obj[RemovalReason.PoliticalOpinion] ||
      obj[RemovalReason.Publisher] ||
      obj[RemovalReason.Redundant] ||
      obj[RemovalReason.SetSimilarity] ||
      obj[RemovalReason.TimeSensitive] ||
      obj[RemovalReason.Topic]
    ) {
      return true;
    }

    return new yup.ValidationError(
      'Please choose at least one removal reason.',
      null,
      'removalReason'
    );
  });
