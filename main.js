/**
 * ABSU Global Interaction Logic
 * Handles common UI behaviors like navbar transitions and scroll effects.
 */

const mainJs = {
    init: () => {
        // Global Preloader
        window.addEventListener('load', () => {
            const preloader = document.getElementById('site-preloader');
            const logo = preloader ? preloader.querySelector('.preloader-logo') : null;
            const tagline = preloader ? preloader.querySelector('.preloader-tagline') : null;

            if (preloader) {
                // Phase 1: Fade out branding elements
                if (logo) logo.style.opacity = '0';
                if (tagline) tagline.style.opacity = '0';
                
                setTimeout(() => {
                    // Phase 2: Fade out the main preloader background and spinner
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        // Phase 3: Signal that the page is ready for entrance animations
                        document.body.classList.add('page-loaded');
                    }, 500);
                }, 600);
            }
        });

        mainJs.handleNavbar();
        mainJs.handleMobileMenu();
        mainJs.handleScrollTop();
        mainJs.handleReveal();
        mainJs.handleCustomCursor(); // Call custom cursor handler before magnetic buttons
        mainJs.handleMagneticSocialIcons(); // New handler for social icons
        mainJs.handleMagneticButtons();
    },

    handleNavbar: () => {
        const nav = document.querySelector('nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    },

    handleCustomCursor: () => {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        // Create trail dots
        const trails = [];
        const trailCount = 6;
        for (let i = 0; i < trailCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            document.body.appendChild(dot);
            trails.push(dot);
        }

        let lastMouseX = 0;
        let lastMouseY = 0;
        let lastTimestamp = performance.now();

        window.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';

            // Calculate speed for trail color
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTimestamp;
            const deltaX = x - lastMouseX;
            const deltaY = y - lastMouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const speed = distance / deltaTime; // pixels per millisecond

            // Map speed to a hue value (e.g., 0 to 60 for yellow to orange/red range)
            // Max speed for full color shift, adjust as needed
            const maxSpeed = 0.8; // pixels per millisecond
            const hue = Math.min(speed / maxSpeed, 1) * 60; // 0 (slow) to 60 (fast)
            const saturation = 100;
            const lightness = 70;
            const trailColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

            // Update trails with increasing delay
            trails.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.left = x + 'px';
                    dot.style.top = y + 'px';
                    dot.style.backgroundColor = trailColor; // Apply speed-based color
                }, index * 25);
            });

            lastMouseX = x;
            lastMouseY = y;
            lastTimestamp = currentTime;
        });

        // Click Animation Listeners
        window.addEventListener('mousedown', () => cursor.classList.add('cursor-clicking'));
        window.addEventListener('mouseup', () => cursor.classList.remove('cursor-clicking'));

        // Image Hover Context
        document.querySelectorAll('img, .about-image-box').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('img-hover');
                cursor.innerText = 'View';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('img-hover');
                cursor.innerText = '';
            });
        });

        // Section-based Color Changes
        const sections = document.querySelectorAll('section, footer');
        sections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                const color = section.getAttribute('data-cursor-color');
                if (color) {
                    cursor.style.backgroundColor = color;
                    cursor.style.borderColor = color;
                }
            });
            section.addEventListener('mouseleave', () => {
                // Revert to default academic gold
                cursor.style.backgroundColor = '';
                cursor.style.borderColor = '';
            });
        });
    },

    handleMagneticButtons: () => {
        const buttons = document.querySelectorAll('.cta-btn');
        const cursor = document.querySelector('.custom-cursor');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = parseFloat(btn.getAttribute('data-strength')) || 0.3;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            btn.addEventListener('mouseenter', () => {
                if (cursor) cursor.classList.add('cursor-hover');
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                if (cursor) cursor.classList.remove('cursor-hover');
            });
        });
    },

    handleMagneticSocialIcons: () => {
        const socialIcons = document.querySelectorAll('.social-icon');
        const magneticRadius = 50; // pixels
        const magneticStrength = 0.2; // How strongly the icon moves towards the cursor

        document.body.addEventListener('mousemove', (e) => {
            socialIcons.forEach(icon => {
                const rect = icon.getBoundingClientRect();
                const iconCenterX = rect.left + rect.width / 2;
                const iconCenterY = rect.top + rect.height / 2;

                const distanceX = e.clientX - iconCenterX;
                const distanceY = e.clientY - iconCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (distance < magneticRadius) {
                    const translateX = distanceX * magneticStrength;
                    const translateY = distanceY * magneticStrength;
                    icon.style.transform = `translate(${translateX}px, ${translateY}px)`;
                } else {
                    icon.style.transform = ''; // Reset transform
                }
            });
        });
    },

    handleMobileMenu: () => {
        const toggle = document.getElementById('mobileToggle');
        const menu = document.getElementById('mobileMenu');
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                const icon = toggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });

            // Close menu on link click
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                });
            });
        }
    },

    handleScrollTop: () => {
        const btn = document.getElementById('scrollTopBtn');
        if (btn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 400) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
            });
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    handleReveal: () => {
        const reveals = document.querySelectorAll('section, footer, .feature-card, .glass-effect, .about-split, .faculty-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => {
            el.classList.add('reveal-init');
            observer.observe(el);
        });
    }
};

document.addEventListener('DOMContentLoaded', mainJs.init);
