import * as MENUS from 'constants/menus';

import { gql, useQuery } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';
import {
  Button,
  Footer,
  Header,
  Main,
  NavigationMenu,
  SEO,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';
import styles from 'styles/pages/_404.module.scss';

const fallbackSiteTitle = 'Bella Montana';

export default function Custom404() {
  const { data, loading } = useQuery(Custom404.query, {
    variables: Custom404.variables(),
  });

  if (loading) {
    return null;
  }

  const siteTitle = data?.generalSettings?.title ?? fallbackSiteTitle;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];

  return (
    <>
      <SEO
        title={`Page Not Found | ${siteTitle}`}
        description="The page you requested could not be found. Use the links below to continue exploring Bella Montana."
      />

      <Header menuItems={primaryMenu} />

      <Main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroPanel}>
              <p className={styles.kicker}>404</p>
              <h1>Page not found</h1>
              <p className={styles.lead}>
                The Bella Montana page you were trying to reach does not exist,
                may have moved, or the link was entered incorrectly.
              </p>
              <p className={styles.supporting}>
                Use one of the primary paths below to continue browsing the
                site.
              </p>

              <div className={styles.actions}>
                <Button href="/">Back to Home</Button>
                <Button href="/available-homes" styleType="secondary">
                  View Available Homes
                </Button>
                <Button href="/search" styleType="secondary">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Main>

      <Footer />
    </>
  );
}

Custom404.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};

Custom404.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query Get404PageData(
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
  }
`;

export function getStaticProps(ctx) {
  return getNextStaticProps(ctx, { Page: Custom404 });
}
