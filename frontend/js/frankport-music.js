        class FrankPortMusicPlayer {
            constructor() {
                this.isMinimized = false;
                this.isCommentsOpen = false;
                this.isDragging = false;
                this.dragOffset = { x: 0, y: 0 };
                this.commentCount = 0;
                this.comments = [];
                
                this.floatingButton = null;
                this.musicCard = null;
                this.commentsSection = null;
                this.loadingOverlay = null;
                
                this.init();
            }

            init() {
                this.injectStyles();
                this.createFloatingButton();
                this.createMusicCard();
                this.setupEventListeners();
                this.loadCommentsFromStorage();
                this.requestAudioPermission();
            }

            injectStyles() {
                const styles = `
                    :root {
                        --primary-navy: #0D0D0D;
                        --admin-bg: #191919;
                        --admin-light-bg: #1c1c1c;
                        --accent-gold: #ffa200;
                        --text-primary: #ffffff;
                        --text-secondary: #b8bcc8;
                        --text-muted: #6c7293;
                        --border-color: #2d3142;
                    }

                    .frankport-music-floating-btn {
                        position: fixed;
                        bottom: 25px;
                        left: 20px;
                        width: 40px;
                        height: 40px;
                        background: var(--accent-gold);
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 20px;
                        color: #000;
                        z-index: 999;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: musicPulse 2s infinite;
                    }
                    body.light-mode .frankport-music-floating-btn {
                        background: var(--text-primary);
                        color: white;
                    }

                    .frankport-music-floating-btn:hover {
                        transform: scale(1.1);
                        box-shadow: 0 6px 20px rgba(255, 162, 0, 0.4);
                    }

                    .frankport-music-floating-btn::after {
                        content: attr(data-tooltip);
                        position: absolute;
                        bottom: 10px;
                        left: 60px;
                        background: var(--admin-bg);
                        color: var(--text-primary);
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s;
                        border: 1px solid var(--border-color);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    }
                    body.light-mode .frankport-music-floating-btn::after {
                        background: var(--text-primary);
                        color: #ffffff;
                    }

                    .frankport-music-floating-btn::before {
                        content: '';
                        position: absolute;
                        bottom: 18px;
                        left: 52px;
                        width: 0;
                        height: 0;
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                        border-right: 8px solid var(--admin-bg);
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s;
                    }

                    .frankport-music-floating-btn:hover::after,
                    .frankport-music-floating-btn:hover::before {
                        opacity: 1;
                    }

                    @keyframes musicPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }

                    .frankport-music-card {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 400px;
                        height: 450px;
                        background: var(--admin-bg);
                        border-radius: 12px;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        z-index: 9999;
                        cursor: move;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        overflow: hidden;
                        user-select: none;
                        display: none;
                        flex-direction: column;
                    }

                    .frankport-music-card.minimized {
                        width: 280px;
                        height: 380px;
                    }

                    .frankport-music-card.comments-open {
                        width: 600px;
                        flex-direction: row;
                    }

                    .main-content {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        transition: all 0.3s ease;
                    }

                    .frankport-music-card.comments-open .main-content {
                        width: 360px;
                        flex: none;
                    }

                    .music-header {
                        display: flex;
                        align-items: center;
                        padding: 12px;
                        gap: 10px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        flex-shrink: 0;
                        background: var(--admin-light-bg);
                    }

                    .frankport-music-card.comments-open .music-header {
                        border-right: 1px solid rgba(255,255,255,0.1);
                    }

                    .album-art {
                        width: 40px;
                        height: 40px;
                        background: var(--admin-bg);
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--accent-gold);
                        font-size: 16px;
                        flex-shrink: 0;
                        border: 1px solid var(--border-color);
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
                    body.light-mode .track-title {
                        color: #ffffff;
                    }

                    .track-artist {
                        font-size: 11px;
                        color: var(--text-muted);
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
                        color: var(--text-muted);
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
                        background: rgba(255,255,255,0.1);
                        color: var(--text-primary);
                        transform: scale(1.05);
                    }

                    .control-btn.active {
                        color: var(--accent-gold);
                        background: rgba(255, 162, 0, 0.1);
                    }

                    .comment-badge {
                        position: absolute;
                        top: -2px;
                        right: -6px;
                        background: var(--accent-gold);
                        color: #000;
                        font-size: 9px;
                        padding: 1px 5px;
                        border-radius: 10px;
                        min-width: 14px;
                        text-align: center;
                        font-weight: 600;
                        line-height: 1.2;
                        display: none;
                    }

                    .card-control-btn {
                        background: var(--admin-bg);
                        border: none;
                        width: 20px;
                        height: 18px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 10px;
                        color: var(--text-muted);
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .card-control-btn:hover {
                        background: var(--accent-gold);
                        color: #000;
                    }

                    .desktop-only {
                        display: flex;
                    }

                    .audiomack-container {
                        width: 100%;
                        height: 388px;
                        background: var(--admin-light-bg);
                        border-radius: 0;
                        overflow: hidden;
                        position: relative;
                        transition: all 0.3s ease;
                    }

                    .frankport-music-card.comments-open .audiomack-container {
                        height: 388px;
                    }

                    .frankport-music-card.minimized .audiomack-container {
                        height: 318px;
                    }

                    .audiomack-container iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                        background: transparent;
                    }

                    .loading-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(25, 25, 25, 0.95);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        z-index: 10;
                        backdrop-filter: blur(5px);
                        transition: opacity 0.3s ease;
                    }

                    .loading-spinner {
                        width: 40px;
                        height: 40px;
                        margin-bottom: 15px;
                        position: relative;
                    }

                    .loading-spinner::before {
                        content: '🎵';
                        font-size: 30px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        animation: musicSpin 1.5s linear infinite;
                    }

                    .loading-spinner::after {
                        content: '';
                        width: 100%;
                        height: 100%;
                        border: 3px solid rgba(255, 162, 0, 0.2);
                        border-top: 3px solid var(--accent-gold);
                        border-radius: 50%;
                        position: absolute;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @keyframes musicSpin {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }

                    .loading-text {
                        color: var(--text-primary);
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }

                    .loading-subtext {
                        color: var(--text-muted);
                        font-size: 11px;
                    }

                    .comments-section {
                        width: 240px;
                        height: 100%;
                        background: var(--admin-bg);
                        border-left: 1px solid rgba(255,255,255,0.1);
                        display: none;
                        flex-direction: column;
                        flex-shrink: 0;
                    }

                    .frankport-music-card.comments-open .comments-section {
                        display: flex;
                    }

                    .comments-header {
                        padding: 12px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        background: var(--admin-light-bg);
                        flex-shrink: 0;
                    }

                    .comments-title {
                        font-size: 13px;
                        font-weight: 600;
                        color: #ffffff;
                        margin: 0;
                    }

                    .comments-list {
                        flex: 1;
                        overflow-y: auto;
                        padding: 8px 12px;
                        min-height: 0;
                    }

                    .comment-item {
                        margin-bottom: 12px;
                        padding: 8px;
                        background: var(--admin-light-bg);
                        border-radius: 8px;
                        border-left: 3px solid var(--accent-gold);
                    }

                    .comment-text {
                        font-size: 11px;
                        color: var(--text-secondary);
                        margin: 0 0 4px 0;
                        line-height: 1.4;
                        word-wrap: break-word;
                    }

                    .comment-meta {
                        font-size: 9px;
                        color: var(--text-muted);
                        margin: 0;
                    }

                    .comment-input-area {
                        padding: 12px;
                        border-top: 1px solid rgba(255,255,255,0.1);
                        background: var(--admin-light-bg);
                        flex-shrink: 0;
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
                        box-sizing: border-box;
                    }

                    .comment-input:focus {
                        outline: none;
                        border-color: var(--accent-gold);
                    }

                    .comment-input::placeholder {
                        color: var(--text-muted);
                    }

                    .comment-submit {
                        margin-top: 6px;
                        width: 100%;
                        padding: 6px;
                        background: var(--accent-gold);
                        color: #000;
                        border: none;
                        border-radius: 6px;
                        font-size: 11px;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-weight: 600;
                    }

                    .comment-submit:hover {
                        background: #e68900;
                        transform: translateY(-1px);
                    }

                    .no-comments {
                        text-align: center;
                        padding: 20px 10px;
                        color: var(--text-muted);
                        font-size: 11px;
                        line-height: 1.4;
                    }

                    .no-comments i {
                        font-size: 20px;
                        margin-bottom: 8px;
                        display: block;
                        color: var(--text-muted);
                    }

                    /* Mobile responsiveness */
                    @media (max-width: 768px) {
                        .frankport-music-card {
                            width: 320px;
                            height: 400px;
                            bottom: 15px;
                            right: 15px;
                        }

                        .frankport-music-card.comments-open {
                            width: 320px;
                            height: 100vh;
                            bottom: 0;
                            right: 0;
                            border-radius: 12px 12px 0 0;
                        }

                        .frankport-music-card.comments-open .main-content {
                            width: 100%;
                            height: 50%;
                        }

                        .frankport-music-card.comments-open .comments-section {
                            width: 100%;
                            height: 50%;
                            border-left: none;
                            border-top: 1px solid rgba(255,255,255,0.1);
                        }

                        .desktop-only {
                            display: none;
                        }

                        .audiomack-container {
                            height: 338px;
                        }

                        .frankport-music-card.minimized .audiomack-container {
                            height: 338px;
                        }
                    }

                    /* Scrollbar styling */
                    .comments-list::-webkit-scrollbar {
                        width: 6px;
                    }

                    .comments-list::-webkit-scrollbar-track {
                        background: var(--admin-bg);
                    }

                    .comments-list::-webkit-scrollbar-thumb {
                        background: var(--border-color);
                        border-radius: 3px;
                    }

                    .comments-list::-webkit-scrollbar-thumb:hover {
                        background: var(--accent-gold);
                    }
                `;

                const styleSheet = document.createElement('style');
                styleSheet.textContent = styles;
                document.head.appendChild(styleSheet);
            }

            createFloatingButton() {
                const button = document.createElement('button');
                button.className = 'frankport-music-floating-btn';
                button.innerHTML = '<i class="fas fa-music"></i>';
                button.setAttribute('data-tooltip', 'Listen to Developer\'s Best Songs for you - Streaming Live');
                
                document.body.appendChild(button);
                this.floatingButton = button;
            }

            createMusicCard() {
                const card = document.createElement('div');
                card.className = 'frankport-music-card';
                card.innerHTML = `
                    <div class="main-content">
                        <div class="music-header">
                            <div class="album-art">
                                <i class="fas fa-music"></i>
                            </div>
                            <div class="track-info">
                                <h4 class="track-title">BEST SONGS🔥🔥- Non-Rap </h4>
                                <p class="track-artist">Frank Developer</p>
                            </div>
                            <div class="header-controls">
                                <button class="control-btn comments-btn" title="Comments">
                                    <i class="far fa-comment"></i>
                                    <span class="comment-badge">0</span>
                                </button>
                                <button class="control-btn card-control-btn minimize-btn desktop-only" title="Minimize">
                                    <i class="fas fa-compress"></i>
                                </button>
                                <button class="control-btn card-control-btn maximize-btn desktop-only" title="Maximize" style="display: none;">
                                    <i class="fas fa-expand"></i>
                                </button>
                                <button class="control-btn card-control-btn close-btn" title="Close">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="audiomack-container">
                            <div class="loading-overlay">
                                <div class="loading-spinner"></div>
                                <div class="loading-text">Getting your music ready...</div>
                                <div class="loading-subtext">Connecting to Audiomack</div>
                            </div>
                            <iframe 
                                src="https://audiomack.com/embed/ryan-artist/playlist/best-songs" 
                                scrolling="no" 
                                title="BEST SONGS 🔥🔥🔥🔥"
                                allow="autoplay; encrypted-media">
                            </iframe>
                        </div>
                    </div>
                    
                    <div class="comments-section">
                        <div class="comments-header">
                            <h3 class="comments-title">Comments</h3>
                        </div>
                        <div class="comments-list"></div>
                        <div class="comment-input-area">
                            <textarea class="comment-input" placeholder="Share your thoughts about this playlist..." maxlength="200"></textarea>
                            <button class="comment-submit">Post Comment</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(card);
                this.musicCard = card;
                this.commentsSection = card.querySelector('.comments-section');
                this.loadingOverlay = card.querySelector('.loading-overlay');
            }

            setupEventListeners() {
                // Floating button
                this.floatingButton.addEventListener('click', () => {
                    this.showMusicCard();
                });

                // Card controls
                this.musicCard.querySelector('.close-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.hideMusicCard();
                });

                this.musicCard.querySelector('.minimize-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.minimizeCard();
                });

                this.musicCard.querySelector('.maximize-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.maximizeCard();
                });

                this.musicCard.querySelector('.comments-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleComments();
                });

                // Comment functionality
                this.musicCard.querySelector('.comment-submit').addEventListener('click', () => {
                    this.submitComment();
                });

                this.musicCard.querySelector('.comment-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.submitComment();
                    }
                });

                // Loading management
                this.setupLoadingManagement();

                // Dragging functionality
                this.setupDragging();

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 'm') {
                        e.preventDefault();
                        if (this.musicCard.style.display === 'none' || this.musicCard.style.display === '') {
                            this.showMusicCard();
                        } else {
                            this.hideMusicCard();
                        }
                    }
                });
            }

            setupLoadingManagement() {
                const iframe = this.musicCard.querySelector('iframe');
                const messages = [
                    'Getting your music ready...',
                    'Loading playlist...',
                    'Connecting to Audiomack...',
                    'Almost there, preparing your songs...'
                ];

                // Show loading on iframe load start
                iframe.addEventListener('loadstart', () => {
                    this.showLoading(messages[Math.floor(Math.random() * messages.length)]);
                });

                // Hide loading when iframe loads
                iframe.addEventListener('load', () => {
                    setTimeout(() => this.hideLoading(), 1500);
                });

                // Fallback: Auto-hide loading after timeout
                setTimeout(() => {
                    if (this.loadingOverlay && this.loadingOverlay.style.display !== 'none') {
                        this.hideLoading();
                    }
                }, 5000);

                // Periodic check for potential loading states
                setInterval(() => {
                    if (this.musicCard.style.display !== 'none') {
                        this.checkForLoadingStates();
                    }
                }, 6000);
            }

            showLoading(message = 'Loading your music...') {
                if (this.loadingOverlay) {
                    this.loadingOverlay.querySelector('.loading-text').textContent = message;
                    this.loadingOverlay.style.display = 'flex';
                }
            }

            hideLoading() {
                if (this.loadingOverlay) {
                    this.loadingOverlay.style.opacity = '0';
                    setTimeout(() => {
                        this.loadingOverlay.style.display = 'none';
                        this.loadingOverlay.style.opacity = '1';
                    }, 300);
                }
            }

            checkForLoadingStates() {
                // Simple heuristic: if user might be experiencing delays
                if (Math.random() < 0.1) { // 10% chance every 10 seconds
                    this.showLoading('Refreshing connection...');
                    setTimeout(() => this.hideLoading(), 2000);
                }
            }

            setupDragging() {
                this.musicCard.addEventListener('mousedown', (e) => {
                    if (e.target.closest('.control-btn') || 
                        e.target.closest('.card-control-btn') ||
                        e.target.closest('iframe') ||
                        e.target.closest('.comments-section')) return;
                    
                    this.isDragging = true;
                    const rect = this.musicCard.getBoundingClientRect();
                    this.dragOffset = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };
                    
                    document.addEventListener('mousemove', this.handleDrag.bind(this));
                    document.addEventListener('mouseup', this.handleDragEnd.bind(this));
                    
                    this.musicCard.style.cursor = 'grabbing';
                    e.preventDefault();
                });
            }

            handleDrag(e) {
                if (!this.isDragging) return;
                
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                
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
                document.removeEventListener('mousemove', this.handleDrag);
                document.removeEventListener('mouseup', this.handleDragEnd);
            }

            showMusicCard() {
                this.musicCard.style.display = 'flex';
                this.floatingButton.style.display = 'none';
                this.showLoading('Loading your music...');
            }

            hideMusicCard() {
                this.musicCard.style.display = 'none';
                this.floatingButton.style.display = 'flex';
                if (this.isCommentsOpen) {
                    this.toggleComments();
                }
            }

            minimizeCard() {
                this.isMinimized = true;
                this.musicCard.classList.add('minimized');
                this.musicCard.querySelector('.minimize-btn').style.display = 'none';
                this.musicCard.querySelector('.maximize-btn').style.display = 'flex';
                
                if (this.isCommentsOpen) {
                    this.toggleComments();
                }
            }

            maximizeCard() {
                this.isMinimized = false;
                this.musicCard.classList.remove('minimized');
                this.musicCard.querySelector('.minimize-btn').style.display = 'flex';
                this.musicCard.querySelector('.maximize-btn').style.display = 'none';
            }

            toggleComments() {
                this.isCommentsOpen = !this.isCommentsOpen;
                this.musicCard.classList.toggle('comments-open', this.isCommentsOpen);
                this.musicCard.querySelector('.comments-btn').classList.toggle('active', this.isCommentsOpen);
                
                if (this.isCommentsOpen) {
                    this.renderComments();
                    // Adjust position if card would exceed screen width
                    this.adjustPositionForComments();
                }
            }

            adjustPositionForComments() {
                if (window.innerWidth > 768) { // Desktop only
                    const rect = this.musicCard.getBoundingClientRect();
                    const cardWidth = this.isCommentsOpen ? 600 : 400;
                    
                    if (rect.right > window.innerWidth - 20) {
                        const newLeft = window.innerWidth - cardWidth - 20;
                        this.musicCard.style.left = Math.max(20, newLeft) + 'px';
                        this.musicCard.style.right = 'auto';
                    }
                }
            }

            submitComment() {
                const input = this.musicCard.querySelector('.comment-input');
                const text = input.value.trim();
                
                if (text && text.length > 0) {
                    const comment = {
                        text: text,
                        timestamp: Date.now(),
                        author: 'Anonymous'
                    };
                    
                    this.comments.unshift(comment);
                    this.commentCount++;
                    this.updateCommentCounter();
                    this.saveCommentsToStorage();
                    this.renderComments();
                    input.value = '';
                }
            }

            renderComments() {
                const commentsList = this.musicCard.querySelector('.comments-list');
                
                if (this.comments.length === 0) {
                    commentsList.innerHTML = `
                        <div class="no-comments">
                            <i class="far fa-comment"></i>
                            No comments yet. Be the first to share your thoughts about this playlist!
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
                
                commentsList.scrollTop = 0;
            }

            updateCommentCounter() {
                const badge = this.musicCard.querySelector('.comment-badge');
                badge.textContent = this.commentCount;
                badge.style.display = this.commentCount > 0 ? 'block' : 'none';
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
                    localStorage.setItem('frankport-music-comments', JSON.stringify(data));
                } catch (e) {
                    window.frankportMusicComments = { comments: this.comments, count: this.commentCount };
                }
            }

            loadCommentsFromStorage() {
                try {
                    const stored = localStorage.getItem('frankport-music-comments') || 
                                  (window.frankportMusicComments ? JSON.stringify(window.frankportMusicComments) : null);
                    
                    if (stored) {
                        const data = JSON.parse(stored);
                        this.comments = data.comments || [];
                        this.commentCount = data.count || this.comments.length;
                        this.updateCommentCounter();
                    }
                } catch (e) {
                    this.comments = [];
                    this.commentCount = 0;
                }
            }

            requestAudioPermission() {
            if (!sessionStorage.getItem('frankport-audio-permission')) {
                const notice = document.createElement('div');
                notice.className = 'audio-notice'; // 👈style via this Class
                notice.innerHTML = `
                <i class="fa-solid fa-music audio-icon"></i>
                <span>Click anywhere to enable audio playback</span>
                <button class="audio-ok-btn">OK</button>
                `;

                const enableAudio = () => {
                sessionStorage.setItem('frankport-audio-permission', 'true');
                notice.remove();
                document.removeEventListener('click', enableAudio);
                };

                notice.querySelector('.audio-ok-btn').addEventListener('click', enableAudio);
                document.addEventListener('click', enableAudio);
                document.body.appendChild(notice);
            }
            }
        }

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            window.frankportMusicPlayer = new FrankPortMusicPlayer();
            console.log('🎵 FrankPort Music Player - Ready!');
        });

