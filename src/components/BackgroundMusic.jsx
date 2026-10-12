import { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * BackgroundMusic — Nhạc nền HomeTab với auto-play qua user gesture
 * 
 * Luồng hoạt động:
 * 1. Mount → nếu user đã từng bật (localStorage = 'true' hoặc chưa set) → attempt play
 * 2. Browser chặn → chờ user gesture đầu tiên (click/keydown/scroll/touch)
 * 3. Có gesture → tự động play (cảm giác như "auto")
 * 4. User click nút → toggle on/off, lưu preference
 * 5. Unmount (đổi tab) → pause ngay
 */
export default function BackgroundMusic({
  src = '/audio/dawn_over_citadel.mp3',
  volume = 0.3,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);

  // Đọc preference — mặc định TRUE để auto play (user chưa tắt bao giờ)
  const [userPreference, setUserPreference] = useState(() => {
    try {
      const saved = localStorage.getItem('su_bg_music_enabled');
      // Mặc định BẬT nếu chưa có preference (lần đầu truy cập)
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  // Setup audio + cleanup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [volume]);

  // Attempt play khi mount (nếu preference = true)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !userPreference) return;

    audio.play()
      .then(() => {
        setIsPlaying(true);
        setHasUnlocked(true);
      })
      .catch(() => {
        // Browser chặn → sẽ thử lại sau gesture
        setIsPlaying(false);
      });
  }, [userPreference]);

  // Unlock qua user gesture đầu tiên
  useEffect(() => {
    if (hasUnlocked) return;

    const tryUnlock = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (!userPreference) return;

      audio.play()
        .then(() => {
          setIsPlaying(true);
          setHasUnlocked(true);
          // Remove listeners sau khi unlock thành công
          window.removeEventListener('click', tryUnlock);
          window.removeEventListener('keydown', tryUnlock);
          window.removeEventListener('scroll', tryUnlock);
          window.removeEventListener('touchstart', tryUnlock);
        })
        .catch(() => {
          // Vẫn bị chặn, đợi gesture khác
        });
    };

    window.addEventListener('click', tryUnlock, { passive: true });
    window.addEventListener('keydown', tryUnlock, { passive: true });
    window.addEventListener('scroll', tryUnlock, { passive: true });
    window.addEventListener('touchstart', tryUnlock, { passive: true });

    return () => {
      window.removeEventListener('click', tryUnlock);
      window.removeEventListener('keydown', tryUnlock);
      window.removeEventListener('scroll', tryUnlock);
      window.removeEventListener('touchstart', tryUnlock);
    };
  }, [hasUnlocked, userPreference]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      try { localStorage.setItem('su_bg_music_enabled', 'false'); } catch {}
      setUserPreference(false);
    } else {
      audio.volume = volume;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setHasUnlocked(true);
          try { localStorage.setItem('su_bg_music_enabled', 'true'); } catch {}
          setUserPreference(true);
        })
        .catch((err) => {
          console.warn('[BackgroundMusic] Play failed:', err);
        });
    }
  }, [isPlaying, volume]);

  // Phím tắt M
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.key === 'm' || e.key === 'M') && !e.target.matches('input, textarea')) {
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay]);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" aria-hidden="true" />
      <button
        type="button"
        className={`bg-music-toggle ${isPlaying ? 'is-playing' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Tắt nhạc nền (M)' : 'Bật nhạc nền (M)'}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <span className="bg-music-toggle-label">
          {isPlaying ? 'Nhạc nền: Bật' : 'Nhạc nền: Tắt'}
        </span>
      </button>
    </>
  );
}
