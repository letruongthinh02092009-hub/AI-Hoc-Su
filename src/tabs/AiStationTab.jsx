import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  RotateCcw, 
  Database,
  Sparkles,
  BookOpen,
  Scroll,
  Shield,
  User,
  Flame,
  Award,
  Key,
  X,
  CheckCircle
} from 'lucide-react';
import { sendChatMessageToGemini, resetChatHistory, getKnowledgeBase, getGeminiApiKey, saveGeminiApiKey } from '../services/geminiService';
import { playChime, playCorrectSound } from '../utils/audio';
import { useAdmin } from '../context/AdminContext';

const STORAGE_CHAT_KEY = 'su_ai_chat_history_v2';
const INITIAL_BOT_MESSAGE = {
  role: 'bot',
  text: `Chào bạn! Ta là **Sử Quan Tây Sơn** — người đồng hành cùng bạn trên không gian số hóa lịch sử triều đại Quang Trung.\n\nBạn có thể hỏi ta về bất kỳ sự kiện, chiến lược quân sự, thân thế hay nhân vật lịch sử nào của phong trào Tây Sơn.`,
  sourceType: 'admin',
  model: 'Google Gemini AI',
  inlinePrompts: [
    'Bí quyết hành quân thần tốc của vua Quang Trung?',
    'Vợ và con của Nguyễn Huệ là ai?',
    'Chiến thuật trận Rạch Gầm – Xoài Mút tiêu diệt 5 vạn quân Xiêm?'
  ]
};

