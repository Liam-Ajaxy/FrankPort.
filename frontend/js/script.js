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
            ctx.fillStyle = '#f4d03f';
            ctx.strokeStyle = '#f4d03f';
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
                ctx.fillStyle = '#f4d03f';
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
                this.submitBtn.classList.add('loading');
                this.submitBtn.disabled = true;
            } else {
                this.submitBtn.classList.remove('loading');
                this.submitBtn.disabled = false;
            }
        },

        showStatus(message, type) {
            this.formStatus.textContent = message;
            this.formStatus.className = `form-status ${type}`;
            
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
            "Hey friend! Those shortcuts are resting 😴 but everything else in FrankPort is all yours to explore!",
            "Oops! That shortcut is taking a nap 🛌 enjoy exploring FrankPort instead!",
            "Whoa! Shortcuts are off-limits here 😎 FrankPort welcomes you to roam freely!",
            "Friendly heads-up! 🔒 Those keys are locked, but the rest is all yours!",
            "Sneaky keys detected! 😁 But FrankPort has plenty to explore without them."
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
                    try { showToast(getRandomMessage(), TOAST_TYPE, 4000); } catch(_) {}
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
            try { showToast(getRandomMessage(), TOAST_TYPE, 6000); } catch(_) {}
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
            "Hey there! Welcome to FrankPort — dive in and explore!",
            "Glad you’re here! Discover what FrankPort has to offer.",
            "Hello! Take a peek around and enjoy the experience.",
            "Hey! FrankPort’s doors are open — explore freely!",
            "Welcome aboard! Let FrankPort show you something cool.",
            "Hi there! Enjoy your journey through FrankPort.",
            "👋 Hello! Dive into FrankPort and see what awaits.",
            "Hey! Explore, learn, and enjoy every corner of FrankPort.",
            "Welcome! FrankPort is glad to have you here. enjoy your stay!"
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
                                "Thanks! FrankPort’s taking notes to improve things for you.",
                                "You helped FrankPort get better and friendlier. Cheers!",
                                "We’re listening! FrankPort’s ready to level up thanks to you.",
                                "Thanks for your honesty. FrankPort will shine brighter!"
                            ]
                            : [
                                "Feedback received and pinned to FrankPort’s heart. Thanks!",
                                "What you shared will echo in every step FrankPort takes. Thanks!",
                                "Feedback fades, but yours is part of FrankPort’s DNA. Thanks!"
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



    // Export for potential external use
    window.PortfolioApp = portfolioApp;

})();