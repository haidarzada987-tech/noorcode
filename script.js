/* =========================================
   NOORULLAH HAIDARI — PORTFOLIO
   script.js — All interactions
   ========================================= */

'use strict';

/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('hidden'); }
    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
      observeElement(el);
    });
  }, 1900);
});

/* ---- Scroll Progress ---- */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = percent + '%';
}, { passive: true });

/* ---- Nav scroll behaviour ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
}, { passive: true });

/* ---- Mobile Nav ---- */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
navToggle && navToggle.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navMobile.setAttribute('aria-hidden', !isOpen);
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle && navToggle.classList.remove('open');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
  });
});

/* ---- Smooth scrolling (anchor) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Intersection Observer for animations ---- */
function observeElement(el) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  observer.observe(el);
}

/* ---- Skill bars animation ---- */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      setTimeout(() => { fill.style.width = width + '%'; }, 100);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(fill => skillObserver.observe(fill));

/* ---- Stat counter animation ---- */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCounter(el, target);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
statNumbers.forEach(el => statObserver.observe(el));

/* ---- Project filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- Contact form validation ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, validationFn, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  const group = field ? field.closest('.form-group') : null;
  if (!field || !error) return true;
  const value = field.value.trim();
  if (!validationFn(value)) {
    error.textContent = message;
    group && group.classList.add('error');
    return false;
  } else {
    error.textContent = '';
    group && group.classList.remove('error');
    return true;
  }
}

function clearError(id, errorId) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  const group = field ? field.closest('.form-group') : null;
  if (error) error.textContent = '';
  group && group.classList.remove('error');
}

if (contactForm) {
  ['name', 'email', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', () => clearError(id, id + 'Error'));
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const validName = validateField('name', 'nameError', v => v.length >= 2, 'Please enter your full name.');
    const validEmail = validateField('email', 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
    const validProject = validateField('project', 'projectError', v => v !== '', 'Please select a project type.');
    const validMessage = validateField('message', 'messageError', v => v.length >= 20, 'Please describe your project (min 20 characters).');

    if (validName && validEmail && validProject && validMessage) {
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      setTimeout(() => {
        formSuccess && formSuccess.classList.add('visible');
        contactForm.reset();
        btn.disabled = false;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg> Send Message`;
        setTimeout(() => formSuccess && formSuccess.classList.remove('visible'), 6000);
      }, 1200);
    }
  });
}

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) { current = section.getAttribute('id'); }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) { link.classList.add('active'); }
  });
}, { passive: true });

/* ---- Subtle parallax on hero orbs ---- */
const heroOrbs = document.querySelectorAll('.hero-orb');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroOrbs.forEach((orb, i) => {
    const speed = i === 0 ? 0.15 : 0.08;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });

/* ---- Keyboard accessibility for filter buttons ---- */
filterBtns.forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});
