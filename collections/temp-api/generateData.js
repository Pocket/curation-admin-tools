const jsf = require('json-schema-faker');
const fs = require('fs');
jsf.extend('faker', () => {
  const faker = require('faker');

  faker.custom = {
    authorName: () => {
      return `${faker.name.firstName()} ${faker.name.lastName()}`;
    },
    authorPhoto: () => {
      const random = Math.round(Math.random() * 1000);
      return `${faker.image.people()}?random=${random}`;
    },
    createdAt: () => {
      // any time in the last 30 days
      return faker.date.recent(30).toISOString();
    },
    imageUrl: () => {
      const random = Math.round(Math.random() * 1000);
      return faker.random.arrayElement([
        `${faker.image.nature()}?random=${random}`,
        `${faker.image.city()}?random=${random}`,
        `${faker.image.food()}?random=${random}`,
      ]);
    },
  };

  return faker;
});

jsf.option({
  resolveJsonPath: true,
  alwaysFakeOptionals: true,
});

const schema = {
  type: 'object',
  required: ['authors', 'collections'],
  properties: {
    authors: {
      type: 'array',
      minItems: 15,
      maxItems: 15,
      items: { $ref: '#/definitions/authors' },
    },
    collections: {
      type: 'array',
      minItems: 50,
      maxItems: 60,
      items: { $ref: '#/definitions/collections' },
    },
  },
  definitions: {
    authors: {
      type: 'object',
      required: ['externalId', 'name'],
      properties: {
        externalId: {
          type: 'string',
          faker: 'datatype.uuid',
        },
        name: {
          type: 'string',
          faker: 'custom.authorName',
        },
        slug: {
          type: 'string',
          faker: 'lorem.slug',
        },
        bio: {
          type: 'string',
          faker: 'lorem.paragraphs',
        },
        imageUrl: {
          type: 'string',
          faker: 'custom.authorPhoto',
        },
        active: {
          type: 'boolean',
          faker: 'datatype.boolean',
        },
        createdAt: {
          type: 'string',
          faker: 'custom.createdAt',
        },
        updatedAt: {
          type: 'string',
          enum: [null],
        },
      },
    },

    collections: {
      type: 'object',
      required: [
        'externalId',
        'slug',
        'title',
        'excerpt',
        'intro',
        'imageUrl',
        'status',
      ],
      properties: {
        externalId: {
          type: 'string',
          faker: 'datatype.uuid',
        },
        author_id: {
          type: 'string',
          jsonPath: '$..authors[*].externalId',
        },
        slug: {
          type: 'string',
          faker: 'lorem.slug',
        },
        title: {
          type: 'string',
          faker: 'lorem.sentence',
        },
        excerpt: {
          type: 'string',
          faker: 'lorem.paragraph',
        },
        intro: {
          type: 'string',
          faker: 'lorem.paragraphs',
        },
        imageUrl: {
          type: 'string',
          faker: 'custom.imageUrl',
        },
        status: {
          type: 'string',
          enum: ['draft', 'published', 'archived'],
        },
        createdAt: {
          type: 'string',
          faker: 'custom.createdAt',
        },
        updatedAt: {
          type: 'string',
          value: null,
        },
      },
    },
  },
};

jsf.resolve(schema).then((data) => {
  const path = `${__dirname}/db.json`;
  console.log('Generating new data...');

  // Delete the previous db.json file if it exists
  // Truncating it below when overwriting is not enough. Why?
  // But this is better than the blank screen of death
  if (fs.existsSync(path)) {
    fs.unlink(path, (error) => {
      if (error) throw error;
    });
  }

  fs.writeFile(
    path,
    JSON.stringify(data, null, 2),
    // Make sure the file is writable so that changes made on the frontend persist.
    // Note that it's still not enough - something else is needed to get it to work.
    { mode: 0o666 },
    function (error) {
      if (error) throw error;

      // And make sure it's writable on Linux as well
      // (see https://github.com/nodejs/node/issues/1104)
      fs.chmod(path, 0o666, (error) => {
        console.log(
          'Done.\n\033[1mRun `npm run api:start` to start using the local API server'
        );
      });
    }
  );
});
