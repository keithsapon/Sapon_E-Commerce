/* ==========================================================
   ShopEase — App Data
   Each product has an id, name, price, an emoji "thumb" (used
   instead of image files so the project stays self-contained),
   and a background tint for its thumbnail.
   ========================================================== */
const PRODUCTS = [
  { id: "p1", name: "Organic Avocados (3pc)", price: 149, thumb: "🥑", tint: "#E4F8EE" },
  { id: "p2", name: "Free-Range Eggs (12pc)", price: 189, thumb: "🥚", tint: "#FDF3DF" },
  { id: "p3", name: "Sourdough Bread Loaf",   price: 165, thumb: "🍞", tint: "#F3E7D8" },
  { id: "p4", name: "Cold-Pressed Orange Juice", price: 120, thumb: "🍊", tint: "#FDEAD8" },
  { id: "p5", name: "Rolled Oats 1kg",        price: 175, thumb: "🌾", tint: "#F1EEE0" },
  { id: "p6", name: "Cherry Tomatoes 500g",   price: 95,  thumb: "🍅", tint: "#FBE3E1" },
];

const CATEGORIES = [
  { name: "Fresh Produce", icon: "🥦", tint: "#E4F8EE", desc: "Fruits and vegetables sourced from local farms, delivered within 24 hours of harvest." },
  { name: "Bakery",        icon: "🥐", tint: "#F3E7D8", desc: "Bread, pastries, and baked goods made fresh every morning." },
  { name: "Dairy & Eggs",  icon: "🧀", tint: "#FDF3DF", desc: "Milk, cheese, and eggs from trusted, ethically-raised sources." },
  { name: "Beverages",     icon: "🧃", tint: "#FDEAD8", desc: "Juices, plant-based milks, and cold-pressed drinks." },
];

const WISHLIST = [
  { id: "w1", name: "Stainless Steel Tumbler", price: 249, thumb: "🧋", tint: "#E4F8EE", desc: "Keeps drinks cold for up to 12 hours." },
  { id: "w2", name: "Reusable Produce Bags (5pc)", price: 99, thumb: "🛍️", tint: "#F1EEE0", desc: "Mesh bags for a plastic-free grocery run." },
  { id: "w3", name: "Bamboo Cutting Board", price: 320, thumb: "🪵", tint: "#F3E7D8", desc: "Durable board made from sustainable bamboo." },
];

// Cart starts with one sample item so the page has content on load,
// then grows as the user clicks "Add to Cart" around the site.
let cart = [ { id: "p1", qty: 2 } ];

/* ==========================================================
   NAVIGATION — switch visible section + active menu state
   ========================================================== */
const menuLinks = document.querySelectorAll(".menu");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("page-title");

function goToPage(target){
  pages.forEach(p => p.classList.toggle("active-page", p.id === target));
  menuLinks.forEach(m => m.classList.toggle("active", m.dataset.target === target));

  const activeLink = document.querySelector(`.menu[data-target="${target}"]`);
  if (activeLink) pageTitle.textContent = activeLink.querySelector("span:not(.badge)").textContent.trim();

  window.scrollTo({ top: 0, behavior: "smooth" });

  // On small screens, close the sidebar after choosing a page
  if (window.innerWidth <= 720) sidebar.classList.remove("mobile-open");
}

menuLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    if (link.id === "logout-link") return; // handled separately with a confirmation
    goToPage(link.dataset.target);
  });
});

// Cart icon in the top bar also jumps to the Cart page
document.querySelector(".cart-pill").addEventListener("click", () => goToPage("cart"));

/* ==========================================================
   SIDEBAR COLLAPSE + MOBILE HAMBURGER
   ========================================================== */
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
const hamburger = document.getElementById("hamburger");

toggleBtn.addEventListener("click", () => sidebar.classList.toggle("collapsed"));
hamburger.addEventListener("click", () => sidebar.classList.toggle("mobile-open"));

/* ==========================================================
   DARK MODE TOGGLE
   ========================================================== */
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
});

/* ==========================================================
   TOAST NOTIFICATION
   ========================================================== */
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ==========================================================
   RENDER: PRODUCT CARDS (Products page + Home featured)
   ========================================================== */
function productCard(product){
  return `
    <div class="card">
      <div class="card-thumb" style="background:${product.tint}">${product.thumb}</div>
      <p class="card-name">${product.name}</p>
      <p class="card-price">₱${product.price.toFixed(2)}</p>
      <button class="btn btn-primary btn-sm" data-add="${product.id}">Add to Cart</button>
    </div>`;
}

document.getElementById("product-grid").innerHTML = PRODUCTS.map(productCard).join("");
document.getElementById("home-featured").innerHTML = PRODUCTS.slice(0, 3).map(productCard).join("");

