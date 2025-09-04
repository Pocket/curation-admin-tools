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
        conjunction.expected,
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

  it('words after double apostrophes should be uppercase', () => {
    const sentencesWithApostrophe = [
      {
        result:
          '“Integrated thriving” can fix unhelpful buzz words like “girlboss” and “snail girl”',
        expected:
          '“Integrated Thriving” Can Fix Unhelpful Buzz Words Like “Girlboss” and “Snail Girl”',
      },
      {
        result:
          '"Integrated thriving" can fix unhelpful buzz words like "girlboss" and "snail girl"',
        expected:
          '"Integrated Thriving" Can Fix Unhelpful Buzz Words Like "Girlboss" and "Snail Girl"',
      },
    ];
    sentencesWithApostrophe.forEach((swa) => {
      expect(applyApTitleCase(swa.result)).toEqual(swa.expected);
    });
  });

  it('contractions should be properly uppercase', () => {
    const sentencesWithContractions = [
      {
        result: "Here's what you haven't noticed",
        expected: "Here's What You Haven't Noticed",
      },
    ];
    sentencesWithContractions.forEach((swc) => {
      expect(applyApTitleCase(swc.result)).toEqual(swc.expected);
    });
  });

  it('should differentiate between strings in quotes and apostrophe', () => {
    const sentencesWithContractions = [
      {
        result: "Here's what you haven't noticed 'foo bar' foo'S",
        expected: "Here's What You Haven't Noticed 'Foo Bar' Foo's",
      },
    ];
    sentencesWithContractions.forEach((swc) => {
      expect(applyApTitleCase(swc.result)).toEqual(swc.expected);
    });
  });

  it('should capitalize after a colon (:)', () => {
    const sentencesWithContractions = [
      {
        result: "Here's what you haven't noticed 'foo bar' foo'S: foo Bar",
        expected: "Here's What You Haven't Noticed 'Foo Bar' Foo's: Foo Bar",
      },
    ];
    sentencesWithContractions.forEach((swc) => {
      expect(applyApTitleCase(swc.result)).toEqual(swc.expected);
    });
  });

  it('should handle new AP style stop words correctly', () => {
    const testCases = [
      {
        result: 'The Dog Jumped Up And Over The Fence',
        expected: 'The Dog Jumped Up and Over the Fence',
      },
      {
        result: 'Work As A Team',
        expected: 'Work as a Team',
      },
      {
        result: 'If You Can Dream It',
        expected: 'If You Can Dream It',
      },
      {
        result: 'Turn Off The Lights',
        expected: 'Turn off the Lights',
      },
      {
        result: 'Going Out Tonight',
        expected: 'Going out Tonight',
      },
      {
        result: 'So What Do You Think',
        expected: 'So What Do You Think',
      },
      {
        result: 'Come If You Can So We Can Talk',
        expected: 'Come if You Can so We Can Talk',
      },
      {
        result:
          "'ridiculously traumatized': CDC workers fear returning to work after fatal shooting",
        expected:
          "'Ridiculously Traumatized': CDC Workers Fear Returning to Work After Fatal Shooting",
      },
      {
        result:
          "'shock. frustration. anger.' Trump's tariff letters roil Asian allies",
        expected:
          "'Shock. Frustration. Anger.' Trump's Tariff Letters Roil Asian Allies",
      },
      {
        result:
          "'alligator alcatraz': what to know about Florida's new controversial migrant detention facility",
        expected:
          "'Alligator Alcatraz': What to Know About Florida's New Controversial Migrant Detention Facility",
      },
      {
        result:
          "'arrogant' Arsenal star, five Man Utd flops, only one Spurs man in 'big eight' worst XI of 2024/25",
        expected:
          "'Arrogant' Arsenal Star, Five Man Utd Flops, Only One Spurs Man in 'Big Eight' Worst XI of 2024/25",
      },
      {
        result:
          "'a graceful, magnetic speaker': how Susie Sorabji captivated U.S. audiences in early 20th century",
        expected:
          "'A Graceful, Magnetic Speaker': How Susie Sorabji Captivated U.S. Audiences in Early 20th Century",
      },
      {
        result:
          "'beyond my wildest dreams': the architect of Project 2025 is ready for his victory lap",
        expected:
          "'Beyond My Wildest Dreams': The Architect of Project 2025 Is Ready for His Victory Lap",
      },
      {
        result: "'anora' lands top prize at PGA awards: full winners list",
        expected: "'Anora' Lands Top Prize at PGA Awards: Full Winners List",
      },
      {
        result:
          '7 binge-worthy YouTube series that are worth spending hours watching',
        expected:
          '7 Binge-Worthy YouTube Series That Are Worth Spending Hours Watching',
      },
      {
        result:
          'as insurers around the U.S. bleed cash from climate shocks, homeowners lose',
        expected:
          'As Insurers Around the U.S. Bleed Cash From Climate Shocks, Homeowners Lose',
      },
      {
        result:
          "'love actually' is a holiday must-watch for many — but these subplots haven't aged well",
        expected:
          "'Love Actually' Is a Holiday Must-Watch for Many — but These Subplots Haven't Aged Well",
      },
      {
        result:
          "'iPhones are made in hell': 3 months inside China's iPhone city",
        expected:
          "'iPhones Are Made in Hell': 3 Months Inside China's iPhone City",
      },
    ];
    testCases.forEach(({ result, expected }) => {
      expect(applyApTitleCase(result)).toEqual(expected);
    });
  });
  it('should correctly format titles with curly apostrophes', () => {
    const testCases = [
      {
        result: 'every state\u2018S dream travel destination, mapped',
        expected: 'Every State\u2018s Dream Travel Destination, Mapped',
      },
    ];
    testCases.forEach(({ result, expected }) => {
      expect(applyApTitleCase(result)).toEqual(expected);
    });
  });

  it('should keep iPhone and similar Apple products with lowercase i', () => {
    const testCases = [
      {
        result: 'The New IPhone Is Here',
        expected: 'The New iPhone Is Here',
      },
      {
        result: 'IPad Pro Vs IPad Air',
        expected: 'iPad Pro vs iPad Air',
      },
      {
        result: 'Using ICloud With Your IPod',
        expected: 'Using iCloud With Your iPod',
      },
      {
        result: 'IMac and MacBook Pro Comparison',
        expected: 'iMac and MacBook Pro Comparison',
      },
      {
        result: 'ITunes Is Now Apple Music',
        expected: 'iTunes Is Now Apple Music',
      },
      {
        result: 'Send IMessage From Your IPhone',
        expected: 'Send iMessage From Your iPhone',
      },
      {
        result: 'IBooks: The Complete Guide',
        expected: 'iBooks: The Complete Guide',
      },
    ];
    testCases.forEach(({ result, expected }) => {
      expect(applyApTitleCase(result)).toEqual(expected);
    });
  });
});
