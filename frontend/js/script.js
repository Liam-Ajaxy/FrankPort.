// ===================================
// PROFESSIONAL DEVELOPER PORTFOLIO JS
// Advanced Functionality & Interactions
// ===================================

(function() {
    'use strict';

    // Global Variables
    const portfolio = {
        isLoading: true,
        scrollPosition: 0,
        activeSection: 'hero',
        animations: [],
        observers: [],
        emailServiceURL: 'https://formspree.io/f/xvoeawrg', // You'll need to set this up
        developerEmail: 'user74251224.us@gmail.com'
    };

    // Utility Functions
    const utils = {
        // Debounce function for performance optimization
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport(element, threshold = 0.1) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= windowHeight * threshold);
            const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
            
            return vertInView && horInView;
        },

        // Animate number counting
        animateNumber(element, target, duration = 2000) {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        },

        // Smooth scroll to element
        smoothScrollTo(element, offset = 80) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Loading Screen Management
    const loadingManager = {
        init() {
            this.loadingScreen = document.getElementById('loading-screen');
            this.progressBar = document.getElementById('loading-progress');
            this.loadingText = document.getElementById('loading-text');
            
            this.simulateLoading();
        },

        simulateLoading() {
            const loadingSteps = [
                { progress: 20, text: 'Loading assets...' },
                { progress: 40, text: 'Initializing components...' },
                { progress: 60, text: 'Setting up interactions...' },
                { progress: 80, text: 'Preparing experience...' },
                { progress: 100, text: 'Welcome!' }
            ];

            let currentStep = 0;
            const stepInterval = setInterval(() => {
                if (currentStep < loadingSteps.length) {
                    const step = loadingSteps[currentStep];
                    this.progressBar.style.width = step.progress + '%';
                    this.loadingText.textContent = step.text;
                    currentStep++;
                } else {
                    clearInterval(stepInterval);
                    setTimeout(() => this.hideLoading(), 300);
                }
            }, 300);
        },

        hideLoading() {
            this.loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
            portfolio.isLoading = false;
            
            // Initialize all components after loading
            setTimeout(() => {
                portfolioApp.initializeComponents();
            }, 300);
        }
    };

    // Custom Cursor Management
    const cursorManager = {
        init() {
            this.cursor = document.querySelector('.custom-cursor');
            this.cursorDot = document.querySelector('.custom-cursor-dot');
            
            if (!this.cursor || !this.cursorDot) return;

            this.bindEvents();
        },

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX - 20 + 'px';
                this.cursor.style.top = e.clientY - 20 + 'px';
                
                this.cursorDot.style.left = e.clientX - 4 + 'px';
                this.cursorDot.style.top = e.clientY - 4 + 'px';
            });

            // Add hover effects for interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .tech-icon');
            
            interactiveElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                });
                
                element.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                });
            });
        }
    };

    // Navigation Management
    const navigationManager = {
        init() {
            this.navbar = document.getElementById('navbar');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            
            this.bindEvents();
            this.setupScrollSpy();
        },

        bindEvents() {
            // Mobile menu toggle
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.navToggle.classList.toggle('active');
            });

            // Navigation links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetSection = document.querySelector(link.getAttribute('href'));
                    if (targetSection) {
                        utils.smoothScrollTo(targetSection);
                        this.setActiveLink(link);
                        
                        // Close mobile menu
                        this.navMenu.classList.remove('active');
                        this.navToggle.classList.remove('active');
                    }
                });
            });

            // Hide/show navbar on scroll
            let lastScrollY = window.scrollY;
            window.addEventListener('scroll', utils.throttle(() => {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    this.navbar.classList.add('hidden');
                } else {
                    this.navbar.classList.remove('hidden');
                }
                lastScrollY = window.scrollY;
            }, 100));
        },

        setupScrollSpy() {
            const sections = document.querySelectorAll('section[id]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                        if (activeLink) {
                            this.setActiveLink(activeLink);
                        }
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '-80px 0px -80px 0px'
            });

            sections.forEach(section => observer.observe(section));
        },

        setActiveLink(activeLink) {
            this.navLinks.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        }
    };

    // Hero Section Interactions
    const heroManager = {
        init() {
            this.typewriterInit();
            this.statsAnimation();
            this.codeAnimation();
        },

        typewriterInit() {
            const nameElement = document.getElementById('typed-name');
            const names = ['Developer', 'Designer', 'SW Analyst', '</> Coder'];
            let nameIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            const typeWriter = () => {
                const currentName = names[nameIndex];
                
                if (isDeleting) {
                    nameElement.textContent = currentName.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    nameElement.textContent = currentName.substring(0, charIndex + 1);
                    charIndex++;
                }

                let timeout = isDeleting ? 100 : 150;

                if (!isDeleting && charIndex === currentName.length) {
                    timeout = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    nameIndex = (nameIndex + 1) % names.length;
                    timeout = 500;
                }

                setTimeout(typeWriter, timeout);
            };

            // Start typewriter effect after page load
            setTimeout(typeWriter, 1000);
        },

        statsAnimation() {
            const statNumbers = document.querySelectorAll('.stat-number');
            let animated = false;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        statNumbers.forEach(stat => {
                            const target = parseInt(stat.getAttribute('data-target'));
                            utils.animateNumber(stat, target);
                        });
                    }
                });
            });

            const heroSection = document.getElementById('hero');
            if (heroSection) observer.observe(heroSection);
        },

        codeAnimation() {
            const codeLines = document.querySelectorAll('.code-line');
            
            // Add staggered animation delays
            codeLines.forEach((line, index) => {
                line.style.animationDelay = `${0.5 + (index * 0.5)}s`;
            });
        }
    };

    // About Section Animations
    const aboutManager = {
        init() {
            this.setupRevealAnimations();
        },

        setupRevealAnimations() {
            const aboutText = document.querySelector('.about-text');
            const aboutParagraphs = document.querySelectorAll('.about-paragraph');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        
                        // Animate paragraphs with delay
                        aboutParagraphs.forEach((paragraph, index) => {
                            setTimeout(() => {
                                paragraph.classList.add('reveal');
                            }, index * 200);
                        });
                    }
                });
            });

            if (aboutText) observer.observe(aboutText);
        }
    };

    // Projects Section Management
    const projectsManager = {
        init() {
            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.projectCards = document.querySelectorAll('.project-card');
            this.activeFilter = 'all';
            
            this.bindEvents();
            this.setupProjectAnimations();
        },

        bindEvents() {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filter = button.getAttribute('data-filter');
                    this.filterProjects(filter);
                    this.setActiveFilter(button);
                });
            });
        },

        filterProjects(filter) {
            this.activeFilter = filter;
            
            this.projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.display = 'block';
                    }, 100);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        },

        setActiveFilter(activeButton) {
            this.filterButtons.forEach(button => button.classList.remove('active'));
            activeButton.classList.add('active');
        },

        setupProjectAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                        entry.target.classList.add('animate');
                    }
                });
            });

            this.projectCards.forEach(card => {
                observer.observe(card);
            });
        }
    };

    // Skills Section Management
    const skillsManager = {
        init() {
            this.setupSkillAnimations();
            this.initActivityChart();
        },

        setupSkillAnimations() {
            const skillItems = document.querySelectorAll('.skill-item');
            let animated = false;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        this.animateSkills();
                    }
                });
            });

            const skillsSection = document.getElementById('skills');
            if (skillsSection) observer.observe(skillsSection);
        },

        animateSkills() {
            const skillItems = document.querySelectorAll('.skill-item');
            const skillProgressBars = document.querySelectorAll('.skill-progress');

            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100);
            });

            setTimeout(() => {
                skillProgressBars.forEach(progress => {
                    const targetProgress = progress.getAttribute('data-progress');
                    progress.style.width = targetProgress + '%';
                });
            }, 500);
        },

        initActivityChart() {
            const canvas = document.getElementById('activityChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const data = this.generateActivityData();
            
            this.renderChart(ctx, data);
        },

        generateActivityData() {
            // Generate sample coding activity data
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return days.map(day => ({
                day,
                commits: Math.floor(Math.random() * 10) + 1,
                hours: Math.floor(Math.random() * 8) + 2
            }));
        },

        renderChart(ctx, data) {
            const canvas = ctx.canvas;
            const width = canvas.width;
            const height = canvas.height;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Set styles
            ctx.fillStyle = '#ffa200';
            ctx.strokeStyle = '#ffa200';
            ctx.lineWidth = 2;
            
            // Draw bars
            const barWidth = width / data.length - 20;
            const maxHours = Math.max(...data.map(d => d.hours));
            
            data.forEach((item, index) => {
                const barHeight = (item.hours / maxHours) * (height - 40);
                const x = index * (barWidth + 20) + 10;
                const y = height - barHeight - 20;
                
                // Draw bar
                ctx.fillRect(x, y, barWidth, barHeight);
                
                // Draw label
                ctx.fillStyle = '#b8bcc8';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(item.day, x + barWidth / 2, height - 5);
                
                // Reset color
                ctx.fillStyle = '#ffa200';
            });
        }
    };

    // Contact Form Management
    const contactManager = {
        init() {
            this.form = document.getElementById('contact-form');
            this.submitBtn = document.getElementById('submit-btn');
            this.formStatus = document.getElementById('form-status');
            
            if (!this.form) return;

            this.originalText = this.submitBtn.innerHTML;
            
            this.bindEvents();
            this.setupValidation();
        },

        bindEvents() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // Real-time validation
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        },

        setupValidation() {
            this.validators = {
                name: (value) => {
                    if (!value.trim()) return 'Name is required';
                    if (value.trim().length < 2) return 'Name must be at least 2 characters';
                    return null;
                },
                email: (value) => {
                    if (!value.trim()) return 'Email is required';
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) return 'Please enter a valid email';
                    return null;
                },
                subject: (value) => {
                    if (!value.trim()) return 'Subject is required';
                    if (value.trim().length < 5) return 'Subject must be at least 5 characters';
                    return null;
                },
                message: (value) => {
                    if (!value.trim()) return 'Message is required';
                    if (value.trim().length < 10) return 'Message must be at least 10 characters';
                    return null;
                },
                privacy: (checked) => {
                    if (!checked) return 'You must agree to the privacy policy';
                    return null;
                }
            };
        },

        validateField(field) {
            const fieldName = field.name;
            const value = field.type === 'checkbox' ? field.checked : field.value;
            const validator = this.validators[fieldName];
            
            if (validator) {
                const error = validator(value);
                this.displayFieldError(fieldName, error);
                return !error;
            }
            
            return true;
        },

        validateForm() {
            const formData = new FormData(this.form);
            let isValid = true;
            
            // Validate all fields
            Object.keys(this.validators).forEach(fieldName => {
                const field = this.form.querySelector(`[name="${fieldName}"]`);
                if (field && !this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        },

        displayFieldError(fieldName, error) {
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement) {
                if (error) {
                    errorElement.textContent = error;
                    errorElement.classList.add('show');
                } else {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                }
            }
        },

        clearError(field) {
            this.displayFieldError(field.name, null);
        },

        async handleSubmit() {
            if (!this.validateForm()) {
                this.showStatus('Please fix the errors above', 'error');
                return;
            }

            this.setLoading(true);
            
            try {
                const formData = new FormData(this.form);
                const response = await this.sendEmail(formData);
                
                if (response.ok) {
                    this.showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                this.showStatus('Failed to send message. Please try again or email me directly.', 'error');
            } finally {
                this.setLoading(false);
            }
        },

        async sendEmail(formData) {
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

        const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api/contact'
            : 'https://fp-backend-phi.vercel.app/api/contact';

        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        },

        setLoading(loading) {
            if (loading) {
                this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                this.submitBtn.disabled = true;
            } else {
                this.submitBtn.innerHTML = this.originalText;
                this.submitBtn.disabled = false;
            }
        },

        showStatus(message, type) {
            this.formStatus.textContent = message;
            this.formStatus.className = `form-status ${type}`;
            this.submitBtn.innerHTML = this.originalText;
            
            // Auto-hide success messages
            if (type === 'success') {
                setTimeout(() => {
                    this.formStatus.className = 'form-status';
                }, 5000);
            }
        }
    };

    // Scroll to Top Button
    const scrollManager = {
        init() {
            this.scrollBtn = document.getElementById('scroll-to-top');
            if (!this.scrollBtn) return;

            this.checkVisibility(); // Check once on load
            this.bindEvents();
        },

        bindEvents() {
            // Handle window resize (hide on small screens)
            window.addEventListener('resize', () => this.checkVisibility());

            // Show/hide scroll button on scroll
            window.addEventListener('scroll', utils.throttle(() => {
                if (window.innerWidth <= 768) { // Small screen
                    this.scrollBtn.classList.remove('show');
                    return;
                }
                if (window.scrollY > 300) {
                    this.scrollBtn.classList.add('show');
                } else {
                    this.scrollBtn.classList.remove('show');
                }
            }, 100));

            // Scroll to top
            this.scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        checkVisibility() {
            // If screen is small, always hide
            if (window.innerWidth <= 768) {
                this.scrollBtn.style.display = 'none';
            } else {
                this.scrollBtn.style.display = '';
            }
        }
    };


    // Intersection Observer for Animations
    const animationManager = {
        init() {
            this.setupScrollAnimations();
        },

        setupScrollAnimations() {
            const animateElements = document.querySelectorAll('.reveal-text, .highlight-item, .project-card, .tech-icon');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                        entry.target.classList.add('animate');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animateElements.forEach(element => {
                observer.observe(element);
            });
        }
    };

    // Performance Monitoring
    const performanceManager = {
        init() {
            this.monitorPerformance();
        },

        monitorPerformance() {
            // Monitor page load performance
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                
                // Monitor Core Web Vitals
                this.measureWebVitals();
            });
        },

        measureWebVitals() {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime, 'ms');
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    console.log('FID:', entry.processingStart - entry.startTime, 'ms');
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    };

    // Main Portfolio App
    const portfolioApp = {
        init() {
            // Start with loading screen
            loadingManager.init();
        },

        initializeComponents() {
            // Initialize all components after loading
            try {
                cursorManager.init();
                navigationManager.init();
                heroManager.init();
                aboutManager.init();
                projectsManager.init();
                skillsManager.init();
                contactManager.init();
                scrollManager.init();
                animationManager.init();
                performanceManager.init();
                
                console.log('Portfolio initialized successfully');
            } catch (error) {
                console.error('Error initializing portfolio:', error);
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => portfolioApp.init());
    } else {
        portfolioApp.init();
    }

    // ===== Global Toast Function (Single Instance) =====
    function showToast(message, type = 'info', duration = 6000) {
        const container = document.getElementById('global-toast-container');

        // Clear any existing toasts
        container.innerHTML = '';

        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        toast.style.setProperty('--toast-duration', `${duration / 1000}s`);

        // Icon
        const icon = document.createElement('div');
        icon.className = 'toast-icon';
        icon.innerHTML = {
            success: '<i class="fas fa-check"></i>',
            error: '<i class="fas fa-times"></i>',
            info: '<i class="fas fa-info"></i>',
            warning: '<i class="fas fa-exclamation"></i>'
        }[type] || '<i class="fas fa-bell"></i>';

        // Message
        const msg = document.createElement('div');
        msg.className = 'toast-message';
        msg.textContent = message;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;'; // × symbol
        closeBtn.onclick = () => toast.remove();

        toast.appendChild(icon);
        toast.appendChild(msg);
        toast.appendChild(closeBtn);
        container.appendChild(toast);

        // Auto-remove after duration
        setTimeout(() => {
            toast.remove();
        }, duration + 1000);
    }



    // ======================================================
    // ===== Max In-Page DevTools/View-Source Hardening =====
    // ======================================================

    (function DevtoolsHardening(){
        // Random friendly messages
        const blockedShortcutMessages = [
        "Sorry, shortcuts are disabled.",
        "This key is locked for security reason.",
        "Shortcuts aren’t available here.",
        "Keys are blocked for security reasons.",
        "That action is disabled in FrankPort."
        ];

        const TOAST_TYPE = 'warning';

        // Normalize key descriptor
        const keySig = (e) => ({
            ctrl: !!(e.ctrlKey),
            meta: !!(e.metaKey),
            alt:  !!(e.altKey),
            shift:!!(e.shiftKey),
            key: (e.key || '').toLowerCase(),
            code: (e.code || '').toLowerCase()
        });

        const blockers = [
            (s)=> ( (s.ctrl||s.meta) && !s.shift && !s.alt && (s.key==='u') ),
            (s)=> ( s.shift && (s.ctrl||s.meta) && (s.key==='i') ),
            (s)=> ( s.shift && (s.ctrl||s.meta) && (s.key==='j') ),
            (s)=> ( s.shift && (s.ctrl||s.meta) && (s.key==='k') ),
            (s)=> ( s.shift && (s.ctrl||s.meta) && (s.key==='m') ),
            (s)=> ( s.shift && (s.ctrl||s.meta) && (s.key==='e') ),
            (s)=> ( s.shift && (s.ctrl||s.meta) && (s.key==='c') ),
            (s)=> ( s.ctrl && s.alt && (s.key==='i') ),
            (s)=> ( !s.ctrl && !s.meta && !s.alt && !s.shift && (s.key==='f12' || s.code==='f12') ),
        ];

        const getRandomMessage = () => blockedShortcutMessages[Math.floor(Math.random() * blockedShortcutMessages.length)];

        const handleKey = (e) => {
            const ALLOW_WHEN_EDITING = false;
            if (ALLOW_WHEN_EDITING) {
                const t = e.target;
                const tag = (t && t.tagName) ? t.tagName.toLowerCase() : '';
                const isEditable = (t && (t.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select'));
                if (isEditable) return;
            }

            const s = keySig(e);
            for (const match of blockers) {
                if (match(s)) {
                    try { showToast(getRandomMessage(), 'error', 4000); } catch(_) {}
                    killEvent(e);
                    return false;
                }
            }
        };

        const killEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation?.();
            return false;
        };

        const handleContextMenu = (e) => {
            try { showToast(getRandomMessage(), 'warning', 6000); } catch(_) {}
            killEvent(e);
        };

        const attachAll = (root) => {
            const targets = [window, document];
            for (const t of targets) {
                t.addEventListener('keydown', handleKey, { capture: true, passive: false });
                t.addEventListener('keydown', handleKey, { capture: false, passive: false });
                t.addEventListener('keyup',   handleKey, { capture: true, passive: false });
                t.addEventListener('contextmenu', handleContextMenu, { capture: true, passive: false });
                t.addEventListener('contextmenu', handleContextMenu, { capture: false, passive: false });
            }
        };

        const bindIframes = () => {
            const iframes = document.querySelectorAll('iframe');
            for (const f of iframes) {
                try {
                    const d = f.contentWindow?.document;
                    if (!d) continue;
                    d.addEventListener('keydown', handleKey, { capture: true, passive: false });
                    d.addEventListener('keydown', handleKey, { capture: false, passive: false });
                    d.addEventListener('keyup',   handleKey, { capture: true, passive: false });
                    d.addEventListener('contextmenu', handleContextMenu, { capture: true, passive: false });
                    d.addEventListener('contextmenu', handleContextMenu, { capture: false, passive: false });
                } catch {}
            }
        };

        const mo = new MutationObserver(() => bindIframes());
        mo.observe(document.documentElement, { childList: true, subtree: true });

        attachAll(document);
        bindIframes();
    })();
    // End of DevTools Hardening ==================
    // ============================================


        // Welcome Toast =========================
        // =======================================
        const welcomeMessages = [
        "Hey there! Welcome to FrankPort.",
        "Glad you’re here! Discover FrankPort.",
        "Hello! Enjoy exploring FrankPort.",
        "Hey! FrankPort is open for you.",
        "Welcome aboard! Check out FrankPort.",
        "Hi! Enjoy your journey here.",
        "Hello! Dive into FrankPort.",
        "Hey! Explore and enjoy FrankPort.",
        "Welcome! Glad to have you here."
        ];

        const msg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        setTimeout(() => {
            showToast(msg, 'info', 6000);
        }, 4000);



        class AdvancedFeedbackSystem {
        constructor() {
            this.currentSection = 0;
            this.sections = ['rating', 'faq', 'suggestions', 'pain-points'];
            this.feedbackData = {
                overall_rating: 0,
                rating_comment: '',
                faq_ratings: {},
                suggestion_category: '',
                suggestion_text: '',
                pain_points: [],
                pain_point_details: '',
                timestamp: null
            };

            this.faqData = [
                {
                    id: 'load_time',
                    question: 'How fast did the portfolio load for you?',
                    answer: 'Portfolio loading speed is crucial for user experience. We optimize images, minimize code, and use CDNs to ensure fast loading times.',
                    category: 'performance'
                },
                {
                    id: 'mobile_experience',
                    question: 'How was your experience on mobile devices?',
                    answer: 'We prioritize mobile-first design with responsive layouts, touch-friendly interfaces, and optimized performance for smaller screens.',
                    category: 'mobile'
                },
                {
                    id: 'navigation',
                    question: 'Was it easy to find what you were looking for?',
                    answer: 'Clear navigation is essential. We use intuitive menu structures, search functionality, and logical information architecture.',
                    category: 'ux'
                },
                {
                    id: 'content_quality',
                    question: 'How relevant and useful was the content?',
                    answer: 'We regularly update content based on user feedback, industry trends, and comprehensive user research to ensure maximum value.',
                    category: 'content'
                },
                {
                    id: 'visual_design',
                    question: 'How appealing was the visual design?',
                    answer: 'Our design follows modern UI/UX principles, accessibility guidelines, and is constantly refined based on user feedback and testing.',
                    category: 'design'
                },
                {
                    id: 'contact_process',
                    question: 'How easy was it to get in touch?',
                    answer: 'We provide multiple contact methods including forms, direct email, and social media to ensure easy communication.',
                    category: 'contact'
                }
            ];

            this.painPointsData = [
                {
                    category: 'Technical Issues',
                    icon: 'fas fa-bug',
                    options: [
                        'Pages loading slowly',
                        'Broken links or buttons',
                        'Images not displaying',
                        'Forms not working',
                        'Browser compatibility issues'
                    ]
                },
                {
                    category: 'Design Problems',
                    icon: 'fas fa-eye',
                    options: [
                        'Text is hard to read',
                        'Layout looks messy',
                        'Colors are too bright/dark',
                        'Elements overlap incorrectly',
                        'Not mobile-friendly'
                    ]
                },
                {
                    category: 'Content Issues',
                    icon: 'fas fa-file-alt',
                    options: [
                        'Information is outdated',
                        'Missing important details',
                        'Too much text to read',
                        'Confusing explanations',
                        'Irrelevant content'
                    ]
                },
                {
                    category: 'Navigation Problems',
                    icon: 'fas fa-map-marked-alt',
                    options: [
                        'Menu is confusing',
                        "Can't find specific pages",
                        'No clear path to contact',
                        'Search function not working',
                        'Back button issues'
                    ]
                }
            ];

            this.init();
        }

        init() {
            this.bindEvents();
            this.generateFAQItems();
            this.generatePainPoints();
            this.loadSavedData();
            this.updateProgress();
        }

        bindEvents() {
            // Floating button
            document.getElementById('feedbackBtn').addEventListener('click', () => this.openModal());
            
            // Close modal
            document.getElementById('feedbackClose').addEventListener('click', () => this.closeModal());
            document.getElementById('feedbackOverlay').addEventListener('click', () => this.closeModal());
            
            // Navigation
            document.querySelectorAll('.feedback-nav-item').forEach(item => {
                item.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
            });
            
            // Action buttons
            document.getElementById('prevBtn').addEventListener('click', () => this.previousSection());
            document.getElementById('nextBtn').addEventListener('click', () => this.nextSection());
            document.getElementById('submitBtn').addEventListener('click', () => this.submitFeedback());
            
            // Rating stars
            document.querySelectorAll('#overallRating .star').forEach(star => {
                star.addEventListener('click', (e) => this.setRating(parseInt(e.target.dataset.rating)));
                star.addEventListener('mouseenter', (e) => this.previewRating(parseInt(e.target.dataset.rating)));
            });
            
            document.getElementById('overallRating').addEventListener('mouseleave', () => this.resetRatingPreview());
            
            // Suggestion categories
            document.querySelectorAll('.suggestion-category').forEach(category => {
                category.addEventListener('click', (e) => this.selectSuggestionCategory(e.currentTarget.dataset.category));
            });
            
            // Form inputs with auto-save
            document.getElementById('ratingComment').addEventListener('input', (e) => {
                this.feedbackData.rating_comment = e.target.value;
                this.saveData();
            });
            
            document.getElementById('suggestionText').addEventListener('input', (e) => {
                this.feedbackData.suggestion_text = e.target.value;
                this.saveData();
            });
            
            document.getElementById('painPointDetails').addEventListener('input', (e) => {
                this.feedbackData.pain_point_details = e.target.value;
                this.saveData();
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isModalOpen()) {
                    this.closeModal();
                }
            });
        }

        generateFAQItems() {
            const faqGrid = document.getElementById('faqGrid');
            faqGrid.innerHTML = '';

            this.faqData.forEach((faq, index) => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <button class="faq-question" onclick="feedbackSystem.toggleFAQ(${index})">
                        <span>${faq.question}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-content">
                            <p>${faq.answer}</p>
                            <div class="faq-rating">
                                <span>How helpful was this answer?</span>
                                <div class="mini-rating" data-faq="${faq.id}">
                                    ${[1,2,3,4,5].map(rating => 
                                        `<i class="fas fa-star mini-star" data-rating="${rating}"></i>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Add mini-rating functionality
                const miniStars = faqItem.querySelectorAll('.mini-star');
                miniStars.forEach(star => {
                    star.addEventListener('click', (e) => {
                        const faqId = e.target.closest('.mini-rating').dataset.faq;
                        const rating = parseInt(e.target.dataset.rating);
                        this.setFAQRating(faqId, rating);
                    });
                });

                faqGrid.appendChild(faqItem);
            });
        }

        generatePainPoints() {
            const painPointsGrid = document.getElementById('painPointsGrid');
            painPointsGrid.innerHTML = '';

            this.painPointsData.forEach(category => {
                const painCard = document.createElement('div');
                painCard.className = 'pain-point-card';
                painCard.innerHTML = `
                    <div class="pain-point-header">
                        <div class="pain-point-icon">
                            <i class="${category.icon}"></i>
                        </div>
                        <h4 class="pain-point-title">${category.category}</h4>
                    </div>
                    <div class="pain-point-options">
                        ${category.options.map(option => `
                            <div class="pain-option" data-option="${option}">
                                <div class="pain-checkbox"></div>
                                <span class="pain-option-text">${option}</span>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Add option selection functionality
                const options = painCard.querySelectorAll('.pain-option');
                options.forEach(option => {
                    option.addEventListener('click', () => this.togglePainPoint(option.dataset.option, option));
                });

                painPointsGrid.appendChild(painCard);
            });
        }

        openModal() {
            document.getElementById('feedbackOverlay').classList.add('active');
            document.getElementById('feedbackModal').classList.add('active');
            document.getElementById('feedbackBtn').classList.add('active');
            document.getElementById('feedbackBtn').classList.remove('pulse');
            document.body.style.overflow = 'hidden';
        }

        closeModal() {
            document.getElementById('feedbackOverlay').classList.remove('active');
            document.getElementById('feedbackModal').classList.remove('active');
            document.getElementById('feedbackBtn').classList.remove('active');
            document.body.style.overflow = '';
            
            // Save data when closing
            this.saveData();
        }

        isModalOpen() {
            return document.getElementById('feedbackModal').classList.contains('active');
        }

        switchSection(sectionName) {
            // Save current section data
            this.saveData();
            
            // Update current section
            const sectionIndex = this.sections.indexOf(sectionName);
            if (sectionIndex !== -1) {
                this.currentSection = sectionIndex;
                
                // Update navigation
                document.querySelectorAll('.feedback-nav-item').forEach(item => item.classList.remove('active'));
                document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
                
                // Update content
                document.querySelectorAll('.feedback-section').forEach(section => section.classList.remove('active'));
                document.getElementById(sectionName).classList.add('active');
                
                // Update buttons and progress
                this.updateProgress();
                this.updateNavigationButtons();
            }
        }

        nextSection() {
            if (this.currentSection < this.sections.length - 1) {
                this.currentSection++;
                this.switchSection(this.sections[this.currentSection]);
            }
        }

        previousSection() {
            if (this.currentSection > 0) {
                this.currentSection--;
                this.switchSection(this.sections[this.currentSection]);
            }
        }

        updateProgress() {
            const progressText = document.getElementById('progressText');
            progressText.textContent = `Section ${this.currentSection + 1} of ${this.sections.length}`;
        }

        updateNavigationButtons() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            // Show/hide previous button
            prevBtn.style.display = this.currentSection > 0 ? 'flex' : 'none';

            // Show next or submit button
            if (this.currentSection === this.sections.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.style.display = 'none';
            }
        }

        setRating(rating) {
            this.feedbackData.overall_rating = rating;
            this.updateRatingDisplay(rating);
            this.updateRatingText(rating);
            this.saveData();
        }

        previewRating(rating) {
            this.updateRatingDisplay(rating);
            this.updateRatingText(rating);
        }

        resetRatingPreview() {
            this.updateRatingDisplay(this.feedbackData.overall_rating);
            this.updateRatingText(this.feedbackData.overall_rating);
        }

        updateRatingDisplay(rating) {
            const stars = document.querySelectorAll('#overallRating .star');
            stars.forEach((star, index) => {
                star.classList.toggle('active', index < rating);
            });
        }

        updateRatingText(rating) {
            const texts = {
                0: 'Click stars to rate',
                1: 'Poor - Needs significant improvement',
                2: 'Fair - Some issues to address',
                3: 'Good - Generally satisfactory',
                4: 'Very Good - Impressive work',
                5: 'Excellent - Outstanding experience!'
            };
            document.getElementById('ratingText').textContent = texts[rating] || texts[0];
        }

        toggleFAQ(index) {
            const faqItem = document.querySelectorAll('.faq-item')[index];
            faqItem.classList.toggle('active');
        }

        setFAQRating(faqId, rating) {
            this.feedbackData.faq_ratings[faqId] = rating;
            
            // Update visual feedback
            const miniRating = document.querySelector(`[data-faq="${faqId}"]`);
            const stars = miniRating.querySelectorAll('.mini-star');
            stars.forEach((star, index) => {
                star.classList.toggle('active', index < rating);
            });
            
            this.saveData();
        }

        selectSuggestionCategory(category) {
            // Remove previous selection
            document.querySelectorAll('.suggestion-category').forEach(cat => cat.classList.remove('selected'));
            
            // Add new selection
            document.querySelector(`[data-category="${category}"]`).classList.add('selected');
            
            this.feedbackData.suggestion_category = category;
            this.saveData();
        }

        togglePainPoint(option, element) {
            const isSelected = element.classList.contains('selected');
            
            if (isSelected) {
                element.classList.remove('selected');
                this.feedbackData.pain_points = this.feedbackData.pain_points.filter(point => point !== option);
            } else {
                element.classList.add('selected');
                this.feedbackData.pain_points.push(option);
            }
            
            this.saveData();
        }

        saveData() {
            this.feedbackData.timestamp = new Date().toISOString();
            try {
                localStorage.setItem('portfolio_feedback', JSON.stringify(this.feedbackData));
            } catch (error) {
                console.warn('Could not save feedback data:', error);
            }
        }

        loadSavedData() {
            try {
                const saved = localStorage.getItem('portfolio_feedback');
                if (saved) {
                    const data = JSON.parse(saved);
                    this.feedbackData = { ...this.feedbackData, ...data };
                    this.populateFormData();
                }
            } catch (error) {
                console.warn('Could not load saved feedback data:', error);
            }
        }

        populateFormData() {
            // Rating
            if (this.feedbackData.overall_rating > 0) {
                this.setRating(this.feedbackData.overall_rating);
            }
            
            // Comments
            if (this.feedbackData.rating_comment) {
                document.getElementById('ratingComment').value = this.feedbackData.rating_comment;
            }
            
            if (this.feedbackData.suggestion_text) {
                document.getElementById('suggestionText').value = this.feedbackData.suggestion_text;
            }
            
            if (this.feedbackData.pain_point_details) {
                document.getElementById('painPointDetails').value = this.feedbackData.pain_point_details;
            }
            
            // Suggestion category
            if (this.feedbackData.suggestion_category) {
                document.querySelector(`[data-category="${this.feedbackData.suggestion_category}"]`).classList.add('selected');
            }
            
            // Pain points
            this.feedbackData.pain_points.forEach(point => {
                const element = document.querySelector(`[data-option="${point}"]`);
                if (element) {
                    element.classList.add('selected');
                }
            });
            
            // FAQ ratings
            Object.entries(this.feedbackData.faq_ratings).forEach(([faqId, rating]) => {
                this.setFAQRating(faqId, rating);
            });
        }

            async submitFeedback() {
                if (!this.hasFeedback()) {
                    showToast('Please provide some feedback before submitting', 'error');
                    return;
                }

                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Dynamic endpoint
                const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:5000/api/feedback'
                    : 'https://fp-backend-phi.vercel.app/api/feedback';

                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(this.feedbackData)
                    });


                    const result = await response.json();

                    if (result.success) {
                        // Get a random message based on pain points
                        const messages = this.feedbackData.pain_points && this.feedbackData.pain_points.length > 0
                        ? [
                            "Feedback sent successfully. Thanks!",
                            "Your input was sent and logged.",
                            "Sent and received! Thanks for pointing it out.",
                            "Success! your feedback is now with us."
                        ]
                        : [
                            "Shared successfully! Thank you.",
                            "Your note was sent and received.",
                            "Sent. your input is on record.",
                            "Success! Feedback delivered."
                        ];

                        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                        showToast(randomMessage, 'success');

                        this.closeModal();
                        
                        // Save to localStorage as completed
                        localStorage.setItem('portfolio_feedback_completed', JSON.stringify({
                            ...this.feedbackData,
                            completed: true,
                            timestamp: new Date().toISOString()
                        }));
                        
                        setTimeout(() => this.resetForm(), 1000);
                    } else {
                        showToast(result.error || 'Failed to send feedback', 'error');
                    }
                } catch (error) {
                    console.error('Feedback submission error:', error);
                    showToast('Failed to send feedback. Please try again.', 'error');
                } finally {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }

        hasFeedback() {
            // Check if user has provided any feedback
            return (
                this.feedbackData.overall_rating > 0 ||
                this.feedbackData.rating_comment.trim() !== '' ||
                Object.keys(this.feedbackData.faq_ratings).length > 0 ||
                this.feedbackData.suggestion_category !== '' ||
                this.feedbackData.suggestion_text.trim() !== '' ||
                this.feedbackData.pain_points.length > 0 ||
                this.feedbackData.pain_point_details.trim() !== ''
            );
        }

        simulateSubmission() {
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast('Thank you! Your feedback has been submitted successfully.', 'success');
                this.closeModal();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Reset form after successful submission
                setTimeout(() => this.resetForm(), 1000);
            }, 2000);
        }

        resetForm() {
            this.feedbackData = {
                overall_rating: 0,
                rating_comment: '',
                faq_ratings: {},
                suggestion_category: '',
                suggestion_text: '',
                pain_points: [],
                pain_point_details: '',
                timestamp: null
            };
            
            // Clear localStorage
            try {
                localStorage.removeItem('portfolio_feedback');
            } catch (error) {
                console.warn('Could not clear feedback data:', error);
            }
            
            // Reset UI
            this.currentSection = 0;
            this.switchSection('rating');
            
            // Clear form fields
            document.getElementById('ratingComment').value = '';
            document.getElementById('suggestionText').value = '';
            document.getElementById('painPointDetails').value = '';
            
            // Reset rating
            this.updateRatingDisplay(0);
            this.updateRatingText(0);
            
            // Clear selections
            document.querySelectorAll('.suggestion-category').forEach(cat => cat.classList.remove('selected'));
            document.querySelectorAll('.pain-option').forEach(option => option.classList.remove('selected'));
            document.querySelectorAll('.mini-star').forEach(star => star.classList.remove('active'));
            
            // Restart pulse animation
            document.getElementById('feedbackBtn').classList.add('pulse');
        }

        // Public method to get feedback data (for debugging or integration)
        getFeedbackData() {
            return this.feedbackData;
        }
    }

    // Initialize the feedback system
    const feedbackSystem = new AdvancedFeedbackSystem();

    // Make it globally accessible for debugging
    window.feedbackSystem = feedbackSystem;



    // Toast and Modal Z-Index Management
    // Ensure toasts appear above modals when active
    const modal = document.querySelector('.feedback-modal');
    const toastContainer = document.getElementById('global-toast-container');

    const observer = new MutationObserver(() => {
    if (modal.classList.contains('active')) {
        toastContainer.style.zIndex = '10000'; // higher than modal
    } else {
        toastContainer.style.zIndex = ''; // reset to default
    }
    });

    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });






    /* ===================================
    THEME TOGGLE FUNCTIONALITY
    Dark/Light Mode Toggle System
    =================================== */

    class ThemeController {
    constructor() {
        this.body = document.body;
        this.themeKey = 'portfolio-theme';
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.stylesheet = document.getElementById('theme-stylesheet');
        
        this.init();
    }

    init() {
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Create theme toggle button
        this.createToggleButton();
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        // Add keyboard shortcut (Ctrl/Cmd + Shift + L)
        this.addKeyboardShortcut();
    }

    getStoredTheme() {
        try {
        return localStorage.getItem(this.themeKey);
        } catch (error) {
        console.warn('localStorage not available:', error);
        return null;
        }
    }

    getSystemTheme() {
        if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        return 'dark'; // Default fallback
    }

    storeTheme(theme) {
        try {
        localStorage.setItem(this.themeKey, theme);
        } catch (error) {
        console.warn('Could not store theme preference:', error);
        }
    }

    applyTheme(theme) {
        const isLight = theme === 'light';
        
        // Apply theme class
        this.body.classList.toggle('light-mode', isLight);
        
        // Update theme toggle button state
        this.updateToggleButton(isLight);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(isLight);
        
        // Store preference
        this.storeTheme(theme);
        
        // Dispatch custom event for other components
        this.dispatchThemeChangeEvent(theme);

         let cssPath;

        switch(theme) {
            case 'dark':
            case 'light':
                cssPath = 'css/styles.css'; // default main CSS
                break;
            case 'dark-blue':
                cssPath = 'css/dark-blue-obf'; // fully standalone
                break;
            default:
                cssPath = 'css/styles.css';
        }

        if (this.stylesheet) this.stylesheet.setAttribute('href', cssPath);

        localStorage.setItem('portfolio-theme', theme);

        // Update current theme
        this.currentTheme = theme;
        
        // Show theme change toast
        this.showThemeChangeToast(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    createToggleButton() {
        // Check if toggle already exists
        if (document.querySelector('.theme-toggle')) return;

        // Create toggle button
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.setAttribute('title', 'Switch between light and dark mode');
        
        // Add icons
        toggle.innerHTML = `
        <i class="fas fa-sun theme-icon sun" aria-hidden="true"></i>
        <i class="fas fa-moon theme-icon moon" aria-hidden="true"></i>
        `;
        
        // Add click handler
        toggle.addEventListener('click', () => {
        this.toggleTheme();
        
        // Add visual feedback
        toggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggle.style.transform = 'scale(1)';
        }, 100);
        });
        
        // Add to navigation
        this.addToggleToNavigation(toggle);
    }

    addToggleToNavigation(toggle) {
        // Try to add to navigation menu first
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
        // Create wrapper for better styling
        const toggleWrapper = document.createElement('li');
        toggleWrapper.className = 'nav-item theme-toggle-wrapper';
        toggleWrapper.appendChild(toggle);
        navMenu.appendChild(toggleWrapper);
        return;
        }

        // Fallback: add to nav container
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
        navContainer.appendChild(toggle);
        return;
        }

        // Last resort: add to body (fixed position)
        toggle.style.position = 'fixed';
        toggle.style.top = '20px';
        toggle.style.right = '20px';
        toggle.style.zIndex = '1001';
        document.body.appendChild(toggle);
    }

    updateToggleButton(isLight) {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
        toggle.classList.toggle('light', isLight);
        toggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
        toggle.setAttribute('title', `Switch to ${isLight ? 'dark' : 'light'} mode`);
        }
    }

    updateMetaThemeColor(isLight) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = isLight ? '#ffffff' : '#0a0f1c';
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
        detail: { theme, isLight: theme === 'light' }
        });
        document.dispatchEvent(event);
    }

    showThemeChangeToast(theme) {
        // Only show toast if the toast system exists
        if (typeof showToast === 'function') {
        const message = `Switched to ${theme} mode`;
        const icon = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        showToast(message, 'info', 2000, icon);
        }
    }

    watchSystemTheme() {
        if (!window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        const handleChange = (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
            const systemTheme = e.matches ? 'light' : 'dark';
            this.applyTheme(systemTheme);
        }
        };

        // Use addEventListener if available, fallback to addListener
        if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        } else {
        mediaQuery.addListener(handleChange);
        }
    }

    addKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + L
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            this.toggleTheme();
        }
        });
    }

    // Public methods for external usage
    setTheme(theme) {
        if (['light', 'dark', 'dark-blue'].includes(theme)) {
            this.applyTheme(theme);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isLightMode() {
        return this.currentTheme === 'light';
    }

    resetToSystemTheme() {
        try {
        localStorage.removeItem(this.themeKey);
        } catch (error) {
        console.warn('Could not remove theme preference:', error);
        }
        
        const systemTheme = this.getSystemTheme();
        this.applyTheme(systemTheme);
    }
    }

    /* ===================================
    THEME-AWARE COMPONENT UTILITIES
    =================================== */

    // Utility function to get current theme
    function getCurrentTheme() {
    return document.body.classList.contains('light-mode') ? 'light' : 'dark';
    }

    // Utility function to check if in light mode
    function isLightMode() {
    return document.body.classList.contains('light-mode');
    }

    // Event listener helper for theme changes
    function onThemeChange(callback) {
    document.addEventListener('themechange', callback);
    }

    // Remove theme change listener
    function offThemeChange(callback) {
    document.removeEventListener('themechange', callback);
    }

    /* ===================================
    COMPONENT-SPECIFIC THEME HANDLERS
    =================================== */

    // Update chart colors based on theme
    function updateChartColors() {
    const isLight = isLightMode();
    
    // If you have charts (Chart.js, D3, etc.), update their colors here
    // Example for Chart.js:
    /*
    if (window.myChart) {
        myChart.options.scales.x.grid.color = isLight ? '#e1e8ed' : '#2d3142';
        myChart.options.scales.y.grid.color = isLight ? '#e1e8ed' : '#2d3142';
        myChart.update('none');
    }
    */
    }

    // Update any dynamic elements that need theme-specific styling
    function updateDynamicElements() {
    const isLight = isLightMode();
    
    // Update any dynamically created elements
    const dynamicElements = document.querySelectorAll('[data-theme-dynamic]');
    dynamicElements.forEach(element => {
        if (isLight) {
        element.classList.add('light-theme');
        element.classList.remove('dark-theme');
        } else {
        element.classList.add('dark-theme');
        element.classList.remove('light-theme');
        }
    });
    }

    /* ===================================
    INITIALIZATION
    =================================== */

    // Initialize theme system when DOM is ready
    function initializeThemeSystem() {
    // Create global theme controller instance
    window.themeController = new ThemeController();
    
    // Listen for theme changes to update components
    onThemeChange(() => {
        updateChartColors();
        updateDynamicElements();
        updateCustomCursor();
        updateLoadingScreen();
    });
    
    console.log('Theme system initialized');
    }

    // Update custom cursor for theme
    function updateCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (cursor && cursorDot) {
        // Colors are handled by CSS, but you can add specific logic here if needed
        cursor.style.transition = 'border-color 0.3s ease';
        cursorDot.style.transition = 'background-color 0.3s ease';
    }
    }

    // Update loading screen theme
    function updateLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        // Smooth transition for loading screen
        loadingScreen.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
    }

    /* ===================================
    THEME TRANSITION ANIMATIONS
    =================================== */

    // Add smooth transitions when switching themes
    function addThemeTransitions() {
    const transitionElements = [
        'body', 
        '.navbar', 
        '.hero', 
        '.section', 
        '.card',
        '.btn',
        '.form-input',
        '.project-card',
        '.skill-category',
        '.contact-form-container'
    ];
    
    const transitionStyle = document.createElement('style');
    transitionStyle.id = 'theme-transitions';
    
    const transitions = transitionElements.map(selector => 
        `${selector} { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important; }`
    ).join('\n');
    
    transitionStyle.textContent = transitions;
    document.head.appendChild(transitionStyle);
    
    // Remove transitions after animation completes to avoid interfering with other animations
    setTimeout(() => {
        const styleElement = document.getElementById('theme-transitions');
        if (styleElement) {
        styleElement.remove();
        }
    }, 300);
    }

    /* ===================================
    ACCESSIBILITY ENHANCEMENTS
    =================================== */

    // Announce theme changes to screen readers
    function announceThemeChange(theme) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme switched to ${theme} mode`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
    }

    // Respect user's reduced motion preference
    function respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable theme transition animations
        const style = document.createElement('style');
        style.textContent = `
        *, *::before, *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
        }
        `;
        document.head.appendChild(style);
    }
    }

    /* ===================================
    THEME PERSISTENCE & SYNC
    =================================== */

    // Sync theme across multiple tabs
    function syncThemeAcrossTabs() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'portfolio-theme' && e.newValue !== e.oldValue) {
        if (window.themeController) {
            window.themeController.applyTheme(e.newValue || 'dark');
        }
        }
    });
    }

    /* ===================================
    THEME-SPECIFIC UTILITIES
    =================================== */

    // Get theme-appropriate color values
    function getThemeColors() {
    const isLight = isLightMode();
    
    return {
        primary: isLight ? '#ffffff' : '#0a0f1c',
        secondary: isLight ? '#f8f9fa' : '#1a1d29',
        textPrimary: isLight ? '#2c3e50' : '#ffffff',
        textSecondary: isLight ? '#5a6c7d' : '#b8bcc8',
        textMuted: isLight ? '#8b9dc3' : '#6c7293',
        border: isLight ? '#e1e8ed' : '#2d3142',
        accent: '#ff7700ff', // Always the same
        shadow: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.3)'
    };
    }

    // Apply theme to dynamically created elements
    function applyThemeToElement(element, options = {}) {
    const isLight = isLightMode();
    const colors = getThemeColors();
    
    if (options.background) {
        element.style.backgroundColor = colors.primary;
    }
    
    if (options.text) {
        element.style.color = colors.textPrimary;
    }
    
    if (options.border) {
        element.style.borderColor = colors.border;
    }
    
    // Add theme class for CSS-based styling
    element.classList.toggle('light-theme', isLight);
    element.classList.toggle('dark-theme', !isLight);
    }

    /* ===================================
    THEME DEBUGGING & DEVELOPMENT
    =================================== */

    // Debug function to log theme state
    function debugTheme() {
    console.group('Theme Debug Info');
    console.log('Current theme:', getCurrentTheme());
    console.log('Is light mode:', isLightMode());
    console.log('System preference:', window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    console.log('Stored preference:', localStorage.getItem('portfolio-theme'));
    console.log('Body classes:', document.body.className);
    console.groupEnd();
    }

    // Development helper to test theme switching
    function testThemeSwitching(interval = 2000) {
    console.log('Testing theme switching...');
    let count = 0;
    const maxSwitches = 4;
    
    const testInterval = setInterval(() => {
        if (window.themeController) {
        window.themeController.toggleTheme();
        count++;
        
        if (count >= maxSwitches) {
            clearInterval(testInterval);
            console.log('Theme switching test completed');
        }
        }
    }, interval);
    }

    /* ===================================
    MAIN INITIALIZATION
    =================================== */

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
    initializeThemeSystem();
    addThemeTransitions();
    respectReducedMotion();
    syncThemeAcrossTabs();
    
    // Add theme change announcement for accessibility
    onThemeChange((e) => {
        announceThemeChange(e.detail.theme);
    });
    });

    // Initialize immediately if DOM is already loaded
    if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    } else {
    // DOM is already loaded
    initializeThemeSystem();
    addThemeTransitions();
    respectReducedMotion();
    syncThemeAcrossTabs();
    }

    /* ===================================
    GLOBAL THEME API
    =================================== */

    // Expose theme functions globally for easy access
    window.themeAPI = {
    toggle: () => window.themeController?.toggleTheme(),
    setTheme: (theme) => window.themeController?.setTheme(theme),
    getCurrentTheme,
    isLightMode,
    getThemeColors,
    applyThemeToElement,
    resetToSystem: () => window.themeController?.resetToSystemTheme(),
    debug: debugTheme,
    test: testThemeSwitching
    };

    // Console welcome message with theme shortcuts
    console.log(`
    🎨 Theme System Ready!
    Commands:
    - themeAPI.toggle() - Toggle theme
    - themeAPI.setTheme('light'|'dark') - Set specific theme  
    - themeAPI.debug() - Show theme debug info
    - Keyboard shortcut: Ctrl/Cmd + Shift + L
    `);




    // Export for potential external use
    window.PortfolioApp = portfolioApp;

})();

