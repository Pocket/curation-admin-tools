import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import {
  Button,
  CollectionListCard,
  CustomTabType,
  HandleApiResponse,
  LoadMore,
  TabPanel,
  TabSet,
} from '../../components';
import {
  Collection,
  CollectionStatus,
  useGetCollectionsQuery,
} from '../../api/collection-api/generatedTypes';
import { config } from '../../config';
import { useFetchMoreResults } from '../../hooks';

/**
 * Collection List Page
 */
export const CollectionListPage = (): JSX.Element => {
  const { pathname } = useLocation();

  /**
   * Set the value of the active tab to path name - drafts tab by default
   */
  const [value, setValue] = useState<string>(
    pathname ?? '/collections/drafts/'
  );

  // switch to active tab when user clicks on tab heading
  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: string
  ): void => {
    setValue(newValue);
  };

  // Load draft collections
  const [loading, reloading, error, data, fetchMoreDraftCollections] =
    useFetchMoreResults(useGetCollectionsQuery, {
      variables: {
        page: 1,
        perPage: config.pagination.collectionsPerPage,
        status: CollectionStatus.Draft,
      },
    });

  // Load collections under review
  const [
    loadingReview,
    reloadingReview,
    errorReview,
    dataReview,
    fetchMoreReviewCollections,
  ] = useFetchMoreResults(useGetCollectionsQuery, {
    variables: {
      page: 1,
      perPage: config.pagination.collectionsPerPage,
      status: CollectionStatus.Review,
    },
  });

  // Load published collections
  const [
    loadingPublished,
    reloadingPublished,
    errorPublished,
    dataPublished,
    fetchMorePublishedCollections,
  ] = useFetchMoreResults(useGetCollectionsQuery, {
    variables: {
      page: 1,
      perPage: config.pagination.collectionsPerPage,
      status: CollectionStatus.Published,
    },
  });

  // Load archived collections
  const [
    loadingArchived,
    reloadingArchived,
    errorArchived,
    dataArchived,
    fetchMoreArchivedCollections,
  ] = useFetchMoreResults(useGetCollectionsQuery, {
    variables: {
      page: 1,
      perPage: config.pagination.collectionsPerPage,
      status: CollectionStatus.Archived,
    },
  });

  // Define the set of tabs that we're going to show on this page
  const tabs: CustomTabType[] = [
    {
      label: 'Drafts',
      pathname: '/collections/drafts/',
      count: data?.searchCollections.pagination.totalResults,
      hasLink: true,
    },
    {
      label: 'Review',
      pathname: '/collections/review/',
      count: dataReview?.searchCollections.pagination.totalResults,
      hasLink: true,
    },
    {
      label: 'Published',
      pathname: '/collections/published/',
      count: dataPublished?.searchCollections.pagination.totalResults,
      hasLink: true,
    },
    {
      label: 'Archived',
      pathname: '/collections/archived/',
      count: dataArchived?.searchCollections.pagination.totalResults,
      hasLink: true,
    },
  ];

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Collections</h1>
        </Box>
        <Box alignSelf="center">
          <Button component={Link} to="/collections/add/" buttonType="hollow">
            Add collection
          </Button>
        </Box>
      </Box>

      <Box paddingTop={3}>
        <TabSet currentTab={value} handleChange={handleChange} tabs={tabs} />
      </Box>

      <TabPanel value={value} index="/collections/drafts/">
        {!data && <HandleApiResponse loading={loading} error={error} />}

        {data &&
          data.searchCollections.collections.map(
            (collection: Omit<Collection, 'stories'>) => {
              return (
                <CollectionListCard
                  key={collection.externalId}
                  collection={collection}
                />
              );
            }
          )}

        {data && (
          <LoadMore
            buttonDisabled={
              data.searchCollections.collections.length ===
              data.searchCollections.pagination?.totalResults
            }
            loadMore={fetchMoreDraftCollections}
            showSpinner={reloading}
          />
        )}
      </TabPanel>

      <TabPanel value={value} index="/collections/review/">
        {!dataReview && (
          <HandleApiResponse loading={loadingReview} error={errorReview} />
        )}

        {dataReview &&
          dataReview.searchCollections.collections.map(
            (collection: Omit<Collection, 'stories'>) => {
              return (
                <CollectionListCard
                  key={collection.externalId}
                  collection={collection}
                />
              );
            }
          )}

        {dataReview && (
          <LoadMore
            buttonDisabled={
              dataReview.searchCollections.collections.length ===
              dataReview.searchCollections.pagination?.totalResults
            }
            loadMore={fetchMoreReviewCollections}
            showSpinner={reloadingReview}
          />
        )}
      </TabPanel>

      <TabPanel value={value} index="/collections/published/">
        {!dataPublished && (
          <HandleApiResponse
            loading={loadingPublished}
            error={errorPublished}
          />
        )}

        {dataPublished &&
          dataPublished.searchCollections.collections.map(
            (collection: Omit<Collection, 'stories'>) => {
              return (
                <CollectionListCard
                  key={collection.externalId}
                  collection={collection}
                />
              );
            }
          )}

        {dataPublished && (
          <LoadMore
            buttonDisabled={
              dataPublished.searchCollections.collections.length ===
              dataPublished.searchCollections.pagination?.totalResults
            }
            loadMore={fetchMorePublishedCollections}
            showSpinner={reloadingPublished}
          />
        )}
      </TabPanel>

      <TabPanel value={value} index="/collections/archived/">
        {!dataArchived && (
          <HandleApiResponse loading={loadingArchived} error={errorArchived} />
        )}

        {dataArchived &&
          dataArchived.searchCollections.collections.map(
            (collection: Omit<Collection, 'stories'>) => {
              return (
                <CollectionListCard
                  key={collection.externalId}
                  collection={collection}
                />
              );
            }
          )}

        {dataArchived && (
          <LoadMore
            buttonDisabled={
              dataArchived.searchCollections.collections.length ===
              dataArchived.searchCollections.pagination?.totalResults
            }
            loadMore={fetchMoreArchivedCollections}
            showSpinner={reloadingArchived}
          />
        )}
      </TabPanel>
    </>
  );
};
