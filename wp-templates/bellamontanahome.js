import classNames from 'classnames/bind';
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

import styles from 'styles/pages/_Homes.module.scss';

const cx = classNames.bind(styles);

const formatCurrency = (value) => {
  if (!value) return '';
  const number = parseFloat(value);
  if (isNaN(number)) return value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(number);
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatPhoneNumber = (value) => {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length !== 10 && digits.length !== 11) return value;

  const offset = digits.length === 11 ? 1 : 0;
  const areaCode = digits.substring(0 + offset, 3 + offset);
  const firstPart = digits.substring(3 + offset, 6 + offset);
  const secondPart = digits.substring(6 + offset, 10 + offset);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
};

export default function Component(props) {
  if (props.loading) {
    return <>Loading...</>;
  }
  
  const { title: siteTitle } = props?.data?.generalSettings;
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];

  const { title, content, featuredImage, bellaMontanaFields } = props.data.bellamontanahome;

  let {
    status,
    price,
    rentalDeposit,
    dateAvailable,
    realtorName,
    realtorEmail,
    realtorPhone
  } = bellaMontanaFields;

  // Normalize status: handles string or array (first value), trims whitespace
  status = Array.isArray(status) ? status[0] : status;
  status = typeof status === 'string' ? status.trim() : '';

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

          <ContentWrapper>

          <div className={cx('contactWrap')}>
            <div className={cx('contactInfo')}>
                  <h1>{title}</h1>

                  {bellaMontanaFields?.status && (
                  <>

                    {status === 'forRent' && price && (
                      <p><strong>For Rent:</strong> {formatCurrency(price)} / month</p>
                    )}
                    {status === 'forSale' && price && (
                      <p><strong>For Sale:</strong> {formatCurrency(price)}</p>
                    )}

                    {status === 'forRent' && rentalDeposit && (
                      <p><strong>Rental Deposit:</strong> {formatCurrency(rentalDeposit)}</p>
                    )}

                    {status === 'salePending' && (
                      <p><strong>Sale Pending</strong></p>
                    )}

                    {status !== 'salePending' && dateAvailable && (
                      <p><strong>Date Available:</strong> {formatDate(dateAvailable)}</p>
                    )}

                    {(realtorName || realtorEmail || realtorPhone) && <h2>Contact Information</h2>}

                    {realtorName && <p><strong>{realtorName}</strong></p>}

                    {realtorEmail && (
                      <p>
                        <a href={`mailto:${realtorEmail}`}>{realtorEmail}</a>
                      </p>
                    )}

                    {realtorPhone && (
                      <p>
                        <a href={`tel:${String(realtorPhone).replace(/\D/g, '')}`}>
                          {formatPhoneNumber(realtorPhone)}
                        </a>
                      </p>
                    )}

                  </>
                )}

            </div>

            <div className={cx('homeImage')}>
            <a href={featuredImage?.node?.sourceUrl} target="_blank" rel="noopener noreferrer">
                <FeaturedImage image={featuredImage?.node} />
              </a>
            </div>

          </div>

          </ContentWrapper>
        </div>

        <ContentWrapper className="container">
          <hr />
        </ContentWrapper>

        <ContentWrapper>
          {bellaMontanaFields?.status && (
            <div className={cx('highlights')}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
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
