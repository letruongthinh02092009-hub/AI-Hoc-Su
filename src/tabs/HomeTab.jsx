import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Landmark, Clock, Bot, Trophy, ArrowRight } from 'lucide-react';
import { playChime } from '../utils/audio';
import EmberCanvas from '../components/EmberCanvas';
import DrumBackground from '../components/DrumBackground';
import HeroQuoteFrame from '../components/HeroQuoteFrame';
import HeroStatueFrame from '../components/HeroStatueFrame';
import BackgroundMusic from '../components/BackgroundMusic';

export default function HomeTab({ onSelectTab }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 }
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
      {/* NHẠC NỀN — tự phát khi user cho phép, dừng khi rời tab */}
      <BackgroundMusic 
        src="/audio/dawn_over_citadel.mp3"
        volume={0.3}
        showToggle={true}
      />

      {/* Cinematic Hero Section (Reference: Ornate Golden Dragon & Bronze Drum) */}
      <section className="hero-cinematic" aria-labelledby="hero-title">
        {/* Nền: gradient + blobs đỏ/amber + canvas hạt tàn tro */}
        <div className="hero-bg-layers" aria-hidden="true">
          <div className="hero-bg-gradient" />
          <div className="hero-bg-blob-left" />
          <div className="hero-bg-blob-right" />
          <div className="hero-bg-blob-center" />
          <EmberCanvas />
        </div>

        <DrumBackground />

        <div className="hero-grid">
          {/* LEFT: text column */}
          <header className="hero-text-col">
            <p className="hero-kicker">CÔNG TRÌNH SỐ HÓA DI SẢN · THPT NGUYỄN HUỆ</p>
            
            <h1 id="hero-title" className="hero-title-gold-3d">HÀO KHÍ TÂY SƠN</h1>
            
            <p className="hero-subtitle">Anh hùng áo vải Quang Trung – Nguyễn Huệ (1753–1792)</p>
            
            <p className="hero-lead">
              Tái hiện không gian sử thi thế kỷ XVIII qua sa bàn tác chiến không gian số,
              Bảo tàng hiện vật khảo cứu và Trí tuệ nhân tạo đối thoại lịch sử.
            </p>

            <HeroQuoteFrame>
              <blockquote>
                <p>
                  “Đánh cho để dài tóc / Đánh cho để đen răng<br />
                  Đánh cho nó chích luân bất phản<br />
                  Đánh cho nó phiến giáp bất hoàn<br />
                  Đánh cho sử tri nam quốc anh hùng chi hữu chủ!”
                </p>
                <cite>Lời Hiểu Dụ Xuất Quân Thần Tốc (1788)</cite>
              </blockquote>
            </HeroQuoteFrame>

            <nav className="hero-cta-row" aria-label="Hành động chính">
              <button 
                type="button" 
                className="btn-battle-glow"
                onClick={() => {
                  playChime(600, 'sine', 0.15);
                  onSelectTab('battle-map');
                }}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>Khám phá Sa Bàn Trận Đánh</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button 
                type="button" 
                className="btn-scholar-trans"
                onClick={() => {
                  playChime(650, 'sine', 0.15);
                  onSelectTab('ai-station');
                }}
              >
                <span>Đàm đạo cùng Sử Quan AI</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </nav>
          </header>

          {/* RIGHT: statue column */}
          <figure className="hero-statue-col">
            <HeroStatueFrame
              badgeTop="3 Chiến Dịch Thần Tốc"
              badgeBottom="10 Mốc Sơn Lịch Sử"
            >
              <img 
                src="./images/quang_trung_statue.jpg" 
                alt="Tượng đài Hoàng đế Quang Trung tại Bảo tàng Quang Trung, Bình Định" 
                loading="eager" 
              />
            </HeroStatueFrame>
          </figure>
        </div>
      </section>

      {/* Bento Grid: 4 Trải Nghiệm Học Sử Trực Quan */}
      <section className="highlights-section">
        <motion.div className="section-header-centered" variants={itemVariants}>
          <span className="section-kicker-centered">CHƯƠNG MỤC KHẢO CỨU</span>
          <h2 className="section-title-centered">4 TRẢI NGHIỆM HỌC SỬ TRỰC QUAN</h2>
        </motion.div>

        <div className="hero-features-bento">
          {/* Card 1: Sa Bàn Chiến Trận (Large 1x2 with Map Background) */}
          <motion.div 
            className="bento-card bento-card-map"
            variants={itemVariants}
            onClick={() => {
              playChime(600, 'sine', 0.15);
              onSelectTab('battle-map');
            }}
          >
            <img 
              src="/images/artifacts/luoc_do_rach_gam.jpg" 
              alt="Lược đồ chiến dịch Tây Sơn"
              className="bento-card-map-bg"
              loading="lazy"
            />
            <div className="bento-card-map-overlay" />
            <div className="bento-card-map-content">
              <div className="bento-card-content">
                <div className="bento-card-header">
                  <MapPin size={24} className="bento-card-icon-gold" />
                  <h3 className="bento-card-title">Sa Bàn Chiến Trận</h3>
                </div>
                <p className="bento-card-desc">
                  Mô phỏng mũi tên hành quân thần tốc, thế trận mai phục Rạch Gầm – Xoài Mút và đòn vu hồi giải phóng Thăng Long năm 1789.
                </p>
              </div>
              <div className="bento-card-link">
                <span>Khám phá sa bàn</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bảo Tàng Hiện Vật Số */}
          <motion.div 
            className="bento-card bento-card-museum"
            variants={itemVariants}
            onClick={() => {
              playChime(550, 'sine', 0.15);
              onSelectTab('museum');
            }}
          >
            <div className="bento-card-content">
              <div className="bento-card-header">
                <Landmark size={20} className="bento-card-icon" />
                <h3 className="bento-card-title">Bảo Tàng Hiện Vật Số</h3>
              </div>
              <p className="bento-card-desc">
                8 hiện vật quý: súng hỏa hổ, voi chiến, tiền đồng, sắc phong kèm thuyết minh.
              </p>
            </div>
            <div className="bento-card-link">
              <span>Xem hiện vật</span>
              <ArrowRight size={14} />
            </div>
          </motion.div>

          {/* Card 3: Biên Niên Sử 1753–1792 */}
          <motion.div 
            className="bento-card bento-card-timeline"
            variants={itemVariants}
            onClick={() => {
              playChime(580, 'sine', 0.15);
              onSelectTab('timeline');
            }}
          >
            <div className="bento-card-content">
              <div className="bento-card-header">
                <Clock size={20} className="bento-card-icon" />
                <h3 className="bento-card-title">Biên Niên Sử 1753–1792</h3>
              </div>
              <p className="bento-card-desc">
                10 mốc son cuộc đời Hoàng đế Quang Trung từ làng Kiên Mỹ đến đỉnh cao Ngọc Hồi – Đống Đa.
              </p>
            </div>
            <div className="bento-card-link">
              <span>Khám phá niên biểu</span>
              <ArrowRight size={14} />
            </div>
          </motion.div>

          {/* Card 4: Trạm Sử Quan AI */}
          <motion.div 
            className="bento-card bento-card-ai"
            variants={itemVariants}
            onClick={() => {
              playChime(650, 'sine', 0.15);
              onSelectTab('ai-station');
            }}
          >
            <div className="bento-card-content">
              <div className="bento-card-header">
                <Bot size={20} className="bento-card-icon" />
                <h3 className="bento-card-title">Trạm Sử Quan AI</h3>
              </div>
              <p className="bento-card-desc">
                Trò chuyện tự nhiên cùng Gemini AI về cuộc đời Nguyễn Huệ, chiến lược quân sự và trích dẫn sử liệu.
              </p>
            </div>
            <div className="bento-card-link">
              <span>Vào trạm đàm đạo</span>
              <ArrowRight size={14} />
            </div>
          </motion.div>

          {/* Card 5: Đấu Trường Đố Vui */}
          <motion.div 
            className="bento-card bento-card-quiz"
            variants={itemVariants}
            onClick={() => {
              playChime(700, 'sine', 0.15);
              onSelectTab('quiz');
            }}
          >
            <div className="bento-card-content">
              <div className="bento-card-header">
                <Trophy size={20} className="bento-card-icon" />
                <h3 className="bento-card-title">Đấu Trường Đố Vui</h3>
              </div>
              <p className="bento-card-desc">
                3 cấp độ thử thách, tích lũy điểm và nhận Giấy Chứng Nhận vinh danh.
              </p>
            </div>
            <div className="bento-card-link">
              <span>Tham gia thử thách</span>
              <ArrowRight size={14} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial Footer Quote */}
      <motion.blockquote className="home-footer-quote" variants={itemVariants}>
        "Dân ta phải biết sử ta / Cho tường gốc tích nước nhà Việt Nam"
        <cite className="home-footer-author">— Hồ Chí Minh ("Lịch sử nước ta", 1942)</cite>
      </motion.blockquote>
    </motion.div>
  );
}
