import * as MENUS from 'constants/menus';
import { gql } from '@apollo/client';
import {
  Header,
  EntryHeader,
  Footer,
  ProjectHeader,
  ContentWrapper,
  NavigationMenu,
  FeaturedImage,
  Main,
  SEO,
} from 'components';
import { BlogInfoFragment } from 'fragments/GeneralSettings';

export default function Component(props) {
  if (props.loading) {
    return <>Loading...</>;
  }
  
  const { title: siteTitle } = props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  
  const { title, content, featuredImage, bellaMontanaFields } = props.data.bellamontanahome;
  const { status, price, rentalDeposit, dateAvailable, realtorName, realtorEmail, realtorPhone } = bellaMontanaFields;

  const isAvailable = status === 'forRent' || status === 'forSale';

  return (
    <>
      <SEO
        title={`${title} - ${siteTitle}`}
        imageUrl={featuredImage?.node?.sourceUrl}
      />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title={title} />

        <div className="container content">
          <h1>{title}</h1>
        </div>

        <ContentWrapper>        
          {bellaMontanaFields?.status && (
            <>
              <ProjectHeader
                image={featuredImage?.node}
                title={title}
              />
              <div
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <h3>Status: {bellaMontanaFields.status}</h3>
              <h3>price: {bellaMontanaFields.price}</h3>
              <h3>rentalDeposit: {bellaMontanaFields.rentalDeposit}</h3>
              <h3>dateAvailable: {bellaMontanaFields.dateAvailable}</h3>
              <h3>realtorName: {bellaMontanaFields.realtorName}</h3>
              <h3>realtorEmail: {bellaMontanaFields.realtorEmail}</h3>
              <h3>realtorPhone: {bellaMontanaFields.realtorPhone}</h3>
            </>
          )}
        </ContentWrapper>

      </Main>


      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  query GetPost(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    bellamontanahome(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      bellaMontanaFields {
        status
        price
        rentalDeposit
        dateAvailable
        realtorName
        realtorEmail
        realtorPhone
      }
      ...FeaturedImageFragment
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

Component.variables = ({ databaseId }, ctx) => ({
  databaseId,
  headerLocation: MENUS.PRIMARY_LOCATION,
  footerLocation: MENUS.FOOTER_LOCATION,
  asPreview: ctx?.asPreview,
});
