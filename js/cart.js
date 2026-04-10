const TAX_RATE = 0.08;
const PROMO_CODES = { SAVE10: 0.10 };
let discount = 0;

const fmt = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const REMOVE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
  <path d="M10 11v6"></path><path d="M14 11v6"></path>
  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
</svg>`;

function renderSummary(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = subtotal * discount;
  const tax = (subtotal - discountAmt) * TAX_RATE;

  document.getElementById('summarySubtotal').textContent = fmt(subtotal);
  document.getElementById('summaryTax').textContent = fmt(tax);
  document.getElementById('summaryTotal').textContent = fmt(subtotal - discountAmt + tax);

  const row = document.getElementById('discountRow');
  row.style.display = discount > 0 ? 'flex' : 'none';
  if (discount > 0) document.getElementById('summaryDiscount').textContent = '-' + fmt(discountAmt);
}

function renderItems() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  if (!container) return;

  const sidebar = document.querySelector('.cart-sidebar');
  const title = document.querySelector('.cart-title');

  if (!cart.length) {
    if (sidebar) sidebar.style.display = 'none';
    if (title) title.style.display = 'none';
    container.style.gridColumn = '1 / -1';
    container.innerHTML = `
      <div class="cart-empty">
        <h2 class="cart-empty-title">Your Cart is Empty</h2>
        <p class="cart-empty-sub">Add some amazing products to get started!</p>
        <a href="index.html" class="cart-empty-btn">Continue Shopping</a>
      </div>
    `;
    return;
  }

  if (sidebar) sidebar.style.display = '';
  if (title) title.style.display = '';
  container.style.gridColumn = '';

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div class="cart-item-content">
        <div class="cart-item-row-top">
          <span class="cart-item-name">${item.name}</span>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove">${REMOVE_SVG}</button>
        </div>
        <div class="cart-item-category">${item.category || ''}</div>
        <div class="cart-item-row-bottom">
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
          <div class="cart-item-price">
            <div class="cart-item-total">${fmt(item.price * item.qty)}</div>
            <div class="cart-item-unit">${fmt(item.price)} each</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  renderSummary(cart);
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateCartBadge();
  renderItems();
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
  updateCartBadge();
  renderItems();
}

function initCartPage() {
  if (!document.getElementById('cartItems')) return;

  renderItems();

  document.getElementById('cartItems').addEventListener('click', e => {
    const action = e.target.closest('[data-action]');
    const remove = e.target.closest('.cart-item-remove');

    if (action) changeQty(Number(action.dataset.id), action.dataset.action === 'inc' ? 1 : -1);
    if (remove) removeItem(Number(remove.dataset.id));
  });

  const promoBtn = document.getElementById('promoBtn');
  promoBtn.addEventListener('click', () => {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const hint = document.getElementById('promoHint');
    const valid = PROMO_CODES[code] !== undefined;

    if (valid) {
      discount = PROMO_CODES[code];
      document.getElementById('discountLabel').textContent = `Discount (${code})`;
      hint.textContent = 'Promo code applied successfully!';
      hint.className = 'promo-hint success';
      promoBtn.style.opacity = '0.5';
      promoBtn.disabled = true;
    } else {
      discount = 0;
      hint.textContent = 'Invalid promo code.';
      hint.className = 'promo-hint error';
    }
    renderSummary(getCart());
  });
}

document.addEventListener('DOMContentLoaded', initCartPage);