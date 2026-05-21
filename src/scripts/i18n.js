// Language switch — ES / EN
export function initLang() {
  const STORAGE_KEY = 'aonikenk-lang';

  function setLang(lang) {
    document.body.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.toggle === lang);
    });

    // update placeholder text on inputs/textareas
    document.querySelectorAll(`[data-ph-${lang}]`).forEach(el => {
      el.placeholder = el.getAttribute(`data-ph-${lang}`);
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.toggle));
  });

  // init from storage or browser preference
  const saved  = localStorage.getItem(STORAGE_KEY);
  const auto   = navigator.language.startsWith('en') ? 'en' : 'es';
  setLang(saved || auto);
}
