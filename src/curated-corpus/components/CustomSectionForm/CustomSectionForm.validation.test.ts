import { DateTime } from 'luxon';
import { getValidationSchema } from './CustomSectionForm.validation';

const pastDate = DateTime.now().minus({ days: 5 }).toJSDate();
const futureDate = DateTime.now().plus({ days: 5 }).toJSDate();
const today = DateTime.now().toJSDate();

const baseValidValues = {
  title: 'Test Section',
  subtitle: '',
  startDate: futureDate,
  endDate: null,
  followable: true,
  allowAds: true,
};

describe('getValidationSchema', () => {
  describe('create mode (isEditMode = false)', () => {
    const schema = getValidationSchema(false);

    it('should pass with a future start date', async () => {
      await expect(
        schema.isValid({ ...baseValidValues, startDate: futureDate }),
      ).resolves.toBe(true);
    });

    it('should fail with a past start date', async () => {
      await expect(
        schema.isValid({ ...baseValidValues, startDate: pastDate }),
      ).resolves.toBe(false);
    });

    it('should fail with a past end date', async () => {
      await expect(
        schema.isValid({ ...baseValidValues, endDate: pastDate }),
      ).resolves.toBe(false);
    });

    it('should pass with followable set to false', async () => {
      await expect(
        schema.isValid({ ...baseValidValues, followable: false }),
      ).resolves.toBe(true);
    });

    it('should pass with allowAds set to false', async () => {
      await expect(
        schema.isValid({ ...baseValidValues, allowAds: false }),
      ).resolves.toBe(true);
    });
  });

  describe('edit mode (isEditMode = true)', () => {
    const schema = getValidationSchema(true);

    it('should pass with a past start date', async () => {
      await expect(
        schema.isValid({ ...baseValidValues, startDate: pastDate }),
      ).resolves.toBe(true);
    });

    it('should pass with a past end date', async () => {
      await expect(
        schema.isValid({
          ...baseValidValues,
          startDate: pastDate,
          endDate: today,
        }),
      ).resolves.toBe(true);
    });

    it('should pass with followable set to false', async () => {
      await expect(
        schema.isValid({
          ...baseValidValues,
          startDate: pastDate,
          followable: false,
        }),
      ).resolves.toBe(true);
    });

    it('should pass with allowAds set to false', async () => {
      await expect(
        schema.isValid({
          ...baseValidValues,
          startDate: pastDate,
          allowAds: false,
        }),
      ).resolves.toBe(true);
    });

    it('should pass with both followable and allowAds set to false', async () => {
      await expect(
        schema.isValid({
          ...baseValidValues,
          startDate: pastDate,
          followable: false,
          allowAds: false,
        }),
      ).resolves.toBe(true);
    });

    it('should still fail if end date is before start date', async () => {
      await expect(
        schema.isValid({
          ...baseValidValues,
          startDate: futureDate,
          endDate: pastDate,
        }),
      ).resolves.toBe(false);
    });

    it('should still fail without a title', async () => {
      await expect(
        schema.isValid({ ...baseValidValues, startDate: pastDate, title: '' }),
      ).resolves.toBe(false);
    });
  });
});
