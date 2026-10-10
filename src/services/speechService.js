// Hệ thống Thuyết minh Giọng nói Tiếng Việt Chuẩn (Web Speech API thuần, chống lỗi Garbage Collection)

let listeners = [];
let isCurrentlySpeaking = false;

function notifyListeners(speaking) {
  isCurrentlySpeaking = speaking;
  listeners.forEach(cb => {
    try { cb(speaking); } catch (e) {}
  });
}

export function subscribeSpeechStatus(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}

export function getIsSpeaking() {
  return isCurrentlySpeaking;
}

// Lấy danh sách giọng đọc tiếng Việt của hệ thống
function getBestVietnameseVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  
  // Tìm kiếm theo các tiêu chí ưu tiên giọng tiếng Việt
  const viVoice = voices.find(v => 
    v.lang === 'vi-VN' || 
    v.lang === 'vi_VN' || 
    v.lang.toLowerCase().startsWith('vi') || 
    v.name.toLowerCase().includes('vietnam') || 
    v.name.toLowerCase().includes('tiếng việt') ||
    v.name.toLowerCase().includes('hoaimy') ||
    v.name.toLowerCase().includes('namminh') ||
    v.name.toLowerCase().includes('an')
  );
  
  return viVoice || null;
}

// Khởi tạo giọng đọc khi trình duyệt sẵn sàng
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getBestVietnameseVoice();
  };
}

// Dừng giọng đọc ngay lập tức
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      if (window.__activeUtterance) {
        window.__activeUtterance.onend = null;
        window.__activeUtterance.onerror = null;
        window.__activeUtterance = null;
      }
    } catch (e) {}
  }
  notifyListeners(false);
}

// Phát thuyết minh văn bản tiếng Việt
export function speakText(rawText, onEndCallback = null) {
  stopSpeech();

  if (!rawText || typeof rawText !== 'string') return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Trình duyệt không hỗ trợ Web Speech API.');
    return;
  }

  // Làm sạch văn bản khỏi ký tự markdown
  const text = rawText
    .replace(/[#*`_~]/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return;

  try {
    // Luôn cancel hàng đợi cũ trước khi kích hoạt
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Gán tham chiếu toàn cục để tránh bị Chromium Garbage Collection hủy ngầm
    window.__activeUtterance = utterance;

    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Tốc độ đĩnh đạc, rõ ràng
    utterance.pitch = 1.0;

    const viVoice = getBestVietnameseVoice();
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onstart = () => {
      notifyListeners(true);
    };

    utterance.onend = () => {
      window.__activeUtterance = null;
      notifyListeners(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (event) => {
      console.warn('SpeechSynthesis event error:', event);
      window.__activeUtterance = null;
      notifyListeners(false);
      if (onEndCallback) onEndCallback();
    };

    // Đảm bảo không bị treo trạng thái pause
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    notifyListeners(true);
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Lỗi khi kích hoạt giọng đọc:', err);
    notifyListeners(false);
  }
}
