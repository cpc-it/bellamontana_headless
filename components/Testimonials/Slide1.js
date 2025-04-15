import classNames from 'classnames/bind';
import Button from 'components/Button';
import Image from 'next/image';

import styles from './Testimonials.module.scss';

const cx = classNames.bind(styles);

export default function Slide1() {
  return (
    <>

        <div className={cx('slideContent')}>
            <h2>
                Conveniently
                <span>Affordable</span>
            </h2>
            
            <p>The Bella Montaña community is a residential neighborhood just minutes from campus designed by Cal Poly Partners to give faculty and staff the chance to own a home in San Luis Obispo, and be moments from everything that makes the Central Coast a great place to live.</p>

          <div className={cx('icons-wrapper')}>

            <div className={cx('single-icon')}>
              <Image
                src="/static/slider/icon-mountain.png"
                width="100"
                height="100"
                objectFit="contain"
                layout="responsive"
              />
              <p>Beautiful Views</p>
            </div>

            <div className={cx('single-icon')}>
              <Image
                src="/static/slider/icon-house.png"
                width="100"
                height="100"
                objectFit="contain"
                layout="responsive"
              />
              <p>Distinct Interiors</p>
            </div>

            <div className={cx('single-icon')}>
              <Image
                src="/static/slider/icon-chair.png"
                width="100"
                height="100"
                objectFit="contain"
                layout="responsive"
              />
              <p>Elegant Living Areas</p>
            </div>

            <div className={cx('single-icon')}>
              <Image
                src="/static/slider/icon-lights.png"
                width="100"
                height="100"
                objectFit="contain"
                layout="responsive"
              />
              <p>Contemporary Finishes & Fixtures</p>
            </div>

            <div className={cx('single-icon')}>
              <Image
                src="/static/slider/icon-bolt.png"
                width="100"
                height="100"
                objectFit="contain"
                layout="responsive"
              />
              <p>Energy Saving Appliances</p>
            </div>

            <div className={cx('single-icon')}>
              <Image
                src="/static/slider/icon-condo.png"
                width="100"
                height="100"
                objectFit="contain"
                layout="responsive"
              />
              <p>Priced Well Below SLO Market</p>
            </div>
          
          </div>

            <Button href="/about/">About our Homes</Button>
            
        </div>
        
        <div className={cx('slideImg slide1Img')}>

        </div>


    </>
  );
}
