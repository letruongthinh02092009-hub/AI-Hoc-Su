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
  Sparkles,
  Download,
  X,
  Swords,
  Star,
  Shield,
  Zap,
  Lock,
  Unlock
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { playCorrectSound, playWrongSound, playVictorySound, playChime } from '../utils/audio';
import { generateCertificateCanvas } from '../utils/certificateGenerator';

const LEVELS_DATA = [
  {
    key: 'co-ban',
    numeral: 'Ⅰ',
    title: 'Khởi Khái Môn',
    subtitle: 'Nền Tảng & Thân Thế',
    category: 'Cấp độ Nền tảng',
    badgeText: 'Thử Thách Nhập Môn',
    desc: 'Khởi nguồn từ hào khí áo vải cờ đào làng Kiên Mỹ, thử thách tri thức nền tảng về ba anh em Tây Sơn và những bước đầu dựng cờ cứu dân.',
    icon: Flame,
    colorAccent: '#FFD700'
  },
  {
    key: 'nang-cao',
    numeral: 'Ⅱ',
    title: 'Binh Pháp Khắc Địch',
    subtitle: 'Nghệ Thuật Quân Sự',
    category: 'Cấp độ Trung cấp',
    badgeText: 'Thao Lược Chiến Trận',
    desc: 'Khảo sát tài thao lược thần tốc, thủy chiến Rạch Gầm – Xoài Mút, đại phá 29 vạn quân Thanh và kỹ thuật tác chiến đỉnh cao.',
    icon: Swords,
    colorAccent: '#E5A93C'
  },
  {
    key: 'chuyen-sau',
    numeral: 'Ⅲ',
    title: 'Kỳ Tài Vương Triều',
    subtitle: 'Chính Trị & Canh Tân',
    category: 'Cấp độ Chuyên sâu',
    badgeText: 'Đỉnh Cao Sử Học',
    desc: 'Khảo cứu chính sách dùng chữ Nôm, canh tân nông nghiệp, đúc tiền Quang Trung Thông Bảo và tầm nhìn vượt thời đại của vị Hoàng đế.',
    icon: Trophy,
    colorAccent: '#FFB800'
  }
];

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

  // Xuất Giấy Chứng Nhận ra ảnh PNG bằng module Canvas độc lập
  const handleDownloadCertificate = () => {
    const safeName = (studentName || 'Lê Trường Thịnh').trim();
    const dataUrl = generateCertificateCanvas({
      studentName: safeName,
      totalScore: totalAllScore,
      rankTitle: 'THỦ KHOA SỬ HỌC TÂY SƠN (XUẤT SẮC)'
    });
    const filename = `Giay_Chung_Nhan_Tay_Son_${safeName.replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '_') || 'HocSinh'}.png`;
    const link = document.createElement('a');
    link.download = filename;
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
        <p className="section-subtext">
          Hệ thống 90 câu hỏi trắc nghiệm tương tác 3 cấp độ (mỗi lượt tự động đổi 10 câu mới). Hoàn thành cả 3 cấp độ để nhận Giấy Chứng Nhận vinh danh.
        </p>
        <div className="title-divider-gold" />
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
        // Màn hình chọn cấp độ: 3 Thẻ Bài 3D Sưu Tầm với hiệu ứng vệt quét ánh kim Sweep Shimmer
        <div className="quiz-level-grid-3d">
          {LEVELS_DATA.map((lvl) => {
            const userScore = completedLevels[lvl.key];
            const isDone = userScore !== null;
            const starsEarned = !isDone ? 0 : userScore >= 90 ? 3 : userScore >= 70 ? 2 : 1;
            const IconComp = lvl.icon;

            return (
              <motion.div 
                key={lvl.key}
                className={`quiz-card-3d ${isDone ? 'card-completed' : ''}`}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleStartLevel(lvl.key)}
                role="button"
                tabIndex={0}
                aria-label={`Bắt đầu thử thách ${lvl.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStartLevel(lvl.key);
                  }
                }}
              >
                {/* Vệt kim loại quét qua mặt thẻ */}
                <div className="card-shimmer-sweep" aria-hidden="true" />

                {/* Huy hiệu đỉnh đầu thẻ bài */}
                <div className="quiz-card-top-crest">
                  <div className="numeral-seal">
                    <span className="numeral-text">{lvl.numeral}</span>
                  </div>
                  <span className="level-badge-tag">{lvl.badgeText}</span>
                </div>

                {/* Biểu tượng đại diện cấp độ */}
                <div className="quiz-card-icon-emblem">
                  <IconComp size={36} color={lvl.colorAccent} />
                </div>

                {/* Tiêu đề & Cấp độ */}
                <div className="quiz-card-header-info">
                  <span className="quiz-card-category-sub">{lvl.category}</span>
                  <h3 className="quiz-card-title-serif">{lvl.title}</h3>
                  <p className="quiz-card-subtitle-tag">{lvl.subtitle}</p>
                </div>

                {/* Mô tả ngắn cấp độ */}
                <p className="quiz-card-description">{lvl.desc}</p>

                {/* Trạng thái sao & điểm số */}
                <div className="quiz-card-status-box">
                  <div className="card-stars-row">
                    {[1, 2, 3].map((starIdx) => (
                      <Star 
                        key={starIdx} 
                        size={16} 
                        className={`star-icon ${starIdx <= starsEarned ? 'earned' : 'empty'}`}
                        fill={starIdx <= starsEarned ? '#FFD700' : 'none'}
                      />
                    ))}
                  </div>

                  <span className="card-status-label">
                    {isDone ? `Điểm cao: ${userScore}/100` : 'Sẵn sàng khiêu chiến'}
                  </span>
                </div>

                {/* Nút Tham Chiến phát sáng */}
                <button 
                  type="button" 
                  className="quiz-card-launch-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartLevel(lvl.key);
                  }}
                >
                  <Swords size={16} />
                  <span>Tham Chiến</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            );
          })}
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
            <Trophy size={64} strokeWidth={1.5} />
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
                  transition={{ duration: 0.2 }}
                >
                  <div className="explanation-title">
                    <Sparkles size={16} /> Kiểm chứng sử liệu Tây Sơn
                  </div>
                  <p className="explanation-content">{currentQ.explain || currentQ.explanation}</p>
                  
                  <div className="explanation-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleNext}
                    >
                      <span>{currentIndex + 1 < questionsList.length ? 'Câu tiếp theo' : 'Xem tổng kết điểm'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Modal hiển thị và tải Giấy Chứng Nhận */}
      <AnimatePresence>
        {showCertificateModal && (
          <motion.div 
            className="certificate-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCertificateModal(false)}
          >
            <motion.div 
              className="certificate-modal-box"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="cert-modal-close" 
                onClick={() => setShowCertificateModal(false)}
                aria-label="Đóng giấy chứng nhận"
              >
                <X size={20} />
              </button>

              <div className="cert-modal-header">
                <Award size={36} className="cert-modal-gold-icon" />
                <h3 className="cert-modal-title">GIẤY CHỨNG NHẬN VINH DANH</h3>
                <p className="cert-modal-sub">Hoàn thành xuất sắc toàn bộ 3 cấp độ Đấu trường Sử học Tây Sơn</p>
              </div>

              <div className="cert-name-input-group">
                <label htmlFor="student-name-input">Họ và tên học sinh nhận bằng:</label>
                <input 
                  id="student-name-input"
                  type="text" 
                  className="cert-name-field"
                  value={studentName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStudentName(val);
                    try {
                      localStorage.setItem('su_student_name_v2', val);
                    } catch (err) {}
                  }}
                  placeholder="Nhập họ và tên của bạn..."
                />
              </div>

              <div className="cert-preview-card">
                <div className="cert-preview-inner">
                  <span className="cert-seal-text">TRIỀU ĐẠI TÂY SƠN · VINH DANH SỬ HỌC</span>
                  <h4 className="cert-recipient-name">{studentName || 'Lê Trường Thịnh'}</h4>
                  <p className="cert-desc-text">
                    Đã hoàn thành xuất sắc 3 cấp độ khảo thí với tổng điểm <strong>{totalAllScore} / 300 điểm</strong>.
                  </p>
                  <span className="cert-badge-rank">DANH HIỆU: THỦ KHOA SỬ HỌC TÂY SƠN (XUẤT SẮC)</span>
                </div>
              </div>

              <div className="cert-modal-footer">
                <button 
                  className="btn btn-primary"
                  onClick={handleDownloadCertificate}
                >
                  <Download size={16} /> Tải Giấy Chứng Nhận (Ảnh PNG HD)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
