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

    // 2. Particle Hero
    const initParticleHero = () => {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H;
        let mouse = { x: -9999, y: -9999 };
        const particles = [];

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            buildText();
        };

        const buildText = () => {
            particles.length = 0;
            const off = document.createElement('canvas');
            off.width = W; off.height = H;
            const oCtx = off.getContext('2d');
            const fontSize = W < 768 ? Math.floor(W * 0.22) : Math.floor(W * 0.14);
            oCtx.font = `900 ${fontSize}px 'Montserrat', sans-serif`;
            oCtx.fillStyle = 'white';
            oCtx.textAlign = 'center';
            oCtx.fillText('VON', W / 2, H * 0.35);
            oCtx.fillText('LAB', W / 2, H * 0.35 + fontSize * 0.9);

            const data = oCtx.getImageData(0, 0, W, H).data;
            const step = W < 768 ? 4 : 3;
            for (let y = 0; y < H; y += step) {
                for (let x = 0; x < W; x += step) {
                    if (data[(y * W + x) * 4] > 128) {
                        particles.push({
                            x: Math.random() * W, y: Math.random() * H,
                            ox: x, oy: y,
                            size: Math.random() * 1.5 + 0.5,
                            speed: 0.05 + Math.random() * 0.05
                        });
                    }
                }
            }
        };

        document.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(0, 0, W, H);
            particles.forEach(p => {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const force = dist < 120 ? (120 - dist) / 120 : 0;
                const mouseForce = force * 20;

                p.x += (p.ox - p.x) * 0.1 - (dx / dist) * mouseForce;
                p.y += (p.oy - p.y) * 0.1 - (dy / dist) * mouseForce;

                ctx.fillStyle = 'white';
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize(); draw();
    };

    // 3. Hero Entrance
    const initHeroReveal = () => {
        const subtitle = id('hero-subtitle');
        const cta = id('hero-cta');
        if (!subtitle) return;

        const tl = gsap.timeline({ delay: 1.5 });
        tl.to(subtitle, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
            .to(cta, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.5");
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

    function id(name) { return document.getElementById(name); }

    initParticleHero();
    initHeroReveal();
    initScrollAnimations();
    initTopoMap();
    initProjectViewer();
    initFAQ();
};

window.onload = initVonLab;
