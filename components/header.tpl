<div class="container">
  <div class="header-inner">
    <!--logo-->
    <a href="index.html" class="logo">
      <div class="logo-icon">T</div>
      <span class="logo-text">TechStore</span>
    </a>
    <!--navi-->
    <nav class="main-nav">
      <a href="index.html">Products</a>
      <a href="categories.html">Categories</a>
      <a href="deals.html">Deals</a>
      <a href="about.html">About</a>
    </nav>
    <!--search and cart-->
    <!-- lupa -->
    <div class="header-actions">
      <button class="icon-btn" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21L16.7 16.7"></path>
        </svg>
      </button>
    <!-- cart -->
      <a href="cart.html" class="icon-btn cart-btn" aria-label="Shopping cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2 2H4L6.7 14.4C6.9 15.4 7.8 16 8.8 16H18.6C19.6 16 20.4 15.3 20.6 14.4L22 7H5"></path>
        </svg>
        <span class="cart-badge" id="cartBadge"></span>
      </a>
      <!--menu for mobil-->
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</div>

<!--mobile nav drawer-->
<div class="mobile-nav" id="mobileNav" aria-hidden="true">
  <nav class="mobile-nav-links">
    <a href="index.html">Products</a>
    <a href="categories.html">Categories</a>
    <a href="deals.html">Deals</a>
    <a href="about.html">About</a>
  </nav>
</div>