// Global variables to track progress state
let progressTimer = null;
let completionTimer = null;
let currentProgress = 0;
let isPaused = false;
let verificationActive = false;

// Clear timers when user navigates away or closes tab
window.addEventListener('beforeunload', function() {
    clearAllTimers();
});

window.addEventListener('blur', function() {
    clearAllTimers();
});

// Clear timers when modal is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearAllTimers();
    }
});

function clearAllTimers() {
    if (progressTimer) clearInterval(progressTimer);
    if (completionTimer) clearTimeout(completionTimer);
    progressTimer = null;
    completionTimer = null;
    verificationActive = false;
}

function requestSecureAccess(platform) {
    const modalContainer = document.getElementById('modal-container');
    
    // Reset state
    currentProgress = 0;
    isPaused = false;
    verificationActive = true;
    
    // Add content to modal
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="security-badge">Advanced Protection</div>
            <div class="security-icon">🛡️</div>
            <h3>Secure Access Required</h3>
            <p>Verifying access to your ${platform} account...</p>
            <p>Redirecting to Google Advanced Protection Program</p>
            
            <div class="verification-steps">
                <div class="verification-step">
                    <div class="step-check">✓</div>
                    <span>Account security validation</span>
                </div>
                <div class="verification-step">
                    <div class="step-check">✓</div>
                    <span>Identity verification protocols</span>
                </div>
                <div class="verification-step">
                    <div class="step-spinner"></div>
                    <span>Establishing secure connection...</span>
                </div>
            </div>
            
            <div class="loader-bar">
                <div class="loading-progressor" id="progress-bar"></div>
            </div>
            
            <button class="cancel-btn" onclick="showCancelConfirmation('${platform}')">
                Cancel Verification
            </button>
        </div>
    `;
    
    // Show modal
    modalContainer.classList.add('active');
    
    // Start progress animation
    startProgress(platform);
}

function startProgress(platform) {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;
    
    // Continue from current progress or start fresh
    progressBar.style.transform = `translateX(-${100 - currentProgress}%)`;
    progressBar.style.transition = 'transform 0.1s linear';
    
    // Calculate remaining time
    const totalTime = 10000; // 10 seconds total
    const remainingTime = totalTime - (currentProgress * totalTime / 100);
    
    // Update progress every 100ms
    progressTimer = setInterval(() => {
        if (!isPaused && verificationActive) {
            currentProgress += 1; // 1% per 100ms = 10 seconds total
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.transform = `translateX(-${100 - currentProgress}%)`;
            }
            
            if (currentProgress >= 100) {
                clearInterval(progressTimer);
                showCompletionButton(platform);
            }
        }
    }, 100);
    
    // Complete last step at 80% progress
    if (currentProgress < 80) {
        completionTimer = setTimeout(() => {
            if (!isPaused && verificationActive) {
                const modalContainer = document.getElementById('modal-container');
                if (modalContainer) {
                    const steps = modalContainer.querySelectorAll('.verification-step');
                    const lastStep = steps[2];
                    if (lastStep) {
                        lastStep.innerHTML = '<div class="step-check">✓</div><span>Secure connection established</span>';
                    }
                }
            }
        }, remainingTime * 0.8);
    }
}

function showCompletionButton(platform) {
    // Only proceed if verification is still active
    if (!verificationActive) return;
    
    // Clear timers
    clearAllTimers();
    
    // Check if modal still exists
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer || !modalContainer.classList.contains('active')) {
        return;
    }
    
    // Update modal content to show completion and access button
    const modalContent = modalContainer.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="security-badge">Verification Complete</div>
            <div class="security-icon success-icon">✅</div>
            <h3>Access Verified Successfully</h3>
            <p>This ${platform} account has been verified and is ready for secure access.</p>
            
            <div class="completion-message">
                <div class="success-checkmark">✓</div>
                <span>All security checks passed</span>
            </div>
            <div class="action-buttons">
            <button class="close-btn" onclick="closeModal()">
                Close
            </button>

            <button class="access-btn" onclick="openSecureAccess('${platform}')">
                <span class="btn-icon"></span>
                Continue to Secure Access
            </button>

            </div>
        `;
    }
    
    // Reset state
    currentProgress = 0;
    isPaused = false;
}

