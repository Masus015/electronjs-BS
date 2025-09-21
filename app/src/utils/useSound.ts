import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const isProd = process.env.NODE_ENV === 'production';
  const assetPrefix = isProd ? '' : '';


  const playSound = useCallback((soundName: string, volumeOverride?: number) => {
    if (typeof window === 'undefined') return;

    try {
      const soundPath = `${assetPrefix}sounds/${soundName}.mp3`;
      // Получаем громкость: сначала из аргумента, потом из electronStorage, потом дефолт
      let volume = 0.05;
      if (typeof volumeOverride === 'number') {
        volume = volumeOverride;
      } else if (window.electronStorage) {
        const stored = window.electronStorage.getItem('interfaceVolume');
        if (stored !== null) {
          const v = parseFloat(stored);
          if (!isNaN(v)) volume = v;
        }
      }
      // Если уже есть аудио для этого звука — остановить и перемотать
      if (audioRefs.current[soundName]) {
        audioRefs.current[soundName].pause();
        audioRefs.current[soundName].currentTime = 0;
        audioRefs.current[soundName].volume = volume;
      } else {
        audioRefs.current[soundName] = new Audio(soundPath);
        audioRefs.current[soundName].volume = volume;
      }
      audioRefs.current[soundName].play().catch(() => {});
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, []);

  return { playSound };
};