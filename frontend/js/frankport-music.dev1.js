/* =====================================
   🎵 FRANKPORT MUSIC EXPERIENCE
   Complete Frontend Solution - Single File
   ===================================== */

class FrankPortMusicExperience {
    constructor() {
        // Core Configuration
        this.config = {
            triggerTime: 15000,        // 15 seconds
            triggerScroll: 25,         // 25% scroll
            defaultVolume: 0.7,        // 70% volume
            fadeInDelay: 3000          // 3s delay after trigger
        };

        // State Management
        this.state = {
            triggered: false,
            isMinimized: false,
            isPlaying: false,
            currentTrack: 0,
            currentMood: 'surprise',
            volume: this.config.defaultVolume,
            playbackRate: 1,
            currentTime: 0,
            duration: 0,
            isLiked: false,
            shuffle: false,
            repeat: 'off', // 'off', 'one', 'all'
            showComments: false,
            showSettings: false,
            isDragging: false,
            position: { bottom: '20px', right: '20px' }
        };

        // Track Library
        this.trackLibrary = {
            'calm-focus': [
                { title: 'Peaceful Coding', artist: 'Digital Zen', duration: 180, file: 'assets/audio/calm-focus-1.mp3' },
                { title: 'Mindful Development', artist: 'Code Meditation', duration: 195, file: 'assets/audio/calm-focus-2.mp3' },
                { title: 'Serene Algorithms', artist: 'Tranquil Tech', duration: 220, file: 'assets/audio/calm-focus-3.mp3' }
            ],
            'energetic': [
                { title: 'Cyber Sprint', artist: 'Digital Drive', duration: 165, file: 'assets/audio/energetic-1.mp3' },
                { title: 'Code Rush', artist: 'Tech Pulse', duration: 145, file: 'assets/audio/energetic-2.mp3' },
                { title: 'Binary Beat', artist: 'Data Flow', duration: 178, file: 'assets/audio/energetic-3.mp3' }
            ],
            'ambient-hacker': [
                { title: 'Dark Terminal', artist: 'Neon Shadows', duration: 240, file: 'assets/audio/ambient-1.mp3' },
                { title: 'Cyberpunk Dreams', artist: 'Future Code', duration: 210, file: 'assets/audio/ambient-2.mp3' },
                { title: 'Matrix Flow', artist: 'Digital Underground', duration: 188, file: 'assets/audio/ambient-3.mp3' }
            ]
        };

        // Audio Management
        this.audioElement = null;
        this.audioContext = null;
        this.gainNode = null;

        // UI Elements
        this.musicCard = null;
        this.minimizedIcon = null;
        
        // Analytics
        this.analytics = {
            sessionStart: Date.now(),
            tracksPlayed: 0,
            totalPlayTime: 0,
            interactions: []
        };

        // Comments Storage (session only)
        this.comments = [
            { text: "Perfect coding soundtrack!", user: "Anonymous", timestamp: Date.now() - 3600000 },
            { text: "This helps me focus so much better", user: "Developer", timestamp: Date.now() - 1800000 }
        ];

        // Event Listeners
        this.boundHandlers = {
            scroll: this.handleScroll.bind(this),
            resize: this.handleResize.bind(this),
            keydown: this.handleKeydown.bind(this)
        };

        this.init();
    }

    init() {
        this.injectCSS();
        this.setupEventListeners();
        this.createMinimizedIcon();
        this.startTriggerDetection();
    }

    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Font Awesome Icons */
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

            /* Music Card Styles */
            .frankport-music-card {
                position: fixed;
                width: 280px;
                height: 160px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                user-select: none;
                overflow: hidden;
            }

            .frankport-music-card.dark-mode {
                background: rgba(30, 30, 30, 0.95);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .frankport-music-card.minimized {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
            }

            .frankport-music-card.dragging {
                transform: scale(1.05);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            }

            /* Album Art */
            .album-art {
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 8px;
                position: relative;
                overflow: hidden;
            }

            .album-art i {
                font-size: 24px;
                color: white;
                animation: musicPulse 2s ease-in-out infinite;
            }

            @keyframes musicPulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }

