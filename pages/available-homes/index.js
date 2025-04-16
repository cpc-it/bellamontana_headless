import * as MENUS from 'constants/menus';

import { gql, useQuery } from '@apollo/client';
import React from 'react';
import {
  FeaturedImage,
  Footer,
  Header,
  Contact,
  EntryHeader,
  ContentWrapper,
  LoadMore,
  Main,
  Homes,
  SEO,
  NavigationMenu,
} from 'components';
import { getNextStaticProps } from '@faustwp/core';
import { pageTitle } from 'utilities';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import appConfig from 'app.config';

export default function Page() {
  const { data, loading, fetchMore } = useQuery(Page.query, {
    variables: Page.variables(),
  });

  if (loading) {
    return <></>;
  }

  const { title: siteTitle } = data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const homeList = data?.bellamontanahomes?.nodes ?? [];

  return (
    <>
      <SEO title={pageTitle(data?.generalSettings, 'Available Homes')} />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title="Bella Montaña Homes" />
        <div className="container content">
         <h1>Available Homes</h1>
          <ContentWrapper>
          <p>Just across from the Highland Drive entrance to Cal Poly, Bella Montaña offers convenience, contemporary living, and style. With ten graceful floor plans, each with their own distinctive features, Bella Montaña accommodates a wide variety of activities and lifestyles.</p>
          <Homes homes={homeList} id="homes-list" />
            <LoadMore
              className="text-center"
              hasNextPage={data.bellamontanahomes.pageInfo.hasNextPage}
              endCursor={data.bellamontanahomes.pageInfo.endCursor}
              isLoading={loading}
              fetchMore={fetchMore}
            />
          </ContentWrapper>
        </div>
      </Main>
      <Contact />
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  ${Homes.fragments.entry}
  query GetHomesPage(
    $first: Int!
    $after: String!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    bellamontanahomes(first: $first, after: $after) {
      nodes {
        ...HomesFragment
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
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
  }
`;

Page.variables = () => ({
  first: appConfig.projectsPerPage,
  after: '',
  headerLocation: MENUS.PRIMARY_LOCATION,
  footerLocation: MENUS.FOOTER_LOCATION,
});

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
  });
}
