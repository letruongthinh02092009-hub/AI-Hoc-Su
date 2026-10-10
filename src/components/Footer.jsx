import React from 'react';
import { Award, BookOpen, Sparkles, Heart, Swords } from 'lucide-react';

export default function Footer({ onSelectTab }) {
  return (
    <footer className="footer-heritage">
      <div className="footer-top-accent"></div>
      <div className="footer-content">
        <div className="footer-grid">
          {/* Cột 1: Thông tin đề tài */}
          <div className="footer-col brand-col">
            <div className="footer-brand-title">
              <span className="footer-icon imperial-emblem">
                <Swords size={20} className="emblem-sword text-gold" />
              </span>
              <h3>HÀO KHÍ TÂY SƠN</h3>
            </div>
            <p className="footer-desc">
              Nền tảng số hóa di sản và học tập Lịch sử về Hoàng đế Quang Trung – Nguyễn Huệ, hỗ trợ học sinh tiếp cận kiến thức trực quan và sinh động.
            </p>
            <div className="footer-award-badge">
              <Award size={16} className="badge-icon" />
              <span>Dự án Học tập Lịch sử – THPT Nguyễn Huệ</span>
            </div>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div className="footer-col links-col">
            <h4>Danh Mục Khám Phá</h4>
            <ul>
              <li><button onClick={() => onSelectTab('timeline')}>Biên Niên Sử (1753 - 1792)</button></li>
              <li><button onClick={() => onSelectTab('battle-map')}>Sa Bàn Trận Đánh Trực Quan</button></li>
              <li><button onClick={() => onSelectTab('museum')}>Bảo Tàng Hiện Vật & Thuyết Minh</button></li>
              <li><button onClick={() => onSelectTab('ai-station')}>Sử Quan Ảo (Google Gemini)</button></li>
              <li><button onClick={() => onSelectTab('quiz')}>Đố Vui Lịch Sử 3 Cấp Độ</button></li>
            </ul>
          </div>

          {/* Cột 3: Tác giả chính thức */}
          <div className="footer-col author-col">
            <h4>Tác Giả Dự Án</h4>
            <div className="author-card">
              <div className="author-avatar">TT</div>
              <div className="author-info">
                <strong className="author-name">LÊ TRƯỜNG THỊNH</strong>
                <span className="author-class">Học sinh Lớp 12A8</span>
                <span className="author-school">Trường THPT Nguyễn Huệ</span>
              </div>
            </div>
            <p className="author-quote">
              <em>"Khơi dậy ngọn lửa tự hào dân tộc và lòng biết ơn tiền nhân trong trái tim thế hệ trẻ bằng sức mạnh của công nghệ số."</em>
            </p>
          </div>
        </div>

        {/* Dòng bản quyền đáy trang */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 <strong>Bản quyền dự án: Lê Trường Thịnh – Lớp 12A8 – Trường THPT Nguyễn Huệ</strong>.
          </div>
          <div className="footer-tech-tag">
            <span>Ứng dụng React & Google Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
