(function () {
  const KEY = 'cmrc_lang';

  function getLangFromPath(pathname) {
    return pathname.startsWith('/es/') ? 'es' : 'en';
  }

  function preferredLang() {
    const saved = (function(){
      try { return localStorage.getItem(KEY); } catch(e) { return null; }
    })();
    if (saved === 'en' || saved === 'es') return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('es') ? 'es' : 'en';
  }

  function normalizePath(targetLang) {
    const path = location.pathname;
    const base = path === '/' ? '/index.html' : path;

    if (targetLang === 'es') {
      if (base.startsWith('/es/')) return base;
      if (base === '/index.html') return '/es/index.html';
      return '/es' + base;
    }

    // English
    if (!base.startsWith('/es/')) return base;
    const p = base.replace(/^\/es/, '');
    return p === '' ? '/index.html' : p;
  }

  // Auto redirect on first visit based on preference
  try {
    const current = getLangFromPath(location.pathname);
    const pref = preferredLang();

    // If no saved pref but browser is Spanish, set it once
    try {
      if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, pref);
    } catch(e) {}

    if (pref !== current) {
      const target = normalizePath(pref);
      if (target !== location.pathname) location.replace(target + location.hash);
    }
  } catch (e) {}

  // Hook language links (also works even if href already points correctly)
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a[data-lang]');
    if (!a) return;
    const lang = a.getAttribute('data-lang');
    if (lang !== 'en' && lang !== 'es') return;

    try { localStorage.setItem(KEY, lang); } catch (err) {}

    const target = normalizePath(lang);
    if (target && target !== location.pathname) {
      e.preventDefault();
      location.href = target + location.hash;
    }
  });
})();
