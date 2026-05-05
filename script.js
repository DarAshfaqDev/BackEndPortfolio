/**
 * Alex Mercer — Portfolio · script.js
 * FIXED: Reveal animations always fire correctly
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  revealAll();          // ← immediately show everything as fallback
  initRevealOnScroll(); // ← also animate on scroll for flair
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initProjectFilter();
  initContribGraph();
  initContactForm();
  initBackToTop();
  injectKeyframes();
  updateYear();
  console.log('%c🐍 Portfolio ready', 'color:#38bdf8;font-weight:bold;font-size:13px;');
});

/* ── CRITICAL FIX: content is visible by default in CSS.
   JS adds .hidden only to below-fold elements, then removes it
   as they scroll in. If JS fails → everything stays visible. ── */
function revealAll() {
  // Nothing to do — CSS default is opacity:1
}

function initRevealOnScroll() {
  if (!('IntersectionObserver' in window)) return;

  const els = document.querySelectorAll('.reveal');

  // Only hide elements that are genuinely below the fold
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight + 50) {
      el.classList.add('hidden');
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.classList.remove('hidden');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.reveal.hidden').forEach(el => io.observe(el));
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
}

/* ── Sticky Navbar ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Mobile Hamburger ── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Project Filter ── */
function initProjectFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');

      const f = tab.dataset.filter;
      cards.forEach(card => {
        const show = f === 'all' || (card.dataset.category || '').includes(f);
        card.style.transition    = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity       = show ? '1'     : '0.15';
        card.style.transform     = show ? 'scale(1)' : 'scale(0.97)';
        card.style.pointerEvents = show ? 'all'   : 'none';
      });
    });
  });
}

/* ── Contribution Graph ── */
function initContribGraph() {
  const grid = document.getElementById('contribGrid');
  if (!grid) return;
  const levels = ['','','','','l1','l1','l1','l2','l2','l3','l4'];
  const frag   = document.createDocumentFragment();
  for (let i = 0; i < 364; i++) {
    const cell = document.createElement('div');
    const lvl  = levels[Math.floor(Math.random() * levels.length)];
    cell.className = 'contrib-cell' + (lvl ? ' ' + lvl : '');
    frag.appendChild(cell);
  }
  grid.appendChild(frag);
}

/* ── Contact Form ── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('formSubmitBtn');
  const success = document.getElementById('formSuccess');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]')?.value.trim();
    const email   = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 450);
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent      = '✓ Message Sent!';
      btn.style.background = 'var(--green)';
      btn.style.color      = 'var(--bg)';
      if (success) { success.textContent = `Thanks ${name}! I'll reply within 24 hours.`; success.classList.add('visible'); }
      form.reset();
      setTimeout(() => {
        btn.disabled         = false;
        btn.textContent      = 'Send Message ↗';
        btn.style.background = '';
        btn.style.color      = '';
        if (success) success.classList.remove('visible');
      }, 4000);
    }, 1200);
  });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Auto Year ── */
function updateYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

function injectKeyframes() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}   60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
    .shake { animation: shake 0.45s ease; }
    .nav-active { color: var(--accent) !important; }
    .nav-active::after { transform: scaleX(1) !important; }
  `;
  document.head.appendChild(s);
}