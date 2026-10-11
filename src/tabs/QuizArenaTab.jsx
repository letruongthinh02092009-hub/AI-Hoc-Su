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
  Crown
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { playCorrectSound, playWrongSound, playVictorySound, playChime } from '../utils/audio';

// Hàm xáo trộn ngẫu nhiên câu hỏi và đáp án cho mỗi lượt thi
function prepareShuffledQuiz(levelKey, count = 10) {
  const rawPool = QUIZ_QUESTIONS[levelKey] || QUIZ_QUESTIONS['co-ban'] || [];
  const pool = [...rawPool];
  
  // 1. Xáo trộn toàn bộ ngân hàng câu hỏi
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // 2. Chọn ngẫu nhiên số câu hỏi (mặc định 10 câu)
  const selected = pool.slice(0, Math.min(count, pool.length));

  // 3. Đảo lộn vị trí 4 đáp án và cập nhật lại index đáp án đúng
  return selected.map((q) => {
    const qText = q.question || q.q;
    const explanationText = q.explain || q.explanation;
    const originalOptions = [...q.options];
    const correctText = originalOptions[q.correct !== undefined ? q.correct : 0];

    // Trộn ngẫu nhiên các đáp án
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

  const questionsList = activeQuestions.length > 0 ? activeQuestions : (QUIZ_QUESTIONS[level] || QUIZ_QUESTIONS['co-ban']);
  const currentQ = questionsList[currentIndex] || questionsList[0] || {};

  const handleStartLevel = (selectedLevel) => {
    playChime(650, 'sine', 0.15);
    setLevel(selectedLevel);
    const randomized = prepareShuffledQuiz(selectedLevel, 10);
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
    rankBadge = '🏆 Đại Tướng Quân Giữ Sử Tây Sơn';
  } else if (percentage >= 70) {
    rankBadge = '🎖️ Hộ Giá Đô Đốc Tây Sơn';
  } else {
    rankBadge = '📖 Dũng Sĩ Áo Vải Cần Mẫn';
  }

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
        <p className="section-subtext">Hệ thống 30 câu hỏi trắc nghiệm sử học tương tác 3 cấp độ, chinh phục bảng vàng và vinh danh danh hiệu tướng quân.</p>
        <div className="title-divider-gold"></div>
      </div>

      {!isPlaying ? (
        // Màn hình chọn cấp độ: Thẻ bài tướng lĩnh chiến trận (Game character card style)
        <div className="quiz-levels-picker">
          {/* Card 1: Khởi Khái Môn (Emerald) */}
          <motion.div 
            className="level-card character-card card-emerald" 
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
            onClick={() => handleStartLevel('co-ban')}
          >
            <div className="card-ambient-shadow shadow-emerald" aria-hidden="true" />
            <div className="holographic-sweep" aria-hidden="true" />
            
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
                10 câu hỏi nền tảng về năm sinh, quê hương, khởi nghĩa Tây Sơn Thượng Đạo và các mốc son đầu tiên.
              </p>

              {/* Combat Stats Bar */}
              <div className="card-combat-stats">
                <div className="stat-pill">
                  <span className="stat-label">Độ khó:</span>
                  <span className="stat-stars">★☆☆☆☆</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Thử thách:</span>
                  <span className="stat-num">10 Câu hỏi</span>
                </div>
              </div>
            </div>

            <div className="character-card-footer">
              <span className="level-start-btn btn-emerald-theme shimmer-cta-btn">
                Bắt đầu xuất trận <ArrowRight size={15} />
              </span>
            </div>
          </motion.div>

          {/* Card 2: Binh Pháp Khắc Địch (Gold) */}
          <motion.div 
            className="level-card character-card card-gold" 
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
            onClick={() => handleStartLevel('nang-cao')}
          >
            <div className="card-ambient-shadow shadow-gold" aria-hidden="true" />
            <div className="holographic-sweep" aria-hidden="true" />

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

              {/* Combat Stats Bar */}
              <div className="card-combat-stats">
                <div className="stat-pill">
                  <span className="stat-label">Độ khó:</span>
                  <span className="stat-stars">★★★☆☆</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Thử thách:</span>
                  <span className="stat-num">10 Câu hỏi</span>
                </div>
              </div>
            </div>

            <div className="character-card-footer">
              <span className="level-start-btn btn-gold-theme shimmer-cta-btn">
                Thử sức điều binh <ArrowRight size={15} />
              </span>
            </div>
          </motion.div>

          {/* Card 3: Kỳ Tài Vương Triều (Crimson) */}
          <motion.div 
            className="level-card character-card card-crimson" 
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
            onClick={() => handleStartLevel('chuyen-sau')}
          >
            <div className="card-ambient-shadow shadow-crimson" aria-hidden="true" />
            <div className="holographic-sweep" aria-hidden="true" />

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
                10 câu hỏi hóc búa dành cho học sinh giỏi: dòng dõi gia tộc họ Hồ, chính sách chữ Nôm, tư liệu phương Tây và y sử.
              </p>

              {/* Combat Stats Bar */}
              <div className="card-combat-stats">
                <div className="stat-pill">
                  <span className="stat-label">Độ khó:</span>
                  <span className="stat-stars">★★★★★</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Thử thách:</span>
                  <span className="stat-num">10 Câu hỏi</span>
                </div>
              </div>
            </div>

            <div className="character-card-footer">
              <span className="level-start-btn btn-crimson-theme shimmer-cta-btn">
                Chinh phục đỉnh cao <ArrowRight size={15} />
              </span>
            </div>
          </motion.div>
        </div>
      ) : isFinished ? (
        // Màn hình kết quả vinh danh
        <motion.div 
          className="quiz-result-card cyber-glass-card"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="result-trophy-icon">🏆</div>
          <h3 className="result-title-gold">Hoàn Thành Đấu Trường Tri Thức!</h3>
          <div className="result-score-tag">
            {score} / {totalPossible} Điểm ({percentage}%)
          </div>

          <div className="result-rank-box">
            <span className="rank-label">DANH HIỆU ĐƯỢC PHONG TẶNG:</span>
            <strong className="rank-title">{rankBadge}</strong>
          </div>

          <p className="result-feedback">
            {percentage >= 80 
              ? 'Tuyệt vời phi thường! Bạn am hiểu sử học thời Tây Sơn một cách xuất sắc và xứng đáng là niềm tự hào của thế hệ trẻ.'
              : 'Một hành trình khám phá rất đáng khích lệ! Hãy ghé thăm Dòng thời gian và Bảo tàng số để ôn luyện thêm và đạt điểm số tối đa nhé!'}
          </p>

          <div className="result-action-buttons">
            <button 
              className="btn btn-primary shimmer-cta-btn"
              onClick={() => handleStartLevel(level)}
            >
              <RotateCcw size={16} /> Chơi lại màn này
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsPlaying(false)}
            >
              Chọn cấp độ khác
            </button>
          </div>
        </motion.div>
      ) : (
        // Màn hình chơi Quiz
        <div className="quiz-play-box cyber-glass-card">
          {/* Header Score & Streak */}
          <div className="quiz-header-bar">
            <div className="quiz-progress-text">
              Câu hỏi: <strong>{currentIndex + 1} / {questionsList.length}</strong>
            </div>

            <div className="quiz-stats-group">
              <span className="quiz-score-pill">⭐ Điểm: {score}</span>
              <span className={`quiz-streak-pill ${streak > 1 ? 'fire-streak' : ''}`}>
                <Flame size={14} /> Chuỗi: {streak}
              </span>
            </div>
          </div>

          {/* Glowing Laser Progress line */}
          <div className="quiz-progress-line-bg">
            <motion.div 
              className="quiz-progress-line-fill" 
              initial={false}
              animate={{ width: `${((currentIndex + 1) / questionsList.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="quiz-question-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
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

              {/* Giải thích sử liệu chuyên sâu sau khi chọn */}
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

              {/* Nút chuyển câu tiếp theo */}
              {isAnswered && (
                <div className="quiz-action-next-wrap">
                  <button className="btn btn-primary next-btn shimmer-cta-btn" onClick={handleNext}>
                    {currentIndex + 1 < questionsList.length ? (
                      <>Câu tiếp theo <ArrowRight size={16} /></>
                    ) : (
                      <>Xem tổng kết điểm số 🏆</>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
