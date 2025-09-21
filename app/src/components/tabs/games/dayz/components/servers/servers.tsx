import React, { useState } from 'react';
import useStore from '@/utils/useStore';

const isProd = process.env.NODE_ENV === 'production';
const assetPrefix = isProd ? '' : '';

type PingMap = { [ip: string]: number | null };
import styles from '../servers.module.css';

const Servers: React.FC = () => {
    const dayzServers = useStore((state) => state.dayzServers);
    const setDayzServers = useStore((state) => state.setDayzServers);

    const dayzSelectedServer = useStore((state) => state.dayzSelectedServer);
    const setDayzSelectedServer = useStore((state) => state.setDayzSelectedServer);

    const dayzPingMap = useStore((state) => state.dayzPingMap);
    const setDayzPingMap = useStore((state) => state.setDayzPingMap);

    const [favorites, setFavorites] = useState<string[]>([]);
    const [initialized, setInitialized] = useState<boolean>(false);

    // Загрузка избранного из electronStorage при монтировании
    React.useEffect(() => {
        if (window.electronStorage) {
            const stored = window.electronStorage.getItem('dayzFavorites');
            if (stored) {
                try {
                    setFavorites(JSON.parse(stored));
                } catch {
                    setFavorites([]);
                }
            }
        }
        setInitialized(true);
    }, []);

    // Сохранять избранное при изменении (только после инициализации)
    React.useEffect(() => {
        if (initialized) {
            window.electronStorage.setItem('dayzFavorites', JSON.stringify(favorites));
        }
    }, [favorites, initialized]);

    // React.useEffect(() => {
    //     const fetchServers = async () => {
    //         const data = {
    //             "code": 200,
    //             "data": {
    //                 "official": [
    //                     {
    //                         "name": "Google",
    //                         "online": 123,
    //                         "ip": "https://google.com/"
    //                     },
    //                     {
    //                         "name": "Wikipedia",
    //                         "online": 99,
    //                         "ip": "https://wikipedia.org/"
    //                     }
    //                 ],
    //                 "unofficial": [
    //                     {
    //                         "name": "GitHub",
    //                         "online": 321,
    //                         "ip": "https://github.com/"
    //                     },
    //                     {
    //                         "name": "Stack Overflow",
    //                         "online": 42,
    //                         "ip": "https://stackoverflow.com/"
    //                     },
    //                     {
    //                         "name": "Reddit",
    //                         "online": 88,
    //                         "ip": "https://reddit.com/"
    //                     },
    //                     {
    //                         "name": "Mozilla",
    //                         "online": 12,
    //                         "ip": "https://mozilla.org/"
    //                     },
    //                     {
    //                         "name": "Twitter",
    //                         "online": 5,
    //                         "ip": "https://twitter.com/"
    //                     },
    //                     {
    //                         "name": "Facebook",
    //                         "online": 7,
    //                         "ip": "https://facebook.com/"
    //                     },
    //                     {
    //                         "name": "YouTube",
    //                         "online": 100,
    //                         "ip": "https://youtube.com/"
    //                     },
    //                     {
    //                         "name": "Amazon",
    //                         "online": 15,
    //                         "ip": "https://amazon.com/"
    //                     },
    //                     {
    //                         "name": "Microsoft",
    //                         "online": 20,
    //                         "ip": "https://microsoft.com/"
    //                     },
    //                     {
    //                         "name": "Apple",
    //                         "online": 10,
    //                         "ip": "https://apple.com/"
    //                     }
    //                 ]
    //             }
    //         };
    //         setDayzServers(data);
    //     };
    //     fetchServers();
    // }, []);

    const toggleFavorite = (ip: string) => {
        setFavorites((prev) =>
            prev.includes(ip)
                ? prev.filter((f) => f !== ip)
                : [...prev, ip]
        );
    };


    const renderServer = (server: { name: string; online: number; ip: string }) => (
        <div
            key={server.ip}
            className={
                styles.serverRow +
                (dayzSelectedServer?.ip === server.ip ? ' ' + styles.selected : '')
            }
            onClick={() => setDayzSelectedServer(server)}
        >
            <div className={styles.serverNameRow}>
                <span className={styles.serverName}>{server.name}</span>
            </div>
            <div className={styles.serverInfoRow}>
                <span className={styles.serverOnline}>
                    <img src={`${assetPrefix}icons/online.svg`} alt="online" className={styles.onlineIcon} />
                    {server.online}
                </span>
                <span className={styles.serverPing}>
                    Пинг: {dayzPingMap[server.ip] === undefined ? '...' : dayzPingMap[server.ip] === null ? 'нет' : `${dayzPingMap[server.ip]} ms`}
                </span>
                <button
                    className={styles.favoriteBtn}
                    onClick={e => { e.stopPropagation(); toggleFavorite(server.ip); }}
                    title={favorites.includes(server.ip) ? 'Убрать из избранного' : 'В избранное'}
                >
                    {favorites.includes(server.ip) ? '★' : '☆'}
                </button>
            </div>
        </div>
    );
    // Пинговать сервера при рендере и далее каждые 5 секунд
    React.useEffect(() => {
        const allServers = [
            ...(dayzServers.official || []),
            ...(dayzServers.unofficial || [])
        ];
        if (!allServers.length) return;

        let stopped = false;

        const pingAll = async () => {
            const results: PingMap = {};
            await Promise.all(
                allServers.map(async (srv) => {
                    try {
                        const ms = await window.electronAPI?.pingHttp(srv.ip);
                        results[srv.ip] = typeof ms === 'number' ? ms : null;
                    } catch {
                        results[srv.ip] = null;
                    }
                })
            );
            if (!stopped) setDayzPingMap(results);
        };

        pingAll(); // Первый запуск сразу
        const interval = setInterval(pingAll, 5000);

        return () => {
            stopped = true;
            clearInterval(interval);
        };
    }, [dayzServers]);

    const official = dayzServers.official || [];
    const unofficial = dayzServers.unofficial || [];
    const favoriteServers = [
        ...official.filter((s: { ip: string; }) => favorites.includes(s.ip)),
        ...unofficial.filter((s: { ip: string; }) => favorites.includes(s.ip)),
    ];

    return (
        <div className={styles.container}>
            <div className={styles.categoriesWrapper}>
                <div className={styles.categoryBlock}>
                    <h3>Избранное</h3>
                    {favoriteServers.length === 0 ? (
                        <div className={styles.empty}>Нет избранных серверов</div>
                    ) : (
                        favoriteServers.map(renderServer)
                    )}
                </div>
                <div className={styles.categoryBlock}>
                    <h3>Официальные</h3>
                    {official.length === 0 ? (
                        <div className={styles.empty}>Нет официальных серверов</div>
                    ) : (
                        official.map(renderServer)
                    )}
                </div>
                <div className={styles.categoryBlock}>
                    <h3>Неофициальные</h3>
                    {unofficial.length === 0 ? (
                        <div className={styles.empty}>Нет неофициальных серверов</div>
                    ) : (
                        unofficial.map(renderServer)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Servers;
