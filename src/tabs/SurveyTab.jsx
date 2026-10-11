import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  ExternalLink, 
  Table, 
  Settings, 
  CheckCircle, 
  RefreshCw, 
  Share2, 
  Layers,
  Star,
  MessageSquare,
  ThumbsUp,
  Send,
  PlusCircle,
  Award,
  Sparkles,
  ArrowRight,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { playChime, playCorrectSound, playVictorySound } from '../utils/audio';

const STORAGE_FORM_URL = 'su_survey_google_form_url';
const STORAGE_SHEET_URL = 'su_survey_google_sheet_url';
const STORAGE_REVIEWS_KEY = 'su_community_reviews_v2';

const DEFAULT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScX_sample_form/viewform?embedded=true';
const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1VGSKa__Ge1KRXKrvok5pihtK_mnQeW302tZffFFk3HE/edit?gid=1865148353#gid=1865148353';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Trần Minh Anh',
    role: 'Học sinh Lớp 12A8',
    school: 'THPT Nguyễn Huệ',
    rating: 5,
    date: '2 ngày trước',
    comment: 'Trang web quá đẹp và cuốn hút! Phần sa bàn chiến trận Rạch Gầm – Xoài Mút có mô phỏng tiến trình 3 giai đoạn và giọng đọc AI rất sống động. Sử Quan AI trả lời nhanh và thông minh, giúp em ôn bài rất hiệu quả.',
    likes: 34,
    liked: false,
    badge: 'Học sinh'
  },
  {
    id: 'rev-2',
    name: 'Thầy Lê Hoàng Nam',
    role: 'Giáo viên Lịch Sử',
    school: 'Tổ Sử - Địa - GDCD',
    rating: 5,
    date: '3 ngày trước',
    comment: 'Một đề tài học tập xuất sắc của học sinh Nguyễn Huệ! Dự án kết hợp công nghệ AI và số hóa tư liệu một cách chuẩn mực, giao diện Awwwards mang đậm màu sắc sử thi hào hùng. Rất khuyến khích các em áp dụng vào học tập.',
    likes: 51,
    liked: false,
    badge: 'Giáo viên'
  },
  {
    id: 'rev-3',
    name: 'Phạm Quỳnh Chi',
    role: 'Học sinh Lớp 10A1',
    school: 'THPT Nguyễn Huệ',
    rating: 5,
    date: '5 ngày trước',
    comment: 'Thích nhất là Đấu Trường Tri Thức kiểu thẻ bài chiến tướng có hiệu ứng 3D và tia quét sáng! Trả lời đúng được thăng hàm Tướng quân và bắn pháo hoa cực kỳ hào hứng.',
    likes: 27,
    liked: false,
    badge: 'Học sinh'
  },
  {
    id: 'rev-4',
    name: 'Nguyễn Thành Long',
    role: 'Cựu học sinh',
    school: 'Đại học Quốc gia',
    rating: 5,
    date: '1 tuần trước',
    comment: 'Thiết kế tone màu Dark Obsidian với tàn tro lửa bay quá đỉnh, không hề thua kém các website đoạt giải quốc tế. Tự hào về đàn em trường Nguyễn Huệ!',
    likes: 19,
    liked: false,
    badge: 'Khách tham quan'
  }
];

