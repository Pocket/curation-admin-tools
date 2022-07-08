import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { gql } from '@apollo/client';
import { buildClientSchema, execute } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';
import introspection from './api/introspection.json';

import { config } from './config';
import {
  ProspectType,
  ScheduledCorpusItem,
  ScheduledSurface,
} from './api/generatedTypes';

// Build a schema using the introspection

// The below is needed for as long as this issue remains open:
// https://github.com/graphql/graphql-js/issues/3409
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const schema = buildClientSchema(introspection);

// Stub out our schema with fake data
const mockedSchema = addMocksToSchema({
  schema,
  mocks: {
    // The good thing here is that there is no need to mock the query
    // AND we can type the query result with types from generatedTypes.ts
    // The not so good thing is that the responses still need to be fully mocked,
    // even in this one central place!
    // TODO: add all available surfaces here
    getScheduledSurfacesForUser: (): ScheduledSurface[] => [
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
    ],
    // TODO: to be mocked in more detail (:
    getScheduledCorpusItems: (): ScheduledCorpusItem[] => [],
  },
});

// Set up a server that reads a GraphQL document and returns the data for it
setupServer(
  rest.post<{ query: string; variables: any }>(
    config.adminApiEndpoint,
    async (req, res, ctx) => {
      const result = await execute(
        mockedSchema,
        gql`
          ${req.body.query}
        `,
        null,
        null,
        req.body.variables
      );

      return res(ctx.json(result));
    }
  )
);
