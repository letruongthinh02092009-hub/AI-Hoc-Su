import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  Table, 
  Settings, 
  CheckCircle, 
  RefreshCw, 
  Share2, 
  Layers 
} from 'lucide-react';
import { playChime, playCorrectSound } from '../utils/audio';

const STORAGE_FORM_URL = 'su_survey_google_form_url';
const STORAGE_SHEET_URL = 'su_survey_google_sheet_url';

// Giá trị mặc định (Sử dụng Google Sheet mà bạn đang có)
const DEFAULT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScX_sample_form/viewform?embedded=true';
const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1VGSKa__Ge1KRXKrvok5pihtK_mnQeW302tZffFFk3HE/edit?gid=1865148353#gid=1865148353';

export default function SurveyTab() {
  const [formUrl, setFormUrl] = useState(DEFAULT_FORM_URL);
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SHEET_URL);
  const [activeView, setActiveView] = useState('form'); // 'form' hoặc 'sheet'
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [inputFormUrl, setInputFormUrl] = useState('');
  const [inputSheetUrl, setInputSheetUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const savedForm = localStorage.getItem(STORAGE_FORM_URL);
      const savedSheet = localStorage.getItem(STORAGE_SHEET_URL);
      if (savedForm) setFormUrl(savedForm);
      if (savedSheet) setSheetUrl(savedSheet);
    } catch (e) {}
  }, []);

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

  // Chuyển link Google Sheet sang dạng xem nhúng hoặc xem trực tiếp
  const getEmbedSheetUrl = (url) => {
    if (!url) return '';
    if (url.includes('/edit')) {
      return url.replace(/\/edit.*$/, '/pubhtml?widget=true&headers=false');
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
          Dữ liệu khảo sát được thu thập tự động qua Google Form và đồng bộ trực tiếp vào Google Sheets theo thời gian thực.
        </p>
        <div className="title-divider-gold"></div>
      </div>

      {/* Thanh điều khiển Tab: Biểu mẫu Google Form / Kết quả Google Sheet */}
      <div className="survey-toolbar-card cyber-glass-card">
        <div className="survey-tab-switch">
          <button 
            className={`survey-toggle-btn ${activeView === 'form' ? 'active' : ''}`}
            onClick={() => {
              playChime(600, 'sine', 0.1);
              setActiveView('form');
            }}
          >
            <FileText size={18} />
            <span>Điền Phiếu Khảo Sát (Google Form)</span>
          </button>

          <button 
            className={`survey-toggle-btn ${activeView === 'sheet' ? 'active' : ''}`}
            onClick={() => {
              playChime(600, 'sine', 0.1);
              setActiveView('sheet');
            }}
          >
            <Table size={18} />
            <span>Xem Kết Quả Đồng Bộ (Google Sheets)</span>
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
            <p>Câu trả lời được gửi an toàn về Google Cloud của tác giả</p>
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

      {/* Nội dung chính: Iframe Google Form hoặc Iframe Google Sheet trong khung Dark Bezel */}
      <div className="survey-embed-container cyber-glass-card">
        {activeView === 'form' ? (
          <div className="form-embed-wrapper">
            <div className="embed-header-bar">
              <div className="embed-info">
                <strong>Biểu Mẫu Khảo Sát Trực Tuyến</strong>
                <span>Dữ liệu tự động đồng bộ vào Google Sheets của tác giả Lê Trường Thịnh (Lớp 12A8)</span>
              </div>
              <div className="embed-actions-row">
                <a 
                  href={formUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="open-ext-link-btn"
                >
                  <span>Mở Google Form tab mới</span>
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
        ) : (
          <div className="sheet-embed-wrapper">
            <div className="embed-header-bar">
              <div className="embed-info">
                <strong>Bảng Tính Kết Quả Đồng Bộ Thời Gian Thực</strong>
                <span>Dữ liệu câu trả lời của các bạn học sinh trực tiếp từ Google Sheets</span>
              </div>
              <div className="embed-actions-row">
                <a 
                  href={sheetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="open-ext-link-btn"
                >
                  <span>Mở Google Sheets</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

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
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
