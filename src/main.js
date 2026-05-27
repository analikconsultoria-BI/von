import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const initVonLab = () => {
    // 1. Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        });
    }


    // 3. Hero Entrance
    const initHeroReveal = () => {
        const title = document.querySelector('.hero-title-main');
        const subtitle = document.querySelector('.hero-subtitle-main');
        const buttons = document.querySelector('.hero-buttons');
        const preloader = document.querySelector('.von-preloader');
        const preloaderLogo = document.querySelector('.von-preloader-logo');

        // Lock scroll during preloader
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline();

        if (preloader && preloaderLogo) {
            tl.fromTo(preloaderLogo, 
                { opacity: 0, scale: 0.3, filter: 'blur(30px)' }, 
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' }
            )
            .to(preloaderLogo, { scale: 15, opacity: 0, filter: 'blur(10px)', duration: 0.8, ease: 'power4.in', delay: 0.6 })
            .to(preloader, { 
                opacity: 0, 
                duration: 0.4, 
                ease: 'power2.inOut', 
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = '';
                }
            }, "-=0.2");
            
            if (title) tl.fromTo(title, {opacity: 0, y: 30}, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
            if (subtitle) tl.fromTo(subtitle, {opacity: 0, y: 20}, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.7");
            if (buttons) tl.fromTo(buttons, {opacity: 0, y: 20}, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.7");
        } else {
            document.body.style.overflow = '';
            if (title) tl.fromTo(title, {opacity: 0, y: 30}, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 1.5 });
            if (subtitle) tl.fromTo(subtitle, {opacity: 0, y: 20}, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.7");
            if (buttons) tl.fromTo(buttons, {opacity: 0, y: 20}, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.7");
        }
    };

    // 4. Smooth Reveals
    const initScrollAnimations = () => {
        // About reveal
        const aboutText = document.querySelector('.about-content');
        if (aboutText) {
            gsap.from(aboutText.children, {
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top 70%'
                },
                opacity: 0, y: 30, duration: 1, stagger: 0.3, ease: 'power3.out'
            });
        }

        // Why differentiate items
        const diffItems = document.querySelectorAll('.diff-item');
        diffItems.forEach((item, i) => {
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                },
                opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: i * 0.2
            });
        });
    };

    // 5. Topographic Background
    const initTopoMap = () => {
        const canvas = id('topo-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h;
        const waves = [];

        const init = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            waves.length = 0;
            for (let i = 0; i < 8; i++) {
                waves.push({
                    y: h * 0.2 + (i * h * 0.1),
                    amplitude: 20 + Math.random() * 30,
                    frequency: 0.005 + Math.random() * 0.005,
                    phase: Math.random() * Math.PI * 2
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            waves.forEach(wave => {
                ctx.beginPath();
                for (let x = 0; x < w; x += 5) {
                    const y = wave.y + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                wave.phase += 0.01;
            });
            requestAnimationFrame(draw);
        };

        window.addEventListener('resize', init);
        init(); draw();
    };


    // 8. Project Viewer (Sub-página logic)
    const initProjectViewer = () => {
        const viewer = id('project-viewer');
        const closeBtn = id('viewer-close');
        const overlay = id('viewer-overlay');
        const projectItems = document.querySelectorAll('.p-item');

        const vTitle = id('viewer-title');
        const vDesc = id('viewer-desc');
        const vImg = id('viewer-img');
        const vLink = id('viewer-link');

        const openViewer = (data) => {
            if (vTitle) vTitle.innerText = data.title;
            if (vDesc) vDesc.innerText = data.desc;
            if (vImg) vImg.src = data.img;
            if (vLink) vLink.href = data.link;

            viewer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scroll
        };

        const closeViewer = () => {
            viewer.classList.remove('active');
            document.body.style.overflow = ''; // Resume scroll
        };

        projectItems.forEach(item => {
            item.addEventListener('click', () => {
                openViewer({
                    title: item.getAttribute('data-title'),
                    desc: item.getAttribute('data-desc'),
                    img: item.getAttribute('data-img'),
                    link: item.getAttribute('data-link')
                });
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeViewer);
        if (overlay) overlay.addEventListener('click', closeViewer);
    };

    // 9. FAQ Accordion
    const initFAQ = () => {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            if (!trigger) return;
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all
                items.forEach(i => i.classList.remove('active'));
                // Open clicked (if it wasn't already open)
                if (!isActive) item.classList.add('active');
            });
        });
    };

    // 10. Mobile bottom drawer for services
    const initServicesDrawer = () => {
        const cards = document.querySelectorAll('.service-card');
        const drawer = document.getElementById('mobile-service-drawer');
        if (!drawer) return;
        const overlay = drawer.querySelector('.drawer-overlay');
        const closeBtn = drawer.querySelector('.drawer-close-btn');
        const body = drawer.querySelector('.drawer-body');

        const openDrawer = (title, desc) => {
            if (window.innerWidth >= 768) return; // Only run on mobile
            body.innerHTML = `
                <h3>${title}</h3>
                <p>${desc}</p>
                <a href="https://wa.link/lbt7x0" target="_blank" class="btn-solid-pink">Solicitar Orçamento ↗</a>
            `;
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        };

        const closeDrawer = () => {
            drawer.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        };

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (window.innerWidth >= 768) return;
                const title = card.getAttribute('data-title');
                const desc = card.getAttribute('data-desc');
                openDrawer(title, desc);
            });
        });

        if (overlay) overlay.addEventListener('click', closeDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    };

    // 11. Scroll Dots Navigation
    const initScrollDots = () => {
        const dots = document.querySelectorAll('.scroll-dot');
        const sectionIds = ['hero','sec-pain','sec-importance','sec-services','sec-stats','portfolio','sec-process','contato','sec-faq','sec-cta'];

        // Click to jump
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const target = document.getElementById(sectionIds[i]);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Observe which section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = sectionIds.indexOf(entry.target.id);
                    dots.forEach(d => d.classList.remove('active'));
                    if (idx >= 0 && dots[idx]) dots[idx].classList.add('active');
                }
            });
        }, { threshold: 0.5 });

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    };

    function id(name) { return document.getElementById(name); }


    initHeroReveal();
    initScrollAnimations();
    initTopoMap();
    initProjectViewer();
    initFAQ();
    initServicesDrawer();
    initScrollDots();
};

window.onload = initVonLab;
