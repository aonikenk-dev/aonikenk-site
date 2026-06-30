// Theme switch — light / dark
const STORAGE_KEY = 'aonikenk-theme';

export function getStoredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function initTheme() {
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.classList.toggle('is-light', theme === 'light');
    });

    localStorage.setItem(STORAGE_KEY, theme);
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  });

  setTheme(getStoredTheme());
}
