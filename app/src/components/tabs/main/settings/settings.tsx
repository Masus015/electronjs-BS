

import React from 'react';
import styles from './settings.module.css';
import { useSound } from '@/utils/useSound';

const VOLUME_KEY = 'interfaceVolume';
const DEFAULT_VOLUME = 0.05;

const Settings: React.FC = () => {
    const [volume, setVolume] = React.useState<number>(DEFAULT_VOLUME);
    const { playSound } = useSound();

    // Загрузка значения при монтировании
    React.useEffect(() => {
        if (window.electronStorage) {
            const stored = window.electronStorage.getItem(VOLUME_KEY);
            if (stored) {
                const v = parseFloat(stored);
                if (!isNaN(v)) setVolume(v);
            }
        }
    }, []);

    // Сохранять значение при изменении
    React.useEffect(() => {
        if (window.electronStorage) {
            window.electronStorage.setItem(VOLUME_KEY, String(volume));
        }
    }, [volume]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(e.target.value));
        playSound('volume', Number(e.target.value));
    };

    return (
        <div className={styles.container}>
            <div className={styles.volumeBlock}>
                <label className={styles.volumeLabel} htmlFor="interface-volume">Громкость интерфейса</label>
                <input
                    id="interface-volume"
                    className={styles.volumeSlider}
                    type="range"
                    min={0}
                    max={0.2}
                    step={0.01}
                    value={volume}
                    onChange={handleChange}
                />
                <span className={styles.volumeValue}>{Math.round((volume / DEFAULT_VOLUME) * 100)}%</span>
            </div>
        </div>
    );
};

export default Settings;