export default function AiStationTab() {
  const { isAdmin, onOpenAdmin } = useAdmin();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(m => ({ ...m, isNew: false }));
        }
      }
    } catch (e) {}
    return [INITIAL_BOT_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('su_gemini_api_key') || '';
    } catch (e) {
      return '';
    }
  });
  const [keySavedMsg, setKeySavedMsg] = useState('');

  const handleSaveKey = (e) => {
    e?.preventDefault();
    saveGeminiApiKey(apiKeyInput);
    setKeySavedMsg('Đã lưu API Key thành công!');
    playCorrectSound();
    setTimeout(() => {
      setKeySavedMsg('');
      setShowKeyModal(false);
    }, 1500);
  };

  const messagesEndRef = useRef(null);

  // Lưu lịch sử chat vào localStorage mỗi khi có tin nhắn mới
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Kiểm tra nếu có câu hỏi nhanh từ Floating AI Widget
  useEffect(() => {
    try {
      const quickPrompt = sessionStorage.getItem('su_quick_ai_prompt');
      if (quickPrompt) {
        sessionStorage.removeItem('su_quick_ai_prompt');
        setTimeout(() => {
          handleSend(quickPrompt);
        }, 300);
      }
    } catch (e) {}
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText = null) => {
    const textToSend = (typeof questionText === 'string' ? questionText : input).trim();
    if (!textToSend || isLoading) return;

    playChime(600, 'sine', 0.1);
    setInput('');

    const userMsg = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessageToGemini(textToSend);
      setMessages(prev => [
        ...prev, 
        {
          role: 'bot',
          text: response.text,
          sourceType: response.sourceType,
          docTitle: response.docTitle,
          model: response.model
        }
      ]);
      playChime(650, 'triangle', 0.12);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        {
          role: 'bot',
          text: 'Rất tiếc, kết nối đến máy chủ AI đang gặp gián đoạn. Bạn vui lòng thử lại sau giây lát nhé.',
          sourceType: 'error',
          model: 'Google Gemini AI'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    resetChatHistory();
    playChime(400, 'sine', 0.1);
    try {
      localStorage.removeItem(STORAGE_CHAT_KEY);
    } catch (e) {}
    setMessages([
      {
        role: 'bot',
        text: 'Cuộc trò chuyện đã được làm mới. Sử Quan Tây Sơn sẵn sàng đàm đạo cùng bạn!',
        sourceType: 'admin',
        model: 'Google Gemini AI',
        inlinePrompts: [
          'Bí quyết hành quân thần tốc của vua Quang Trung?',
          'Vợ và con của Nguyễn Huệ là ai?',
          'Chiến thuật trận Rạch Gầm – Xoài Mút tiêu diệt 5 vạn quân Xiêm?'
        ]
      }
    ]);
  };

  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  const kbCount = getKnowledgeBase().length;

  return (
    <motion.div 
      className="tab-page ai-station-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Thin header 48px với phong cách Hoàng gia */}
      <header className="ai-chat-header">
        <div className="ai-chat-header-left">
          <div className="imperial-seal-icon-mini" title="Triện Sử Quan Tây Sơn">
            <span className="seal-char-mini">史</span>
          </div>
          <span className="ai-chat-header-title">Sử Quan Tây Sơn</span>
          <span className="ai-chat-header-divider">·</span>
          <span className="ai-chat-header-meta">Mô hình Google Gemini AI</span>
        </div>
        <div className="ai-chat-header-right">
          <button 
            className="btn-chat-header-action" 
            onClick={onOpenAdmin}
            aria-label="Mở kho sử liệu đối soát"
            title="Đối soát kho sử liệu gốc"
          >
            <Database size={15} />
            <span className="kb-count-label">{kbCount} tư liệu</span>
          </button>
          {isAdmin && (
            <button 
              className="btn-chat-header-action" 
              onClick={() => {
                try {
                  setApiKeyInput(localStorage.getItem('su_gemini_api_key') || '');
                } catch (e) {}
                setShowKeyModal(true);
              }}
              aria-label="Cài đặt Gemini API Key (Quản trị)"
              title="Cài đặt Gemini API Key (Quản trị)"
            >
              <Key size={15} />
              <span className="kb-count-label">API Key</span>
            </button>
          )}
          <button 
            className="btn-chat-header-action" 
            onClick={handleClearChat}
            aria-label="Xóa lịch sử trò chuyện"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* Khung tin nhắn cuộn độc lập */}
      <div className="ai-chat-messages">
        {messages.map((msg, idx) => {
          const isBot = msg.role === 'bot';
          return (
            <div key={idx} className={`chat-bubble-row ${isBot ? 'bot-row' : 'user-row'}`}>
              {/* Avatar hàng */}
              <div className="chat-avatar-and-meta">
                {isBot ? (
                  <div className="imperial-seal-avatar" title="Ấn Triện Hoàng Gia Tây Sơn">
                    <span className="seal-avatar-glyph">史</span>
                  </div>
                ) : (
                  <div className="user-avatar-bronze" title="Học sinh khảo sử">
                    <User size={14} />
                  </div>
                )}
                <span className="chat-bubble-meta">
                  {isBot ? 'Sử Quan Tây Sơn' : 'Học sinh'}
                </span>
              </div>

              {/* Hộp bong bóng tin nhắn: AI dạng Cuộn Trúc Cổ; User dạng Đồng Đen Hiện Đại */}
              <div className={`chat-bubble-box ${isBot ? 'bot-box-scroll' : 'user-box-bronze'}`}>
                {/* Cuộn giấy cổ có dải viền trang trí hoàng gia */}
                {isBot && <div className="imperial-scroll-border-top" aria-hidden="true" />}

                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="chat-text-content"
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />

                {/* Inline prompts chỉ render khi chỉ có 1 tin nhắn chào đầu: Styled like Imperial Edict Scroll Chips */}
                {isBot && messages.length === 1 && msg.inlinePrompts && (
                  <div className="inline-prompts-edict-container">
                    <span className="inline-prompts-edict-label">
                      <Scroll size={13} style={{ marginRight: '5px' }} />
                      Chiếu Thư Khởi Vấn (Gợi ý đàm đạo):
                    </span>
                    <div className="inline-prompts-edict-list">
                      {msg.inlinePrompts.map((prompt, i) => (
                        <button
                          key={i}
                          className="scroll-edict-chip"
                          onClick={() => handleSend(prompt)}
                          disabled={isLoading}
                        >
                          <span className="edict-chip-seal">詔</span>
                          <span className="edict-chip-text">{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chân thẻ Sử Quan hiển thị nguồn đối soát */}
                {isBot && msg.docTitle && (
                  <div className="bot-source-footer">
                    <BookOpen size={12} style={{ marginRight: '4px' }} />
                    <span>Nguồn đối soát: {msg.docTitle}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* AI Thinking Animation */}
        {isLoading && (
          <div className="chat-bubble-row bot-row">
            <div className="chat-avatar-and-meta">
              <div className="imperial-seal-avatar pulsing" title="Đang đối soát sử liệu">
                <span className="seal-avatar-glyph">史</span>
              </div>
              <span className="chat-bubble-meta">Sử Quan Tây Sơn</span>
            </div>
            <div className="chat-bubble-box bot-box-scroll thinking-box">
              <div className="thinking-dots">
                <span className="t-dot dot-1" />
                <span className="t-dot dot-2" />
                <span className="t-dot dot-3" />
              </div>
              <span className="thinking-text">Sử Quan đang tra cứu kho châu bản và đối soát sử liệu...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Khung nhập liệu cố định ở đáy */}
      <div className="ai-chat-input-container">
        <div className="ai-chat-input-bar">
          <input
            type="text"
            className="ai-input-field"
            placeholder="Hỏi Sử Quan về thân thế Nguyễn Huệ, chiến dịch Rạch Gầm, Ngọc Hồi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Nhập câu hỏi cho Sử Quan AI"
          />
          <button
            type="button"
            className="ai-send-btn-gold"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            aria-label="Gửi câu hỏi"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Modal Cài Đặt Gemini API Key Nhanh (Chỉ Quản Trị Viên) */}
      <AnimatePresence>
        {isAdmin && showKeyModal && (
          <div 
            className="museum-modal-backdrop" 
            onClick={() => setShowKeyModal(false)}
            style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              className="card"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '90%',
                maxWidth: '480px',
                background: '#18181b',
                border: '1px solid var(--gold-primary)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={20} className="text-gold" />
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#FFD700', fontFamily: 'var(--font-serif)' }}>Cài Đặt Gemini API Key</h3>
                </div>
                <button 
                  onClick={() => setShowKeyModal(false)} 
                  style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#d4d4d8', lineHeight: 1.6, marginBottom: '16px' }}>
                Dán mã Gemini API Key của bạn (bắt đầu bằng <code>AIzaSy...</code>) để kết nối trực tiếp với Sử Quan AI:
              </p>

              <form onSubmit={handleSaveKey}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    type="password"
                    placeholder="Dán mã API Key (AIzaSy...)"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#09090b',
                      border: '1px solid rgba(255,215,0,0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowKeyModal(false)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ padding: '8px 20px', fontSize: '13px' }}
                    >
                      Lưu Khóa
                    </button>
                  </div>
                </div>
              </form>

              {keySavedMsg && (
                <div style={{ marginTop: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <CheckCircle size={15} />
                  <span>{keySavedMsg}</span>
                </div>
              )}

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#a1a1aa' }}>
                💡 <em>Chưa có mã Key?</em>{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: '#38bdf8', textDecoration: 'underline' }}
                >
                  Bấm vào đây để lấy mã miễn phí tại Google AI Studio ↗
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
