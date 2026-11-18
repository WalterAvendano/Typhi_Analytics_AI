// Typhi Analytics AI — Landing Page Logic
// Adaptado a la identidad cuantitativa y datos de PostgreSQL

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navegación Móvil
  const menuBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.hasAttribute('hidden');
      if (isHidden) {
        mobileNav.removeAttribute('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.textContent = '✕';
      } else {
        mobileNav.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
      }
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
      });
    });
  }

  // 2. Desplazamiento Suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 3. Formulario VIP (Formsubmit AJAX)
  const vipForm = document.getElementById('vip-form');
  const formOk = document.getElementById('form-ok');

  if (vipForm) {
    vipForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = vipForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando solicitud...';

      try {
        const response = await fetch(vipForm.action, {
          method: 'POST',
          body: new FormData(vipForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          vipForm.style.display = 'none';
          if (formOk) formOk.style.display = 'block';
        } else {
          alert('Hubo un inconveniente al enviar tu solicitud. Intenta nuevamente o únete al Canal de WhatsApp.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (err) {
        // En entorno local (file://) fetch a formsubmit suele lanzar CORS error aunque se envie
        vipForm.style.display = 'none';
        if (formOk) formOk.style.display = 'block';
      }
    });
  }

  // 4. Inyección de Datos Reales (window.TYPHI_DATA)
  const data = window.TYPHI_DATA;
  if (!data) {
    console.warn('Typhi Data: No se encontró window.TYPHI_DATA.');
    return;
  }

  // Utilidades de formato
  const formatFecha = (str) => {
    if (!str) return 'Próxima jornada';
    const partes = str.split('-');
    if (partes.length === 3) {
      const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const dia = parseInt(partes[2], 10);
      const mes = meses[parseInt(partes[1], 10) - 1];
      return `${dia} ${mes}`;
    }
    return str;
  };

  const formatHora = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // 4.1 Hero Panel: Jugada #1
  const proxima = data.proxima || {};
  const jugadas = proxima.jugadas || [];

  if (jugadas.length > 0) {
    const p1 = jugadas[0];
    const heroFecha = document.getElementById('hero-fecha');
    const heroLiga = document.getElementById('hero-liga');
    const heroPartido = document.getElementById('hero-partido');
    const heroGoles = document.getElementById('hero-goles');
    const heroTipo = document.getElementById('hero-tipo');
    const heroProb = document.getElementById('hero-prob');
    const heroJugada = document.getElementById('hero-jugada');

    if (heroFecha) heroFecha.textContent = `Próxima jornada · ${formatFecha(proxima.fecha)}`;
    if (heroLiga) heroLiga.textContent = `${p1.liga}${p1.kickoff ? ' · ' + formatHora(p1.kickoff) : ''}`;
    if (heroPartido) heroPartido.textContent = p1.partido;
    if (heroGoles) {
      heroGoles.textContent = (p1.xg_local !== null && p1.xg_visita !== null) 
        ? `${p1.xg_local} - ${p1.xg_visita}` 
        : '—';
    }
    if (heroTipo) heroTipo.textContent = p1.tipo;
    if (heroProb) heroProb.textContent = p1.probabilidad ? `${p1.probabilidad}% estimado` : '—';
    if (heroJugada) heroJugada.textContent = p1.jugada;
  }

  // 4.2 Estadísticas Auditadas
  const est = data.estadisticas || {};
  const global = est.global || {};
  const porTipo = est.por_tipo || {};
  const porLiga = est.por_liga || [];

  const stPct = document.getElementById('st-pct');
  const stPctSub = document.getElementById('st-pct-sub');
  const stFijo = document.getElementById('st-fijo');
  const stFijoSub = document.getElementById('st-fijo-sub');
  const stBaja = document.getElementById('st-baja');
  const stBajaSub = document.getElementById('st-baja-sub');
  const statsNote = document.getElementById('stats-note');
  const leagueStrip = document.getElementById('league-strip');

  if (stPct) stPct.textContent = global.pct !== undefined ? `${global.pct}%` : '—';
  if (stPctSub) stPctSub.textContent = global.jugadas ? `${global.aciertos} aciertos en ${global.jugadas} jugadas` : '—';

  const fijos = porTipo['Fijo'];
  if (stFijo && fijos) stFijo.textContent = `${fijos.pct}%`;
  if (stFijoSub && fijos) stFijoSub.textContent = `${fijos.aciertos} de ${fijos.jugadas} cobrados`;

  const bajas = porTipo['Baja'];
  if (stBaja && bajas) stBaja.textContent = `${bajas.pct}%`;
  if (stBajaSub && bajas) stBajaSub.textContent = `${bajas.aciertos} de ${bajas.jugadas} cobradas`;

  if (statsNote && est.desde) {
    statsNote.textContent = `Auditoría congelada antes de cada partido desde el ${est.desde}. 1 sola jugada por partido según jerarquía fija.`;
  }

  if (leagueStrip && Array.isArray(porLiga)) {
    leagueStrip.innerHTML = porLiga
      .map((l) => `<span class="league-chip">${escapeHtml(l.liga)} <b>${l.pct}%</b> (${l.aciertos}/${l.jugadas})</span>`)
      .join('');
  }

  // 4.3 Sección Jugadas del Día (Pick Grid)
  const pickGrid = document.getElementById('pick-grid');
  const picksEyebrow = document.getElementById('picks-eyebrow');
  const comboBar = document.getElementById('combo-bar');
  const comboText = document.getElementById('combo-text');

  if (picksEyebrow && proxima.fecha) {
    picksEyebrow.textContent = `Jornada del ${formatFecha(proxima.fecha)}`;
  }

  if (pickGrid) {
    if (jugadas.length === 0) {
      pickGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>No hay jugadas calculadas para las próximas 24 horas.</p>
          <p>Únete a nuestro canal oficial para recibir los picks apenas se publiquen.</p>
        </div>
      `;
    } else {
      pickGrid.innerHTML = jugadas
        .map((p, idx) => {
          const isTrio = p.rol && p.rol.toLowerCase().includes('trío');
          const hora = formatHora(p.kickoff);
          const xgTxt = (p.xg_local !== null && p.xg_visita !== null) 
            ? `${p.xg_local} vs ${p.xg_visita}` 
            : '—';
          return `
            <article class="pick-card">
              <span class="section-label ${isTrio ? 'trio' : ''}">${escapeHtml(p.rol)}</span>
              <div class="league">${escapeHtml(p.liga)}${hora ? ' · ' + hora : ''}</div>
              <h3>${escapeHtml(p.partido)}</h3>
              <div class="pick-play">
                <small>Jugada recomendada (${escapeHtml(p.tipo)})</small>
                <strong>${escapeHtml(p.jugada)}</strong>
              </div>
              <div class="pick-meta">
                <div>
                  <small>Goles xG proyectados</small>
                  <strong>${xgTxt}</strong>
                </div>
                <div style="text-align: right;">
                  <small>Probabilidad</small>
                  <strong class="prob">${p.probabilidad ? p.probabilidad + '%' : '—'}</strong>
                </div>
              </div>
            </article>
          `;
        })
        .join('');
    }
  }

  // 4.4 Combo Bar
  if (comboBar && comboText) {
    if (proxima.prob_dos_fijos || proxima.prob_trio) {
      comboBar.removeAttribute('hidden');
      const partesCombo = [];
      if (proxima.prob_dos_fijos) partesCombo.push(`Los 2 Más Fijos: ${proxima.prob_dos_fijos}%`);
      if (proxima.prob_trio) partesCombo.push(`Trío de Oro: ${proxima.prob_trio}%`);
      comboText.textContent = partesCombo.join('  ·  ');
    } else {
      comboBar.setAttribute('hidden', '');
    }
  }

  // 4.5 Tabla de Auditoría Pública
  const auditBody = document.getElementById('audit-body');
  const auditoria = data.auditoria || [];

  if (auditBody) {
    if (auditoria.length === 0) {
      auditBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Sin registros de auditoría aún.</td></tr>';
    } else {
      auditBody.innerHTML = auditoria
        .map((r) => {
          const esWin = r.resultado === 'WIN';
          const badgeClass = esWin ? 'verified' : 'failed';
          const badgeText = esWin ? '✓ COBRADA' : '✗ FALLADA';
          return `
            <tr>
              <td>${escapeHtml(r.fecha)}</td>
              <td>${escapeHtml(r.liga)}</td>
              <td><strong>${escapeHtml(r.partido)}</strong></td>
              <td>${escapeHtml(r.jugada)}</td>
              <td><strong>${escapeHtml(r.marcador || '—')}</strong></td>
              <td><span class="${badgeClass}">${badgeText}</span></td>
            </tr>
          `;
        })
        .join('');
    }
  }

  // 4.6 Sincronización en el Footer
  const footerUpdate = document.getElementById('footer-update');
  if (footerUpdate && data.generado) {
    footerUpdate.textContent = `Última sincronización de datos con PostgreSQL: ${data.generado}.`;
  }
});
