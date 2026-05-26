// ================================================================
// 1. INFINITY STARS ANIMATION (Canvas Background)
//    - Adapts to dark/light mode automatically
//    - Stars color changes dynamically when theme toggles
// ================================================================
(function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    const STAR_COUNT = 350; // slightly more stars for better effect
    let animationId = null;
    let speed = 0.3; // falling speed
    let currentTheme = 'light';

    // Helper: get current star color based on theme
    function getStarColor() {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? 'rgba(255, 255, 255, ' : 'rgba(30, 41, 59, '; // white for dark, dark slate for light
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStarsArray();
    }

    function initStarsArray() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 0.8,
                alpha: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 0.6 + 0.2
            });
        }
    }

    function drawStars() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        
        const starColorPrefix = getStarColor();
        for (let star of stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${starColorPrefix}${star.alpha})`;
            ctx.fill();
            // move star downwards (infinity scroll effect)
            star.y += star.speed * speed;
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
        }
        animationId = requestAnimationFrame(drawStars);
    }

    // Re-initialize stars when theme changes (so colors update)
    function onThemeChange() {
        if (!ctx) return;
        // No need to regenerate positions, just redraw will use new color
        // But we force a redraw immediately
        if (animationId) {
            // continue animation, colors will update on next frame
        }
    }

    // Watch for dark class changes on html element
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                // theme changed, just redraw – colors will adapt
                if (animationId) {
                    // small delay to let CSS transition finish, but not needed for colors
                }
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Optional: adjust speed on mouse move for parallax effect
    document.addEventListener('mousemove', (e) => {
        const normX = e.clientX / width;
        speed = 0.3 + normX * 0.5;
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    resizeCanvas();
    drawStars();
})();

// ================================================================
// 2. LOADING SCREEN
// ================================================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
        }, 800);
    }
});

// ================================================================
// 3. CUSTOM CURSOR (desktop only)
// ================================================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.innerWidth > 768 && cursorDot && cursorOutline) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX, y = e.clientY;
        cursorDot.style.transform = `translate(${x}px, ${y}px)`;
        cursorOutline.style.transform = `translate(${x}px, ${y}px)`;
    });
    const hoverTargets = document.querySelectorAll('a, button, .group, .nav-link, .mobile-nav-link, [onclick]');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
    });
}

// ================================================================
// 4. TYPEWRITER EFFECT
// ================================================================
const typeEl = document.getElementById('typewriter');
const names = ['Marouane Ksissou'];
let nameIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
    if (!typeEl) return;
    const current = names[nameIdx];
    typeEl.textContent = isDeleting
        ? current.substring(0, charIdx--)
        : current.substring(0, charIdx++);

    if (!isDeleting && charIdx === current.length + 1) {
        typeEl.classList.add('typing-done');
        return;
    }
    setTimeout(typeEffect, isDeleting ? 80 : 150);
}
if (typeEl) typeEffect();

// ================================================================
// 5. GSAP SCROLL ANIMATIONS
// ================================================================
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
        const x = el.classList.contains('fade-left') ? -60 :
                  el.classList.contains('fade-right') ? 60 : 0;
        const y = el.classList.contains('fade-up') ? 50 : 0;
        const s = el.classList.contains('scale-in') ? 0.9 : 1;
        gsap.fromTo(el,
            { opacity: 0, x, y, scale: s },
            {
                opacity: 1, x: 0, y: 0, scale: 1,
                duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
            }
        );
    });
}

// ================================================================
// 6. 3D TILT ON HERO CARD
// ================================================================
const tiltCard = document.getElementById('tilt-card');
const tiltParent = document.getElementById('hero-3d-card');
if (tiltCard && tiltParent) {
    tiltParent.addEventListener('mousemove', (e) => {
        const rect = tiltParent.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tiltCard.style.transform = `rotateY(${x * 12}deg) rotateX(${y * -12}deg) translateZ(15px)`;
    });
    tiltParent.addEventListener('mouseleave', () => {
        tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
    });
}

// ================================================================
// 7. SKILL COUNTERS + PROGRESS BARS
// ================================================================
let skillsCounted = false;
const skillsSection = document.getElementById('skills');
const skillObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || skillsCounted) return;
    skillsCounted = true;
    document.querySelectorAll('.counter-value').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const increment = target / 50;
        let current = 0;
        const tick = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + '%';
                requestAnimationFrame(tick);
            } else {
                counter.textContent = target + '%';
            }
        };
        tick();
        const skillItem = counter.closest('.skill-item');
        const progressEl = skillItem?.querySelector('.progress-bar');
        if (progressEl) {
            progressEl.style.transition = 'width 1s ease-out';
            setTimeout(() => { progressEl.style.width = target + '%'; }, 100);
        }
    });
}, { threshold: 0.4 });
if (skillsSection) skillObserver.observe(skillsSection);

// ================================================================
// 8. PROJECTS DATA
// ================================================================
const projects = [
    {
        name: 'Zementband',
        shortDesc: 'Optimiertes System zur Überwachung von Materialbändern.',
        longDesc: 'Dieses Projekt ist ein webbasiertes Management-System zur Verwaltung von Zementbändern und zur Unterstützung von Geschäftsprozessen in einem Unternehmen. Es wurde im Rahmen eines Stage-Projekts entwickelt und dient zur Digitalisierung der Verwaltung von Kunden, Verkäufen, Rechnungen und Zementbeständen. Das System basiert auf einem Rollen- und Berechtigungssystem (Admin, Controller, Chef).',
        date: '2025', category: 'Backend',
        features: ['Echtzeit-Überwachung', 'Berichtssystem', 'Benutzerverwaltung mit Rollen', 'Datenvisualisierung mit Charts', 'Rechnungsverwaltung', 'Verkaufsverwaltung', 'Lager- und Bestandskontrolle'],
        tech: ['Laravel', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Tailwind'],
        github: 'https://github.com/herrksissoumarouane-glitch/Gestion-des-band-des-ciment-',
        demo: null,
        image: 'projekte-bilder/ciment/ciment1.png',
        images: ['projekte-bilder/ciment/ciment1.png', 'projekte-bilder/ciment/ciment2.png', 'projekte-bilder/ciment/ciment3.png', 'projekte-bilder/ciment/ciment4.png', 'projekte-bilder/ciment/ciment5.png', 'projekte-bilder/ciment/ciment6.png'],
    },
    {
        name: 'gAbc Project',
        shortDesc: 'Schulverwaltungssystem',
        longDesc: 'gAbc ist ein webbasiertes Verwaltungssystem, entwickelt mit Laravel, zur Organisation einer Schule bzw. eines Ausbildungszentrums. Das System wurde im Rahmen eines Teamprojekts (4 Entwickler) entwickelt und ermöglicht die Verwaltung von Formatoren, Stagiaires, Gruppen sowie Abwesenheiten. Zusätzlich unterstützt es den Import und Export von Excel-Dateien zur Datenverarbeitung.',
        date: '2025', category: 'Fullstack',
        features: ['Multi-Role System (Admin, Direktor, Formateur, etc.)', 'Formatorenverwaltung (permanent & vakant)', 'Gruppen- & Stagiaire-Verwaltung', 'Abwesenheitsmanagement', 'Excel Import/Export', 'Laravel MVC Architektur'],
        tech: ['Laravel', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'],
        github: 'https://github.com/herrksissoumarouane-glitch/gAbc',
        demo: null,
        image: 'projekte-bilder/gabs/gabs1.png',
        images: ['projekte-bilder/gabs/gabs1.png', 'projekte-bilder/gabs/gabs2.png', 'projekte-bilder/gabs/gabs3.png', 'projekte-bilder/gabs/gabs4.png', 'projekte-bilder/gabs/gabs5.png'],
    },
    {
        name: 'Pro-To-Do',
        shortDesc: 'Task-Management',
        longDesc: 'Dieses Projekt ist ein webbasiertes Task-Management-System, entwickelt mit Laravel, das Benutzern ermöglicht, Aufgaben einfach zu erstellen, zu verwalten und zu verfolgen. Das Projekt wurde zu Lern- und Übungszwecken entwickelt, um moderne Webentwicklung mit Laravel und Tailwind CSS zu verstehen. Es bietet eine klare Darstellung aller Tasks mit Statusverwaltung.',
        date: '2025', category: 'Fullstack',
        features: ['Aufgabenverwaltung (erstellen, bearbeiten, löschen)', 'Prioritäten setzen', 'Fristen', 'Benutzerauthentifizierung', 'Statusverwaltung (offen/erledigt)', 'Filter- und Organisationsmöglichkeiten'],
        tech: ['Laravel', 'MySQL', 'Bootstrap', 'Tailwind'],
        github: 'https://github.com/herrksissoumarouane-glitch/Pro-to-do',
        demo: null,
        image: 'projekte-bilder/todo/todo4.png',
        images: ['projekte-bilder/todo/todo4.png', 'projekte-bilder/todo/todo1.png', 'projekte-bilder/todo/todo2.png', 'projekte-bilder/todo/todo3.png'],
    },
    {
        name: 'Redux CRUD',
        shortDesc: 'React Redux Toolkit',
        longDesc: 'Eine moderne CRUD-Anwendung mit React und Redux Toolkit. Die Anwendung ermöglicht das Hinzufügen, Bearbeiten und Löschen von Elementen mit globaler State-Verwaltung. Perfekt für komplexe Datenflüsse und moderne Frontend-Entwicklung.',
        date: '2025', category: 'Frontend',
        features: ['State Management mit Redux Toolkit', 'React Hooks', 'API Integration', 'Responsive Design', 'Elemente hinzufügen, bearbeiten, löschen'],
        tech: ['React', 'Redux Toolkit', 'JavaScript', 'CSS'],
        github: 'https://github.com/herrksissoumarouane-glitch/Redux-toolkit-CRUD',
        demo: null,
        image: 'projekte-bilder/reduxtoolkit/reacttool.png',
        images: ['projekte-bilder/reduxtoolkit/reacttool.png'],
    },
    {
        name: 'Multi-Converter',
        shortDesc: 'Einheitenkonverter',
        longDesc: 'Multi Converter ist eine webbasierte Anwendung zur Umrechnung verschiedener Einheiten, entwickelt mit PHP, HTML, CSS und JavaScript. Die Anwendung ermöglicht Benutzern schnelle und einfache Umrechnungen in mehreren Kategorien wie Temperatur, Gewicht, Geschwindigkeit, Zeit und Distanz.',
        date: '2025', category: 'Frontend',
        features: ['Temperatur Umrechnung (Celsius ↔ Fahrenheit ↔ Kelvin)', 'Gewicht Umrechnung (kg ↔ g ↔ Pfund)', 'Distanz Umrechnung (km ↔ m ↔ Meilen)', 'Zeit Umrechnung (Sekunden ↔ Minuten ↔ Stunden)', 'Geschwindigkeits Umrechnung (km/h ↔ m/s ↔ mph)'],
        tech: ['PHP', 'HTML', 'CSS', 'JavaScript'],
        github: 'https://github.com/herrksissoumarouane-glitch/multi-converter',
        demo: null,
        image: 'projekte-bilder/converter/conv1.png',
        images: ['projekte-bilder/converter/conv1.png', 'projekte-bilder/converter/conv2.png'],
    },
    {
        name: 'Devinette Game',
        shortDesc: 'Zahlenratespiel',
        longDesc: 'Devinette Game ist ein interaktives Zahlen-Ratespiel, entwickelt mit HTML, CSS, JavaScript und Tailwind CSS. Der Spieler muss eine zufällig generierte Zahl zwischen 10 und 100 erraten. Das Spiel bietet ein modernes UI-Design, Animationen und ein Verlaufssystem für frühere Versuche.',
        date: '2025', category: 'Frontend',
        features: ['Zufallszahl-Generator (10–100)', 'Begrenzte Anzahl von Versuchen', 'Dynamische Hinweise (Größer ↑ / Kleiner ↓)', 'Speicherung aller Versuche (Verlauf)', 'Modernes Glassmorphism-Design', 'Neon-Effekte und Hover-Animationen'],
        tech: ['HTML', 'CSS', 'Tailwind', 'JavaScript'],
        github: 'https://github.com/herrksissoumarouane-glitch/devinette-game',
        demo: 'https://herrksissoumarouane-glitch.github.io/devinette-game/',
        image: 'projekte-bilder/devinette/jeu.png',
        images: ['projekte-bilder/devinette/jeu.png'],
    },
    {
        name: 'CRUD Python',
        shortDesc: 'Python OOP',
        longDesc: 'Dieses Projekt ist eine einfache CRUD-Anwendung, entwickelt mit Python, zur Verwaltung von Produkten, Lieferanten und Kunden. Das Projekt basiert auf der objektorientierten Programmierung (OOP) und läuft über die Konsole.',
        date: '2025', category: 'Backend',
        features: ['Produktverwaltung (hinzufügen, anzeigen, suchen, löschen)', 'Lieferantenverwaltung', 'Kundenverwaltung (hinzufügen, anzeigen, suchen, löschen, Adresse ändern)', 'Objektorientierte Programmierung (OOP)', 'Konsolenbasierte Benutzeroberfläche'],
        tech: ['Python'],
        github: 'https://github.com/herrksissoumarouane-glitch/CRUD-Python',
        demo: null,
        image: 'projekte-bilder/crudPy/py.png',
        images: ['projekte-bilder/crudPy/py.png'],
    },
];

// ================================================================
// 9. RENDER PROJECT CARDS
// ================================================================
const grid = document.getElementById('projects-grid');
if (grid) {
    projects.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl';
        const techBadges = p.tech.slice(0, 3).map(t => `<span class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2 py-1 rounded-full font-mono">${t}</span>`).join('');
        const extraBadge = p.tech.length > 3 ? `<span class="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full font-mono">+${p.tech.length - 3}</span>` : '';
        const demoLink = p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="ml-auto text-green-600 dark:text-green-400 text-sm font-semibold hover:underline">Demo 🚀</a>` : '';
        card.innerHTML = `
            <div class="relative h-52 overflow-hidden cursor-pointer" data-project-index="${index}">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.src='https://placehold.co/600x400/2563eb/white?text=${encodeURIComponent(p.name)}'">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span class="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">🔍 Details</span></div>
            </div>
            <div class="p-5"><div class="flex flex-wrap gap-2 mb-3">${techBadges}${extraBadge}</div><h3 class="text-xl font-bold mb-2 font-display">${p.name}</h3><p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">${p.shortDesc}</p><div class="flex gap-3 items-center"><button data-project-index="${index}" class="open-modal-btn text-blue-600 text-sm font-semibold hover:underline">Details</button><a href="${p.github}" target="_blank" rel="noopener" class="text-slate-600 dark:text-slate-400 text-sm font-semibold hover:text-blue-600">GitHub →</a>${demoLink}</div></div>`;
        grid.appendChild(card);
    });

    grid.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-project-index]');
        if (trigger) {
            const idx = parseInt(trigger.getAttribute('data-project-index'), 10);
            openModal(projects[idx]);
        }
    });
}

