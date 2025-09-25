/* =====================================
   🎵 FRANKPORT MUSIC EXPERIENCE
   Professional Audio Player
   ===================================== */

class FrankPortMusicExperience {
    constructor() {
        // Core Configuration
        this.config = {
            triggerTime: 15000,
            triggerScroll: 25,
            fadeInDuration: 800,
            volumeDefault: 0.7,
            crossfadeDuration: 2000,
            analytics: true
        };

        // Audio Library with proper metadata
        this.audioLibrary = {
            'calm-focus': [
                { 
                    title: 'Peaceful Coding', 
                    artist: 'FrankPort Sessions',
                    file: 'assets/audio/calm-focus-1.mp3', 
                    duration: 180,
                    image: 'assets/images/calm-focus.jpg'
                },
                { 
                    title: 'Soft Ambience', 
                    artist: 'FrankPort Sessions',
                    file: 'assets/audio/calm-focus-2.mp3', 
                    duration: 165,
                    image: 'assets/images/calm-focus.jpg'
                }
            ],
            'energetic-beats': [
                { 
                    title: 'Synthwave Drive', 
                    artist: 'FrankPort Beats',
                    file: 'assets/audio/energetic-1.mp3', 
                    duration: 170,
                    image: 'assets/images/energetic.jpg'
                },
                { 
                    title: 'Digital Pulse', 
                    artist: 'FrankPort Beats',
                    file: 'assets/audio/energetic-2.mp3', 
                    duration: 155,
                    image: 'assets/images/energetic.jpg'
                }
            ],
            'ambient-hacker': [
                { 
                    title: 'Dark Terminal', 
                    artist: 'FrankPort Ambient',
                    file: 'assets/audio/ambient-1.mp3', 
                    duration: 200,
                    image: 'assets/images/ambient.jpg'
                },
                { 
                    title: 'Cyber Space', 
                    artist: 'FrankPort Ambient',
                    file: 'assets/audio/ambient-2.mp3', 
                    duration: 175,
                    image: 'assets/images/ambient.jpg'
                }
            ]
        };

        // Player State
        this.state = {
            initialized: false,
            cardVisible: false,
            isPlaying: false,
            currentMood: null,
            currentTrack: 0,
            volume: this.config.volumeDefault,
            playbackRate: 1.0,
            isMinimized: false,
            isMobile: window.innerWidth <= 480,
            userInteracted: false,
            isShuffled: false,
            isRepeating: false,
            isLiked: false,
            currentTime: 0,
            duration: 0,
            comments: []
        };

        // Audio Management
        this.audioContext = null;
        this.currentAudio = null;
        this.gainNode = null;
        this.elements = {};

        // Trigger System
        this.triggerData = {
            timeOnSite: 0,
            scrollDepth: 0,
            triggered: false
        };

        // Analytics
        this.analytics = {
            events: [],
            sessionId: this.generateSessionId()
        };

        // Bind methods
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
    }

    /* =====================================
       🎮 INITIALIZATION
       ===================================== */

    async init() {
        if (this.state.initialized) return;
        
        try {
            await this.setupAudioContext();
            this.createStyles();
            this.setupEventListeners();
            this.loadUserPreferences();
            this.startTriggerTracking();
            
            this.state.initialized = true;
            this.trackAnalytics('system_initialized');
            
            console.log('FrankPort Music Experience initialized');
        } catch (error) {
            console.error('FrankPort Music initialization failed:', error);
        }
    }

