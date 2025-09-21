'use client';

const isProd = process.env.NODE_ENV === 'production';
const assetPrefix = isProd ? '' : '';

import styles from './Menu.module.css';
import useStore from '@/utils/useStore'
import { useSound } from '@/utils/useSound';
import { useEffect, useState } from 'react';

const mainTabs = [
  {
    key: 'settings',
    label: 'настройки',
    icon: <img src={`${assetPrefix}icons/tabs/settings.ico`} alt="settings" width={15} height={15} draggable={false} className={styles.svg} />,
  },
  {
    key: 'home',
    label: 'главная',
    icon: <img src={`${assetPrefix}icons/tabs/home.svg`} alt="home" width={15} height={15} draggable={false} className={styles.svg} />,
  },
];

const gameTabs = [
  {
    key: 'dayz',
    label: 'dayz',
  },
  {
    key: 'minecraft',
    label: 'minecraft',
  },
];

export default function Menu() {
  const { playSound } = useSound();
  const page = useStore((state) => state.page);
  const setPage = useStore((state) => state.setPage);


  const dayzServers = useStore((state) => state.dayzServers);
  const [dayzOnline, setDayzOnline] = useState(0);

  // Подсчет онлайна каждые 11 секунд
  useEffect(() => {
    function calcOnline() {
      if (!dayzServers) return setDayzOnline(0);
      let sum = 0;
      if (dayzServers.official && Array.isArray(dayzServers.official)) {
        sum += dayzServers.official.reduce(
          (acc: number, srv: { online?: number }) => acc + (srv.online || 0),
          0
        );
      }
      if (dayzServers.unofficial && Array.isArray(dayzServers.unofficial)) {
        sum += dayzServers.unofficial.reduce(
          (acc: number, srv: { online?: number }) => acc + (srv.online || 0),
          0
        );
      }
      setDayzOnline(sum);
    }
    calcOnline();
    const interval = setInterval(calcOnline, 11000);
    return () => clearInterval(interval);
  }, [dayzServers]);

  const handleClickMain = (tab: string) => {
    playSound('tabs/main.click');
    setPage(tab);
  };

  const handleClickGame = (tab: string) => {
    playSound('tabs/games.click');
    setPage(tab);
  };

  return (
    <nav className={styles.menu}>
      <div className={styles.logoWrapper}>
        <img src={`${assetPrefix}logo.png`} alt="Logo" className={styles.logo} />
      </div>
      <div className={styles.menuList} style={{marginTop: '0'}}>
        {/* Верх: разделитель с "игры" и игровые вкладки */}
        <div className={styles.sectionDivider}>
          <span className={styles.sectionLine}></span>
          <span className={styles.sectionText}>игры</span>
          <span className={styles.sectionLine}></span>
        </div>
        {gameTabs.map(item => {
          const isActive = page === item.key;
          // Для dayz показываем актуальный онлайн
          const online = item.key === 'dayz' ? dayzOnline : 0;
          return (
            <button
              key={item.key}
              className={isActive ? `${styles.active} ${styles.gameTabActive}` : `${styles.item}`}
              onClick={() => handleClickGame(item.key)}
              onMouseEnter={() => playSound('tabs/hover')}
              tabIndex={0}
            >
              <span className={`${styles.label} ${styles.gamesLabel} ${styles.gameTabLabel}`}>{item.label}</span>
              <span className={styles.onlineInfo}>
                <img src={`${assetPrefix}icons/online.svg`} alt="online" width={15} height={15} draggable={false} className={styles.onlineIcon} />
                <span className={`${styles.onlineCount}`}>{online}</span>
              </span>
            </button>
          );
        })}
      </div>
      {/* Низ: разделитель и главные вкладки */}
      <div className={styles.menuList} style={{marginTop: 'auto', marginBottom: 0}}>
        <div className={styles.sectionDivider}>
          <span className={styles.sectionLine}></span>
        </div>
        {mainTabs.map(item => {
          const isActive = page === item.key;
          return (
            <button
              key={item.key}
              className={isActive ? `${styles.active}` : styles.item}
              onClick={() => handleClickMain(item.key)}
              onMouseEnter={() => playSound('tabs/hover')}
              tabIndex={0}
              style={{ position: 'relative', justifyContent: 'flex-start' }}
            >
              <span className={isActive ? `${styles.icon} ${styles.iconSlide}` : `${styles.icon} ${styles.iconSlideBack}`}>{item.icon}</span>
              <span className={isActive ? `${styles.label} ${styles.mainLabel} ${styles.tabSlide}` : `${styles.label} ${styles.mainLabel} ${styles.tabSlideBack}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
