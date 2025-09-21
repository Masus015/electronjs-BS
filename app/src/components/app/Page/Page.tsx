'use client';

import styles from './Page.module.css';
import React from 'react';
import useStore from '@/utils/useStore';
import Settings from '@/components/tabs/main/settings/settings';
import Home from '@/components/tabs/main/home/home';
import Dayz from '@/components/tabs/games/dayz/dayz';


export default function Page() {
  const page = useStore((state) => state.page);
  const [displayedPage, setDisplayedPage] = React.useState(page);
  const [fadeState, setFadeState] = React.useState<'in' | 'out'>('in');

  React.useEffect(() => {
    if (page !== displayedPage) {
      setFadeState('out');
      const timeout = setTimeout(() => {
        setDisplayedPage(page);
        setFadeState('in');
      }, 320); // длительность анимации
      return () => clearTimeout(timeout);
    }
  }, [page, displayedPage]);

  let content = null;
  if (displayedPage === 'home') content = <Home />;
  if (displayedPage === 'settings') content = <Settings />;
  if (displayedPage === 'dayz') content = <Dayz />;

  return (
    <div className={styles.pageContainer}>
      <div className={fadeState === 'in' ? styles.fadeIn : styles.fadeOut}>
        {content}
      </div>
    </div>
  );
}
