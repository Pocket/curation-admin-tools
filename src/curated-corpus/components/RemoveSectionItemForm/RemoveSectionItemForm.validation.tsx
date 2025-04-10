import * as yup from 'yup';
import { SectionItemRemovalReason } from '../../../api/generatedTypes';

export const validationSchema = yup
  .object({
    [SectionItemRemovalReason.ArticleQuality]: yup.boolean(),
    [SectionItemRemovalReason.Controversial]: yup.boolean(),
    [SectionItemRemovalReason.Dated]: yup.boolean(),
    [SectionItemRemovalReason.HedDekQuality]: yup.boolean(),
    [SectionItemRemovalReason.ImageQuality]: yup.boolean(),
    [SectionItemRemovalReason.NoImage]: yup.boolean(),
    [SectionItemRemovalReason.OffTopic]: yup.boolean(),
    [SectionItemRemovalReason.OneSided]: yup.boolean(),
    [SectionItemRemovalReason.Paywall]: yup.boolean(),
    [SectionItemRemovalReason.PublisherQuality]: yup.boolean(),
    [SectionItemRemovalReason.SetDiversity]: yup.boolean(),
    [SectionItemRemovalReason.Other]: yup.boolean(),
  })
  .test('removalReasons', '', (obj) => {
    // If at least one checkbox was selected & above conditions satisfied, pass validation
    if (
      obj[SectionItemRemovalReason.ArticleQuality] ||
      obj[SectionItemRemovalReason.Controversial] ||
      obj[SectionItemRemovalReason.Dated] ||
      obj[SectionItemRemovalReason.HedDekQuality] ||
      obj[SectionItemRemovalReason.ImageQuality] ||
      obj[SectionItemRemovalReason.ImageQuality] ||
      obj[SectionItemRemovalReason.NoImage] ||
      obj[SectionItemRemovalReason.OffTopic] ||
      obj[SectionItemRemovalReason.OneSided] ||
      obj[SectionItemRemovalReason.Paywall] ||
      obj[SectionItemRemovalReason.PublisherQuality] ||
      obj[SectionItemRemovalReason.SetDiversity] ||
      obj[SectionItemRemovalReason.Other]
    ) {
      return true;
    }

    return new yup.ValidationError(
      'Please choose at least one removal reason.',
      null,
      'removalReasons',
    );
  });