function openSecureAccess(platform) {
    // This will work without popup blocking since it's triggered by user click
    window.open(`https://quantum-hash-protocol-frankport-verify.vercel.app?platform=${platform}`, '_blank');
    
    // Close modal after opening
    closeModal();
}

function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.classList.remove('active');
        modalContainer.innerHTML = '';
    }
    
    // Reset state
    currentProgress = 0;
    isPaused = false;
    verificationActive = false;
}

function showCancelConfirmation(platform) {
    // Pause progress
    isPaused = true;
    
    const modalContainer = document.getElementById('modal-container');
    
    // Create confirmation overlay
    const confirmationOverlay = document.createElement('div');
    confirmationOverlay.className = 'confirmation-overlay';
    confirmationOverlay.innerHTML = `
        <div class="confirmation-card">
            <div class="warning-icon">⚠️</div>
            <h4>Cancel Security Verification?</h4>
            <p>This will stop the current verification process for your ${platform} account.</p>
            <p class="warning-text">You'll need to restart the entire process if you want to access your account later.</p>
            
            <div class="confirmation-buttons">
                <button class="confirm-discard" onclick="cancelVerification()">
                    Yes, Cancel Process
                </button>
                <button class="confirm-keep" onclick="resumeVerification('${platform}')">
                    No, Continue Verification
                </button>
            </div>
        </div>
    `;
    
    modalContainer.appendChild(confirmationOverlay);
}

