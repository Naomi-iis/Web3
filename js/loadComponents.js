async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(path);
  el.innerHTML = await res.text();
}

async function initComponents() {
  await loadComponent('header', './components/header.tpl');
  if (typeof updateCartBadge === 'function') updateCartBadge();
  if (typeof initMobileMenu === 'function') initMobileMenu();
  loadComponent('footer', './components/footer.tpl');
}
initComponents();
