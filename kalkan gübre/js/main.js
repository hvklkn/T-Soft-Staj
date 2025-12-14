let products = [];
let currentList = [];
let cart = [];
// { id, name, price, img, qty }


/* ================= ÜRÜNLERİ YÜKLE ================= */
fetch("productData.json")
    .then(res => res.json())
    .then(data => {
        products = data;
        loadProducts();
    })
    .catch(err => console.error("Ürünler yüklenemedi:", err));

function loadProducts() {
    const productBox = document.getElementById("products");
    if (!productBox) return;

    productBox.innerHTML = "";

    products.forEach(p => {
        productBox.innerHTML += `
            <div class="card">
                <img src="${p.img}" alt="${p.name}">
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <p><strong>${p.price} ₺</strong></p>
                    <button onclick="addToCart(${p.id})">Sepete Ekle</button>
                </div>
            </div>
        `;
    });
}

/* ================= ARAMA ================= */
function searchProduct() {
    const value = document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    // 🔍 ARAMA BOŞSA → TÜM ÜRÜNLER
    if (value === "") {
        currentList = [...products];
        renderAll();
        return;
    }

    // 🔍 ARAMA VARSA
    currentList = products.filter(p =>
        p.name.toLowerCase().includes(value)
    );

    renderAll();
}


function renderAll() {
    const box = document.getElementById("products");
    const noResult = document.getElementById("noResult");
    const searchInput = document.getElementById("searchInput");

    box.innerHTML = "";

    const searchValue = searchInput.value.trim();

    // ❌ SADECE GERÇEK ARAMA + SONUÇ YOKSA GÖSTER
    if (currentList.length === 0 && searchValue !== "") {
        noResult.style.display = "block";
        return;
    }

    // ✅ NORMAL DURUM
    noResult.style.display = "none";
    currentList.forEach(p => renderProduct(p));
}


/* ================= SEPET ================= */
function addToCart(id) {
    if (cart[id]) {
        cart[id].qty++;
    } else {
        const product = products.find(p => p.id === id);
        cart[id] = {
            ...product,
            qty: 1
        };
    }
    updateCart();
}




function increaseQty(id, e) {
    if (e) e.stopPropagation();
    cart[id].qty++;
    updateCart();
}

