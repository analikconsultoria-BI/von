import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Custom Cursor
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
    });
});

document.querySelectorAll('a, button, .service-card, .portfolio-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 3, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
    });
});

// 2. Generative Labyrinth Canvas
const initLabyrinth = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const lines = [];
    const step = 40;

    for (let x = 0; x < width + step; x += step) {
        for (let y = 0; y < height + step; y += step) {
            lines.push({
                x, y,
                type: Math.random() > 0.5
            });
        }
    }

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        const time = Date.now() * 0.0001;

        lines.forEach(line => {
            ctx.beginPath();
            const offset = Math.sin(time + (line.x + line.y) * 0.01) * 5;
            if (line.type) {
                ctx.moveTo(line.x + offset, line.y);
                ctx.lineTo(line.x + step + offset, line.y + step);
            } else {
                ctx.moveTo(line.x + step + offset, line.y);
                ctx.lineTo(line.x + offset, line.y + step);
            }
            ctx.stroke();
        });

        requestAnimationFrame(draw);
    };

    draw();
};

initLabyrinth('labyrinth-canvas');
initLabyrinth('cta-labyrinth-canvas');

// 3. Entry Animations
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    gsap.from(section.querySelectorAll('h1, h2, h3, p, .btn, .service-card, .portfolio-item'), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
        }
    });
});

// 4. Horizontal Scroll (Process)
const processTimeline = document.querySelector('.process-timeline');
if (processTimeline) {
    gsap.to(processTimeline, {
        x: () => -(processTimeline.scrollWidth - window.innerWidth + 100),
        ease: 'none',
        scrollTrigger: {
            trigger: '.process',
            start: 'top top',
            end: () => `+=${processTimeline.scrollWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
        }
    });
}

// 5. Hero Specific Entry
gsap.from('.von-container h1', {
    y: 200,
    skewY: 10,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.5
});

// Smooth Scroll for triggers
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