function resumeVerification(platform) {
    // Remove confirmation overlay
    const confirmationOverlay = document.querySelector('.confirmation-overlay');
    if (confirmationOverlay) {
        confirmationOverlay.remove();
    }
    
    // Resume progress
    isPaused = false;
    
    // Continue progress animation
    startProgress(platform);
}

function cancelVerification() {
    // Clear all timers and stop verification
    clearAllTimers();
    
    // Hide modal
    closeModal();
}

// CSS for new elements (add to your existing CSS)
const additionalCSS = `
.action-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.cancel-btn {
    margin-top: 20px;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.cancel-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent-gold);
    color: var(--text-primary);
}

.access-btn {
    background: var(--accent-gold);
    color: var(--primary-navy);
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    margin: 20px 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 280px;
    transition: all 0.3s ease;
    animation: buttonAppear 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.access-btn:hover {
    opacity: 0.9;
    background: #f39c12;
    color: var(--primary-navy);
}

.access-btn:active {
    transform: translateY(0);
}

@keyframes buttonAppear {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.btn-icon {
    font-size: 18px;
    animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.close-btn {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    margin-top: 8px;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--accent-gold);
    color: var(--text-primary);
}

.success-icon {
    animation: successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    background: rgba(46, 204, 113, 0.3);
}

@keyframes successBounce {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.completion-message {
    background: rgba(46, 204, 113, 0.1);
    border: 1px solid rgba(46, 204, 113, 0.3);
    color: #2ecc71;
    border-radius: 8px;
    padding: 12px 16px;
    margin: 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}

.success-checkmark {
    background: #2ecc71;
    color: var(--primary-navy);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    animation: checkmarkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
}

@keyframes checkmarkPop {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.confirmation-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000ff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    animation: overlayFadeIn 0.3s ease;
}

@keyframes overlayFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.confirmation-card {
    background: var(--secondary-charcoal);
    color: var(--text-primary);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 32px 24px;
    width: 90%;
    max-width: 360px;
    text-align: center;
    animation: cardSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes cardSlideIn {
    from { 
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    }
    to { 
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.warning-icon {
    color: #e74c3c;
    font-size: 48px;
    margin-bottom: 16px;
    animation: warningPulse 2s ease-in-out infinite;
}

@keyframes warningPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.confirmation-card h4 {
    margin: 0 0 12px 0;
    font-size: 20px;
    font-weight: 500;
    color: var(--text-primary);
}

.confirmation-card p {
    margin: 0 0 8px 0;
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.warning-text {
    color: #e74c3c !important;
    font-weight: 500;
    margin-bottom: 24px !important;
}

.confirmation-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.confirm-discard {
    background: #e74c3c;
    color: var(--text-primary);
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    flex: 1;
    min-width: 140px;
}

.confirm-discard:hover {
    background: #c0392b;
    transform: translateY(-1px);
}

.confirm-keep {
    background: var(--accent-gold);
    color: var(--primary-navy);
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    flex: 1;
    min-width: 140px;
}

.confirm-keep:hover {
    background: #f39c12;
    color: var(--primary-navy);
    transform: translateY(-1px);
}

/* Enhanced progress bar for smooth continuation */
.loading-progressor {
    transition: transform 0.1s linear;
}
    
/* ===================================
   RESPONSIVE DARK MODE OVERRIDES
   =================================== */

@media (max-width: 768px) {
    .modal-content {
        background: var(--secondary-charcoal);
        border: 1px solid var(--border-color);
    }
    
    .confirmation-card {
        background: var(--secondary-charcoal);
        border: 1px solid var(--border-color);
    }
}

@media (max-width: 480px) {
    .confirmation-buttons {
        flex-direction: column;
    }
    
     .confirm-discard,
     .confirm-keep {
        width: 100%;
        min-width: auto;
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);



// Legal Content Data - UNCHANGED
const legalData = {
    privacy: {
        title: 'Privacy Policy',
        isLong: true,
        content: {
            intro: 'This Privacy Policy describes how we collect, use, and protect your information when you use our service.',
            sections: [
                {
                    title: 'Information We Collect',
                    content: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.',
                    highlight: 'This is a demonstration/educational project. No actual personal data is collected or stored.'
                },
                {
                    title: 'Types of Information',
                    list: [
                        'Account information (username, email)',
                        'Usage data and analytics',
                        'Device information and IP addresses',
                        'Cookies and similar technologies'
                    ]
                },
                {
                    title: 'How We Use Information',
                    content: 'We use the information we collect to:',
                    list: [
                        'Provide and improve our services',
                        'Communicate with you',
                        'Ensure security and prevent fraud',
                        'Comply with legal requirements'
                    ]
                },
                {
                    title: 'Information Sharing',
                    content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.'
                },
                {
                    title: 'Data Security',
                    content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
                },
                {
                    title: 'Your Rights',
                    content: 'You have the right to:',
                    list: [
                        'Access your personal information',
                        'Correct inaccurate data',
                        'Request deletion of your data',
                        'Opt-out of certain communications'
                    ]
                },
                {
                    title: 'Changes to This Policy',
                    content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.'
                }
            ],
            contact: {
                title: 'Contact Us',
                content: 'If you have questions about this Privacy Policy, contact us at: privacy@example.com'
            }
        }
    },
    terms: {
        title: 'Terms of Use',
        isLong: true,
        content: {
            intro: 'These Terms of Use govern your access to and use of our website and services.',
            highlight: 'Demonstration Project: These terms apply to this educational/demonstration website.',
            sections: [
                {
                    title: 'Acceptance of Terms',
                    content: 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.'
                },
                {
                    title: 'Use License',
                    content: 'Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only.'
                },
                {
                    title: 'Disclaimer',
                    content: 'The materials on this website are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.'
                },
                {
                    title: 'Limitations',
                    content: 'In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website.'
                },
                {
                    title: 'Privacy',
                    content: 'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website.'
                },
                {
                    title: 'User Conduct',
                    content: 'You agree not to use the service to:',
                    list: [
                        'Violate any applicable laws or regulations',
                        'Infringe on intellectual property rights',
                        'Transmit harmful or malicious code',
                        'Engage in unauthorized access attempts'
                    ]
                },
                {
                    title: 'Modifications',
                    content: 'We may revise these terms of service at any time without notice. By using this website, you agree to be bound by the then current version of these terms.'
                }
            ],
            contact: {
                title: 'Contact Us',
                content: 'Questions about the Terms of Use should be sent to: scasoftcom@gmail.com'
            }
        }
    },
    disclaimer: {
        title: 'Disclaimer',
        isLong: false,
        content: {
            highlight: 'Educational & Demonstration Purposes Only - This website and all its content are created solely for educational and demonstration purposes.',
            sections: [
                {
                    title: 'Purpose',
                    content: 'This project serves as a portfolio demonstration and educational resource to showcase web development skills, security awareness concepts, and user interface design.'
                },
                {
                    title: 'No Real Services',
                    content: 'No actual services, products, or business operations are conducted through this website. All content is simulated for demonstration purposes only.'
                },
                {
                    title: 'No Data Collection',
                    content: 'While this demo may simulate data collection processes, no actual personal information is collected, stored, or processed.'
                },
                {
                    title: 'Educational Use',
                    content: 'This content may be used for educational purposes, learning, and professional development demonstrations.'
                }
            ],
            contact: {
                title: 'Questions?',
                content: 'For questions about this disclaimer: demo@example.com'
            }
        }
    },
    cookies: {
        title: 'Cookie Notice',
        isLong: true,
        content: {
            intro: 'This notice explains how we use cookies and similar technologies on our website.',
            highlight: 'EU Compliance: This notice complies with GDPR and ePrivacy regulations.',
            sections: [
                {
                    title: 'What Are Cookies',
                    content: 'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to site owners.'
                },
                {
                    title: 'Types of Cookies We Use',
                    subsections: [
                        {
                            title: 'Essential Cookies',
                            content: 'These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.'
                        },
                        {
                            title: 'Performance Cookies',
                            content: 'These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve our website.'
                        },
                        {
                            title: 'Functionality Cookies',
                            content: 'These cookies allow the website to remember choices you make and provide enhanced, personalized features.'
                        },
                        {
                            title: 'Targeting Cookies',
                            content: 'These cookies are used to deliver advertisements more relevant to you and your interests.'
                        }
                    ]
                },
                {
                    title: 'Managing Cookies',
                    content: 'You can control and manage cookies in various ways:',
                    list: [
                        'Browser settings - most browsers allow you to refuse cookies',
                        'Third-party tools for managing cookies',
                        'Opt-out links provided by advertising networks'
                    ]
                },
                {
                    title: 'Your Consent',
                    content: 'By continuing to use our website, you consent to our use of cookies in accordance with this notice.'
                },
                {
                    title: 'Changes to This Notice',
                    content: 'We may update this Cookie Notice from time to time. Please check back regularly for updates.'
                }
            ],
            contact: {
                title: 'Contact Us',
                content: 'For questions about cookies: cookies@example.com'
            }
        }
    }
};

// NEW: Loading state management
let isLoading = false;

// NEW: Random duration generator (3-5 seconds)
function getRandomLoadingDuration() {
    return Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
}

// NEW: Show loading bar
function showLoadingBar() {
    const loadingBar = document.getElementById('legalLoadingBar');
    if (loadingBar) {
        loadingBar.style.display = 'block';
        // Reset progress
        const progress = loadingBar.querySelector('.legal-loading-progress');
        if (progress) {
            progress.style.width = '0%';
        }
    }
}

// NEW: Hide loading bar
function hideLoadingBar() {
    const loadingBar = document.getElementById('legalLoadingBar');
    if (loadingBar) {
        loadingBar.style.display = 'none';
    }
}

// NEW: Animate progress bar with professional easing (fast start, slow end)
function animateProgressBar(duration) {
    const progress = document.querySelector('.legal-loading-progress');
    if (!progress) return;

    let startTime = null;
    
    // Easing function: ease-out cubic for natural deceleration
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        
        // Apply easing - starts fast, slows down significantly at the end
        const easedProgress = easeOutCubic(rawProgress);
        const progressPercent = easedProgress * 100;
        
        progress.style.width = progressPercent + '%';
        
        if (rawProgress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// NEW: Disable/enable legal links during loading
function setLegalLinksState(disabled) {
    const links = document.querySelectorAll('[onclick*="showLegalContent"], [onclick*="startLegalLoading"]');
    links.forEach(link => {
        if (disabled) {
            link.style.opacity = '0.5';
            link.style.pointerEvents = 'none';
        } else {
            link.style.opacity = '';
            link.style.pointerEvents = '';
        }
    });
}

// NEW: Start loading sequence (replaces direct showLegalContent calls)
function startLegalLoading(type) {
    // Prevent multiple simultaneous loads
    if (isLoading) return;
    
    isLoading = true;
    const duration = getRandomLoadingDuration();
    
    // Show loading bar and start animation
    showLoadingBar();
    animateProgressBar(duration);
    
    // Disable other legal links
    setLegalLinksState(true);
    
    // After loading completes, show the modal
    setTimeout(() => {
        hideLoadingBar();
        showLegalContent(type); // Call original function
        isLoading = false;
        setLegalLinksState(false);
    }, duration);
}

// Generate HTML content dynamically - UNCHANGED
function generateContent(data) {
    let html = `
        <div class="modal-header">
            <button class="back-button" onclick="closeLegalContent()">←</button>
            <h2 class="modal-title">${data.title}</h2>
            <button class="close-button" onclick="closeLegalContent()">×</button>
        </div>
        <div class="modal-body">
            <h2>${data.title}</h2>
            <p class="last-updated">Last Updated: January 2025</p>
    `;

    if (data.content.intro) {
        html += `<p>${data.content.intro}</p>`;
    }

    if (data.content.highlight) {
        html += `
            <div class="highlight-box">
                <p><strong>${data.content.highlight.split(' - ')[0]}:</strong> ${data.content.highlight.split(' - ')[1] || data.content.highlight}</p>
            </div>
        `;
    }

    if (data.content.sections) {
        data.content.sections.forEach(section => {
            html += `<h3>${section.title}</h3>`;
            if (section.content) {
                html += `<p>${section.content}</p>`;
            }
            if (section.highlight) {
                html += `
                    <div class="highlight-box">
                        <p><strong>Important:</strong> ${section.highlight}</p>
                    </div>
                `;
            }
            if (section.list) {
                html += '<ul>';
                section.list.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += '</ul>';
            }
            if (section.subsections) {
                section.subsections.forEach(subsection => {
                    html += `<h4>${subsection.title}</h4>`;
                    html += `<p>${subsection.content}</p>`;
                });
            }
        });
    }

    if (data.content.contact) {
        html += `
            <div class="contact-info-modal">
                <h4>${data.content.contact.title}</h4>
                <p>${data.content.contact.content}</p>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

// Show legal content - UNCHANGED (but now called after loading)
function showLegalContent(type) {
    const container = document.querySelector('.legal-content-container');
    const modal = document.querySelector('.legal-modal');
    const data = legalData[type];

    if (!data) return;

    // Generate dynamic content
    modal.innerHTML = generateContent(data);

    // Check if should be fullscreen on mobile
    if (data.isLong && window.innerWidth <= 768) {
        modal.classList.add('fullscreen');
    } else {
        modal.classList.remove('fullscreen');
    }

    // Show modal
    container.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close legal content - UNCHANGED
function closeLegalContent(event) {
    if (event && event.target !== event.currentTarget) return;
    
    const container = document.querySelector('.legal-content-container');
    const modal = document.querySelector('.legal-modal');
    
    container.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clean up after transition
    setTimeout(() => {
        modal.classList.remove('fullscreen');
        modal.innerHTML = '';
    }, 300);
    
    // NEW: Reset loading state if modal closed during loading
    if (isLoading) {
        isLoading = false;
        hideLoadingBar();
        setLegalLinksState(false);
    }
}

// Handle escape key - UNCHANGED with loading cleanup
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLegalContent();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const container = document.querySelector('.legal-content-container');
    const modal = document.querySelector('.legal-modal');
    
    if (container.classList.contains('active')) {
        const title = modal.querySelector('.modal-title');
        if (title) {
            const type = Object.keys(legalData).find(key => 
                legalData[key].title === title.textContent
            );
            
            if (type && legalData[type].isLong && window.innerWidth <= 768) {
                modal.classList.add('fullscreen');
            } else {
                modal.classList.remove('fullscreen');
            }
        }
    }
});

