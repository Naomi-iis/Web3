async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(path);
  el.innerHTML = await res.text();
}

loadComponent('header', './components/header.tpl');
loadComponent('footer', './components/footer.tpl');
