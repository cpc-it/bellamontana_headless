import * as MENUS from 'constants/menus';

import { useQuery, gql } from '@apollo/client';
import { FaArrowRight } from 'react-icons/fa';
import styles from 'styles/pages/_Home.module.scss';
import {
  EntryHeader,
  Main,
  Button,
  Heading,
  Hero,
  CTA,
  NavigationMenu,
  SEO,
  Header,
  Footer,
  Posts,
  Testimonials,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';

const postsPerPage = 3;

export default function Component() {
  const { data, loading } = useQuery(Component.query, {
    variables: Component.variables(),
  });
  if (loading) {
    return null;
  }

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];

  const mainBanner = {
    sourceUrl: '/static/banner.jpeg',
    mediaDetails: { width: 1200, height: 600 },
    altText: 'Portfolio Banner',
  };
  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />

      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
        isTransparent={true}
      />

      <Main className={styles.home}>
        <Hero />
        {/* <EntryHeader image={mainBanner} /> */}
        <div className="homeSliderWrap">
          <div className="container testContain">
            <section className={styles.testimonials}>
              <Testimonials testimonials={data?.testimonials?.nodes} />
            </section>
          </div>
        </div>
      </Main>
      <Footer menuItems={footerMenu} />
    </>
  );
}

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    first: postsPerPage,
  };
};

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${Posts.fragments.entry}
  ${Testimonials.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $first: Int
  ) {
    posts(first: $first) {
      nodes {
        ...PostsItemFragment
      }
    }
    testimonials {
      nodes {
        ...TestimonialsFragment
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
