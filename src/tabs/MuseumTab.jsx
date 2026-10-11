import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Eye, X, BookOpen, Sparkles, CheckCircle, Upload, RotateCcw, ShieldCheck } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/museumData';
import { useAdmin } from '../context/AdminContext';
import { playChime } from '../utils/audio';

export default function MuseumTab() {
  const { isAdmin } = useAdmin();
  const [selectedItem, setSelectedItem] = useState(null);
  const [exploredIds, setExploredIds] = useState(new Set());
  const [filterCategory, setFilterCategory] = useState('all');
  const [customImages, setCustomImages] = useState({});
  const [urlInput, setUrlInput] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('su_custom_museum_images');
      if (saved) setCustomImages(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const handleImageUpload = (e, itemId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có dung lượng dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        const updated = { ...customImages, [itemId]: base64 };
        setCustomImages(updated);
        try {
          localStorage.setItem('su_custom_museum_images', JSON.stringify(updated));
        } catch (err) {}
        setUploadSuccess('Đã lưu ảnh mới thành công vào bộ sưu tập!');
        playChime(700, 'sine', 0.15);
        setTimeout(() => setUploadSuccess(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (itemId) => {
    if (!urlInput.trim()) return;
    const updated = { ...customImages, [itemId]: urlInput.trim() };
    setCustomImages(updated);
    try {
      localStorage.setItem('su_custom_museum_images', JSON.stringify(updated));
    } catch (err) {}
    setUrlInput('');
    setUploadSuccess('Đã cập nhật link ảnh thành công!');
    playChime(700, 'sine', 0.15);
    setTimeout(() => setUploadSuccess(''), 3000);
  };

  const handleResetImage = (itemId) => {
    const updated = { ...customImages };
    delete updated[itemId];
    setCustomImages(updated);
    try {
      localStorage.setItem('su_custom_museum_images', JSON.stringify(updated));
    } catch (err) {}
    setUploadSuccess('Đã khôi phục ảnh nguyên bản!');
    setTimeout(() => setUploadSuccess(''), 2500);
  };

  const categories = [
    'all', 
    'Vũ khí dã chiến', 
    'Nghệ thuật quân sự', 
    'Cổ vật tiền tệ', 
    'Châu bản & Chiếu chỉ', 
    'Hỏa khí hạng nặng', 
    'Trang phục hoàng gia', 
    'Tư liệu tác chiến', 
    'Tranh ký họa lịch sử'
  ];

  const handleOpenItem = (item) => {
    playChime(650, 'sine', 0.1);
    setSelectedItem(item);
    setExploredIds(prev => new Set([...prev, item.id]));
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
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

      {/* Filter Categories Bar */}
      <div className="museum-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat === 'all' ? 'Tất cả cổ vật' : cat}
          </button>
        ))}
      </div>

      {/* Museum Artifacts Grid */}
      <div className="museum-grid">
        {filteredItems.map((item) => {
          const isExplored = exploredIds.has(item.id);
          const currentImg = customImages[item.id] || item.img;

          return (
            <motion.div 
              key={item.id}
              className={`museum-card ${isExplored ? 'explored' : ''}`}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => handleOpenItem(item)}
            >
              <div className="card-badge-row">
                <span className="artifact-category">{item.category}</span>
                {isExplored && <span className="explored-chip">Đã chiêm ngưỡng</span>}
              </div>

              <div className="card-img-wrapper">
                <img 
                  src={currentImg} 
                  alt={item.title} 
                  loading="lazy" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                  }}
                />
                <div className="card-img-overlay">
                  <span className="view-details-btn">
                    <Eye size={15} /> Xem hiện vật chi tiết
                  </span>
                </div>
              </div>

              <div className="card-content">
                <h3 className="artifact-title">{item.title}</h3>
                <h4 className="artifact-sub">{item.sub}</h4>
                <p className="artifact-desc">{item.desc}</p>

                <div className="card-footer-meta">
                  <span className="artifact-source">
                    <BookOpen size={13} /> {item.source}
                  </span>
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
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22 }}
            >
              <button className="close-modal-btn" onClick={handleCloseItem} title="Đóng cửa sổ">
                <X size={20} />
              </button>

              <div className="modal-img-col">
                <img 
                  src={customImages[selectedItem.id] || selectedItem.img} 
                  alt={selectedItem.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                  }}
                />
                <div className="modal-source-tag">
                  📚 {selectedItem.source}
                </div>

                {/* Khu vực Tải ảnh / Đổi ảnh hiện vật: CHỈ DÀNH RIÊNG CHO QUẢN TRỊ VIÊN */}
                {isAdmin ? (
                  <div className="custom-img-uploader-box admin-active-box">
                    <div className="uploader-title-row">
                      <span>👑 Chế độ Admin: Đổi ảnh hiện vật</span>
                      {customImages[selectedItem.id] && (
                        <button 
                          className="reset-img-btn" 
                          onClick={() => handleResetImage(selectedItem.id)}
                          title="Khôi phục ảnh mặc định"
                        >
                          <RotateCcw size={12} /> Khôi phục gốc
                        </button>
                      )}
                    </div>

                    <div className="uploader-actions-flex">
                      <label className="upload-file-label">
                        <Upload size={14} />
                        <span>Tải ảnh từ máy</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleImageUpload(e, selectedItem.id)} 
                        />
                      </label>

                      <div className="url-input-mini-group">
                        <input 
                          type="text" 
                          placeholder="Hoặc dán link ảnh..." 
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <button 
                          type="button" 
                          onClick={() => handleApplyUrl(selectedItem.id)}
                          disabled={!urlInput.trim()}
                        >
                          Lưu
                        </button>
                      </div>
                    </div>

                    {uploadSuccess && (
                      <div className="uploader-success-msg">
                        <CheckCircle size={13} /> {uploadSuccess}
                      </div>
                    )}
                  </div>
                ) : null}
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
