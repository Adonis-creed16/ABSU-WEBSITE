/**
 * ABSU Global Interaction Logic
 * Handles common UI behaviors like navbar transitions and scroll effects.
 */

const mainJs = {
    init: () => {
        // Global Preloader
        window.addEventListener('load', () => {
            const preloader = document.getElementById('site-preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        });

        mainJs.handleNavbar();
        mainJs.handleMobileMenu();
        mainJs.handleScrollTop();
        mainJs.handleReveal();
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
        const reveals = document.querySelectorAll('section, .feature-card, .glass-effect, .about-split, .faculty-card');
        
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
