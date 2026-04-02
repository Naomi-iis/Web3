const CART_KEY = 'techstore_cart';

function getCart() {
  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  const cart = getCart();
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].qty;
  }
  return total;
}

function addToCart(product) {
  const cart = getCart();
  let found = null;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) {
      found = cart[i];
      break;
    }
  }

  if (found) {
    found.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;

  const count = getCartCount();
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.classList.add('visible');
  } else {
    badge.classList.remove('visible');
  }
}
