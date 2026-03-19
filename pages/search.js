import * as MENUS from 'constants/menus';

import { gql, useQuery } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';
import {
  Button,
  Header,
  Main,
  NavigationMenu,
  SearchInput,
  SearchResults,
  SEO,
  Footer,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import { useEffect, useState } from 'react';
import { GetSearchResults } from 'queries/GetSearchResults';
import styles from 'styles/pages/_Search.module.scss';

const searchResultsPerPage = 10;
const searchResultsFetchSize = 50;

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleResultsCount, setVisibleResultsCount] = useState(
    searchResultsPerPage
  );

  useEffect(() => {
    setVisibleResultsCount(searchResultsPerPage);
  }, [searchQuery]);

  const { data: pageData } = useQuery(Page.query, {
    variables: Page.variables(),
  });

  const { title: siteTitle, description: siteDescription } =
    pageData.generalSettings;
  const primaryMenu = pageData.headerMenuItems.nodes ?? [];
  const footerMenu = pageData?.footerMenuItems?.nodes ?? [];
  const {
    data: searchResultsData,
    loading: searchResultsLoading,
    error: searchResultsError,
    fetchMore: fetchMoreSearchResults,
  } = useQuery(GetSearchResults, {
    variables: {
      first: searchResultsFetchSize,
      after: '',
      search: searchQuery,
    },
    skip: searchQuery === '',
    fetchPolicy: 'network-only',
  });
  const filteredSearchResults =
    searchResultsData?.contentNodes?.edges
      ?.map(({ node }) => node)
      ?.filter((node) => {
        if (node.__typename !== 'Bellamontanahome') {
          return true;
        }

        const rawStatus = node?.bellaMontanaFields?.status;
        const status = Array.isArray(rawStatus)
          ? rawStatus[0]?.trim()
          : (rawStatus ?? '').trim();

        return (
          status === 'forSale' ||
          status === 'forRent' ||
          status === 'salePending'
        );
      }) ?? [];
  const visibleSearchResults = filteredSearchResults.slice(
    0,
    visibleResultsCount
  );
  const hasMoreVisibleResults =
    filteredSearchResults.length > visibleResultsCount;
  const hasMoreRawResults =
    searchResultsData?.contentNodes?.pageInfo?.hasNextPage ?? false;

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />

      <Main>
        <div className={styles['search-header-pane']}>
          <div className="container small">
            <h2 className={styles['search-header-text']}>
              {searchQuery && !searchResultsLoading
                ? `Showing results for "${searchQuery}"`
                : `Search`}
            </h2>
            <SearchInput
              value={searchQuery}
              onChange={(newValue) => setSearchQuery(newValue)}
            />
          </div>
        </div>

        <div className="container small">
          {searchResultsError && (
            <div className="alert-error">
              An error has occurred. Please refresh and try again.
            </div>
          )}

          <SearchResults
            searchResults={visibleSearchResults}
            isLoading={searchResultsLoading}
            searchQuery={searchQuery}
          />

          {(hasMoreVisibleResults || hasMoreRawResults) && (
            <div className={styles['load-more']}>
              <Button
                onClick={async () => {
                  const nextVisibleCount =
                    visibleResultsCount + searchResultsPerPage;

                  if (filteredSearchResults.length >= nextVisibleCount) {
                    setVisibleResultsCount(nextVisibleCount);
                    return;
                  }

                  if (!hasMoreRawResults) {
                    setVisibleResultsCount(nextVisibleCount);
                    return;
                  }

                  setVisibleResultsCount(nextVisibleCount);

                  await fetchMoreSearchResults({
                    variables: {
                      first: searchResultsFetchSize,
                      after:
                        searchResultsData?.contentNodes?.pageInfo?.endCursor,
                      search: searchQuery,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      if (!fetchMoreResult?.contentNodes) {
                        return previousResult;
                      }

                      return {
                        ...previousResult,
                        contentNodes: {
                          ...fetchMoreResult.contentNodes,
                          edges: [
                            ...(previousResult?.contentNodes?.edges ?? []),
                            ...(fetchMoreResult?.contentNodes?.edges ?? []),
                          ],
                        },
                      };
                    },
                  });
                }}
              >
                Load more
              </Button>
            </div>
          )}

        </div>
      </Main>
      <Footer menuItems={footerMenu} />
    </>
  );
}

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    categories {
      nodes {
        databaseId
        uri
        name
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

export function getStaticProps(ctx) {
  return getNextStaticProps(ctx, { Page });
}
