// Audio System using Web Audio API to synthesize sound effects and BGM without external files
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterVolume = null;
        this.muted = false;
        
        // Procedural BGM variables
        this.bgmInterval = null;
        this.bgmStep = 0;
        this.bgmTempo = 120; // Beats per minute (BPM)
        this.isPlayingBGM = false;
    }

    init() {
        if (this.ctx) return;
        
        // Create audio context (compatible with older browsers)
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            console.warn("Web Audio API is not supported in this browser.");
            return;
        }

        try {
            this.ctx = new AudioContextClass();
            this.masterVolume = this.ctx.createGain();
            this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime); // Set default volume
            this.masterVolume.connect(this.ctx.destination);
        } catch (e) {
            console.error("Failed to initialize AudioContext:", e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(muted, gamePlaying = false) {
        this.muted = muted;
        if (this.masterVolume && this.ctx) {
            this.masterVolume.gain.setValueAtTime(muted ? 0 : 0.3, this.ctx.currentTime);
        }
        
        if (muted) {
            this.stopBGM();
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel(); // Stop talking immediately if muted
            }
        } else if (gamePlaying && this.isPlayingBGM) {
            this.startBGM();
        }
    }

    toggleMuted(gamePlaying = false) {
        this.setMuted(!this.muted, gamePlaying);
        return this.muted;
    }

    // --- TEXT-TO-SPEECH VOICE SYSTEM (Web Speech API) ---
    speak(englishText, chineseText) {
        if (this.muted) return;
        
        if (window.speechSynthesis) {
            // Cancel current speech to prevent lagging behind fast typing
            window.speechSynthesis.cancel();

            const engUtter = new SpeechSynthesisUtterance(englishText);
            engUtter.lang = 'en-US';
            engUtter.rate = 1.0;
            engUtter.volume = 0.85;

            if (chineseText) {
                const zhUtter = new SpeechSynthesisUtterance(chineseText);
                zhUtter.lang = 'zh-TW';
                zhUtter.rate = 1.1; // Speak Chinese translation slightly faster
                zhUtter.volume = 0.85;

                // Chain speech: English then Chinese
                window.speechSynthesis.speak(engUtter);
                window.speechSynthesis.speak(zhUtter);
            } else {
                window.speechSynthesis.speak(engUtter);
            }
        }
    }

    // --- PROCEDURAL CYBERPUNK BGM SYNTHESIZER ---
    startBGM() {
        this.isPlayingBGM = true;
        if (!this.ctx || this.muted) return;
        this.resume();
        
        if (this.bgmInterval) return; // Already running

        const stepTime = 60 / this.bgmTempo / 2; // Eighth note duration
        this.bgmStep = 0;

        const scheduler = () => {
            if (this.muted || !this.isPlayingBGM || this.ctx.state === 'suspended') return;
            
            const now = this.ctx.currentTime;
            
            // Cyberpunk 16-step rhythmic bass progression (C Minor)
            const bassSequence = [
                'C2', 'C2', 'Eb2', 'Eb2', 
                'G2', 'G2', 'Bb2', 'Bb2', 
                'Ab2', 'Ab2', 'G2', 'G2', 
                'F2', 'F2', 'Bb2', 'G2'
            ];
            
            const currentBassNote = bassSequence[this.bgmStep % bassSequence.length];
            const bassFreq = this.noteToFreq(currentBassNote);
            
            // Play bass note
            this.playBassNote(bassFreq, now, stepTime * 0.95);
            
            // Rhythm Hi-Hats on offbeats (every odd step)
            if (this.bgmStep % 2 === 1) {
                this.playHiHat(now);
            }
            
            // Retro Melody Arpeggio
            if (this.bgmStep % 4 === 0) {
                const leadSequence = ['C4', 'G4', 'Eb4', 'Bb4', 'C5', 'G4', 'Eb5', 'C4'];
                const leadNoteName = leadSequence[(this.bgmStep / 4) % leadSequence.length];
                this.playLeadNote(this.noteToFreq(leadNoteName), now, stepTime * 0.5);
            }
            
            this.bgmStep++;
        };

        // Run the step sequencer
        const intervalTime = stepTime * 1000;
        this.bgmInterval = setInterval(scheduler, intervalTime);
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
        if (this.muted) {
            // Keep state active but don't set isPlayingBGM to false so it resumes on unmute
        } else {
            this.isPlayingBGM = false;
        }
    }

    noteToFreq(note) {
        const notes = {
            'C2': 65.41, 'Eb2': 77.78, 'F2': 87.31, 'G2': 98.00, 'Ab2': 103.83, 'Bb2': 116.54,
            'C3': 130.81, 'Eb3': 155.56, 'G3': 196.00, 'Bb3': 233.08,
            'C4': 261.63, 'Eb4': 311.13, 'G4': 392.00, 'Bb4': 466.16,
            'C5': 523.25, 'Eb5': 622.25
        };
        return notes[note] || 261.63;
    }

    playBassNote(freq, time, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterVolume);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, time);
        filter.frequency.exponentialRampToValueAtTime(450, time + 0.03);
        filter.frequency.exponentialRampToValueAtTime(100, time + duration);

        gainNode.gain.setValueAtTime(0.08, time); 
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.start(time);
        osc.stop(time + duration);
    }

    playLeadNote(freq, time, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterVolume);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, time);

        gainNode.gain.setValueAtTime(0.02, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.start(time);
        osc.stop(time + duration);
    }

    playHiHat(time) {
        if (!this.ctx) return;
        
        const bufferSize = this.ctx.sampleRate * 0.03; 
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(8000, time);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.015, time); 
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterVolume);

        source.start(time);
        source.stop(time + 0.03);
    }

    // --- GAME SFX SYNTHESIZERS ---

    playType() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.masterVolume);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playLaser() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.masterVolume);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.22);

        gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.22);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
        
        osc.disconnect(gainNode);
        osc.connect(filter);
        filter.connect(gainNode);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
    }

    playExplosion() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const bufferSize = this.ctx.sampleRate * 0.45; 
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(15, this.ctx.currentTime + 0.45);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.45, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.45);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterVolume);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.45);
    }

    playDamage() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const now = this.ctx.currentTime;
        const duration = 0.35;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.masterVolume);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(80, now + duration);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);

        osc.disconnect(gainNode);
        osc.connect(filter);
        filter.connect(gainNode);

        gainNode.gain.setValueAtTime(0.35, now);
        gainNode.gain.linearRampToValueAtTime(0.005, now + duration);

        osc.start();
        osc.stop(now + duration);
    }

    playLevelUp() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; 
        const now = this.ctx.currentTime;
        const noteDuration = 0.08;

        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(this.masterVolume);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * noteDuration);

            gainNode.gain.setValueAtTime(0.12, now + index * noteDuration);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + index * noteDuration + 0.15);

            osc.start(now + index * noteDuration);
            osc.stop(now + index * noteDuration + 0.15);
        });
    }

    playGameOver() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const now = this.ctx.currentTime;
        const noteDuration = 0.25;
        const notes = [392.00, 329.63, 261.63, 196.00]; 

        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(this.masterVolume);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + index * noteDuration);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, now + index * noteDuration);
            
            osc.disconnect(gainNode);
            osc.connect(filter);
            filter.connect(gainNode);

            gainNode.gain.setValueAtTime(0.25, now + index * noteDuration);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + index * noteDuration + 0.45);

            osc.start(now + index * noteDuration);
            osc.stop(now + index * noteDuration + 0.45);
        });
    }
}

// Export sound engine instance
const sounds = new SoundEngine();
