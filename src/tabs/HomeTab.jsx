import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trophy, Bot, Landmark, ArrowRight, ArrowUpRight } from 'lucide-react';
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
    hidden: { opacity: 0, y: 16 },
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
        <div className="hero-content">
          <motion.div className="hero-kicker-box" variants={itemVariants}>
            <span className="hero-kicker-text">CÔNG TRÌNH SỐ HÓA DI SẢN · THPT NGUYỄN HUỆ</span>
          </motion.div>

          {/* Hero Title */}
          <motion.div className="hero-title-wrapper" variants={itemVariants}>
            <h1 className="hero-title">
              HÀO KHÍ TÂY SƠN
            </h1>
            <span className="hero-subtitle">
              ANH HÙNG ÁO VẢI QUANG TRUNG – NGUYỄN HUỆ (1753 – 1792)
            </span>
          </motion.div>

          <motion.p className="hero-description" variants={itemVariants}>
            Tái hiện không gian sử thi thế kỷ XVIII qua <strong>Sa bàn tác chiến không gian số</strong>, <strong>Bảo tàng hiện vật khảo cứu</strong> và <strong>Trí tuệ nhân tạo đối thoại lịch sử</strong>.
          </motion.p>

          {/* Editorial Quote Card */}
          <motion.div className="hero-quote-card card" variants={itemVariants}>
            <p className="quote-text">
              "Đánh cho để dài tóc / Đánh cho để đen răng / Đánh cho nó chích luân bất phản / Đánh cho nó phiến giáp bất hoàn / Đánh cho sử tri nam quốc anh hùng chi hữu chủ!"
            </p>
            <span className="quote-author">— Lời Hiểu Dụ Xuất Quân Thần Tốc (1788)</span>
          </motion.div>

          {/* Restrained CTAs: 1 Primary Button + 1 Secondary Text Link */}
          <motion.div className="hero-actions" variants={itemVariants}>
            <button 
              className="btn btn-primary"
              onClick={() => {
                playChime(600, 'sine', 0.15);
                onSelectTab('battle-map');
              }}
            >
              <MapPin size={17} />
              <span>Khám Phá Sa Bàn Chiến Trận</span>
            </button>

            <button 
              className="btn-text-link"
              onClick={() => {
                playChime(650, 'sine', 0.15);
                onSelectTab('ai-station');
              }}
            >
              <span>Đàm đạo cùng Sử Quan AI</span>
              <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4 Feature Pillars (Phong cách mục lục di sản đánh số 01-04) */}
      <section className="highlights-section">
        <motion.div className="section-title-box" variants={itemVariants}>
          <span className="section-kicker">CHƯƠNG MỤC KHẢO CỨU</span>
          <h2 className="section-heading">4 TRẢI NGHIỆM HỌC SỬ TRỰC QUAN</h2>
          <div className="title-divider-gold"></div>
        </motion.div>

        <div className="features-grid">
          <motion.div 
            className="feature-card card" 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('battle-map')}
          >
            <div className="feature-top-meta">
              <span className="feature-index">01</span>
              <MapPin size={20} className="feature-inline-icon text-gold" />
            </div>
            <h3>Sa Bàn Chiến Trận</h3>
            <p>Mô phỏng mũi tên hành quân thần tốc, thế trận mai phục Rạch Gầm – Xoài Mút và đòn vu hồi giải phóng Thăng Long năm 1789.</p>
            <span className="feature-link">
              Xem sa bàn tác chiến <ArrowUpRight size={14} />
            </span>
          </motion.div>

          <motion.div 
            className="feature-card card" 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('ai-station')}
          >
            <div className="feature-top-meta">
              <span className="feature-index">02</span>
              <Bot size={20} className="feature-inline-icon text-gold" />
            </div>
            <h3>Trạm Sử Quan AI</h3>
            <p>Trò chuyện tự nhiên, giải đáp mọi vấn đề về cuộc đời Nguyễn Huệ, chiến lược quân sự và đối chiếu sử liệu chính thống.</p>
            <span className="feature-link">
              Vào trạm đàm đạo <ArrowUpRight size={14} />
            </span>
          </motion.div>

          <motion.div 
            className="feature-card card" 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('museum')}
          >
            <div className="feature-top-meta">
              <span className="feature-index">03</span>
              <Landmark size={20} className="feature-inline-icon text-gold" />
            </div>
            <h3>Bảo Tàng Hiện Vật Số</h3>
            <p>Trưng bày tư liệu quý: súng hỏa hổ, voi chiến, tiền đồng, sắc phong kèm chú giải và xuất xứ lịch sử chi tiết.</p>
            <span className="feature-link">
              Tham quan hiện vật <ArrowUpRight size={14} />
            </span>
          </motion.div>

          <motion.div 
            className="feature-card card" 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('quiz')}
          >
            <div className="feature-top-meta">
              <span className="feature-index">04</span>
              <Trophy size={20} className="feature-inline-icon text-gold" />
            </div>
            <h3>Đấu Trường Đố Vui</h3>
            <p>90 câu hỏi trắc nghiệm tương tác 3 cấp độ, tích lũy điểm số, đổi mới câu hỏi và nhận Giấy Chứng Nhận vinh danh.</p>
            <span className="feature-link">
              Khởi hành thử thách <ArrowUpRight size={14} />
            </span>
          </motion.div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="metrics-banner card">
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
              <AnimatedCounter value={90} suffix=" Câu" duration={1200} />
            </span>
            <span className="metric-label">Thử thách kiến thức</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
