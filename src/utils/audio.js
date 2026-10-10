// Quản lý âm thanh giao diện bằng Web Audio API (Không phụ thuộc file ngoài)

let audioCtx = null;
let isSoundEnabled = true;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(val) {
  isSoundEnabled = val;
}

export function getSoundEnabled() {
  return isSoundEnabled;
}

// Phát âm thanh tiếng chuông (Chime sound)
export function playChime(freq = 520, type = 'sine', duration = 0.15) {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// Âm thanh chúc mừng chiến thắng (Fanfare)
export function playVictorySound() {
  if (!isSoundEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playChime(freq, 'triangle', 0.25);
    }, idx * 120);
  });
}

// Âm thanh trả lời đúng
export function playCorrectSound() {
  playChime(750, 'sine', 0.2);
}

// Âm thanh trả lời sai
export function playWrongSound() {
  playChime(260, 'sawtooth', 0.25);
}
