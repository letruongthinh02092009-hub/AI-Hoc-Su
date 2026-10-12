import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Swords, 
  Check, 
  Compass, 
  Search, 
  ShieldCheck, 
  Loader2, 
  MapPin, 
  Bot, 
  Flame,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function DesignSystemPreview({ onSelectTab }) {
  const [inputText, setInputText] = useState('Đại phá quân Thanh 1789');
  const [selectVal, setSelectVal] = useState('co-ban');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="design-system-preview-page">
      {/* Top Banner Navigation */}
      <div className="ds-header-bar">
        <button 
          className="btn btn-secondary ds-back-btn"
          onClick={() => onSelectTab('home')}
        >
          <ArrowLeft size={16} />
          <span>Trở về Trang Chủ</span>
        </button>
        <div className="ds-header-titles">
          <span className="section-kicker">GIAI ĐOẠN 2 — HỆ THỐNG THIẾT KẾ</span>
          <h1 className="ds-main-title">CINEMATIC HERITAGE DESIGN SYSTEM</h1>
          <p className="ds-main-sub">
            Ngôn ngữ thị giác di sản lịch sử chuẩn mực cho đề tài KHKT · THPT Nguyễn Huệ
          </p>
        </div>
      </div>

      <div className="ds-content-container">
        {/* ================= 1. BẢNG MÀU CHÍNH THỨC ================= */}
        <section className="ds-section">
          <h2 className="ds-section-title">1. Color Palette Tokens</h2>
          <p className="ds-section-desc">
            Bảng màu triệt tiêu hoàn toàn neon và glassmorphism; xây dựng trên sắc than nhung hoàng triều, đồng cổ trầm và sơn son Tây Sơn.
          </p>
          <div className="ds-color-grid">
            <div className="ds-color-chip" style={{ background: '#151310' }}>
              <div className="ds-chip-meta">
                <strong>--color-bg</strong>
                <span>#151310</span>
                <small>Charcoal Black (Nền chính)</small>
              </div>
            </div>
            <div className="ds-color-chip" style={{ background: '#201C18' }}>
              <div className="ds-chip-meta">
                <strong>--color-surface</strong>
                <span>#201C18</span>
                <small>Warm Surface (Khối & Thẻ)</small>
              </div>
            </div>
            <div className="ds-color-chip" style={{ background: '#B99A5B', color: '#151310' }}>
              <div className="ds-chip-meta">
                <strong>--color-accent-bronze</strong>
                <span>#B99A5B</span>
                <small>Muted Bronze (Đồng cổ)</small>
              </div>
            </div>
            <div className="ds-color-chip" style={{ background: '#672D2B' }}>
              <div className="ds-chip-meta">
                <strong>--color-accent-crimson</strong>
                <span>#672D2B</span>
                <small>Lacquer Crimson (Sơn son)</small>
              </div>
            </div>
            <div className="ds-color-chip" style={{ background: '#F0E8DA', color: '#151310' }}>
              <div className="ds-chip-meta">
                <strong>--color-text-primary</strong>
                <span>#F0E8DA</span>
                <small>Warm Ivory (Chữ chính)</small>
              </div>
            </div>
            <div className="ds-color-chip" style={{ background: '#B5ACA1', color: '#151310' }}>
              <div className="ds-chip-meta">
                <strong>--color-text-secondary</strong>
                <span>#B5ACA1</span>
                <small>Neutral Light (Chữ phụ, tương phản 7:1)</small>
              </div>
            </div>
            <div className="ds-color-chip" style={{ background: '#2C2620' }}>
              <div className="ds-chip-meta">
                <strong>--color-border-subtle</strong>
                <span>#2C2620</span>
                <small>Subtle Border (Viền trầm)</small>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. TYPOGRAPHY HIERARCHY ================= */}
        <section className="ds-section">
          <h2 className="ds-section-title">2. Typography Scale (Hỗ trợ tiếng Việt 100%)</h2>
          <p className="ds-section-desc">
            Phối hợp nhịp nhàng giữa <strong>Playfair Display</strong> (Tiêu đề uy nghi) và <strong>Be Vietnam Pro</strong> (Nội dung & Giao diện hiện đại).
          </p>
          <div className="ds-type-specimen card">
            <div className="ds-type-row">
              <span className="ds-type-label">H1 (Hero Title / 42px)</span>
              <h1 className="ds-sample-h1">HÀO KHÍ TÂY SƠN · ĐẠI THẮNG KỶ DẬU 1789</h1>
            </div>
            <div className="ds-type-row">
              <span className="ds-type-label">H2 (Section Heading / 32px)</span>
              <h2 className="ds-sample-h2">Sa Bàn Tác Chiến Thần Tốc Bắc Hà</h2>
            </div>
            <div className="ds-type-row">
              <span className="ds-type-label">H3 (Curatorial Title / 22px)</span>
              <h3 className="ds-sample-h3">Chiến Bào Vua Quang Trung Sạm Màu Khói Súng</h3>
            </div>
            <div className="ds-type-row">
              <span className="ds-type-label">Body Text (16px / Line-height 1.7)</span>
              <p className="ds-sample-body">
                Năm 1788, trước hiểm họa xâm lăng của 29 vạn quân Mãn Thanh, Bắc Bình Vương Nguyễn Huệ làm lễ đăng quang tại núi Bân (Phú Xuân), đặt niên hiệu Quang Trung rồi lập tức đốc suất đại binh hành quân thần tốc ra Bắc. Với chiến thuật nghi binh, vu hồi và áp đảo hỏa lực, quân Tây Sơn đã quét sạch các đồn lũy Ngọc Hồi, Khương Thượng, giải phóng Thăng Long vào mùng 5 Tết Kỷ Dậu 1789.
              </p>
            </div>
            <div className="ds-type-row">
              <span className="ds-type-label">Historical Proclamation (Serif Italic)</span>
              <blockquote className="ds-sample-quote">
                "Đánh cho để dài tóc / Đánh cho để đen răng / Đánh cho nó chích luân bất phản / Đánh cho nó phiến giáp bất hoàn / Đánh cho sử tri nam quốc anh hùng chi hữu chủ!"
              </blockquote>
            </div>
          </div>
        </section>

        {/* ================= 3. BUTTONS & ACTIONS ================= */}
        <section className="ds-section">
          <h2 className="ds-section-title">3. Action Controls & Buttons</h2>
          <p className="ds-section-desc">
            Nút bấm có kỷ luật bo góc 4px, độ tương phản cao, focus ring rõ nét cho khả năng tiếp cận (Accessibility).
          </p>
          <div className="ds-components-row">
            <button className="btn btn-primary">
              <Swords size={16} />
              <span>Nút Chính (Primary Crimson)</span>
            </button>

            <button className="btn btn-secondary">
              <Compass size={16} />
              <span>Nút Phụ (Secondary Surface)</span>
            </button>

            <button className="btn btn-bronze">
              <Flame size={16} />
              <span>Nút Đồng Cổ (Accent Bronze)</span>
            </button>

            <button className="btn btn-ghost">
              <span>Nút Ghost Outline</span>
            </button>

            <button className="btn-text-link">
              <span>Liên kết văn bản</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="ds-components-row" style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" disabled>
              <span>Nút Bị Vô Hiệu (Disabled)</span>
            </button>

            <button 
              className="btn btn-primary"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="ds-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Bấm thử Loading State</span>
              )}
            </button>
          </div>
        </section>

        {/* ================= 4. FORM CONTROLS ================= */}
        <section className="ds-section">
          <h2 className="ds-section-title">4. Form Controls & Inputs (Tùy biến 100%)</h2>
          <p className="ds-section-desc">
            Không sử dụng viền xanh/đen mặc định của trình duyệt. Trạng thái focus sử dụng viền đồng cổ cùng vòng hào quang nhẹ.
          </p>
          <div className="ds-form-grid card">
            <div className="ds-form-group">
              <label className="ds-field-label">Ô Nhập Văn Bản (Text Input)</label>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm lịch sử..." 
              />
            </div>

            <div className="ds-form-group">
              <label className="ds-field-label">Hộp Lựa Chọn (Custom Select)</label>
              <select value={selectVal} onChange={(e) => setSelectVal(e.target.value)}>
                <option value="co-ban">Cấp độ 1: Khởi nghĩa Tây Sơn (1771 - 1777)</option>
                <option value="thong-hieu">Cấp độ 2: Đại phá quân Xiêm (1785)</option>
                <option value="nang-cao">Cấp độ 3: Quét sạch 29 vạn quân Thanh (1789)</option>
              </select>
            </div>

            <div className="ds-form-group full-width">
              <label className="ds-field-label">Khung Đóng Góp Ý Kiến (Textarea)</label>
              <textarea 
                rows="3" 
                placeholder="Nhập cảm nghĩ về công trình số hóa lịch sử THPT Nguyễn Huệ..." 
                defaultValue="Một nền tảng học sử vô cùng trực quan, bố cục nghiêm cẩn và chất chứa lòng tự hào dân tộc sâu sắc."
              />
            </div>
          </div>
        </section>

        {/* ================= 5. CARDS & BADGES ================= */}
        <section className="ds-section">
          <h2 className="ds-section-title">5. Editorial Cards & Curatorial Badges</h2>
          <p className="ds-section-desc">
            Bề mặt màu than nhung trơn láng, viền mỏng 1px sắc nét, phản hồi hover nâng khối tinh tế.
          </p>
          <div className="ds-cards-grid">
            <div className="card card-interactive ds-sample-card">
              <div className="ds-card-meta">
                <span className="badge-heritage badge-bronze">TƯ LIỆU SỐ HÓA</span>
                <span className="ds-card-index">01</span>
              </div>
              <h3 className="ds-card-title">Sa Bàn Tác Chiến Rạch Gầm – Xoài Mút</h3>
              <p className="ds-card-desc">
                Tái hiện thế trận mai phục hỏa công kinh điển của danh tướng Nguyễn Huệ trên khúc sông Tiền năm 1785.
              </p>
              <span className="btn-text-link">
                <span>Xem chi tiết sa bàn</span>
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>

            <div className="card card-interactive ds-sample-card">
              <div className="ds-card-meta">
                <span className="badge-heritage badge-crimson">HIỆN VẬT BẢO TÀNG</span>
                <span className="ds-card-index">02</span>
              </div>
              <h3 className="ds-card-title">Súng Hỏa Hổ Tây Sơn</h3>
              <p className="ds-card-desc">
                Vũ khí dã chiến phun lửa uy lực bậc nhất thế kỷ XVIII, nỗi kinh hoàng của bộ binh và chiến lũy đối phương.
              </p>
              <span className="btn-text-link">
                <span>Khảo cứu hiện vật</span>
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