// ================================================================
// 10. MODAL FUNCTIONS (PROJECT + CERTIFICATE)
// ================================================================
let currentSwiper = null;

window.openModal = function (proj) {
    const wrapper = document.getElementById('modalSwiperWrapper');
    const imgList = (proj.images && proj.images.length) ? proj.images : [proj.image];
    wrapper.innerHTML = imgList.map(img => `<div class="swiper-slide"><img src="${img}" alt="${proj.name}" class="w-full h-full object-contain" loading="lazy"></div>`).join('');
    document.getElementById('modalName').textContent = proj.name;
    document.getElementById('modalDate').textContent = proj.date;
    document.getElementById('modalCategory').textContent = proj.category;
    document.getElementById('modalLongDesc').textContent = proj.longDesc;
    document.getElementById('modalGithub').href = proj.github;
    document.getElementById('modalTech').innerHTML = proj.tech.map(t => `<span class="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-[11px] font-bold px-2 py-1 rounded-full font-mono">${t}</span>`).join('');
    document.getElementById('modalFeatures').innerHTML = proj.features.map(f => `<li>${f}</li>`).join('');
    const demoEl = document.getElementById('modalDemo');
    if (proj.demo) {
        demoEl.href = proj.demo;
        demoEl.classList.remove('hidden');
    } else {
        demoEl.classList.add('hidden');
    }
    const modal = document.getElementById('projectModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        if (currentSwiper) { currentSwiper.destroy(true, true); currentSwiper = null; }
        currentSwiper = new Swiper('.projectSwiper', {
            slidesPerView: 1,
            loop: imgList.length > 1,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }, 100);
};

window.closeProjectModal = function () {
    const modal = document.getElementById('projectModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    if (currentSwiper) { currentSwiper.destroy(true, true); currentSwiper = null; }
};

window.openCertModal = function (imagePath, title) {
    document.getElementById('certModalImage').src = imagePath;
    document.getElementById('certModalImage').alt = title;
    document.getElementById('certModalTitle').textContent = title;
    const m = document.getElementById('certModal');
    m.classList.remove('hidden');
    m.classList.add('flex');
    document.body.style.overflow = 'hidden';
};

window.closeCertModal = function () {
    const m = document.getElementById('certModal');
    m.classList.add('hidden');
    m.classList.remove('flex');
    document.body.style.overflow = 'auto';
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
        closeProjectModal();
    }
});