/* ==========================================================
   RENDER: CATEGORY CARDS
   ========================================================== */
document.getElementById("category-grid").innerHTML = CATEGORIES.map(cat => `
  <div class="card">
    <div class="cat-icon" style="background:${cat.tint}">${cat.icon}</div>
    <p class="card-name">${cat.name}</p>
    <p class="card-desc">${cat.desc}</p>
  </div>
`).join("");

/* ==========================================================
   RENDER: WISHLIST CARDS
   ========================================================== */
function renderWishlist(){
  const grid = document.getElementById("wishlist-grid");
  if (WISHLIST.length === 0){
    grid.innerHTML = `<p class="cart-empty">Your wishlist is empty.</p>`;
    return;
  }
  grid.innerHTML = WISHLIST.map(item => `
    <div class="card">
      <div class="card-thumb" style="background:${item.tint}">${item.thumb}</div>
      <p class="card-name">${item.name}</p>
      <p class="card-desc">${item.desc}</p>
      <p class="card-price">₱${item.price.toFixed(2)}</p>
      <button class="btn btn-outline btn-sm" data-move="${item.id}">Move to Cart</button>
    </div>
  `).join("");
}
renderWishlist();

/* ==========================================================
   CART LOGIC
   ========================================================== */
function findProduct(id){
  return PRODUCTS.find(p => p.id === id) || WISHLIST.find(w => w.id === id);
}

function cartCount(){
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

function renderCart(){
  const container = document.getElementById("cart-items");

  if (cart.length === 0){
    container.innerHTML = `<p class="cart-empty">Your cart is empty. Head to Products to add something!</p>`;
  } else {
    container.innerHTML = cart.map(line => {
      const p = findProduct(line.id);
      const lineTotal = p.price * line.qty;
      return `
        <div class="cart-row">
          <div class="cart-thumb" style="background:${p.tint}">${p.thumb}</div>
          <div class="cart-info">
            <p class="name">${p.name}</p>
            <p class="unit">₱${p.price.toFixed(2)} each</p>
          </div>
          <div class="qty-control">
            <button data-qty="minus" data-id="${line.id}">−</button>
            <span>${line.qty}</span>
            <button data-qty="plus" data-id="${line.id}">+</button>
          </div>
          <div class="cart-line-total">₱${lineTotal.toFixed(2)}</div>
          <button class="remove-btn" data-remove="${line.id}" title="Remove item">✕</button>
        </div>`;
    }).join("");
  }

  const subtotal = cart.reduce((sum, line) => sum + findProduct(line.id).price * line.qty, 0);
  const delivery = subtotal > 0 ? 50 : 0;

  document.getElementById("cart-subtotal").textContent = `₱${subtotal.toFixed(2)}`;
  document.getElementById("cart-delivery").textContent = `₱${delivery.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `₱${(subtotal + delivery).toFixed(2)}`;
  document.getElementById("checkout-btn").disabled = cart.length === 0;

  const count = cartCount();
  document.getElementById("cart-badge").textContent = count;
  document.getElementById("cart-pill-count").textContent = count;
}

function addToCart(id){
  const existing = cart.find(line => line.id === id);
  if (existing){
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  renderCart();
  showToast(`${findProduct(id).name} added to cart`);
}

// Event delegation: handles Add to Cart buttons on Home + Products
document.addEventListener("click", e => {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn){
    addToCart(addBtn.dataset.add);
    return;
  }

  const moveBtn = e.target.closest("[data-move]");
  if (moveBtn){
    addToCart(moveBtn.dataset.move);
    return;
  }

  const qtyBtn = e.target.closest("[data-qty]");
  if (qtyBtn){
    const line = cart.find(l => l.id === qtyBtn.dataset.id);
    if (!line) return;
    if (qtyBtn.dataset.qty === "plus") line.qty += 1;
    else line.qty -= 1;
    if (line.qty <= 0) cart = cart.filter(l => l.id !== line.id);
    renderCart();
    return;
  }

  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn){
    cart = cart.filter(l => l.id !== removeBtn.dataset.remove);
    renderCart();
    return;
  }
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return;
  showToast("Order placed! Check My Orders for status.");
  cart = [];
  renderCart();
});

renderCart();

/* ==========================================================
   LOGOUT — confirm, then land on the Logout page
   ========================================================== */
document.getElementById("logout-link").addEventListener("click", e => {
  e.preventDefault();
  goToPage("logout");
});

document.getElementById("logout-btn").addEventListener("click", () => {
  const confirmed = confirm("Are you sure you want to log out of ShopEase?");
  if (confirmed){
    showToast("You have successfully logged out!");
  }
});
