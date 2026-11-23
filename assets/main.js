// CryptoPwd — sito vetrina. Solo effetti grafici: nessun cookie, nessuna raccolta di dati.
document.documentElement.classList.remove('no-js');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header: bordo quando si scorre
const header = document.querySelector('.header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });
}

// Comparsa al passaggio
const items = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
}

// Bagliore che segue il puntatore sulle schede
document.querySelectorAll('.tile').forEach((t) => {
  t.addEventListener('pointermove', (e) => {
    const r = t.getBoundingClientRect();
    t.style.setProperty('--mx', `${e.clientX - r.left}px`);
    t.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Dimostrazione: un testo cifrato che cambia a ogni "salvataggio" (dati casuali, solo grafica)
const b64 = (n) => {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return btoa(String.fromCharCode(...bytes));
};
const hex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0')).join('');
const ivEl = document.getElementById('demo-iv');
const ctEl = document.getElementById('demo-ct');
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function scramble(el, target, ms = 700) {
  if (reduce) { el.textContent = target; return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / ms);
    const fixed = Math.floor(target.length * p);
    let out = target.slice(0, fixed);
    for (let i = fixed; i < target.length; i++) out += CHARS[(Math.random() * CHARS.length) | 0];
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

if (ivEl && ctEl) {
  const tick = () => { scramble(ivEl, hex(12)); scramble(ctEl, b64(66), 1100); };
  tick();
  if (!reduce) setInterval(tick, 3600);
}

// Anno nel piè di pagina
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
