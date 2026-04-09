let allProducts = [];
let activeRatings = [];// выбранные оценки, тип 3 и 4
let minPrice = 0;
let maxPrice = 3000;

// звёзды
function renderStars(rating, id) {
  const d = 'M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z';
  const full  = `<svg class="star-svg" viewBox="0 0 24 24"><path d="${d}"
  fill="#facc15" stroke="#facc15" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const empty = `<svg class="star-svg" viewBox="0 0 24 24"><path d="${d}"
  fill="#d1d5db" stroke="#d1d5db" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += full;
    } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
      const gid = `hg-${id}-${i}`;
      html +=`<svg class="star-svg" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="${gid}">
                    <stop offset="50%" stop-color="#facc15"/>
                    <stop offset="50%" stop-color="#d1d5db"/>
                  </linearGradient>
                </defs>
                <path d="${d}" fill="url(#${gid})" stroke-width="0"/>
              </svg>`;
    } else {
      html += empty;
    }
  }
  return html;
}

// карточка
function renderCard(product) {
  return `
    <a href="product.html?id=${product.id}" class="product-card">
      <div class="product-image">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <div class="stars">${renderStars(product.rating)}</div>
          <span class="rating-value">(${product.rating})</span>
        </div>
        <div class="product-meta">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <span class="product-category">${product.category}</span>
        </div>
      </div>
    </a>
  `;
}

// фильтр
function getFilteredProducts() {
  const result = [];

  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    // фильтр цена
    if (p.price < minPrice || p.price > maxPrice) continue;
    // фильтр рейтинг
    if (activeRatings.length > 0) {
      let passRating = false;
      for (let j = 0; j < activeRatings.length; j++) {
        if (p.rating >= activeRatings[j]) {
          passRating = true;
          break;
        }
      }
      if (!passRating) continue;
    }
    result.push(p);
  }
  return result;
}

// сорт
function getSortedProducts(products) {
  const val = document.getElementById('sortSelect').value;
  const sorted = products.slice(); // копия массива, не меняем оригинал, плохо

  if (val === 'name-az') {
    sorted.sort(function(a, b) { return a.name.localeCompare(b.name); });
  } else if (val === 'name-za') {
    sorted.sort(function(a, b) { return b.name.localeCompare(a.name); });
  } else if (val === 'price-asc') {
    sorted.sort(function(a, b) { return a.price - b.price; });
  } else if (val === 'price-desc') {
    sorted.sort(function(a, b) { return b.price - a.price; });
  } else {
    sorted.sort(function(a, b) { return a.name.localeCompare(b.name); });
  }
  return sorted;
}

// отрисовка карт-тов-ов
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productsCount');

  const filtered = getFilteredProducts();
  const sorted = getSortedProducts(filtered);

  countEl.textContent = sorted.length + ' product' + (sorted.length !== 1 ? 's' : '');

  if (sorted.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <p class="no-results-title">No products found</p>
        <p class="no-results-sub">Try adjusting your filters</p>
      </div>
    `;
    return;
  }

  let html = '';
  for (let i = 0; i < sorted.length; i++) {
    html += renderCard(sorted[i]);
  }
  grid.innerHTML = html;
}

// двойной рэндж
function initSlider() {
  const minRange = document.getElementById('minRange');
  const maxRange = document.getElementById('maxRange');
  const rangeActive = document.getElementById('rangeActive');
  const minLabel = document.getElementById('minPrice');
  const maxLabel = document.getElementById('maxPrice');
  const MIN_GAP = 50;
  const MAX_VAL = window.PRICE_MAX;

  minRange.max = MAX_VAL;
  maxRange.max = MAX_VAL;
  maxRange.value = MAX_VAL;
  maxPrice = MAX_VAL;

  const mobMin = document.getElementById('mob-minRange');
  const mobMax = document.getElementById('mob-maxRange');
  if (mobMin) mobMin.max = MAX_VAL;
  if (mobMax) { mobMax.max = MAX_VAL; mobMax.value = MAX_VAL; }

  function updateSlider(e) {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);

    if (maxVal - minVal < MIN_GAP) {
      if (e && e.target === minRange) {
        minRange.value = maxVal - MIN_GAP;
      } else {
        maxRange.value = minVal + MIN_GAP;
      }
      minVal = parseInt(minRange.value);
      maxVal = parseInt(maxRange.value);
    }

    const minPct = (minVal / MAX_VAL) * 100;
    const maxPct = (maxVal / MAX_VAL) * 100;

    rangeActive.style.left  = minPct + '%';
    rangeActive.style.width = (maxPct - minPct) + '%';

    minLabel.textContent = '$' + minVal;
    maxLabel.textContent = '$' + maxVal;

    minPrice = minVal;
    maxPrice = maxVal;
    renderProducts();
  }

  minRange.addEventListener('input', updateSlider);
  maxRange.addEventListener('input', updateSlider);
  updateSlider(null);
}

// чекбоксы
function initRatingFilters() {
  const checkboxes = document.querySelectorAll('.rating-checkbox');

  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
      const val = parseFloat(this.value);

      if (this.checked) {
        activeRatings.push(val);
      } else {
        const idx = activeRatings.indexOf(val);
        if (idx !== -1) activeRatings.splice(idx, 1);
      }

      renderProducts();
    });
  }
}

// сортировка
function initSort() {
  document.getElementById('sortSelect').addEventListener('change', renderProducts);
}

// сброс фильт
function initClearFilters() {
  document.getElementById('clearFilters').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.rating-checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    activeRatings = [];

    const MAX_VAL = window.PRICE_MAX;
    document.getElementById('minRange').value = 0;
    document.getElementById('maxRange').value = MAX_VAL;
    minPrice = 0;
    maxPrice = MAX_VAL;

    document.getElementById('rangeActive').style.left  = '0%';
    document.getElementById('rangeActive').style.width = '100%';
    document.getElementById('minPrice').textContent = '$0';
    document.getElementById('maxPrice').textContent = '$' + MAX_VAL;

    renderProducts();
  });
}

// пуск
async function init() {
  const res = await fetch('./data/products.json');
  allProducts = await res.json();

  const prices = allProducts.map(function(p) { return p.price; });
  window.PRICE_MAX = Math.max.apply(null, prices) + 50;
  maxPrice = window.PRICE_MAX;

  initSlider();
  initRatingFilters();
  initSort();
  initClearFilters();
  renderProducts();
}

document.addEventListener('DOMContentLoaded', init);
