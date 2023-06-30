import { applyApTitleCase } from './applyApTitleCase';

// examples taken from https://www.grammarly.com/blog/capitalization-in-the-titles/
// tested at https://headlinecapitalization.com/ (AP style)
describe('applyApTitleCase', () => {
  it('returns an empty string if no text added', () => {
    const result = applyApTitleCase('');
    expect(result).toEqual('');
  });

  // articles - https://www.grammarly.com/blog/articles/
  // e.g 'after "the" long day, "the" cup of tea tasted good'
  it('articles in text should be lowercase', () => {
    const articles = [
      {
        result: 'Ernest Hemingway wrote For Whom The Bell Tolls.',
        expected: 'Ernest Hemingway Wrote for Whom the Bell Tolls.',
      },
      {
        result: 'Girl on A Train is a thriller by A. J. Waines.',
        expected: 'Girl on a Train Is a Thriller by A. J. Waines.',
      },
    ];
    articles.forEach((article) => {
      expect(applyApTitleCase(article.result)).toEqual(article.expected);
    });
  });

  it('first word should be capitalized even if it is an article', () => {
    const result = applyApTitleCase('a Visit from The Goon Squad.');
    expect(result).toEqual('A Visit From the Goon Squad.');
  });

  // conjunctions - https://www.grammarly.com/blog/articles/
  // e.g 'Fact "or" fiction'
  it('conjunctions in text should be lowercase', () => {
    const conjunctions = [
      {
        result: 'She titled her thesis “Urban Legends: Fact Or Fiction?”',
        expected: 'She Titled Her Thesis “Urban Legends: Fact or Fiction?”',
      },
      {
        result: 'Shakespeare wrote Romeo And Juliet.',
        expected: 'Shakespeare Wrote Romeo and Juliet.',
      },
    ];
    conjunctions.forEach((conjunction) => {
      expect(applyApTitleCase(conjunction.result)).toEqual(
        conjunction.expected
      );
    });
  });

  // nouns, verbs, adjectives, adverbs
  it('nouns, verbs, adjectives, adverbs in text should be uppercase', () => {
    const allUppercaseTypes = [
      {
        result: 'The lion, the witch and the wardrobe is by C. S. Lewis.',
        expected: 'The Lion, the Witch and the Wardrobe Is by C. S. Lewis.',
      },
      {
        result: 'Things fall Apart is by Chinua Achebe.',
        expected: 'Things Fall Apart Is by Chinua Achebe.',
      },
      {
        result: 'Roald Dahl wrote Charlie and the chocolate Factory.',
        expected: 'Roald Dahl Wrote Charlie and the Chocolate Factory.',
      },
      {
        result:
          'Brené Brown wrote Daring greatly: How the Courage to Be Vulnerable Transforms the Way We Live, Love, Parent, and Lead.',
        expected:
          'Brené Brown Wrote Daring Greatly: How the Courage to Be Vulnerable Transforms the Way We Live, Love, Parent, and Lead.',
      },
      {
        result: 'Norman Maclean wrote A River Runs through It. ',
        expected: 'Norman Maclean Wrote a River Runs Through It. ',
      },
    ];
    allUppercaseTypes.forEach((type) => {
      expect(applyApTitleCase(type.result)).toEqual(type.expected);
    });
  });
});
