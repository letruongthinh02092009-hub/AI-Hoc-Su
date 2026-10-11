import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swords, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { playWarDrum, playGateOpenSound } from '../utils/battleSound';

/**
 * CinematicIntro - Màn mở đầu điện ảnh 3D Parallax Hoàng Triều Tây Sơn
 * Hiệu ứng tượng Hoàng đế Quang Trung "lắc lư" theo chuột / góc nghiêng điện thoại (3D Depth Parallax),
 * kết hợp nhịp thở idle, sương khói, tàn tro lửa và âm thanh trống trận trước khi mở cổng vào web.
 */
export default function CinematicIntro({ onEnter }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isEntering, setIsEntering] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const containerRef = useRef(null);

  // Theo dõi chuột (Desktop) với chuyển động mượt mà (Lerp smoothing)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 đến 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setTargetPos({ x, y });
    };

    // Hỗ trợ cảm biến con quay hồi chuyển trên điện thoại (Mobile Gyroscope)
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.min(Math.max(e.gamma / 30, -1), 1);
        const y = Math.min(Math.max((e.beta - 45) / 30, -1), 1);
        setTargetPos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  // Vòng lặp chuyển động mượt (Interpolation loop)
  useEffect(() => {
    let animId;
    const smoothFactor = 0.08;

    const updateSmooth = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * smoothFactor,
        y: prev.y + (targetPos.y - prev.y) * smoothFactor,
      }));
      animId = requestAnimationFrame(updateSmooth);
    };

    animId = requestAnimationFrame(updateSmooth);
    return () => cancelAnimationFrame(animId);
  }, [targetPos]);

  // Xử lý khi nhấn nút "Bước vào đại bản doanh"
  const handleEnterExperience = () => {
    if (isEntering) return;
    setIsEntering(true);
    if (soundEnabled) {
      playGateOpenSound();
    }
    // Chờ hiệu ứng phóng tầm nhìn và chém mở cổng kết thúc rồi vào web
    setTimeout(() => {
      onEnter();
    }, 900);
  };

  // Phát tiếng trống nhẹ khi rê chuột vào nút chính
  const handleButtonHover = () => {
    if (soundEnabled) {
      playWarDrum();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`cinematic-intro-root ${isEntering ? 'is-entering' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.15, filter: 'brightness(2.5) blur(10px)' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 1. HẬU CẢNH: Màn sương khói & Bầu trời trận mạc đêm tối */}
      <div
        className="intro-bg-layer"
        style={{
          transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -14}px, -120px) scale(1.15)`,
        }}
      >
        <div className="intro-radial-nebula" />
        <div className="intro-smoke-cloud cloud-left" />
        <div className="intro-smoke-cloud cloud-right" />
      </div>

      {/* 2. ÁNH SÁNG HOÀNG TRIỀU: Luồng hào quang vàng kim (God Rays) */}
      <div
        className="intro-godrays-layer"
        style={{
          transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 15}px, -40px) rotate(${mousePos.x * 4}deg)`,
        }}
      >
        <div className="intro-golden-halo" />
        <div className="intro-imperial-ring" />
      </div>

      {/* 3. VÙNG TRUNG TÂM: TƯỢNG HOÀNG ĐẾ QUANG TRUNG 3D LẮC LƯ THEO CHUỘT */}
      <div className="intro-monument-stage">
        <motion.div
          className="intro-statue-3d-wrapper"
          animate={{
            y: [0, -12, 0],
            rotateZ: [-0.6, 0.6, -0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transform: `
              perspective(1000px)
              rotateY(${mousePos.x * 16}deg)
              rotateX(${-mousePos.y * 14}deg)
              translateZ(40px)
            `,
          }}
        >
          {/* Vầng sáng viền kim loại (Rim lighting) */}
          <div className="statue-gold-rim-glow" />

          {/* Khối tượng đài uy nghi */}
          <div className="statue-sculpture-card">
            <img
              src="./images/quang_trung_statue.jpg"
              alt="Tượng đài Hoàng đế Quang Trung"
              className="statue-image-main"
            />
            {/* Lớp phản quang động theo chuột (Dynamic Glare Reflection) */}
            <div
              className="statue-specular-glare"
              style={{
                background: `radial-gradient(circle at ${50 + mousePos.x * 35}% ${40 + mousePos.y * 35}%, rgba(245, 230, 200, 0.45) 0%, rgba(197, 160, 89, 0.15) 40%, transparent 70%)`,
              }}
            />
            {/* Lớp bóng đổ chân dung cổ điển */}
            <div className="statue-vignette-overlay" />
          </div>

          {/* Bệ ngai vàng đồng khắc chữ */}
          <div className="statue-plinth-base">
            <span className="plinth-inscription">QUANG TRUNG HOÀNG ĐẾ · 1753 - 1792</span>
          </div>
        </motion.div>
      </div>

      {/* 4. TIỀN CẢNH: CHỮ THƯ PHÁP, LỜI HIỂU DỤ & NÚT TRIỆU LỆNH */}
      <div
        className="intro-foreground-content"
        style={{
          transform: `translate3d(${mousePos.x * 8}px, ${mousePos.y * 8}px, 60px)`,
        }}
      >
        <div className="intro-brand-header">
          <span className="intro-kicker">CÔNG TRÌNH SỐ HÓA DI SẢN · THPT NGUYỄN HUỆ</span>
          <h1 className="intro-hero-title">HÀO KHÍ TÂY SƠN</h1>
          <p className="intro-sub-title">BẮC BÌNH VƯƠNG · ĐẠI PHÁ QUÂN THANH</p>
        </div>

        {/* Bản hiểu dụ bất hủ */}
        <div className="intro-quote-scroll">
          <p className="intro-proclamation">
            "Đánh cho để dài tóc, đánh cho để đen răng.<br />
            Đánh cho nó chích luân bất phản, đánh cho nó phiến giáp bất hoàn.<br />
            Đánh cho sử tri nam quốc anh hùng chi hữu chủ!"
          </p>
          <span className="intro-quote-author">— Lời Hiểu Dụ Xuất Quân Tại Nghệ An (1788)</span>
        </div>

        {/* Nút hành động mở cổng đại bản doanh */}
        <div className="intro-actions-cluster">
          <button
            type="button"
            className="intro-enter-btn"
            onClick={handleEnterExperience}
            onMouseEnter={handleButtonHover}
          >
            <span className="enter-btn-flame" />
            <span className="enter-btn-content">
              <Swords size={20} className="enter-sword-icon" />
              <span>BƯỚC VÀO ĐẠI BẢN DOANH</span>
              <ChevronRight size={18} />
            </span>
          </button>

          <button
            type="button"
            className="intro-skip-btn"
            onClick={onEnter}
          >
            Bỏ qua giới thiệu
          </button>
        </div>

        {/* Footer học thuật */}
        <div className="intro-academic-badge">
          <span>Biên soạn: <strong>Lê Trường Thịnh</strong> · Lớp 12A8 · THPT Nguyễn Huệ</span>
        </div>
      </div>

      {/* 5. NÚT ĐIỀU KHIỂN ÂM THANH Ở GÓC TRÊN */}
      <div className="intro-top-bar">
        <button
          type="button"
          className="intro-sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Tắt âm thanh trống trận' : 'Bật âm thanh trống trận'}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
        </button>
      </div>

      {/* Hiệu ứng chớp sáng mở cổng (Golden Flash Gate) khi nhấn nút */}
      {isEntering && <div className="intro-flash-gate" />}
    </motion.div>
  );
}