// ========= Highlight ================
/**
 * Professional Music Modal System
 * Version: 2.0.0
 * Features: Accessibility-first, Performance-optimized, Properly architected
 */

class FrankPortfolioProfessionalMusicModalSystem {
    constructor(config = {}) {
        // Configuration with defaults
        this.config = {
            animationDuration: config.animationDuration || 300,
            enableKeyboardNav: config.enableKeyboardNav !== false,
            autoShowOnLoad: config.autoShowOnLoad || false,
            totalSteps: config.totalSteps || 4,
            theme: config.theme || 'dark',
            ...config
        };

        // State management
        this.state = {
            isVisible: false,
            currentStep: 0,
            isAnimating: false,
            focusTrapEnabled: false
        };

        // Cached DOM references
        this.elements = {
            overlay: null,
            modal: null,
            closeButton: null,
            prevButton: null,
            nextButton: null,
            stepDots: [],
            steps: [],
            focusableElements: []
        };

        // Bound methods for proper event cleanup
        this.boundHandlers = {
            handleKeyDown: this.handleKeyDown.bind(this),
            handleOverlayClick: this.handleOverlayClick.bind(this),
            handleClose: this.hide.bind(this),
            handlePrevious: this.previousStep.bind(this),
            handleNext: this.nextStep.bind(this)
        };

        this.initialize();
    }

