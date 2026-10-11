/**
 * battleSound.js - Bộ tổng hợp âm thanh hào khí Tây Sơn bằng Web Audio API
 * Tự động tạo âm thanh trống trận trầm hùng và tiếng kiếm khí mở cổng không cần tải file ngoài.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Phát hồi trống trận Tây Sơn trầm hùng (War Drum Beat)
 */
export function playWarDrum() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Tạo 3 nhịp trống dồn (Thùng... Thùng... Thùng rền!)
    const beats = [0, 0.28, 0.58];
    beats.forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Nhịp cuối trầm và vang hơn
      const startFreq = idx === 2 ? 110 : 95;
      const endFreq = idx === 2 ? 38 : 45;
      
      osc.frequency.setValueAtTime(startFreq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + delay + 0.35);

      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.linearRampToValueAtTime(0.7, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.52);
    });
  } catch (err) {
    console.warn('Web Audio playback error:', err);
  }
}

/**
 * Phát hiệu ứng kiếm khí / mở cổng đại bản doanh (Gate Opening Swell)
 */
export function playGateOpenSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Tiếng trống đại rền vang
    playWarDrum();

    // 2. Tiếng phong thanh & kim khí hòa quyện (Wind/Resonance Swell)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  } catch (err) {
    console.warn('Web Audio playback error:', err);
  }
}
