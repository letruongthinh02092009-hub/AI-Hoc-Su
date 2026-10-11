import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { playGateOpenSound } from '../utils/battleSound';

/**
 * CinematicIntro — Màn mở đầu triển lãm di sản "Hào Khí Tây Sơn".
 * - Tượng là điểm nhấn duy nhất; trang trí phía sau được tiết chế.
 * - Âm thanh mặc định TẮT, chỉ phát khi người dùng chủ động bật.
 * - Có thể bỏ qua bất cứ lúc nào (nút "Bỏ qua" hoặc phím Esc).
 * - Tôn trọng prefers-reduced-motion.
 */

// Nguồn ảnh: Wikimedia Commons — "Quang Trung statue 02.jpg"
// Tượng vua Quang Trung trước Bảo tàng Quang Trung (Bình Định). Tác giả: Phó Nháy. Giấy phép CC BY-SA 3.0.
const STATUE_SRC = './images/quang_trung_statue.jpg';
const STATUE_SOURCE_URL = 'https://commons.wikimedia.org/wiki/File:Quang_Trung_statue_02.jpg';

export default function CinematicIntro({ onEnter }) {
  const reduceMotion = useReducedMotion();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Parallax rất nhẹ (tối đa ~6px), không xoay 3D, không re-render mỗi frame
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20 });
  const y = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (reduceMotion) return undefined;
    const handleMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 12);
      my.set((e.clientY / window.innerHeight - 0.5) * 8);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reduceMotion, mx, my]);

  const skip = useCallback(() => {
    onEnter();
  }, [onEnter]);

  // Phím Esc để bỏ qua
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skip]);

  const handleEnter = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    if (soundEnabled) playGateOpenSound();
    // Chuyển cảnh ngắn, không bắt người dùng chờ lâu
    setTimeout(onEnter, reduceMotion ? 0 : 450);
  };

  // Trình tự xuất hiện ngắn gọn
  const seq = (delay) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <motion.div
      className="cinematic-intro-root"
      role="dialog"
      aria-modal="true"
      aria-label="Giới thiệu dự án Hào Khí Tây Sơn"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' }}
    >
      {/* Nền: than ấm + một vầng sáng đồng rất nhẹ sau tượng */}
      <div className="intro-backdrop" aria-hidden="true" />

      {/* Thanh công cụ trên cùng: âm thanh + bỏ qua (luôn bấm được) */}
      <div className="intro-toolbar">
        <button
          type="button"
          className="intro-tool-btn"
          onClick={() => setSoundEnabled((v) => !v)}
          aria-pressed={soundEnabled}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundEnabled ? 'Âm thanh: bật' : 'Âm thanh: tắt'}</span>
        </button>
        <button type="button" className="intro-tool-btn intro-skip" onClick={skip}>
          Bỏ qua giới thiệu
          <kbd className="intro-kbd">Esc</kbd>
        </button>
      </div>

      <div className="intro-stage">
        {/* Tượng — điểm nhấn chính */}
        <motion.figure
          className="intro-statue"
          style={reduceMotion ? undefined : { x, y }}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, scale: 0.98 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
              })}
        >
          <div className="intro-statue-ring" aria-hidden="true" />
          <div className="intro-statue-frame">
            <img
              src={STATUE_SRC}
              alt="Tượng vua Quang Trung trước Bảo tàng Quang Trung, Bình Định"
              className="intro-statue-img"
              draggable="false"
            />
          </div>
          <figcaption className="intro-statue-caption">
            Tượng vua Quang Trung · Bảo tàng Quang Trung, Bình Định
          </figcaption>
        </motion.figure>

        {/* Tiêu đề */}
        <motion.div className="intro-heading" {...seq(0.35)}>
          <p className="intro-eyebrow">Dự án số hóa lịch sử · THPT Nguyễn Huệ</p>
          <h1 className="intro-title">HÀO KHÍ TÂY SƠN</h1>
          <p className="intro-subtitle">Hoàng đế Quang Trung và cuộc đại phá quân Thanh, xuân Kỷ Dậu 1789</p>
        </motion.div>

        {/* Trích dẫn — trình bày editorial */}
        <motion.figure className="intro-quote" {...seq(0.5)}>
          <blockquote>
            “Trong khoảng vũ trụ, đất nào sao ấy, đều đã phân biệt rõ ràng, phương Nam, phương Bắc chia nhau mà cai trị.”
          </blockquote>
          <figcaption>
            Lời dụ tướng sĩ tại Nghệ An, 1788 — <cite>Hoàng Lê nhất thống chí</cite>, hồi thứ mười bốn
          </figcaption>
        </motion.figure>

        {/* Hành động */}
        <motion.div className="intro-actions" {...seq(0.65)}>
          <button
            type="button"
            className="intro-enter-btn"
            onClick={handleEnter}
            disabled={isLeaving}
            autoFocus
          >
            <span>Bắt đầu hành trình</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </motion.div>
      </div>

      {/* Chân trang: tác giả + nguồn ảnh */}
      <motion.footer className="intro-credits" {...seq(0.8)}>
        <span>
          Tác giả: <strong>Lê Trường Thịnh</strong> · Lớp 12A8 · Trường THPT Nguyễn Huệ
        </span>
        <span className="intro-credit-source">
          Ảnh tượng: Phó Nháy /{' '}
          <a href={STATUE_SOURCE_URL} target="_blank" rel="noopener noreferrer">
            Wikimedia Commons
          </a>
          , CC BY-SA 3.0
        </span>
      </motion.footer>
    </motion.div>
  );
}
