import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Volume2, VolumeX, Eye, X, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/museumData';
import { speakText, stopSpeech, subscribeSpeechStatus } from '../services/speechService';
import { playChime } from '../utils/audio';

export default function MuseumTab() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [exploredIds, setExploredIds] = useState(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const unsubscribe = subscribeSpeechStatus((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['all', 'Vũ khí dã chiến', 'Nghệ thuật quân sự', 'Cổ vật tiền tệ', 'Châu bản & Chiếu chỉ', 'Hỏa khí hạng nặng', 'Trang phục hoàng gia', 'Tư liệu tác chiến', 'Tranh ký họa lịch sử'];

  const handleOpenItem = (item) => {
    stopSpeech();
    setIsSpeaking(false);
    playChime(650, 'sine', 0.1);
    setSelectedItem(item);
    setExploredIds(prev => new Set([...prev, item.id]));
  };

  const handleCloseItem = () => {
    stopSpeech();
    setIsSpeaking(false);
    setSelectedItem(null);
  };

  const handleSpeak = (item) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      playChime(600, 'sine', 0.12);
      const text = `${item.title}. ${item.sub}. Phân loại: ${item.category}. Mô tả hiện vật: ${item.desc}. Giá trị lịch sử: ${item.details}. Nguồn lưu trữ: ${item.source}`;
      speakText(text, () => setIsSpeaking(false));
    }
  };

  const filteredItems = filterCategory === 'all' 
    ? MUSEUM_ITEMS 
    : MUSEUM_ITEMS.filter(it => it.category === filterCategory);

  const progressPercent = Math.round((exploredIds.size / MUSEUM_ITEMS.length) * 100);

  return (
    <motion.div 
      className="tab-page museum-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-title-box">
        <span className="section-kicker">KHÔNG GIAN DI SẢN KỸ THUẬT SỐ</span>
        <h2 className="section-heading">BẢO TÀNG HIỆN VẬT THỜI TÂY SƠN</h2>
        <p className="section-subtext">Chiêm ngưỡng 8 bảo vật vô giá minh chứng cho hỏa lực quân sự và sự phát triển vượt bậc của triều đại Hoàng đế Quang Trung.</p>
        <div className="title-divider"></div>
      </div>

      {/* Progress Explorer Bar */}
      <div className="museum-progress-card">
        <div className="progress-text-row">
          <span><Sparkles size={16} /> Tiến độ khám phá bảo tàng:</span>
          <strong>Đã mở khóa {exploredIds.size}/{MUSEUM_ITEMS.length} hiện vật ({progressPercent}%)</strong>
        </div>
        <div className="progress-bar-bg">
          <motion.div 
            className="progress-bar-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Grid of Artifacts */}
      <div className="museum-grid">
        {filteredItems.map((item) => {
          const isExplored = exploredIds.has(item.id);
          return (
            <motion.div 
              key={item.id}
              className={`artifact-card ${isExplored ? 'explored' : ''}`}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleOpenItem(item)}
            >
              <div className="artifact-img-box">
                <img src={item.img} alt={item.title} loading="lazy" />
                <span className="artifact-category-badge">{item.category}</span>
                {isExplored && (
                  <span className="explored-badge" title="Đã xem">
                    <CheckCircle size={14} /> Đã khám phá
                  </span>
                )}
              </div>

              <div className="artifact-body">
                <h3 className="artifact-title">{item.title}</h3>
                <p className="artifact-subtitle">{item.sub}</p>
                <p className="artifact-desc">{item.desc}</p>
                <div className="artifact-footer">
                  <span className="artifact-click-hint"><Eye size={14} /> Xem chi tiết</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="modal-backdrop" onClick={handleCloseItem}>
            <motion.div 
              className="museum-detail-modal"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button className="close-modal-btn" onClick={handleCloseItem}><X size={20} /></button>

              <div className="modal-img-col">
                <img src={selectedItem.img} alt={selectedItem.title} />
                <div className="modal-source-tag">
                  📚 {selectedItem.source}
                </div>
              </div>

              <div className="modal-info-col">
                <span className="modal-category">{selectedItem.category}</span>
                <h3 className="modal-title">{selectedItem.title}</h3>
                <h4 className="modal-subtitle">{selectedItem.sub}</h4>

                <div className="modal-text-block">
                  <h5>Mô Tả Hiện Vật:</h5>
                  <p>{selectedItem.desc}</p>
                </div>

                <div className="modal-text-block">
                  <h5>Ý Nghĩa Lịch Sử & Giá Trị Quân Sự:</h5>
                  <p>{selectedItem.details}</p>
                </div>

                <div className="modal-action-row">
                  <button 
                    className={`modal-speech-btn ${isSpeaking ? 'active' : ''}`}
                    onClick={() => handleSpeak(selectedItem)}
                  >
                    {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    <span>{isSpeaking ? 'Dừng giọng đọc' : 'Nghe thuyết minh tiếng Việt'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
