(async function () {
  const mount = document.getElementById('dpc-plans');
  if (!mount) return;

  const isES = location.pathname.startsWith('/es/');
  const url = isES ? '/data/dpc.es.json' : '/data/dpc.en.json';

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    const headline = escapeHtml(data.headline || (isES ? 'Planes de Direct Primary Care' : 'Direct Primary Care Plans'));
    const subheadline = escapeHtml(data.subheadline || (isES ? 'Membresías claras, simples y accesibles.' : 'Clear, simple membership pricing with real access.'));

    const plans = (data.plans || []).map((p) => {
      const name = escapeHtml(p.name || 'Plan');
      const price = escapeHtml(p.price || '');
      const bullets = (p.bullets || []).map((b) => `<li><span class="cmrc-check">✓</span><span>${escapeHtml(b)}</span></li>`).join('');

      return `
        <article class="cmrc-plan">
          <div class="cmrc-planTop">
            <div class="cmrc-tag"><span class="cmrc-dot"></span>${name}</div>
            <div class="cmrc-price">${price}</div>
          </div>
          <ul class="cmrc-ul">${bullets}</ul>
        </article>
      `;
    }).join('');

    const ctaHref = data.cta_href || '#contact';
    const ctaLabel = escapeHtml(data.cta_label || (isES ? 'Conocer más' : 'Learn more'));

    mount.innerHTML = `
      <div class="cmrc-dpc">
        <div class="cmrc-secHead">
          <h2>${headline}</h2>
          <p>${subheadline}</p>
        </div>

        <div class="cmrc-plans">${plans}</div>

        <div class="cmrc-cta">
          <a class="button cmrc-primary" href="${escapeAttr(ctaHref)}">${ctaLabel}</a>
        </div>

        <div class="cmrc-micro">
          ${escapeHtml(data.disclaimer || (isES
            ? 'Las membresías no reemplazan el seguro. Recomendamos mantener cobertura para emergencias y especialistas.'
            : 'Memberships do not replace insurance. Keep coverage for emergency and specialty care.'))}
        </div>
      </div>
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

  function escapeAttr(str) {
    return escapeHtml(str).replaceAll('`', '');
  }
})();
