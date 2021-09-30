import React from 'react';
import { useFetchMoreResults } from '../../../_shared/hooks';
import { config } from '../../../config';
import {
  CuratedItem,
  useGetCuratedItemsQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import { HandleApiResponse, LoadMore } from '../../../_shared/components';
import { CuratedItemListCard } from '../../components';

export const CuratedItemsPage: React.FC = (): JSX.Element => {
  const [loading, reloading, error, data, updateData] = useFetchMoreResults(
    useGetCuratedItemsQuery,
    {
      variables: {
        perPage: config.pagination.curatedItemsPerPage,
        page: 1,
      },
    }
  );

  return (
    <>
      <h1>Curated Corpus</h1>

      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.getCuratedItems.items.map((item: CuratedItem) => {
          return <CuratedItemListCard key={item.externalId} item={item} />;
        })}

      {data && (
        <LoadMore
          buttonDisabled={
            data.getCuratedItems.items.length ===
            data.getCuratedItems.pagination?.totalResults
          }
          loadMore={updateData}
          showSpinner={reloading}
        />
      )}
    </>
  );
};