            .album-art.playing {
                animation: albumRotate 4s linear infinite;
            }

            @keyframes albumRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Track Info */
            .track-info {
                flex: 1;
                padding: 8px 0;
                overflow: hidden;
            }

            .track-title {
                font-weight: 600;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 2px;
            }

            .track-artist {
                color: #666;
                font-size: 11px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .dark-mode .track-artist {
                color: #999;
            }

            /* Controls Row */
            .controls-row {
                display: flex;
                align-items: center;
                padding: 4px 8px;
                gap: 8px;
            }

            .main-controls {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .control-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 6px;
                border-radius: 6px;
                transition: all 0.2s ease;
                color: #333;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 28px;
                height: 28px;
            }

            .dark-mode .control-btn {
                color: #fff;
            }

            .control-btn:hover {
                background: rgba(0, 0, 0, 0.1);
                transform: scale(1.1);
            }

            .dark-mode .control-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .control-btn.active {
                color: #667eea;
                background: rgba(102, 126, 234, 0.1);
            }

            .play-btn {
                font-size: 16px;
                color: #667eea;
            }

            /* Progress Bar */
            .progress-container {
                flex: 1;
                margin: 0 8px;
                position: relative;
            }

            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 2px;
                cursor: pointer;
                position: relative;
            }

            .dark-mode .progress-bar {
                background: rgba(255, 255, 255, 0.2);
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 2px;
                width: 0%;
                transition: width 0.1s linear;
            }