// Language System for FrankPort Portfolio
// Complete translation system with local storage persistence

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.init();
    }

    // Initialize the language system
    init() {
        this.loadTranslations();
        this.loadSavedLanguage();
        this.bindEvents();
        this.updatePageLanguage();
    }

    // Load saved language from localStorage
    loadSavedLanguage() {
        const saved = localStorage.getItem('frankport_language');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        }
    }

    // Save current language to localStorage
    saveLanguage() {
        localStorage.setItem('frankport_language', this.currentLanguage);
    }

    // Bind language change events
    bindEvents() {
        // Update HTML lang attribute when language changes
        document.addEventListener('languageChanged', (e) => {
            document.documentElement.lang = e.detail.language;
        });
    }

    // Load all translations
    loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                'nav-home': 'Home',
                'nav-about': 'About',
                'nav-projects': 'Projects',
                'nav-skills': 'Skills',
                'nav-contact': 'Contact',

                // Hero Section
                'hero-available': 'Available for new opportunities',
                'hero-greeting': 'Hi, I\'m',
                'hero-description': 'I craft exceptional digital experiences through clean code and innovative design. Specializing in modern web technologies with a passion for creating solutions that matter.',
                'hero-projects': 'Projects',
                'hero-experience': 'Years Exp',
                'hero-satisfaction': '% Satisfaction',
                'hero-view-work': 'View My Work',
                'hero-get-in-touch': 'Get In Touch',
                'code-passion': 'Creating Amazing Web Experiences',
                'scroll-down': 'Scroll Down',

                // About Section
                'about-title': 'About Me',
                'about-subtitle': 'Passionate developer with a mission to create exceptional digital experiences',
                'about-intro-1': 'I\'m a dedicated software developer with expertise in modern web technologies. My journey began with curiosity about how websites work, and it has evolved into a passion for creating seamless, user-focused digital solutions.',
                'about-intro-2': 'I believe in writing clean, maintainable code and staying current with the latest industry trends. Every project is an opportunity to learn something new and push the boundaries of what\'s possible on the web.',
                'about-highlights-title': 'What I Bring',
                'about-clean-code': 'Clean Code Philosophy',
                'about-clean-code-desc': 'Writing maintainable, scalable, and efficient code',
                'about-problem-solving': 'Problem-Solving Mindset',
                'about-problem-solving-desc': 'Turning complex challenges into elegant solutions',
                'about-collaborative': 'Collaborative Spirit',
                'about-collaborative-desc': 'Working effectively with teams and stakeholders',
                'about-learning': 'Continuous Learning',
                'about-learning-desc': 'Staying ahead with latest technologies and trends',
                'experience-timeline': 'Experience Timeline',
                'timeline-frontend': 'Frontend Developer',
                'timeline-frontend-desc': 'Building responsive web applications',
                'timeline-junior': 'Junior Developer',
                'timeline-junior-desc': 'Learning and growing in web development',
                'timeline-self-taught': 'Self-Taught Journey',
                'timeline-self-taught-desc': 'Started learning programming fundamentals',

                // Projects Section
                'projects-title': 'Featured Projects',
                'projects-subtitle': 'A showcase of my best work and creative solutions',
                'filter-all': 'All Projects',
                'filter-web': 'Web Apps',
                'filter-frontend': 'Frontend',
                'filter-fullstack': 'Full Stack',
                'project-fenix-desc': 'High-performance full-stack framework for building scalable Node.js + MySQL applications.',
                'project-frankcloud-category': 'Advanced Weather App',
                'project-frankcloud-desc': 'Real-time weather forecasts with location-based insights and smooth UI animations.',
                'project-softbullet-category': 'Hacker Stimulator Terminal',
                'project-softbullet-desc': 'Immersive coding simulation inspired by GEEKTyper — fully interactive and customizable.',
                'project-voltchat-category': 'Chat App by Volt',
                'project-voltchat-desc': 'Secure real-time messaging app with group chat and encryption-ready architecture.',
                'project-frankport-desc': 'A creative portfolio website featuring smooth animations, interactive elements, and modern design principles. Optimized for performance and accessibility.',
                'project-development-progress': 'Development is in Progress.',
                'project-currently-using': 'You are currently using FrankPort.',

                // Skills Section
                'skills-title': 'Skills & Expertise',
                'skills-subtitle': 'Technical proficiencies and tools I work with',
                'skills-frontend-title': 'Frontend Development',
                'skills-tools-title': 'Tools & Frameworks',
                'skills-design-title': 'Design & UX',
                'skills-responsive': 'Responsive Design',
                'skills-ui-ux': 'UI/UX Design',
                'skills-prototyping': 'Prototyping',
                'skills-coding-activity': 'Coding Activity',

                // Testimonials
                'testimonials-title': 'What People Say',
                'testimonial-alex': 'Working with Frank was an absolute pleasure. His ability to translate complex ideas into clean, performant solutions is world-class. Highly recommended.',
                'testimonial-samantha': 'FrankPort\'s design system and animations brought our brand to life. The attention to detail is unmatched.',

                // Contact Section
                'contact-title': 'Get In Touch',
                'contact-subtitle': 'Let\'s discuss your next project or opportunity',
                'contact-work-together': 'Let\'s Work Together',
                'contact-interested': 'I\'m always interested in new opportunities and exciting projects. Whether you\'re looking for a developer to join your team or need help bringing your ideas to life, I\'d love to hear from you.',
                'contact-whatsapp': 'Let\'s Chat on WhatsApp',
                'contact-email': 'Drop Me a Message',
                'contact-phone': 'Phone',
                'contact-quick-call': 'Quick Call',
                'contact-location': 'Location',
                'contact-follow': 'Follow Me',
                'form-your-name': 'Your Name',
                'form-email': 'Email Address',
                'form-subject': 'Subject',
                'form-message': 'Message',
                'form-privacy-agree': 'I agree to the privacy policy and terms of service',
                'form-send-message': 'Send Message',

                // Feedback Modal
                'feedback-title': 'Share Your Feedback',
                'feedback-quick-rating': 'Quick Rating',
                'feedback-faq': 'FAQ',
                'feedback-suggestions': 'Suggestions',
                'feedback-pain-points': 'Pain Points',
                'feedback-rate-experience': 'How would you rate your experience?',
                'feedback-satisfaction-help': 'Your overall satisfaction helps us understand what we\'re doing well',
                'feedback-click-stars': 'Click stars to rate',
                'feedback-impressed-most': 'What specifically impressed you the most?',
                'feedback-share-stood-out': 'Share what stood out to you...',
                'feedback-faq-title': 'Frequently Asked Questions',
                'feedback-help-improve': 'Help us improve by rating these common questions',
                'feedback-share-ideas': 'Share Your Ideas',
                'feedback-make-better': 'What would make this portfolio even better?',
                'feedback-skip-hint': 'You can click Next to skip.',
                'feedback-design-ui': 'Design & UI',
                'feedback-design-desc': 'Visual improvements, layout, colors',
                'feedback-content': 'Content',
                'feedback-content-desc': 'Projects, information, descriptions',
                'feedback-functionality': 'Functionality',
                'feedback-functionality-desc': 'Features, interactions, performance',
                'feedback-navigation': 'Navigation',
                'feedback-navigation-desc': 'Menu, links, user flow',
                'feedback-describe-suggestion': 'Describe your suggestion in detail...',
                'feedback-whats-frustrating': 'What\'s Frustrating You?',
                'feedback-identify-issues': 'Help us identify and fix issues that matter to you',
                'feedback-no-pain-points': 'No pain points to report? Click Send Feedback to finish.',
                'feedback-additional-details': 'Additional details about your experience',
                'feedback-not-working-well': 'Tell us more about what\'s not working well...',
                'feedback-previous': 'Previous',
                'feedback-section-progress': 'Section 1 of 4',
                'feedback-next': 'Next',
                'feedback-send': 'Send Feedback',

                // Footer
                'footer-description': 'Crafting digital experiences with passion and precision. Let\'s build something amazing together.',
                'footer-navigation': 'Navigation',
                'footer-legal-trust': 'Legal & Trust',
                'footer-privacy': 'Privacy Policy',
                'footer-terms': 'Terms of Use',
                'footer-disclaimer': 'Disclaimer',
                'footer-cookies': 'Cookie Notice',
                'footer-accessibility': 'Accessibility',
                'footer-dark-mode': 'Dark Mode',
                'footer-dark-blue-mode': 'Dark Blue Mode',
                'footer-light-mode': 'Light Mode',
                'footer-language': 'Language',
                'lang-english': 'English',
                'lang-french': 'Français',
                'lang-spanish': 'Español',
                'lang-german': 'Deutsch',
                'lang-chinese': '中文',
                'lang-kinyarwanda': 'Kinyarwanda',
                'footer-copyright': '© 2025 Frank Portfolio. All rights reserved.',
                'footer-loading-version': 'Loading version...',
                'loading-portfolio': 'Loading portfolio...'
            },

            fr: {
                // Navigation
                'nav-home': 'Accueil',
                'nav-about': 'À Propos',
                'nav-projects': 'Projets',
                'nav-skills': 'Compétences',
                'nav-contact': 'Contact',

                // Hero Section
                'hero-available': 'Disponible pour de nouvelles opportunités',
                'hero-greeting': 'Salut, je suis',
                'hero-description': 'Je crée des expériences numériques exceptionnelles grâce à un code propre et un design innovant. Spécialisé dans les technologies web modernes avec une passion pour créer des solutions qui comptent.',
                'hero-projects': 'Projets',
                'hero-experience': 'Années d\'Exp',
                'hero-satisfaction': '% Satisfaction',
                'hero-view-work': 'Voir Mon Travail',
                'hero-get-in-touch': 'Contactez-Moi',
                'code-passion': 'Créer des Expériences Web Incroyables',
                'scroll-down': 'Faites Défiler',

                // About Section
                'about-title': 'À Propos de Moi',
                'about-subtitle': 'Développeur passionné avec pour mission de créer des expériences numériques exceptionnelles',
                'about-intro-1': 'Je suis un développeur de logiciels dévoué avec une expertise dans les technologies web modernes. Mon parcours a commencé par la curiosité sur le fonctionnement des sites web, et a évolué vers une passion pour créer des solutions numériques fluides et centrées sur l\'utilisateur.',
                'about-intro-2': 'Je crois en l\'écriture de code propre et maintenable et à rester au courant des dernières tendances de l\'industrie. Chaque projet est une opportunité d\'apprendre quelque chose de nouveau et de repousser les limites de ce qui est possible sur le web.',
                'about-highlights-title': 'Ce Que J\'apporte',
                'about-clean-code': 'Philosophie du Code Propre',
                'about-clean-code-desc': 'Écrire du code maintenable, évolutif et efficace',
                'about-problem-solving': 'Mentalité de Résolution de Problèmes',
                'about-problem-solving-desc': 'Transformer les défis complexes en solutions élégantes',
                'about-collaborative': 'Esprit Collaboratif',
                'about-collaborative-desc': 'Travailler efficacement avec les équipes et les parties prenantes',
                'about-learning': 'Apprentissage Continu',
                'about-learning-desc': 'Rester en avance avec les dernières technologies et tendances',
                'experience-timeline': 'Chronologie d\'Expérience',
                'timeline-frontend': 'Développeur Frontend',
                'timeline-frontend-desc': 'Construire des applications web responsives',
                'timeline-junior': 'Développeur Junior',
                'timeline-junior-desc': 'Apprendre et grandir dans le développement web',
                'timeline-self-taught': 'Parcours Autodidacte',
                'timeline-self-taught-desc': 'Commencer à apprendre les fondamentaux de la programmation',

                // Projects Section
                'projects-title': 'Projets en Vedette',
                'projects-subtitle': 'Une vitrine de mon meilleur travail et de mes solutions créatives',
                'filter-all': 'Tous les Projets',
                'filter-web': 'Applications Web',
                'filter-frontend': 'Frontend',
                'filter-fullstack': 'Full Stack',
                'project-fenix-desc': 'Framework full-stack haute performance pour construire des applications Node.js + MySQL évolutives.',
                'project-frankcloud-category': 'Application Météo Avancée',
                'project-frankcloud-desc': 'Prévisions météo en temps réel avec des informations basées sur la localisation et des animations UI fluides.',
                'project-softbullet-category': 'Terminal de Simulation de Hacker',
                'project-softbullet-desc': 'Simulation de codage immersive inspirée de GEEKTyper — entièrement interactive et personnalisable.',
                'project-voltchat-category': 'Application de Chat par Volt',
                'project-voltchat-desc': 'Application de messagerie sécurisée en temps réel avec chat de groupe et architecture prête pour le chiffrement.',
                'project-frankport-desc': 'Un site web de portfolio créatif avec des animations fluides, des éléments interactifs et des principes de design modernes. Optimisé pour les performances et l\'accessibilité.',
                'project-development-progress': 'Le développement est en cours.',
                'project-currently-using': 'Vous utilisez actuellement FrankPort.',

                // Skills Section
                'skills-title': 'Compétences et Expertise',
                'skills-subtitle': 'Compétences techniques et outils avec lesquels je travaille',
                'skills-frontend-title': 'Développement Frontend',
                'skills-tools-title': 'Outils et Frameworks',
                'skills-design-title': 'Design et UX',
                'skills-responsive': 'Design Responsif',
                'skills-ui-ux': 'Design UI/UX',
                'skills-prototyping': 'Prototypage',
                'skills-coding-activity': 'Activité de Codage',

                // Testimonials
                'testimonials-title': 'Ce Que Disent les Gens',
                'testimonial-alex': 'Travailler avec Frank était un plaisir absolu. Sa capacité à traduire des idées complexes en solutions propres et performantes est de classe mondiale. Hautement recommandé.',
                'testimonial-samantha': 'Le système de design et les animations de FrankPort ont donné vie à notre marque. L\'attention aux détails est inégalée.',

                // Contact Section
                'contact-title': 'Entrer en Contact',
                'contact-subtitle': 'Discutons de votre prochain projet ou opportunité',
                'contact-work-together': 'Travaillons Ensemble',
                'contact-interested': 'Je suis toujours intéressé par de nouvelles opportunités et des projets passionnants. Que vous cherchiez un développeur pour rejoindre votre équipe ou que vous ayez besoin d\'aide pour donner vie à vos idées, j\'aimerais avoir de vos nouvelles.',
                'contact-whatsapp': 'Discutons sur WhatsApp',
                'contact-email': 'Envoyez-Moi un Message',
                'contact-phone': 'Téléphone',
                'contact-quick-call': 'Appel Rapide',
                'contact-location': 'Localisation',
                'contact-follow': 'Suivez-Moi',
                'form-your-name': 'Votre Nom',
                'form-email': 'Adresse Email',
                'form-subject': 'Sujet',
                'form-message': 'Message',
                'form-privacy-agree': 'J\'accepte la politique de confidentialité et les conditions de service',
                'form-send-message': 'Envoyer le Message',

                // Footer
                'footer-description': 'Créer des expériences numériques avec passion et précision. Construisons quelque chose d\'incroyable ensemble.',
                'footer-navigation': 'Navigation',
                'footer-legal-trust': 'Légal et Confiance',
                'footer-privacy': 'Politique de Confidentialité',
                'footer-terms': 'Conditions d\'Utilisation',
                'footer-disclaimer': 'Avertissement',
                'footer-cookies': 'Avis sur les Cookies',
                'footer-accessibility': 'Accessibilité',
                'footer-dark-mode': 'Mode Sombre',
                'footer-dark-blue-mode': 'Mode Bleu Sombre',
                'footer-light-mode': 'Mode Clair',
                'footer-language': 'Langue',
                'lang-english': 'English',
                'lang-french': 'Français',
                'lang-spanish': 'Español',
                'lang-german': 'Deutsch',
                'lang-chinese': '中文',
                'lang-kinyarwanda': 'Kinyarwanda',
                'footer-copyright': '© 2025 Portfolio Frank. Tous droits réservés.',
                'footer-loading-version': 'Chargement de la version...',
                'loading-portfolio': 'Chargement du portfolio...'
            },

            es: {
                // Navigation
                'nav-home': 'Inicio',
                'nav-about': 'Acerca de',
                'nav-projects': 'Proyectos',
                'nav-skills': 'Habilidades',
                'nav-contact': 'Contacto',

                // Hero Section
                'hero-available': 'Disponible para nuevas oportunidades',
                'hero-greeting': 'Hola, soy',
                'hero-description': 'Creo experiencias digitales excepcionales a través de código limpio y diseño innovador. Especializado en tecnologías web modernas con pasión por crear soluciones que importan.',
                'hero-projects': 'Proyectos',
                'hero-experience': 'Años de Exp',
                'hero-satisfaction': '% Satisfacción',
                'hero-view-work': 'Ver Mi Trabajo',
                'hero-get-in-touch': 'Ponte en Contacto',
                'code-passion': 'Creando Experiencias Web Increíbles',
                'scroll-down': 'Desplazar Hacia Abajo',

                // About Section
                'about-title': 'Acerca de Mí',
                'about-subtitle': 'Desarrollador apasionado con la misión de crear experiencias digitales excepcionales',
                'about-intro-1': 'Soy un desarrollador de software dedicado con experiencia en tecnologías web modernas. Mi viaje comenzó con curiosidad sobre cómo funcionan los sitios web, y ha evolucionado hacia una pasión por crear soluciones digitales fluidas y centradas en el usuario.',
                'about-intro-2': 'Creo en escribir código limpio y mantenible y mantenerme al día con las últimas tendencias de la industria. Cada proyecto es una oportunidad para aprender algo nuevo y empujar los límites de lo que es posible en la web.',
                'about-highlights-title': 'Lo Que Aporto',
                'about-clean-code': 'Filosofía de Código Limpio',
                'about-clean-code-desc': 'Escribir código mantenible, escalable y eficiente',
                'about-problem-solving': 'Mentalidad de Resolución de Problemas',
                'about-problem-solving-desc': 'Convertir desafíos complejos en soluciones elegantes',
                'about-collaborative': 'Espíritu Colaborativo',
                'about-collaborative-desc': 'Trabajar efectivamente con equipos y partes interesadas',
                'about-learning': 'Aprendizaje Continuo',
                'about-learning-desc': 'Mantenerme adelante con las últimas tecnologías y tendencias',
                'experience-timeline': 'Línea de Tiempo de Experiencia',
                'timeline-frontend': 'Desarrollador Frontend',
                'timeline-frontend-desc': 'Construyendo aplicaciones web responsivas',
                'timeline-junior': 'Desarrollador Junior',
                'timeline-junior-desc': 'Aprendiendo y creciendo en el desarrollo web',
                'timeline-self-taught': 'Viaje Autodidacta',
                'timeline-self-taught-desc': 'Comenzar a aprender fundamentos de programación',

                // Projects Section
                'projects-title': 'Proyectos Destacados',
                'projects-subtitle': 'Una muestra de mi mejor trabajo y soluciones creativas',
                'filter-all': 'Todos los Proyectos',
                'filter-web': 'Aplicaciones Web',
                'filter-frontend': 'Frontend',
                'filter-fullstack': 'Full Stack',
                'project-fenix-desc': 'Framework full-stack de alto rendimiento para construir aplicaciones Node.js + MySQL escalables.',
                'project-frankcloud-category': 'Aplicación Meteorológica Avanzada',
                'project-frankcloud-desc': 'Pronósticos meteorológicos en tiempo real con información basada en ubicación y animaciones UI suaves.',
                'project-softbullet-category': 'Terminal Simulador de Hacker',
                'project-softbullet-desc': 'Simulación de codificación inmersiva inspirada en GEEKTyper — completamente interactiva y personalizable.',
                'project-voltchat-category': 'Aplicación de Chat por Volt',
                'project-voltchat-desc': 'Aplicación de mensajería segura en tiempo real con chat grupal y arquitectura lista para cifrado.',
                'project-frankport-desc': 'Un sitio web de portafolio creativo con animaciones suaves, elementos interactivos y principios de diseño moderno. Optimizado para rendimiento y accesibilidad.',
                'project-development-progress': 'El desarrollo está en progreso.',
                'project-currently-using': 'Actualmente estás usando FrankPort.',

                // Skills Section
                'skills-title': 'Habilidades y Experiencia',
                'skills-subtitle': 'Competencias técnicas y herramientas con las que trabajo',
                'skills-frontend-title': 'Desarrollo Frontend',
                'skills-tools-title': 'Herramientas y Frameworks',
                'skills-design-title': 'Diseño y UX',
                'skills-responsive': 'Diseño Responsivo',
                'skills-ui-ux': 'Diseño UI/UX',
                'skills-prototyping': 'Prototipado',
                'skills-coding-activity': 'Actividad de Codificación',

                // Testimonials
                'testimonials-title': 'Lo Que Dice la Gente',
                'testimonial-alex': 'Trabajar con Frank fue un placer absoluto. Su habilidad para traducir ideas complejas en soluciones limpias y performantes es de clase mundial. Altamente recomendado.',
                'testimonial-samantha': 'El sistema de diseño y las animaciones de FrankPort dieron vida a nuestra marca. La atención al detalle es inigualable.',

                // Contact Section
                'contact-title': 'Ponte en Contacto',
                'contact-subtitle': 'Hablemos sobre tu próximo proyecto u oportunidad',
                'contact-work-together': 'Trabajemos Juntos',
                'contact-interested': 'Siempre estoy interesado en nuevas oportunidades y proyectos emocionantes. Ya sea que busques un desarrollador para unirse a tu equipo o necesites ayuda para dar vida a tus ideas, me encantaría saber de ti.',
                'contact-whatsapp': 'Charlemos en WhatsApp',
                'contact-email': 'Envíame un Mensaje',
                'contact-phone': 'Teléfono',
                'contact-quick-call': 'Llamada Rápida',
                'contact-location': 'Ubicación',
                'contact-follow': 'Sígueme',
                'form-your-name': 'Tu Nombre',
                'form-email': 'Dirección de Email',
                'form-subject': 'Asunto',
                'form-message': 'Mensaje',
                'form-privacy-agree': 'Acepto la política de privacidad y términos de servicio',
                'form-send-message': 'Enviar Mensaje',

                // Footer
                'footer-description': 'Creando experiencias digitales con pasión y precisión. Construyamos algo increíble juntos.',
                'footer-navigation': 'Navegación',
                'footer-legal-trust': 'Legal y Confianza',
                'footer-privacy': 'Política de Privacidad',
                'footer-terms': 'Términos de Uso',
                'footer-disclaimer': 'Descargo de Responsabilidad',
                'footer-cookies': 'Aviso de Cookies',
                'footer-accessibility': 'Accesibilidad',
                'footer-dark-mode': 'Modo Oscuro',
                'footer-dark-blue-mode': 'Modo Azul Oscuro',
                'footer-light-mode': 'Modo Claro',
                'footer-language': 'Idioma',
                'lang-english': 'English',
                'lang-french': 'Français',
                'lang-spanish': 'Español',
                'lang-german': 'Deutsch',
                'lang-chinese': '中文',
                'lang-kinyarwanda': 'Kinyarwanda',
                'footer-copyright': '© 2025 Portafolio Frank. Todos los derechos reservados.',
                'footer-loading-version': 'Cargando versión...',
                'loading-portfolio': 'Cargando portafolio...'
            },

            de: {
                // Navigation
                'nav-home': 'Startseite',
                'nav-about': 'Über Mich',
                'nav-projects': 'Projekte',
                'nav-skills': 'Fähigkeiten',
                'nav-contact': 'Kontakt',

                // Hero Section
                'hero-available': 'Verfügbar für neue Möglichkeiten',
                'hero-greeting': 'Hallo, ich bin',
                'hero-description': 'Ich schaffe außergewöhnliche digitale Erfahrungen durch sauberen Code und innovatives Design. Spezialisiert auf moderne Web-Technologien mit einer Leidenschaft für die Schaffung von Lösungen, die zählen.',
                'hero-projects': 'Projekte',
                'hero-experience': 'Jahre Erf',
                'hero-satisfaction': '% Zufriedenheit',
                'hero-view-work': 'Meine Arbeit Ansehen',
                'hero-get-in-touch': 'Kontakt Aufnehmen',
                'code-passion': 'Erstaunliche Web-Erfahrungen Schaffen',
                'scroll-down': 'Nach Unten Scrollen',

                // About Section
                'about-title': 'Über Mich',
                'about-subtitle': 'Leidenschaftlicher Entwickler mit der Mission, außergewöhnliche digitale Erfahrungen zu schaffen',
                'about-intro-1': 'Ich bin ein engagierter Software-Entwickler mit Expertise in modernen Web-Technologien. Meine Reise begann mit Neugier darauf, wie Websites funktionieren, und hat sich zu einer Leidenschaft für die Schaffung nahtloser, benutzerorientierter digitaler Lösungen entwickelt.',
                'about-intro-2': 'Ich glaube an das Schreiben von sauberem, wartbarem Code und daran, mit den neuesten Branchentrends Schritt zu halten. Jedes Projekt ist eine Gelegenheit, etwas Neues zu lernen und die Grenzen dessen zu erweitern, was im Web möglich ist.',
                'about-highlights-title': 'Was Ich Mitbringe',
                'about-clean-code': 'Clean Code Philosophie',
                'about-clean-code-desc': 'Wartbaren, skalierbaren und effizienten Code schreiben',
                'about-problem-solving': 'Problemlösungs-Mentalität',
                'about-problem-solving-desc': 'Komplexe Herausforderungen in elegante Lösungen verwandeln',
                'about-collaborative': 'Kollaborativer Geist',
                'about-collaborative-desc': 'Effektiv mit Teams und Stakeholdern arbeiten',
                'about-learning': 'Kontinuierliches Lernen',
                'about-learning-desc': 'Mit neuesten Technologien und Trends voraus bleiben',
                'experience-timeline': 'Erfahrungszeitlinie',
                'timeline-frontend': 'Frontend-Entwickler',
                'timeline-frontend-desc': 'Responsive Webanwendungen erstellen',
                'timeline-junior': 'Junior-Entwickler',
                'timeline-junior-desc': 'Lernen und wachsen in der Webentwicklung',
                'timeline-self-taught': 'Autodidaktische Reise',
                'timeline-self-taught-desc': 'Programmiergrundlagen lernen begonnen',

                // Projects Section
                'projects-title': 'Hervorgehobene Projekte',
                'projects-subtitle': 'Eine Präsentation meiner besten Arbeit und kreativen Lösungen',
                'filter-all': 'Alle Projekte',
                'filter-web': 'Web-Apps',
                'filter-frontend': 'Frontend',
                'filter-fullstack': 'Full Stack',
                'project-fenix-desc': 'Hochleistungs-Full-Stack-Framework zum Erstellen skalierbarer Node.js + MySQL-Anwendungen.',
                'project-frankcloud-category': 'Erweiterte Wetter-App',
                'project-frankcloud-desc': 'Echtzeit-Wettervorhersagen mit standortbasierten Einblicken und glatten UI-Animationen.',
                'project-softbullet-category': 'Hacker-Simulator-Terminal',
                'project-softbullet-desc': 'Immersive Codierungssimulation inspiriert von GEEKTyper — vollständig interaktiv und anpassbar.',
                'project-voltchat-category': 'Chat-App von Volt',
                'project-voltchat-desc': 'Sichere Echtzeit-Messaging-App mit Gruppenchat und verschlüsselungsbereiter Architektur.',
                'project-frankport-desc': 'Eine kreative Portfolio-Website mit glatten Animationen, interaktiven Elementen und modernen Designprinzipien. Optimiert für Leistung und Zugänglichkeit.',
                'project-development-progress': 'Entwicklung ist im Gange.',
                'project-currently-using': 'Sie verwenden derzeit FrankPort.',

                // Skills Section
                'skills-title': 'Fähigkeiten & Expertise',
                'skills-subtitle': 'Technische Kompetenzen und Werkzeuge, mit denen ich arbeite',
                'skills-frontend-title': 'Frontend-Entwicklung',
                'skills-tools-title': 'Werkzeuge & Frameworks',
                'skills-design-title': 'Design & UX',
                'skills-responsive': 'Responsive Design',
                'skills-ui-ux': 'UI/UX Design',
                'skills-prototyping': 'Prototyping',
                'skills-coding-activity': 'Codieraktivität',

                // Testimonials
                'testimonials-title': 'Was Menschen Sagen',
                'testimonial-alex': 'Mit Frank zu arbeiten war ein absolutes Vergnügen. Seine Fähigkeit, komplexe Ideen in saubere, performante Lösungen zu übersetzen, ist Weltklasse. Sehr empfehlenswert.',
                'testimonial-samantha': 'FrankPorts Design-System und Animationen haben unsere Marke zum Leben erweckt. Die Liebe zum Detail ist unübertroffen.',

                // Contact Section
                'contact-title': 'Kontakt Aufnehmen',
                'contact-subtitle': 'Lassen Sie uns über Ihr nächstes Projekt oder Ihre Gelegenheit sprechen',
                'contact-work-together': 'Lassen Sie Uns Zusammenarbeiten',
                'contact-interested': 'Ich bin immer an neuen Möglichkeiten und spannenden Projekten interessiert. Ob Sie einen Entwickler für Ihr Team suchen oder Hilfe beim Verwirklichen Ihrer Ideen benötigen, ich würde gerne von Ihnen hören.',
                'contact-whatsapp': 'Lassen Sie uns auf WhatsApp chatten',
                'contact-email': 'Senden Sie mir eine Nachricht',
                'contact-phone': 'Telefon',
                'contact-quick-call': 'Kurzer Anruf',
                'contact-location': 'Standort',
                'contact-follow': 'Folgen Sie Mir',
                'form-your-name': 'Ihr Name',
                'form-email': 'E-Mail-Adresse',
                'form-subject': 'Betreff',
                'form-message': 'Nachricht',
                'form-privacy-agree': 'Ich stimme der Datenschutzrichtlinie und den Nutzungsbedingungen zu',
                'form-send-message': 'Nachricht Senden',

                // Footer
                'footer-description': 'Digitale Erfahrungen mit Leidenschaft und Präzision schaffen. Lassen Sie uns etwas Erstaunliches zusammen bauen.',
                'footer-navigation': 'Navigation',
                'footer-legal-trust': 'Rechtliches & Vertrauen',
                'footer-privacy': 'Datenschutzrichtlinie',
                'footer-terms': 'Nutzungsbedingungen',
                'footer-disclaimer': 'Haftungsausschluss',
                'footer-cookies': 'Cookie-Hinweis',
                'footer-accessibility': 'Barrierefreiheit',
                'footer-dark-mode': 'Dunkler Modus',
                'footer-dark-blue-mode': 'Dunkelblauer Modus',
                'footer-light-mode': 'Heller Modus',
                'footer-language': 'Sprache',
                'lang-english': 'English',
                'lang-french': 'Français',
                'lang-spanish': 'Español',
                'lang-german': 'Deutsch',
                'lang-chinese': '中文',
                'lang-kinyarwanda': 'Kinyarwanda',
                'footer-copyright': '© 2025 Frank Portfolio. Alle Rechte vorbehalten.',
                'footer-loading-version': 'Version wird geladen...',
                'loading-portfolio': 'Portfolio wird geladen...'
            },

            zh: {
                // Navigation
                'nav-home': '首页',
                'nav-about': '关于我',
                'nav-projects': '项目',
                'nav-skills': '技能',
                'nav-contact': '联系',

                // Hero Section
                'hero-available': '可接受新机会',
                'hero-greeting': '你好，我是',
                'hero-description': '我通过干净的代码和创新设计打造卓越的数字体验。专注于现代网络技术，热衷于创造重要的解决方案。',
                'hero-projects': '项目',
                'hero-experience': '年经验',
                'hero-satisfaction': '% 满意度',
                'hero-view-work': '查看我的作品',
                'hero-get-in-touch': '联系我',
                'code-passion': '创造令人惊叹的网络体验',
                'scroll-down': '向下滚动',

                // About Section
                'about-title': '关于我',
                'about-subtitle': '热情的开发者，致力于创造卓越的数字体验',
                'about-intro-1': '我是一名专注的软件开发者，在现代网络技术方面有专业知识。我的旅程始于对网站如何工作的好奇心，并已发展成为创造无缝、以用户为中心的数字解决方案的热情。',
                'about-intro-2': '我相信编写干净、可维护的代码，并跟上最新的行业趋势。每个项目都是学习新知识和推动网络可能性边界的机会。',
                'about-highlights-title': '我带来的价值',
                'about-clean-code': '干净代码哲学',
                'about-clean-code-desc': '编写可维护、可扩展和高效的代码',
                'about-problem-solving': '解决问题的思维',
                'about-problem-solving-desc': '将复杂挑战转化为优雅解决方案',
                'about-collaborative': '协作精神',
                'about-collaborative-desc': '与团队和利益相关者有效合作',
                'about-learning': '持续学习',
                'about-learning-desc': '掌握最新技术和趋势',
                'experience-timeline': '经验时间线',
                'timeline-frontend': '前端开发者',
                'timeline-frontend-desc': '构建响应式网络应用程序',
                'timeline-junior': '初级开发者',
                'timeline-junior-desc': '在网络开发中学习和成长',
                'timeline-self-taught': '自学之路',
                'timeline-self-taught-desc': '开始学习编程基础',

                // Projects Section
                'projects-title': '精选项目',
                'projects-subtitle': '我最佳作品和创意解决方案的展示',
                'filter-all': '所有项目',
                'filter-web': '网络应用',
                'filter-frontend': '前端',
                'filter-fullstack': '全栈',
                'project-fenix-desc': '用于构建可扩展Node.js + MySQL应用程序的高性能全栈框架。',
                'project-frankcloud-category': '高级天气应用',
                'project-frankcloud-desc': '实时天气预报，具有基于位置的洞察和流畅的UI动画。',
                'project-softbullet-category': '黑客模拟器终端',
                'project-softbullet-desc': '受GEEKTyper启发的沉浸式编码模拟——完全交互和可定制。',
                'project-voltchat-category': 'Volt聊天应用',
                'project-voltchat-desc': '安全的实时消息应用，具有群聊和加密就绪架构。',
                'project-frankport-desc': '创意作品集网站，具有流畅动画、交互元素和现代设计原则。针对性能和可访问性进行优化。',
                'project-development-progress': '开发正在进行中。',
                'project-currently-using': '您当前正在使用FrankPort。',

                // Skills Section
                'skills-title': '技能与专业知识',
                'skills-subtitle': '我使用的技术能力和工具',
                'skills-frontend-title': '前端开发',
                'skills-tools-title': '工具和框架',
                'skills-design-title': '设计与用户体验',
                'skills-responsive': '响应式设计',
                'skills-ui-ux': 'UI/UX设计',
                'skills-prototyping': '原型制作',
                'skills-coding-activity': '编码活动',

                // Testimonials
                'testimonials-title': '人们的评价',
                'testimonial-alex': '与Frank合作是绝对的愉悦。他将复杂想法转化为干净、高性能解决方案的能力是世界级的。强烈推荐。',
                'testimonial-samantha': 'FrankPort的设计系统和动画让我们的品牌栩栩如生。对细节的关注无与伦比。',

                // Contact Section
                'contact-title': '联系我',
                'contact-subtitle': '让我们讨论您的下一个项目或机会',
                'contact-work-together': '让我们合作吧',
                'contact-interested': '我总是对新机会和令人兴奋的项目感兴趣。无论您是在寻找加入您团队的开发者，还是需要帮助实现您的想法，我都很乐意听到您的消息。',
                'contact-whatsapp': '在WhatsApp上聊天',
                'contact-email': '发送消息给我',
                'contact-phone': '电话',
                'contact-quick-call': '快速通话',
                'contact-location': '位置',
                'contact-follow': '关注我',
                'form-your-name': '您的姓名',
                'form-email': '电子邮件地址',
                'form-subject': '主题',
                'form-message': '消息',
                'form-privacy-agree': '我同意隐私政策和服务条款',
                'form-send-message': '发送消息',

                // Footer
                'footer-description': '用激情和精确度打造数字体验。让我们一起构建令人惊叹的东西。',
                'footer-navigation': '导航',
                'footer-legal-trust': '法律与信任',
                'footer-privacy': '隐私政策',
                'footer-terms': '使用条款',
                'footer-disclaimer': '免责声明',
                'footer-cookies': 'Cookie通知',
                'footer-accessibility': '可访问性',
                'footer-dark-mode': '深色模式',
                'footer-dark-blue-mode': '深蓝模式',
                'footer-light-mode': '浅色模式',
                'footer-language': '语言',
                'lang-english': 'English',
                'lang-french': 'Français',
                'lang-spanish': 'Español',
                'lang-german': 'Deutsch',
                'lang-chinese': '中文',
                'lang-kinyarwanda': 'Kinyarwanda',
                'footer-copyright': '© 2025 Frank作品集。保留所有权利。',
                'footer-loading-version': '正在加载版本...',
                'loading-portfolio': '正在加载作品集...'
            },

            rw: {
                // Navigation
                'nav-home': 'Ahabanza',
                'nav-about': 'Uburyo Meze',
                'nav-projects': 'Imishinga',
                'nav-skills': 'Ubumenyi',
                'nav-contact': 'Tuvugane',

                // Hero Section
                'hero-available': 'Ndaboneka kubw\'amahirwe mashya',
                'hero-greeting': 'Muraho, ndi',
                'hero-description': 'Nkora ubunararibonye bwa digitale bukomeye binyuze muri kode isukuye n\'igishushanyo gishya. Inzobere mu ikoranabuhanga rya kijyambere ku rubuga rw\'imbuga hamwe n\'urukundo rwo gukora ibisubizo bifite agaciro.',
                'hero-projects': 'Imishinga',
                'hero-experience': 'Imyaka y\'Ubunararibonye',
                'hero-satisfaction': '% Baranyuzwe',
                'hero-view-work': 'Reba Akazi Kanjye',
                'hero-get-in-touch': 'Tuvugane',
                'code-passion': 'Kurema Ubunararibonye bw\'Urubuga Rutangaje',
                'scroll-down': 'Manuka Hepfo',

                // About Section
                'about-title': 'Uburyo Meze',
                'about-subtitle': 'Umutegurwa w\'ubushobozi w\'intego yo kurema ubunararibonye bwa digitale bukomeye',
                'about-intro-1': 'Ndi umutegurwa wa software watanze ubushobozi mu ikoranabuhanga rya kijyambere ku rubuga. Urugendo rwanje rwatangiye n\'amatsiko yo kumenya uko urubuga rukora, kandi rwahindutse urukundo rwo kurema ibisubizo bya digitale byoroshye kandi bikaba bishingiye ku bakoresha.',
                'about-intro-2': 'Nizera ko kwandika kode isukuye kandi ishobora gutezimbere no kuguma ubonye ibintu bishya byose bigezweho mu nganda. Buri mishinga ni amahirwe yo kwiga ikintu gishya no gukurura imipaka y\'ibishoboka ku urubuga.',
                'about-highlights-title': 'Icyo Nzana',
                'about-clean-code': 'Filozofiya ya Kode Isukuye',
                'about-clean-code-desc': 'Kwandika kode ishobora gutezimbere, gukura kandi ikaba ikora neza',
                'about-problem-solving': 'Imyumvire yo Gukemura Ibibazo',
                'about-problem-solving-desc': 'Guhindura ibibazo bigoye mu bisubizo byiza',
                'about-collaborative': 'Umwuka w\'Ubufatanye',
                'about-collaborative-desc': 'Gukora neza n\'amatsinda n\'abagize uruhare',
                'about-learning': 'Kwiga Burigihe',
                'about-learning-desc': 'Kuguma imbere n\'ikoranabuhanga n\'ibintu bigezweho',
                'experience-timeline': 'Umurongo w\'Igihe cy\'Ubunararibonye',
                'timeline-frontend': 'Umutegura wa Frontend',
                'timeline-frontend-desc': 'Kubaka porogaramu z\'urubuga zisubiza',
                'timeline-junior': 'Umutegura w\'Urwego rwo Hasi',
                'timeline-junior-desc': 'Kwiga no gukura mu gutegura urubuga',
                'timeline-self-taught': 'Urugendo rwo Kwiyigisha',
                'timeline-self-taught-desc': 'Gutangira kwiga ibanze by\'itunga rigamije',

                // Projects Section
                'projects-title': 'Imishinga Yagaragajwe',
                'projects-subtitle': 'Igaragaza ry\'akazi kanjye keza cyane n\'ibisubizo by\'ubuhanga',
                'filter-all': 'Imishinga Yose',
                'filter-web': 'Porogaramu z\'Urubuga',
                'filter-frontend': 'Frontend',
                'filter-fullstack': 'Full Stack',
                'project-fenix-desc': 'Urwego rwa full-stack rukora neza rwo kubaka porogaramu za Node.js + MySQL zikura.',
                'project-frankcloud-category': 'Porogaramu y\'Ikirere Yateye Imbere',
                'project-frankcloud-desc': 'Guhanura ikirere mu gihe nyacyo hamwe n\'ubushishozi bushingiye ku hantu n\'inyandiko za UI zoroshye.',
                'project-softbullet-category': 'Terminal y\'Igikoresho cya Hacker',
                'project-softbullet-desc': 'Igikoresho cyo kwigana gutegura cyahumijwe na GEEKTyper — cyuzuye ubufatanye kandi bushobora guhindurwa.',
                'project-voltchat-category': 'Porogaramu yo Kuganira ya Volt',
                'project-voltchat-desc': 'Porogaramu y\'ubutumwa bwizeye bw\'igihe nyacyo hamwe n\'iyerekana ry\'itsinda n\'imiterere yiteguye yo gushira ibanga.',
                'project-frankport-desc': 'Urubuga rw\'ibicuruzwa bikora ubuhanga hamwe n\'inyandiko zoroshye, ibintu bikorana, n\'amahame y\'igishushanyo gishya. Byateguwe neza kubw\'imikorere n\'uburyo bw\'ugerwaho.',
                'project-development-progress': 'Iterambere riragenda.',
                'project-currently-using': 'Ubu ukoresha FrankPort.',

                // Skills Section
                'skills-title': 'Ubumenyi n\'Ubushobozi',
                'skills-subtitle': 'Ubushobozi bw\'ikoranabuhanga n\'ibikoresho nkorana nabyo',
                'skills-frontend-title': 'Gutegura Frontend',
                'skills-tools-title': 'Ibikoresho n\'Urwego',
                'skills-design-title': 'Igishushanyo & UX',
                'skills-responsive': 'Igishushanyo Gisubiza',
                'skills-ui-ux': 'Igishushanyo cya UI/UX',
                'skills-prototyping': 'Kurema Icyitegererezo',
                'skills-coding-activity': 'Ibikorwa byo Gutegura',

                // Testimonials
                'testimonials-title': 'Icyo Abantu Bavuga',
                'testimonial-alex': 'Gukora na Frank byari ishimwe ryuzuye. Ubushobozi bwe bwo guhindura ibitekerezo bigoye mu bisubizo bisukuye kandi bikora neza ni ubw\'urwego rw\'isi. Byasabwe cyane.',
                'testimonial-samantha': 'Sisitemu y\'igishushanyo ya FrankPort n\'inyandiko byatumye ikimenyetso cyacu gikabaho ubuzima. Yitabiriye kubintu bitoye bitagereranywa.',

                // Contact Section
                'contact-title': 'Tuvugane',
                'contact-subtitle': 'Reka tuganire ku mushinga wawe utaha cyangwa amahirwe',
                'contact-work-together': 'Reka Dukorane',
                'contact-interested': 'Burigihe nshishikajwe n\'amahirwe mashya n\'imishinga ishimishije. Niba ushaka umutegura wo kwinjira mu kipe yawe cyangwa ukeneye ubufasha bwo kuzana ibitekerezo byawe mu buzima, nshimishijwe no kukumva.',
                'contact-whatsapp': 'Reka Tuganire kuri WhatsApp',
                'contact-email': 'Ohereza Ubutumwa',
                'contact-phone': 'Telefoni',
                'contact-quick-call': 'Umurongo w\'ihuse',
                'contact-location': 'Ahantu',
                'contact-follow': 'Nkurikira',
                'form-your-name': 'Izina Ryawe',
                'form-email': 'Aderesi ya Email',
                'form-subject': 'Ingingo',
                'form-message': 'Ubutumwa',
                'form-privacy-agree': 'Nemeye politike y\'ibanga n\'amabwiriza yo gukoresha FrankPort.',
                'form-send-message': 'Ohereza Ubutumwa',

                // Footer
                'footer-description': 'Kurema ubunararibonye bwa digitale n\'urukundo n\'ukuri. Reka twubake ikintu gitangaje hamwe.',
                'footer-navigation': 'Kuyobora',
                'footer-legal-trust': 'Amategeko n\'Icyizere',
                'footer-privacy': 'Politike y\'Ibanga',
                'footer-terms': 'Amabwiriza yo Gukoresha',
                'footer-disclaimer': 'Kwanga Inshingano',
                'footer-cookies': 'Itangazo rya Cookie',
                'footer-accessibility': 'Uburyo bw\'Ugerwaho',
                'footer-dark-mode': 'Uburyo bw\'Umwijima',
                'footer-dark-blue-mode': 'Uburyo bw\'Ubururu bw\'Umwijima',
                'footer-light-mode': 'Uburyo bw\'Urumuri',
                'footer-language': 'Ururimi',
                'lang-english': 'Icyongereza',
                'lang-french': 'Igifaransa',
                'lang-spanish': 'Icyesipanyolo',
                'lang-german': 'Ikidage',
                'lang-chinese': 'Igishinwa',
                'lang-kinyarwanda': 'Ikinyarwanda',
                'footer-copyright': '© 2025 Ibicuruzwa bya Frank. Uburenganzira bwose bwarabitswe.',
                'footer-loading-version': 'Gupakurura verisiyo...',
                'loading-portfolio': 'Gupakurura ibicuruzwa...'
            }
        };
    }

    // Change language function
    changeLanguage(langCode) {
        if (!this.translations[langCode]) {
            console.warn(`Language ${langCode} not supported`);
            return;
        }

        this.currentLanguage = langCode;
        this.saveLanguage();
        this.updatePageLanguage();
        this.updateActiveLanguageButton();
        this.dispatchLanguageChangeEvent();
        this.showLanguageChangeToast(langCode);
    }

    // Update all translatable elements on the page
    updatePageLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        const currentTranslations = this.translations[this.currentLanguage];

        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (currentTranslations[key]) {
                // Handle different element types
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = currentTranslations[key];
                } else if (element.tagName === 'TEXTAREA') {
                    const placeholderKey = element.getAttribute('data-translate-placeholder');
                    if (placeholderKey && currentTranslations[placeholderKey]) {
                        element.placeholder = currentTranslations[placeholderKey];
                    } else {
                        element.textContent = currentTranslations[key];
                    }
                } else {
                    element.textContent = currentTranslations[key];
                }
            }
        });

        // Handle elements with placeholder translations
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (currentTranslations[key]) {
                element.placeholder = currentTranslations[key];
            }
        });

        // Update document title if translation exists
        if (currentTranslations['page-title']) {
            document.title = currentTranslations['page-title'];
        }
    }

    // Update active language button styling
    updateActiveLanguageButton() {
        // Remove active class from all language buttons
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.remove('active-language');
        });

        // Add active class to current language button
        const activeBtn = document.querySelector(`[data-lang="${this.currentLanguage}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active-language');
        }
    }

    // Dispatch custom event when language changes
    dispatchLanguageChangeEvent() {
        const event = new CustomEvent('languageChanged', {
            detail: {
                language: this.currentLanguage,
                translations: this.translations[this.currentLanguage]
            }
        });
        document.dispatchEvent(event);
    }

    // Show toast notification when language changes
    showLanguageChangeToast(langCode) {
        const languageNames = {
            'en': 'English',
            'fr': 'Français',
            'es': 'Español', 
            'de': 'Deutsch',
            'zh': '中文',
            'rw': 'Ikinyarwanda'
        };

        const languageName = languageNames[langCode] || langCode.toUpperCase();
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'language-toast';
        toast.innerHTML = `
            <i class="fas fa-language"></i>
            <span>Language changed to ${languageName}</span>
        `;

        // Add toast to container
        const container = document.getElementById('global-toast-container') || document.body;
        container.appendChild(toast);

        // Show toast with animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get translation for a specific key
    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Get all translations for current language
    getCurrentTranslations() {
        return this.translations[this.currentLanguage];
    }
}

// Global function for HTML onclick handlers
function changeLanguage(langCode) {
    if (window.languageManager) {
        window.languageManager.changeLanguage(langCode);
    }
}

// Initialize language manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.languageManager = new LanguageManager();
});

// Add CSS for language toast and active language button
const languageStyles = `
<style>
.language-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary-color, #6366f1);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 10000;
}

