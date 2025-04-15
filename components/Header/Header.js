import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FaBars, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

import { NavigationMenu, SkipNavigationLink } from '../';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

export default function Header({ className, menuItems, isTransparent = false }) {
  const [isNavShown, setIsNavShown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = cx('header', className, {
    transparent: isTransparent && !isScrolled,
    scrolled: isScrolled || !isTransparent,
    'over-hero': isTransparent, // used for absolute positioning
  });

  const navClasses = cx(
    'primary-navigation',
    isNavShown ? cx('show') : undefined
  );

  return (
    <header className={headerClasses}>
      <SkipNavigationLink />
      <div className="container">
        <div className={cx('bar')}>
          <div className={cx('logo')}>
            <Link legacyBehavior href="/">
              <a title="Home">
                <Image
                  src="/logo-color.png"
                  width={400}
                  height={80}
                  alt="Bella Montana logo"
                  layout="responsive"
                  priority
                />
              </a>
            </Link>
          </div>
          <button
            type="button"
            className={cx('nav-toggle')}
            onClick={() => setIsNavShown(!isNavShown)}
            aria-label="Toggle navigation"
            aria-controls={cx('primary-navigation')}
            aria-expanded={isNavShown}
          >
            <FaBars />
          </button>
          <NavigationMenu
            id={cx('primary-navigation')}
            className={navClasses}
            menuItems={menuItems}
          >
            <li>
              <Link legacyBehavior href="/search">
                <a>
                  <FaSearch title="Search" role="img" />
                </a>
              </Link>
            </li>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
