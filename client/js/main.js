/* ============================================================
   SHARED BEHAVIOR — navbar scroll state, mobile menu,
   scroll-reveal system, footer year, hero entrance trigger.
   ============================================================ */

$(function () {

  /* ---- Footer year ---- */
  $('#footerYear').text(new Date().getFullYear());

  /* ---- Navbar scroll state ---- */
  const $nav = $('.ld-nav');
  function updateNavState() {
    if ($(window).scrollTop() > 12) {
      $nav.addClass('is-scrolled');
    } else {
      $nav.removeClass('is-scrolled');
    }
  }
  updateNavState();
  $(window).on('scroll', updateNavState);

  /* ---- Lightweight scroll choreography ---- */
  let scrollFrame = null;
  function updateScrollMotion() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(function () {
      document.documentElement.style.setProperty('--scroll-shift', Math.min(window.scrollY * 0.12, 72));
      scrollFrame = null;
    });
  }
  updateScrollMotion();
  $(window).on('scroll', updateScrollMotion);

  /* ---- Mobile menu ---- */
  const $burger = $('#navBurger');
  const $panel = $('#mobilePanel');
  $burger.on('click', function () {
    $panel.toggleClass('is-open');
    $burger.attr('aria-expanded', $panel.hasClass('is-open'));
  });
  $panel.find('a').on('click', function () {
    $panel.removeClass('is-open');
  });

  /* ---- Hero entrance (respects prefers-reduced-motion) ---- */
  requestAnimationFrame(function () {
    document.body.classList.add('loaded');
  });

  /* ---- Scroll-reveal for sections below the fold ---- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }
});

/* ---- Small shared helpers used across pages ---- */
const LD = {
  CATEGORY_ICONS: {
    Food: '01',
    Fashion: '02',
    Tech: '03',
    Health: '04',
    Education: '05',
    Services: '06',
    Retail: '07',
    Other: '08'
  },
  categoryClass(category) {
    return 'b-' + String(category || 'other').toLowerCase();
  },
  escapeHtml(str) {
    return $('<div>').text(str == null ? '' : str).html();
  },
  formatWebsite(url) {
    if (!url) return null;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  },
  normalizeCategory(category) {
    return String(category || '').trim().toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
  },
  debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
};
