/* ============================================================
   DIRECTORY PAGE — search, category filter, card grid, modal
   ============================================================ */

$(function () {

  let allCache = {};      // keyed by business _id, used to populate the modal
  let activeCategory = '';
  let currentRequest = null;

  const $grid = $('#bizGrid');
  const $count = $('#resultsCount');
  const $banner = $('#loadBanner');
  const $search = $('#searchInput');
  const $pills = $('#filterPills .pill');

  /* ---------------- URL param support (?category=Food) ---------------- */
  const params = new URLSearchParams(window.location.search);
  const presetCategory = LD.normalizeCategory(params.get('category'));
  if (presetCategory) {
    activeCategory = presetCategory;
    $pills.removeClass('active');
    $pills.filter(`[data-category="${presetCategory}"]`).addClass('active');
  }

  /* ---------------- Skeleton loader ---------------- */
  function renderSkeletons() {
    let html = '';
    for (let i = 0; i < 6; i++) {
      html += `
        <div class="skeleton-card">
          <div class="sk-line" style="width:40%;"></div>
          <div class="sk-line" style="width:75%; height:20px; margin-top:14px;"></div>
          <div class="sk-line" style="width:90%;"></div>
          <div class="sk-line" style="width:60%;"></div>
        </div>`;
    }
    $grid.html(html);
  }

  /* ---------------- Card rendering ---------------- */
  function renderCard(biz) {
    const catClass = LD.categoryClass(biz.category);
    return `
      <div class="biz-card" data-id="${biz._id}" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="biz-card-top">
          <span class="biz-badge ${catClass}">${LD.escapeHtml(biz.category)}</span>
        </div>
        <div class="biz-name">${LD.escapeHtml(biz.businessName)}</div>
        <p class="biz-tagline">${LD.escapeHtml(biz.tagline || '')}</p>
        <div class="biz-card-bottom">
          <span class="biz-city">📍 ${LD.escapeHtml(biz.city)}</span>
          <span class="biz-link">Details →</span>
        </div>
      </div>`;
  }

  function renderEmptyState() {
    $grid.html(`
      <div class="state-block">
        <div class="state-icon">🔍</div>
        <div class="state-title">No businesses found</div>
        <p class="state-desc">Try another search term or category.</p>
        <button class="btn-ld btn-ld-outline" id="clearFiltersBtn">Clear filters</button>
      </div>`);
    $('#clearFiltersBtn').on('click', function () {
      $search.val('');
      activeCategory = '';
      $pills.removeClass('active');
      $pills.filter('[data-category=""]').addClass('active');
      fetchBusinesses();
    });
  }

  function renderErrorState() {
    const isUnconfigured = API_BASE_URL === window.location.origin && !isLocalhost();
    $grid.html(`
      <div class="state-block">
        <div class="state-icon">⚠️</div>
        <div class="state-title">We could not load the directory</div>
        <p class="state-desc">${isUnconfigured ? 'Connect the deployed API URL, then try again.' : 'Something went wrong reaching the API. Please try again.'}</p>
        <button class="btn-ld btn-ld-primary" id="retryBtn">Retry</button>
      </div>`);
    $('#retryBtn').on('click', fetchBusinesses);
  }

  function isLocalhost() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  /* ---------------- Fetch + render ---------------- */
  function fetchBusinesses() {
    renderSkeletons();
    $count.text('Loading businesses…');

    const bannerTimer = setTimeout(() => $banner.addClass('is-shown'), 1200);

    const query = $search.val().trim();
    const url = new URL(API.businesses);
    if (query) url.searchParams.set('q', query);
    if (activeCategory) url.searchParams.set('category', activeCategory);

    if (currentRequest) currentRequest.abort();

    currentRequest = $.ajax({ url: url.toString(), method: 'GET', dataType: 'json', timeout: 45000 })
      .done(function (data) {
        clearTimeout(bannerTimer);
        $banner.removeClass('is-shown');

        const businesses = Array.isArray(data) ? data : (data.businesses || []);
        allCache = {};
        businesses.forEach(b => { allCache[b._id] = b; });

        if (!businesses.length) {
          $count.text('0 businesses found');
          renderEmptyState();
          return;
        }

        $count.text(`${businesses.length} business${businesses.length === 1 ? '' : 'es'} found`);
        $grid.html(businesses.map(renderCard).join(''));
      })
      .fail(function (xhr) {
        clearTimeout(bannerTimer);
        $banner.removeClass('is-shown');
        if (xhr.statusText === 'abort') return;
        $count.text('');
        renderErrorState();
      });
  }

  /* ---------------- Search (jQuery keyup, debounced) ---------------- */
  const debouncedFetch = LD.debounce(fetchBusinesses, 350);
  $search.on('input keyup', debouncedFetch);

  /* ---------------- Category pills ---------------- */
  $pills.on('click', function () {
    $pills.removeClass('active');
    $(this).addClass('active');
    activeCategory = $(this).data('category') || '';
    fetchBusinesses();
  });

  /* ---------------- Modal ---------------- */
  const bizModalEl = document.getElementById('bizModal');
  const bizModal = new bootstrap.Modal(bizModalEl);

  function openModal(id) {
    const biz = allCache[id];
    if (!biz) return;

    $('#modalCategory').attr('class', `biz-badge ld-modal-badge ${LD.categoryClass(biz.category)}`).text(biz.category);
    $('#modalName').text(biz.businessName);
    $('#modalOwner').text(biz.ownerName ? `Owned by ${biz.ownerName}` : '');
    $('#modalTagline').text(biz.tagline || '');
    $('#modalCity').text(biz.city || '—');
    $('#modalEmail').html(biz.email ? `<a href="mailto:${biz.email}">${LD.escapeHtml(biz.email)}</a>` : '—');

    const site = LD.formatWebsite(biz.website);
    if (site) {
      $('#modalWebsiteWrap').show();
      $('#modalWebsite').html(`<a href="${site}" target="_blank" rel="noopener">${LD.escapeHtml(biz.website)}</a>`);
    } else {
      $('#modalWebsiteWrap').hide();
    }

    bizModal.show();
  }

  $grid.on('click', '.biz-card', function () {
    openModal($(this).data('id'));
  });
  $grid.on('keydown', '.biz-card', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal($(this).data('id'));
    }
  });

  /* ---------------- Init ---------------- */
  fetchBusinesses();
});