.language-toast.show {
    transform: translateX(0);
    opacity: 1;
}

.language-toast i {
    font-size: 16px;
}

.legal-link.active-language {
    color: var(--accent-color, #f59e0b) !important;
    font-weight: 600;
    position: relative;
}

.legal-link.active-language::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-color, #f59e0b);
    border-radius: 1px;
}

@media (max-width: 768px) {
    .language-toast {
        top: 10px;
        right: 10px;
        left: 10px;
        transform: translateY(-100%);
    }
    
    .language-toast.show {
        transform: translateY(0);
    }
}

/* Dark theme support for language elements */
@media (prefers-color-scheme: dark) {
    .language-toast {
        background: var(--primary-dark, #4f46e5);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
}
</style>
`;

// Add styles to document head
if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', languageStyles);
}

// Additional utility functions for language management

// Auto-detect user's preferred language
function detectUserLanguage() {
    // Check for saved preference first
    const saved = localStorage.getItem('frankport_language');
    if (saved) return saved;
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Map of supported languages
    const supportedLanguages = ['en', 'fr', 'es', 'de', 'zh', 'rw'];
    
    // Return supported language or default to English
    return supportedLanguages.includes(langCode) ? langCode : 'en';
}

// Language switcher widget (can be used anywhere on the page)
function createLanguageSwitcher(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
        <div class="language-switcher-current">
            <i class="fas fa-globe"></i>
            <span id="current-lang-text">English</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="language-switcher-dropdown">
            <button data-lang="en">English</button>
            <button data-lang="fr">Français</button>
            <button data-lang="es">Español</button>
            <button data-lang="de">Deutsch</button>
            <button data-lang="zh">中文</button>
            <button data-lang="rw">Ikinyarwanda</button>
        </div>
    `;

    container.appendChild(switcher);

    // Add event listeners
    const current = switcher.querySelector('.language-switcher-current');
    const dropdown = switcher.querySelector('.language-switcher-dropdown');
    
    current.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    dropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const langCode = e.target.getAttribute('data-lang');
            changeLanguage(langCode);
            dropdown.classList.remove('show');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

// Keyboard shortcuts for language switching
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + L for language menu
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        const langButtons = document.querySelectorAll('[data-lang]');
        if (langButtons.length > 0) {
            langButtons[0].focus();
        }
    }
});

