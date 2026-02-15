/* ================================================
   Actor | DJ - Main JavaScript
   ================================================ */

(function () {
  'use strict';

  /* --- MODE TOGGLE --- */
  const body = document.body;
  const toggle = document.querySelector('.mode-toggle');
  const voiceLabel = document.querySelector('.toggle-label--voice');
  const djLabel = document.querySelector('.toggle-label--dj');

  /* --- HERO IMAGE CAROUSEL --- */
  let currentSlide = 0;
  let autoplayTimer = null;

  // Cache DOM references BEFORE setMode can be called
  const actorCarousel = document.querySelector('.hero-carousel--actor');
  const actorImages = actorCarousel ? Array.from(actorCarousel.querySelectorAll('.hero-img')) : [];
  const dotsContainer = document.querySelector('.hero-dots--actor');
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.hero-dot')) : [];

  function showSlide(index) {
    // Update images
    actorImages.forEach(function (img, i) {
      img.style.opacity = (i === index) ? '1' : '0';
    });
    // Update dots
    dots.forEach(function (dot, i) {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    currentSlide = index;
  }

  function nextSlide() {
    if (body.classList.contains('dj-mode')) return;
    if (actorImages.length <= 1) return;
    var next = (currentSlide + 1) % actorImages.length;
    showSlide(next);
  }

  function startAutoplay() {
    stopAutoplay();
    if (body.classList.contains('dj-mode')) return;
    if (actorImages.length <= 1) return;
    autoplayTimer = setInterval(nextSlide, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function updateHeroImages() {
    currentSlide = 0;
    showSlide(0);
  }

  function updateToggleLabels() {
    const isDj = body.classList.contains('dj-mode');
    voiceLabel?.classList.toggle('active', !isDj);
    djLabel?.classList.toggle('active', isDj);
  }

  function setMode(mode) {
    if (mode === 'dj') {
      body.classList.add('dj-mode');
    } else {
      body.classList.remove('dj-mode');
    }
    updateToggleLabels();
    updateHeroImages();
    startAutoplay();
    localStorage.setItem('mode', mode);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDj = body.classList.contains('dj-mode');
      setMode(isDj ? 'actor' : 'dj');
    });
  }

  // Load mode: URL parameter takes priority, then localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const urlMode = urlParams.get('mode');
  const saved = localStorage.getItem('mode');

  // Support old 'ark'/'abraham' values from localStorage
  const normalizeMode = (m) => m === 'ark' ? 'dj' : m === 'abraham' ? 'actor' : m;

  if (urlMode === 'dj' || urlMode === 'actor' || urlMode === 'ark' || urlMode === 'abraham') {
    setMode(normalizeMode(urlMode));
  } else if (saved) {
    setMode(normalizeMode(saved));
  } else {
    updateToggleLabels();
  }

  // Dot click handlers
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showSlide(i);
      startAutoplay(); // reset timer
    });
  });

  // Initialize
  updateHeroImages();
  startAutoplay();

  /* --- NAV SCROLL EFFECT --- */
  const nav = document.querySelector('.site-nav');

  function onScroll() {
    if (window.scrollY > 10) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- MOBILE NAV --- */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* --- SCROLL REVEAL --- */
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));

  /* --- SMOOTH SCROLL --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --- FORM HANDLING --- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Sent!';
      btn.style.background = '#2ECC71';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 2500);
    });
  }
})();