            .progress-handle {
                position: absolute;
                top: 50%;
                width: 12px;
                height: 12px;
                background: #667eea;
                border: 2px solid white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                cursor: grab;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .progress-container:hover .progress-handle {
                opacity: 1;
            }

            .progress-handle:active {
                cursor: grabbing;
                transform: translate(-50%, -50%) scale(1.2);
            }

            /* Time Display */
            .time-display {
                font-size: 10px;
                color: #666;
                min-width: 60px;
                text-align: center;
            }

            .dark-mode .time-display {
                color: #999;
            }

            /* Action Buttons */
            .action-buttons {
                display: flex;
                gap: 4px;
                margin-left: auto;
            }

            /* Window Controls */
            .window-controls {
                display: flex;
                gap: 4px;
                margin-left: 8px;
            }

            .window-btn {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                font-size: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .minimize-btn {
                background: #ffbd2e;
                color: #333;
            }

            .close-btn {
                background: #ff605c;
                color: white;
            }

            .window-btn:hover {
                transform: scale(1.1);
            }

            /* Minimized Icon */
            .frankport-music-icon {
                position: fixed;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
                animation: musicFloat 3s ease-in-out infinite;
            }

            @keyframes musicFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
            }

            .frankport-music-icon:hover {
                transform: scale(1.1) translateY(-2px);
                box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
            }

            .frankport-music-icon i {
                color: white;
                font-size: 20px;
                animation: musicIconPulse 2s ease-in-out infinite;
            }

            @keyframes musicIconPulse {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }

            /* Comments Panel */
            .comments-panel {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                margin-top: 8px;
                padding: 12px;
                max-height: 200px;
                overflow-y: auto;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }

            .dark-mode .comments-panel {
                background: rgba(30, 30, 30, 0.98);
                color: white;
            }

            .comment-item {
                margin-bottom: 8px;
                padding: 6px 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }

            .dark-mode .comment-item {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .comment-text {
                font-size: 11px;
                margin-bottom: 2px;
            }

            .comment-meta {
                font-size: 9px;
                color: #999;
            }

            .comment-input {
                width: 100%;
                padding: 6px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 6px;
                font-size: 11px;
                margin-top: 8px;
                background: rgba(255, 255, 255, 0.8);
            }

            .dark-mode .comment-input {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
            }

            /* Settings Panel */
            .settings-panel {
                position: absolute;
                top: 100%;
                right: 0;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                margin-top: 8px;
                padding: 12px;
                min-width: 150px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }

            .dark-mode .settings-panel {
                background: rgba(30, 30, 30, 0.98);
                color: white;
            }

            .setting-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 11px;
            }

            .setting-control {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .speed-btn {
                padding: 2px 6px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                background: none;
                font-size: 9px;
                cursor: pointer;
            }

            .speed-btn.active {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .volume-slider {
                width: 60px;
                height: 2px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 1px;
                position: relative;
                cursor: pointer;
            }

            .volume-fill {
                height: 100%;
                background: #667eea;
                border-radius: 1px;
                transition: width 0.1s ease;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .frankport-music-card {
                    width: 260px;
                    height: 140px;
                    bottom: 80px !important;
                    right: 10px !important;
                }

                .control-btn {
                    min-width: 32px;
                    height: 32px;
                    font-size: 16px;
                }

                .progress-handle {
                    width: 16px;
                    height: 16px;
                }
            }

            @media (max-width: 480px) {
                .frankport-music-card {
                    width: 240px;
                    height: 130px;
                    bottom: 100px !important;
                }

                .album-art {
                    width: 50px;
                    height: 50px;
                }

                .track-title {
                    font-size: 12px;
                }

                .track-artist {
                    font-size: 10px;
                }
            }

            /* Animations */
            .frankport-music-card.entering {
                animation: slideUpFade 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            @keyframes slideUpFade {
                from {
                    opacity: 0;
                    transform: translateY(100%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .frankport-music-card.exiting {
                animation: slideDownFade 0.3s ease-in forwards;
            }

            @keyframes slideDownFade {
                to {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
            }

            /* Hide scrollbars but keep functionality */
            .comments-panel::-webkit-scrollbar {
                width: 2px;
            }

            .comments-panel::-webkit-scrollbar-track {
                background: transparent;
            }

            .comments-panel::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 1px;
            }

            /* Ensure card doesn't interfere with page interactions */
            .frankport-music-card * {
                pointer-events: auto;
            }

            /* Mood gradient backgrounds */
            .mood-calm .album-art { background: linear-gradient(45deg, #a8edea, #fed6e3); }
            .mood-energetic .album-art { background: linear-gradient(45deg, #ff9a9e, #fecfef); }
            .mood-ambient .album-art { background: linear-gradient(45deg, #667eea, #764ba2); }
            .mood-surprise .album-art { background: linear-gradient(45deg, #ffecd2, #fcb69f); }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.boundHandlers.scroll, { passive: true });
        window.addEventListener('resize', this.boundHandlers.resize);
        document.addEventListener('keydown', this.boundHandlers.keydown);
    }

    createMinimizedIcon() {
        this.minimizedIcon = document.createElement('div');
        this.minimizedIcon.className = 'frankport-music-icon';
        this.minimizedIcon.style.bottom = this.state.position.bottom;
        this.minimizedIcon.style.right = this.state.position.right;
        this.minimizedIcon.innerHTML = '<i class="fas fa-music"></i>';
        this.minimizedIcon.style.display = 'none';
        
        this.minimizedIcon.addEventListener('click', () => this.showMusicCard());
        
        document.body.appendChild(this.minimizedIcon);
    }

    startTriggerDetection() {
        let timeSpent = 0;
        let scrollProgress = 0;

        const timeChecker = setInterval(() => {
            timeSpent += 100;
            scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (timeSpent >= this.config.triggerTime && scrollProgress >= this.config.triggerScroll && !this.state.triggered) {
                this.state.triggered = true;
                clearInterval(timeChecker);
                setTimeout(() => this.showInitialCard(), this.config.fadeInDelay);
            }
        }, 100);
    }

    showInitialCard() {
        this.createMusicCard();
        this.showMoodSelector();
    }

    createMusicCard() {
        if (this.musicCard) return;

        this.musicCard = document.createElement('div');
        this.musicCard.className = 'frankport-music-card entering';
        this.musicCard.style.bottom = this.state.position.bottom;
        this.musicCard.style.right = this.state.position.right;

        // Detect dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.musicCard.classList.add('dark-mode');
        }

        this.renderMusicCard();
        document.body.appendChild(this.musicCard);

        // Remove entering animation class
        setTimeout(() => {
            this.musicCard.classList.remove('entering');
        }, 500);

        this.setupCardEventListeners();
    }

    renderMusicCard() {
        const currentTrack = this.getCurrentTrack();
        const progress = this.state.duration > 0 ? (this.state.currentTime / this.state.duration) * 100 : 0;
        const currentTimeStr = this.formatTime(this.state.currentTime);
        const durationStr = this.formatTime(this.state.duration);

        this.musicCard.innerHTML = `
            <div style="display: flex; align-items: flex-start; padding: 8px;">
                <div class="album-art mood-${this.state.currentMood} ${this.state.isPlaying ? 'playing' : ''}">
                    <i class="fas fa-music"></i>
                </div>
                <div class="track-info">
                    <div class="track-title">${currentTrack.title}</div>
                    <div class="track-artist">${currentTrack.artist}</div>
                </div>
                <div class="action-buttons">
                    <button class="control-btn ${this.state.isLiked ? 'active' : ''}" data-action="like" title="Like">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="control-btn ${this.state.showComments ? 'active' : ''}" data-action="comments" title="Comments">
                        <i class="fas fa-comment"></i>
                    </button>
                    <button class="control-btn ${this.state.showSettings ? 'active' : ''}" data-action="settings" title="Settings">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                <div class="window-controls">
                    <button class="window-btn minimize-btn" data-action="minimize" title="Minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="window-btn close-btn" data-action="close" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div class="controls-row">
                <div class="main-controls">
                    <button class="control-btn" data-action="previous" title="Previous">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="control-btn play-btn" data-action="playpause" title="${this.state.isPlaying ? 'Pause' : 'Play'}">
                        <i class="fas fa-${this.state.isPlaying ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="control-btn" data-action="next" title="Next">
                        <i class="fas fa-step-forward"></i>
                    </button>
                </div>

                <div class="progress-container">
                    <div class="progress-bar" data-action="seek">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                        <div class="progress-handle" style="left: ${progress}%"></div>
                    </div>
                </div>

                <div class="time-display">${currentTimeStr} / ${durationStr}</div>
            </div>

            ${this.state.showComments ? this.renderCommentsPanel() : ''}
            ${this.state.showSettings ? this.renderSettingsPanel() : ''}
        `;
    }

    renderCommentsPanel() {
        return `
            <div class="comments-panel">
                ${this.comments.map(comment => `
                    <div class="comment-item">
                        <div class="comment-text">"${comment.text}"</div>
                        <div class="comment-meta">- ${comment.user} • ${this.getTimeAgo(comment.timestamp)}</div>
                    </div>
                `).join('')}
                <input type="text" class="comment-input" placeholder="Share your thoughts..." maxlength="150">
            </div>
        `;
    }

    renderSettingsPanel() {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        return `
            <div class="settings-panel">
                <div class="setting-item">
                    <span>Speed:</span>
                    <div class="setting-control">
                        ${speeds.map(speed => `
                            <button class="speed-btn ${this.state.playbackRate === speed ? 'active' : ''}" 
                                    data-speed="${speed}">${speed}x</button>
                        `).join('')}
                    </div>
                </div>
                <div class="setting-item">
                    <span>Skip:</span>
                    <div class="setting-control">
                        <button class="control-btn" data-action="skip-back" title="Skip back 10s">
                            <i class="fas fa-backward"></i>
                        </button>
                        <button class="control-btn" data-action="skip-forward" title="Skip forward 10s">
                            <i class="fas fa-forward"></i>
                        </button>
                    </div>
                </div>
                <div class="setting-item">
                    <span>Volume:</span>
                    <div class="volume-slider" data-action="volume">
                        <div class="volume-fill" style="width: ${this.state.volume * 100}%"></div>
                    </div>
                </div>
                <div class="setting-item">
                    <button class="control-btn ${this.state.shuffle ? 'active' : ''}" data-action="shuffle" title="Shuffle">
                        <i class="fas fa-random"></i>
                    </button>
                    <button class="control-btn ${this.state.repeat !== 'off' ? 'active' : ''}" data-action="repeat" title="Repeat">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </div>
        `;
    }

    showMoodSelector() {
        const moodSelector = document.createElement('div');
        moodSelector.className = 'frankport-music-card entering';
        moodSelector.style.bottom = '200px';
        moodSelector.style.right = this.state.position.right;
        moodSelector.style.width = '320px';
        moodSelector.style.height = '180px';
        moodSelector.style.padding = '20px';
        moodSelector.style.textAlign = 'center';

        moodSelector.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">Enhance Your Journey with Music</h3>
            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Would you like a soundtrack while exploring FrankPort?</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button class="mood-btn" data-mood="calm-focus" style="padding: 8px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">
                    <i class="fas fa-brain"></i> Calm Focus
                </button>
                <button class="mood-btn" data-mood="energetic" style="padding: 8px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">
                    <i class="fas fa-bolt"></i> Energetic Beats
                </button>
                <button class="mood-btn" data-mood="ambient-hacker" style="padding: 8px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">
                    <i class="fas fa-code"></i> Ambient Hacker
                </button>
                <button class="mood-btn" data-mood="surprise" style="padding: 8px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">
                    <i class="fas fa-dice"></i> Surprise Me
                </button>
            </div>

            <button class="mood-btn" data-mood="silent" style="padding: 8px 20px; border: 1px solid #ddd; border-radius: 8px; background: #f5f5f5; cursor: pointer;">
                <i class="fas fa-volume-mute"></i> No Sound
            </button>
        `;

        document.body.appendChild(moodSelector);

        // Handle mood selection
        moodSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('mood-btn') || e.target.closest('.mood-btn')) {
                const mood = e.target.closest('.mood-btn').dataset.mood;
                
                if (mood === 'silent') {
                    // User chose no sound - just hide the selector and show minimized icon
                    moodSelector.remove();
                    this.minimizedIcon.style.display = 'block';
                    return;
                }

                // Set mood and start music
                this.state.currentMood = mood;
                this.state.currentTrack = 0;
                moodSelector.remove();
                this.initializeAudio();
                this.updateUI();
            }
        });

        // Auto-remove selector after 10 seconds if no interaction
        setTimeout(() => {
            if (document.contains(moodSelector)) {
                moodSelector.remove();
                this.minimizedIcon.style.display = 'block';
            }
        }, 10000);
    }

    setupCardEventListeners() {
        this.musicCard.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.closest('[data-action]')?.dataset.action;
            
            switch (action) {
                case 'playpause':
                    this.togglePlayback();
                    break;
                case 'previous':
                    this.previousTrack();
                    break;
                case 'next':
                    this.nextTrack();
                    break;
                case 'like':
                    this.toggleLike();
                    break;
                case 'comments':
                    this.toggleComments();
                    break;
                case 'settings':
                    this.toggleSettings();
                    break;
                case 'minimize':
                    this.minimizeCard();
                    break;
                case 'close':
                    this.closeCard();
                    break;
                case 'seek':
                    this.handleSeek(e);
                    break;
                case 'skip-back':
                    this.skipBackward();
                    break;
                case 'skip-forward':
                    this.skipForward();
                    break;
                case 'shuffle':
                    this.toggleShuffle();
                    break;
                case 'repeat':
                    this.toggleRepeat();
                    break;
                case 'volume':
                    this.handleVolumeChange(e);
                    break;
            }

            // Handle speed buttons
            if (e.target.dataset.speed) {
                this.setPlaybackRate(parseFloat(e.target.dataset.speed));
            }
        });

        // Handle comment input
        this.musicCard.addEventListener('keypress', (e) => {
            if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
                this.addComment(e.target.value.trim());
                e.target.value = '';
            }
        });

        // Make card draggable
        this.setupDragging();
    }

    setupDragging() {
        let isDragging = false;
        let startX, startY, startRight, startBottom;

        const startDrag = (e) => {
            if (e.target.closest('.control-btn, .window-btn, .progress-bar, .volume-slider')) return;
            
            isDragging = true;
            this.state.isDragging = true;
            this.musicCard.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            startRight = parseInt(this.musicCard.style.right);
            startBottom = parseInt(this.musicCard.style.bottom);
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);
        };

        const drag = (e) => {
            if (!isDragging) return;
            
            const deltaX = startX - e.clientX;
            const deltaY = e.clientY - startY;
            
            let newRight = startRight + deltaX;
            let newBottom = startBottom + deltaY;
            
            // Boundary constraints
            newRight = Math.max(0, Math.min(window.innerWidth - 280, newRight));
            newBottom = Math.max(0, Math.min(window.innerHeight - 160, newBottom));
            
            this.musicCard.style.right = `${newRight}px`;
            this.musicCard.style.bottom = `${newBottom}px`;
        };

        const endDrag = () => {
            isDragging = false;
            this.state.isDragging = false;
            this.musicCard.classList.remove('dragging');
            
            // Update position state
            this.state.position.right = this.musicCard.style.right;
            this.state.position.bottom = this.musicCard.style.bottom;
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
        };

        this.musicCard.addEventListener('mousedown', startDrag);
    }

    initializeAudio() {
        const currentTrack = this.getCurrentTrack();
        
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }

        this.audioElement = new Audio();
        this.audioElement.src = currentTrack.file;
        this.audioElement.volume = this.state.volume;
        this.audioElement.playbackRate = this.state.playbackRate;
        
        // Audio event listeners
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.state.duration = this.audioElement.duration;
            this.updateUI();
        });

        this.audioElement.addEventListener('timeupdate', () => {
            this.state.currentTime = this.audioElement.currentTime;
            this.updateProgressBar();
        });

        this.audioElement.addEventListener('ended', () => {
            if (this.state.repeat === 'one') {
                this.audioElement.currentTime = 0;
                this.audioElement.play();
            } else {
                this.nextTrack();
            }
        });

        this.audioElement.addEventListener('error', () => {
            console.warn(`Failed to load audio: ${currentTrack.file}`);
            this.nextTrack(); // Try next track
        });

        // Auto-play
        this.audioElement.play().then(() => {
            this.state.isPlaying = true;
            this.updateUI();
            this.trackAnalytics('track_started', currentTrack);
        }).catch(e => {
            console.warn('Autoplay blocked:', e);
            this.updateUI();
        });
    }

    togglePlayback() {
        if (!this.audioElement) {
            this.initializeAudio();
            return;
        }

        if (this.state.isPlaying) {
            this.audioElement.pause();
            this.state.isPlaying = false;
        } else {
            this.audioElement.play().then(() => {
                this.state.isPlaying = true;
            });
        }
        
        this.updateUI();
        this.trackAnalytics('playback_toggled', { playing: this.state.isPlaying });
    }

    previousTrack() {
        const tracks = this.getCurrentMoodTracks();
        
        if (this.state.shuffle) {
            this.state.currentTrack = Math.floor(Math.random() * tracks.length);
        } else {
            this.state.currentTrack = this.state.currentTrack > 0 
                ? this.state.currentTrack - 1 
                : tracks.length - 1;
        }
        
        this.initializeAudio();
        this.trackAnalytics('track_changed', { direction: 'previous' });
    }

    nextTrack() {
        const tracks = this.getCurrentMoodTracks();
        
        if (this.state.shuffle) {
            this.state.currentTrack = Math.floor(Math.random() * tracks.length);
        } else {
            this.state.currentTrack = (this.state.currentTrack + 1) % tracks.length;
        }
        
        this.initializeAudio();
        this.trackAnalytics('track_changed', { direction: 'next' });
    }

    skipBackward() {
        if (this.audioElement) {
            this.audioElement.currentTime = Math.max(0, this.audioElement.currentTime - 10);
        }
    }

    skipForward() {
        if (this.audioElement) {
            this.audioElement.currentTime = Math.min(
                this.audioElement.duration, 
                this.audioElement.currentTime + 10
            );
        }
    }

    setPlaybackRate(rate) {
        this.state.playbackRate = rate;
        if (this.audioElement) {
            this.audioElement.playbackRate = rate;
        }
        this.updateUI();
    }

    toggleLike() {
        this.state.isLiked = !this.state.isLiked;
        this.updateUI();
        this.trackAnalytics('track_liked', { 
            liked: this.state.isLiked,
            track: this.getCurrentTrack().title 
        });
    }

    toggleShuffle() {
        this.state.shuffle = !this.state.shuffle;
        this.updateUI();
    }

    toggleRepeat() {
        const states = ['off', 'one', 'all'];
        const currentIndex = states.indexOf(this.state.repeat);
        this.state.repeat = states[(currentIndex + 1) % states.length];
        this.updateUI();
    }

    toggleComments() {
        this.state.showComments = !this.state.showComments;
        this.state.showSettings = false; // Close settings if open
        this.updateUI();
    }

    toggleSettings() {
        this.state.showSettings = !this.state.showSettings;
        this.state.showComments = false; // Close comments if open
        this.updateUI();
    }

    handleSeek(e) {
        if (!this.audioElement || !this.state.duration) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.state.duration;
        
        this.audioElement.currentTime = newTime;
        this.state.currentTime = newTime;
        this.updateProgressBar();
    }

    handleVolumeChange(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        this.state.volume = percentage;
        if (this.audioElement) {
            this.audioElement.volume = percentage;
        }
        this.updateUI();
    }

    addComment(text) {
        if (text.length === 0 || text.length > 150) return;
        
        const comment = {
            text: text,
            user: 'Anonymous',
            timestamp: Date.now()
        };
        
        this.comments.unshift(comment);
        if (this.comments.length > 10) {
            this.comments = this.comments.slice(0, 10);
        }
        
        this.updateUI();
        this.trackAnalytics('comment_added', { text });
    }

    minimizeCard() {
        if (!this.musicCard) return;
        
        this.musicCard.remove();
        this.musicCard = null;
        this.minimizedIcon.style.display = 'block';
        this.minimizedIcon.style.right = this.state.position.right;
        this.minimizedIcon.style.bottom = this.state.position.bottom;
    }

    showMusicCard() {
        if (this.musicCard) return;
        
        this.minimizedIcon.style.display = 'none';
        this.createMusicCard();
    }

    closeCard() {
        if (this.musicCard) {
            this.musicCard.remove();
            this.musicCard = null;
        }
        
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        
        this.minimizedIcon.style.display = 'block';
        // Note: No localStorage saving - user can always click the icon again
    }

    updateUI() {
        if (!this.musicCard) return;
        this.renderMusicCard();
        this.setupCardEventListeners();
    }

    updateProgressBar() {
        if (!this.musicCard) return;
        
        const progress = this.state.duration > 0 ? (this.state.currentTime / this.state.duration) * 100 : 0;
        const progressFill = this.musicCard.querySelector('.progress-fill');
        const progressHandle = this.musicCard.querySelector('.progress-handle');
        const timeDisplay = this.musicCard.querySelector('.time-display');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressHandle) progressHandle.style.left = `${progress}%`;
        if (timeDisplay) {
            timeDisplay.textContent = `${this.formatTime(this.state.currentTime)} / ${this.formatTime(this.state.duration)}`;
        }
    }

    getCurrentTrack() {
        const tracks = this.getCurrentMoodTracks();
        return tracks[this.state.currentTrack] || tracks[0];
    }

    getCurrentMoodTracks() {
        if (this.state.currentMood === 'surprise') {
            // Mix tracks from all moods
            const allTracks = [];
            Object.values(this.trackLibrary).forEach(moodTracks => {
                allTracks.push(...moodTracks);
            });
            return allTracks;
        }
        
        return this.trackLibrary[this.state.currentMood] || this.trackLibrary['calm-focus'];
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'just now';
    }

    trackAnalytics(event, data = {}) {
        this.analytics.interactions.push({
            event,
            data,
            timestamp: Date.now()
        });
        
        // Console log for debugging (remove in production)
        console.log(`🎵 FrankPort Music Analytics:`, event, data);
    }

    handleScroll() {
        // Update scroll progress for future features
        const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // Could add scroll-based features here
    }

    handleResize() {
        // Adjust card position if it goes off-screen
        if (this.musicCard) {
            const rect = this.musicCard.getBoundingClientRect();
            let right = parseInt(this.musicCard.style.right);
            let bottom = parseInt(this.musicCard.style.bottom);
            
            if (rect.left < 0) {
                right = window.innerWidth - 280 - 20;
                this.musicCard.style.right = `${right}px`;
            }
            
            if (rect.top < 0) {
                bottom = 20;
                this.musicCard.style.bottom = `${bottom}px`;
            }
            
            this.state.position.right = `${right}px`;
            this.state.position.bottom = `${bottom}px`;
        }
        
        // Update minimized icon position
        if (this.minimizedIcon) {
            this.minimizedIcon.style.right = this.state.position.right;
            this.minimizedIcon.style.bottom = this.state.position.bottom;
        }
    }

    handleKeydown(e) {
        // Keyboard shortcuts (only when card is visible)
        if (!this.musicCard) return;
        
        switch (e.code) {
            case 'Space':
                if (!e.target.matches('input, textarea')) {
                    e.preventDefault();
                    this.togglePlayback();
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.previousTrack();
                }
                break;
            case 'ArrowRight':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.nextTrack();
                }
                break;
            case 'Escape':
                this.minimizeCard();
                break;
        }
    }

    // Public API for external control
    play() { 
        if (!this.state.isPlaying) this.togglePlayback(); 
    }
    
    pause() { 
        if (this.state.isPlaying) this.togglePlayback(); 
    }
    
    show() { 
        this.showMusicCard(); 
    }
    
    hide() { 
        this.minimizeCard(); 
    }
    
    setVolume(volume) {
        this.state.volume = Math.max(0, Math.min(1, volume));
        if (this.audioElement) {
            this.audioElement.volume = this.state.volume;
        }
        this.updateUI();
    }

    destroy() {
        // Cleanup method
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        
        if (this.musicCard) {
            this.musicCard.remove();
        }
        
        if (this.minimizedIcon) {
            this.minimizedIcon.remove();
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.boundHandlers.scroll);
        window.removeEventListener('resize', this.boundHandlers.resize);
        document.removeEventListener('keydown', this.boundHandlers.keydown);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.FrankPortMusic = new FrankPortMusicExperience();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.FrankPortMusic) {
            window.FrankPortMusic = new FrankPortMusicExperience();
        }
    });
} else {
    // DOM is already ready
    if (!window.FrankPortMusic) {
        window.FrankPortMusic = new FrankPortMusicExperience();
    }
}