    initialize() {
        try {
            this.createModalDOM();
            this.cacheElements();
            this.attachEventListeners();
            
            if (this.config.autoShowOnLoad) {
                // Small delay for better UX
                setTimeout(() => this.show(), 100);
            }
        } catch (error) {
            console.error('FrankPortfolioProfessionalMusicModalSystem initialization failed:', error);
        }
    }

    createModalDOM() {
        const overlay = document.createElement('div');
        overlay.className = 'frankportfolio-professional-music-modal-overlay-container';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'frankportfolio-modal-title');
        overlay.setAttribute('aria-describedby', 'frankportfolio-modal-description');

        const modal = document.createElement('div');
        modal.className = 'frankportfolio-professional-music-modal-main-container';

        // Header
        const header = this.createHeader();
        modal.appendChild(header);

        // Body with steps
        const body = this.createBody();
        modal.appendChild(body);

        // Navigation
        const navigation = this.createNavigation();
        modal.appendChild(navigation);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        this.elements.overlay = overlay;
        this.elements.modal = modal;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'frankportfolio-professional-music-modal-header-section';

        const pattern = document.createElement('div');
        pattern.className = 'frankportfolio-professional-music-modal-header-pattern-overlay';
        pattern.setAttribute('aria-hidden', 'true');

        const closeButton = document.createElement('button');
        closeButton.className = 'frankportfolio-professional-music-modal-close-button';
        closeButton.setAttribute('aria-label', 'Close modal dialog');
        closeButton.setAttribute('type', 'button');
        closeButton.innerHTML = '&times;';

