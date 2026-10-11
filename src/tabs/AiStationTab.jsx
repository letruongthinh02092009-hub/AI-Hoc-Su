import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  RotateCcw, 
  Database,
  Cpu,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { sendChatMessageToGemini, resetChatHistory, getKnowledgeBase } from '../services/geminiService';
import { playChime } from '../utils/audio';

const QUICK_PROMPTS = [
  "Tôi là Khang, chào Sử Quan!",
  "Cha mẹ và quê hương của vua Quang Trung là ai?",
  "Bắc Cung Hoàng hậu Lê Ngọc Hân và bài thơ Ai Tư Vãn?",
  "Bí quyết hành quân thần tốc ra Tam Điệp trong 10 ngày?",
  "Chiến thuật Rạch Gầm – Xoài Mút tiêu diệt 5 vạn quân Xiêm?",
  "Căn nguyên Hoàng đế Quang Trung đột ngột qua đời năm 1792?"
];

/**
 * TypewriterText - Hiệu ứng hiển thị chữ streaming từng ký tự cho phản hồi mới của AI
 */
function TypewriterText({ text, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    let index = 0;
    const fullText = textRef.current;
    
    // Nếu text ngắn hoặc đã hiển thị hết
    if (fullText.length < 30) {
      setDisplayedText(fullText);
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      index += 4;
      if (index >= fullText.length) {
        setDisplayedText(fullText);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayedText(fullText.slice(0, index));
      }
    }, 18);

    return () => clearInterval(interval);
  }, []);

  const formatText = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div 
      className="chat-text-content"
      dangerouslySetInnerHTML={{ __html: formatText(displayedText) }} 
    />
  );
}

const STORAGE_CHAT_KEY = 'su_ai_chat_history_v2';
const INITIAL_BOT_MESSAGE = {
  role: 'bot',
  text: `Chào bạn! Ta là **Sử Quan Tây Sơn** — người đồng hành cùng bạn trên không gian số hóa lịch sử (tác giả **Lê Trường Thịnh, lớp 12A8, THPT Nguyễn Huệ**).\n\nBạn có thể hỏi ta về bất kỳ sự kiện, chiến lược quân sự, thân thế hay nhân vật lịch sử nào của phong trào Tây Sơn. Ta sẽ ưu tiên đối chiếu cùng kho tư liệu đã được kiểm chứng từ Google Docs của tác giả, nếu chưa có sẽ tự động tra cứu trên mạng Internet để giải đáp cho bạn nhé!`,
  sourceType: 'admin',
  model: 'Google Gemini AI',
  isNew: false
};

