// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
function revealOnScroll() {
    const sections = document.querySelectorAll('.section-header, .about-grid, .problem-content, .feature-block, .workflow, .architecture, .tech-grid, .timeline-container, .impact-grid, .cta-content');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('reveal', 'active');
        }
    });

    // Staggered card animations
    const cards = document.querySelectorAll('.about-card, .feature-card, .tech-card, .impact-card, .category-card, .timeline-item');
    
    cards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight * 0.9) {
            setTimeout(() => {
                card.classList.add('visible');
            }, index % 4 * 100); // Stagger by 100ms
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== ANIMATED COUNTER =====
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        if (stat.dataset.animated) return;
        
        const rect = stat.getBoundingClientRect();
        if (rect.top > window.innerHeight) return;
        
        stat.dataset.animated = 'true';
        const text = stat.textContent;
        const number = parseInt(text);
        
        if (isNaN(number)) return; // Skip "24/7" etc.
        
        const suffix = text.replace(/[0-9]/g, ''); // Get "+" etc.
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), number);
            stat.textContent = current + suffix;
            
            if (step >= steps) {
                stat.textContent = text;
                clearInterval(timer);
            }
        }, duration / steps);
    });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ===== DARK/LIGHT MODE TOGGLE =====
// Create toggle button
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
themeToggle.title = 'Toggle Dark/Light Mode';
document.body.appendChild(themeToggle);

// Check saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const navSections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollPos = window.scrollY + 100;
    
    navSections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                link.style.color = '#E31E24';
            } else {
                link.style.color = '';
            }
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ===== TYPING EFFECT ON HERO (Optional Enhancement) =====
const heroTitle = document.querySelector('.hero-text h1');
if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroTitle.style.transition = 'all 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
}

// ===== HERO SUBTITLE ANIMATION =====
const heroSubtitle = document.querySelector('.hero-text h2');
if (heroSubtitle) {
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroSubtitle.style.transition = 'all 1s ease';
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
    }, 600);
}

// ===== HERO DESC ANIMATION =====
const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
    heroDesc.style.opacity = '0';
    heroDesc.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroDesc.style.transition = 'all 1s ease';
        heroDesc.style.opacity = '1';
        heroDesc.style.transform = 'translateY(0)';
    }, 900);
}

// ===== PARALLAX EFFECT ON HERO CARD =====
const mlaCard = document.querySelector('.mla-card');
if (mlaCard) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        mlaCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Reset on mouse leave
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.addEventListener('mouseleave', () => {
            mlaCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
            mlaCard.style.transition = 'transform 0.5s ease';
        });
        heroVisual.addEventListener('mouseenter', () => {
            mlaCard.style.transition = 'none';
        });
    }
}

console.log('🎯 Voice to Minister - Portfolio loaded successfully!');
