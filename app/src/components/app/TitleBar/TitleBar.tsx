'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styles from './TitleBar.module.css';
import { useSound } from '@/utils/useSound';
import useStore from '@/utils/useStore';

const dayzTabs = [
  { key: 'servers', label: 'Сервера' },
  { key: 'history', label: 'История' },
];

export default function TitleBar() {
  const [platform, setPlatform] = useState('win32');
  const { playSound } = useSound();
  const page = useStore((state) => state.page);
  const dayzTab = useStore((state) => state.dayzTab);
  const setDayzTab = useStore((state) => state.setDayzTab);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = {
    servers: useRef<HTMLButtonElement>(null),
    history: useRef<HTMLButtonElement>(null),
  };
  
  type DayzTabKey = 'servers' | 'history';

  useLayoutEffect(() => {
    if (page !== 'dayz') return;
    const ref = tabRefs[dayzTab as DayzTabKey];
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const parentRect = ref.current.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setUnderlineStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }
  }, [dayzTab, page]);

  useEffect(() => {
    const detectPlatform = async () => {
      if (window.electronAPI?.getPlatform) {
        const plat = await window.electronAPI.getPlatform();
        setPlatform(plat);
      }
    };
    detectPlatform();
  }, []);

  

  const handleMinimize = () => {
    if (window.electronAPI?.minimize) {
      window.electronAPI.minimize();
    }
  };
  const handleClose = () => {
    if (window.electronAPI?.close) {
      window.electronAPI.close();
    }
  };

  const renderButtons = () => {
    switch (platform) {
      case 'darwin':
        return (
          <div className={styles.macButtons}>
            <button className={styles.macClose} onClick={handleClose} />
            <button className={styles.macMinimize} onClick={handleMinimize} />
          </div>
        );
      case 'linux':
        return (
          <div className={styles.linuxButtons}>
            <button className={styles.linuxMinimize} onClick={handleMinimize} />
            <button className={styles.linuxClose} onClick={handleClose} />
          </div>
        );
      default:
        return (
          <div className={styles.windowsButtons}>
            <button className={styles.minimize} onClick={handleMinimize} onMouseEnter={() => playSound('tabs/hover')} />
            <button className={styles.close} onClick={handleClose} onMouseEnter={() => playSound('tabs/hover')} />
          </div>
        );
    }
  };

  return (
    <div className={styles.titlebar}>
      {/* <div className={styles.colorStrip} />
      <div className={styles.dragRegion} /> */}
      <div className={styles.title}>
        <p>v1.0.0</p>
      </div>
      {renderButtons()}
    </div>
  );
}