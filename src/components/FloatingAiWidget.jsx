import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, MessageSquare, ArrowRight } from 'lucide-react';
import { playChime } from '../utils/audio';

export default function FloatingAiWidget({ activeTab, onSelectTab }) {
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  // Không hiển thị widget nếu đang ở tab Sử Quan AI
  const isAlreadyInAiTab = activeTab === 'ai-station';

  const handleClickWidget = () => {
    if (isAlreadyInAiTab) {
      playChime(600, 'sine', 0.1);
      return;
    }
    playChime(660, 'sine', 0.15);
    onSelectTab('ai-station');
    setIsOpenPopover(false);
  };

  const handleOpenAiWithPrompt = (promptText) => {
    playChime(680, 'triangle', 0.15);
    try {
      sessionStorage.setItem('su_quick_ai_prompt', promptText);
    } catch (e) {}
    onSelectTab('ai-station');
    setIsOpenPopover(false);
  };

  if (isAlreadyInAiTab) {
    return null;
  }

  return (
    <div className="floating-ai-container">
      {/* Popover gợi ý câu hỏi nhanh */}
      <AnimatePresence>
        {isOpenPopover && (
          <motion.div 
            className="floating-ai-popover card"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            <div className="popover-header">
              <div className="popover-title-row">
                <div className="ai-status-dot" />
                <strong>Trạm Sử Quan AI</strong>
              </div>
              <button 
                className="popover-close-btn"
                onClick={() => setIsOpenPopover(false)}
                title="Đóng"
              >
                <X size={14} />
              </button>
            </div>

            <p className="popover-intro">
              Chào bạn! Tôi là Sử Quan Ảo (Google Gemini AI). Bạn muốn tìm hiểu gì về thời Tây Sơn?
            </p>

            <div className="popover-quick-prompts">
              <button 
                className="quick-prompt-btn"
                onClick={() => handleOpenAiWithPrompt('Kế sách hành quân thần tốc của vua Quang Trung ra sao?')}
              >
                <span>Hành quân thần tốc ra Thăng Long</span>
              </button>
              <button 
                className="quick-prompt-btn"
                onClick={() => handleOpenAiWithPrompt('Voi chiến và súng hỏa hổ Tây Sơn được trang bị thế nào?')}
              >
                <span>Voi chiến và súng hỏa hổ Tây Sơn</span>
              </button>
              <button 
                className="quick-prompt-btn"
                onClick={() => handleOpenAiWithPrompt('Chiến thuật đóng cửa sông Tiền ở Rạch Gầm - Xoài Mút?')}
              >
                <span>Trận Rạch Gầm - Xoài Mút</span>
              </button>
            </div>

            <button 
              className="popover-enter-btn btn-primary"
              onClick={handleClickWidget}
            >
              <span>Vào Trạm Trò Chuyện Đầy Đủ</span>
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút quả cầu trôi nổi với hiệu ứng nhịp thở hào quang */}
      <motion.button 
        className="floating-ai-bubble-btn"
        onClick={() => setIsOpenPopover(prev => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        title="Trò chuyện cùng Sử Quan AI (Google Gemini)"
        aria-label="Mở Trạm Sử Quan AI"
      >
        <div className="bubble-pulse-ring ring-1" aria-hidden="true" />
        <div className="bubble-pulse-ring ring-2" aria-hidden="true" />

        <div className="bubble-icon-inner">
          <Bot size={24} className="bubble-bot-icon" />
          <span className="bubble-spark-tag">
            <Sparkles size={11} />
          </span>
        </div>

        <div className="bubble-label-pill">
          <span>Hỏi Sử Quan AI</span>
        </div>
      </motion.button>
    </div>
  );
}
