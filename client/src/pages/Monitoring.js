import React, { useState, useEffect, useRef } from 'react';
import { seminarService } from '../services/api';
import io from 'socket.io-client';
import './Monitoring.css';

const Monitoring = () => {
  const [seminar, setSeminar] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchActiveSeminar();

    // Setup socket.io connection (tanpa /api, karena socket.io butuh base URL)
    // Di production, gunakan origin yang sama (relative path)
    // Di development, gunakan localhost:5000
    let socketUrl;
    if (process.env.REACT_APP_API_URL) {
      socketUrl = process.env.REACT_APP_API_URL.replace('/api', '');
    } else if (process.env.NODE_ENV === 'production') {
      // Di production, gunakan origin yang sama dengan halaman
      socketUrl = window.location.origin;
    } else {
      // Development mode
      socketUrl = 'http://localhost:5000';
    }
    const socket = io(socketUrl);
    
    socket.on('seminarUpdated', (data) => {
      // Jika status menjadi play, fetch ulang untuk mendapatkan seminar aktif
      if (data.status === 'play') {
        fetchActiveSeminar();
      } 
      // Jika ada perubahan status yang mempengaruhi seminar aktif, refresh
      else if (data.status === 'jeda' || data.status === 'selesai') {
        fetchActiveSeminar();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleEscKey = (e) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current?.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current?.mozRequestFullScreen) {
          await containerRef.current.mozRequestFullScreen();
        } else if (containerRef.current?.msRequestFullscreen) {
          await containerRef.current.msRequestFullscreen();
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  useEffect(() => {
    let interval = null;
    
    if (isRunning && seminar) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, seminar]);

  const fetchActiveSeminar = async () => {
    try {
      setLoading(true);
      const response = await seminarService.getActive();
      const activeSeminar = response.data;
      
      if (activeSeminar) {
        setSeminar(activeSeminar);
        
        // Hitung waktu yang sudah berjalan
        if (activeSeminar.waktu_mulai && activeSeminar.status === 'play') {
          const waktuMulai = new Date(activeSeminar.waktu_mulai);
          const sekarang = new Date();
          const selisihDetik = Math.floor((sekarang - waktuMulai) / 1000);
          const totalElapsed = (activeSeminar.waktu_berjalan || 0) + selisihDetik;
          setElapsedTime(totalElapsed);
          setIsRunning(true);
        } else {
          setElapsedTime(activeSeminar.waktu_berjalan || 0);
          setIsRunning(false);
        }
      } else {
        setSeminar(null);
        setElapsedTime(0);
        setIsRunning(false);
      }
    } catch (err) {
      console.error('Error fetching active seminar:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    // Handle nilai minus dengan Math.abs
    const absSeconds = Math.abs(seconds);
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const secs = absSeconds % 60;
    
    return { hours, minutes, secs, isNegative: seconds < 0 };
  };

  const getRemainingTime = () => {
    if (!seminar || !seminar.durasi) return 0;
    const totalSeconds = seminar.durasi * 60;
    const remaining = totalSeconds - elapsedTime; // Bisa minus
    return remaining;
  };

  if (loading) {
    return (
      <div className="monitoring-screen" ref={containerRef}>
        <div className="monitoring-loading">
          <div className="loading-spinner"></div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!seminar) {
    return (
      <div className="monitoring-screen" ref={containerRef}>
        <div className="monitoring-empty">
          <div className="empty-content">
            <div className="empty-icon">📺</div>
            <h2>Tidak Ada Seminar Aktif</h2>
            <p>Silakan mulai seminar dari halaman Dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoring-screen" ref={containerRef}>
      <button className="fullscreen-toggle" onClick={toggleFullscreen} title={isFullscreen ? 'Keluar Fullscreen (ESC)' : 'Masuk Fullscreen'}>
        {isFullscreen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v5a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-5a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v5"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        )}
      </button>
      <div className="monitoring-content">
        <div className="timer-display-simple">
          {(() => {
            const remainingTime = getRemainingTime();
            const isWarning = remainingTime <= 300 || remainingTime < 0; // 5 menit = 300 detik atau minus
            return (
              <>
                <span className={`timer-label-simple ${isWarning ? 'warning' : ''}`}>
                  Sisa Waktu
                </span>
                <div className={`timer-value-container ${isWarning ? 'warning' : ''}`}>
                  {(() => {
                    const time = formatTime(remainingTime);
                    return (
                      <>
                        {time.isNegative && (
                          <span className={`timer-value-sign ${isWarning ? 'warning' : ''}`}>-</span>
                        )}
                        <span className={`timer-value-main ${isWarning ? 'warning' : ''}`}>
                          {String(time.hours).padStart(2, '0')}:
                          {String(time.minutes).padStart(2, '0')}
                        </span>
                        <span className={`timer-value-seconds ${isWarning ? 'warning' : ''}`}>:
                          {String(time.secs).padStart(2, '0')}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;

