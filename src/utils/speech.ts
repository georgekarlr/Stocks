// Robust Voice Narration & Audio Briefing Engine

export type VoiceOption = 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr';

export interface SpeechPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  currentWordIndex: number;
  activeText: string;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let audioContext: AudioContext | null = null;
let activeSourceNode: AudioBufferSourceNode | null = null;

export function decodePCM16LE(base64Audio: string, sampleRate = 24000): AudioBuffer {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  }

  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);

  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }

  const audioBuffer = audioContext.createBuffer(1, float32Array.length, sampleRate);
  audioBuffer.copyToChannel(float32Array, 0);
  return audioBuffer;
}

export function playPCMAudio(
  audioBuffer: AudioBuffer,
  onEnd?: () => void,
  playbackRate = 1.0
): { stop: () => void } {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (activeSourceNode) {
    try {
      activeSourceNode.stop();
    } catch {}
  }

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = playbackRate;
  source.connect(audioContext.destination);

  source.onended = () => {
    onEnd?.();
  };

  source.start(0);
  activeSourceNode = source;

  return {
    stop: () => {
      try {
        source.stop();
      } catch {}
    },
  };
}

export function speakWithBrowserSynthesis({
  text,
  voiceName,
  rate = 1.0,
  pitch = 1.0,
  onStart,
  onEnd,
  onBoundary,
  onError,
}: {
  text: string;
  voiceName?: string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onBoundary?: (charIndex: number) => void;
  onError?: (err: any) => void;
}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.(new Error('Speech Synthesis not supported in this browser environment.'));
    return { stop: () => {} };
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = Math.max(0.5, Math.min(2.0, rate));
  utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (voiceName === 'Kore') {
      utterance.voice = voices.find((v) => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en')) || voices[0];
    } else if (voiceName === 'Puck') {
      utterance.voice = voices.find((v) => v.name.includes('Guy') || v.name.includes('David') || v.name.includes('Male')) || voices[0];
    } else if (voiceName === 'Fenrir') {
      utterance.voice = voices.find((v) => v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('UK')) || voices[0];
    } else {
      utterance.voice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    }
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => onError?.(e);

  if (onBoundary) {
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        onBoundary(e.charIndex);
      }
    };
  }

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    },
    pause: () => {
      window.speechSynthesis.pause();
    },
    resume: () => {
      window.speechSynthesis.resume();
    },
  };
}

export function stopAllAudioPlayback() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeSourceNode) {
    try {
      activeSourceNode.stop();
    } catch {}
    activeSourceNode = null;
  }
}
