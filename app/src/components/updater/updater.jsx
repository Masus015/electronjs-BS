import React, { useState, useEffect } from 'react';
import './updater.module.css';

const AutoUpdater = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState('checking');
  const [progress, setProgress] = useState(0);
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    // Слушатели событий
    window.electronAPI.onUpdateChecking(() => {
      setStatus('checking');
    });

    window.electronAPI.onUpdateAvailable((event, info) => {
      setUpdateInfo(info);
      setStatus('downloading');
    });

    window.electronAPI.onUpdateNotAvailable(() => {
      setStatus('none');
      setTimeout(() => setIsVisible(false), 2000);
    });

    window.electronAPI.onDownloadProgress((event, progress) => {
      setProgress(Math.round(progress.percent));
    });

    window.electronAPI.onUpdateReady(() => {
      setStatus('ready');
      setProgress(100);
    });

    window.electronAPI.onUpdateError(() => {
      setStatus('error');
      setTimeout(() => setIsVisible(false), 3000);
    });

    return () => {
      window.electronAPI.removeAllListeners('update-checking');
      window.electronAPI.removeAllListeners('update-available');
      window.electronAPI.removeAllListeners('update-not-available');
      window.electronAPI.removeAllListeners('download-progress');
      window.electronAPI.removeAllListeners('update-ready');
      window.electronAPI.removeAllListeners('update-error');
    };
  }, []);

  const installNow = () => {
    window.electronAPI.installUpdate();
  };

  const installLater = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="updater-overlay">
      <div className="updater-dialog">
        <h2>Обновление лаунчера</h2>
        
        {status === 'checking' && (
          <div className="updater-status">
            <div className="spinner"></div>
            <p>Проверяем обновления...</p>
          </div>
        )}

        {status === 'downloading' && (
          <div className="updater-status">
            <p>Загружаем обновление {updateInfo?.version}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}%</p>
          </div>
        )}

        {status === 'ready' && (
          <div className="updater-status">
            <p>✅ Обновление готово!</p>
            <p>Версия {updateInfo?.version}</p>
            <div className="updater-actions">
              <button onClick={installNow} className="btn-primary">
                Установить сейчас
              </button>
              <button onClick={installLater} className="btn-secondary">
                Позже
              </button>
            </div>
          </div>
        )}

        {status === 'none' && (
          <div className="updater-status">
            <p>✅ У вас последняя версия</p>
          </div>
        )}

        {status === 'error' && (
          <div className="updater-status">
            <p>❌ Ошибка проверки обновлений</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoUpdater;