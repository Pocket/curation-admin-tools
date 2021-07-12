import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import {
  Button,
  CollectionListCard,
  CustomTabType,
  HandleApiResponse,
  TabPanel,
  TabSet,
} from '../../components';
import {
  useGetDraftCollectionsQuery,
  useGetPublishedCollectionsQuery,
  useGetArchivedCollectionsQuery,
  Collection,
} from '../../api/collection-api/generatedTypes';

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
  const { loading, error, data } = useGetDraftCollectionsQuery({
    variables: { perPage: 50 },
  });

  // Load published collections
  const {
    loading: loadingPublished,
    error: errorPublished,
    data: dataPublished,
  } = useGetPublishedCollectionsQuery({
    variables: { perPage: 50 },
  });

  // Load archived collections
  const {
    loading: loadingArchived,
    error: errorArchived,
    data: dataArchived,
  } = useGetArchivedCollectionsQuery({
    variables: { perPage: 50 },
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
      </TabPanel>
    </>
  );
};
