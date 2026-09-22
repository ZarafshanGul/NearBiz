/* ============================================================
   HOME PAGE — stat counters + featured businesses preview
   ============================================================ */

$(function () {

  /* ---------------- Stat counters ---------------- */
  function animateCount($el, target, duration) {
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      $el.text(value.toLocaleString());
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        $el.text(target.toLocaleString());
      }
    }
    requestAnimationFrame(tick);
  }

  let statsAnimated = false;
  function triggerStatsAnimation() {
    if (statsAnimated) return;
    statsAnimated = true;
    $('.stat-num').each(function () {
      const target = Number($(this).attr('data-target')) || 0;
      animateCount($(this), target, 1000);
    });
  }

  function loadStats() {
    $.ajax({ url: API.stats, method: 'GET', dataType: 'json', timeout: 45000 })
      .done(function (data) {
        $('#statBusinesses').attr('data-target', data.total || 0);
        $('#statCities').attr('data-target', data.cities || 0);
        $('#statCategories').attr('data-target', data.categories || 0);

        // If the stats section is already visible, animate right away
        const el = document.getElementById('statBusinesses');
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) triggerStatsAnimation();
      })
      .fail(function () {
        $('#statBusinesses, #statCities, #statCategories').text('—');
      });
  }
  loadStats();

  // Trigger the count-up once the stats block scrolls into view
  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerStatsAnimation();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  } else {
    triggerStatsAnimation();
  }

  /* ---------------- Featured businesses ---------------- */
  const $grid = $('#featuredGrid');
  const $banner = $('#featuredBanner');
  let bannerTimer = setTimeout(() => $banner.addClass('is-shown'), 1200);

  function isLocalDevelopment() {
    return window.location.protocol === 'file:'
      || window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';
  }

  function renderFeaturedCard(biz) {
    const catClass = LD.categoryClass(biz.category);
    const website = LD.formatWebsite(biz.website);
    return `
      <div class="biz-card reveal is-visible" data-id="${biz._id || ''}">
        <div class="biz-card-top">
          <span class="biz-badge ${catClass}">${LD.escapeHtml(biz.category)}</span>
        </div>
        <div class="biz-name">${LD.escapeHtml(biz.businessName)}</div>
        <p class="biz-tagline">${LD.escapeHtml(biz.tagline || '')}</p>
        <div class="biz-card-bottom">
          <span class="biz-city">📍 ${LD.escapeHtml(biz.city)}</span>
          ${website ? `<a href="${website}" target="_blank" rel="noopener" class="biz-link" onclick="event.stopPropagation()">Visit →</a>` : ''}
        </div>
      </div>`;
  }

  $.ajax({ url: API.businesses, method: 'GET', dataType: 'json', timeout: 45000 })
    .done(function (data) {
      clearTimeout(bannerTimer);
      $banner.removeClass('is-shown');
      const businesses = (Array.isArray(data) ? data : data.businesses || []).slice(0, 3);
      if (!businesses.length) {
        $grid.html(`
          <div class="state-block" style="grid-column:1/-1;">
            <div class="state-icon">🏬</div>
            <div class="state-title">No businesses yet</div>
            <p class="state-desc">Be the first to list a business in the directory.</p>
            <a href="/submit" class="btn-ld btn-ld-primary">Add Your Business</a>
          </div>`);
        return;
      }
      $grid.html(businesses.map(renderFeaturedCard).join(''));
    })
    .fail(function () {
      clearTimeout(bannerTimer);
      $banner.removeClass('is-shown');
      $grid.html(`
        <div class="state-block" style="grid-column:1/-1;">
          <div class="state-icon">⚠️</div>
          <div class="state-title">We could not load the directory</div>
          <p class="state-desc">${isLocalDevelopment() ? 'Start the Express API on port 3000, then try again.' : 'The directory API is unavailable. Please try again in a moment.'}</p>
          <button type="button" class="btn-ld btn-ld-outline" id="featuredRetryBtn">Try again</button>
        </div>`);
      $('#featuredRetryBtn').on('click', function () {
        window.location.reload();
      });
    });
});
