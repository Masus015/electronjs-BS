
import React from 'react';
import styles from '../servers.module.css';
import useStore from '@/utils/useStore';

const History: React.FC = () => {
	const setDayzSelectedServer = useStore(state => state.setDayzSelectedServer);
	const dayzSelectedServer = useStore(state => state.dayzSelectedServer);
	const dayzPingMap = useStore(state => state.dayzPingMap);

	const [history, setHistory] = React.useState<any[]>([]);

	React.useEffect(() => {
		if (window.electronStorage) {
			const raw = window.electronStorage.getItem('dayzServersHistory');
			if (raw) {
				try {
					setHistory(JSON.parse(raw));
				} catch {
					setHistory([]);
				}
			} else {
				setHistory([]);
			}
		}
	}, []);

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
					<img src={`icons/online.svg`} alt="online" className={styles.onlineIcon} />
					{server.online}
				</span>
				<span className={styles.serverPing}>
					Пинг: {dayzPingMap[server.ip] === undefined ? '...' : dayzPingMap[server.ip] === null ? 'нет' : `${dayzPingMap[server.ip]} ms`}
				</span>
			</div>
		</div>
	);

	return (
		<div className={styles.container}>
			<div className={styles.categoriesWrapper}>
				<div className={styles.categoryBlock}>
					<h3>История серверов</h3>
					{history.length === 0 ? (
						<div className={styles.empty}>История пуста</div>
					) : (
						history.map(renderServer)
					)}
				</div>
			</div>
		</div>
	);
};

export default History;