// RTL language support helper
function updateTextDirection(langCode) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const direction = rtlLanguages.includes(langCode) ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.body.style.direction = direction;
}

// Language-specific formatting helpers
const formatHelpers = {
    formatDate: function(date, langCode) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const locales = {
            'en': 'en-US',
            'fr': 'fr-FR',
            'es': 'es-ES',
            'de': 'de-DE',
            'zh': 'zh-CN',
            'rw': 'rw-RW'
        };

        return new Intl.DateFormat(locales[langCode] || locales['en'], options).format(date);
    },

    formatNumber: function(number, langCode) {
        const locales = {
            'en': 'en-US',
            'fr': 'fr-FR', 
            'es': 'es-ES',
            'de': 'de-DE',
            'zh': 'zh-CN',
            'rw': 'en-US' // Fallback for Kinyarwanda
        };

        return new Intl.NumberFormat(locales[langCode] || locales['en']).format(number);
    }
};

// Dynamic content translation for JavaScript-generated content
function translateDynamicContent(translations) {
    // Update any dynamically generated content
    const dynamicElements = document.querySelectorAll('.dynamic-content');
    dynamicElements.forEach(element => {
        const key = element.getAttribute('data-dynamic-key');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Language persistence across page navigation
function persistLanguageChoice() {
    const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    links.forEach(link => {
        link.addEventListener('click', () => {
            const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
            sessionStorage.setItem('temp_language', currentLang);
        });
    });
}

// Restore language on page load
function restoreLanguageOnLoad() {
    const tempLang = sessionStorage.getItem('temp_language');
    if (tempLang && window.languageManager) {
        window.languageManager.changeLanguage(tempLang);
        sessionStorage.removeItem('temp_language');
    }
}

// Initialize additional language features
document.addEventListener('DOMContentLoaded', function() {
    // Auto-detect and set initial language
    const detectedLang = detectUserLanguage();
    if (window.languageManager && detectedLang !== 'en') {
        window.languageManager.changeLanguage(detectedLang);
    }
    
    // Set up persistence
    persistLanguageChoice();
    restoreLanguageOnLoad();
    
    // Update text direction
    document.addEventListener('languageChanged', (e) => {
        updateTextDirection(e.detail.language);
        translateDynamicContent(e.detail.translations);
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LanguageManager,
        changeLanguage,
        detectUserLanguage,
        createLanguageSwitcher,
        formatHelpers
    };
}

// ==================== Version Management ==================== //
class PortfolioVersion {
    constructor() {
        this.versionElement = document.getElementById('footer-version');
        this.GITHUB_USER = "Liam-Ajaxy";
        this.GITHUB_REPO = "FrankPort.";
        this.init();
    }

    async init() {
        await this.loadVersion();
    }

    async loadVersion() {
        // Method 1: Try version.json
        try {
            const response = await fetch(`/version.json?_=${Date.now()}`);
            if (response.ok) {
                const info = await response.json();
                this.displayVersion(info.version, info);
                return;
            }
        } catch (e) {
            console.warn("version.json not found, fallback to GitHub API");
        }

        // Method 2: GitHub API fallback
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.GITHUB_USER}/${this.GITHUB_REPO}/commits?per_page=1`
            );
            const commits = await response.json();

            if (commits && commits.length > 0) {
                const latestCommit = commits[0];
                const shortSha = latestCommit.sha.substring(0, 7);
                const date = new Date(latestCommit.commit.author.date);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

                const version = `v${formattedDate}-${shortSha}`;
                const info = {
                    version,
                    buildDate: latestCommit.commit.author.date,
                    gitHash: shortSha,
                    message: latestCommit.commit.message.split('\n')[0],
                    repoUrl: `https://github.com/${this.GITHUB_USER}/${this.GITHUB_REPO}`
                };

                this.displayVersion(version, info);
                return;
            }
        } catch (err) {
            console.error("GitHub API failed:", err);
        }

        // Method 3: Fallback
        this.displayVersion("Unknown", null);
    }

    displayVersion(version, info) {
        this.versionElement.textContent = `Version: ${version}`;

        if (info) {
            this.versionElement.title =
                `Built: ${new Date(info.buildDate).toLocaleString()}` +
                (info.message ? `\nLast commit: ${info.message}` : '');

            // Click → open commit on GitHub
            this.versionElement.style.cursor = 'pointer';
            this.versionElement.addEventListener('click', () => {
                if (info.repoUrl && info.gitHash) {
                    window.open(`${info.repoUrl}/commit/${info.gitHash}`, '_blank');
                }
            });
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new PortfolioVersion());


// ==================== Language Menu Toggle ==================== //
const langToggle = document.getElementById("lang-toggle");
const langMenu = document.getElementById("lang-menu");

langToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = langMenu.style.display === "flex";
  langMenu.style.display = isOpen ? "none" : "flex";
  langToggle.setAttribute("aria-expanded", !isOpen);
});

// Close on outside click
document.addEventListener("click", (e) => {
  if (!langMenu.contains(e.target) && !langToggle.contains(e.target)) {
    langMenu.style.display = "none";
    langToggle.setAttribute("aria-expanded", "false");
  }
});


// ==================== Admin Menu System ==================== //
// Admin Menu System - Phase 1
let isAdminLoggedIn = false;
let notificationCount = 0;

// Toggle Admin Menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('adminMenuToggle');
    const menuDropdown = document.getElementById('adminMenuDropdown');
    
    if (menuToggle && menuDropdown) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menuDropdown.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('active');
            }
        });
    }
    // ==================== Hide/Show Admin Menu Toggle on Scroll ==================== //
    let lastScrollY = window.scrollY;
    const adminToggleBtn = document.getElementById('adminMenuToggle');

    if (adminToggleBtn) {
        // optional: smooth fade
        adminToggleBtn.style.transition = 'opacity 0.3s ease';

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                // scrolling down → hide
                adminToggleBtn.style.opacity = '0';
                adminToggleBtn.style.pointerEvents = 'none';
            } else {
                // scrolling up → show
                adminToggleBtn.style.opacity = '1';
                adminToggleBtn.style.pointerEvents = 'auto';
            }

            lastScrollY = currentScrollY;
        });
    }
});

