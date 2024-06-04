import { applyQuotesDashesDE } from './applyQuotesDashesDE';
describe('applyQuotesDashesDE', () => {
  it('should return undefined if text is null/undefined/empty string', () => {
    // null
    let output = applyQuotesDashesDE(null as unknown as string);
    expect(output).toBeUndefined();

    // undefined
    output = applyQuotesDashesDE(undefined as unknown as string);
    expect(output).toBeUndefined();

    // empty string
    output = applyQuotesDashesDE('');
    expect(output).toBeUndefined();
  });
  it('Successfully does all replacements', () => {
    const result = applyQuotesDashesDE(
      `“Nicht eine mehr”: Diese spanische Netflix-Serie ist ein Mix aus “Tote Mädchen lügen nicht” und “Élite” – das musst du darüber wissen`,
    );
    expect(result).toEqual(
      '„Nicht eine mehr”: Diese spanische Netflix-Serie ist ein Mix aus „Tote Mädchen lügen nicht” und „Élite” — das musst du darüber wissen',
    );
  });
  it('Replaces opening « with „', () => {
    const result = applyQuotesDashesDE("«Here's to the great ones!");
    expect(result).toEqual("„Here's to the great ones!");
  });
  it('Replaces closing » with “', () => {
    const result = applyQuotesDashesDE("Here's to the great ones!»");
    expect(result).toEqual("Here's to the great ones!”");
  });
  it('Replaces « with „ and » with “', () => {
    const result = applyQuotesDashesDE("«Here's to the great ones!»");
    expect(result).toEqual("„Here's to the great ones!”");
  });
  it('Replaces opening " with „', () => {
    const result = applyQuotesDashesDE('"Here\'s to the great ones!');
    expect(result).toEqual("„Here's to the great ones!");
  });
  it('Replaces closing " with “', () => {
    const result = applyQuotesDashesDE('Here\'s to the great ones!"');
    expect(result).toEqual("Here's to the great ones!”");
  });
  it('Replaces opening " with „ and closing " with “', () => {
    const result = applyQuotesDashesDE('"Here\'s to the great ones!"');
    expect(result).toEqual("„Here's to the great ones!”");
  });
  it('Replaces opening “ with „', () => {
    const result = applyQuotesDashesDE('“Here\'s to the great ones!"');
    expect(result).toEqual("„Here's to the great ones!”");
  });
  it('Replaces short dash (with whitespaces) with long em dash', () => {
    const result = applyQuotesDashesDE('"Here\'s to the great - ones!"');
    expect(result).toEqual("„Here's to the great — ones!”");
  });
  it('Replaces en dash (–) (with whitespaces) with long em dash', () => {
    const result = applyQuotesDashesDE(
      '"Meeresregionen – in die pelagischen Zonen – verlegt"',
    );
    expect(result).toEqual(
      '„Meeresregionen — in die pelagischen Zonen — verlegt”',
    );
  });
  it('Should not replace short dash (-) with long em dash (—) if no whitespaces in short dash', () => {
    const result = applyQuotesDashesDE('"Here\'s to the great-ones!"');
    expect(result).toEqual("„Here's to the great-ones!”");
  });
  it('Should not replace en dash (–) with long em dash (—) if no whitespaces in en dash', () => {
    const result = applyQuotesDashesDE('"Here\'s to the great–ones!"');
    expect(result).toEqual("„Here's to the great–ones!”");
  });
});
