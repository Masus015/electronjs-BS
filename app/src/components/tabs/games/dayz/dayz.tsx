
import React, { useRef, useLayoutEffect, useState } from 'react';
import styles from './dayz.module.css';
import useStore from '@/utils/useStore';

import Servers from './components/servers/servers';
import History from './components/history/history';
import About from './components/about/about';
import Play from './components/play/play';

const dayzTabs = [
    { key: 'servers', label: 'Сервера' },
    { key: 'history', label: 'История' },
];


const Dayz: React.FC = () => {
    const dayzTab = useStore((state) => state.dayzTab);
    const setDayzTab = useStore((state) => state.setDayzTab);
    const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
    const tabRefs = {
        servers: useRef<HTMLButtonElement>(null),
        history: useRef<HTMLButtonElement>(null),
    };
    type DayzTabKey = 'servers' | 'history';

    useLayoutEffect(() => {
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
    }, [dayzTab]);

    return (
        <div className={styles.container}>
            {/* Вкладки поверх titlebar */}
            <div className={styles.dayzTabs}>
                {dayzTabs.map((tab) => (
                    <button
                        key={tab.key}
                        ref={tabRefs[tab.key as DayzTabKey]}
                        className={`${styles.dayzTabBtn} ${dayzTab === tab.key ? styles.dayzTabActive : ''}`}
                        onClick={() => setDayzTab(tab.key as DayzTabKey)}
                        style={{ zIndex: 2 }}
                    >
                        {tab.label}
                    </button>
                ))}
                <span
                    className={styles.dayzTabUnderline}
                    style={{ width: underlineStyle.width, left: underlineStyle.left, zIndex: 1 }}
                />
            </div>
            <div className={styles.tabs}>
                {dayzTab === 'servers' && <Servers />}
                {dayzTab === 'history' && <History />}
            </div>
            <div className={styles.infoWrapper}>
                <About />
                <Play />
            </div>
        </div>
    );
};

export default Dayz;