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

        document.body.style.overflow = '';

        const tl = gsap.timeline();

        if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
        if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.8");
        if (buttons) tl.fromTo(buttons, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.8");
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



    // 11. Scroll Dots Navigation
    const initScrollDots = () => {
        const dots = document.querySelectorAll('.scroll-dot');
        const sectionIds = ['hero', 'sec-services', 'portfolio', 'sec-process', 'contato', 'sec-orcamento', 'sec-faq'];

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

    // Rotating Hero Capsule Text
    const initHeroRotation = () => {
        const texts = document.querySelectorAll('.rotating-text');
        const badge = document.querySelector('.hero-capsule-badge');
        if (!texts.length || !badge) return;

        let currentIndex = 0;

        const updateWidth = () => {
            let maxWidth = 0;
            texts.forEach(t => {
                // We need to briefly ensure elements are measurable
                // Though they are position: absolute, offsetWidth works if they are rendered
                const w = t.offsetWidth;
                if (w > maxWidth) maxWidth = w;
            });
            if (maxWidth > 0) {
                badge.style.width = maxWidth + 'px';
            }
        };

        // Initialize width (slight delay to ensure fonts loaded)
        setTimeout(updateWidth, 100);
        
        // Update width on resize to handle responsive font changes
        window.addEventListener('resize', () => requestAnimationFrame(updateWidth));

        setInterval(() => {
            const current = texts[currentIndex];
            current.classList.remove('active');
            current.classList.add('exit');

            currentIndex = (currentIndex + 1) % texts.length;

            const next = texts[currentIndex];
            next.classList.remove('exit');
            next.classList.add('active');

            // Reset the previous exit element
            setTimeout(() => {
                current.classList.remove('exit');
            }, 500);
        }, 2500);
    };

    const initDiffCardsCarousel = () => {
        const wrapper = document.querySelector('.diff-cards-wrapper');
        const container = document.querySelector('.diff-cards-container');
        const prevBtn = document.querySelector('.diff-control-btn.prev');
        const nextBtn = document.querySelector('.diff-control-btn.next');

        if (!wrapper || !prevBtn || !nextBtn) return;

        const updateButtons = () => {
            const scrollLeft = Math.round(wrapper.scrollLeft);
            const maxScroll = Math.round(wrapper.scrollWidth - wrapper.clientWidth);

            prevBtn.disabled = scrollLeft <= 8;
            nextBtn.disabled = scrollLeft >= maxScroll - 8;
        };

        const getScrollAmount = () => {
            const firstCard = container.querySelector('.diff-card');
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth;
                const gap = parseFloat(window.getComputedStyle(container).gap) || 24;
                return cardWidth + gap;
            }
            return wrapper.clientWidth * 0.75;
        };

        prevBtn.addEventListener('click', () => {
            wrapper.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            wrapper.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        wrapper.addEventListener('scroll', () => requestAnimationFrame(updateButtons));
        window.addEventListener('resize', () => requestAnimationFrame(updateButtons));

        // Initial setup
        setTimeout(updateButtons, 150);
    };

    // 10. Orcamento Form Submission
    const initOrcamentoForm = () => {
        const form = document.getElementById('form-orcamento');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Set loading/sending state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando orçamento...';

            const nome = document.getElementById('form-nome').value;
            const email = document.getElementById('form-email').value;
            const whatsapp = document.getElementById('form-whatsapp').value;
            const desc = document.getElementById('form-desc').value;

            try {
                const response = await fetch('https://formsubmit.co/ajax/analikconsultoria@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Nome: nome,
                        Email: email,
                        WhatsApp: whatsapp,
                        'Descrição do Projeto': desc
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success state styling
                    submitBtn.style.backgroundColor = '#28a745'; // Green success color
                    submitBtn.style.borderColor = '#28a745';
                    submitBtn.innerHTML = 'Orçamento enviado com sucesso! ✓';
                    form.reset();
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                        submitBtn.innerHTML = originalText;
                    }, 4000);
                } else {
                    throw new Error(data.message || 'Erro no envio.');
                }
            } catch (error) {
                console.error(error);
                // Error state styling
                submitBtn.style.backgroundColor = '#dc3545'; // Red error color
                submitBtn.style.borderColor = '#dc3545';
                submitBtn.innerHTML = 'Erro ao enviar. Tente novamente.';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.innerHTML = originalText;
                }, 4000);
            }
        });
    };

    initHeroReveal();
    initScrollAnimations();
    initTopoMap();
    initProjectViewer();
    initFAQ();
    initOrcamentoForm();

    initScrollDots();
    initHeroRotation();
    initDiffCardsCarousel();
};

window.onload = initVonLab;