const certModal = document.getElementById('certModal');
if (certModal) {
    certModal.addEventListener('click', (e) => { if (e.target === certModal) closeCertModal(); });
}

const projectModal = document.getElementById('projectModal');
if (projectModal) {
    projectModal.addEventListener('click', (e) => { if (e.target === projectModal) closeProjectModal(); });
}

// ================================================================
// 11. THEME MANAGEMENT (DARK / LIGHT)
// ================================================================
const htmlEl = document.documentElement;
const getTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    htmlEl.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
    const moonPath = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>';
    const sunPaths = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    const svgContent = isDark ? sunPaths : moonPath;
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.innerHTML = svgContent;
};
applyTheme(getTheme());
const toggleDarkMode = () => applyTheme(htmlEl.classList.contains('dark') ? 'light' : 'dark');
document.getElementById('theme-toggle')?.addEventListener('click', toggleDarkMode);
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleDarkMode);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
});

// ================================================================
// 12. SCROLL PROGRESS BAR
// ================================================================
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const scrolled = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (progressBar) {
        progressBar.style.width = pct + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(pct));
    }
}, { passive: true });

// ================================================================
// 13. SMOOTH SCROLL WITH OFFSET
// ================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ================================================================
// 14. MOBILE MENU TOGGLE
// ================================================================
const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
    if (mobileMenu && mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
        mobileMenu.classList.add('hidden');
        mobileMenu.style.display = '';
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const svg = mobileMenuBtn.querySelector('svg');
            if (svg) {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            }
        }
    }
}

function toggleMobileMenu() {
    if (mobileMenu) {
        const isOpen = mobileMenu.classList.toggle('show');
        mobileMenu.classList.toggle('hidden', !isOpen);
        mobileMenu.style.display = isOpen ? 'block' : '';
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            const svg = mobileMenuBtn.querySelector('svg');
            if (svg) {
                if (isOpen) {
                    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
                } else {
                    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
                }
            }
        }
    }
}

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => closeMobileMenu());
    });
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('show') && 
            !mobileMenuBtn.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu.classList.contains('show')) closeMobileMenu();
    });
}

// ================================================================
// 15. COPY TO CLIPBOARD UTILITY
// ================================================================
window.copyToClipboard = function (text) {
    navigator.clipboard.writeText(text).then(() => alert('✅ E-Mail Adresse kopiert: ' + text)).catch(() => alert('❌ Fehler beim Kopieren'));
};