        const title = document.createElement('h2');
        title.id = 'frankportfolio-modal-title';
        title.className = 'frankportfolio-professional-music-modal-title-text';
        title.textContent = 'New Music Experience';

        const subtitle = document.createElement('p');
        subtitle.id = 'frankportfolio-modal-description';
        subtitle.className = 'frankportfolio-professional-music-modal-subtitle-text';
        subtitle.textContent = 'Stream live from Audiomack with advanced features';

        header.appendChild(pattern);
        header.appendChild(closeButton);
        header.appendChild(title);
        header.appendChild(subtitle);

        return header;
    }

    createBody() {
        const body = document.createElement('div');
        body.className = 'frankportfolio-professional-music-modal-body-section';

        const showcase = document.createElement('div');
        showcase.className = 'frankportfolio-professional-music-modal-content-showcase';

        const steps = this.getStepsContent();
        steps.forEach((stepData, index) => {
            const step = this.createStep(stepData, index);
            showcase.appendChild(step);
        });

        body.appendChild(showcase);
        return body;
    }

    createStep(stepData, index) {
        const step = document.createElement('div');
        step.className = 'frankportfolio-professional-music-modal-step-container';
        step.setAttribute('data-step-index', index);
        step.setAttribute('role', 'tabpanel');
        step.setAttribute('aria-labelledby', `frankportfolio-step-${index}-title`);
        
        if (index === 0) {
            step.classList.add('frankportfolio-step-active-state');
        }

        // Header
        const headerWrapper = document.createElement('div');
        headerWrapper.className = 'frankportfolio-professional-music-modal-step-header-wrapper';

        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'frankportfolio-professional-music-modal-step-icon-wrapper';
        iconWrapper.setAttribute('aria-hidden', 'true');
        iconWrapper.textContent = stepData.icon;

        const titleText = document.createElement('h3');
        titleText.id = `frankportfolio-step-${index}-title`;
        titleText.className = 'frankportfolio-professional-music-modal-step-title-text';
        titleText.textContent = stepData.title;

        headerWrapper.appendChild(iconWrapper);
        headerWrapper.appendChild(titleText);

        // Description
        const description = document.createElement('p');
        description.className = 'frankportfolio-professional-music-modal-step-description-text';
        description.textContent = stepData.description;

        // Demo box
        const demoBox = this.createDemoBox(stepData);

        step.appendChild(headerWrapper);
        step.appendChild(description);
        step.appendChild(demoBox);

        return step;
    }

    createDemoBox(stepData) {
        const demoBox = document.createElement('div');
        demoBox.className = 'frankportfolio-professional-music-modal-feature-demo-box';

        if (stepData.showPreview) {
            const previewRow = document.createElement('div');
            previewRow.className = 'frankportfolio-professional-music-modal-demo-preview-row';

            const iconBox = document.createElement('div');
            iconBox.className = 'frankportfolio-professional-music-modal-demo-icon-box';
            iconBox.setAttribute('aria-hidden', 'true');
            iconBox.textContent = '🎵';

            const textContent = document.createElement('div');
            textContent.className = 'frankportfolio-professional-music-modal-demo-text-content';

            const demoTitle = document.createElement('h4');
            demoTitle.className = 'frankportfolio-professional-music-modal-demo-title';
            demoTitle.textContent = 'Featured Playlist';

            const demoSubtitle = document.createElement('p');
            demoSubtitle.className = 'frankportfolio-professional-music-modal-demo-subtitle';
            demoSubtitle.textContent = 'Live from Audiomack';

            textContent.appendChild(demoTitle);
            textContent.appendChild(demoSubtitle);
            previewRow.appendChild(iconBox);
            previewRow.appendChild(textContent);
            demoBox.appendChild(previewRow);
        }

        // Highlights
        if (stepData.highlights && stepData.highlights.length > 0) {
            const highlightsGrid = document.createElement('div');
            highlightsGrid.className = 'frankportfolio-professional-music-modal-highlights-grid';

            stepData.highlights.forEach(highlight => {
                const item = document.createElement('div');
                item.className = 'frankportfolio-professional-music-modal-highlight-item';

                const icon = document.createElement('span');
                icon.className = 'frankportfolio-professional-music-modal-highlight-icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.textContent = '✓';

                const text = document.createElement('span');
                text.textContent = highlight;

                item.appendChild(icon);
                item.appendChild(text);
                highlightsGrid.appendChild(item);
            });

            demoBox.appendChild(highlightsGrid);
        }

        return demoBox;
    }

    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'frankportfolio-professional-music-modal-navigation-footer';
        nav.setAttribute('aria-label', 'Modal step navigation');

        // Step indicators
        const indicators = document.createElement('div');
        indicators.className = 'frankportfolio-professional-music-modal-step-indicators-wrapper';
        indicators.setAttribute('role', 'tablist');
        indicators.setAttribute('aria-label', 'Step indicators');

        for (let i = 0; i < this.config.totalSteps; i++) {
            const dot = document.createElement('button');
            dot.className = 'frankportfolio-professional-music-modal-step-dot-indicator';
            dot.setAttribute('type', 'button');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to step ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.setAttribute('data-step-index', i);
            
            if (i === 0) {
                dot.classList.add('frankportfolio-dot-active-state');
            }
            
            indicators.appendChild(dot);
        }

        // Navigation buttons
        const buttons = document.createElement('div');
        buttons.className = 'frankportfolio-professional-music-modal-navigation-buttons-wrapper';

        const prevButton = document.createElement('button');
        prevButton.className = 'frankportfolio-professional-music-modal-navigation-button frankportfolio-professional-music-modal-button-secondary';
        prevButton.setAttribute('type', 'button');
        prevButton.setAttribute('aria-label', 'Previous step');
        prevButton.disabled = true;
        prevButton.innerHTML = '<span aria-hidden="true">←</span> Previous';

        const nextButton = document.createElement('button');
        nextButton.className = 'frankportfolio-professional-music-modal-navigation-button frankportfolio-professional-music-modal-button-primary';
        nextButton.setAttribute('type', 'button');
        nextButton.setAttribute('aria-label', 'Next step');
        nextButton.innerHTML = 'Next <span aria-hidden="true">→</span>';

        buttons.appendChild(prevButton);
        buttons.appendChild(nextButton);

        nav.appendChild(indicators);
        nav.appendChild(buttons);

        return nav;
    }

    cacheElements() {
        this.elements.closeButton = this.elements.overlay.querySelector('.frankportfolio-professional-music-modal-close-button');
        this.elements.prevButton = this.elements.overlay.querySelector('.frankportfolio-professional-music-modal-button-secondary');
        this.elements.nextButton = this.elements.overlay.querySelector('.frankportfolio-professional-music-modal-button-primary');
        this.elements.stepDots = Array.from(this.elements.overlay.querySelectorAll('.frankportfolio-professional-music-modal-step-dot-indicator'));
        this.elements.steps = Array.from(this.elements.overlay.querySelectorAll('.frankportfolio-professional-music-modal-step-container'));
        this.cacheFocusableElements();
    }

    cacheFocusableElements() {
        const focusableSelectors = [
            'button:not([disabled])',
            'a[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        this.elements.focusableElements = Array.from(
            this.elements.modal.querySelectorAll(focusableSelectors)
        );
    }

    attachEventListeners() {
        if (!this.elements.closeButton || !this.elements.prevButton || !this.elements.nextButton) {
            console.error('Required elements not found for event attachment');
            return;
        }

        // Close button
        this.elements.closeButton.addEventListener('click', this.boundHandlers.handleClose);

        // Overlay click (close on backdrop)
        this.elements.overlay.addEventListener('click', this.boundHandlers.handleOverlayClick);

        // Navigation buttons
        this.elements.prevButton.addEventListener('click', this.boundHandlers.handlePrevious);
        this.elements.nextButton.addEventListener('click', this.boundHandlers.handleNext);

        // Step indicator dots
        this.elements.stepDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToStep(index));
        });

        // Keyboard navigation
        if (this.config.enableKeyboardNav) {
            document.addEventListener('keydown', this.boundHandlers.handleKeyDown);
        }
    }

    removeEventListeners() {
        if (this.elements.closeButton) {
            this.elements.closeButton.removeEventListener('click', this.boundHandlers.handleClose);
        }

        if (this.elements.overlay) {
            this.elements.overlay.removeEventListener('click', this.boundHandlers.handleOverlayClick);
        }

        if (this.elements.prevButton) {
            this.elements.prevButton.removeEventListener('click', this.boundHandlers.handlePrevious);
        }

        if (this.elements.nextButton) {
            this.elements.nextButton.removeEventListener('click', this.boundHandlers.handleNext);
        }

        if (this.config.enableKeyboardNav) {
            document.removeEventListener('keydown', this.boundHandlers.handleKeyDown);
        }
    }

    handleKeyDown(event) {
        if (!this.state.isVisible || this.state.isAnimating) return;

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.hide();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousStep();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextStep();
                break;
            case 'Tab':
                this.handleTabTrap(event);
                break;
        }
    }

    handleTabTrap(event) {
        if (!this.elements.focusableElements.length) return;

        const firstFocusable = this.elements.focusableElements[0];
        const lastFocusable = this.elements.focusableElements[this.elements.focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstFocusable) {
                event.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                event.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    handleOverlayClick(event) {
        if (event.target === this.elements.overlay) {
            this.hide();
        }
    }

    show() {
        if (this.state.isVisible || this.state.isAnimating) return;

        this.state.isAnimating = true;
        this.state.isVisible = true;

        // Store previously focused element
        this.previouslyFocusedElement = document.activeElement;

        // Show overlay
        this.elements.overlay.classList.add('frankportfolio-modal-visible-state');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Trigger animation
        requestAnimationFrame(() => {
            this.elements.overlay.classList.add('frankportfolio-modal-animated-in');
            
            // Show first step with animation
            const firstStep = this.elements.steps[0];
            if (firstStep) {
                setTimeout(() => {
                    firstStep.classList.add('frankportfolio-step-visible-state');
                }, 50);
            }
        });

        // Animation complete
        setTimeout(() => {
            this.state.isAnimating = false;
            this.enableFocusTrap();
            
            // Focus close button for accessibility
            if (this.elements.closeButton) {
                this.elements.closeButton.focus();
            }
        }, this.config.animationDuration);

        // Announce to screen readers
        this.announceToScreenReader('Modal opened. Use arrow keys to navigate steps, Escape to close.');
    }

    hide() {
        if (!this.state.isVisible || this.state.isAnimating) return;

        this.state.isAnimating = true;

        // Remove animation classes
        this.elements.overlay.classList.remove('frankportfolio-modal-animated-in');

        setTimeout(() => {
            this.elements.overlay.classList.remove('frankportfolio-modal-visible-state');
            document.body.style.overflow = '';
            this.state.isVisible = false;
            this.state.isAnimating = false;
            this.disableFocusTrap();

            // Restore focus
            if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
                this.previouslyFocusedElement.focus();
            }
        }, this.config.animationDuration);

        this.announceToScreenReader('Modal closed');
    }

    nextStep() {
        if (this.state.isAnimating || this.state.currentStep >= this.config.totalSteps - 1) return;
        
        const nextStep = this.state.currentStep + 1;
        this.goToStep(nextStep);
    }

    previousStep() {
        if (this.state.isAnimating || this.state.currentStep <= 0) return;
        
        const prevStep = this.state.currentStep - 1;
        this.goToStep(prevStep);
    }

    goToStep(stepIndex) {
        if (this.state.isAnimating || 
            stepIndex < 0 || 
            stepIndex >= this.config.totalSteps || 
            stepIndex === this.state.currentStep) {
            return;
        }

        this.state.isAnimating = true;
        const previousStepIndex = this.state.currentStep;

        // Hide current step
        const currentStepElement = this.elements.steps[previousStepIndex];
        if (currentStepElement) {
            currentStepElement.classList.remove('frankportfolio-step-visible-state');
        }

        setTimeout(() => {
            // Update state
            this.state.currentStep = stepIndex;

            // Hide all steps
            this.elements.steps.forEach(step => {
                step.classList.remove('frankportfolio-step-active-state', 'frankportfolio-step-visible-state');
            });

            // Show new step
            const newStepElement = this.elements.steps[stepIndex];
            if (newStepElement) {
                newStepElement.classList.add('frankportfolio-step-active-state');
                
                // Trigger animation
                requestAnimationFrame(() => {
                    newStepElement.classList.add('frankportfolio-step-visible-state');
                });
            }

            this.updateNavigationUI();
            this.state.isAnimating = false;

            // Announce step change
            const stepTitle = newStepElement?.querySelector('.frankportfolio-professional-music-modal-step-title-text')?.textContent;
            if (stepTitle) {
                this.announceToScreenReader(`Step ${stepIndex + 1} of ${this.config.totalSteps}: ${stepTitle}`);
            }
        }, 200);
    }

    updateNavigationUI() {
        // Update step dots
        this.elements.stepDots.forEach((dot, index) => {
            const isActive = index === this.state.currentStep;
            dot.classList.toggle('frankportfolio-dot-active-state', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update prev button
        this.elements.prevButton.disabled = this.state.currentStep === 0;

        // Update next button
        const isLastStep = this.state.currentStep === this.config.totalSteps - 1;
        this.elements.nextButton.disabled = false; // Never disable

        if (isLastStep) {
            this.elements.nextButton.innerHTML = 'Get Started <span aria-hidden="true">🚀</span>';
            this.elements.nextButton.setAttribute('aria-label', 'Get started with music player');
            // On last step, open music player and close modal
            this.elements.nextButton.onclick = () => {
                this.hide();
                // Wait for modal to close, then open music player
                setTimeout(() => {
                    if (window.frankportMusicPlayer) {
                        window.frankportMusicPlayer.showMusicCard();
                    }
                }, 400);
            };
        } else {
            this.elements.nextButton.innerHTML = 'Next <span aria-hidden="true">→</span>';
            this.elements.nextButton.setAttribute('aria-label', 'Next step');
            // Reset to normal next behavior
            this.elements.nextButton.onclick = null;
        }
    }

    enableFocusTrap() {
        this.state.focusTrapEnabled = true;
    }

    disableFocusTrap() {
        this.state.focusTrapEnabled = false;
    }

    announceToScreenReader(message) {
        // Create or get live region
        let liveRegion = document.getElementById('frankportfolio-modal-live-region');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'frankportfolio-modal-live-region';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }

        // Clear and set new message
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }

    getStepsContent() {
        return [
            {
                icon: '📡',
                title: 'Live Music Streaming',
                description: 'Experience your favorite tracks streaming live from Audiomack. Real-time playback with full playlist functionality and high-quality audio streaming.',
                showPreview: true,
                highlights: [
                    'Real-time streaming',
                    'Full playlist access',
                    'High-quality audio',
                    'Secure embedding'
                ]
            },
            {
                icon: '🔄',
                title: 'Smart Loading States',
                description: 'Beautiful loading animations with informative messages keep you updated during buffering, connection issues, or track changes.',
                showPreview: false,
                highlights: [
                    'Animated feedback',
                    'Dynamic messages',
                    'Auto-detection',
                    'Smooth transitions'
                ]
            },
            {
                icon: '💬',
                title: 'TikTok-Style Layout',
                description: 'Comments open in a side panel while keeping the music player visible and functional. Perfect balance of interaction and content visibility.',
                showPreview: false,
                highlights: [
                    'Side-by-side layout',
                    'Player stays active',
                    'Real-time updates',
                    'Mobile optimized'
                ]
            },
            {
                icon: '⭐',
                title: 'Professional Features',
                description: 'Everything you expect from a premium music player: draggable interface, responsive design, persistent storage, and seamless portfolio integration.',
                showPreview: false,
                highlights: [
                    'Draggable positioning',
                    'Minimize/Maximize',
                    'Mobile responsive',
                    'Persistent state',
                    'Keyboard shortcuts',
                    'Secure & accessible'
                ]
            }
        ];
    }

    destroy() {
        this.removeEventListeners();
        
        if (this.elements.overlay && this.elements.overlay.parentNode) {
            this.elements.overlay.parentNode.removeChild(this.elements.overlay);
        }

        const liveRegion = document.getElementById('frankportfolio-modal-live-region');
        if (liveRegion && liveRegion.parentNode) {
            liveRegion.parentNode.removeChild(liveRegion);
        }

        // Clear references
        this.elements = {};
        this.state = {};
    }

    // Public API
    toggle() {
        if (this.state.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    getCurrentStep() {
        return this.state.currentStep;
    }

    isOpen() {
        return this.state.isVisible;
    }
}

// Initialize on DOM ready
if (typeof window !== 'undefined') {
    let modalInstance = null;

    const initializeModal = () => {
        if (modalInstance) {
            console.warn('FrankPortfolioProfessionalMusicModalSystem already initialized');
            return modalInstance;
        }

        modalInstance = new FrankPortfolioProfessionalMusicModalSystem({
            autoShowOnLoad: false,
            enableKeyboardNav: true
        });

        return modalInstance;
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeModal);
    } else {
        initializeModal();
    }

    // Global API
    window.FrankPortfolioProfessionalMusicModalSystem = FrankPortfolioProfessionalMusicModalSystem;
    
    window.showMusicModal = () => {
        if (!modalInstance) {
            modalInstance = initializeModal();
        }
        modalInstance.show();
    };

    window.hideMusicModal = () => {
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    window.toggleMusicModal = () => {
        if (!modalInstance) {
            modalInstance = initializeModal();
        }
        modalInstance.toggle();
    };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrankPortfolioProfessionalMusicModalSystem;
}