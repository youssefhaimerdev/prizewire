/* ═══════════════════════════════════════════════════════
   PRIZEWIRE — app.js
   Fetches /data/payouts.json and renders all dynamic UI.
   To update the site: edit payouts.json, push to GitHub.
   ═══════════════════════════════════════════════════════ */

(async function () {

  // ── Fetch data ────────────────────────────────────────────
  let data;
  try {
    const res = await fetch('/data/payouts.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.warn('PrizeWire: Could not load payouts.json — showing static fallback.', e);
    return; // Graceful degradation: HTML static fallback content stays visible
  }

  // ── Helpers ───────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  const SPORT_COLORS = {
    NFL: '#003F8A', NBA: '#C9082A', PGA: '#006837', F1: '#E8002D',
    Tennis: '#4A7C59', UFC: '#D4002A', Boxing: '#7B2FBE',
    MLB: '#002D72', NHL: '#000099', MMA: '#D4002A'
  };

  function sportColor(sport) {
    return SPORT_COLORS[sport] || '#556080';
  }

  function statusClass(status) {
    const map = {
      'LIVE':        'status-badge--live',
      'IN PLAYOFFS': 'status-badge--live',
      'LATEST':      'status-badge--latest',
      'SEASON':      'status-badge--season',
      'FINAL':       'status-badge--final',
      'COMPLETED':   'status-badge--final',
    };
    return map[status] || 'status-badge--final';
  }

  function badgeClass(change) {
    if (!change) return 'final';
    const c = change.toUpperCase();
    if (c === 'LIVE') return 'live';
    if (c === 'LATEST') return 'latest';
    if (c === 'SEASON') return 'season';
    return 'final';
  }

  // ── 1. TICKER ─────────────────────────────────────────────
  function renderTicker() {
    const track = $('ticker-track');
    if (!track || !data.ticker?.length) return;

    // Duplicate array for seamless CSS loop
    const items = [...data.ticker, ...data.ticker];
    track.innerHTML = items.map(t => `
      <span class="ticker-item">
        <span class="ticker-item__event">${t.label}</span>
        <span class="ticker-item__value">${t.value}</span>
        ${t.change ? `<span class="ticker-item__badge ticker-item__badge--${badgeClass(t.change)}">${t.change}</span>` : ''}
      </span>
    `).join('');
  }

  // ── 2. HERO FEATURED CARD ─────────────────────────────────
  function renderHeroCard() {
    const el = $('hero-featured-card');
    if (!el || !data.featured?.length) return;
    const f = data.featured[0];

    el.innerHTML = `
      <div class="hero-card__tag">LATEST PAYOUT DATA</div>
      <div class="hero-card__label">FEATURED EVENT</div>
      <div class="hero-card__event">${f.event}</div>
      <div class="hero-card__venue">${f.venue}</div>
      <div class="hero-card__purse-label">TOTAL PURSE</div>
      <div class="hero-card__purse">${f.totalPurse}</div>
      <div class="hero-card__winner-label">WINNER PAYOUT</div>
      <div class="hero-card__winner">${f.winnerPayout}</div>
      <a href="/articles/${f.slug}" class="hero-card__link">Full Breakdown →</a>
    `;
  }

  // ── 3. PAYOUT CARDS GRID ──────────────────────────────────
  function renderCards() {
    const grid = $('cards-grid');
    if (!grid || !data.featured?.length) return;

    grid.innerHTML = data.featured.map(card => `
      <a href="/articles/${card.slug}" class="payout-card">
        <div class="card-top">
          <span class="sport-badge" style="background:${sportColor(card.sport)}">${card.sport}</span>
          <span class="status-badge ${statusClass(card.status)}">${card.status}</span>
        </div>
        <div class="card-event">${card.event}</div>
        <div class="card-venue">${card.venue} &middot; ${card.date}</div>
        <div class="card-divider"></div>
        <div class="card-purse-label">WINNER / TOP PAYOUT</div>
        <div class="card-winner-payout">${card.winnerPayout}</div>
        <div class="card-total-purse">Total Purse: ${card.totalPurse}</div>
        <ul class="card-breakdown">
          ${card.breakdown.map(b => `
            <li>
              <span class="breakdown-place">${b.place}</span>
              ${b.pct && b.pct !== '—' ? `<span class="breakdown-pct">${b.pct}</span>` : ''}
              <span class="breakdown-amount">${b.amount}</span>
            </li>
          `).join('')}
        </ul>
        <div class="card-footer">
          <span class="card-cta">Full Breakdown →</span>
          <span class="card-date">${card.date}</span>
        </div>
      </a>
    `).join('');
  }

  // ── 4. LEADERBOARD TABLE ──────────────────────────────────
  function rankClass(rank) {
    if (rank === 1) return 'lb-rank lb-rank--gold';
    if (rank === 2) return 'lb-rank lb-rank--silver';
    if (rank === 3) return 'lb-rank lb-rank--bronze';
    return 'lb-rank';
  }

  function renderLeaderboard() {
    const tbody = $('leaderboard-body');
    if (!tbody || !data.leaderboard?.length) return;

    tbody.innerHTML = data.leaderboard.map(row => `
      <tr>
        <td class="${rankClass(row.rank)}">${row.rank}</td>
        <td class="lb-event">
          <a href="/articles/${row.slug}">${row.event}</a>
        </td>
        <td class="lb-sport">
          <span class="sport-badge" style="background:${sportColor(row.sport)}">${row.sport}</span>
        </td>
        <td class="lb-year">${row.year}</td>
        <td class="lb-purse">${row.totalPurse}</td>
      </tr>
    `).join('');
  }

  // ── 5. ARTICLES GRID ──────────────────────────────────────
  function renderArticles() {
    const grid = $('articles-grid');
    if (!grid || !data.articles?.length) return;

    grid.innerHTML = data.articles.map(a => `
      <a href="/articles/${a.slug}" class="article-card">
        <div class="article-meta">
          <span class="sport-badge" style="background:${a.sportColor || sportColor(a.sport)}">${a.sport}</span>
          <span class="article-date">${a.date}</span>
        </div>
        <div class="article-title">${a.title}</div>
        <div class="article-excerpt">${a.excerpt}</div>
        <div class="article-footer">
          <span>${a.readTime} read</span>
          <span class="article-read-more">Read More →</span>
        </div>
      </a>
    `).join('');
  }

  // ── 6. LAST UPDATED BADGE ────────────────────────────────
  function renderMeta() {
    const el = $('last-updated');
    if (el && data.meta?.lastUpdated) {
      el.textContent = `Updated ${data.meta.lastUpdated}`;
    }
  }

  // ── 7. SPORT TABS ─────────────────────────────────────────
  function initSportTabs() {
    const tabs   = $$('.sport-tab');
    const panels = $$('.sport-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        const target = document.querySelector(`.sport-panel[data-sport="${tab.dataset.sport}"]`);
        if (target) target.classList.add('active');
      });
    });
  }

  // ── 8. HEADER NAV FILTER (homepage) ──────────────────────
  function initSportNavFilter() {
    const navItems = $$('.sport-nav-item');
    const cardsGrid = $('cards-grid');
    if (!cardsGrid) return;

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(n => n.removeAttribute('data-active'));
        item.setAttribute('data-active', 'true');

        const sport = item.dataset.sport;
        $$('.payout-card').forEach(card => {
          const badge = card.querySelector('.sport-badge');
          if (!sport || sport === 'ALL') {
            card.style.display = '';
          } else {
            card.style.display = (badge && badge.textContent.trim() === sport) ? '' : 'none';
          }
        });
      });
    });
  }

  // ── 9. HEADER SEARCH DROPDOWN ────────────────────────────
  async function initHeaderSearch() {
    const form     = document.querySelector('.header-search__form');
    const input    = document.querySelector('.header-search__input');
    const dropdown = document.querySelector('.search-dropdown');
    if (!form || !input || !dropdown) return;

    const SPORT_COLORS = {
      NFL:'#003F8A', NBA:'#C9082A', PGA:'#006837', F1:'#E8002D',
      Tennis:'#4A7C59', UFC:'#D4002A', Boxing:'#7B2FBE', MLB:'#002D72', NHL:'#000099'
    };

    // Load athletes
    let athletes = [];
    try {
      const res = await fetch('/data/athletes.json');
      const d   = await res.json();
      athletes  = d.athletes || [];
    } catch(e) {}

    function sportColor(sport) {
      return SPORT_COLORS[sport] || '#556080';
    }

    function showDropdown(query) {
      const q = query.trim().toLowerCase();
      dropdown.classList.add('visible');

      if (!q || q.length < 2) {
        dropdown.innerHTML = `<div class="search-dropdown__empty">Type an athlete name or sport...</div>`;
        return;
      }

      const matchAthletes = athletes.filter(a =>
        a.name.toLowerCase().includes(q) ||
        (a.team || '').toLowerCase().includes(q) ||
        a.sport.toLowerCase().includes(q)
      ).slice(0, 4);

      const matchEvents = (data?.featured || []).filter(e =>
        e.event.toLowerCase().includes(q) ||
        e.sport.toLowerCase().includes(q)
      ).slice(0, 3);

      const total = matchAthletes.length + matchEvents.length;

      if (total === 0) {
        dropdown.innerHTML = `<div class="search-dropdown__empty">No results for "<strong style="color:var(--text)">${query}</strong>"</div>
          <a href="/search?q=${encodeURIComponent(query)}" class="search-dropdown__footer">Search all data →</a>`;
        return;
      }

      let html = '';

      if (matchAthletes.length) {
        html += `<div class="search-dropdown__section-label">Athletes</div>`;
        matchAthletes.forEach(a => {
          const latest = a.payouts?.[0];
          html += `
            <a href="/search?q=${encodeURIComponent(a.name)}" class="search-dropdown__item">
              <span class="sport-badge" style="background:${sportColor(a.sport)};font-size:9px;padding:2px 6px">${a.sport}</span>
              <div class="search-dropdown__item-info">
                <div class="search-dropdown__item-name">${a.name}</div>
                <div class="search-dropdown__item-sub">${a.team || a.nationality || ''}</div>
              </div>
              ${latest ? `<div class="search-dropdown__item-value">${latest.payout}</div>` : ''}
            </a>`;
        });
      }

      if (matchEvents.length) {
        html += `<div class="search-dropdown__section-label">Events</div>`;
        matchEvents.forEach(e => {
          html += `
            <a href="/articles/${e.slug}" class="search-dropdown__item">
              <span class="sport-badge" style="background:${e.sportColor || sportColor(e.sport)};font-size:9px;padding:2px 6px">${e.sport}</span>
              <div class="search-dropdown__item-info">
                <div class="search-dropdown__item-name">${e.event}</div>
                <div class="search-dropdown__item-sub">${e.date}</div>
              </div>
              <div class="search-dropdown__item-value">${e.totalPurse}</div>
            </a>`;
        });
      }

      html += `<a href="/search?q=${encodeURIComponent(query)}" class="search-dropdown__footer">
        <span>See all results for "${query}"</span>
        <span>→</span>
      </a>`;

      dropdown.innerHTML = html;
    }

    function hideDropdown() {
      dropdown.classList.remove('visible');
    }

    // Debounced input handler
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => showDropdown(input.value), 220);
    });

    input.addEventListener('focus', () => {
      if (input.value.length >= 2) showDropdown(input.value);
    });

    // Navigate on Enter
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
      }
      if (e.key === 'Escape') hideDropdown();
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!form.contains(e.target) && !dropdown.contains(e.target)) hideDropdown();
    });

    // Keyboard shortcut: / to focus search
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        input.focus();
      }
    });
  }

  // ── 10. NEWSLETTER — Formspree ───────────────────────────
  // SETUP: Go to formspree.io → New Form → copy your endpoint
  // Replace FORMSPREE_ENDPOINT below with your form URL
  // e.g. 'https://formspree.io/f/xabcdefg'
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_YOUR_ID';

  function initNewsletter() {
    const btn   = document.querySelector('.btn-gold');
    const input = document.querySelector('.newsletter-input');
    if (!btn || !input) return;

    btn.addEventListener('click', async () => {
      const val = input.value.trim();
      if (!val || !val.includes('@')) {
        input.style.borderColor = 'var(--red)';
        input.focus();
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
      }

      btn.textContent = 'SENDING...';
      btn.disabled = true;
      input.disabled = true;

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: val, source: 'prizewire-homepage' })
        });

        if (res.ok) {
          btn.textContent = 'SUBSCRIBED ✓';
          btn.style.background = 'var(--green)';
          btn.style.color = '#000';
          input.value = '';
        } else {
          throw new Error('Form error');
        }
      } catch {
        btn.textContent = 'TRY AGAIN';
        btn.disabled = false;
        input.disabled = false;
        btn.style.background = 'var(--red)';
        setTimeout(() => {
          btn.textContent = 'SUBSCRIBE';
          btn.style.background = '';
        }, 3000);
      }
    });

    // Enter key support
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn.click();
    });
  }

  // ── INIT ──────────────────────────────────────────────────
  renderTicker();
  renderHeroCard();
  renderCards();
  renderLeaderboard();
  renderArticles();
  renderMeta();
  initSportTabs();
  initSportNavFilter();
  initHeaderSearch();
  initNewsletter();

})();
