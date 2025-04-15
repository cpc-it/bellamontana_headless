import classNames from 'classnames/bind';
import Image from 'next/image';
import Button from 'components/Button';

import styles from './Hero.module.scss';

const cx = classNames.bind(styles);

/**
 * The Blueprint's Hero component
 * @return {React.ReactElement} The Hero component.
 */
export default function Hero() {
  return (
    <div className={cx('hero-wrap')}>
      <div className="container">
        <div className={cx('hero-content')}>
            <Image
              src="/static/welcome-to-bm.png"
              width="100"
              height="100"
              objectFit="contain"
              layout="responsive"
            />
            <p>An exclusive residential community designed by <span>Cal Poly Partners</span> for university and faculty staff.</p>
            <Button href="/available-homes/">Available Homes</Button>
        </div>
      </div>
    </div>
  );
}