function decreaseQty(id, e) {
    if (e) e.stopPropagation();

    if (cart[id].qty > 1) {
        cart[id].qty--;
    } else {
        delete cart[id];
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");
    const cartCount = document.getElementById("cart-count");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    Object.values(cart).forEach(item => {
        total += item.price * item.qty;
        count += item.qty;

        cartItems.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong>
                <div class="cart-controls">
                    <button onclick="decreaseQty(${item.id}, event)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="increaseQty(${item.id}, event)">+</button>
                </div>
                <span>${item.price * item.qty} ₺</span>
            </div>
        `;
    });

    totalPrice.innerText = total;
    cartCount.innerText = count;
}


function clearCart(e) {
    if (e) e.stopPropagation();
    cart = {};
    updateCart();
}


function toggleCart() {
    const cart = document.getElementById("cart");
    const overlay = document.getElementById("cartOverlay");

    cart.classList.toggle("show");
    overlay.style.display = cart.classList.contains("show")
        ? "block"
        : "none";
}

function closeCart() {
    document.getElementById("cart").classList.remove("show");
    document.getElementById("cartOverlay").style.display = "none";
}

document.getElementById("cart").addEventListener("click", e => {
    e.stopPropagation();
});


/* ================= MOBİL MENÜ ================= */
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.classList.toggle("show");
}

function sendOrder() {
    if (Object.keys(cart).length === 0) {
        alert("Sepetiniz boş!");
        return;
    }

    const now = new Date();
    const date = now.toLocaleDateString("tr-TR");
    const time = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

    let message = "";
    message += "🟢 KALKAN GÜBRE SİPARİŞİ\n";
    message += "────────────────────\n";
    message += `📅 Tarih: ${date}\n`;
    message += `🕒 Saat: ${time}\n\n`;
    message += "📦 Ürünler:\n";

    let total = 0;

    Object.values(cart).forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        message += `• ${item.name} x ${item.qty} = ${itemTotal} ₺\n`;
    });

    message += "\n────────────────────\n";
    message += `💰 Toplam Tutar: ${total} ₺\n\n`;
    message += "📍 Teslimat:\n(Adres bilgisi paylaşılacaktır)\n\n";
    

    const phone = "905327384119";
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(url, "_blank");
}


/* ================= SLIDER ================= */

let currentSlide = 0;

function showSlide(index) {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");

    if (!slider || slides.length === 0) return;

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

/* Otomatik slider (5 saniye) */
setInterval(() => {
    nextSlide();
}, 5000);

/* Sayfa açılınca ilk slide */
document.addEventListener("DOMContentLoaded", () => {
    showSlide(0);
});

/* ================= SEPET DIŞINA TIKLAYINCA KAPAT ================= */

document.addEventListener("click", function (e) {
    const cartBox = document.getElementById("cart");
    const cartButton = document.querySelector(".mobile-cart");
    const hamburger = document.querySelector(".hamburger");

    if (!cartBox) return;

    const clickedInsideCart = cartBox.contains(e.target);
    const clickedCartButton = cartButton && cartButton.contains(e.target);
    const clickedHamburger = hamburger && hamburger.contains(e.target);

    if (
        cartBox.classList.contains("show") &&
        !clickedInsideCart &&
        !clickedCartButton &&
        !clickedHamburger
    ) {
        cartBox.classList.remove("show");
    }
});

/* ================= KATEGORİ ================= */

function filterCategory(cat) {
    const productBox = document.getElementById("products");
    const noResult = document.getElementById("noResult");

    // aktif buton
    document.querySelectorAll(".category-bar button").forEach(btn =>
        btn.classList.remove("active")
    );

    const activeBtn = document.querySelector(
        `.category-bar button[onclick="filterCategory('${cat}')"]`
    );
    if (activeBtn) activeBtn.classList.add("active");

    productBox.innerHTML = "";

    const list = cat === "all"
        ? products
        : products.filter(p => p.category === cat);

    if (list.length === 0) {
        noResult.style.display = "block";
        return;
    }

    noResult.style.display = "none";
    list.forEach(p => renderProduct(p));
}



function renderProduct(p) {
    document.getElementById("products").innerHTML += `
        <div class="card">
            <div class="badge">${p.category}</div>

            <img src="${p.img}" alt="${p.name}">
            <div class="card-body">
                <h3>${p.name}</h3>
                <p><strong>${p.price} ₺</strong></p>
                <button onclick="addToCart(${p.id})">Sepete Ekle</button>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    filterCategory("all");
});

window.addEventListener("scroll", () => {
    const header = document.querySelector(".main-header");
    if (!header) return;

    if (window.scrollY > 80) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

const fadeSections = document.querySelectorAll(".fade-section");

function handleScrollFade() {
    fadeSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 120) {
            section.classList.add("show");
        }
    });
}

window.addEventListener("scroll", handleScrollFade);
window.addEventListener("load", handleScrollFade);

let countersStarted = false;

function startCounters() {
    if (countersStarted) return;

    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let current = 0;
        const step = Math.ceil(target / 3000);

        const update = () => {
            current += step;
            if (current >= target) {
                counter.innerText = target + "+";
            } else {
                counter.innerText = current;
                requestAnimationFrame(update);
            }
        };
        update();
    });

    countersStarted = true;
}

// Fade ile birlikte tetiklensin
window.addEventListener("scroll", () => {
    const about = document.getElementById("about");
    if (!about) return;

    const rect = about.getBoundingClientRect();
    if (rect.top < window.innerHeight - 150) {
        startCounters();
    }
});


const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("cName").value;
        const phone = document.getElementById("cPhone").value;
        const message = document.getElementById("cMessage").value;

        if (!name || !phone || !message) {
            alert("Lütfen tüm alanları doldurun");
            return;
        }

        document.getElementById("formSuccess").style.display = "block";

        const text =
`📩 İLETİŞİM FORMU
👤 Ad Soyad: ${name}
📞 Telefon: ${phone}

💬 Mesaj:
${message}`;

        const url = "https://wa.me/905327384119?text=" + encodeURIComponent(text);

        setTimeout(() => {
            window.open(url, "_blank");
        }, 500);
    });
}
