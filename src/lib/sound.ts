import { getUserProfile } from "./profile";

export type ChimeType = "correct" | "success" | "badge";

export function playChime(type: ChimeType) {
  if (typeof window === "undefined") return;
  
  // Check user settings
  const profile = getUserProfile();
  if (!profile.soundsEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Helper to play a single note
    const playNote = (freq: number, start: number, duration: number, volume: number = 0.1) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Use a clean, soft sine wave for a dreamy round sound
      osc.type = "sine"; 
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      // Soft attack
      gain.gain.linearRampToValueAtTime(volume, start + 0.03);
      // Soft decay
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    const now = ctx.currentTime;

    if (type === "correct") {
      // Pleasant double chime (E5 -> A5)
      playNote(659.25, now, 0.25); // E5
      playNote(880.00, now + 0.08, 0.35); // A5
    } else if (type === "success") {
      // Ascending major triad chime (C5 -> E5 -> G5 -> C6)
      playNote(523.25, now, 0.2); // C5
      playNote(659.25, now + 0.1, 0.2); // E5
      playNote(783.99, now + 0.2, 0.25); // G5
      playNote(1046.50, now + 0.3, 0.45, 0.08); // C6
    } else if (type === "badge") {
      // Dreamy, sparkling arpeggio sweep with overlapping notes
      const notes = [523.25, 659.25, 783.99, 987.77, 1318.51, 1567.98]; // C5, E5, G5, B5, E6, G6
      notes.forEach((freq, idx) => {
        playNote(freq, now + idx * 0.07, 0.8, 0.06);
      });
    }
  } catch (err) {
    console.error("Failed to play synthesized sound effect", err);
  }
}
