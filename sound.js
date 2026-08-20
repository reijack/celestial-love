// Pure Web Audio API Sound Synthesizer for Celestial Effects (No external assets needed)
let audioCtx = null
let isMuted = false
let ambientInterval = null
let ambientGainNode = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function toggleMute() {
  isMuted = !isMuted
  if (isMuted && ambientGainNode) {
    ambientGainNode.gain.setValueAtTime(0, audioCtx.currentTime)
  }
  return isMuted
}

export function getMuteState() {
  return isMuted
}

// Gentle star chime arpeggio
export function playStarChime() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
  const now = ctx.currentTime

  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, now + i * 0.06)

    gain.gain.setValueAtTime(0.001, now + i * 0.06)
    gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.06 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.6)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + i * 0.06)
    osc.stop(now + i * 0.06 + 0.65)
  })
}

// Soft bubbly heart pop
export function playHeartPop() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(320 + Math.random() * 80, now)
  osc.frequency.exponentialRampToValueAtTime(740 + Math.random() * 120, now + 0.12)

  gain.gain.setValueAtTime(0.12, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.24)
}

// Romantic letter unfold celestial breeze
export function playLetterUnfold() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  const freqs = [440, 554.37, 659.25, 880, 1108.73] // A4, C#5, E5, A5, C#6
  const now = ctx.currentTime

  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, now + i * 0.08)

    gain.gain.setValueAtTime(0.001, now + i * 0.08)
    gain.gain.exponentialRampToValueAtTime(0.06, now + i * 0.08 + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.9)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + i * 0.08)
    osc.stop(now + i * 0.08 + 0.95)
  })
}

// Harmonious wish saved chime
export function playWishSavedSound() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  const freqs = [392.0, 587.33, 783.99, 1174.66] // G4, D5, G5, D6
  const now = ctx.currentTime

  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(f, now + i * 0.07)

    gain.gain.setValueAtTime(0.001, now + i * 0.07)
    gain.gain.exponentialRampToValueAtTime(0.09, now + i * 0.07 + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 1.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + i * 0.07)
    osc.stop(now + i * 0.07 + 1.15)
  })
}

// Shooting Star swoosh sound
export function playShootingStarSound() {
  if (isMuted) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, now)
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.5)

  gain.gain.setValueAtTime(0.08, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.6)
}
