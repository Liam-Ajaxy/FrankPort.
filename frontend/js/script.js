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
            : 'https://your-backend-domain.com/api/contact';

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
            
            this.bindEvents();
        },

        bindEvents() {
            // Show/hide scroll button
            window.addEventListener('scroll', utils.throttle(() => {
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

    // Export for potential external use
    window.PortfolioApp = portfolioApp;

})();