// Copy Portfolio Link Function
async function copyPortfolioLink() {
    const url = window.location.href;
    
    try {
        // Modern Clipboard API
        await navigator.clipboard.writeText(url);
        showToast('Portfolio link copied to clipboard!', 'success');
    } catch (err) {
        // Fallback method for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Portfolio link copied to clipboard!', 'success');
        } catch (fallbackErr) {
            showToast('Failed to copy link. Please copy manually: ' + url, 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    // Close the menu
    document.getElementById('adminMenuDropdown').classList.remove('active');
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Toggle Notifications Panel
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (!panel) return;
    
    panel.classList.toggle('active');
    
    // Close admin menu
    document.getElementById('adminMenuDropdown').classList.remove('active');
    
    // Load notifications if panel is opening
    if (panel.classList.contains('active')) {
        loadNotifications();
    }
}

// Close Notifications Panel
function closeNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.remove('active');
    }
}
// ==================== Outside Click Close ==================== //
document.addEventListener('click', function(e) {
    const panel = document.getElementById('notificationPanel');
    if (!panel || !panel.classList.contains('active')) return;

    const toggleItem = document.querySelector(
        '#adminMenuDropdown .admin-menu-item:nth-child(2)' // Notifications item
    );

    // Check if click happened inside panel or on the toggle item
    const clickedInsidePanel = panel.contains(e.target);
    const clickedToggle = toggleItem && toggleItem.contains(e.target);

    if (!clickedInsidePanel && !clickedToggle) {
        panel.classList.remove('active');
    }
});

// Load Notifications (placeholder - will connect to backend later)
function loadNotifications() {
    const content = document.getElementById('notificationContent');
    if (!content) return;
    
    // For now, show placeholder
    content.innerHTML = `
        <div class="no-notifications">
            <i class="fas fa-bell-slash"></i>
            <p>No notifications yet</p>
            <small>Messages from admin will appear here</small>
        </div>
    `;
}

// Open Admin Dashboard
function openAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close admin menu
    document.getElementById('adminMenuDropdown').classList.remove('active');

    // Decide what to show
    if (isAdminLoggedIn) {
        showAdminContent();   // directly show post/manage
    } else {
        showPasswordLogin();  // default login card
    }
}

// Close Admin Dashboard
function closeAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Reset to login form
    showPasswordLogin();
    
    // Clear forms
    document.getElementById('adminPassword').value = '';
    document.getElementById('backupKey').value = '';
}

// Show Password Login
function showPasswordLogin() {
    const passwordLogin = document.getElementById('adminLogin');
    const backupLogin = document.getElementById('adminBackupLogin');
    
    if (passwordLogin && backupLogin) {
        passwordLogin.style.display = 'block';
        backupLogin.style.display = 'none';
    }
}

// Show Backup Login
function showBackupLogin() {
    const passwordLogin = document.getElementById('adminLogin');
    const backupLogin = document.getElementById('adminBackupLogin');
    
    if (passwordLogin && backupLogin) {
        passwordLogin.style.display = 'none';
        backupLogin.style.display = 'block';
    }
}

// Admin Login (placeholder - will connect to backend)
function adminLogin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    // Placeholder validation - will be replaced with backend call
    if (password === 'demo123') { // Temporary for testing
        isAdminLoggedIn = true;
        showAdminContent();
        showToast('Welcome back, Admin Frank!', 'success');
    } else {
        showToast('Invalid password', 'error');
    }
}

// Admin Backup Login (placeholder)
function adminBackupLogin(event) {
    event.preventDefault();
    const backupKey = document.getElementById('backupKey').value;
    
    // Placeholder validation
    if (backupKey === 'BACKUP2025') { // Temporary for testing
        isAdminLoggedIn = true;
        showAdminContent();
        showToast('Access recovered successfully!', 'success');
    } else {
        showToast('Invalid backup key', 'error');
    }
}

// Show Admin Content
function showAdminContent() {
    const loginForm = document.getElementById('adminLogin');
    const backupForm = document.getElementById('adminBackupLogin');
    const adminContent = document.getElementById('adminContent');
    
    if (loginForm) loginForm.style.display = 'none';
    if (backupForm) backupForm.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';
    
    // Load existing messages
    loadAdminMessages();
}

// Show Tab
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    const selectedButton = event.target;
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedButton) selectedButton.classList.add('active');
}

// Post Message (placeholder)
function postMessage(event) {
    event.preventDefault();
    
    const title = document.getElementById('messageTitle').value;
    const content = document.getElementById('messageContent').value;
    
    if (title && content) {
        // This will be replaced with backend call
        showToast('Message posted successfully!', 'success');
        
        // Clear form
        document.getElementById('messageTitle').value = '';
        document.getElementById('messageContent').value = '';
        
        // Update notification count (placeholder)
        updateNotificationBadge(++notificationCount);
    }
}

// Load Admin Messages (placeholder)
function loadAdminMessages() {
    const messageList = document.getElementById('messageList');
    if (!messageList) return;
    
    // Placeholder content
    messageList.innerHTML = `
        <div style="text-align: center; color: #666; margin-top: 40px;">
            <i class="fas fa-envelope-open" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i>
            <p>No messages posted yet</p>
            <small>Posted messages will appear here for management</small>
        </div>
    `;
}

// Update Notification Badge
function updateNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNotifications();
        closeAdminDashboard();
        document.getElementById('adminMenuDropdown').classList.remove('active');
    }
});

// ==================== Backend Integration - Updated for Single API ==================== //
// Global variables for backend integration
let adminToken = null;
let notificationCheckInterval = null;

// Detect environment: localhost = dev, otherwise = prod (UNCHANGED)
const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://fp-backend-phi.vercel.app";

// Enhanced loadNotifications function with backend integration
function loadNotifications() {
    const content = document.getElementById('notificationContent');
    if (!content) return;
    
    // Show loading state
    content.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 16px;"></i>
            <p>Loading notifications...</p>
        </div>
    `;
    
    // UPDATED: Use single API endpoint
    fetch(`${API_BASE}/api/admin?action=notifications`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayNotifications(data.messages);
                updateNotificationBadge(data.count);
            } else {
                showNotificationError('Failed to load notifications');
            }
        })
        .catch(error => {
            console.error('Error loading notifications:', error);
            showNotificationError('Connection error');
        });
}

// Display notifications in the panel (UNCHANGED)
function displayNotifications(messages) {
    const content = document.getElementById('notificationContent');
    if (!content) return;
    
    if (messages.length === 0) {
        content.innerHTML = `
            <div class="no-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications yet</p>
                <small>Messages from admin will appear here</small>
            </div>
        `;
        return;
    }
    
    let html = '';
    messages.forEach(message => {
        const date = new Date(message.timestamp).toLocaleDateString();
        const time = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        html += `
            <div class="notification-item ${message.read ? '' : 'unread'}" data-id="${message.id}">
                <div class="notification-meta">
                    <span class="notification-date">${date} at ${time}</span>
                    ${!message.read ? '<span class="new-badge">NEW</span>' : ''}
                </div>
                <h4 class="notification-title">${escapeHtml(message.title)}</h4>
                <p class="notification-text">${escapeHtml(message.content)}</p>
                ${!message.read ? `<button class="mark-read-btn" onclick="markAsRead(${message.id})">Mark as Read</button>` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

// Show notification error (UNCHANGED)
function showNotificationError(message) {
    const content = document.getElementById('notificationContent');
    if (!content) return;
    
    content.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #dc3545;">
            <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 16px;"></i>
            <p>${message}</p>
            <button onclick="loadNotifications()" style="margin-top: 16px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
}

// Mark notification as read
function markAsRead(messageId) {
    // UPDATED: Use single API endpoint with query parameters
    fetch(`${API_BASE}/api/admin?action=notifications&id=${messageId}&operation=read`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadNotifications(); // Refresh the list
        } else {
            showToast('Failed to mark as read', 'error');
        }
    })
    .catch(error => {
        console.error('Error marking as read:', error);
        showToast('Connection error', 'error');
    });
}

// Enhanced admin login with backend
function adminLogin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    // UPDATED: Use single API endpoint
    fetch(`${API_BASE}/api/admin?action=login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            adminToken = data.token;
            isAdminLoggedIn = true;
            showAdminContent();
            showToast('Welcome back, Admin Frank!', 'success');
        } else {
            showToast(data.message || 'Invalid password', 'error');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showToast('Connection error', 'error');
    });
}

// Enhanced backup login with backend
function adminBackupLogin(event) {
    event.preventDefault();
    const backupKey = document.getElementById('backupKey').value;
    
    // UPDATED: Use single API endpoint
    fetch(`${API_BASE}/api/admin?action=login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ backupKey })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            adminToken = data.token;
            isAdminLoggedIn = true;
            showAdminContent();
            showToast('Access recovered successfully!', 'success');
        } else {
            showToast(data.message || 'Invalid backup key', 'error');
        }
    })
    .catch(error => {
        console.error('Backup login error:', error);
        showToast('Connection error', 'error');
    });
}

// Enhanced post message with backend
function postMessage(event) {
    event.preventDefault();
    
    if (!adminToken) {
        showToast('Please log in first', 'error');
        return;
    }
    
    const title = document.getElementById('messageTitle').value;
    const content = document.getElementById('messageContent').value;
    
    if (!title || !content) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Disable form during submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Posting...';
    submitBtn.disabled = true;
    
    // UPDATED: Use single API endpoint
    fetch(`${API_BASE}/api/admin?action=message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, token: adminToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Message posted successfully!', 'success');
            
            // Clear form
            document.getElementById('messageTitle').value = '';
            document.getElementById('messageContent').value = '';
            
            // Refresh admin messages
            loadAdminMessages();
            
            // Update global notification count
            checkNotifications();
        } else {
            showToast(data.message || 'Failed to post message', 'error');
        }
    })
    .catch(error => {
        console.error('Post message error:', error);
        showToast('Connection error', 'error');
    })
    .finally(() => {
        // Re-enable form
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Enhanced load admin messages with backend
function loadAdminMessages() {
    const messageList = document.getElementById('messageList');
    if (!messageList || !adminToken) return;
    
    messageList.innerHTML = `
        <div style="text-align: center; color: #666; margin-top: 20px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 16px;"></i>
            <p>Loading messages...</p>
        </div>
    `;
    
    // UPDATED: Use single API endpoint
    fetch(`${API_BASE}/api/admin?action=messages&token=${encodeURIComponent(adminToken)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAdminMessages(data.messages);
            } else {
                messageList.innerHTML = `
                    <div style="text-align: center; color: #dc3545; margin-top: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 16px;"></i>
                        <p>Failed to load messages</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading admin messages:', error);
            messageList.innerHTML = `
                <div style="text-align: center; color: #dc3545; margin-top: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 16px;"></i>
                    <p>Connection error</p>
                </div>
            `;
        });
}

// Display admin messages (UNCHANGED)
function displayAdminMessages(messages) {
    const messageList = document.getElementById('messageList');
    if (!messageList) return;
    
    if (messages.length === 0) {
        messageList.innerHTML = `
            <div style="text-align: center; color: #666; margin-top: 40px;">
                <i class="fas fa-envelope-open" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i>
                <p>No messages posted yet</p>
                <small>Posted messages will appear here for management</small>
            </div>
        `;
        return;
    }
    
    let html = '';
    messages.forEach(message => {
        const date = new Date(message.timestamp).toLocaleDateString();
        const time = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        html += `
            <div class="admin-message-item">
                <div class="admin-message-header">
                    <h4>${escapeHtml(message.title)}</h4>
                    <div class="admin-message-actions">
                        <button class="delete-btn" onclick="deleteMessage(${message.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="admin-message-content">${escapeHtml(message.content)}</p>
                <div class="admin-message-meta">
                    <span>Posted: ${date} at ${time}</span>
                    <span class="read-status ${message.read ? 'read' : 'unread'}">
                        ${message.read ? 'Read' : 'Unread'}
                    </span>
                </div>
            </div>
        `;
    });
    
    messageList.innerHTML = html;
}

// Delete message
function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    if (!adminToken) {
        showToast('Please log in first', 'error');
        return;
    }
    
    // UPDATED: Use single API endpoint
    fetch(`${API_BASE}/api/admin?action=message&id=${messageId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: adminToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Message deleted successfully', 'success');
            loadAdminMessages();
            checkNotifications(); // Update notification count
        } else {
            showToast(data.message || 'Failed to delete message', 'error');
        }
    })
    .catch(error => {
        console.error('Delete error:', error);
        showToast('Connection error', 'error');
    });
}

// Periodic notification checking
function startNotificationChecking() {
    // Check immediately
    checkNotifications();
    
    // Then check every 30 seconds
    if (notificationCheckInterval) {
        clearInterval(notificationCheckInterval);
    }
    
    notificationCheckInterval = setInterval(() => {
        checkNotifications();
    }, 30000);
}

// Check for new notifications
function checkNotifications() {
    // UPDATED: Use single API endpoint
    fetch(`${API_BASE}/api/admin?action=notifications`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateNotificationBadge(data.count);
            }
        })
        .catch(error => {
            console.error('Error checking notifications:', error);
        });
}

// HTML escape utility (UNCHANGED)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start notification checking when page loads (UNCHANGED)
document.addEventListener('DOMContentLoaded', function() {
    // Start checking for notifications periodically
    startNotificationChecking();
});