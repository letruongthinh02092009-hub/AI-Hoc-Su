import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  BookOpen,
  ArrowRight,
  Sparkles,
  MapPin,
  Eye
} from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/museumData';
import { useAdmin } from '../context/AdminContext';
import { playChime } from '../utils/audio';
import { 
  getAllImages, 
  saveImage, 
  deleteImage, 
  migrateFromLocalStorage 
} from '../utils/museumImageStore';
import Toast from '../components/Toast';

export function MuseumSkeleton() {
  return (
    <div className="museum-grid">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="museum-skeleton-card">
          <div className="museum-skeleton-img" />
          <div className="museum-skeleton-line" />
          <div className="museum-skeleton-line short" />
        </div>
      ))}
    </div>
  );
}

export default function MuseumTab() {
  const { isAdmin } = useAdmin();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customImages, setCustomImages] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAdminUploadPanel, setShowAdminUploadPanel] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // Khởi tạo IndexedDB và tự động di chuyển dữ liệu cũ từ LocalStorage
  useEffect(() => {
    async function initStore() {
      await migrateFromLocalStorage();
      const storedImages = await getAllImages();
      setCustomImages(storedImages);
      setImagesLoaded(true);
    }
    initStore();
  }, []);

  // Focus trap và điều hướng bàn phím cho Modal
  useEffect(() => {
    if (!selectedItem) return;
    previouslyFocusedRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const modal = modalRef.current;
    if (modal) {
      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusables = modal.querySelectorAll(focusableSelector);
      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      firstFocusable?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleCloseItem();
          return;
        }

        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      };

      modal.addEventListener('keydown', handleKeyDown);
      return () => {
        modal.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
          previouslyFocusedRef.current.focus();
        }
      };
    }

    return () => {
      document.body.style.overflow = '';
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [selectedItem]);

  const handleOpenItem = (item) => {
    playChime(650, 'sine', 0.1);
    setSelectedItem(item);
    setShowAdminUploadPanel(false);
    setUrlInput('');
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
    setShowAdminUploadPanel(false);
    setUrlInput('');
  };

  const handleImageUpload = (e, itemId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setToastMessage({ text: 'Dung lượng ảnh vượt quá giới hạn 5MB.', type: 'warning' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        const res = await saveImage(itemId, base64);
        setCustomImages(prev => ({ ...prev, [itemId]: base64 }));
        playChime(700, 'sine', 0.15);

        if (!res.ok && res.reason === 'idb-blocked') {
          setToastMessage({ 
            text: 'Ảnh lưu tạm trong phiên này và sẽ mất khi tải lại trang (do đang bật Chế độ riêng tư).', 
            type: 'info' 
          });
        } else {
          setToastMessage({ 
            text: 'Đã lưu ảnh hiện vật vào bộ nhớ IndexedDB thành công!', 
            type: 'success' 
          });
        }
      }
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = async (itemId) => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    const res = await saveImage(itemId, url);
    setCustomImages(prev => ({ ...prev, [itemId]: url }));
    setUrlInput('');
    playChime(700, 'sine', 0.15);

    if (!res.ok && res.reason === 'idb-blocked') {
      setToastMessage({ 
        text: 'Ảnh lưu tạm trong phiên này và sẽ mất khi tải lại trang (do đang bật Chế độ riêng tư).', 
        type: 'info' 
      });
    } else {
      setToastMessage({ 
        text: 'Đã lưu đường dẫn ảnh vào IndexedDB thành công!', 
        type: 'success' 
      });
    }
  };

  const handleResetImage = async (itemId) => {
    await deleteImage(itemId);
    setCustomImages(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setToastMessage({ text: 'Đã khôi phục ảnh gốc của bảo tàng!', type: 'info' });
    playChime(600, 'sine', 0.1);
  };

  const categories = ['all', ...Array.from(new Set(MUSEUM_ITEMS.map(item => item.category)))];

  const filteredItems = MUSEUM_ITEMS.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
        <p className="section-subtext">
          Khảo cứu các cổ vật quân sự, hỏa lực pháo binh và châu bản sắc chỉ minh chứng cho khí phách của phong trào Tây Sơn.
        </p>
        <div className="title-divider-gold" />
      </div>

      {/* Thanh công cụ tìm kiếm và lọc danh mục */}
      <div className="museum-filter-toolbar">
        <div className="museum-search-container">
          <Search size={16} className="museum-search-icon" />
          <input 
            type="text"
            className="museum-search-input"
            placeholder="Tìm kiếm bảo vật, vũ khí, cổ vật..."
            aria-label="Tìm kiếm hiện vật bảo tàng"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="museum-clear-search-btn" 
              onClick={() => setSearchQuery('')}
              aria-label="Xóa từ khóa tìm kiếm"
            >
              ×
            </button>
          )}
        </div>

        <select 
          className="museum-category-select"
          value={activeCategory}
          onChange={(e) => {
            playChime(600, 'sine', 0.08);
            setActiveCategory(e.target.value);
          }}
          aria-label="Lọc theo phân loại cổ vật"
        >
          <option value="all">Tất cả bảo vật ({MUSEUM_ITEMS.length})</option>
          {categories.filter(c => c !== 'all').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Lưới trưng bày chuẩn CSS Grid (đồng đều, không so le) */}
      {!imagesLoaded ? (
        <MuseumSkeleton />
      ) : filteredItems.length === 0 ? (
        <div className="museum-empty-state">
          <h3 className="museum-empty-title">Không tìm thấy hiện vật phù hợp</h3>
          <p className="museum-empty-desc">
            Không có cổ vật nào khớp với từ khóa tìm kiếm hoặc danh mục bạn đã chọn.
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="museum-grid">
          {filteredItems.map((item) => {
            const currentImg = customImages[item.id] || item.img;
            return (
              <article 
                key={item.id}
                className="museum-plaque-card"
                role="button"
                tabIndex={0}
                aria-label={`Xem chi tiết hiện vật ${item.title}`}
                onClick={() => handleOpenItem(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenItem(item);
                  }
                }}
              >
                {/* Ốc vít đồng hoàng gia 4 góc biển hiệu trưng bày */}
                <div className="plaque-rivet top-left" aria-hidden="true" />
                <div className="plaque-rivet top-right" aria-hidden="true" />
                <div className="plaque-rivet bottom-left" aria-hidden="true" />
                <div className="plaque-rivet bottom-right" aria-hidden="true" />

                {/* Khung ảnh cố định tỷ lệ 16:9 với object-fit: cover */}
                <div className="museum-plaque-media">
                  <img 
                    src={currentImg} 
                    alt={item.title} 
                    className="museum-plaque-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                    }}
                  />
                  <div className="museum-plaque-overlay">
                    <span className="museum-plaque-overlay-pill">
                      <Eye size={13} style={{ marginRight: '5px' }} /> Chi tiết hiện vật
                    </span>
                  </div>
                </div>

                {/* Thân thẻ biển hiệu trưng bày */}
                <div className="museum-plaque-content">
                  <div className="museum-plaque-category-row">
                    <span className="museum-plaque-category-badge">{item.category}</span>
                    <span className="museum-plaque-id">#0{item.id}</span>
                  </div>

                  <h3 className="museum-plaque-title">{item.title}</h3>
                  <p className="museum-plaque-sub">{item.sub}</p>

                  <div className="museum-plaque-provenance">
                    <MapPin size={13} className="provenance-pin-icon" />
                    <span className="provenance-text">{item.source}</span>
                  </div>

                  <footer className="museum-plaque-footer">
                    <button 
                      type="button" 
                      className="museum-plaque-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenItem(item);
                      }}
                    >
                      <span>Khảo Cứu Hiện Vật</span>
                      <ArrowRight size={14} />
                    </button>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal triển lãm toàn màn hình 60/40 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            key="modal-backdrop"
            className="museum-modal-backdrop"
            onClick={handleCloseItem}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              ref={modalRef}
              className="museum-modal-frame"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-artifact-title"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                className="museum-modal-close-btn" 
                onClick={handleCloseItem} 
                aria-label="Đóng chi tiết hiện vật"
              >
                <X size={18} />
              </button>

              {/* 60% Cột ảnh hiện vật */}
              <div className="museum-modal-media-col">
                <img 
                  src={customImages[selectedItem.id] || selectedItem.img} 
                  alt={selectedItem.title} 
                  className="museum-modal-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = './images/artifacts/hoa_ho_tay_son.jpg';
                  }}
                />
              </div>

              {/* 40% Cột thông tin chi tiết */}
              <div className="museum-modal-info-col">
                <div>
                  <span className="museum-modal-category">{selectedItem.category}</span>
                  <h2 id="modal-artifact-title" className="museum-modal-title">{selectedItem.title}</h2>
                  <p className="museum-modal-subtitle">{selectedItem.sub}</p>
                </div>

                <div className="museum-modal-section">
                  <span className="museum-modal-section-title">Khảo Cứu Hiện Vật</span>
                  <p className="museum-modal-body">{selectedItem.desc}</p>
                </div>

                <div className="museum-modal-section">
                  <span className="museum-modal-section-title">Giá Trị Lịch Sử & Tác Chiến</span>
                  <p className="museum-modal-body">{selectedItem.details}</p>
                </div>

                <div className="museum-modal-provenance">
                  <BookOpen size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  <span><strong>Nơi lưu giữ / Khảo cứu:</strong> {selectedItem.source}</span>
                  {selectedItem.imageCredit && (
                    <div style={{ marginTop: '4px', fontSize: '0.85em', color: 'var(--text-tertiary)' }}>
                      <em>{selectedItem.imageCredit}</em>
                    </div>
                  )}
                </div>

                {/* Quản trị viên: Công cụ thay ảnh hiện vật */}
                {isAdmin && (
                  <div className="museum-admin-panel">
                    <button 
                      className="museum-admin-toggle-btn"
                      onClick={() => setShowAdminUploadPanel(prev => !prev)}
                    >
                      <ShieldCheck size={14} />
                      <span>{showAdminUploadPanel ? 'Đóng bảng đổi ảnh' : 'Quản trị: Cập nhật ảnh hiện vật'}</span>
                    </button>

                    {showAdminUploadPanel && (
                      <div className="museum-admin-controls">
                        {customImages[selectedItem.id] && (
                          <button 
                            className="btn btn-secondary"
                            onClick={() => handleResetImage(selectedItem.id)}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
                          >
                            <RotateCcw size={12} style={{ marginRight: '4px' }} /> 
                            Khôi phục ảnh mặc định
                          </button>
                        )}

                        <label className="museum-file-upload-label">
                          <Upload size={14} />
                          <span>Tải ảnh từ máy tính (&lt; 5MB)</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e, selectedItem.id)} 
                          />
                        </label>

                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <input 
                            type="text" 
                            className="museum-search-input"
                            placeholder="Hoặc dán URL ảnh trực tiếp..." 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            style={{ flex: 1, fontSize: 'var(--text-xs)' }}
                          />
                          <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={() => handleApplyUrl(selectedItem.id)}
                            disabled={!urlInput.trim()}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
                          >
                            Lưu URL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thông báo Toast */}
      {toastMessage && (
        <Toast 
          message={toastMessage.text} 
          type={toastMessage.type} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </motion.div>
  );
}
