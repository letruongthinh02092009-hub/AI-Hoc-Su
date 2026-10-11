import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  HelpCircle,
  Sparkles,
  Shield,
  Swords,
  Crown,
  Download,
  X,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { playCorrectSound, playWrongSound, playVictorySound, playChime } from '../utils/audio';

// Hàm xáo trộn và chọn 10 câu hỏi MỚI KHÔNG TRÙNG với lượt vừa làm
function prepareShuffledQuiz(levelKey, count = 10, excludedQuestionTexts = []) {
  const rawPool = QUIZ_QUESTIONS[levelKey] || QUIZ_QUESTIONS['co-ban'] || [];
  
  // 1. Lọc ra những câu chưa làm trong lượt gần nhất
  let eligible = rawPool.filter(q => {
    const text = q.question || q.q;
    return !excludedQuestionTexts.includes(text);
  });

  // Nếu số câu còn lại chưa đủ 10 câu thì reset lại toàn bộ ngân hàng câu hỏi của cấp độ đó
  if (eligible.length < count) {
    eligible = [...rawPool];
  }

  // 2. Xáo trộn ngẫu nhiên danh sách câu hỏi hợp lệ
  const pool = [...eligible];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // 3. Chọn 10 câu
  const selected = pool.slice(0, Math.min(count, pool.length));

  // 4. Đảo lộn vị trí các đáp án A, B, C, D và cập nhật lại vị trí đáp án đúng
  return selected.map((q) => {
    const qText = q.question || q.q;
    const explanationText = q.explain || q.explanation;
    const originalOptions = [...q.options];
    const correctText = originalOptions[q.correct !== undefined ? q.correct : 0];

    const shuffledOptions = [...originalOptions];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    const newCorrectIdx = shuffledOptions.indexOf(correctText);

    return {
      category: q.category,
      question: qText,
      q: qText,
      options: shuffledOptions,
      correct: newCorrectIdx >= 0 ? newCorrectIdx : 0,
      explain: explanationText,
      explanation: explanationText
    };
  });
}

