import React from 'react';
import styles from './play.module.css'
import useStore from '@/utils/useStore';


const Play: React.FC = () => {
    const dayzSelectedServer = useStore(state => state.dayzSelectedServer);

    const handlePlay = () => {
        if (!dayzSelectedServer || !window.electronStorage) return;
        try {
            const raw = window.electronStorage.getItem('dayzServersHistory');
            let history: any[] = [];
            if (raw) {
                try {
                    history = JSON.parse(raw);
                } catch {}
            }
            // Удаляем сервер если он уже есть (по ip)
            history = history.filter((s) => s.ip !== dayzSelectedServer.ip);
            // Добавляем в начало
            history.unshift(dayzSelectedServer);
            // Ограничим историю 20 серверами
            if (history.length > 20) history = history.slice(0, 20);
            window.electronStorage.setItem('dayzServersHistory', JSON.stringify(history));
        } catch {}
    };

    return (
        <div className={styles.container}>
            <button
                className={styles.playBtn}
                disabled={!dayzSelectedServer}
                style={{ opacity: dayzSelectedServer ? 1 : 0.6, cursor: dayzSelectedServer ? 'pointer' : 'not-allowed' }}
                onClick={handlePlay}
            >
                {!dayzSelectedServer ? (
                    'Выберите сервер'
                ) : (
                    <>
                        Подключиться к
                        <div className={styles.serverAddr}>{dayzSelectedServer.ip}</div>
                    </>
                )}
            </button>
        </div>
    );
};

export default Play;