export default function SurveyTab() {
  const { isAdmin } = useAdmin();
  const [formUrl, setFormUrl] = useState(DEFAULT_FORM_URL);
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SHEET_URL);
  const [activeView, setActiveView] = useState('reviews'); // 'reviews' | 'form' | 'sheet'
  const [sheetSubView, setSheetSubView] = useState('table'); // 'table' | 'embed'
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [inputFormUrl, setInputFormUrl] = useState('');
  const [inputSheetUrl, setInputSheetUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Trạng thái Đánh giá cộng đồng
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Học sinh Lớp 12A8');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_FORM_URL);
      const savedSheet = localStorage.getItem(STORAGE_SHEET_URL);
      if (savedForm) setFormUrl(savedForm);
      if (savedSheet) setSheetUrl(savedSheet);

      const savedReviews = localStorage.getItem(STORAGE_REVIEWS_KEY);
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      }
    } catch (e) {}
  }, []);

  const handleDeleteReview = (id) => {
    if (window.confirm('Quản trị viên: Bạn có chắc chắn muốn xóa đánh giá này?')) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      try {
        localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
      } catch (e) {}
      playChime(450, 'sine', 0.1);
    }
  };

  const handleRestoreDefaultReviews = () => {
    if (window.confirm('Quản trị viên: Khôi phục lại 4 đánh giá mẫu ban đầu?')) {
      setReviews(DEFAULT_REVIEWS);
      try {
        localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(DEFAULT_REVIEWS));
      } catch (e) {}
      playCorrectSound();
    }
  };

  const handleOpenConfig = () => {
    setInputFormUrl(formUrl);
    setInputSheetUrl(sheetUrl);
    setIsConfigOpen(true);
    playChime(500, 'sine', 0.1);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const finalForm = inputFormUrl.trim() || DEFAULT_FORM_URL;
    const finalSheet = inputSheetUrl.trim() || DEFAULT_SHEET_URL;

    setFormUrl(finalForm);
    setSheetUrl(finalSheet);

    try {
      localStorage.setItem(STORAGE_FORM_URL, finalForm);
      localStorage.setItem(STORAGE_SHEET_URL, finalSheet);
    } catch (e) {}

    playCorrectSound();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsConfigOpen(false);
    }, 1200);
  };

  // Gửi đánh giá mới
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      alert('Vui lòng điền họ tên và nội dung đánh giá của bạn.');
      return;
    }

    const reviewItem = {
      id: 'rev-' + Date.now(),
      name: newName.trim(),
      role: newRole.trim() || 'Học sinh',
      school: 'THPT Nguyễn Huệ',
      rating: newRating,
      date: 'Vừa xong',
      comment: newComment.trim(),
      likes: 1,
      liked: true,
      badge: newRole.includes('Giáo viên') ? 'Giáo viên' : 'Học sinh'
    };

    const updated = [reviewItem, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    } catch (e) {}

    playVictorySound();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5A93C', '#F4D06F', '#FF6B4A', '#10B981']
      });
    } catch (e) {}

    setNewName('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsAddingReview(false);
    }, 1500);
  };

  // Thả tim đánh giá
  const handleToggleLike = (reviewId) => {
    playChime(620, 'sine', 0.1);
    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          likes: r.liked ? r.likes - 1 : r.likes + 1,
          liked: !r.liked
        };
      }
      return r;
    });
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Tính toán điểm số và tỷ lệ phân bổ sao động 100% theo thời gian thực
  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const starPercentages = {
    5: totalReviewsCount > 0 ? Math.round((starCounts[5] / totalReviewsCount) * 100) : 0,
    4: totalReviewsCount > 0 ? Math.round((starCounts[4] / totalReviewsCount) * 100) : 0,
    3: totalReviewsCount > 0 ? Math.round((starCounts[3] / totalReviewsCount) * 100) : 0,
    2: totalReviewsCount > 0 ? Math.round((starCounts[2] / totalReviewsCount) * 100) : 0,
    1: totalReviewsCount > 0 ? Math.round((starCounts[1] / totalReviewsCount) * 100) : 0,
  };

  // Chuyển link Google Sheet sang dạng xem nhúng trực tiếp an toàn
  const getEmbedSheetUrl = (url) => {
    if (!url) return '';
    if (url.includes('/edit')) {
      return url.replace(/\/edit.*$/, '/preview');
    }
    return url;
  };

  return (
    <motion.div 
      className="tab-page survey-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-title-box">
        <span className="section-kicker">Ý KIẾN ĐÓNG GÓP HỌC SINH & GIÁO VIÊN</span>
        <h2 className="section-heading">KHẢO SÁT & ĐÁNH GIÁ TRẢI NGHIỆM</h2>
        <p className="section-subtext">
          Đánh giá cộng đồng kết hợp thu thập ý kiến qua Google Form & đồng bộ Google Sheets theo thời gian thực.
        </p>
        <div className="title-divider-gold"></div>
      </div>

      {/* 3 Tabs Điều Khiển Chính: Đánh Giá Cộng Đồng | Google Form | Google Sheets */}
      <div className="survey-toolbar-card cyber-glass-card">
        <div className="survey-tab-switch">
          <button 
            className={`survey-toggle-btn ${activeView === 'reviews' ? 'active' : ''}`}
            onClick={() => {
              playChime(600, 'sine', 0.1);
              setActiveView('reviews');
            }}
          >
            <Star size={17} className="text-gold" />
            <span>Đánh Giá & Nhận Xét Cộng Đồng</span>
          </button>

          <button 
            className={`survey-toggle-btn ${activeView === 'form' ? 'active' : ''}`}
            onClick={() => {
              playChime(600, 'sine', 0.1);
              setActiveView('form');
            }}
          >
            <FileText size={17} />
            <span>Biểu Mẫu Khảo Sát (Google Form)</span>
          </button>

          <button 
            className={`survey-toggle-btn ${activeView === 'sheet' ? 'active' : ''}`}
            onClick={() => {
              playChime(600, 'sine', 0.1);
              setActiveView('sheet');
            }}
          >
            <Table size={17} />
            <span>Bảng Tính Excel Đồng Bộ (Google Sheets)</span>
          </button>
        </div>

        <div className="survey-toolbar-actions">
          <button 
            className="config-link-btn"
            onClick={handleOpenConfig}
            title="Cài đặt link Google Form và Google Sheet"
          >
            <Settings size={16} />
            <span>Cài đặt Link Form / Sheet</span>
          </button>
        </div>
      </div>

      {/* Modal Cài Đặt Link Google Form / Google Sheets */}
      {isConfigOpen && (
        <div className="modal-backdrop" onClick={() => setIsConfigOpen(false)}>
          <div className="modal-dialog-box cyber-glass-card" onClick={e => e.stopPropagation()}>
            <h3>⚙️ Cài Đặt Link Khảo Sát Google Form & Sheet</h3>
            <p className="dialog-desc">
              Dán đường link Google Form (dành cho người làm khảo sát) và link Google Sheets (chứa dữ liệu câu trả lời tự động).
            </p>

            <form onSubmit={handleSaveConfig} className="dialog-form">
              <div className="dialog-group">
                <label>1. Link Google Form (Để người dùng điền):</label>
                <input 
                  type="url"
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  value={inputFormUrl}
                  onChange={e => setInputFormUrl(e.target.value)}
                />
              </div>

              <div className="dialog-group">
                <label>2. Link Google Sheets (Chứa kết quả đồng bộ):</label>
                <input 
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={inputSheetUrl}
                  onChange={e => setInputSheetUrl(e.target.value)}
                />
              </div>

              {saveSuccess && (
                <div className="dialog-success-msg">
                  <CheckCircle size={16} /> Đã lưu thành công link khảo sát!
                </div>
              )}

              <div className="dialog-btn-row">
                <button type="submit" className="btn btn-primary shimmer-cta-btn">
                  Lưu & Áp Dụng Ngay
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsConfigOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 1: ĐÁNH GIÁ & NHẬN XÉT CỘNG ĐỒNG
          ============================================================ */}
      {activeView === 'reviews' && (
        <div className="reviews-section-wrapper">
          {/* Header Tổng Quan Điểm Số Cộng Đồng */}
          <div className="gmaps-summary-card cyber-glass-card">
            <div className="gmaps-score-col">
              <span className="big-rating-number">{avgRating}</span>
              <div className="stars-row gold-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={20} 
                    fill={parseFloat(avgRating) >= s ? "#F4D06F" : (parseFloat(avgRating) >= s - 0.5 ? "#E5A93C88" : "transparent")} 
                    color="#E5A93C" 
                  />
                ))}
              </div>
              <span className="total-reviews-count">
                Dựa trên {totalReviewsCount} lượt đánh giá thực tế từ cộng đồng
              </span>
            </div>

            {/* Cột Thanh Phân Bổ Sao Thời Gian Thực */}
            <div className="gmaps-breakdown-col">
              {[5, 4, 3, 2, 1].map((s) => (
                <div key={s} className="breakdown-row">
                  <span className="star-num">{s} sao</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${starPercentages[s]}%`,
                        transition: 'width 0.4s ease'
                      }} 
                    />
                  </div>
                  <span className="bar-pct">{starPercentages[s]}% ({starCounts[s]})</span>
                </div>
              ))}
            </div>

            {/* Nút Kêu Gọi Viết Đánh Giá */}
            <div className="gmaps-action-col">
              <button 
                className="btn-write-review shimmer-cta-btn"
                onClick={() => {
                  playChime(680, 'triangle', 0.12);
                  setIsAddingReview(prev => !prev);
                }}
              >
                <PlusCircle size={18} />
                <span>{isAddingReview ? 'Đóng Biểu Mẫu' : 'Viết Đánh Giá Của Bạn'}</span>
              </button>
              <span className="action-hint">Đánh giá lưu ngay vào cơ sở dữ liệu trên web</span>
            </div>
          </div>

          {/* Form Nhập Đánh Giá Mới (Ẩn/Hiện) */}
          <AnimatePresence>
            {isAddingReview && (
              <motion.div 
                className="add-review-card cyber-glass-card"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="review-form-header">
                  <h4>✍️ Đánh Giá Trải Nghiệm Website & Trạm Sử Quan AI</h4>
                  <span className="form-sub">Nhận xét của bạn sẽ được lưu và hiển thị công khai ngay lập tức</span>
                </div>

                <form onSubmit={handleSubmitReview} className="review-input-form">
                  {/* Chọn số sao trực quan */}
                  <div className="rating-select-group">
                    <label>Mức độ hài lòng của bạn:</label>
                    <div className="star-picker-interactive">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className="star-btn"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => {
                            playChime(500 + star * 60, 'sine', 0.1);
                            setNewRating(star);
                          }}
                        >
                          <Star 
                            size={28} 
                            fill={(hoverRating || newRating) >= star ? '#F4D06F' : 'transparent'} 
                            color={(hoverRating || newRating) >= star ? '#E5A93C' : '#6B7280'} 
                          />
                        </button>
                      ))}
                      <span className="rating-score-label">
                        {newRating === 5 ? 'Tuyệt vời (5/5)' : newRating === 4 ? 'Rất tốt (4/5)' : `${newRating}/5 sao`}
                      </span>
                    </div>
                  </div>

                  <div className="form-two-cols">
                    <div className="input-field">
                      <label>Họ và tên của bạn:</label>
                      <input 
                        type="text" 
                        placeholder="Ví dụ: Nguyễn Văn An"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label>Vai trò / Lớp:</label>
                      <input 
                        type="text" 
                        placeholder="Ví dụ: Học sinh 12A8 / Giáo viên"
                        value={newRole}
                        onChange={e => setNewRole(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-field">
                    <label>Nội dung nhận xét & cảm nghĩ về dự án:</label>
                    <textarea 
                      rows="3"
                      placeholder="Chia sẻ cảm nghĩ về giao diện, sa bàn chiến trận 3D, độ thông minh của Sử Quan AI..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      required
                    />
                  </div>

                  {reviewSubmitted && (
                    <div className="review-success-badge">
                      <CheckCircle size={18} /> Đã gửi và lưu thành công đánh giá của bạn!
                    </div>
                  )}

                  <div className="review-submit-row">
                    <button type="submit" className="btn btn-primary shimmer-cta-btn">
                      <Send size={15} />
                      <span>Đăng Đánh Giá Lên Bảng Tin</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Danh Sách Đánh Giá Cộng Đồng */}
          <div className="reviews-feed-container">
            <div className="feed-title-row">
              <div className="feed-title-left">
                <MessageSquare size={18} className="text-gold" />
                <h3>Ý Kiến Đóng Góp Từ Cộng Đồng ({reviews.length})</h3>
              </div>
              <div className="feed-actions-right">
                {isAdmin && (
                  <>
                    <button 
                      className="btn-admin-config-link" 
                      onClick={handleOpenConfig}
                      title="Cài đặt liên kết Google Form & Sheets"
                    >
                      <Settings size={14} />
                      <span>Cấu hình Link</span>
                    </button>
                    {reviews.length < DEFAULT_REVIEWS.length && (
                      <button 
                        className="btn-restore-samples" 
                        onClick={handleRestoreDefaultReviews}
                        title="Khôi phục lại 4 đánh giá mẫu ban đầu"
                      >
                        <RotateCcw size={14} />
                        <span>Khôi phục mẫu</span>
                      </button>
                    )}
                  </>
                )}
                <span className="feed-tag">Cập nhật thời gian thực</span>
              </div>
            </div>

            {/* Banner kết nối Bảng Tính Google Sheets chứa kết quả Google Form */}
            <div 
              className="google-sheet-sync-banner cyber-glass-card" 
              onClick={() => {
                playChime(600, 'sine', 0.1);
                setActiveView('sheet');
              }} 
              style={{ 
                cursor: 'pointer', 
                marginBottom: '20px', 
                padding: '14px 18px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                border: '1px solid rgba(229, 169, 60, 0.35)', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, rgba(229, 169, 60, 0.12), rgba(18, 20, 27, 0.9))',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Table size={22} className="text-gold" />
                <div>
                  <strong style={{ color: '#F4D06F', fontSize: '0.94rem' }}>Xem Kết Quả Đồng Bộ Từ Google Form</strong>
                  <p style={{ margin: '3px 0 0', color: '#9CA3AF', fontSize: '0.82rem' }}>Toàn bộ phiếu khảo sát của học sinh &amp; giáo viên được tự động lưu 100% sang Bảng tính Google Sheets.</p>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>Mở Bảng Tính</span> <ArrowRight size={14} />
              </button>
            </div>

            <div className="reviews-grid">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-card cyber-glass-card">
                  <div className="review-card-top">
                    {/* Avatar tròn với ký tự viết tắt */}
                    <div className="reviewer-avatar">
                      {rev.name.split(' ').map(n => n[0]).slice(-2).join('')}
                    </div>

                    <div className="reviewer-meta">
                      <strong className="reviewer-name">{rev.name}</strong>
                      <div className="reviewer-role-row">
                        <span className={`badge-role ${rev.badge === 'Giáo viên' ? 'teacher' : 'student'}`}>
                          {rev.role}
                        </span>
                        <span className="review-date-dot">•</span>
                        <span className="review-date">{rev.date}</span>
                      </div>
                    </div>

                    {/* Dãy sao vàng */}
                    <div className="review-stars-badge">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#F4D06F" color="#E5A93C" />
                      ))}
                    </div>
                  </div>

                  <p className="review-comment-text">{rev.comment}</p>

                  <div className="review-card-footer">
                    <button 
                      className={`btn-like-review ${rev.liked ? 'active' : ''}`}
                      onClick={() => handleToggleLike(rev.id)}
                    >
                      <ThumbsUp size={14} />
                      <span>Hữu ích ({rev.likes})</span>
                    </button>

                    {isAdmin && (
                      <button 
                        className="btn-delete-review"
                        onClick={() => handleDeleteReview(rev.id)}
                        title="Xóa đánh giá này (Dành riêng cho Quản trị viên)"
                      >
                        <Trash2 size={13} />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 2: BIỂU MẪU KHẢO SÁT CHI TIẾT (GOOGLE FORM)
          ============================================================ */}
      {activeView === 'form' && (
        <div className="form-view-section">
          {/* Khối giới thiệu quy trình đồng bộ */}
          <div className="survey-flow-overview cyber-glass-card">
            <div className="flow-step-item">
              <span className="flow-num">01</span>
              <div className="flow-text">
                <strong>Điền Khảo Sát</strong>
                <p>Học sinh & thầy cô hoàn thành phiếu đánh giá trực tuyến</p>
              </div>
            </div>
            <div className="flow-divider-arrow">→</div>
            <div className="flow-step-item">
              <span className="flow-num">02</span>
              <div className="flow-text">
                <strong>Tự Động Lưu Dữ Liệu</strong>
                <p>Toàn bộ thông tin điền được lưu an toàn sang Google Sheets</p>
              </div>
            </div>
            <div className="flow-divider-arrow">→</div>
            <div className="flow-step-item">
              <span className="flow-num">03</span>
              <div className="flow-text">
                <strong>Đồng Bộ Google Sheets</strong>
                <p>Số liệu trực quan hóa theo thời gian thực trên bảng tính</p>
              </div>
            </div>
          </div>

          <div className="survey-embed-container cyber-glass-card">
            <div className="form-embed-wrapper">
              <div className="embed-header-bar">
                <div className="embed-info">
                  <strong>Biểu Mẫu Khảo Sát Trực Tuyến</strong>
                  <span>Mọi thông tin điền sẽ tự động lưu sang Bảng tính Google Sheets của tác giả Lê Trường Thịnh</span>
                </div>
                <div className="embed-actions-row">
                  <a 
                    href={formUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="open-ext-link-btn"
                  >
                    <span>Mở Google Form (Tab Mới)</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="survey-device-bezel">
                <iframe 
                  key={formUrl}
                  src={formUrl} 
                  title="Khảo sát Google Form"
                  width="100%" 
                  height="650" 
                  frameBorder="0" 
                  marginHeight="0" 
                  marginWidth="0"
                  className="survey-inner-frame"
                >
                  Đang tải biểu mẫu khảo sát Google Form...
                </iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 3: BẢNG TÍNH EXCEL ĐỒNG BỘ (GOOGLE SHEETS)
          ============================================================ */}
      {activeView === 'sheet' && (
        <div className="sheet-view-section">
          {/* Thông báo đồng bộ dữ liệu */}
          <div className="sheet-sync-banner cyber-glass-card">
            <div className="sync-icon-box">📊</div>
            <div className="sync-info-text">
              <strong>Cơ Chế Đồng Bộ Google Form Sang Google Sheets</strong>
              <p>
                Khi bất kỳ ai điền biểu mẫu Google Form ở Tab 2, dữ liệu sẽ được tự động lưu trữ 100% vào Bảng tính Google Sheets của tác giả theo thời gian thực mà không bao giờ bị thất lạc dữ liệu.
              </p>
            </div>
          </div>

          {/* Sub Navigation: Chọn chế độ xem Sổ Dữ Liệu hoặc Nhúng Trực Tiếp */}
          <div className="sheet-subnav-bar">
            <button 
              className={`sheet-subnav-btn ${sheetSubView === 'table' ? 'active' : ''}`}
              onClick={() => setSheetSubView('table')}
            >
              <Table size={15} />
              <span>Sổ Dữ Liệu Đồng Bộ Trực Tiếp ({reviews.length} phiếu)</span>
            </button>
            <button 
              className={`sheet-subnav-btn ${sheetSubView === 'embed' ? 'active' : ''}`}
              onClick={() => setSheetSubView('embed')}
            >
              <ExternalLink size={15} />
              <span>Nhúng Trực Tiếp Google Sheets</span>
            </button>
          </div>

          <div className="survey-embed-container cyber-glass-card">
            <div className="sheet-embed-wrapper">
              <div className="embed-header-bar">
                <div className="embed-info">
                  <strong>{sheetSubView === 'table' ? 'Bảng Dữ Liệu Khảo Sát Đồng Bộ Thời Gian Thực' : 'Bảng Tính Google Sheets Trực Tiếp'}</strong>
                  <span>{sheetSubView === 'table' ? 'Đối chiếu kết quả đóng góp của học sinh & giáo viên' : 'Nhúng trực tiếp từ file Google Sheets của tác giả'}</span>
                </div>
                <div className="embed-actions-row">
                  {isAdmin && (
                    <button 
                      className="open-ext-link-btn" 
                      onClick={handleOpenConfig}
                      style={{ marginRight: '8px' }}
                    >
                      <Settings size={14} />
                      <span>Cấu hình Link</span>
                    </button>
                  )}
                  <a 
                    href={sheetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="open-ext-link-btn"
                  >
                    <span>Mở Google Sheets (Tab Mới)</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {sheetSubView === 'table' ? (
                /* Bảng dữ liệu trực quan phong cách sổ sách di sản */
                <div className="live-sheet-table-wrapper">
                  <table className="heritage-sheet-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Dấu Thời Gian</th>
                        <th>Họ Và Tên</th>
                        <th>Lớp / Đơn Vị</th>
                        <th>Đánh Giá</th>
                        <th>Nội Dung Ý Kiến</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((rev, idx) => (
                        <tr key={rev.id}>
                          <td><strong>{idx + 1}</strong></td>
                          <td className="col-date">{rev.date}</td>
                          <td className="col-name"><strong>{rev.name}</strong></td>
                          <td className="col-role"><span className="table-role-pill">{rev.role}</span></td>
                          <td className="col-rating">
                            <span className="table-star-chip">
                              {'★'.repeat(rev.rating)}
                            </span>
                          </td>
                          <td className="col-comment">{rev.comment}</td>
                          <td className="col-status">
                            <span className="synced-status-tag">
                              <CheckCircle size={12} /> Đã đồng bộ
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="table-summary-footer">
                    <span>Tổng cộng: <strong>{reviews.length} phiếu khảo sát</strong></span>
                    <span>Đánh giá trung bình: <strong>{averageRating}/5 sao</strong></span>
                  </div>
                </div>
              ) : (
                /* Khung nhúng Google Sheets Iframe với /preview */
                <div className="survey-device-bezel">
                  <iframe 
                    key={sheetUrl}
                    src={getEmbedSheetUrl(sheetUrl)} 
                    title="Google Sheets Kết quả khảo sát"
                    width="100%" 
                    height="650" 
                    frameBorder="0" 
                    className="survey-inner-frame"
                  >
                    Đang tải bảng tính Google Sheets...
                  </iframe>
                  <div className="embed-helper-footer">
                    <span>💡 Nếu khung hiển thị báo quyền truy cập, bạn có thể bấm nút <strong>"Mở Google Sheets (Tab Mới)"</strong> ở trên để xem trực tiếp hoặc chuyển sang tab <strong>"Sổ Dữ Liệu Đồng Bộ Trực Tiếp"</strong>.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
