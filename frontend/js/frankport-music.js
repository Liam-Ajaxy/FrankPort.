/*!
 * 🎵 FrankPort Music Experience - Enhanced Version
 * Added: Like counting, Settings panel, Preserved original design
 */

class FrankPortMusicExperience {
    constructor() {
        this.isMinimized = false;
        this.isCommentsOpen = false;
        this.isSettingsOpen = false;
        this.currentTrack = 0;
        this.isPlaying = false;
        this.volume = 0.8;
        this.playbackRate = 1;
        this.isShuffled = false;
        this.repeatMode = 'off'; // 'off', 'one', 'all'
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.comments = [];
        this.commentCount = 0;
        this.likeCount = Math.floor(Math.random() * 51) + 10; // Random likes 10-60
        this.userLiked = false;
        
        // Audio playlists
        this.playlists = {
            focus: [
                { title: 'Deep Focus', artist: 'Ambient Sounds', file: 'calm-focus-1.mp3' },
                { title: 'Coding Flow', artist: 'Lo-Fi Beats', file: 'calm-focus-2.mp3' },
                { title: 'Peaceful Mind', artist: 'Nature Sounds', file: 'calm-focus-3.mp3' }
            ],
            energy: [
                { title: 'Power Up', artist: 'Electronic Vibes', file: 'energetic-1.mp3' },
                { title: 'Get Moving', artist: 'Upbeat Mix', file: 'energetic-2.mp3' },
                { title: 'High Energy', artist: 'Dance Beats', file: 'energetic-3.mp3' }
            ],
            ambient: [
                { title: 'Space Dreams', artist: 'Cosmic Sounds', file: 'ambient-1.mp3' },
                { title: 'Ocean Waves', artist: 'Natural Ambience', file: 'ambient-2.mp3' },
                { title: 'Night Rain', artist: 'Weather Sounds', file: 'ambient-3.mp3' }
            ]
        };
        
        this.currentPlaylist = 'focus';
        this.audio = null;
        this.musicCard = null;
        this.commentsPanel = null;
        this.settingsCard = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeExperience());
        } else {
            this.initializeExperience();
        }
    }

    initializeExperience() {
        this.injectFontAwesome();
        this.injectStyles();
        this.createMusicCard();
        this.createSettingsCard();
        this.setupAudioSystem();
        this.setupEventListeners();
        this.loadCommentsFromStorage();
        this.loadLikeData();
        this.loadSettings();
        this.hideCard(); // Start hidden
    }

    injectFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(faLink);
        }
    }

    injectStyles() {
        const styles = `
            :root {
                /* Colors - Dark Professional Theme */
                --primary-navy: #0D0D0D;
                --secondary-charcoal: #0D0D0D;
                --accent-gold: #ffa200;
                --text-primary: #ffffff;
                --text-secondary: #b8bcc8;
                --text-muted: #6c7293;
                --border-color: #2d3142;
                --shadow-light: rgba(244, 208, 63, 0.1);
                --shadow-dark: rgba(0, 0, 0, 0.3);
                --gradient-primary: #0D0D0D;
                --gradient-accent: linear-gradient(135deg, #ffa200 0%, #f39c12 100%);
                --gradient-hover: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
                --admin-bg: #191919;
                --admin-light-bg: #1c1c1c;
                --light-mode-bg: #f5f5f5;
                --light-mode-text: #333333;
                --light-mode-border: #ddd;
                --light-mode-accent: #ff9800;
                --light-mode-accent-hover: #e68900;
                --light-mode-shadow: rgba(0, 0, 0, 0.1);
            }
                
            .frankport-music-card {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 280px;
                height: 140px;
                background: var(--admin-bg);
                backdrop-filter: blur(15px);
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                z-index: 9999;
                cursor: move;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                user-select: none;
            }
            body.light-mode .frankport-music-card {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
            }

            .frankport-music-card.minimized {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                background: var(--accent-gold);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.27);
            }
            body.light-mode .frankport-music-card.minimized {
                background: var(--text-primary);
                box-shadow: 0 4px 15px var(--light-mode-shadow);
            }

            .frankport-music-card.minimized .music-content {
                display: none;
            }

            .frankport-music-card.minimized .minimized-icon {
                display: flex !important;
            }

            .minimized-icon {
                display: none;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                color: white;
                font-size: 18px;
            }

            .minimized-icon i {
                animation: musicPulse 2s infinite;
            }

            @keyframes musicPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .music-header {
                display: flex;
                align-items: center;
                padding: 12px;
                gap: 10px;
                border-bottom: 1px solid rgba(0,0,0,0.08);
            }

            .album-art {
                width: 40px;
                height: 40px;
                background: var(--admin-light-bg);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                flex-shrink: 0;
                border: 1px solid var(--border-color);
            }
            body.light-mode .album-art {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
                color: var(--text-primary);
            }

            .track-info {
                flex: 1;
                min-width: 0;
            }

            .track-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
                margin: 0 0 2px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .track-artist {
                font-size: 11px;
                color: #666;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .header-controls {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }

            .control-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 6px;
                border-radius: 6px;
                color: #666;
                font-size: 14px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 24px;
                height: 24px;
                position: relative;
            }

            .control-btn:hover {
                background: rgba(0,0,0,0.05);
                color: var(--text-primary);
                transform: scale(1.05);
            }

            .control-btn.active {
                color: var(--accent-gold);
                background: rgba(102, 126, 234, 0.1);
            }

            /* Like Count Display */
            .like-count {
                position: absolute;
                top: -2px;
                right: -6px;
                background: var(--accent-gold);
                color: white;
                font-size: 8px;
                padding: 1px 4px;
                border-radius: 8px;
                min-width: 12px;
                text-align: center;
                font-weight: 600;
                line-height: 1.2;
            }
            body.light-mode .like-count {
                background: var(--text-primary);
                color: white;
            }

            .controls-section {
                padding: 8px 12px 12px 12px;
            }

            .playback-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .main-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .play-btn {
                background: var(--admin-light-bg);
                color: white;
                border: 1px solid var(--border-color);
                width: 32px;
                height: 32px;
                border-radius: 16px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            body.light-mode .play-btn {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
                color: var(--text-primary);
            }

            .play-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 2px 8px var(--accent-gold);
            }

            .side-controls {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 11px;
                color: #666;
            }

            .volume-control {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .volume-slider {
                width: 40px;
                height: 3px;
                background: #ddd;
                border-radius: 2px;
                cursor: pointer;
                position: relative;
            }

            .volume-fill {
                height: 100%;
                background: var(--accent-gold);
                border-radius: 2px;
                transition: width 0.2s;
            }

            .progress-section {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .progress-bar {
                flex: 1;
                height: 4px;
                background: #e5e5e5;
                border-radius: 2px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: var(--accent-gold);
                border-radius: 2px;
                width: 0%;
                transition: width 0.1s linear;
            }

            .time-display {
                font-size: 10px;
                color: #888;
                font-variant-numeric: tabular-nums;
                min-width: 35px;
            }

            .card-controls {
                position: absolute;
                top: 8px;
                right: 8px;
                display: flex;
                gap: 4px;
            }

            .card-control-btn {
                background: var(--admin-light-bg);
                border: none;
                width: 20px;
                height: 18px;
                top: 0;
                margin: 0;
                padding: 0;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                color: #666;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            body.light-mode .card-control-btn {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
                color: var(--text-primary);
                top: 0;
                margin: 0;
                padding: 0;
            }

            .card-control-btn:hover {
                background: rgba(58, 58, 58, 0.95);
                color: white;
            }
            body.light-mode .card-control-btn:hover {
                background: var(--light-mode-accent-hover);
                color: white;
            }

            .comments-panel {
                position: fixed;
                width: 220px;
                height: 300px;
                background: var(--admin-bg);
                backdrop-filter: blur(15px);
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                border: 1px solid var(--border-color);
                z-index: 10001;
                display: none;
                flex-direction: column;
                overflow: hidden;
            }
            body.light-mode .comments-panel {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
            }

            .comments-header {
                padding: 12px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--admin-light-bg);
            }
            body.light-mode .comments-header { 
                background: var(--light-mode-bg);
                border-bottom: 1px solid var(--light-mode-border); 
            }

            .comments-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
                margin: 0;
            }

            .comments-count {
                font-size: 11px;
                color: var(--text-primary);
                background: var(--accent-gold);
                padding: 2px 6px;
                border-radius: 10px;
            }
            body.light-mode .comments-count {
                background: var(--text-primary);
                color: white;
            }

            .comments-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            .comment-item {
                margin-bottom: 12px;
                padding: 8px;
                background: var(--admin-light-bg);
                border-radius: 8px;
                border-left: 3px solid var(--accent-gold);
            }
            body.light-mode .comment-item {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
                border-left: 3px solid var(--text-primary);
            }

            .comment-text {
                font-size: 11px;
                color: var(--text-muted);
                margin: 0 0 4px 0;
                line-height: 1.4;
                word-wrap: break-word;
            }

            .comment-meta {
                font-size: 9px;
                color: #888;
                margin: 0;
            }

            .comment-input-area {
                padding: 12px;
                border-top: 1px solid rgba(0,0,0,0.08);
                background: var(--admin-light-bg);
            }
            body.light-mode .comment-input-area {  
                background: var(--light-mode-bg);
                border-top: 1px solid var(--light-mode-border);
            }

            .comment-input {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 11px;
                resize: none;
                height: 40px;
                font-family: inherit;
                background: var(--admin-bg);
                color: var(--text-primary);
            }
            body.light-mode .comment-input {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
                color: var(--text-primary);
            }

            .comment-input:focus {
                outline: none;
                border-color: var(--text-muted);
            }

            .comment-submit {
                margin-top: 6px;
                width: 100%;
                padding: 6px;
                background: var(--accent-gold);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s;
            }
            body.light-mode .comment-submit {
                background: var(--text-primary);
                color: white;
            }

            .comment-submit:hover {
                transform: translateY(-1px);
            }
            body.light-mode .comment-submit:hover {
                background: var(--light-mode-accent-hover);
                color: white;
                transform: translateY(-1px);
            }

            /* Settings Card - New Component */
            .music-settings-card {
                position: fixed;
                width: 200px;
                background: var(--admin-bg);
                backdrop-filter: blur(15px);
                border-radius: 8px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                border: 1px solid var(--border-color);
                z-index: 10002;
                display: none;
                padding: 12px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            body.light-mode .music-settings-card {
                background: var(--light-mode-bg);
                border: 1px solid var(--light-mode-border);
            }

            .settings-section {
                margin-bottom: 12px;
            }

            .settings-section:last-child {
                margin-bottom: 0;
            }

            .settings-section h4 {
                font-size: 11px;
                color: var(--text-secondary);
                margin: 0 0 6px 0;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .settings-controls {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }

            .settings-btn {
                background: none;
                border: none;
                color: #666;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 36px;
                text-align: center;
            }
            body.light-mode .settings-btn {
                background: none;
                border: none;
                color: var(--text-primary);
            }

            .settings-btn:hover {
                background: rgba(0,0,0,0.05);
                color: var(--text-primary);
                transform: scale(1.05);
            }

            .settings-btn.active {
                background: var(--accent-gold);
                color: white;
                border-color: var(--accent-gold);
            }
            body.light-mode .settings-btn.active {
                background: var(--text-primary);
                color: white;
            }

            @media (max-width: 768px) {
                .frankport-music-card {
                    width: 240px;
                    height: 120px;
                    bottom: 15px;
                    right: 15px;
                }
                
                .comments-panel {
                    width: 200px;
                    height: 280px;
                }
                
                .control-btn {
                    min-width: 28px;
                    height: 28px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createMusicCard() {
        const card = document.createElement('div');
        card.className = 'frankport-music-card';
        card.innerHTML = `
            <div class="minimized-icon">
                <i class="fas fa-music"></i>
            </div>
            <div class="music-content">
                <div class="card-controls">
                    <button class="card-control-btn minimize-btn" title="Minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="card-control-btn close-btn" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="music-header">
                    <div class="album-art">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="track-info">
                        <h4 class="track-title">Deep Focus</h4>
                        <p class="track-artist">Ambient Sounds</p>
                    </div>
                    <div class="header-controls">
                        <button class="control-btn like-btn" title="Like">
                            <i class="far fa-heart"></i>
                            <span class="like-count" style="display: none;">0</span>
                        </button>
                        <button class="control-btn comments-btn" title="Comments">
                            <i class="far fa-comment"></i>
                        </button>
                        <button class="control-btn settings-btn" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
                <div class="controls-section">
                    <div class="playback-controls">
                        <div class="main-controls">
                            <button class="control-btn prev-btn" title="Previous">
                                <i class="fas fa-step-backward"></i>
                            </button>
                            <button class="play-btn" title="Play/Pause">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="control-btn next-btn" title="Next">
                                <i class="fas fa-step-forward"></i>
                            </button>
                        </div>
                        <div class="side-controls">
                            <div class="volume-control">
                                <i class="fas fa-volume-up"></i>
                                <div class="volume-slider">
                                    <div class="volume-fill" style="width: 80%"></div>
                                </div>
                            </div>
                            <span class="time-display">0:00</span>
                        </div>
                    </div>
                    <div class="progress-section">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(card);
        this.musicCard = card;
        
        // Create comments panel
        this.createCommentsPanel();
    }

    createCommentsPanel() {
        const panel = document.createElement('div');
        panel.className = 'comments-panel';
        panel.innerHTML = `
            <div class="comments-header">
                <h3 class="comments-title">Comments</h3>
                <span class="comments-count">0</span>
                <button class="control-btn close-comments-btn" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="comments-list"></div>
            <div class="comment-input-area">
                <textarea class="comment-input" placeholder="Add a comment..." maxlength="120"></textarea>
                <button class="comment-submit">Post Comment</button>
            </div>
        `;

        document.body.appendChild(panel);
        this.commentsPanel = panel;
    }

    createSettingsCard() {
        const settingsCard = document.createElement('div');
        settingsCard.className = 'music-settings-card';
        settingsCard.innerHTML = `
            <div class="settings-section">
                <h4>Speed</h4>
                <div class="settings-controls">
                    <button class="settings-btn speed-btn" data-speed="0.5">0.5x</button>
                    <button class="settings-btn speed-btn" data-speed="0.75">0.75x</button>
                    <button class="settings-btn speed-btn active" data-speed="1">1x</button>
                    <button class="settings-btn speed-btn" data-speed="1.25">1.25x</button>
                    <button class="settings-btn speed-btn" data-speed="1.5">1.5x</button>
                    <button class="settings-btn speed-btn" data-speed="2">2x</button>
                </div>
            </div>
            <div class="settings-section">
                <h4>Skip Controls</h4>
                <div class="settings-controls">
                    <button class="settings-btn skip-btn" data-skip="-10">-10s</button>
                    <button class="settings-btn skip-btn" data-skip="-5">-5s</button>
                    <button class="settings-btn skip-btn" data-skip="5">+5s</button>
                    <button class="settings-btn skip-btn" data-skip="10">+10s</button>
                </div>
            </div>
            <div class="settings-section">
                <h4>Playback</h4>
                <div class="settings-controls">
                    <button class="settings-btn mode-btn shuffle-btn" data-mode="shuffle">
                        <i class="fas fa-random"></i> Shuffle
                    </button>
                    <button class="settings-btn mode-btn repeat-btn" data-mode="repeat">
                        <i class="fas fa-repeat"></i> Repeat
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(settingsCard);
        this.settingsCard = settingsCard;
    }

    setupAudioSystem() {
        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.loadTrack();
        
        // Audio event listeners
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('ended', () => {
            this.handleTrackEnd();
        });

        this.audio.addEventListener('loadstart', () => {
            this.updateTrackInfo();
        });
    }

    setupEventListeners() {
        const card = this.musicCard;
        const commentsPanel = this.commentsPanel;
        const settingsCard = this.settingsCard;

        // Card controls
        card.querySelector('.minimize-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMinimize();
        });

        card.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideCard();
        });

        // When minimized, click to maximize
        card.addEventListener('click', (e) => {
            if (this.isMinimized && !this.isDragging) {
                this.toggleMinimize();
            }
        });

        // Playback controls
        card.querySelector('.play-btn').addEventListener('click', () => {
            this.togglePlay();
        });

        card.querySelector('.prev-btn').addEventListener('click', () => {
            this.previousTrack();
        });

        card.querySelector('.next-btn').addEventListener('click', () => {
            this.nextTrack();
        });

        // Progress bar
        const progressBar = card.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            this.seekToPosition(percentage);
        });

        // Volume control
        const volumeSlider = card.querySelector('.volume-slider');
        volumeSlider.addEventListener('click', (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            this.setVolume(percentage);
        });

        // Header controls
        card.querySelector('.like-btn').addEventListener('click', () => {
            this.toggleLike();
        });

        card.querySelector('.comments-btn').addEventListener('click', () => {
            this.toggleComments();
        });

        card.querySelector('.settings-btn').addEventListener('click', () => {
            this.toggleSettings();
        });

        // Comments panel
        commentsPanel.querySelector('.close-comments-btn').addEventListener('click', () => {
            this.closeComments();
        });

        commentsPanel.querySelector('.comment-submit').addEventListener('click', () => {
            this.submitComment();
        });

        // Comment input
        const commentInput = commentsPanel.querySelector('.comment-input');
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitComment();
            }
        });

        // Settings card event listeners
        // Speed controls
        settingsCard.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.dataset.speed);
                this.setPlaybackSpeed(speed);
                settingsCard.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Skip controls
        settingsCard.querySelectorAll('.skip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const skipAmount = parseInt(btn.dataset.skip);
                this.skipTime(skipAmount);
            });
        });

        // Mode controls
        settingsCard.querySelector('.shuffle-btn').addEventListener('click', () => {
            this.toggleShuffle();
        });

        settingsCard.querySelector('.repeat-btn').addEventListener('click', () => {
            this.toggleRepeat();
        });

        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isSettingsOpen && !settingsCard.contains(e.target) && !card.querySelector('.settings-btn').contains(e.target)) {
                this.closeSettings();
            }
        });

        // Dragging functionality
        this.setupDragging();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                if (card.style.display === 'none') {
                    this.showMusicCard();
                } else {
                    this.toggleMinimize();
                }
            }
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }

    setupDragging() {
        const card = this.musicCard;
        
        card.addEventListener('mousedown', (e) => {
            if (e.target.closest('.control-btn') || e.target.closest('.card-control-btn')) return;
            
            this.isDragging = true;
            const rect = card.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            
            document.addEventListener('mousemove', this.handleDrag.bind(this));
            document.addEventListener('mouseup', this.handleDragEnd.bind(this));
            
            card.style.cursor = 'grabbing';
            e.preventDefault();
        });
    }

    handleDrag(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - this.musicCard.offsetWidth;
        const maxY = window.innerHeight - this.musicCard.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(x, maxX));
        const constrainedY = Math.max(0, Math.min(y, maxY));
        
        this.musicCard.style.left = constrainedX + 'px';
        this.musicCard.style.top = constrainedY + 'px';
        this.musicCard.style.right = 'auto';
        this.musicCard.style.bottom = 'auto';
    }

    handleDragEnd() {
        this.isDragging = false;
        this.musicCard.style.cursor = 'move';
        document.removeEventListener('mousemove', this.handleDrag.bind(this));
        document.removeEventListener('mouseup', this.handleDragEnd.bind(this));
    }

    loadTrack() {
        const currentPlaylist = this.playlists[this.currentPlaylist];
        const track = currentPlaylist[this.currentTrack];
        this.audio.src = `assets/audio/${track.file}`;
        this.updateTrackInfo();
    }

    updateTrackInfo() {
        const currentPlaylist = this.playlists[this.currentPlaylist];
        const track = currentPlaylist[this.currentTrack];
        
        this.musicCard.querySelector('.track-title').textContent = track.title;
        this.musicCard.querySelector('.track-artist').textContent = track.artist;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.musicCard.querySelector('.play-btn i').className = 'fas fa-play';
        } else {
            this.audio.play();
            this.isPlaying = true;
            this.musicCard.querySelector('.play-btn i').className = 'fas fa-pause';
        }
    }

    previousTrack() {
        this.currentTrack = this.currentTrack > 0 ? this.currentTrack - 1 : this.playlists[this.currentPlaylist].length - 1;
        this.loadTrack();
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    nextTrack() {
        const currentPlaylist = this.playlists[this.currentPlaylist];
        
        if (this.isShuffled) {
            // Random track selection
            let newTrack;
            do {
                newTrack = Math.floor(Math.random() * currentPlaylist.length);
            } while (newTrack === this.currentTrack && currentPlaylist.length > 1);
            this.currentTrack = newTrack;
        } else {
            this.currentTrack = (this.currentTrack + 1) % currentPlaylist.length;
        }
        
        this.loadTrack();
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    handleTrackEnd() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeatMode === 'all') {
            this.nextTrack();
        } else {
            this.isPlaying = false;
            this.musicCard.querySelector('.play-btn i').className = 'fas fa-play';
        }
    }

    seekToPosition(percentage) {
        if (this.audio.duration) {
            this.audio.currentTime = percentage * this.audio.duration;
        }
    }

    setVolume(percentage) {
        this.volume = Math.max(0, Math.min(1, percentage));
        this.audio.volume = this.volume;
        this.musicCard.querySelector('.volume-fill').style.width = (this.volume * 100) + '%';
    }

    updateProgress() {
        if (this.audio.duration) {
            const percentage = (this.audio.currentTime / this.audio.duration) * 100;
            this.musicCard.querySelector('.progress-fill').style.width = percentage + '%';
        }
    }

    updateTimeDisplay() {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        const current = this.audio.currentTime || 0;
        const duration = this.audio.duration || 0;
        
        this.musicCard.querySelector('.time-display').textContent = 
            duration > 0 ? `${formatTime(current)}/${formatTime(duration)}` : '0:00';
    }

    // Enhanced like functionality with counting
    toggleLike() {
        const likeBtn = this.musicCard.querySelector('.like-btn i');
        const likeCountSpan = this.musicCard.querySelector('.like-count');
        
        if (this.userLiked) {
            // Unlike
            likeBtn.className = 'far fa-heart';
            this.musicCard.querySelector('.like-btn').classList.remove('active');
            this.likeCount--;
            this.userLiked = false;
        } else {
            // Like
            likeBtn.className = 'fas fa-heart';
            this.musicCard.querySelector('.like-btn').classList.add('active');
            this.likeCount++;
            this.userLiked = true;
        }
        
        // Update like count display
        this.updateLikeCount();
        this.saveLikeData();
    }

    updateLikeCount() {
        const likeCountSpan = this.musicCard.querySelector('.like-count');
        const formattedCount = this.formatCount(this.likeCount);
        
        if (this.likeCount > 0) {
            likeCountSpan.textContent = formattedCount;
            likeCountSpan.style.display = 'block';
        } else {
            likeCountSpan.style.display = 'none';
        }
    }

    formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    saveLikeData() {
        try {
            const data = {
                likeCount: this.likeCount,
                userLiked: this.userLiked
            };
            sessionStorage.setItem('frankport-music-likes', JSON.stringify(data));
        } catch (e) {
            window.frankportMusicLikes = { likeCount: this.likeCount, userLiked: this.userLiked };
        }
    }

    loadLikeData() {
        try {
            const stored = sessionStorage.getItem('frankport-music-likes') || 
                          (window.frankportMusicLikes ? JSON.stringify(window.frankportMusicLikes) : null);
            
            if (stored) {
                const data = JSON.parse(stored);
                this.likeCount = data.likeCount || this.likeCount;
                this.userLiked = data.userLiked || false;
                
                // Update UI
                if (this.userLiked) {
                    this.musicCard.querySelector('.like-btn i').className = 'fas fa-heart';
                    this.musicCard.querySelector('.like-btn').classList.add('active');
                }
                this.updateLikeCount();
            } else {
                this.updateLikeCount();
            }
        } catch (e) {
            this.updateLikeCount();
        }
    }

    // Settings functionality
    toggleSettings() {
        if (this.isSettingsOpen) {
            this.closeSettings();
        } else {
            this.openSettings();
        }
    }

    openSettings() {
        this.isSettingsOpen = true;
        this.settingsCard.style.display = 'block';
        
        // Position near the settings button
        const settingsBtn = this.musicCard.querySelector('.settings-btn');
        const btnRect = settingsBtn.getBoundingClientRect();
        
        let left = btnRect.left - 150;
        let top = btnRect.bottom + 5;
        
        // Adjust if off-screen
        if (left < 10) {
            left = btnRect.right + 5;
        }
        
        if (top + 200 > window.innerHeight) {
            top = btnRect.top - 205;
        }
        
        this.settingsCard.style.left = left + 'px';
        this.settingsCard.style.top = top + 'px';
        
        this.musicCard.querySelector('.settings-btn').classList.add('active');
    }

    closeSettings() {
        this.isSettingsOpen = false;
        this.settingsCard.style.display = 'none';
        this.musicCard.querySelector('.settings-btn').classList.remove('active');
    }

    setPlaybackSpeed(speed) {
        this.playbackRate = speed;
        this.audio.playbackRate = speed;
        this.saveSettings();
    }

    skipTime(seconds) {
        if (this.audio.duration) {
            this.audio.currentTime = Math.max(0, Math.min(this.audio.currentTime + seconds, this.audio.duration));
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const shuffleBtn = this.settingsCard.querySelector('.shuffle-btn');
        shuffleBtn.classList.toggle('active', this.isShuffled);
        this.saveSettings();
    }

    toggleRepeat() {
        const repeatModes = ['off', 'all', 'one'];
        const currentIndex = repeatModes.indexOf(this.repeatMode);
        this.repeatMode = repeatModes[(currentIndex + 1) % repeatModes.length];
        
        const repeatBtn = this.settingsCard.querySelector('.repeat-btn');
        const icon = repeatBtn.querySelector('i');
        
        if (this.repeatMode === 'off') {
            repeatBtn.classList.remove('active');
            icon.className = 'fas fa-repeat';
        } else if (this.repeatMode === 'all') {
            repeatBtn.classList.add('active');
            icon.className = 'fas fa-repeat';
        } else { // 'one'
            repeatBtn.classList.add('active');
            icon.className = 'fas fa-repeat-1';
        }
        
        this.saveSettings();
    }

    saveSettings() {
        try {
            const data = {
                playbackRate: this.playbackRate,
                isShuffled: this.isShuffled,
                repeatMode: this.repeatMode
            };
            sessionStorage.setItem('frankport-music-settings', JSON.stringify(data));
        } catch (e) {
            window.frankportMusicSettings = { 
                playbackRate: this.playbackRate, 
                isShuffled: this.isShuffled, 
                repeatMode: this.repeatMode 
            };
        }
    }

    loadSettings() {
        try {
            const stored = sessionStorage.getItem('frankport-music-settings') || 
                          (window.frankportMusicSettings ? JSON.stringify(window.frankportMusicSettings) : null);
            
            if (stored) {
                const data = JSON.parse(stored);
                this.playbackRate = data.playbackRate || 1;
                this.isShuffled = data.isShuffled || false;
                this.repeatMode = data.repeatMode || 'off';
                
                // Apply settings to audio
                this.audio.playbackRate = this.playbackRate;
                
                // Update UI
                this.updateSettingsUI();
            }
        } catch (e) {
            // Use defaults
        }
    }

    updateSettingsUI() {
        // Update speed buttons
        this.settingsCard.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.speed) === this.playbackRate);
        });
        
        // Update shuffle button
        this.settingsCard.querySelector('.shuffle-btn').classList.toggle('active', this.isShuffled);
        
        // Update repeat button
        const repeatBtn = this.settingsCard.querySelector('.repeat-btn');
        const icon = repeatBtn.querySelector('i');
        
        if (this.repeatMode === 'off') {
            repeatBtn.classList.remove('active');
            icon.className = 'fas fa-repeat';
        } else if (this.repeatMode === 'all') {
            repeatBtn.classList.add('active');
            icon.className = 'fas fa-repeat';
        } else { // 'one'
            repeatBtn.classList.add('active');
            icon.className = 'fas fa-repeat-1';
        }
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.musicCard.classList.toggle('minimized', this.isMinimized);
        
        if (this.isCommentsOpen) {
            this.closeComments();
        }
        if (this.isSettingsOpen) {
            this.closeSettings();
        }
    }

    hideCard() {
        this.musicCard.style.display = 'none';
        if (this.isCommentsOpen) {
            this.closeComments();
        }
        if (this.isSettingsOpen) {
            this.closeSettings();
        }
        
        // Create reopen button
        this.createReopenButton();
    }

    createReopenButton() {
        if (document.querySelector('.frankport-reopen-btn')) return;
        
        const reopenBtn = document.createElement('button');
        reopenBtn.className = 'frankport-reopen-btn';
        reopenBtn.innerHTML = '<i class="fas fa-music"></i>';
        reopenBtn.title = 'Open Music Player (Ctrl+M)';
        reopenBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: var(--accent-gold);
            border: none;
            border-radius: 50%;
            color: var(--primary-navy);
            cursor: pointer;
            font-size: 16px;
            z-index: 999;
            transition: all 0.3s;
        `;
        
        reopenBtn.addEventListener('click', () => {
            this.showMusicCard();
            reopenBtn.remove();
        });
        
        reopenBtn.addEventListener('mouseenter', () => {
            reopenBtn.style.transform = 'scale(1.1)';
        });
        
        reopenBtn.addEventListener('mouseleave', () => {
            reopenBtn.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(reopenBtn);
    }

    showMusicCard() {
        this.musicCard.style.display = 'block';
        const reopenBtn = document.querySelector('.frankport-reopen-btn');
        if (reopenBtn) {
            reopenBtn.remove();
        }
    }

    toggleComments() {
        if (this.isCommentsOpen) {
            this.closeComments();
        } else {
            this.openComments();
        }
    }

    openComments() {
        this.isCommentsOpen = true;
        this.commentsPanel.style.display = 'flex';
        
        // Position next to the music card
        const cardRect = this.musicCard.getBoundingClientRect();
        let left = cardRect.left - 240;
        let top = cardRect.top;
        
        // Adjust if off-screen
        if (left < 10) {
            left = cardRect.right + 10;
        }
        
        if (top + 300 > window.innerHeight) {
            top = window.innerHeight - 310;
        }
        
        this.commentsPanel.style.left = left + 'px';
        this.commentsPanel.style.top = top + 'px';
        
        this.musicCard.querySelector('.comments-btn').classList.add('active');
        this.renderComments();
    }

    closeComments() {
        this.isCommentsOpen = false;
        this.commentsPanel.style.display = 'none';
        this.musicCard.querySelector('.comments-btn').classList.remove('active');
    }

    submitComment() {
        const input = this.commentsPanel.querySelector('.comment-input');
        const text = input.value.trim();
        
        if (text) {
            const comment = {
                text: text,
                timestamp: Date.now(),
                author: 'Anonymous'
            };
            
            this.comments.unshift(comment);
            this.commentCount++;
            this.saveCommentsToStorage();
            this.renderComments();
            input.value = '';
            
            // Update comment count display
            this.updateCommentCount();
        }
    }

    renderComments() {
        const commentsList = this.commentsPanel.querySelector('.comments-list');
        
        if (this.comments.length === 0) {
            commentsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666; font-size: 11px;">
                    <i class="far fa-comment" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    No comments yet. Be the first to share your thoughts!
                </div>
            `;
            return;
        }
        
        commentsList.innerHTML = this.comments.map(comment => {
            const timeAgo = this.getTimeAgo(comment.timestamp);
            return `
                <div class="comment-item">
                    <p class="comment-text">${this.escapeHtml(comment.text)}</p>
                    <p class="comment-meta">${comment.author} • ${timeAgo}</p>
                </div>
            `;
        }).join('');
        
        // Auto scroll to bottom for new comments
        commentsList.scrollTop = 0;
    }

    updateCommentCount() {
        this.commentsPanel.querySelector('.comments-count').textContent = this.commentCount;
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveCommentsToStorage() {
        try {
            const data = {
                comments: this.comments,
                count: this.commentCount
            };
            sessionStorage.setItem('frankport-music-comments', JSON.stringify(data));
        } catch (e) {
            // Fallback to memory storage if sessionStorage fails
            window.frankportMusicComments = { comments: this.comments, count: this.commentCount };
        }
    }

    loadCommentsFromStorage() {
        try {
            const stored = sessionStorage.getItem('frankport-music-comments') || 
                          (window.frankportMusicComments ? JSON.stringify(window.frankportMusicComments) : null);
            
            if (stored) {
                const data = JSON.parse(stored);
                this.comments = data.comments || [];
                this.commentCount = data.count || this.comments.length;
                this.updateCommentCount();
            }
        } catch (e) {
            // Initialize empty if loading fails
            this.comments = [];
            this.commentCount = 0;
        }
    }
}

// Auto-initialize when DOM is ready
(function() {
    // Ensure we don't initialize multiple instances
    if (window.frankportMusicInstance) {
        return;
    }
    
    // Initialize the music experience
    window.frankportMusicInstance = new FrankPortMusicExperience();
    
    // Add global method to reinitialize if needed
    window.initFrankPortMusic = function() {
        if (window.frankportMusicInstance) {
            // Clean up existing instance
            const existing = document.querySelector('.frankport-music-card');
            const existingComments = document.querySelector('.comments-panel');
            const existingSettings = document.querySelector('.music-settings-card');
            const existingReopen = document.querySelector('.frankport-reopen-btn');
            
            if (existing) existing.remove();
            if (existingComments) existingComments.remove();
            if (existingSettings) existingSettings.remove();
            if (existingReopen) existingReopen.remove();
        }
        
        window.frankportMusicInstance = new FrankPortMusicExperience();
    };
    
    console.log('🎵 FrankPort Music Experience Enhanced - Ready!');
})();