export default function AiStationTab({ onOpenAdmin }) {
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
          model: response.model,
          isNew: true
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
          model: 'Google Gemini AI',
          isNew: false
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
        text: `Cuộc trò chuyện đã được làm mới. Sử Quan Tây Sơn sẵn sàng đàm đạo cùng bạn!`,
        sourceType: 'admin',
        model: 'Google Gemini AI',
        isNew: false
      }
    ]);
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  const kbCount = getKnowledgeBase().length;

  return (
    <motion.div 
      className="tab-page aistation-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-title-box">
        <span className="section-kicker">ĐỐI THOẠI LỊCH SỬ THẾ KỶ XVIII</span>
        <h2 className="section-heading">TRẠM SỬ QUAN TÂY SƠN</h2>
        <p className="section-subtext">
          Hỏi đáp trực tiếp với Sử Quan ảo, vận hành trên mô hình <strong>Google Gemini</strong> kết hợp đối chiếu kho sử liệu do <strong>Lê Trường Thịnh</strong> tổng hợp.
        </p>
        <div className="title-divider-gold"></div>
      </div>

      {/* Exhibition Context Bar */}
      <div className="ai-telemetry-bar">
        <div className="telemetry-item">
          <Cpu size={15} className="telemetry-icon gold" />
          <span>Mô hình: <strong>Google Gemini AI</strong></span>
          <span className="live-dot-pulse" title="Sẵn sàng" />
        </div>

        <div className="telemetry-item rag-link" onClick={onOpenAdmin}>
          <Database size={15} className="telemetry-icon crimson" />
          <span>Kho sử liệu: <strong>{kbCount} Tài Liệu Gốc</strong></span>
        </div>

        <div className="telemetry-item author-tag">
          <ShieldCheck size={15} className="telemetry-icon amber" />
          <span>Biên soạn: <strong>Lê Trường Thịnh (12A8)</strong></span>
        </div>
      </div>

      {/* Parlor Container for Chat */}
      <div className="chat-interface-card">
        {/* Chat Mini Header */}
        <div className="chat-card-top-header">
          <div className="chat-status-indicator">
            <span className="live-dot-pulse" />
            <span className="chat-status-text">Sử Quan Tây Sơn đang trực tuyến</span>
          </div>
          <span className="chat-engine-chip">⚡ Google Gemini AI + RAG Google Docs + Google Search</span>
        </div>

        {/* Messages Stream */}
        <div className="chat-messages-container">
          {messages.map((msg, idx) => {
            const isBot = msg.role === 'bot';

            return (
              <motion.div 
                key={idx}
                className={`chat-bubble-row ${isBot ? 'bot-row' : 'user-row'}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* Avatar Sử Quan */}
                <div className={`chat-avatar-wrapper ${isBot ? 'bot-avatar-wrap' : 'user-avatar-wrap'}`}>
                  <div className={`chat-avatar-badge ${isBot ? 'bot-badge' : 'user-badge'}`}>
                    {isBot ? 'SỬ' : 'BẠN'}
                  </div>
                </div>

                <div className={`chat-bubble-box ${isBot ? 'bot-box' : 'user-box'}`}>
                  {isBot && (
                    <div className="bot-meta-tag">
                      <span className="bot-name">Sử Quan Tây Sơn</span>
                      {msg.sourceType === 'admin' && (
                        <span className="source-badge admin" title="Nội dung chính thống trích xuất từ Google Docs của tác giả">
                          <BookOpen size={12} /> Google Docs Tác Giả
                        </span>
                      )}
                      {msg.sourceType === 'general' && (
                        <span className="source-badge general" title="Thông tin tra cứu trực tuyến trên mạng Internet qua Google Gemini AI">
                          <Sparkles size={12} /> Trực Tuyến & Google Gemini AI
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tin nhắn streaming typewriter nếu là tin nhắn mới, hoặc hiển thị ngay */}
                  {isBot && msg.isNew ? (
                    <TypewriterText 
                      text={msg.text} 
                      onComplete={() => {
                        msg.isNew = false;
                        scrollToBottom();
                      }} 
                    />
                  ) : (
                    <div 
                      className="chat-text-content"
                      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} 
                    />
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* AI Thinking Animation */}
          {isLoading && (
            <motion.div 
              className="chat-bubble-row bot-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="chat-avatar-wrapper bot-avatar-wrap">
                <div className="chat-avatar-badge bot-badge">SỬ</div>
              </div>
              <div className="chat-bubble-box bot-box thinking-box">
                <div className="thinking-dots">
                  <span className="t-dot dot-1" />
                  <span className="t-dot dot-2" />
                  <span className="t-dot dot-3" />
                </div>
                <span className="thinking-text">Sử Quan đang tra cứu sử liệu và đối soát dữ liệu...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="quick-prompts-bar">
          <span className="quick-label">
            <Flame size={13} className="flame-icon" /> Gợi ý câu hỏi:
          </span>
          <div className="prompts-slider">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="prompt-chip-btn"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
              >
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Controls Bar */}
        <div className="chat-input-wrapper">
          <button 
            className="chat-action-btn"
            onClick={handleClearChat}
            title="Làm mới cuộc trò chuyện"
            disabled={isLoading}
          >
            <RotateCcw size={17} />
          </button>

          <input
            type="text"
            className="chat-text-input"
            placeholder="Hỏi Sử Quan về thân thế Nguyễn Huệ, chiến dịch Rạch Gầm, Ngọc Hồi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <button 
            className={`chat-send-btn ${input.trim() ? 'active' : ''}`}
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            title="Gửi câu hỏi"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
