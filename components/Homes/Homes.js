import { gql } from '@apollo/client';
import React from 'react';
import Link from 'next/link';
import { Heading, FeaturedImage } from 'components';
import Button from 'components/Button';
import className from 'classnames/bind';
import useFocusFirstNewResult from 'hooks/useFocusFirstNewResult';
import appConfig from 'app.config';

import styles from './Homes.module.scss';
const cx = className.bind(styles);

// Currency formatter
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

/**
 * Renders a list of Bella Montaña Home items
 * @param {Props} props The props object.
 * @param {Bellamontanahome[]} props.homes The array of home items.
 * @param {string} props.id The unique id for this component.
 * @returns {React.ReactElement} The Homes component
 */
function Homes({ homes, id }) {
  const filteredHomes = homes.filter((home) => {
    const status = home.bellaMontanaFields?.status ?? [];
    return Array.isArray(status) && (
      status.includes('forSale') || status.includes('forRent')
    );
  });

  const { firstNewResultRef, firstNewResultIndex } =
    useFocusFirstNewResult(filteredHomes);

  return (
    <section {...(id && { id })}>
      {filteredHomes.map((home, i) => {
        const isFirstNewResult = i === firstNewResultIndex;
        const { status, price, dateAvailable } = home.bellaMontanaFields ?? {};
        const normalizedStatus = Array.isArray(status) ? status[0]?.trim() : (status ?? '').trim();

        return (
          <>
          <div className="row" key={home.id ?? ''} id={`home-${home.id}`}>
            <div className={cx('list-item')}>

              <a href={`/available-homes${home?.uri?.replace('/bella-montana-home', '') ?? ''}`} className={cx('imageWrap')}>
                <FeaturedImage
                  className={cx('image')}
                  image={home?.featuredImage?.node}
                  priority={i < appConfig.projectsAboveTheFold}
                />
              </a>

              <div className={cx('content')}>
                <Heading level="h3">
                  <Link
                    legacyBehavior
                    href={`/available-homes${home?.uri?.replace('/bella-montana-home', '') ?? ''}`}
                  >
                    <a ref={isFirstNewResult ? firstNewResultRef : null}>
                      {home.title}
                    </a>
                  </Link>
                </Heading>

                {normalizedStatus === 'forRent' && (
                  <p><strong>For Rent:</strong> {formatCurrency(price)} / month</p>
                )}
                {normalizedStatus === 'forSale' && (
                  <p><strong>For Sale:</strong> {formatCurrency(price)}</p>
                )}
                {!['forRent', 'forSale'].includes(normalizedStatus) && normalizedStatus && (
                  <p><strong>Status:</strong> {normalizedStatus}</p>
                )}

                {dateAvailable && (
                  <p><strong>Date Available:</strong> {formatDate(dateAvailable)}</p>
                )}
                
                <Button href={`/available-homes${home?.uri?.replace('/bella-montana-home', '') ?? ''}`} className={cx('learnMore')}>Learn More</Button>
                
              </div>
            </div>
          </div>

            {filteredHomes.length >= 1 && (
                <hr />
            )}

          </>
        );
      })}

      

      {filteredHomes.length < 1 && (
        <div>
          <h2><span>No Homes</span> Currently Available</h2>
          <p>
            There are currently no homes available at this time. Please see our{' '}
            <a href="#footer-contact">Interested Buyers</a> section for more information.
          </p>
        </div>
      )}
    </section>
  );
}

Homes.fragments = {
  entry: gql`
    fragment HomesFragment on Bellamontanahome {
      id
      uri
      title
      bellaMontanaFields {
        status
        price
        dateAvailable
      }
      ...FeaturedImageFragment
    }
  `,
};

export default Homes;
