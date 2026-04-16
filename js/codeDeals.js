// stars

const STAR_PATH = 'M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z';

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

// getCart

function getCart() {
  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];
  return JSON.parse(data);
}
