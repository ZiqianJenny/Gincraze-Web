/* ═══════════════════════════════════════════════════════════
   dark-prologue.js v2
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────
   ★ TUNING CONSTANTS

   CLOUD_DRIFT_PX
     How many pixels each cloud slides toward its own side
     when the cursor hovers over it.
     Larger = more dramatic drift.  Recommended: 15–40.

   STAR_COUNT
     Number of twinkling stars in the background.
─────────────────────────────────────────────────────────── */
const CLOUD_DRIFT_PX = 24;
const STAR_COUNT     = 220;


/* ─────────────────────────────────────────────────────────
   DOM references
───────────────────────────────────────────────────────── */
const _sec      = document.getElementById('dark-prologue');
const _starsCvs = document.getElementById('dp-stars-canvas');
const _moon     = document.getElementById('dp-moon');
const _cloudL   = document.getElementById('dp-cloud-left');
const _cloudR   = document.getElementById('dp-cloud-right');
const _lines    = Array.from(document.querySelectorAll('.dp-line:not(.dp-line--spacer)'));
const _cbCanvas = document.getElementById('cb-canvas');   /* cocktail bubbles */

if (!_sec) {
  console.warn('dark-prologue.js: #dark-prologue not found — skipping.');
}

/* ─────────────────────────────────────────────────────────
   Twinkling star canvas
   The canvas is position:fixed so it always fills the
   viewport; visibility is toggled when the section is
   on-screen.
───────────────────────────────────────────────────────── */
const _sCtx = _starsCvs ? _starsCvs.getContext('2d') : null;
let _stars   = [];
let _starOn  = false;
let _starRaf = null;

function _initStars() {
  if (!_starsCvs) return;
  _starsCvs.width  = window.innerWidth;
  _starsCvs.height = window.innerHeight;
  _stars = Array.from({ length: STAR_COUNT }, () => ({
    x:    Math.random() * _starsCvs.width,
    y:    Math.random() * _starsCvs.height,
    r:    0.4 + Math.random() * 1.7,
    ph:   Math.random() * Math.PI * 2,
    freq: 0.4 + Math.random() * 1.8,
  }));
}

function _drawStars(ts) {
  if (!_sCtx) return;
  _sCtx.clearRect(0, 0, _starsCvs.width, _starsCvs.height);
  const t = ts * 0.001;
  for (const s of _stars) {
    const a = 0.28 + 0.72 * (0.5 + 0.5 * Math.sin(t * s.freq + s.ph));
    _sCtx.beginPath();
    _sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    _sCtx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
    _sCtx.fill();
  }
}

function _starTick(ts) {
  if (!_starOn) { _starRaf = null; return; }
  _drawStars(ts);
  _starRaf = requestAnimationFrame(_starTick);
}

/* ─────────────────────────────────────────────────────────
   Cloud hover drift
   Left cloud drifts further left; right cloud drifts right.
───────────────────────────────────────────────────────── */
function _initCloudHover() {
  if (_cloudL) {
    _cloudL.addEventListener('mouseenter', () => {
      _cloudL.style.transform = `translateX(-${CLOUD_DRIFT_PX}px)`;
    });
    _cloudL.addEventListener('mouseleave', () => {
      _cloudL.style.transform = 'translateX(0)';
    });
  }
  if (_cloudR) {
    _cloudR.addEventListener('mouseenter', () => {
      _cloudR.style.transform = `translateX(${CLOUD_DRIFT_PX}px)`;
    });
    _cloudR.addEventListener('mouseleave', () => {
      _cloudR.style.transform = 'translateX(0)';
    });
  }
}


/* ─────────────────────────────────────────────────────────
   IntersectionObserver: reveal text lines when they scroll
   into the viewport.  Each line gets a small stagger delay
   that increases with its index.
───────────────────────────────────────────────────────── */
const _revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    /* Stagger: find the line's index among siblings */
    const idx = _lines.indexOf(e.target);
    const delay = Math.max(0, idx % 4) * 80;  /* reset stagger per paragraph group */
    setTimeout(() => e.target.classList.add('dp-visible'), delay);
    _revealIO.unobserve(e.target);
  });
}, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });

/* Observer for moon */
const _moonIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      _moon && _moon.classList.add('dp-visible');
      _moonIO.disconnect();
    }
  });
}, { threshold: 0.4 });


/* ─────────────────────────────────────────────────────────
   Section visibility — stars only
   (Bubble clipping is handled separately via scroll event.)
───────────────────────────────────────────────────────── */
const _sectionIO = _sec ? new IntersectionObserver(entries => {
  entries.forEach(e => {
    _starOn = e.isIntersecting;
    if (_starsCvs) _starsCvs.classList.toggle('dp-active', _starOn);
    if (_starOn && !_starRaf) {
      _starRaf = requestAnimationFrame(_starTick);
    }
  });
}, { threshold: 0 }) : null;

/* ─────────────────────────────────────────────────────────
   Bubble canvas clip — tracks the exact light/dark boundary
   ─────────────────────────────────────────────────────────
   Instead of hiding the whole canvas, we clip it so bubbles
   are only visible ABOVE the dark section's top edge.
   Combined with the clouds sitting at z-index 10000 (above
   the canvas at 9999), bubbles appear to sink behind the
   clouds right at the transition line.
───────────────────────────────────────────────────────── */
function _clipBubbles() {
  if (!_cbCanvas || !_sec) return;

  const vh         = window.innerHeight;
  const sectionTop = _sec.getBoundingClientRect().top;

  if (sectionTop >= vh) {
    /* Section entirely below viewport — show full canvas */
    _cbCanvas.style.clipPath = '';
    _cbCanvas.style.opacity  = '1';
    return;
  }

  if (sectionTop <= 0) {
    /* Section has scrolled past — hide canvas entirely */
    _cbCanvas.style.clipPath = 'inset(100% 0 0 0)';
    return;
  }

  /* Section is entering from the bottom.
     Clip: hide the bottom (vh − sectionTop) px of the canvas,
     keeping only the portion above the dark-section boundary. */
  const clipBottom = Math.round(vh - sectionTop);
  _cbCanvas.style.clipPath = `inset(0 0 ${clipBottom}px 0)`;
  _cbCanvas.style.opacity  = '1';
}

/* ─────────────────────────────────────────────────────────
   Init
───────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────
   Enter Game 按钮 — 淡出后跳转到 page2.html
───────────────────────────────────────────────────────── */
function _initEnterGame() {
  const btn     = document.getElementById('btn-enter-game2');
  const overlay = document.getElementById('page-fade-overlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    /* 先淡黑 */
    overlay.classList.add('fading');
    /* 等动画结束（0.7s）再跳转 */
    setTimeout(() => {
      window.location.href = 'page2.html';
    }, 700);
  });
}

function initDarkPrologue() {
  if (!_sec) return;

  _initStars();
  _initCloudHover();
  _initEnterGame();

  /* Observe text lines */
  _lines.forEach(l => _revealIO.observe(l));

  /* Observe moon */
  if (_moon) _moonIO.observe(_moon);

  /* Observe section */
  if (_sectionIO) _sectionIO.observe(_sec);

  /* Bubble clip: run on every scroll + initial call */
  _clipBubbles();
  window.addEventListener('scroll', _clipBubbles, { passive: true });

  window.addEventListener('resize', () => {
    _initStars();
    _clipBubbles();
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkPrologue);
} else {
  initDarkPrologue();
}
