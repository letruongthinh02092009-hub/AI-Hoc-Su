import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, Mail, MessageCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { playChime, playCorrectSound } from '../utils/audio';

const FB_URL = "https://www.facebook.com/letruongthinh.02092009?mibextid=wwXIfr&rdid=yWcReV2kt8J3mlg1&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18ftPPDFTS%2F%3Fmibextid%3DwwXIfr#";
const GMAIL_ADDRESS = "letruongthinh02092009@gmail.com";

export default function ContactBubbleWidget({ activeTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Phân biệt thao tác Kéo thả (Drag) và Nhấp chuột (Click)
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);

  // Không hiển thị widget khi đang ở tab Sử Quan AI để tránh che khuất khung chat trên mobile
  if (activeTab === 'ai-station') {
    return null;
  }

  const handleDragStart = () => {
    isDraggingRef.current = true;
    dragStartTimeRef.current = Date.now();
  };

  const handleDragEnd = () => {
    // Đợi 150ms sau khi thả chuột để tránh kích hoạt sự kiện click
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  const handleBubbleClick = (e) => {
    e.stopPropagation();
    // Nếu là thao tác kéo thả thì KHÔNG mở/đóng popup
    if (isDraggingRef.current) return;

    playChime(isOpen ? 440 : 620, 'sine', 0.1);
    setIsOpen(prev => !prev);
  };

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(GMAIL_ADDRESS);
      setCopiedEmail(true);
      playCorrectSound();
      toast.success('Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch (err) {
      toast.error('Không thể sao chép địa chỉ email.');
    }
  };

  return (
    <motion.div 
      className="draggable-contact-container"
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        position: 'fixed',
        bottom: '96px',
        right: '28px',
        zIndex: 995,
        touchAction: 'none'
      }}
    >
      {/* Khung popup: Kênh Liên Hệ Tác Giả */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="contact-dark-popup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tiêu đề Popup */}
            <div className="contact-dark-header">
              <div className="header-title-box">
                <div className="header-status-indicator" />
                <h4 className="header-title-text">Kênh Liên Hệ Tác Giả</h4>
              </div>
              <motion.button 
                type="button"
                className="btn-popup-close"
                onClick={() => {
                  playChime(420, 'sine', 0.08);
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                title="Đóng popup"
                aria-label="Đóng popup"
              >
                <X size={15} color="#FFFFFF" />
              </motion.button>
            </div>

            {/* Nội dung 2 Nút liên hệ: Facebook & Gmail */}
            <div className="contact-dark-body">
              {/* Nút 1: Facebook (Màu xanh dương) */}
              <motion.a 
                href={FB_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="platform-btn fb-btn"
                onClick={() => playChime(640, 'triangle', 0.1)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              >
                <div className="platform-icon-circle fb-icon-bg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="platform-text-group">
                  <span className="platform-label">Facebook</span>
                  <span className="platform-name">Lê Trường Thịnh</span>
                </div>
                <ExternalLink size={15} className="platform-arrow-icon" />
              </motion.a>

              {/* Nút 2: Gmail (Màu đỏ) */}
              <motion.div 
                className="platform-btn gmail-btn"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              >
                <a 
                  href={`mailto:${GMAIL_ADDRESS}?subject=G%C3%B3p%20%C3%BD%20D%E1%BB%B1%20%C3%A1n%20H%E1%BB%8Dc%20S%E1%BB%AD%20T%C3%A2y%20S%C6%A1n`}
                  className="gmail-link-area"
                  onClick={() => playChime(600, 'sine', 0.1)}
                >
                  <div className="platform-icon-circle gmail-icon-bg">
                    <Mail size={17} color="#FFFFFF" />
                  </div>
                  <div className="platform-text-group">
                    <span className="platform-label">Gmail</span>
                    <span className="platform-name" title={GMAIL_ADDRESS}>{GMAIL_ADDRESS}</span>
                  </div>
                </a>
                <motion.button 
                  type="button"
                  className="btn-copy-email-action" 
                  onClick={handleCopyEmail}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  title="Sao chép địa chỉ email"
                  aria-label="Sao chép email"
                >
                  {copiedEmail ? <Check size={14} color="#10B981" /> : <Copy size={14} color="#FFFFFF" />}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bong bóng chat lơ lửng nhẹ nhàng (Floating animation liên tục) */}
      <div className="floating-bubble-bobbing">
        <motion.button 
          type="button"
          className={`floating-chat-bubble-btn ${isOpen ? 'is-open' : ''}`}
          onClick={handleBubbleClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          title={isOpen ? "Đóng liên hệ" : "Liên hệ tác giả (Có thể kéo thả di chuyển)"}
          aria-label={isOpen ? "Đóng liên hệ" : "Liên hệ tác giả"}
        >
          {/* Hiệu ứng hào quang lấp lánh nhẹ */}
          <div className="bubble-glow-ring" />
          
          {/* Icon: Khi mở hiển thị chữ X màu trắng, khi đóng hiển thị icon tin nhắn trắng */}
          <div className="bubble-icon-center">
            {isOpen ? (
              <X size={26} color="#FFFFFF" strokeWidth={2.6} />
            ) : (
              <MessageCircle size={26} color="#FFFFFF" strokeWidth={2.2} />
            )}
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