export default function QuizArenaTab() {
  const [level, setLevel] = useState('co-ban');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Ghi nhớ lịch sử câu hỏi vừa làm để đổi 10 câu hoàn toàn khác khi chơi lại
  const [usedHistory, setUsedHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('su_quiz_used_history_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { 'co-ban': [], 'nang-cao': [], 'chuyen-sau': [] };
  });

  // Lưu điểm số đã hoàn thành cho cả 3 cấp độ
  const [completedLevels, setCompletedLevels] = useState(() => {
    try {
      const saved = localStorage.getItem('su_quiz_completed_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { 'co-ban': null, 'nang-cao': null, 'chuyen-sau': null };
  });

  // Tên học sinh nhận giấy chứng nhận
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem('su_student_name_v2') || 'Lê Trường Thịnh';
    } catch (e) {
      return 'Lê Trường Thịnh';
    }
  });

  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const questionsList = activeQuestions.length > 0 ? activeQuestions : (QUIZ_QUESTIONS[level] || QUIZ_QUESTIONS['co-ban']);
  const currentQ = questionsList[currentIndex] || questionsList[0] || {};

  const handleStartLevel = (selectedLevel) => {
    playChime(650, 'sine', 0.15);
    setLevel(selectedLevel);

    // Lấy danh sách 10 câu hỏi của lần trước để loại trừ (đảm bảo đổi 10 câu mới)
    const previouslyUsed = usedHistory[selectedLevel] || [];
    const randomized = prepareShuffledQuiz(selectedLevel, 10, previouslyUsed);

    // Cập nhật câu hỏi đã dùng vào lịch sử
    const currentQTexts = randomized.map(q => q.q);
    setUsedHistory(prev => {
      const next = { ...prev, [selectedLevel]: currentQTexts };
      try {
        sessionStorage.setItem('su_quiz_used_history_v2', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setActiveQuestions(randomized);
    setIsPlaying(true);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  const handleSelectOption = (optIdx) => {
    if (isAnswered) return;

    setSelectedOption(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === currentQ.correct;

    if (isCorrect) {
      playCorrectSound();
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      playWrongSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    playChime(550, 'sine', 0.1);
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    playVictorySound();

    // Ghi nhận điểm số cao nhất cho cấp độ này
    setCompletedLevels(prev => {
      const prevScore = prev[level] || 0;
      const next = {
        ...prev,
        [level]: Math.max(prevScore, score)
      };
      try {
        localStorage.setItem('su_quiz_completed_levels_v2', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E5A93C', '#F4D06F', '#FF6B4A', '#9E2A2B', '#10B981']
      });
    } catch (e) {}
  };

  const totalPossible = questionsList.length * 10;
  const percentage = Math.round((score / totalPossible) * 100);

  let rankBadge = '';
  if (percentage >= 90) {
    rankBadge = 'Đại Tướng Quân Giữ Sử Tây Sơn';
  } else if (percentage >= 70) {
    rankBadge = 'Hộ Giá Đô Đốc Tây Sơn';
  } else {
    rankBadge = 'Dũng Sĩ Áo Vải Cần Mẫn';
  }

  // Kiểm tra điều kiện mở khóa Giấy chứng nhận: Đã làm xong cả 3 cấp độ
  const isLevel1Done = completedLevels['co-ban'] !== null;
  const isLevel2Done = completedLevels['nang-cao'] !== null;
  const isLevel3Done = completedLevels['chuyen-sau'] !== null;
  const isAllLevelsCompleted = isLevel1Done && isLevel2Done && isLevel3Done;

  const totalAllScore = 
    (completedLevels['co-ban'] || 0) + 
    (completedLevels['nang-cao'] || 0) + 
    (completedLevels['chuyen-sau'] || 0);

  // Xuất Giấy Chứng Nhận ra ảnh PNG bằng HTML5 Canvas
  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    // Nền giấy lụa hoàng gia
    ctx.fillStyle = '#FAF7F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Khung viền ngoài màu son đậm (Vermilion Lacquer)
    ctx.strokeStyle = '#9E2A2B';
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    // Khung viền chỉ vàng kim (Metallic Gold)
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 4;
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

    // Hoa văn 4 góc truyền thống
    const drawCorner = (x, y, flipX, flipY) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flipX, flipY);
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(20, 20, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(70, 70, 1, 1);
    drawCorner(canvas.width - 70, 70, -1, 1);
    drawCorner(70, canvas.height - 70, 1, -1);
    drawCorner(canvas.width - 70, canvas.height - 70, -1, -1);

    // Quốc hiệu tiêu ngữ
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 24px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', canvas.width / 2, 115);
    ctx.font = 'italic 20px "Times New Roman", serif';
    ctx.fillText('Độc lập – Tự do – Hạnh phúc', canvas.width / 2, 148);

    // Dải phân cách hoa văn vàng
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 140, 168);
    ctx.lineTo(canvas.width / 2 + 140, 168);
    ctx.stroke();

    // Tiêu đề Giấy Chứng Nhận
    ctx.fillStyle = '#9E2A2B';
    ctx.font = 'bold 50px "Times New Roman", Georgia, serif';
    ctx.fillText('GIẤY CHỨNG NHẬN VINH DANH', canvas.width / 2, 245);

    ctx.fillStyle = '#C5A059';
    ctx.font = 'bold 26px "Times New Roman", serif';
    ctx.fillText('AM HIỂU LỊCH SỬ PHONG TRÀO TÂY SƠN', canvas.width / 2, 290);

    // Nội dung vinh danh
    ctx.fillStyle = '#44403C';
    ctx.font = '22px "Times New Roman", serif';
    ctx.fillText('Hội đồng Khảo cứu & Giáo dục Di sản Kỹ thuật số trân trọng chứng nhận:', canvas.width / 2, 360);

    // Tên học sinh
    ctx.fillStyle = '#9E2A2B';
    ctx.font = 'bold 44px "Times New Roman", Georgia, serif';
    ctx.fillText(studentName || 'Lê Trường Thịnh', canvas.width / 2, 425);

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillText('Lớp 12A8 — Trường THPT Nguyễn Huệ', canvas.width / 2, 470);

    ctx.fillStyle = '#44403C';
    ctx.font = '22px "Times New Roman", serif';
    ctx.fillText('Đã hoàn thành xuất sắc toàn bộ 3 cấp độ thử thách Đấu trường Sử học Tây Sơn:', canvas.width / 2, 530);
    ctx.fillText('• Khởi Khái Môn (Cơ bản)   • Binh Pháp Khắc Địch (Nâng cao)   • Kỳ Tài Vương Triều (Chuyên sâu)', canvas.width / 2, 565);

    // Bảng thành tích
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 24px "Times New Roman", serif';
    ctx.fillText(`Tổng điểm tích lũy: ${totalAllScore} / 300 Điểm`, canvas.width / 2, 630);
    ctx.fillStyle = '#15803D';
    ctx.fillText('Danh hiệu phong tặng: THỦ KHOA SỬ HỌC TÂY SƠN (XUẤT SẮC)', canvas.width / 2, 670);

    // Ngày tháng
    const today = new Date();
    const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
    ctx.fillStyle = '#44403C';
    ctx.font = 'italic 20px "Times New Roman", serif';
    ctx.fillText(dateStr, canvas.width - 320, 770);

    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillText('BAN KHẢO CỨU SỬ HỌC', canvas.width - 320, 810);
    ctx.font = 'italic 18px "Times New Roman", serif';
    ctx.fillText('(Ký tên và chứng thực)', canvas.width - 320, 840);

    // Mộc đỏ triều Quang Trung
    ctx.save();
    ctx.translate(canvas.width - 320, 920);
    ctx.strokeStyle = '#DC2626';
    ctx.fillStyle = '#DC2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 13px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('ĐẠI VIỆT', 0, -22);
    ctx.font = 'bold 15px "Times New Roman", serif';
    ctx.fillText('QUANG TRUNG', 0, 2);
    ctx.fillText('HOÀNG ĐẾ', 0, 22);
    ctx.font = '10px "Times New Roman", serif';
    ctx.fillText('1788 - 1792', 0, 38);
    ctx.restore();

    // Kích hoạt tải ảnh về máy
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Giay_Chung_Nhan_Tay_Son_${(studentName || 'HocSinh').replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
    playChime(750, 'sine', 0.2);
  };

  return (
    <motion.div 
      className="tab-page quiz-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-title-box">
        <span className="section-kicker">ĐẤU TRƯỜNG TRI THỨC GAMIFIED</span>
        <h2 className="section-heading">THỬ THÁCH SỬ HỌC TÂY SƠN</h2>
        <p className="section-subtext">Hệ thống 90 câu hỏi trắc nghiệm tương tác 3 cấp độ (mỗi lượt tự động đổi 10 câu mới). Hoàn thành cả 3 cấp độ để nhận Giấy Chứng Nhận vinh danh.</p>
        <div className="title-divider-gold"></div>
      </div>

      {/* Thanh trạng thái hoàn thành 3 cấp độ & nút nhận Giấy chứng nhận */}
      <div className="quiz-progress-summary-bar">
        <div className="summary-badges-row">
          <span className={`summary-level-pill ${isLevel1Done ? 'done' : ''}`}>
            {isLevel1Done ? 'Cấp I: ' + completedLevels['co-ban'] + ' điểm' : 'Cấp I: Chưa hoàn thành'}
          </span>
          <span className={`summary-level-pill ${isLevel2Done ? 'done' : ''}`}>
            {isLevel2Done ? 'Cấp II: ' + completedLevels['nang-cao'] + ' điểm' : 'Cấp II: Chưa hoàn thành'}
          </span>
          <span className={`summary-level-pill ${isLevel3Done ? 'done' : ''}`}>
            {isLevel3Done ? 'Cấp III: ' + completedLevels['chuyen-sau'] + ' điểm' : 'Cấp III: Chưa hoàn thành'}
          </span>
        </div>

        {isAllLevelsCompleted && (
          <button 
            className="btn-open-cert"
            onClick={() => {
              playChime(700, 'sine', 0.15);
              setShowCertificateModal(true);
            }}
          >
            <Award size={18} />
            <span>Xem & Tải Giấy Chứng Nhận Vinh Danh</span>
          </button>
        )}
      </div>

      {!isPlaying ? (
        // Màn hình chọn cấp độ
        <div className="quiz-levels-picker">
          {/* Card 1: Khởi Khái Môn (Cơ bản) */}
          <motion.div 
            className="level-card character-card card-emerald" 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => handleStartLevel('co-ban')}
          >
            <div className="card-character-header">
              <div className="character-avatar-frame avatar-emerald">
                <Shield size={26} />
              </div>
              <div className="embossed-metal-badge badge-emerald">
                <span>CẤP ĐỘ I</span>
              </div>
            </div>

            <div className="character-card-body">
              <span className="character-rank-title">DŨNG SĨ TIÊN PHONG</span>
              <h3 className="character-level-name">Khởi Khái Môn (Cơ Bản)</h3>
              <p className="character-desc">
                10 câu hỏi nền tảng (tự động đổi 10 câu mới khi làm lại): năm sinh, quê hương, khởi nghĩa Tây Sơn Thượng Đạo.
              </p>

              <div className="card-combat-stats">
                <div className="stat-pill">
                  <span className="stat-label">Độ khó:</span>
                  <span className="stat-stars">Cơ bản · 1/3</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Điểm cao nhất:</span>
                  <span className="stat-num">{completedLevels['co-ban'] !== null ? `${completedLevels['co-ban']}/100đ` : 'Chưa thi'}</span>
                </div>
              </div>
            </div>

            <div className="character-card-footer">
              <span className="level-start-btn btn-emerald-theme">
                Bắt đầu xuất trận <ArrowRight size={15} />
              </span>
            </div>
          </motion.div>

          {/* Card 2: Binh Pháp Khắc Địch (Nâng cao) */}
          <motion.div 
            className="level-card character-card card-gold" 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => handleStartLevel('nang-cao')}
          >
            <div className="card-character-header">
              <div className="character-avatar-frame avatar-gold">
                <Swords size={26} />
              </div>
              <div className="embossed-metal-badge badge-gold">
                <span>CẤP ĐỘ II</span>
              </div>
            </div>

            <div className="character-card-body">
              <span className="character-rank-title">ĐÔ ĐỐC TỔNG BINH</span>
              <h3 className="character-level-name">Binh Pháp Khắc Địch (Nâng Cao)</h3>
              <p className="character-desc">
                10 câu hỏi nghệ thuật quân sự: hành quân thần tốc, súng hỏa hổ, kế lui quân Tam Điệp và công phá Ngọc Hồi.
              </p>

              <div className="card-combat-stats">
                <div className="stat-pill">
                  <span className="stat-label">Độ khó:</span>
                  <span className="stat-stars">Nâng cao · 2/3</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Điểm cao nhất:</span>
                  <span className="stat-num">{completedLevels['nang-cao'] !== null ? `${completedLevels['nang-cao']}/100đ` : 'Chưa thi'}</span>
                </div>
              </div>
            </div>

            <div className="character-card-footer">
              <span className="level-start-btn btn-gold-theme">
                Thử sức điều binh <ArrowRight size={15} />
              </span>
            </div>
          </motion.div>

          {/* Card 3: Kỳ Tài Vương Triều (Chuyên sâu) */}
          <motion.div 
            className="level-card character-card card-crimson" 
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => handleStartLevel('chuyen-sau')}
          >
            <div className="card-character-header">
              <div className="character-avatar-frame avatar-crimson">
                <Crown size={26} />
              </div>
              <div className="embossed-metal-badge badge-crimson">
                <span>CẤP ĐỘ III</span>
              </div>
            </div>

            <div className="character-card-body">
              <span className="character-rank-title">MINH QUÂN HOÀNG ĐẾ</span>
              <h3 className="character-level-name">Kỳ Tài Vương Triều (Chuyên Sâu)</h3>
              <p className="character-desc">
                10 câu hỏi chuyên sâu: dòng dõi họ Hồ, chính sách chữ Nôm, bang giao Mãn Thanh, bản đồ và y sử.
              </p>

              <div className="card-combat-stats">
                <div className="stat-pill">
                  <span className="stat-label">Độ khó:</span>
                  <span className="stat-stars">Chuyên sâu · 3/3</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Điểm cao nhất:</span>
                  <span className="stat-num">{completedLevels['chuyen-sau'] !== null ? `${completedLevels['chuyen-sau']}/100đ` : 'Chưa thi'}</span>
                </div>
              </div>
            </div>

            <div className="character-card-footer">
              <span className="level-start-btn btn-crimson-theme">
                Chinh phục đỉnh cao <ArrowRight size={15} />
              </span>
            </div>
          </motion.div>
        </div>
      ) : isFinished ? (
        // Màn hình kết quả
        <motion.div 
          className="quiz-result-card card"
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="result-trophy-icon">
            <Trophy size={48} className="text-gold" />
          </div>
          <h3 className="result-title-gold">Hoàn Thành Lượt Thử Thách!</h3>
          <div className="result-score-tag">
            {score} / {totalPossible} Điểm ({percentage}%)
          </div>

          <div className="result-rank-box">
            <span className="rank-label">DANH HIỆU ĐƯỢC PHONG TẶNG:</span>
            <strong className="rank-title">{rankBadge}</strong>
          </div>

          <p className="result-feedback">
            {percentage >= 80 
              ? 'Xuất sắc phi thường! Bạn nắm rất vững kiến thức lịch sử phong trào Tây Sơn. Hãy tiếp tục hoàn thành các cấp độ còn lại để mở khóa Giấy Chứng Nhận nhé!'
              : 'Một lượt thử thách rất đáng khích lệ! Bạn có thể bấm "Làm lại cấp độ này (Đổi 10 câu mới)" để rèn luyện thêm kiến thức nhé.'}
          </p>

          <div className="result-action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => handleStartLevel(level)}
            >
              <RotateCcw size={16} /> Làm lại cấp độ này (Đổi 10 câu mới)
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsPlaying(false)}
            >
              Chọn cấp độ khác
            </button>
            {isAllLevelsCompleted && (
              <button 
                className="btn-cert-special"
                onClick={() => setShowCertificateModal(true)}
              >
                <Award size={16} /> Xem Giấy Chứng Nhận
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        // Màn hình chơi Quiz
        <div className="quiz-play-box">
          <div className="quiz-header-bar">
            <div className="quiz-progress-text">
              Câu hỏi: <strong>{currentIndex + 1} / {questionsList.length}</strong>
            </div>

            <div className="quiz-stats-group">
              <span className="quiz-score-pill"><Award size={14} /> Điểm: {score}</span>
              <span className={`quiz-streak-pill ${streak > 1 ? 'fire-streak' : ''}`}>
                <Flame size={14} /> Chuỗi: {streak}
              </span>
            </div>
          </div>

          <div className="quiz-progress-line-bg">
            <motion.div 
              className="quiz-progress-line-fill" 
              initial={false}
              animate={{ width: `${((currentIndex + 1) / questionsList.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="quiz-question-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="quiz-question-text">{currentQ.q}</h3>

              <div className="quiz-options-list">
                {currentQ.options.map((opt, optIdx) => {
                  let optClass = 'quiz-option-btn';
                  if (isAnswered) {
                    if (optIdx === currentQ.correct) {
                      optClass += ' correct-answer';
                    } else if (optIdx === selectedOption) {
                      optClass += ' wrong-answer';
                    }
                  } else if (optIdx === selectedOption) {
                    optClass += ' selected';
                  }

                  return (
                    <button
                      key={optIdx}
                      className={optClass}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswered}
                    >
                      <span className="opt-letter">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="opt-text">{opt}</span>
                      {isAnswered && optIdx === currentQ.correct && (
                        <CheckCircle size={18} className="opt-status-icon correct" />
                      )}
                      {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correct && (
                        <XCircle size={18} className="opt-status-icon wrong" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div 
                  className="quiz-explanation-box"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="exp-header">
                    <Sparkles size={16} className="exp-icon" />
                    <strong>Kiểm chứng sử liệu Tây Sơn:</strong>
                  </div>
                  <p className="exp-text">{currentQ.explanation}</p>
                </motion.div>
              )}

              {isAnswered && (
                <div className="quiz-action-next-wrap">
                  <button className="btn btn-primary next-btn" onClick={handleNext}>
                    {currentIndex + 1 < questionsList.length ? (
                      <>Câu tiếp theo <ArrowRight size={16} /></>
                    ) : (
                      <>Xem tổng kết điểm số <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* CỬA SỔ MODAL GIẤY CHỨNG NHẬN VINH DANH */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="modal-backdrop" onClick={() => setShowCertificateModal(false)}>
            <motion.div 
              className="certificate-modal-wrapper"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="cert-modal-header">
                <div className="cert-header-title">
                  <Award size={22} className="text-gold" />
                  <strong>Giấy Chứng Nhận Vinh Danh Lịch Sử Tây Sơn</strong>
                </div>
                <button 
                  className="close-modal-btn" 
                  onClick={() => setShowCertificateModal(false)}
                  title="Đóng"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tùy chỉnh tên học sinh hiển thị trên Giấy Chứng Nhận */}
              <div className="cert-name-input-bar">
                <label>Họ và tên của bạn hiển thị trên Giấy Chứng Nhận:</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    try {
                      localStorage.setItem('su_student_name_v2', e.target.value);
                    } catch (err) {}
                  }}
                  placeholder="Nhập họ và tên học sinh..."
                />
              </div>

              {/* Bản xem trước Giấy chứng nhận hoàng gia */}
              <div className="certificate-parchment-preview">
                <div className="cert-inner-border">
                  <div className="cert-republic-header">
                    <h4>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                    <p>Độc lập – Tự do – Hạnh phúc</p>
                    <div className="cert-divider-line"></div>
                  </div>

                  <div className="cert-main-body">
                    <h2 className="cert-main-title">GIẤY CHỨNG NHẬN VINH DANH</h2>
                    <h3 className="cert-sub-title">AM HIỂU LỊCH SỬ PHONG TRÀO TÂY SƠN</h3>

                    <p className="cert-grant-text">Hội đồng Khảo cứu & Giáo dục Di sản Kỹ thuật số trân trọng chứng nhận:</p>

                    <h1 className="cert-student-name">{studentName || 'Lê Trường Thịnh'}</h1>
                    <p className="cert-class-name">Học sinh Lớp 12A8 — Trường THPT Nguyễn Huệ</p>

                    <p className="cert-desc-text">
                      Đã hoàn thành xuất sắc toàn bộ 3 cấp độ khảo cứu chuyên sâu lịch sử Tây Sơn Tam Kiệt và triều đại Hoàng đế Quang Trung.
                    </p>

                    <div className="cert-stats-grid">
                      <div className="cert-stat-item">
                        <span>Tổng điểm tích lũy:</span>
                        <strong>{totalAllScore} / 300 Điểm</strong>
                      </div>
                      <div className="cert-stat-item">
                        <span>Xếp loại danh hiệu:</span>
                        <strong className="text-gold">Thủ Khoa Sử Học Tây Sơn</strong>
                      </div>
                    </div>

                    <div className="cert-bottom-signatures">
                      <div className="cert-seal-wrap">
                        <div className="imperial-red-seal">
                          <span>ĐẠI VIỆT</span>
                          <strong>QUANG TRUNG</strong>
                          <strong>HOÀNG ĐẾ</strong>
                          <small>1788 - 1792</small>
                        </div>
                      </div>

                      <div className="cert-signature-box">
                        <p className="cert-date-text">
                          {`Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`}
                        </p>
                        <strong>BAN KHẢO CỨU SỬ HỌC</strong>
                        <p className="cert-sign-sub">(Ký tên và đóng dấu điện tử)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thanh nút hành động */}
              <div className="cert-modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowCertificateModal(false)}
                >
                  Đóng
                </button>
                <button 
                  className="btn-download-cert" 
                  onClick={handleDownloadCertificate}
                >
                  <Download size={18} />
                  <span>Tải Giấy Chứng Nhận Về Máy (Ảnh PNG)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
