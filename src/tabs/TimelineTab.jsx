import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Swords, 
  Bot, 
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  X,
  ExternalLink,
  ChevronRight,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { TIMELINE_EVENTS } from '../data/timelineData';
import { playChime } from '../utils/audio';

// 4 phân kỳ lịch sử trực quan
const ERAS = [
  { id: 'all', label: 'Toàn bộ 10 mốc son', startIdx: 0, endIdx: 9 },
  { id: 'uprising', label: '1753–1777: Khởi nghĩa Tây Sơn', startIdx: 0, endIdx: 3 },
  { id: 'unify', label: '1785–1786: Đánh Xiêm & Phù Lê', startIdx: 4, endIdx: 5 },
  { id: 'glory', label: '1788–1792: Đại phá Thanh & Canh tân', startIdx: 6, endIdx: 9 }
];

export default function TimelineTab({ onSelectTab }) {
  const [activeEra, setActiveEra] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const timelineRef = useRef(null);

  // Laser spine theo tiến trình cuộn trang
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end end']
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  // Esc key đóng modal chi tiết
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedEvent) {
        setSelectedEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  const handleEraChange = (eraId) => {
    playChime(540, 'sine', 0.1);
    setActiveEra(eraId);
  };

  const handleOpenDetail = (event) => {
    playChime(620, 'sine', 0.12);
    setSelectedEvent(event);
  };

  const handleAskAi = (event) => {
    playChime(640, 'triangle', 0.15);
    const prompt = `Hãy giải thích chi tiết bối cảnh, diễn biến và ý nghĩa lịch sử của sự kiện "${event.title}" (${event.year}) dưới thời Quang Trung - Nguyễn Huệ.`;
    try {
      sessionStorage.setItem('su_quick_ai_prompt', prompt);
    } catch (e) {}
    if (onSelectTab) {
      onSelectTab('ai-station');
    } else {
      window.location.hash = 'ai-station';
    }
  };

  const handleExploreBattle = (year) => {
    playChime(600, 'triangle', 0.15);
    if (onSelectTab) {
      onSelectTab('battle-map');
    } else {
      window.location.hash = 'battle-map';
    }
  };

  // Lọc sự kiện theo thời kỳ
  const currentEraObj = ERAS.find(e => e.id === activeEra) || ERAS[0];
  const filteredEvents = activeEra === 'all' 
    ? TIMELINE_EVENTS 
    : TIMELINE_EVENTS.slice(currentEraObj.startIdx, currentEraObj.endIdx + 1);

  return (
    <motion.div 
      className="tab-page timeline-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Tiêu đề & Lời dẫn nhập */}
      <div className="section-title-box">
        <span className="section-kicker">BIÊN NIÊN SỬ HÀO HÙNG</span>
        <h2 className="section-heading">HÀNH TRÌNH BÁCH CHIẾN BÁCH THẮNG (1753 – 1792)</h2>
        <p className="section-subtext">
          Theo dõi 10 bước ngoặt vĩ đại tái định hình lịch sử dân tộc thế kỷ XVIII — từ thủ lĩnh áo vải làng Kiên Mỹ đến vị Hoàng đế bách chiến bách thắng.
        </p>
        <div className="title-divider-gold" />
      </div>

      {/* Thanh lọc 4 thời kỳ lịch sử */}
      <div className="timeline-era-nav" role="tablist" aria-label="Phân kỳ lịch sử">
        {ERAS.map((era) => {
          const count = era.id === 'all' ? TIMELINE_EVENTS.length : (era.endIdx - era.startIdx + 1);
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              role="tab"
              aria-selected={isActive}
              className={`timeline-era-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleEraChange(era.id)}
            >
              <span>{era.label}</span>
              <span className="timeline-era-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Dòng chảy sự kiện Alternating Zigzag */}
      <div className="timeline-stream-zigzag" ref={timelineRef}>
        {/* Trục tĩnh và laser vàng kim chạy giữa màn hình */}
        <div className="timeline-spine-track-center" aria-hidden="true" />
        <motion.div 
          className="timeline-spine-laser-center" 
          style={{ scaleY }}
          aria-hidden="true" 
        />

        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, idx) => {
            const hasBattleMap = event.year.includes('1785') || event.year.includes('1789');
            const originalIndex = TIMELINE_EVENTS.findIndex(e => e.year === event.year);
            const eventNumber = String(originalIndex + 1).padStart(2, '0');
            // So le: chẵn bên trái, lẻ bên phải
            const isLeft = idx % 2 === 0;

            return (
              <motion.div 
                key={event.year}
                className={`timeline-zigzag-row ${isLeft ? 'row-left' : 'row-right'}`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                {/* Node Dot trung tâm với hiệu ứng hào quang phát sáng */}
                <div className="timeline-center-node" aria-hidden="true">
                  <div className="timeline-node-dot-pulse" title={`Mốc ${eventNumber}: ${event.year}`}>
                    <div className="timeline-node-core" />
                    <div className="timeline-node-ring" />
                  </div>
                  <span className="timeline-node-number">{eventNumber}</span>
                </div>

                {/* Thẻ Card sự kiện */}
                <article 
                  className="timeline-zigzag-card" 
                  aria-labelledby={`event-title-${idx}`}
                >
                  {/* Khung ảnh thumbnail tỷ lệ 16:9 cố định */}
                  <div 
                    className="timeline-card-thumb-wrap"
                    onClick={() => handleOpenDetail(event)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Mở khảo cứu chi tiết: ${event.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenDetail(event);
                      }
                    }}
                  >
                    <img 
                      src={event.img || './images/artifacts/hoa_ho_tay_son.jpg'} 
                      alt={event.title}
                      className="timeline-card-thumb-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                      }}
                    />
                    <div className="timeline-card-thumb-overlay">
                      <span className="timeline-card-thumb-badge">
                        <BookOpen size={12} style={{ marginRight: '4px' }} /> Khảo cứu chi tiết
                      </span>
                    </div>
                  </div>

                  {/* Nội dung mốc sử */}
                  <div className="timeline-card-body">
                    <header className="timeline-card-header">
                      <div className="timeline-year-tag-gold">
                        <Calendar size={14} style={{ marginRight: '6px' }} />
                        {event.year}
                      </div>
                      <div className="timeline-badge-era">
                        {event.badge}
                      </div>
                    </header>

                    <h3 
                      id={`event-title-${idx}`} 
                      className="timeline-card-title-serif"
                      onClick={() => handleOpenDetail(event)}
                    >
                      {event.title}
                    </h3>

                    <p className="timeline-card-desc-clean">
                      {event.desc}
                    </p>

                    {/* Hộp tác động lịch sử */}
                    <div className="timeline-card-impact-box">
                      <Award size={16} className="impact-box-icon" aria-hidden="true" />
                      <div className="impact-box-content">
                        <strong>Tác động lịch sử: </strong>
                        <span>{event.impact}</span>
                      </div>
                    </div>

                    {/* Các hành động tương tác */}
                    <footer className="timeline-card-actions-row">
                      <button 
                        type="button"
                        className="timeline-btn-gold-outline"
                        onClick={() => handleOpenDetail(event)}
                        title="Xem sâu bối cảnh và phân tích lịch sử"
                      >
                        <BookOpen size={14} aria-hidden="true" />
                        <span>Khảo Cứu Sử Tích</span>
                      </button>

                      {hasBattleMap && (
                        <button 
                          type="button"
                          className="timeline-btn-gold-solid"
                          onClick={() => handleExploreBattle(event.year)}
                          title="Mở sa bàn tác chiến số trận đánh tương ứng"
                        >
                          <Swords size={14} aria-hidden="true" />
                          <span>Sa Bàn Trận Đánh</span>
                        </button>
                      )}

                      <button 
                        type="button"
                        className="timeline-btn-ghost"
                        onClick={() => handleAskAi(event)}
                        title="Đối thoại với Sử Quan AI về sự kiện này"
                      >
                        <Bot size={14} aria-hidden="true" />
                        <span>Hỏi AI</span>
                      </button>
                    </footer>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal Khảo Cứu Sử Tích Chi Tiết */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            className="timeline-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              className="timeline-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="timeline-modal-title"
            >
              <button 
                className="timeline-modal-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Đóng khảo cứu"
              >
                <X size={20} />
              </button>

              <div className="timeline-modal-hero-img-wrap">
                <img 
                  src={selectedEvent.img || './images/artifacts/hoa_ho_tay_son.jpg'} 
                  alt={selectedEvent.title}
                  className="timeline-modal-hero-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                  }}
                />
                <div className="timeline-modal-hero-overlay">
                  <span className="timeline-modal-hero-year">{selectedEvent.year}</span>
                  <span className="timeline-modal-hero-badge">{selectedEvent.badge}</span>
                </div>
              </div>

              <div className="timeline-modal-body">
                <h2 id="timeline-modal-title" className="timeline-modal-title">
                  {selectedEvent.title}
                </h2>

                <div className="timeline-modal-section">
                  <h4 className="timeline-modal-sec-heading">
                    <BookOpen size={16} /> Diễn Biến & Khảo Cứu Lịch Sử
                  </h4>
                  <p className="timeline-modal-text">
                    {selectedEvent.detailStory || selectedEvent.desc}
                  </p>
                </div>

                <div className="timeline-modal-section">
                  <h4 className="timeline-modal-sec-heading">
                    <Award size={16} /> Tác Động Lịch Sử
                  </h4>
                  <p className="timeline-modal-text">
                    {selectedEvent.impact}
                  </p>
                </div>

                <div className="timeline-modal-section">
                  <h4 className="timeline-modal-sec-heading">
                    <ShieldCheck size={16} /> Ý Nghĩa Chiến Lược (Chuẩn KHKT)
                  </h4>
                  <p className="timeline-modal-text">
                    {selectedEvent.significance || 'Khẳng định tài năng quân sự và tầm vóc văn hóa của phong trào Tây Sơn.'}
                  </p>
                </div>

                <div className="timeline-modal-footer">
                  <button 
                    className="timeline-btn-gold-solid"
                    onClick={() => {
                      const ev = selectedEvent;
                      setSelectedEvent(null);
                      handleAskAi(ev);
                    }}
                  >
                    <Bot size={16} /> Đàm Đạo Sử Quan AI Về Mốc Sử Này
                  </button>
                  <button 
                    className="timeline-btn-gold-outline"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Đóng Khảo Cứu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
