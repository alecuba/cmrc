(async function () {
  const mount = document.getElementById('dpc-plans');
  if (!mount) return;

  const isES = location.pathname.startsWith('/es/');
  const url = isES ? '/data/dpc.es.json' : '/data/dpc.en.json';

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    const plansHtml = (data.plans || [])
      .map(
        (p) => `
        <div class="box">
          <h3>${escapeHtml(p.name)} <span style="font-weight:400;color:#777;">${escapeHtml(p.price)}</span></h3>
          <ul>
            ${(p.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
        </div>`
      )
      .join('');

    mount.innerHTML = `
      <header class="major">
        <h2>${escapeHtml(data.headline || '')}</h2>
        <p>${escapeHtml(data.subheadline || '')}</p>
      </header>
      <div class="row gtr-200">
        ${(data.plans || []).map(() => '<div class="col-4 col-12-narrower"></div>').join('')}
      </div>
      <div class="row gtr-200" style="margin-top:0;">
        ${(data.plans || [])
          .map((p) => `
          <section class="col-4 col-12-narrower">
            <div class="box highlight">
              <h3>${escapeHtml(p.name)}</h3>
              <p style="margin-top:-6px;color:#0a6; font-weight:700;">${escapeHtml(p.price)}</p>
              <ul style="text-align:left; margin: 0 auto; max-width: 520px;">
                ${(p.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          </section>`)
          .join('')}
      </div>
      <ul class="actions" style="justify-content:center; margin-top: 24px;">
        <li><a href="${data.cta_href || '#contact'}" class="button">${escapeHtml(data.cta_label || 'Learn more')}</a></li>
      </ul>
    `;
  } catch (e) {
    mount.innerHTML = '';
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
