// Web Audio API Sound Generator for TrioSphere
// Generates synthetic sound effects on the fly to avoid external assets and keep the package size low.

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Low-overhead synth playing a double tone for transactions
export function playChimeSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Low sweet oscillator
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(261.63, now); // C4
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  } catch (e) {
    console.warn('Audio Context not allowed or supported yet', e);
  }
}

// Cash register sound simulation for payments
export function playCashRegister() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Chime bell sound
    const osc = ctx.createOscillator();
    const oscHigh = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    
    oscHigh.type = 'triangle';
    oscHigh.frequency.setValueAtTime(1567.98, now); // G6
    oscHigh.frequency.exponentialRampToValueAtTime(2093.00, now + 0.12); // C7
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    
    osc.connect(gainNode);
    oscHigh.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    oscHigh.start(now);
    osc.stop(now + 0.35);
    oscHigh.stop(now + 0.35);
  } catch (e) {
    console.warn('Audio Context warning', e);
  }
}

// Scanner beep for QR Code readings
export function playScannerBeep() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2450, now); // high pitch chirp
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.warn('Audio Context warning', e);
  }
}

// Digital keyboard typing click
export function playKeyTap() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);
    
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.03);
  } catch (e) {
    // quiet bypass
  }
}

// Active Noise Cancellation frequency (stabilizer tone on/off)
export function playStabilizerFeedback(active: boolean) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    if (active) {
      // sweep up
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
    } else {
      // sweep down
      osc.frequency.setValueAtTime(445, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
    }
    
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    // quiet bypass
  }
}

// Dial ring tone for chat calls
export function playRingTone() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, now); // standard ringtone A4
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(480, now); // combined sound
    
    gainNode.gain.setValueAtTime(0.04, now);
    gainNode.gain.setValueAtTime(0.04, now + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  } catch (e) {
    // quiet bypass
  }
}
