let allProducts = [];
let currentImageIndex = 0;

const STAR_PATH = 'M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z';

const CART_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2 2H4L6.7 14.4C6.9 15.4 7.8 16 8.8 16H18.6C19.6 16 20.4 15.3 20.6 14.4L22 7H5"></path>
  </svg>`;

function renderStars(rating, id) {
  const full  = `<svg class="star-svg" viewBox="0 0 24 24"><path d="${STAR_PATH}" fill="#facc15" stroke="#facc15" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const empty = `<svg class="star-svg" viewBox="0 0 24 24"><path d="${STAR_PATH}" fill="#d1d5db" stroke="#d1d5db" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;

  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += full;
    } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
      const gid = `hg-${id}-${i}`;
      html += `<svg class="star-svg" viewBox="0 0 24 24">
        <defs><linearGradient id="${gid}">
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="50%" stop-color="#d1d5db"/>
        </linearGradient></defs>
        <path d="${STAR_PATH}" fill="url(#${gid})" stroke-width="0"/>
      </svg>`;
    } else {
      html += empty;
    }
  }
  return html;
}

//Breadcrumb
function renderBreadcrumb(product) {
  document.getElementById('breadcrumb').innerHTML = `
    <a href="index.html">Products</a>
    <span class="sep">›</span>
    <a href="index.html">${product.subtitle}</a>
    <span class="sep">›</span>
    <span class="current">${product.name}</span>
  `;
}

//Product detail
function renderProduct(product, discount = 0) {
  const specsEntries = Object.entries(product.specs || {});
  const highlightEntries = specsEntries.slice(0, 3);
  const reviews = product.reviews || ((product.id * 137) % 400 + 50); //от 50 до 449

  document.getElementById('productDetail').innerHTML = `
    <div class="product-detail-grid">
      <!-- Gallery -->
      <div class="gallery">
        <div class="gallery-main">
          <img src="${product.images[0]}" alt="${product.name}" id="mainImage">
          ${product.images.length > 1 ? `
          <button class="gallery-arrow gallery-prev" id="galleryPrev" aria-label="Previous image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="gallery-arrow gallery-next" id="galleryNext" aria-label="Next image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>` : ''}
        </div>
        <div class="gallery-thumbs" id="galleryThumbs">
          ${product.images.map((img, i) => `
            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
              <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Info -->
      <div class="product-info">
        <h1 class="product-title">${product.name}</h1>
        <div class="product-rating-row">
          <div class="rating-stars-row">
            <div class="stars">${renderStars(product.rating, product.id)}</div>
            <span class="rating-num">(${product.rating})</span>
          </div>
          <span class="reviews-count">Based on ${reviews} reviews</span>
        </div>

        <div class="product-price-row">
          ${discount > 0 ? `
          <div class="product-price-discount-group">
            <span class="product-price product-price--sale">$${(product.price * (1 - discount / 100)).toFixed(2)}</span>
            <span class="product-price--original">$${product.price.toFixed(2)}</span>
            <span class="product-price--badge">-${discount}%</span>
          </div>` : `
          <span class="product-price">$${product.price.toFixed(2)}</span>`}
          <span class="free-shipping">Free shipping</span>
        </div>

        ${highlightEntries.length > 0 ? `
        <div class="highlights-box">
          <h3>Key Highlights</h3>
          <ul class="highlights-list">
            ${highlightEntries.map(([f, s]) => `<li><strong>${f}:</strong> ${s}</li>`).join('')}
          </ul>
        </div>` : ''}

        <div class="product-description">
          <h3>Description</h3>
          <p>${product.description}</p>
        </div>

        <div class="quantity-section">
          <p class="quantity-label">Quantity</p>
          <div class="quantity-control">
            <button class="qty-btn" id="qtyMinus">−</button>
            <span class="qty-value" id="qtyValue">1</span>
            <button class="qty-btn" id="qtyPlus">+</button>
          </div>
        </div>

        <button class="add-to-cart-btn" id="addToCartBtn">
          ${CART_SVG} Add to Cart
        </button>

        ${specsEntries.length > 0 ? `
        <div class="specs-accordion">
          <button class="specs-toggle" id="specsToggle">
            Technical Specifications
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="specs-body" id="specsBody">
            ${specsEntries.map(([f, s]) => `
              <div class="specs-row">
                <span class="specs-key">${f}</span>
                <span class="specs-val">${s}</span>
              </div>`).join('')}
          </div>
        </div>` : ''}
      </div>
    </div>
  `;

  initGallery(product);
  initQuantity(product);

  // Accordion toggle
  const specsToggle = document.getElementById('specsToggle');
  const specsBody = document.getElementById('specsBody');
  if (specsToggle) {
    specsToggle.addEventListener('click', () => {
      const isOpen = specsBody.classList.toggle('open');
      specsToggle.classList.toggle('open', isOpen);
    });
  }
}

//Gallery
function initGallery(product) {
  currentImageIndex = 0;
  const mainImg = document.getElementById('mainImage');
  const thumbs  = document.querySelectorAll('.gallery-thumb');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  function setImage(index) {
    if (index === currentImageIndex) return;
    currentImageIndex = index;
    mainImg.classList.add('fade-out');
    setTimeout(() => {
      mainImg.src = product.images[index];
      mainImg.classList.remove('fade-out');
    }, 180);
    thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => setImage(parseInt(thumb.dataset.index)));
  });

  if (prevBtn) prevBtn.addEventListener('click', () => setImage((currentImageIndex - 1 + product.images.length) % product.images.length));
  if (nextBtn) nextBtn.addEventListener('click', () => setImage((currentImageIndex + 1) % product.images.length));
}

//Quantity & Add to cart
function initQuantity(product) {
  let qty = 1;
  const qtyValueEl = document.getElementById('qtyValue');
  const btn = document.getElementById('addToCartBtn');

  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (qty > 1) { qty--; qtyValueEl.textContent = qty; }
  });

  document.getElementById('qtyPlus').addEventListener('click', () => {
    qty++;
    qtyValueEl.textContent = qty;
  });

  btn.addEventListener('click', () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    // btn.textContent = 'Added to cart!';
    // setTimeout(() => { btn.innerHTML = `${CART_SVG} Add to Cart`; }, 1500);
    //было бы логичнее
  });
}

//Related products
function renderRelated(product) {
  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  if (related.length === 0) return;

  document.getElementById('relatedSection').hidden = false;
  document.getElementById('relatedGrid').innerHTML = related.map(p => `
    <a href="product.html?id=${p.id}" class="related-card">
      <div class="related-card-img">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      </div>
      <div class="related-card-info">
        <p class="related-card-name">${p.name}</p>
        <div class="related-card-rating">
          <div class="stars">${renderStars(p.rating, p.id)}</div>
          <span class="related-card-rating-val">(${p.rating})</span>
        </div>
        <div class="related-card-meta">
          <p class="related-card-price">$${p.price.toFixed(2)}</p>
          <span class="related-card-category">${p.category.toUpperCase()}</span>
        </div>
      </div>
    </a>
  `).join('');
}

//Init
async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const discount = parseInt(params.get('discount')) || 0;

  const res = await fetch('./data/products.json');
  allProducts = await res.json();

  const product = allProducts.find(p => p.id === id);

  if (!product) {
    document.getElementById('productDetail').innerHTML = '<p class="product-loading">Product not found.</p>';
    return;
  }

  document.title = `${product.name} — TechStore`;
  renderBreadcrumb(product);
  renderProduct(product, discount);
  renderRelated(product);
  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', init);
