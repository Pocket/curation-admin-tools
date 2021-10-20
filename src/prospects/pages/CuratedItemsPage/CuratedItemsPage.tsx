import React from 'react';
import { useFetchMoreResults } from '../../../_shared/hooks';
import {
  CuratedItemEdge,
  useGetCuratedItemsQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import { HandleApiResponse, LoadMore } from '../../../_shared/components';
import { CuratedItemListCard, CuratedItemSearchForm } from '../../components';
import { config } from '../../../config';

export const CuratedItemsPage: React.FC = (): JSX.Element => {
  const [loading, reloading, error, data, updateData] = useFetchMoreResults(
    useGetCuratedItemsQuery,
    {
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage },
      },
    }
  );

  return (
    <>
      <h1>Curated Corpus</h1>

      <CuratedItemSearchForm
        onSubmit={() => {
          // This arrow function is not empty.
          // Take that, ESLint!
        }}
      />
      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.getCuratedItems.edges.map((edge: CuratedItemEdge) => {
          if (edge.node) {
            return (
              <CuratedItemListCard
                key={edge.node?.externalId}
                item={edge.node}
              />
            );
          }
        })}

      {data && (
        <LoadMore
          buttonDisabled={
            data.getCuratedItems.edges.length ===
            data.getCuratedItems.totalCount
          }
          loadMore={updateData}
          showSpinner={reloading}
        />
      )}
    </>
  );
};