    async setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.state.volume;
        } catch (error) {
            console.warn('Web Audio API not supported, using HTML5 audio');
        }
    }

    createStyles() {
        if (document.getElementById('frankport-music-styles')) return;

        const styles = `
            <style id="frankport-music-styles">
                .frankport-music-card {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 380px;
                    background: rgba(20, 20, 30, 0.98);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: #ffffff;
                    opacity: 0;
                    transform: translateY(100px) scale(0.95);
                    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden;
                }

                .frankport-music-card.visible {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .frankport-music-card.minimized {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    overflow: hidden;
                }

                .music-card-header {
                    padding: 24px 24px 20px;
                    background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%);
                    position: relative;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .music-card-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    background: linear-gradient(45deg, #00d4ff, #00ff88);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.5px;
                }

                .music-card-subtitle {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    font-weight: 400;
                }

                .music-close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: rgba(255, 255, 255, 0.8);
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: 300;
                }

                .music-close-btn:hover {
                    background: rgba(255, 71, 87, 0.2);
                    color: #ff4757;
                    transform: scale(1.1);
                }

                .music-mood-selector {
                    padding: 24px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .mood-button {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 16px;
                    padding: 20px 16px;
                    color: #ffffff;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    font-size: 13px;
                    font-weight: 500;
                    position: relative;
                    overflow: hidden;
                }

                .mood-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.5s ease;
                }

                .mood-button:hover::before {
                    left: 100%;
                }

                .mood-button:hover {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(0, 212, 255, 0.5);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.15);
                }

                .mood-button.active {
                    background: linear-gradient(135deg, rgba(0, 212, 255, 0.25), rgba(0, 255, 136, 0.25));
                    border-color: rgba(0, 212, 255, 0.8);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
                }

                .mood-icon {
                    width: 32px;
                    height: 32px;
                    margin: 0 auto 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }

                .music-player {
                    padding: 24px;
                    display: none;
                }

                .music-player.active {
                    display: block;
                }

                .track-artwork {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 20px;
                    border-radius: 16px;
                    overflow: hidden;
                    position: relative;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }

                .track-artwork img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .track-artwork-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 24px;
                }

                .track-info {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .track-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 6px 0;
                    color: #ffffff;
                    letter-spacing: -0.3px;
                }

                .track-artist {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    font-weight: 400;
                }

                .progress-container {
                    margin: 20px 0;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #00d4ff 0%, #00ff88 100%);
                    border-radius: 4px;
                    width: 0%;
                    transition: width 0.1s ease;
                    position: relative;
                }

                .progress-fill::after {
                    content: '';
                    position: absolute;
                    right: -6px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 12px;
                    height: 12px;
                    background: #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .progress-time {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    margin-top: 8px;
                    font-weight: 500;
                }

                .main-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    margin: 24px 0;
                }

                .control-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    color: #ffffff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 16px;
                    position: relative;
                    backdrop-filter: blur(10px);
                }

                .control-btn svg {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                }

                .control-btn.play-pause {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #00d4ff, #00ff88);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
                }

                .control-btn.play-pause svg {
                    width: 28px;
                    height: 28px;
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .control-btn.play-pause:hover {
                    box-shadow: 0 12px 35px rgba(0, 212, 255, 0.6);
                    transform: scale(1.05);
                }

                .control-btn:active {
                    transform: scale(0.95);
                }

                .secondary-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 20px 0;
                    padding: 16px 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .volume-control {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                    max-width: 120px;
                }

                .volume-icon {
                    color: rgba(255, 255, 255, 0.7);
                    width: 16px;
                    height: 16px;
                }

                .volume-slider {
                    flex: 1;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    outline: none;
                    cursor: pointer;
                    -webkit-appearance: none;
                    appearance: none;
                }

                .volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #00d4ff, #00ff88);
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .volume-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #00d4ff, #00ff88);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .speed-control {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    padding: 8px 16px;
                    color: #ffffff;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 60px;
                    text-align: center;
                }

                .speed-control:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(0, 212, 255, 0.5);
                }

                .time-controls {
                    display: flex;
                    gap: 12px;
                }

                .time-btn {
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 8px;
                    padding: 6px 10px;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .time-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: #ffffff;
                }

                .action-controls {
                    display: flex;
                    justify-content: space-around;
                    gap: 16px;
                    margin-top: 20px;
                }

                .action-btn {
                    background: rgba(255, 255, 255, 0.08);
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .action-btn svg {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                }

                .action-btn:hover {
                    color: #00d4ff;
                    background: rgba(0, 212, 255, 0.1);
                    transform: scale(1.1);
                }

                .action-btn.active {
                    color: #00d4ff;
                    background: rgba(0, 212, 255, 0.2);
                }

                .action-btn.liked {
                    color: #ff6b6b;
                    background: rgba(255, 107, 107, 0.2);
                }

                .mini-toggle {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, #00d4ff, #00ff88);
                    border: none;
                    border-radius: 50%;
                    color: #ffffff;
                    font-size: 28px;
                    cursor: pointer;
                    z-index: 9999;
                    box-shadow: 0 12px 30px rgba(0, 212, 255, 0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: none;
                }

                .mini-toggle.visible {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .mini-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 16px 40px rgba(0, 212, 255, 0.6);
                }

                .mini-toggle.playing {
                    animation: musicPulse 2s infinite ease-in-out;
                }

                @keyframes musicPulse {
                    0%, 100% { 
                        box-shadow: 0 12px 30px rgba(0, 212, 255, 0.4);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 16px 40px rgba(0, 212, 255, 0.7);
                        transform: scale(1.05);
                    }
                }

                /* Comment Modal */
                .comment-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    z-index: 10000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                }

                .comment-modal.visible {
                    display: flex;
                }

                .comment-content {
                    background: rgba(20, 20, 30, 0.98);
                    border-radius: 20px;
                    padding: 32px;
                    max-width: 400px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .comment-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: #ffffff;
                    font-size: 14px;
                    margin-bottom: 16px;
                    resize: vertical;
                    min-height: 80px;
                }

                .comment-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .comment-submit {
                    background: linear-gradient(135deg, #00d4ff, #00ff88);
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    color: #ffffff;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .comment-submit:hover {
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
                    transform: translateY(-2px);
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .frankport-music-card {
                        width: 340px;
                        bottom: 20px;
                        right: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .frankport-music-card {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        border-radius: 24px 24px 0 0;
                        transform: translateY(100%);
                        max-height: 80vh;
                        overflow-y: auto;
                    }
                    
                    .frankport-music-card.visible {
                        transform: translateY(0);
                    }
                    
                    .mini-toggle {
                        bottom: 20px;
                        right: 20px;
                        width: 60px;
                        height: 60px;
                    }
                    
                    .main-controls {
                        gap: 16px;
                    }
                    
                    .control-btn {
                        width: 44px;
                        height: 44px;
                    }
                    
                    .control-btn.play-pause {
                        width: 56px;
                        height: 56px;
                    }
                }

                /* Accessibility */
                @media (prefers-reduced-motion: reduce) {
                    .frankport-music-card,
                    .control-btn,
                    .mood-button,
                    .mini-toggle,
                    .action-btn {
                        transition: none;
                        animation: none;
                    }
                }

                @media (prefers-contrast: high) {
                    .frankport-music-card {
                        border: 2px solid #ffffff;
                        background: rgba(0, 0, 0, 0.95);
                    }
                }

                /* Focus styles for accessibility */
                .control-btn:focus,
                .action-btn:focus,
                .mood-button:focus,
                .speed-control:focus,
                .time-btn:focus {
                    outline: 2px solid #00d4ff;
                    outline-offset: 2px;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    /* =====================================
       📊 TRIGGER SYSTEM
       ===================================== */

    startTriggerTracking() {
        this.timeTracker = setInterval(() => {
            if (!this.state.userInteracted) {
                this.triggerData.timeOnSite += 1000;
                this.checkTriggerConditions();
            }
        }, 1000);

        this.handleScroll();
    }

    handleScroll() {
        if (this.triggerData.triggered) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        this.triggerData.scrollDepth = Math.max(this.triggerData.scrollDepth, scrollPercent);
        this.checkTriggerConditions();
    }

    checkTriggerConditions() {
        if (this.triggerData.triggered) return;

        const timeCondition = this.triggerData.timeOnSite >= this.config.triggerTime;
        const scrollCondition = this.triggerData.scrollDepth >= this.config.triggerScroll;

        if (timeCondition && scrollCondition) {
            this.triggerData.triggered = true;
            this.showMusicCard();
            this.trackAnalytics('music_card_triggered', {
                timeOnSite: this.triggerData.timeOnSite,
                scrollDepth: this.triggerData.scrollDepth
            });
        }
    }

    /* =====================================
       🎨 UI COMPONENTS
       ===================================== */

    showMusicCard() {
        if (this.state.cardVisible) return;

        const userPreference = this.getUserPreference();
        if (userPreference === 'declined') {
            this.showMiniToggle();
            return;
        }

        this.createMusicCard();
        this.state.cardVisible = true;
        
        setTimeout(() => {
            if (this.state.cardVisible && !this.state.userInteracted && !this.state.isPlaying) {
                this.minimizeCard();
            }
        }, 10000);
    }

    createMusicCard() {
        if (document.getElementById('frankport-music-card')) return;

        const cardHTML = `
            <div id="frankport-music-card" class="frankport-music-card">
                <div class="music-card-header">
                    <h3 class="music-card-title">Enhance Your Journey</h3>
                    <p class="music-card-subtitle">Every great portfolio deserves a soundtrack</p>
                    <button class="music-close-btn" aria-label="Close music card">×</button>
                </div>
                
                <div class="music-mood-selector">
                    <button class="mood-button" data-mood="surprise" aria-label="Surprise me with random music">
                        <div class="mood-icon">♪</div>
                        <span>Surprise Me</span>
                    </button>
                    <button class="mood-button" data-mood="calm-focus" aria-label="Play calm focus music">
                        <div class="mood-icon">🎹</div>
                        <span>Calm Focus</span>
                    </button>
                    <button class="mood-button" data-mood="energetic-beats" aria-label="Play energetic beats">
                        <div class="mood-icon">⚡</div>
                        <span>Energetic Beats</span>
                    </button>
                    <button class="mood-button" data-mood="ambient-hacker" aria-label="Play ambient hacker music">
                        <div class="mood-icon">◊</div>
                        <span>Ambient Hacker</span>
                    </button>
                    <button class="mood-button no-music" data-mood="none" aria-label="No music, silent mode">
                        <div class="mood-icon">🔇</div>
                        <span>Silent Mode</span>
                    </button>
                    <button class="mood-button" data-mood="minimal" aria-label="Just show music toggle">
                        <div class="mood-icon">⌐</div>
                        <span>Just Toggle</span>
                    </button>
                </div>
                
                <div class="music-player">
                    <div class="track-artwork">
                        <div class="track-artwork-placeholder">♪</div>
                    </div>
                    
                    <div class="track-info">
                        <h4 class="track-title">Track Title</h4>
                        <p class="track-artist">Artist Name</p>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar" role="slider" aria-label="Audio progress" tabindex="0">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-time">
                            <span class="current-time">0:00</span>
                            <span class="total-time">0:00</span>
                        </div>
                    </div>
                    
                    <div class="main-controls">
                        <button class="control-btn prev-btn" aria-label="Previous track" title="Previous Track">
                            <svg viewBox="0 0 24 24">
                                <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
                            </svg>
                        </button>
                        
                        <button class="control-btn seek-back" aria-label="Rewind 10 seconds" title="Rewind 10s">
                            <svg viewBox="0 0 24 24">
                                <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                                <text x="12" y="15" text-anchor="middle" font-size="6" fill="currentColor">10</text>
                            </svg>
                        </button>
                        
                        <button class="control-btn play-pause" aria-label="Play" title="Play/Pause">
                            <svg viewBox="0 0 24 24" class="play-icon">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            <svg viewBox="0 0 24 24" class="pause-icon" style="display: none;">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        </button>
                        
                        <button class="control-btn seek-forward" aria-label="Forward 10 seconds" title="Forward 10s">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                                <text x="12" y="15" text-anchor="middle" font-size="6" fill="currentColor">10</text>
                            </svg>
                        </button>
                        
                        <button class="control-btn next-btn" aria-label="Next track" title="Next Track">
                            <svg viewBox="0 0 24 24">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="secondary-controls">
                        <div class="volume-control">
                            <svg class="volume-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.22-1.21.22-1.21.85z"/>
                            </svg>
                            <input type="range" class="volume-slider" min="0" max="100" value="70" aria-label="Volume control">
                        </div>
                        
                        <div class="time-controls">
                            <button class="time-btn" data-time="-10" aria-label="Back 10 seconds" title="Back 10s">-10s</button>
                            <button class="time-btn" data-time="10" aria-label="Forward 10 seconds" title="Forward 10s">+10s</button>
                        </div>
                        
                        <button class="speed-control" aria-label="Playback speed" title="Playback Speed">1.0x</button>
                    </div>
                    
                    <div class="action-controls">
                        <button class="action-btn like-btn" aria-label="Like this track" title="Like Track">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        
                        <button class="action-btn shuffle-btn" aria-label="Shuffle playlist" title="Shuffle">
                            <svg viewBox="0 0 24 24">
                                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                            </svg>
                        </button>
                        
                        <button class="action-btn repeat-btn" aria-label="Repeat track" title="Repeat">
                            <svg viewBox="0 0 24 24">
                                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                            </svg>
                        </button>
                        
                        <button class="action-btn comment-btn" aria-label="Add comment" title="Comment">
                            <svg viewBox="0 0 24 24">
                                <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                            </svg>
                        </button>
                        
                        <button class="action-btn minimize-btn" aria-label="Minimize player" title="Minimize">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 13H5v-2h14v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="comment-modal" id="comment-modal">
                <div class="comment-content">
                    <h3 style="margin-bottom: 16px; color: #ffffff;">Share Your Thoughts</h3>
                    <textarea class="comment-input" placeholder="What do you think about this track? Share your feedback..."></textarea>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button class="comment-cancel" style="background: rgba(255,255,255,0.1); border: none; border-radius: 8px; padding: 8px 16px; color: #fff; cursor: pointer;">Cancel</button>
                        <button class="comment-submit">Submit Comment</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', cardHTML);
        
        this.elements = {
            card: document.getElementById('frankport-music-card'),
            closeBtn: document.querySelector('.music-close-btn'),
            moodSelector: document.querySelector('.music-mood-selector'),
            player: document.querySelector('.music-player'),
            trackArtwork: document.querySelector('.track-artwork'),
            artworkPlaceholder: document.querySelector('.track-artwork-placeholder'),
            trackTitle: document.querySelector('.track-title'),
            trackArtist: document.querySelector('.track-artist'),
            progressBar: document.querySelector('.progress-bar'),
            progressFill: document.querySelector('.progress-fill'),
            currentTime: document.querySelector('.current-time'),
            totalTime: document.querySelector('.total-time'),
            playPauseBtn: document.querySelector('.play-pause'),
            playIcon: document.querySelector('.play-icon'),
            pauseIcon: document.querySelector('.pause-icon'),
            prevBtn: document.querySelector('.prev-btn'),
            nextBtn: document.querySelector('.next-btn'),
            seekBackBtn: document.querySelector('.seek-back'),
            seekForwardBtn: document.querySelector('.seek-forward'),
            volumeSlider: document.querySelector('.volume-slider'),
            speedBtn: document.querySelector('.speed-control'),
            timeBtns: document.querySelectorAll('.time-btn'),
            likeBtn: document.querySelector('.like-btn'),
            shuffleBtn: document.querySelector('.shuffle-btn'),
            repeatBtn: document.querySelector('.repeat-btn'),
            commentBtn: document.querySelector('.comment-btn'),
            minimizeBtn: document.querySelector('.minimize-btn'),
            commentModal: document.getElementById('comment-modal'),
            commentInput: document.querySelector('.comment-input'),
            commentSubmit: document.querySelector('.comment-submit'),
            commentCancel: document.querySelector('.comment-cancel')
        };

        this.setupEventListeners();
        
        setTimeout(() => {
            this.elements.card.classList.add('visible');
        }, 100);
    }

    /* =====================================
       🎵 AUDIO ENGINE
       ===================================== */

    async loadTrack(mood, trackIndex = 0) {
        try {
            const tracks = mood === 'surprise' ? this.getRandomMoodTracks() : this.audioLibrary[mood];
            if (!tracks || !tracks[trackIndex]) return;

            const track = tracks[trackIndex];
            
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.removeEventListener('timeupdate', this.updateProgress);
                this.currentAudio.removeEventListener('ended', this.handleTrackEnd);
            }
            
            this.currentAudio = new Audio(track.file);
            this.currentAudio.crossOrigin = 'anonymous';
            this.currentAudio.preload = 'auto';
            
            if (this.audioContext && this.gainNode) {
                const source = this.audioContext.createMediaElementSource(this.currentAudio);
                source.connect(this.gainNode);
            }

            this.currentAudio.addEventListener('loadedmetadata', () => {
                this.state.duration = this.currentAudio.duration;
                this.updateTrackInfo(track, mood);
                this.updateProgressDisplay();
            });

            this.currentAudio.addEventListener('timeupdate', this.updateProgress);
            this.currentAudio.addEventListener('ended', this.handleTrackEnd.bind(this));
            this.currentAudio.addEventListener('error', () => this.handleAudioError());

            await this.currentAudio.load();
            
            this.state.currentMood = mood;
            this.state.currentTrack = trackIndex;
            this.state.currentTime = 0;
            
        } catch (error) {
            console.error('Error loading track:', error);
            this.handleAudioError();
        }
    }

    async playAudio() {
        if (!this.currentAudio) return;

        try {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            await this.currentAudio.play();
            this.state.isPlaying = true;
            this.updatePlayPauseButton();
            this.updateMiniToggle();
            
            this.trackAnalytics('track_played', {
                mood: this.state.currentMood,
                track: this.state.currentTrack
            });

        } catch (error) {
            console.error('Playback error:', error);
            this.handleAudioError();
        }
    }

    pauseAudio() {
        if (!this.currentAudio) return;

        this.currentAudio.pause();
        this.state.isPlaying = false;
        this.updatePlayPauseButton();
        this.updateMiniToggle();
        
        this.trackAnalytics('track_paused');
    }

    setVolume(volume) {
        this.state.volume = Math.max(0, Math.min(1, volume));
        
        if (this.gainNode) {
            this.gainNode.gain.value = this.state.volume;
        } else if (this.currentAudio) {
            this.currentAudio.volume = this.state.volume;
        }
        
        this.saveUserPreference('volume', this.state.volume);
        this.updateVolumeIcon();
    }

    setPlaybackRate(rate) {
        this.state.playbackRate = rate;
        if (this.currentAudio) {
            this.currentAudio.playbackRate = rate;
        }
        
        if (this.elements.speedBtn) {
            this.elements.speedBtn.textContent = `${rate}x`;
        }
        
        this.trackAnalytics('speed_changed', { speed: rate });
    }

    seekTo(seconds) {
        if (!this.currentAudio || !isFinite(seconds)) return;
        
        const seekTime = Math.max(0, Math.min(this.currentAudio.duration || 0, seconds));
        this.currentAudio.currentTime = seekTime;
        this.state.currentTime = seekTime;
        this.updateProgressDisplay();
        
        this.trackAnalytics('track_seeked', { position: seekTime });
    }

    seekRelative(seconds) {
        if (!this.currentAudio) return;
        
        const newTime = this.currentAudio.currentTime + seconds;
        this.seekTo(newTime);
    }

    playNextTrack() {
        const tracks = this.getCurrentTrackList();
        if (!tracks) return;

        let nextIndex;
        if (this.state.isShuffled) {
            nextIndex = Math.floor(Math.random() * tracks.length);
        } else {
            nextIndex = (this.state.currentTrack + 1) % tracks.length;
        }
        
        this.loadTrack(this.state.currentMood, nextIndex);
        
        if (this.state.isPlaying) {
            setTimeout(() => this.playAudio(), 500);
        }
        
        this.trackAnalytics('track_skipped', { direction: 'next' });
    }

    playPreviousTrack() {
        const tracks = this.getCurrentTrackList();
        if (!tracks) return;

        let prevIndex;
        if (this.state.isShuffled) {
            prevIndex = Math.floor(Math.random() * tracks.length);
        } else {
            prevIndex = this.state.currentTrack === 0 ? tracks.length - 1 : this.state.currentTrack - 1;
        }
        
        this.loadTrack(this.state.currentMood, prevIndex);
        
        if (this.state.isPlaying) {
            setTimeout(() => this.playAudio(), 500);
        }
        
        this.trackAnalytics('track_skipped', { direction: 'previous' });
    }

    handleTrackEnd() {
        if (this.state.isRepeating) {
            this.seekTo(0);
            this.playAudio();
        } else {
            this.playNextTrack();
        }
    }

    getCurrentTrackList() {
        return this.state.currentMood === 'surprise' ? 
            this.getRandomMoodTracks() : 
            this.audioLibrary[this.state.currentMood];
    }

    getRandomMoodTracks() {
        const moods = ['calm-focus', 'energetic-beats', 'ambient-hacker'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        return this.audioLibrary[randomMood];
    }

    handleAudioError() {
        if (this.elements.trackTitle) {
            this.elements.trackTitle.textContent = 'Audio temporarily unavailable';
            this.elements.trackArtist.textContent = 'Let\'s keep building in silence';
        }
        
        this.state.isPlaying = false;
        this.updatePlayPauseButton();
        
        this.trackAnalytics('audio_error', {
            mood: this.state.currentMood,
            track: this.state.currentTrack
        });
    }

    /* =====================================
       🎮 EVENT HANDLERS
       ===================================== */

    setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.state.isPlaying && !this.isInputFocused()) {
                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        this.togglePlayPause();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.seekRelative(-10);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.seekRelative(10);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.setVolume(this.state.volume + 0.1);
                        this.elements.volumeSlider.value = this.state.volume * 100;
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.setVolume(this.state.volume - 0.1);
                        this.elements.volumeSlider.value = this.state.volume * 100;
                        break;
                }
            }
        });

        this.setupCardEventListeners();
    }

    setupCardEventListeners() {
        if (!this.elements.card) return;

        // Close button
        this.elements.closeBtn?.addEventListener('click', () => {
            this.state.userInteracted = true;
            this.saveUserPreference('declined', true);
            this.minimizeCard();
            this.trackAnalytics('music_card_closed');
        });

        // Mood selection
        this.elements.moodSelector?.addEventListener('click', (e) => {
            const moodButton = e.target.closest('.mood-button');
            if (!moodButton) return;

            this.state.userInteracted = true;
            const mood = moodButton.dataset.mood;
            
            document.querySelectorAll('.mood-button').forEach(btn => btn.classList.remove('active'));
            moodButton.classList.add('active');

            this.handleMoodSelection(mood);
        });

        // Main controls
        this.elements.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        this.elements.prevBtn?.addEventListener('click', () => this.playPreviousTrack());
        this.elements.nextBtn?.addEventListener('click', () => this.playNextTrack());
        this.elements.seekBackBtn?.addEventListener('click', () => this.seekRelative(-10));
        this.elements.seekForwardBtn?.addEventListener('click', () => this.seekRelative(10));

        // Time control buttons
        this.elements.timeBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                const time = parseInt(btn.dataset.time);
                this.seekRelative(time);
            });
        });

        // Volume control
        this.elements.volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        // Speed control
        this.elements.speedBtn?.addEventListener('click', () => {
            const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
            const currentIndex = speeds.indexOf(this.state.playbackRate);
            const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
            this.setPlaybackRate(nextSpeed);
        });

        // Progress bar
        this.elements.progressBar?.addEventListener('click', (e) => {
            if (!this.currentAudio) return;
            
            const rect = e.target.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const seekTime = percentage * this.currentAudio.duration;
            
            this.seekTo(seekTime);
        });

        // Action buttons
        this.elements.likeBtn?.addEventListener('click', () => this.toggleLike());
        this.elements.shuffleBtn?.addEventListener('click', () => this.toggleShuffle());
        this.elements.repeatBtn?.addEventListener('click', () => this.toggleRepeat());
        this.elements.commentBtn?.addEventListener('click', () => this.showCommentModal());
        this.elements.minimizeBtn?.addEventListener('click', () => this.minimizeCard());

        // Comment modal
        this.elements.commentSubmit?.addEventListener('click', () => this.submitComment());
        this.elements.commentCancel?.addEventListener('click', () => this.hideCommentModal());
        
        this.elements.commentModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.commentModal) {
                this.hideCommentModal();
            }
        });
    }

    handleMoodSelection(mood) {
        this.trackAnalytics('mood_selected', { mood });
        
        switch (mood) {
            case 'none':
                this.saveUserPreference('mood', 'none');
                this.minimizeCard();
                break;
                
            case 'minimal':
                this.saveUserPreference('mood', 'minimal');
                this.minimizeCard();
                break;
                
            default:
                this.saveUserPreference('mood', mood);
                this.showMusicPlayer(mood);
                break;
        }
    }

    async showMusicPlayer(mood) {
        this.elements.moodSelector.style.display = 'none';
        this.elements.player.classList.add('active');
        
        await this.loadTrack(mood, 0);
        await this.playAudio();
    }

    togglePlayPause() {
        if (!this.currentAudio) return;
        
        if (this.state.isPlaying) {
            this.pauseAudio();
        } else {
            this.playAudio();
        }
    }

    toggleLike() {
        this.state.isLiked = !this.state.isLiked;
        this.elements.likeBtn.classList.toggle('liked', this.state.isLiked);
        
        this.trackAnalytics('track_liked', {
            mood: this.state.currentMood,
            track: this.state.currentTrack,
            liked: this.state.isLiked
        });
        
        // Save like status
        this.saveTrackPreference('liked', this.state.isLiked);
    }

    toggleShuffle() {
        this.state.isShuffled = !this.state.isShuffled;
        this.elements.shuffleBtn.classList.toggle('active', this.state.isShuffled);
        
        this.trackAnalytics('shuffle_toggled', { enabled: this.state.isShuffled });
        this.saveUserPreference('shuffle', this.state.isShuffled);
    }

    toggleRepeat() {
        this.state.isRepeating = !this.state.isRepeating;
        this.elements.repeatBtn.classList.toggle('active', this.state.isRepeating);
        
        this.trackAnalytics('repeat_toggled', { enabled: this.state.isRepeating });
        this.saveUserPreference('repeat', this.state.isRepeating);
    }

    showCommentModal() {
        this.elements.commentModal.classList.add('visible');
        this.elements.commentInput.focus();
        
        this.trackAnalytics('comment_modal_opened');
    }

    hideCommentModal() {
        this.elements.commentModal.classList.remove('visible');
        this.elements.commentInput.value = '';
    }

    submitComment() {
        const comment = this.elements.commentInput.value.trim();
        if (!comment) return;

        // Store comment (in real app, send to backend)
        const commentData = {
            id: Date.now(),
            text: comment,
            track: this.state.currentMood + '-' + this.state.currentTrack,
            timestamp: new Date().toISOString(),
            mood: this.state.currentMood
        };
        
        this.state.comments.push(commentData);
        this.saveTrackPreference('comments', this.state.comments);
        
        this.trackAnalytics('comment_submitted', {
            mood: this.state.currentMood,
            track: this.state.currentTrack,
            commentLength: comment.length
        });
        
        this.hideCommentModal();
        
        // Show success feedback
        this.showNotification('Comment saved! Thank you for your feedback.');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00d4ff, #00ff88);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /* =====================================
       🎨 UI UPDATES
       ===================================== */

    updateProgress() {
        if (!this.currentAudio) return;
        
        this.state.currentTime = this.currentAudio.currentTime;
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        if (!this.elements.progressFill) return;
        
        const progress = this.state.duration > 0 ? 
            (this.state.currentTime / this.state.duration) * 100 : 0;
            
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.currentTime.textContent = this.formatTime(this.state.currentTime);
        this.elements.totalTime.textContent = this.formatTime(this.state.duration);
    }

    updateTrackInfo(track, mood) {
        if (!this.elements.trackTitle) return;
        
        this.elements.trackTitle.textContent = track.title;
        this.elements.trackArtist.textContent = track.artist;
        
        // Update artwork
        if (track.image) {
            const img = document.createElement('img');
            img.src = track.image;
            img.alt = track.title;
            img.onload = () => {
                this.elements.artworkPlaceholder.replaceWith(img);
            };
            img.onerror = () => {
                this.elements.artworkPlaceholder.textContent = this.getMoodIcon(mood);
            };
        } else {
            this.elements.artworkPlaceholder.textContent = this.getMoodIcon(mood);
        }
        
        // Load saved preferences for this track
        this.loadTrackPreferences();
    }

    updatePlayPauseButton() {
        if (!this.elements.playIcon || !this.elements.pauseIcon) return;
        
        if (this.state.isPlaying) {
            this.elements.playIcon.style.display = 'none';
            this.elements.pauseIcon.style.display = 'block';
            this.elements.playPauseBtn.setAttribute('aria-label', 'Pause');
        } else {
            this.elements.playIcon.style.display = 'block';
            this.elements.pauseIcon.style.display = 'none';
            this.elements.playPauseBtn.setAttribute('aria-label', 'Play');
        }
    }

    updateMiniToggle() {
        const toggle = document.getElementById('frankport-mini-toggle');
        if (!toggle) return;
        
        if (this.state.isPlaying) {
            toggle.classList.add('playing');
            toggle.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 28px; height: 28px;">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        } else {
            toggle.classList.remove('playing');
            toggle.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 28px; height: 28px;">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
    }

    updateVolumeIcon() {
        const volumeIcon = document.querySelector('.volume-icon');
        if (!volumeIcon) return;
        
        let iconPath;
        if (this.state.volume === 0) {
            iconPath = "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z";
        } else if (this.state.volume < 0.5) {
            iconPath = "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z";
        } else {
            iconPath = "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";
        }
        
        volumeIcon.innerHTML = `<path d="${iconPath}"/>`;
    }

    getMoodIcon(mood) {
        const icons = {
            'calm-focus': '🎹',
            'energetic-beats': '⚡',
            'ambient-hacker': '◊',
            'surprise': '♪'
        };
        return icons[mood] || '♪';
    }

    formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /* =====================================
       🎮 RESPONSIVE & UTILITY
       ===================================== */

    handleResize() {
        const wasMobile = this.state.isMobile;
        this.state.isMobile = window.innerWidth <= 480;
        
        if (wasMobile !== this.state.isMobile && this.state.cardVisible) {
            this.minimizeCard();
            setTimeout(() => this.showMusicCard(), 500);
        }
    }

    handleVisibilityChange() {
        if (document.hidden && this.state.isPlaying) {
            // Optionally pause when tab becomes inactive
            // this.pauseAudio();
        }
    }

    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
    }

    showMiniToggle() {
        if (document.getElementById('frankport-mini-toggle')) return;

        const toggleHTML = `
            <button id="frankport-mini-toggle" class="mini-toggle" aria-label="Open music player">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 28px; height: 28px;">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', toggleHTML);
        
        const toggle = document.getElementById('frankport-mini-toggle');
        setTimeout(() => toggle.classList.add('visible'), 100);
        
        toggle.addEventListener('click', () => {
            this.state.userInteracted = true;
            toggle.remove();
            this.showMusicCard();
        });
    }

    minimizeCard() {
        if (!this.elements.card) return;

        this.elements.card.classList.remove('visible');
        this.state.cardVisible = false;
        
        setTimeout(() => {
            this.elements.card.remove();
            this.showMiniToggle();
        }, 800);
    }

    /* =====================================
       💾 PREFERENCES & STORAGE
       ===================================== */

    loadUserPreferences() {
        try {
            const prefs = JSON.parse(localStorage.getItem('frankport-music-prefs') || '{}');
            
            if (prefs.volume !== undefined) {
                this.state.volume = prefs.volume;
                this.setVolume(this.state.volume);
            }
            
            if (prefs.shuffle !== undefined) {
                this.state.isShuffled = prefs.shuffle;
            }
            
            if (prefs.repeat !== undefined) {
                this.state.isRepeating = prefs.repeat;
            }
            
            if (prefs.mood && prefs.mood !== 'none') {
                setTimeout(() => {
                    if (!this.state.userInteracted) {
                        this.showMusicCard();
                        setTimeout(() => this.showMusicPlayer(prefs.mood), 1000);
                    }
                }, 2000);
            }
            
        } catch (error) {
            console.warn('Error loading user preferences:', error);
        }
    }

    saveUserPreference(key, value) {
        try {
            const prefs = JSON.parse(localStorage.getItem('frankport-music-prefs') || '{}');
            prefs[key] = value;
            prefs.lastVisit = Date.now();
            localStorage.setItem('frankport-music-prefs', JSON.stringify(prefs));
        } catch (error) {
            console.warn('Error saving user preference:', error);
        }
    }

    loadTrackPreferences() {
        try {
            const trackKey = `${this.state.currentMood}-${this.state.currentTrack}`;
            const trackPrefs = JSON.parse(localStorage.getItem('frankport-track-prefs') || '{}');
            
            if (trackPrefs[trackKey]) {
                this.state.isLiked = trackPrefs[trackKey].liked || false;
                this.state.comments = trackPrefs[trackKey].comments || [];
                
                this.elements.likeBtn?.classList.toggle('liked', this.state.isLiked);
            }
        } catch (error) {
            console.warn('Error loading track preferences:', error);
        }
    }

    saveTrackPreference(key, value) {
        try {
            const trackKey = `${this.state.currentMood}-${this.state.currentTrack}`;
            const trackPrefs = JSON.parse(localStorage.getItem('frankport-track-prefs') || '{}');
            
            if (!trackPrefs[trackKey]) {
                trackPrefs[trackKey] = {};
            }
            
            trackPrefs[trackKey][key] = value;
            localStorage.setItem('frankport-track-prefs', JSON.stringify(trackPrefs));
        } catch (error) {
            console.warn('Error saving track preference:', error);
        }
    }

    getUserPreference() {
        try {
            const prefs = JSON.parse(localStorage.getItem('frankport-music-prefs') || '{}');
            return prefs.declined ? 'declined' : prefs.mood || null;
        } catch (error) {
            return null;
        }
    }

    /* =====================================
       📊 ANALYTICS
       ===================================== */

    trackAnalytics(event, data = {}) {
        if (!this.config.analytics) return;
        
        const analyticsData = {
            event,
            sessionId: this.analytics.sessionId,
            timestamp: Date.now(),
            isMobile: this.state.isMobile,
            currentTrack: this.state.currentTrack,
            currentMood: this.state.currentMood,
            isPlaying: this.state.isPlaying,
            volume: this.state.volume,
            playbackRate: this.state.playbackRate,
            ...data
        };
        
        this.analytics.events.push(analyticsData);
        
        // Send to your analytics service
        this.sendAnalytics(analyticsData);
        
        console.log('🎵 Analytics:', analyticsData);
    }

    sendAnalytics(data) {
        // Implement your analytics service integration
        // Examples: Google Analytics, Mixpanel, custom endpoint
        
        // Google Analytics 4 example:
        /*
        if (window.gtag) {
            window.gtag('event', data.event, {
                event_category: 'FrankPort_Music',
                event_label: data.currentMood,
                custom_parameter_session_id: data.sessionId,
                custom_parameter_device: data.isMobile ? 'mobile' : 'desktop',
                custom_parameter_track_index: data.currentTrack,
                custom_parameter_volume: Math.round(data.volume * 100),
                custom_parameter_speed: data.playbackRate
            });
        }
        */
        
        // Custom endpoint example:
        /*
        fetch('/api/analytics/music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.warn('Analytics failed:', err));
        */
    }

    generateSessionId() {
        return 'fp_music_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    /* =====================================
       🧹 CLEANUP & DESTRUCTION
       ===================================== */

    destroy() {
        // Clean up event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Clear timers
        if (this.timeTracker) {
            clearInterval(this.timeTracker);
        }
        
        // Stop and clean up audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.removeEventListener('timeupdate', this.updateProgress);
            this.currentAudio.removeEventListener('ended', this.handleTrackEnd);
            this.currentAudio = null;
        }
        
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Remove DOM elements
        const elementsToRemove = [
            'frankport-music-card',
            'frankport-mini-toggle',
            'frankport-music-styles',
            'comment-modal'
        ];
        
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            element?.remove();
        });
        
        // Final analytics
        this.trackAnalytics('system_destroyed', {
            totalPlayTime: this.state.totalPlayTime,
            totalEvents: this.analytics.events.length
        });
        
        console.log('🎵 FrankPort Music Experience cleaned up');
    }

    /* =====================================
       🚀 PUBLIC API
       ===================================== */

    // Public methods for external control
    play() { 
        if (this.currentAudio) this.playAudio(); 
    }
    
    pause() { 
        if (this.currentAudio) this.pauseAudio(); 
    }
    
    next() { 
        this.playNextTrack(); 
    }
    
    previous() { 
        this.playPreviousTrack(); 
    }
    
    setVolume(volume) { 
        this.setVolume(Math.max(0, Math.min(1, volume))); 
    }
    
    setSpeed(speed) { 
        this.setPlaybackRate(speed); 
    }
    
    seek(seconds) { 
        this.seekTo(seconds); 
    }
    
    like() { 
        if (!this.state.isLiked) this.toggleLike(); 
    }
    
    unlike() { 
        if (this.state.isLiked) this.toggleLike(); 
    }
    
    shuffle(enable = true) { 
        if (this.state.isShuffled !== enable) this.toggleShuffle(); 
    }
    
    repeat(enable = true) { 
        if (this.state.isRepeating !== enable) this.toggleRepeat(); 
    }
    
    show() { 
        if (!this.state.cardVisible) this.showMusicCard(); 
    }
    
    hide() { 
        if (this.state.cardVisible) this.minimizeCard(); 
    }
    
    // Getters for current state
    getState() {
        return {
            isPlaying: this.state.isPlaying,
            currentTrack: this.state.currentTrack,
            currentMood: this.state.currentMood,
            volume: this.state.volume,
            playbackRate: this.state.playbackRate,
            currentTime: this.state.currentTime,
            duration: this.state.duration,
            isLiked: this.state.isLiked,
            isShuffled: this.state.isShuffled,
            isRepeating: this.state.isRepeating
        };
    }
    
    getAnalytics() {
        return {
            sessionId: this.analytics.sessionId,
            totalEvents: this.analytics.events.length,
            events: [...this.analytics.events]
        };
    }
    
    getCurrentTrack() {
        if (!this.state.currentMood || this.state.currentTrack === null) return null;
        
        const tracks = this.getCurrentTrackList();
        return tracks ? tracks[this.state.currentTrack] : null;
    }
}

/* =====================================
   🎬 AUTO-INITIALIZATION
   ===================================== */

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.FrankPortMusic = new FrankPortMusicExperience();
        window.FrankPortMusic.init();
    });
} else {
    window.FrankPortMusic = new FrankPortMusicExperience();
    window.FrankPortMusic.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrankPortMusicExperience;
}

// Add required CSS animations
const additionalStyles = `
<style>
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
</style>
`;

if (!document.querySelector('style[data-frankport-animations]')) {
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-frankport-animations', 'true');
    styleSheet.textContent = additionalStyles.replace(/<\/?style[^>]*>/g, '');
    document.head.appendChild(styleSheet);
} 