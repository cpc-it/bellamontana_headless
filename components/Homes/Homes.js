import { gql } from '@apollo/client';
import React from 'react';
import Link from 'next/link';
import { Heading, FeaturedImage } from 'components';
import className from 'classnames/bind';
import useFocusFirstNewResult from 'hooks/useFocusFirstNewResult';
import appConfig from 'app.config';

import styles from './Homes.module.scss';
const cx = className.bind(styles);

/**
 * Renders a list of Bella Montaña Home items
 * @param {Props} props The props object.
 * @param {Bellamontanahome[]} props.homes The array of home items.
 * @param {string} props.id The unique id for this component.
 * @param {string} props.emptyText Message to show when there are no items.
 * @returns {React.ReactElement} The Homes component
 */
function Homes({ homes, id, emptyText = 'No homes found.' }) {
  
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

        return (
          <div className="row" key={home.id ?? ''} id={`home-${home.id}`}>
            <div className={cx('list-item')}>
              <FeaturedImage
                className={cx('image')}
                image={home?.featuredImage?.node}
                priority={i < appConfig.projectsAboveTheFold}
              />
              <div className={cx('content')}>
                <Heading level="h3">
                <Link
                    legacyBehavior
                    href={`/available-homes${home?.uri?.replace('/bella-montana-home', '') ?? ''}`}
                  >

                    <a ref={isFirstNewResult ? firstNewResultRef : null}>
                      {home.bellaMontanaFields?.projectTitle ?? home.title}
                    </a>
                  </Link>
                </Heading>
                <div>Status: {home.bellaMontanaFields?.status?.join(', ')}</div>
              </div>
            </div>
          </div>
        );
      })}
      {filteredHomes.length < 1 && 
        <div><h2><span>No Homes</span> Currently Available</h2><p>There are currently no homes available at this time. Please see our <a href="#footer-contact">Interested Buyers</a> section for more information.</p></div>
        
      }
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
      }
      ...FeaturedImageFragment
    }
  `,
};

export default Homes;
