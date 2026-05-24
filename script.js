/* ============================================================
   ASH — Portfolio Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------- DOM refs --------------------
  const navbar       = document.getElementById('navbar');
  const menuToggle   = document.getElementById('menu-toggle');
  const navLinks     = document.getElementById('nav-links');
  const navAnchors   = document.querySelectorAll('.nav-link');
  const sections     = document.querySelectorAll('.section');
  const reveals      = document.querySelectorAll('.reveal');
  const heroOrbs     = document.querySelectorAll('.hero-orb');
  const ctaBtn       = document.getElementById('cta-btn');

  // -------------------- Smooth Scroll --------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile menu if open
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  });

  // -------------------- Mobile Menu --------------------
  function closeMobileMenu() {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    navLinks.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Close on click outside
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // -------------------- Navbar Scroll State --------------------
  let lastScroll = 0;

  function updateNavbar() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    lastScroll = y;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // -------------------- Active Nav Link Highlighting --------------------
  function updateActiveLink() {
    const scrollY = window.scrollY + window.innerHeight / 3;

    let currentSection = '';

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navAnchors.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // -------------------- Intersection Observer — Reveals --------------------
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Respect per-element animation-delay set via inline style
            const delay = entry.target.style.animationDelay || '0s';
            const delayMs = parseFloat(delay) * 1000;

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delayMs);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    reveals.forEach(el => el.classList.add('visible'));
  }

  // -------------------- Parallax Orb on Mouse Move --------------------
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      heroOrbs.forEach((orb, i) => {
        const factor = (i + 1) * 15;
        orb.style.transform = `translate(
          calc(-50% + ${x * factor}px),
          calc(-50% + ${y * factor}px)
        )`;
      });
    });
  }

  // -------------------- Staggered Card Reveal Enhancement --------------------
  // Add a subtle scale to demo cards on reveal
  const cards = document.querySelectorAll('.demo-card');
  cards.forEach(card => {
    card.addEventListener('transitionend', () => {
      // Once revealed, remove the transform override so hover still works
      if (card.classList.contains('visible')) {
        card.style.willChange = 'auto';
      }
    });
  });
});
