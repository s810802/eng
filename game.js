// WordStorm Game Engine

// Screen and Viewport Constants
const VIRTUAL_WIDTH = 800;
const VIRTUAL_HEIGHT = 600;

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game States
        this.state = 'START'; // START, PLAYING, PAUSED, GAMEOVER
        this.score = 0;
        this.level = 1;
        this.shields = 10;
        this.maxShields = 10;
        
        // Entity Pools
        this.words = [];
        this.lasers = [];
        this.particles = [];
        this.stars = [];
        this.floatingTexts = [];
        
        // Typing/Targeting State
        this.targetWord = null;
        
        // Spawn Timers
        this.lastSpawnTime = 0;
        this.spawnCooldown = 3000; // Starting cooldown (ms)
        
        // Juiciness / Visual FX
        this.shakeTime = 0;
        this.shakeIntensity = 0;
        this.damageFlashTime = 0;
        
        // DOM Elements
        this.dom = {
            hud: document.getElementById('hud'),
            level: document.getElementById('hud-level'),
            score: document.getElementById('hud-score'),
            shieldBar: document.getElementById('shield-bar-fill'),
            shieldVal: document.getElementById('hud-shield-val'),
            miniControls: document.getElementById('mini-controls'),
            btnSound: document.getElementById('btn-sound'),
            soundIcon: document.getElementById('sound-icon'),
            
            // Screens
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            
            // Buttons
            btnStart: document.getElementById('btn-start'),
            btnRestart: document.getElementById('btn-restart'),
            btnResume: document.getElementById('btn-resume'),
            btnPauseRestart: document.getElementById('btn-pause-restart'),
            
            // Final results
            finalScore: document.getElementById('final-score'),
            finalLevel: document.getElementById('final-level')
        };
        
        // Turret coordinates
        this.turret = {
            x: VIRTUAL_WIDTH / 2,
            y: VIRTUAL_HEIGHT - 35,
            angle: -Math.PI / 2,
            targetAngle: -Math.PI / 2,
            length: 45,
            width: 14
        };

        this.init();
    }

    init() {
        // Init Event Listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
        
        // Keyboard Listener
        window.addEventListener('keydown', (e) => this.handleInput(e));
        
        // Button Clicks
        this.dom.btnStart.addEventListener('click', () => this.startGame());
        this.dom.btnRestart.addEventListener('click', () => this.startGame());
        this.dom.btnResume.addEventListener('click', () => this.resumeGame());
        this.dom.btnPauseRestart.addEventListener('click', () => this.startGame());
        
        this.dom.btnSound.addEventListener('click', () => this.toggleMute());
        
        // Populate Background Stars
        this.initStars();
        
        // Start RequestAnimationFrame loop
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    resizeCanvas() {
        const container = document.getElementById('game-container');
        const rect = container.getBoundingClientRect();
        
        // Set canvas internal resolution to match container visual size
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * VIRTUAL_WIDTH,
                y: Math.random() * VIRTUAL_HEIGHT,
                speed: 0.2 + Math.random() * 0.8,
                size: 0.5 + Math.random() * 1.5,
                alpha: 0.2 + Math.random() * 0.8
            });
        }
    }

    // Toggle mute and update button icon
    toggleMute() {
        sounds.init();
        const isPlaying = (this.state === 'PLAYING');
        const isMuted = sounds.toggleMuted(isPlaying);
        
        if (isMuted) {
            this.dom.btnSound.classList.add('muted');
            // Mute Icon Path
            this.dom.soundIcon.innerHTML = `<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5A1.5 1.5 0 003 9v6a1.5 1.5 0 001.5 1.5h2l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />`;
        } else {
            this.dom.btnSound.classList.remove('muted');
            // Sound Icon Path
            this.dom.soundIcon.innerHTML = `<path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5A1.5 1.5 0 003 9v6a1.5 1.5 0 001.5 1.5h2l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.57 17.47a.75.75 0 11-1.06-1.06 5.25 5.25 0 000-7.42.75.75 0 111.06-1.06 6.75 6.75 0 010 9.54z" /><path d="M21.3 20.2a.75.75 0 11-1.06-1.06 9.122 9.122 0 000-12.28.75.75 0 111.06-1.06 10.622 10.622 0 010 14.4z" />`;
        }
    }

    startGame() {
        sounds.init();
        sounds.resume();
        
        // Reset States
        this.score = 0;
        this.level = 1;
        this.shields = 10;
        this.words = [];
        this.lasers = [];
        this.particles = [];
        this.floatingTexts = [];
        this.targetWord = null;
        this.spawnCooldown = 3000;
        this.lastSpawnTime = performance.now();
        
        // UI Updates
        this.updateHUD();
        this.dom.hud.classList.remove('hidden');
        this.dom.miniControls.classList.remove('hidden');
        
        // Hide Overlays
        this.dom.startScreen.classList.add('hidden');
        this.dom.gameOverScreen.classList.add('hidden');
        this.dom.pauseScreen.classList.add('hidden');
        
        this.state = 'PLAYING';
        sounds.startBGM();
    }

    pauseGame() {
        if (this.state !== 'PLAYING') return;
        this.state = 'PAUSED';
        this.dom.pauseScreen.classList.remove('hidden');
        sounds.stopBGM();
    }

    resumeGame() {
        if (this.state !== 'PAUSED') return;
        sounds.resume();
        this.state = 'PLAYING';
        this.dom.pauseScreen.classList.add('hidden');
        sounds.startBGM();
    }

    gameOver() {
        this.state = 'GAMEOVER';
        sounds.stopBGM();
        sounds.playGameOver();
        
        // Update Game Over info
        this.dom.finalScore.textContent = this.score.toLocaleString();
        this.dom.finalLevel.textContent = this.level.toString().padStart(2, '0');
        
        // Switch Overlays
        this.dom.hud.classList.add('hidden');
        this.dom.gameOverScreen.classList.remove('hidden');
    }

    updateHUD() {
        this.dom.score.textContent = this.score.toLocaleString();
        this.dom.level.textContent = this.level.toString().padStart(2, '0');
        this.dom.shieldVal.textContent = `${this.shields} / ${this.maxShields}`;
        
        // Shield Bar Width
        const pct = (this.shields / this.maxShields) * 100;
        this.dom.shieldBar.style.width = `${pct}%`;
        
        // Color alert classes based on shield health
        if (this.shields <= 3) {
            this.dom.shieldVal.style.color = 'var(--neon-red)';
            this.dom.shieldBar.style.boxShadow = '0 0 8px var(--neon-red)';
        } else if (this.shields <= 6) {
            this.dom.shieldVal.style.color = 'var(--neon-yellow)';
            this.dom.shieldBar.style.boxShadow = '0 0 8px var(--neon-yellow)';
        } else {
            this.dom.shieldVal.style.color = 'var(--neon-green)';
            this.dom.shieldBar.style.boxShadow = '0 0 8px var(--neon-green)';
        }
    }

    handleInput(e) {
        // Toggle Pause
        if (e.key === 'Escape') {
            if (this.state === 'PLAYING') {
                this.pauseGame();
            } else if (this.state === 'PAUSED') {
                this.resumeGame();
            }
            return;
        }

        if (this.state !== 'PLAYING') return;

        // Verify it is a single-letter English keyboard key (case insensitive)
        const key = e.key.toLowerCase();
        if (key.length !== 1 || key < 'a' || key > 'z') return;

        sounds.init();

        // 1. If we don't have a targeted word, search for a matching first letter
        if (!this.targetWord) {
            let potentialTargets = this.words.filter(word => word.text[0] === key);
            
            if (potentialTargets.length > 0) {
                // Lock target closest to the bottom (max Y)
                potentialTargets.sort((a, b) => b.y - a.y);
                this.targetWord = potentialTargets[0];
                this.targetWord.activeCharIndex = 1;
                this.targetWord.isTarget = true;
                
                sounds.playType();
                
                // If it is a 1-letter word (shouldn't happen with our database but just in case)
                this.checkWordCompletion();
            } else {
                // Key pressed but no starting word matching it. Trigger tiny shake.
                this.triggerShake(3, 100);
            }
        } 
        // 2. If we already have a locked target, verify next letter
        else {
            const expectedChar = this.targetWord.text[this.targetWord.activeCharIndex];
            
            if (key === expectedChar) {
                this.targetWord.activeCharIndex++;
                sounds.playType();
                this.checkWordCompletion();
            } else {
                // Typo trigger: shake target word locally
                this.targetWord.errorTime = 10; // Number of frames to draw red warning border
                this.triggerShake(4, 120);
            }
        }
    }

    checkWordCompletion() {
        if (this.targetWord.activeCharIndex >= this.targetWord.text.length) {
            const word = this.targetWord;
            this.targetWord = null;
            
            // Turn turret towards target center
            this.turret.targetAngle = Math.atan2(word.y - this.turret.y, word.x - this.turret.x);
            
            // Firing visual laser
            this.lasers.push({
                startX: this.turret.x + Math.cos(this.turret.targetAngle) * this.turret.length,
                startY: this.turret.y + Math.sin(this.turret.targetAngle) * this.turret.length,
                endX: word.x,
                endY: word.y,
                life: 12, // frames
                maxLife: 12,
                color: word.color
            });

            // Speak pronunciation and Chinese translation
            const translation = getTranslationForWord(word.text);
            sounds.speak(word.text, translation);

            // Spawn floating text showing word and translation
            this.floatingTexts.push({
                x: word.x,
                y: word.y - 15,
                text: `${word.text.toUpperCase()} : ${translation}`,
                color: word.color,
                alpha: 1.0,
                vy: -0.8
            });

            // Play fire sound & explosion
            sounds.playLaser();
            
            // Small delay for explosion to sync with laser travel
            setTimeout(() => {
                sounds.playExplosion();
                this.spawnParticles(word.x, word.y, 25, word.color);
                this.triggerShake(8, 200);
            }, 50);

            // Add points (equal to word length)
            const pts = word.text.length;
            this.score += pts;
            
            // Check Level Progression
            const newLevel = Math.floor(this.score / 35) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                sounds.playLevelUp();
                this.spawnLevelUpParticles();
            }
            
            // Remove word from pool
            this.words = this.words.filter(w => w !== word);
            
            this.updateHUD();
        }
    }

    spawnParticles(x, y, count, primaryColor) {
        const colors = [primaryColor, '#ffffff', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.4)'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (Math.random() * 2), // slightly drift upward
                size: 2 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1.0,
                decay: 0.015 + Math.random() * 0.02
            });
        }
    }

    spawnLevelUpParticles() {
        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: Math.random() * VIRTUAL_WIDTH,
                y: VIRTUAL_HEIGHT - 50,
                vx: (Math.random() - 0.5) * 4,
                vy: -3 - Math.random() * 7,
                size: 3 + Math.random() * 5,
                color: 'var(--neon-yellow)',
                alpha: 1.0,
                decay: 0.01 + Math.random() * 0.01
            });
        }
    }

    triggerShake(intensity, durationMs) {
        this.shakeIntensity = intensity;
        this.shakeTime = durationMs / 16.67; // convert ms to approximate frames
    }

    spawnWord() {
        const wordText = getRandomWordForLevel(this.level);
        
        // Select an X lane to prevent overlapping spawns
        let x = 60 + Math.random() * (VIRTUAL_WIDTH - 180);
        
        // Check overlap with existing words at the top
        let safeSpawn = false;
        let retries = 0;
        while (!safeSpawn && retries < 5) {
            safeSpawn = true;
            for (let w of this.words) {
                if (w.y < 80 && Math.abs(w.x - x) < 100) {
                    x = 60 + Math.random() * (VIRTUAL_WIDTH - 180);
                    safeSpawn = false;
                    break;
                }
            }
            retries++;
        }

        // Falling Speed scales with level
        const baseSpeed = 0.5;
        const levelMultiplier = 0.12;
        const speed = baseSpeed + (this.level - 1) * levelMultiplier + (Math.random() * 0.2);

        // Cyberpunk color themes for capsules
        const colors = [
            '#00ff66', // neon green
            '#00f0ff', // neon cyan
            '#ff0055', // neon pink/red
            '#ffea00', // neon yellow
            '#ff00ff', // neon magenta
            '#ff9900', // neon orange
            '#bd00ff'  // neon purple
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        this.words.push({
            text: wordText,
            x: x,
            y: -30,
            speed: speed,
            activeCharIndex: 0,
            isTarget: false,
            errorTime: 0,
            color: randomColor
        });
    }

    update(dt) {
        if (this.state !== 'PLAYING') {
            // Keep background elements animting slowly
            this.updateStars();
            this.updateParticles();
            return;
        }

        // Update Background Stars
        this.updateStars();

        // Screen shakes decrement
        if (this.shakeTime > 0) this.shakeTime--;
        
        // Damage Flash decrement
        if (this.damageFlashTime > 0) this.damageFlashTime -= 16.67; // in ms

        // Update Laser visual timers
        this.lasers.forEach(laser => {
            laser.life--;
        });
        this.lasers = this.lasers.filter(laser => laser.life > 0);

        // Update Particles physics
        this.updateParticles();

        // Update Floating Texts
        this.floatingTexts.forEach(ft => {
            ft.y += ft.vy;
            ft.alpha -= 0.015;
        });
        this.floatingTexts = this.floatingTexts.filter(ft => ft.alpha > 0);

        // Turret rotation interpolating towards targeted word
        if (this.targetWord) {
            const dx = this.targetWord.x - this.turret.x;
            const dy = this.targetWord.y - this.turret.y;
            this.turret.targetAngle = Math.atan2(dy, dx);
        } else {
            this.turret.targetAngle = -Math.PI / 2;
        }
        
        // Smooth rotation angle interpolation
        const diff = this.turret.targetAngle - this.turret.angle;
        this.turret.angle += diff * 0.25;

        // Spawn Words Timer
        const now = performance.now();
        // Spawning frequency scales up with levels
        const currentCooldown = Math.max(1200, 3200 - (this.level - 1) * 350);
        // Gradually increase maximum allowed concurrent words based on level (starts at 2 words max)
        const maxWordsOnScreen = Math.min(6, this.level + 1);
        if (now - this.lastSpawnTime > currentCooldown && this.words.length < maxWordsOnScreen) {
            this.spawnWord();
            this.lastSpawnTime = now;
        }

        // Update Word Positions and check boundary conditions
        for (let i = this.words.length - 1; i >= 0; i--) {
            const word = this.words[i];
            word.y += word.speed;
            
            // Decement error shake frame counter
            if (word.errorTime > 0) word.errorTime--;

            // If word escapes (reaches bottom)
            if (word.y >= VIRTUAL_HEIGHT - 65) {
                // Deduct 1 shield, and deduct score point
                this.shields--;
                this.score = Math.max(0, this.score - 1); // Deduct 1 pt, limit to 0
                
                sounds.playDamage();
                this.damageFlashTime = 250; // flash red for 250ms
                this.triggerShake(12, 300);
                
                // If it was the targeted word, reset target
                if (word === this.targetWord) {
                    this.targetWord = null;
                }

                // Remove word
                this.words.splice(i, 1);
                this.updateHUD();

                if (this.shields <= 0) {
                    this.gameOver();
                    break;
                }
            }
        }
    }

    updateStars() {
        this.stars.forEach(star => {
            star.y += star.speed * (this.state === 'PLAYING' ? 1.5 : 0.5);
            if (star.y > VIRTUAL_HEIGHT) {
                star.y = 0;
                star.x = Math.random() * VIRTUAL_WIDTH;
            }
        });
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
        });
        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    render() {
        const ctx = this.ctx;
        
        // Reset scale and clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.save();
        
        // Screen Shake Translate
        if (this.shakeTime > 0) {
            const dx = (Math.random() - 0.5) * this.shakeIntensity;
            const dy = (Math.random() - 0.5) * this.shakeIntensity;
            ctx.translate(dx, dy);
        }
        
        // Scaling to virtual coordinate space
        const scaleX = this.canvas.width / VIRTUAL_WIDTH;
        const scaleY = this.canvas.height / VIRTUAL_HEIGHT;
        ctx.scale(scaleX, scaleY);

        // 1. Draw Starfield Background
        ctx.fillStyle = '#06050b';
        ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
        
        this.stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw grid lines for techno effect
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
        ctx.lineWidth = 1;
        const gridSpacing = 40;
        for (let x = 0; x < VIRTUAL_WIDTH; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, VIRTUAL_HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y < VIRTUAL_HEIGHT; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(VIRTUAL_WIDTH, y);
            ctx.stroke();
        }

        // 2. Draw Lasers Fired
        ctx.save();
        this.lasers.forEach(laser => {
            const alpha = laser.life / laser.maxLife;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = laser.color || 'var(--neon-blue)';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 15;
            ctx.shadowColor = laser.color || 'var(--neon-blue)';
            
            ctx.beginPath();
            ctx.moveTo(laser.startX, laser.startY);
            ctx.lineTo(laser.endX, laser.endY);
            ctx.stroke();
            
            // Core White Line
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(laser.startX, laser.startY);
            ctx.lineTo(laser.endX, laser.endY);
            ctx.stroke();
        });
        ctx.restore();
        
        // Reset Shadow parameters
        ctx.shadowBlur = 0;

        // 3. Draw Exploding Particles
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 5;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        // Draw Floating Texts (Chinese Translations)
        ctx.save();
        this.floatingTexts.forEach(ft => {
            ctx.fillStyle = ft.color || '#ffffff';
            ctx.globalAlpha = ft.alpha;
            ctx.shadowBlur = 6;
            ctx.shadowColor = ft.color || '#ffffff';
            ctx.font = 'bold 17px "Orbitron", "Outfit", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
        });
        ctx.restore();

        // 4. Draw Defensive Base line (Danger zone)
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(0, VIRTUAL_HEIGHT - 65);
        ctx.lineTo(VIRTUAL_WIDTH, VIRTUAL_HEIGHT - 65);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // 5. Draw Words
        this.words.forEach(word => {
            ctx.font = 'bold 18px "Orbitron", "Outfit", sans-serif';
            ctx.textBaseline = 'middle';
            
            const textWidth = ctx.measureText(word.text).width;
            const padX = 14;
            const padY = 8;
            const capWidth = textWidth + padX * 2;
            const capHeight = 18 + padY * 2;
            const rx = word.x - capWidth / 2;
            const ry = word.y - capHeight / 2;

            // Draw glowing Capsule border
            ctx.save();
            ctx.fillStyle = 'rgba(10, 8, 20, 0.85)';
            ctx.lineWidth = word.isTarget ? 2 : 1;
            
            // Choose border color based on status
            if (word.errorTime > 0) {
                ctx.strokeStyle = 'var(--neon-red)';
                ctx.shadowColor = 'var(--neon-red)';
                ctx.shadowBlur = 8;
            } else if (word.isTarget) {
                ctx.strokeStyle = word.color;
                ctx.shadowColor = word.color;
                ctx.shadowBlur = 8;
            } else {
                ctx.strokeStyle = word.color;
                ctx.shadowColor = word.color;
                ctx.shadowBlur = 3;
            }

            // Draw Capsule Rounded Rect
            ctx.beginPath();
            ctx.roundRect(rx, ry, capWidth, capHeight, 6);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Target Crosshair / Reticle for locked targets
            if (word.isTarget) {
                ctx.strokeStyle = word.color;
                ctx.lineWidth = 1;
                
                // Crosshair circle
                ctx.beginPath();
                ctx.arc(word.x, word.y, capHeight, 0, Math.PI * 2);
                ctx.stroke();
                
                // Reticle corners
                const retSize = 6;
                ctx.strokeStyle = word.color;
                ctx.lineWidth = 1.5;
                
                // Top Left
                ctx.beginPath();
                ctx.moveTo(rx - 4, ry + retSize - 4);
                ctx.lineTo(rx - 4, ry - 4);
                ctx.lineTo(rx + retSize - 4, ry - 4);
                ctx.stroke();
                
                // Top Right
                ctx.beginPath();
                ctx.moveTo(rx + capWidth + 4 - retSize, ry - 4);
                ctx.lineTo(rx + capWidth + 4, ry - 4);
                ctx.lineTo(rx + capWidth + 4, ry + retSize - 4);
                ctx.stroke();
                
                // Bottom Left
                ctx.beginPath();
                ctx.moveTo(rx - 4, ry + capHeight + 4 - retSize);
                ctx.lineTo(rx - 4, ry + capHeight + 4);
                ctx.lineTo(rx + retSize - 4, ry + capHeight + 4);
                ctx.stroke();
                
                // Bottom Right
                ctx.beginPath();
                ctx.moveTo(rx + capWidth + 4 - retSize, ry + capHeight + 4);
                ctx.lineTo(rx + capWidth + 4, ry + capHeight + 4);
                ctx.lineTo(rx + capWidth + 4, ry + capHeight + 4 - retSize);
                ctx.stroke();
            }

            // Draw Text (split into typed and untyped letters)
            const typedText = word.text.substring(0, word.activeCharIndex);
            const untypedText = word.text.substring(word.activeCharIndex);
            
            const typedWidth = ctx.measureText(typedText).width;
            const startDrawX = word.x - textWidth / 2;

            // Draw typed characters (neon color)
            if (typedText) {
                ctx.fillStyle = word.color;
                ctx.shadowColor = word.color;
                ctx.shadowBlur = 4;
                ctx.fillText(typedText, startDrawX, word.y);
            }

            // Draw untyped characters (white or gray)
            if (untypedText) {
                ctx.fillStyle = word.isTarget ? '#ffffff' : 'rgba(255, 255, 255, 0.75)';
                ctx.shadowBlur = 0;
                ctx.fillText(untypedText, startDrawX + typedWidth, word.y);
            }
            
            // Clean up shadows
            ctx.shadowBlur = 0;
        });

        // 6. Draw Player Turret Cockpit at Bottom Center
        ctx.save();
        ctx.translate(this.turret.x, this.turret.y);
        ctx.rotate(this.turret.angle + Math.PI / 2); // default rotation offset correction

        // Draw turret barrel (neon cyan)
        ctx.fillStyle = 'rgba(10, 8, 20, 0.9)';
        ctx.strokeStyle = 'var(--neon-blue)';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'var(--neon-blue)';
        
        ctx.beginPath();
        ctx.roundRect(-this.turret.width / 2, -this.turret.length, this.turret.width, this.turret.length, 3);
        ctx.fill();
        ctx.stroke();
        
        // Barrel detail line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, -this.turret.length + 5);
        ctx.stroke();
        
        ctx.restore(); // Restore from barrel rotation
        
        // Draw Turret Base (dome)
        ctx.save();
        ctx.translate(this.turret.x, this.turret.y);
        ctx.beginPath();
        ctx.arc(0, 0, 22, Math.PI, 0); // half circle dome
        ctx.fillStyle = '#0f0c1b';
        ctx.strokeStyle = 'var(--neon-blue)';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'var(--neon-blue)';
        ctx.fill();
        ctx.stroke();
        
        // Base core gem
        ctx.beginPath();
        ctx.arc(0, -4, 6, 0, Math.PI * 2);
        ctx.fillStyle = this.targetWord ? this.targetWord.color : 'var(--neon-blue)';
        ctx.shadowColor = this.targetWord ? this.targetWord.color : 'var(--neon-blue)';
        ctx.fill();
        
        ctx.restore();

        // 7. Draw Red damage flash overlay
        if (this.damageFlashTime > 0) {
            const alpha = (this.damageFlashTime / 250) * 0.25; // max 25% opacity
            ctx.fillStyle = `rgba(255, 0, 85, ${alpha})`;
            ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
        }

        ctx.restore(); // Restore from shake translation
    }

    loop(time) {
        const dt = time - this.lastTime;
        this.lastTime = time;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }
}

// Instantiate game after scripts are loaded
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new Game();
});
