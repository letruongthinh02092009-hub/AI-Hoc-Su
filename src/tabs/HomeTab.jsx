import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ChevronRight, Sparkles, MapPin, Trophy, Bot, Landmark, ArrowUpRight } from 'lucide-react';
import { playChime } from '../utils/audio';
import AnimatedCounter from '../components/AnimatedCounter';

export default function HomeTab({ onSelectTab }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.div 
      className="tab-page home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-ambient-orb" aria-hidden="true" />

        <div className="hero-content">
          <motion.div className="hero-badge shimmer-badge" variants={itemVariants}>
            <Sparkles size={14} className="badge-sparkle-spin" />
            <span>DỰ ÁN HỌC TẬP LỊCH SỬ THPT NGUYỄN HUỆ</span>
            <span className="badge-pulse-dot" />
          </motion.div>

          {/* Hero Title */}
          <motion.div className="hero-title-wrapper" variants={itemVariants}>
            <h1 className="hero-title metallic-shimmer-text">
              HÀO KHÍ TÂY SƠN
            </h1>
            <span className="hero-subtitle">
              ANH HÙNG ÁO VẢI QUANG TRUNG – NGUYỄN HUỆ (1753 – 1792)
            </span>
          </motion.div>

          <motion.p className="hero-description" variants={itemVariants}>
            Khám phá nghệ thuật quân sự bách chiến bách thắng của người anh hùng áo vải qua <strong>Sa bàn trận đánh trực quan</strong>, <strong>Bảo tàng hiện vật số</strong> và <strong>Trợ lý Gemini AI</strong>.
          </motion.p>

          {/* Quote Card */}
          <motion.div className="hero-quote-card cyber-heritage-card" variants={itemVariants}>
            <div className="quote-light-beam" aria-hidden="true" />
            <p className="quote-text">
              "Đánh cho để dài tóc / Đánh cho để đen răng / Đánh cho nó chích luân bất phản / Đánh cho nó phiến giáp bất hoàn / Đánh cho sử tri nam quốc anh hùng chi hữu chủ!"
            </p>
            <span className="quote-author">— Lời Hiểu Dụ Xuất Quân Thần Tốc (1788)</span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div className="hero-actions" variants={itemVariants}>
            <button 
              className="btn shimmer-cta-btn btn-fire-glow"
              onClick={() => {
                playChime(650, 'sine', 0.15);
                onSelectTab('ai-station');
              }}
            >
              <Bot size={18} className="btn-icon" />
              <span className="btn-text">Hỏi Đáp Cùng Gemini AI</span>
            </button>

            <button 
              className="btn shimmer-cta-btn btn-gold-outline"
              onClick={() => {
                playChime(550, 'sine', 0.15);
                onSelectTab('battle-map');
              }}
            >
              <MapPin size={18} className="btn-icon" />
              <span className="btn-text">Xem Sa Bàn Trận Đánh</span>
            </button>

            <button 
              className="btn shimmer-cta-btn btn-ghost-crimson"
              onClick={() => {
                playChime(500, 'sine', 0.15);
                onSelectTab('museum');
              }}
            >
              <Landmark size={18} className="btn-icon" />
              <span className="btn-text">Tham Quan Bảo Tàng</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4 Feature Pillars (Gọn gàng, xúc tích, dễ đọc) */}
      <section className="highlights-section">
        <motion.div className="section-title-box" variants={itemVariants}>
          <span className="section-kicker">KHÁM PHÁ NỘI DUNG</span>
          <h2 className="section-heading">4 TRẢI NGHIỆM HỌC SỬ HẤP DẪN</h2>
          <div className="title-divider-gold"></div>
        </motion.div>

        <div className="features-grid">
          <motion.div 
            className="feature-card cyber-glass-card" 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('battle-map')}
          >
            <div className="card-ambient-glow card-glow-crimson" aria-hidden="true" />
            <div className="feature-icon-wrapper red-glow">
              <MapPin size={26} />
            </div>
            <h3>Sa Bàn Chiến Trận Trực Quan</h3>
            <p>Mô phỏng mũi tên hành quân thần tốc, thế trận mai phục Rạch Gầm – Xoài Mút và đòn vu hồi giải phóng Thăng Long năm 1789.</p>
            <span className="feature-link">
              Khám phá sa bàn <ArrowUpRight size={15} />
            </span>
          </motion.div>

          <motion.div 
            className="feature-card cyber-glass-card" 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('ai-station')}
          >
            <div className="card-ambient-glow card-glow-gold" aria-hidden="true" />
            <div className="feature-icon-wrapper gold-glow">
              <Bot size={26} />
            </div>
            <h3>Sử Quan Thông Minh (Gemini AI)</h3>
            <p>Trò chuyện tự nhiên, giải đáp ngay mọi câu hỏi về cuộc đời Nguyễn Huệ, chiến lược quân sự và trích dẫn sử liệu chuẩn xác.</p>
            <span className="feature-link">
              Đàm đạo ngay <ArrowUpRight size={15} />
            </span>
          </motion.div>

          <motion.div 
            className="feature-card cyber-glass-card" 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('museum')}
          >
            <div className="card-ambient-glow card-glow-amber" aria-hidden="true" />
            <div className="feature-icon-wrapper amber-glow">
              <Landmark size={26} />
            </div>
            <h3>Bảo Tàng Hiện Vật Số</h3>
            <p>Chiêm ngưỡng 8 hiện vật quý: súng hỏa hổ, voi chiến, tiền đồng, sắc phong kèm thuyết minh giọng đọc tiếng Việt rõ ràng.</p>
            <span className="feature-link">
              Vào bảo tàng <ArrowUpRight size={15} />
            </span>
          </motion.div>

          <motion.div 
            className="feature-card cyber-glass-card" 
            variants={itemVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('quiz')}
          >
            <div className="card-ambient-glow card-glow-emerald" aria-hidden="true" />
            <div className="feature-icon-wrapper green-glow">
              <Trophy size={26} />
            </div>
            <h3>Đấu Trường Đố Vui 3 Cấp Độ</h3>
            <p>30 câu trắc nghiệm thú vị từ cơ bản đến chuyên sâu, tích lũy điểm số, chuỗi thắng và nhận vinh danh Đại Tướng Quân.</p>
            <span className="feature-link">
              Chinh phục thử thách <ArrowUpRight size={15} />
            </span>
          </motion.div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="metrics-banner cyber-glass-card">
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-number">
              <AnimatedCounter value={10} suffix="+" duration={1200} />
            </span>
            <span className="metric-label">Mốc son Biên niên sử</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">
              <AnimatedCounter value={2} suffix=" Đại chiến" duration={1200} />
            </span>
            <span className="metric-label">Chiến dịch lịch sử</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">
              <AnimatedCounter value={8} suffix=" Hiện vật" duration={1200} />
            </span>
            <span className="metric-label">Bảo tàng số hóa</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">
              <AnimatedCounter value={30} suffix=" Câu" duration={1200} />
            </span>
            <span className="metric-label">Thử thách kiến thức</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
