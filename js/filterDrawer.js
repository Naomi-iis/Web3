document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('filterDrawer');
  const overlay = document.getElementById('filterOverlay');
  const openBtn = document.querySelector('.filter-btn-mobile');
  const closeBtn = document.getElementById('filterDrawerClose');
  const mobMinRange = document.getElementById('mob-minRange');
  const mobMaxRange = document.getElementById('mob-maxRange');

  function openDrawer() {
    syncDrawerFromSidebar();
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  window.addEventListener('resize', () => { if (drawer.classList.contains('open')) closeDrawer(); });

  function syncCheckboxes(fromSel, toIdFn, dispatch = false) {
    document.querySelectorAll(fromSel).forEach(cb => {
      const target = document.getElementById(toIdFn(cb.value));
      if (!target) return;
      if (dispatch && target.checked !== cb.checked) {
        target.checked = cb.checked;
        target.dispatchEvent(new Event('change'));
      } else {
        cb.checked = target.checked;
      }
    });
  }

  function syncDrawerFromSidebar() {
    syncCheckboxes('.mob-rating-checkbox', v => 'rating-' + v);

    const minRange = document.getElementById('minRange');
    const maxRange = document.getElementById('maxRange');
    const mobMin   = document.getElementById('mob-minRange');
    const mobMax   = document.getElementById('mob-maxRange');
    if (minRange && mobMin) mobMin.value = minRange.value;
    if (maxRange && mobMax) mobMax.value = maxRange.value;

    updateMobSliderUI(null);
  }

  function syncSidebarFromDrawer() {
    syncCheckboxes('.mob-rating-checkbox', v => 'rating-' + v, true);
  }

  function updateMobSliderUI(e) {
    const active   = document.getElementById('mob-rangeActive');
    const minLabel = document.getElementById('mob-minPrice');
    const maxLabel = document.getElementById('mob-maxPrice');
    const MIN_GAP  = 50;
    const MAX_VAL  = window.PRICE_MAX || 3000;

    let minVal = parseInt(mobMinRange.value);
    let maxVal = parseInt(mobMaxRange.value);

    if (maxVal - minVal < MIN_GAP) {
      if (e?.target === mobMinRange) mobMinRange.value = maxVal - MIN_GAP;
      else mobMaxRange.value = minVal + MIN_GAP;
      minVal = parseInt(mobMinRange.value);
      maxVal = parseInt(mobMaxRange.value);
    }

    active.style.left  = (minVal / MAX_VAL * 100) + '%';
    active.style.width = ((maxVal - minVal) / MAX_VAL * 100) + '%';
    minLabel.textContent = '$' + minVal;
    maxLabel.textContent = '$' + maxVal;
  }

  document.querySelectorAll('.mob-rating-checkbox')
    .forEach(cb => cb.addEventListener('change', syncSidebarFromDrawer));

  function onMobSliderChange(e) {
    updateMobSliderUI(e);
    const minRange = document.getElementById('minRange');
    const maxRange = document.getElementById('maxRange');
    minRange.value = mobMinRange.value;
    maxRange.value = mobMaxRange.value;
    minRange.dispatchEvent(new Event('input'));
  }

  mobMinRange.addEventListener('input', onMobSliderChange);
  mobMaxRange.addEventListener('input', onMobSliderChange);

  document.getElementById('mobClearFilters').addEventListener('click', () => {
    document.getElementById('clearFilters').click();
    document.querySelectorAll('.mob-rating-checkbox').forEach(cb => cb.checked = false);
    mobMinRange.value = 0;
    mobMaxRange.value = window.PRICE_MAX || 3000;
    updateMobSliderUI(null);
  });

  updateMobSliderUI(null);
});
