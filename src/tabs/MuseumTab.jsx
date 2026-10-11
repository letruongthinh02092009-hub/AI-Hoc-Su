import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  Eye, 
  X, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Upload, 
  RotateCcw, 
  ShieldCheck,
  Compass,
  Search,
  ExternalLink
} from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/museumData';
import { useAdmin } from '../context/AdminContext';
import { playChime } from '../utils/audio';

export default function MuseumTab() {
  const { isAdmin } = useAdmin();
  const [selectedItem, setSelectedItem] = useState(null);
  const [exploredIds, setExploredIds] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customImages, setCustomImages] = useState({});
  const [urlInput, setUrlInput] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [showAdminUploadPanel, setShowAdminUploadPanel] = useState(false);

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
        setUploadSuccess('Đã cập nhật ảnh hiện vật thành công!');
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
    setUploadSuccess('Đã lưu đường dẫn ảnh mới!');
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
    setUploadSuccess('Đã khôi phục ảnh gốc của bảo tàng!');
    setTimeout(() => setUploadSuccess(''), 2500);
  };

  // Danh mục nhóm hiện vật cô đọng, rõ ràng
  const EXHIBIT_CATEGORIES = [
    { id: 'all', label: 'Tất cả bảo vật' },
    { id: 'binh-khi', label: 'Binh khí & Hỏa lực', match: ['Vũ khí dã chiến', 'Hỏa khí hạng nặng'] },
    { id: 'nghe-thuat', label: 'Nghệ thuật tác chiến', match: ['Nghệ thuật quân sự', 'Tư liệu tác chiến'] },
    { id: 'an-tin', label: 'Ấn tín & Tiền tệ', match: ['Cổ vật tiền tệ', 'Châu bản & Chiếu chỉ'] },
    { id: 'trang-phuc', label: 'Trang phục & Ký họa', match: ['Trang phục hoàng gia', 'Tranh ký họa lịch sử'] }
  ];

  const handleOpenItem = (item) => {
    playChime(650, 'sine', 0.1);
    setSelectedItem(item);
    setShowAdminUploadPanel(false);
    setExploredIds(prev => new Set([...prev, item.id]));
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
    setShowAdminUploadPanel(false);
  };

  // Lọc hiện vật theo danh mục và từ khóa tìm kiếm
  const filteredItems = MUSEUM_ITEMS.filter((item) => {
    const matchesCat = activeCategory === 'all' || (() => {
      const catConfig = EXHIBIT_CATEGORIES.find(c => c.id === activeCategory);
      return catConfig?.match?.includes(item.category);
    })();

    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

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
        <span className="section-kicker">KHÔNG GIAN DI SẢN QUỐC GIA</span>
        <h2 className="section-heading">BẢO TÀNG HIỆN VẬT THỜI TÂY SƠN</h2>
        <p className="section-subtext">Chiêm ngưỡng bộ sưu tập 8 bảo vật vô giá minh chứng cho hỏa lực quân sự và sự hưng thịnh của triều đại Hoàng đế Quang Trung.</p>
        <div className="title-divider-gold"></div>
      </div>

      {/* Thanh điều hướng gian trưng bày và tìm kiếm */}
      <div className="museum-nav-toolbar">
        <div className="museum-category-tabs">
          {EXHIBIT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`museum-cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                playChime(600, 'sine', 0.08);
                setActiveCategory(cat.id);
              }}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="museum-search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text"
            placeholder="Tìm tên vũ khí, chiếu chỉ, cổ vật..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      </div>

      {/* Thông số khám phá tinh tế */}
      <div className="museum-collection-meta">
        <span>Hiện vật trưng bày: <strong>{filteredItems.length} bảo vật</strong></span>
        <span>Đã chiêm ngưỡng: <strong>{exploredIds.size}/{MUSEUM_ITEMS.length} ({progressPercent}%)</strong></span>
      </div>

      {/* Lưới trưng bày chuẩn bảo tàng nghệ thuật */}
      <div className="exhibition-grid">
        {filteredItems.map((item) => {
          const isExplored = exploredIds.has(item.id);
          const currentImg = customImages[item.id] || item.img;

          return (
            <motion.div 
              key={item.id}
              className={`exhibit-card ${isExplored ? 'viewed' : ''}`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => handleOpenItem(item)}
            >
              <div className="exhibit-frame">
                <img 
                  src={currentImg} 
                  alt={item.title} 
                  loading="lazy" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                  }}
                />
                <div className="exhibit-badge-category">
                  {item.category}
                </div>
                {isExplored && (
                  <div className="exhibit-viewed-tag">
                    <CheckCircle size={12} /> Đã xem
                  </div>
                )}
                <div className="exhibit-hover-veil">
                  <span className="veil-inspect-btn">
                    <Eye size={15} /> Khảo Cứu Hiện Vật
                  </span>
                </div>
              </div>

              <div className="exhibit-caption">
                <h3 className="exhibit-title">{item.title}</h3>
                <h4 className="exhibit-subtitle">{item.sub}</h4>
                <p className="exhibit-summary">{item.desc}</p>
                <div className="exhibit-footer">
                  <span className="exhibit-source">
                    <BookOpen size={12} /> {item.source.split('&')[0]}
                  </span>
                  <span className="exhibit-more-link">Chi tiết →</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="museum-empty-state">
          <Compass size={40} />
          <h4>Không tìm thấy hiện vật phù hợp</h4>
          <p>Vui lòng thử tìm với từ khóa khác hoặc chọn gian trưng bày "Tất cả bảo vật".</p>
          <button className="btn btn-secondary" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
            Xem toàn bộ hiện vật
          </button>
        </div>
      )}

      {/* CỬA SỔ TRƯNG BÀY CHI TIẾT (EXHIBITION SHOWCASE MODAL) */}
      <AnimatePresence>
        {selectedItem && (
          <div className="modal-backdrop" onClick={handleCloseItem}>
            <motion.div 
              className="museum-curator-modal"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22 }}
            >
              <button className="close-curator-modal-btn" onClick={handleCloseItem} title="Đóng">
                <X size={20} />
              </button>

              <div className="curator-modal-grid">
                {/* Cột trái: Khung ảnh hiện vật cao cấp */}
                <div className="curator-photo-column">
                  <div className="artifact-velvet-mount">
                    <img 
                      src={customImages[selectedItem.id] || selectedItem.img} 
                      alt={selectedItem.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                      }}
                    />
                  </div>

                  <div className="artifact-provenance-tag">
                    <BookOpen size={13} />
                    <span>Nơi khảo cứu: {selectedItem.source}</span>
                  </div>

                  {/* Nút mở công cụ Quản trị viên (nếu đang bật Admin) */}
                  {isAdmin && (
                    <div className="curator-admin-strip">
                      <button 
                        className="btn-toggle-admin-upload"
                        onClick={() => setShowAdminUploadPanel(!showAdminUploadPanel)}
                      >
                        <ShieldCheck size={14} />
                        <span>{showAdminUploadPanel ? 'Ẩn bảng đổi ảnh' : '👑 Quyền Admin: Đổi ảnh hiện vật này'}</span>
                      </button>

                      {showAdminUploadPanel && (
                        <div className="curator-admin-form">
                          {customImages[selectedItem.id] && (
                            <button 
                              className="btn-reset-art-img"
                              onClick={() => handleResetImage(selectedItem.id)}
                            >
                              <RotateCcw size={13} /> Khôi phục ảnh mặc định
                            </button>
                          )}

                          <label className="curator-file-upload-btn">
                            <Upload size={14} />
                            <span>Tải ảnh từ máy tính (dưới 5MB)</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }} 
                              onChange={(e) => handleImageUpload(e, selectedItem.id)} 
                            />
                          </label>

                          <div className="curator-url-input-group">
                            <input 
                              type="text" 
                              placeholder="Hoặc dán URL ảnh trực tiếp..." 
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                            />
                            <button 
                              type="button" 
                              onClick={() => handleApplyUrl(selectedItem.id)}
                              disabled={!urlInput.trim()}
                            >
                              Lưu ảnh
                            </button>
                          </div>

                          {uploadSuccess && (
                            <div className="curator-upload-success">
                              <CheckCircle size={13} /> {uploadSuccess}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cột phải: Bảng thông tin khảo cứu di sản */}
                <div className="curator-info-column">
                  <div className="curator-header-box">
                    <span className="curator-category-badge">{selectedItem.category}</span>
                    <h2 className="curator-title">{selectedItem.title}</h2>
                    <h3 className="curator-subtitle">{selectedItem.sub}</h3>
                  </div>

                  <div className="curator-detail-card">
                    <h4 className="detail-section-title">Mô Tả Hiện Vật & Kết Cấu Chế Tác</h4>
                    <p className="detail-body-text">{selectedItem.desc}</p>
                  </div>

                  <div className="curator-detail-card highlight-card">
                    <h4 className="detail-section-title text-gold">Ý Nghĩa Quân Sự & Giá Trị Lịch Sử</h4>
                    <p className="detail-body-text">{selectedItem.details}</p>
                  </div>

                  <div className="curator-footer-note">
                    <strong>Tư liệu biên soạn:</strong> Lê Trường Thịnh (Lớp 12A8 — THPT Nguyễn Huệ) đối chiếu tư liệu Bảo tàng Quang Trung và Viện Bảo tàng Lịch sử Quốc gia.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
