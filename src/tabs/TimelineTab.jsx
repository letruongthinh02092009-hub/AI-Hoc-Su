import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { CheckCircle2, Sparkles, Flame } from 'lucide-react';
import { TIMELINE_EVENTS } from '../data/timelineData';
import { playChime } from '../utils/audio';

/**
 * TimelineCard3D - Card sự kiện với hiệu ứng nghiêng 3D tương tác theo chuột (Tilt 3D)
 */
function TimelineCard3D({ event, idx }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Góc nghiêng tối đa +- 8 độ tạo chiều sâu 3D tinh tế
    const rY = ((x - centerX) / centerX) * 8;
    const rX = -((y - centerY) / centerY) * 8;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="timeline-card card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <div className="timeline-card-header">
        <span className="timeline-year-tag">{event.year}</span>
        <span className="timeline-badge heritage-badge">{event.badge}</span>
      </div>

      <h3 className="timeline-card-title">{event.title}</h3>
      <p className="timeline-card-desc">{event.desc}</p>

      <div className="timeline-card-impact">
        <CheckCircle2 size={16} className="impact-icon" />
        <span><strong>Tác động:</strong> {event.impact}</span>
      </div>
    </motion.div>
  );
}

export default function TimelineTab() {
  const timelineRef = useRef(null);

  // Đường laser theo dõi tiến trình cuộn
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="tab-page timeline-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-title-box">
        <span className="section-kicker">BIÊN NIÊN SỬ HÀO HÙNG</span>
        <h2 className="section-heading">HÀNH TRÌNH BÁCH CHIẾN BÁCH THẮNG (1753 – 1792)</h2>
        <p className="section-subtext">Khám phá 10 mốc son định hình thời đại Quang Trung – Nguyễn Huệ, từ cậu bé áo vải làng Kiên Mỹ đến vị Hoàng đế vĩ đại.</p>
        <div className="title-divider-gold"></div>
      </div>

      <div className="timeline-container" ref={timelineRef}>
        {/* Trục tĩnh nền */}
        <div className="timeline-spine-track"></div>

        {/* Trục laser vàng rực phát sáng (Glowing Laser Line) nối dài theo cuộn trang */}
        <motion.div 
          className="timeline-spine-laser" 
          style={{ scaleY }}
          aria-hidden="true"
        />

        {TIMELINE_EVENTS.map((event, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div 
              key={idx}
              className={`timeline-item ${isEven ? 'left' : 'right'}`}
              initial={{ opacity: 0, x: isEven ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.04 }}
            >
              {/* Điểm mốc Radar Pulsing Fire Node */}
              <div className="timeline-node-wrapper">
                <div className="radar-pulse-ring" aria-hidden="true" />
                <div className="timeline-dot-fire">
                  <span className="dot-fire-core"></span>
                </div>
              </div>

              {/* Card sự kiện với hiệu ứng Tilt 3D */}
              <TimelineCard3D 
                event={event} 
                idx={idx} 
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
