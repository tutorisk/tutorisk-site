/* TutoRisk — main.js */
(function() {
  'use strict';

  /* ── Burger menu mobile ───────────────────────────────── */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('nav-mobile');
  if (burger && mobileNav) {
    burger.addEventListener('click', function() {
      const open = !mobileNav.hidden;
      mobileNav.hidden = open;
      burger.setAttribute('aria-expanded', String(!open));
      burger.classList.toggle('open', !open);
    });
  }

  /* ── Dropdown Nos activités ───────────────────────────── */
  const dropdown = document.getElementById('dropdown-activites');
  if (dropdown) {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu    = dropdown.querySelector('.nav-dropdown-menu');
    function openMenu()  { menu.classList.add('open');    trigger.setAttribute('aria-expanded','true');  }
    function closeMenu() { menu.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function(e) { if(e.key==='Escape') closeMenu(); });
  }

  /* ── Navbar scroll shadow ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,.12)'
        : '0 1px 12px rgba(0,0,0,.08)';
    }, { passive: true });
  }

  /* ── Counter animation (pour la bande de stats) ────────── */
  function animateCounter(el, target, duration) {
    var start = 0, startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          animateCounter(el, parseInt(el.dataset.count, 10), 1600);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(function(c) { observer.observe(c); });
  }
  initCounters();

  /* ── Smooth scroll pour les liens d'ancre ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Fade-in au scroll ────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var fadeItems = document.querySelectorAll('.fade-in');
    var fadeObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.style.opacity = '1'; fadeObs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    fadeItems.forEach(function(el) {
      el.style.opacity = '0';
      fadeObs.observe(el);
    });
  }

})();
