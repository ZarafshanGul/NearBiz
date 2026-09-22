/* ============================================================
   THEME (dark mode) — toggle + persistence
   The initial theme is set by an inline script in <head> on every
   page (before CSS paints) to avoid a flash of the wrong theme.
   This file only wires up the toggle button once the DOM is ready.
   ============================================================ */

$(function () {
  const $toggle = $('#themeToggle');

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ld-theme', theme);
    $toggle.attr('aria-pressed', theme === 'dark');
  }

  $toggle.on('click', function () {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // Sync toggle state on load (theme itself already applied inline in <head>)
  applyTheme(currentTheme());
});
