// ============================================================================
// KING PET ADMIN — HỆ THỐNG QUẢN TRỊ ĐỒ ĂN & PHỤ KIỆN THÚ CƯNG
// ============================================================================

const money = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const esc = (s) =>
  String(s ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
const escXml = (s) =>
  String(s ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;" }[c]));

function splitLabelLines(name) {
  const words = String(name || "King Pet Product").trim().split(/\s+/);
  let line1 = "";
  let line2 = "";
  for (const w of words) {
    if ((line1 + " " + w).trim().length <= 18) {
      line1 = (line1 + " " + w).trim();
    } else if ((line2 + " " + w).trim().length <= 20) {
      line2 = (line2 + " " + w).trim();
    } else {
      break;
    }
  }
  return [escXml(line1), escXml(line2)];
}

const PALETTES = [
  ["#ea580c", "#f97316", "#ffedd5"],
  ["#059669", "#10b981", "#d1fae5"],
  ["#2563eb", "#3b82f6", "#dbeafe"],
  ["#7c3aed", "#8b5cf6", "#ede9fe"],
  ["#db2777", "#ec4899", "#fce7f3"],
  ["#d97706", "#f59e0b", "#fef3c7"],
  ["#0891b2", "#06b6d4", "#cffafe"],
  ["#4f46e5", "#6366f1", "#e0e7ff"]
];

function generateFoodPackageSVG(p) {
  const pal = PALETTES[(p.id || 1) % PALETTES.length];
  const [dark, mid, light] = pal;
  const cat = p.cat || "Hạt khô";
  const weight = escXml(p.weight || "500g");
  const pet = escXml(p.petType || "Chó & Mèo");
  const emoji = escXml(p.emoji || "🍖");
  const [line1, line2] = splitLabelLines(p.name);

  let shapeSvg = "";
  if (cat === "Hạt khô") {
    shapeSvg = `
      <ellipse cx="130" cy="232" rx="74" ry="12" fill="rgba(0,0,0,0.14)"/>
      <path d="M54,32 L206,32 L216,212 C216,222 206,228 194,228 L66,228 C54,228 44,222 44,212 Z" fill="url(#pkgGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <path d="M51,22 L209,22 L206,36 L54,36 Z" fill="${dark}"/>
      <line x1="62" y1="29" x2="198" y2="29" stroke="#fef08a" stroke-width="2"/>
      <path d="M58,36 L86,36 L78,224 L50,220 Z" fill="rgba(255,255,255,0.16)"/>
      <rect x="64" y="72" width="132" height="106" rx="16" fill="#ffffff" opacity="0.97"/>
      <rect x="64" y="72" width="132" height="106" rx="16" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
    `;
  } else if (cat === "Pate & Sốt") {
    shapeSvg = `
      <ellipse cx="130" cy="230" rx="78" ry="13" fill="rgba(0,0,0,0.16)"/>
      <path d="M48,60 L212,60 L212,206 C212,221 175,228 130,228 C85,228 48,221 48,206 Z" fill="url(#pkgGrad)"/>
      <ellipse cx="130" cy="60" rx="82" ry="18" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3"/>
      <ellipse cx="130" cy="60" rx="68" ry="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="48" y="82" width="164" height="102" fill="#ffffff" opacity="0.97"/>
      <line x1="48" y1="82" x2="212" y2="82" stroke="#f59e0b" stroke-width="2.5"/>
      <line x1="48" y1="184" x2="212" y2="184" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M56,66 L82,66 L82,218 L56,212 Z" fill="rgba(255,255,255,0.2)"/>
    `;
  } else if (cat === "Bánh thưởng") {
    shapeSvg = `
      <ellipse cx="130" cy="232" rx="70" ry="11" fill="rgba(0,0,0,0.14)"/>
      <rect x="50" y="28" width="160" height="198" rx="22" fill="url(#pkgGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <line x1="56" y1="46" x2="204" y2="46" stroke="#fef08a" stroke-width="2.5" stroke-dasharray="6,4"/>
      <circle cx="130" cy="37" r="4.5" fill="#ffffff"/>
      <rect x="64" y="72" width="132" height="106" rx="18" fill="#ffffff" opacity="0.97"/>
      <rect x="64" y="72" width="132" height="106" rx="18" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
    `;
  } else if (cat === "Dinh dưỡng") {
    shapeSvg = `
      <ellipse cx="130" cy="232" rx="66" ry="11" fill="rgba(0,0,0,0.14)"/>
      <rect x="88" y="20" width="84" height="26" rx="7" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
      <rect x="58" y="44" width="144" height="182" rx="26" fill="url(#pkgGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <rect x="68" y="76" width="124" height="104" rx="14" fill="#ffffff" opacity="0.97"/>
      <path d="M68,50 L90,50 L90,218 L68,214 Z" fill="rgba(255,255,255,0.18)"/>
    `;
  } else if (cat === "Đồ chơi") {
    shapeSvg = `
      <ellipse cx="130" cy="230" rx="76" ry="13" fill="rgba(0,0,0,0.12)"/>
      <circle cx="130" cy="120" r="76" fill="url(#pkgGrad)" stroke="#ffffff" stroke-width="3"/>
      <circle cx="130" cy="120" r="58" fill="#ffffff" opacity="0.95"/>
      <path d="M70,80 Q130,40 190,80" stroke="#fef08a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="130" cy="74" r="9" fill="#f59e0b"/>
    `;
  } else if (cat === "Phụ kiện") {
    shapeSvg = `
      <ellipse cx="130" cy="230" rx="72" ry="12" fill="rgba(0,0,0,0.12)"/>
      <rect x="52" y="36" width="156" height="188" rx="20" fill="url(#pkgGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="130" cy="52" r="8" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
      <rect x="64" y="76" width="132" height="102" rx="14" fill="#ffffff" opacity="0.97"/>
      <path d="M78,100 L182,100" stroke="${dark}" stroke-width="6" stroke-linecap="round"/>
      <rect x="116" y="93" width="28" height="14" rx="3" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
    `;
  } else if (cat === "Bát ăn & Khay") {
    shapeSvg = `
      <ellipse cx="130" cy="226" rx="84" ry="15" fill="rgba(0,0,0,0.14)"/>
      <path d="M42,100 C42,185 70,220 130,220 C190,220 218,185 218,100 Z" fill="url(#pkgGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <ellipse cx="130" cy="98" rx="88" ry="24" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3"/>
      <ellipse cx="130" cy="98" rx="72" ry="18" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="74" y="130" width="112" height="52" rx="12" fill="#ffffff" opacity="0.95"/>
    `;
  } else {
    shapeSvg = `
      <ellipse cx="130" cy="232" rx="66" ry="12" fill="rgba(0,0,0,0.14)"/>
      <rect x="122" y="14" width="16" height="24" fill="#64748b"/>
      <path d="M110,14 L146,14 L146,24 L110,24 Z" fill="#334155" rx="3"/>
      <rect x="88" y="34" width="84" height="18" rx="5" fill="#f59e0b"/>
      <path d="M64,52 L196,52 L196,212 C196,224 186,228 176,228 L84,228 C74,228 64,224 64,212 Z" fill="url(#pkgGrad)" stroke="#ffffff" stroke-width="2.5"/>
      <rect x="74" y="82" width="112" height="102" rx="14" fill="#ffffff" opacity="0.97"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 250" width="260" height="250">
    <defs>
      <linearGradient id="pkgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <circle cx="130" cy="125" r="108" fill="${light}" opacity="0.75"/>
    ${shapeSvg}
    <text x="130" y="58" text-anchor="middle" font-family="'Nunito', 'Segoe UI', sans-serif" font-weight="900" font-size="10.5" fill="#fef08a">👑 KING PET</text>
    <text x="130" y="122" text-anchor="middle" font-size="40">${emoji}</text>
    <text x="130" y="148" text-anchor="middle" font-family="'Nunito', 'Segoe UI', sans-serif" font-weight="800" font-size="10.5" fill="${dark}">${line1}</text>
    <text x="130" y="163" text-anchor="middle" font-family="'Nunito', 'Segoe UI', sans-serif" font-weight="700" font-size="9.5" fill="#64748b">${line2}</text>
    <rect x="70" y="194" width="120" height="21" rx="10.5" fill="#ffffff" opacity="0.96"/>
    <text x="130" y="208" text-anchor="middle" font-family="'Nunito', 'Segoe UI', sans-serif" font-weight="800" font-size="9" fill="${dark}">${weight} • ${pet}</text>
  </svg>`;

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg).replace(/'/g, "%27");
}

function getProductImage(p) {
  if (p.img && p.img.startsWith("http")) {
    return p.img;
  }
  return generateFoodPackageSVG(p);
}

let products = JSON.parse(localStorage.getItem("pet_products") || "[]");
let users = JSON.parse(localStorage.getItem("pet_users") || "[]");
let orders = JSON.parse(localStorage.getItem("pet_orders") || "[]");
let reviews = JSON.parse(localStorage.getItem("pet_reviews") || "[]");
let categories = JSON.parse(localStorage.getItem("pet_categories") || "null") || [
  { id: 1, name: "Hạt khô", icon: "🥩", desc: "Hạt khô dinh dưỡng giàu protein & omega" },
  { id: 2, name: "Pate & Sốt", icon: "🥫", desc: "Pate tươi & sốt thịt hầm thơm mềm giàu ẩm" },
  { id: 3, name: "Bánh thưởng", icon: "🦴", desc: "Súp thưởng, thịt sấy & xương sạch răng" },
  { id: 4, name: "Dinh dưỡng", icon: "🍼", desc: "Sữa non, dầu cá hồi, gel vitamin & men vi sinh" },
  { id: 5, name: "Đồ chơi", icon: "🧸", desc: "Bàn cào móng, cần câu, bóng lăn & đồ chơi gặm" },
  { id: 6, name: "Phụ kiện", icon: "🦮", desc: "Vòng cổ chuông, dây dắt yếm & đai dạo phố" },
  { id: 7, name: "Bát ăn & Khay", icon: "🥣", desc: "Bát ăn chống gù, máy lọc nước & khay vệ sinh" },
  { id: 8, name: "Vệ sinh", icon: "🛁", desc: "Sữa tắm thảo dược, xịt khử mùi & chăm sóc lông" }
];
localStorage.setItem("pet_categories", JSON.stringify(categories));

const ADMIN_USER = "admin",
  ADMIN_PASS = "2006";

function save() {
  localStorage.setItem("pet_products", JSON.stringify(products));
  localStorage.setItem("pet_users", JSON.stringify(users));
  localStorage.setItem("pet_orders", JSON.stringify(orders));
  localStorage.setItem("pet_reviews", JSON.stringify(reviews));
  localStorage.setItem("pet_categories", JSON.stringify(categories));
}

function toast(m) {
  const x = document.getElementById("toast");
  if (!x) return;
  x.textContent = m;
  x.classList.add("show");
  setTimeout(() => x.classList.remove("show"), 2300);
}

function adminLogin() {
  const u = document.getElementById("adminUser").value.trim(),
    p = document.getElementById("adminPass").value;
  if (u !== ADMIN_USER || p !== ADMIN_PASS) return toast("⚠️ Sai tài khoản hoặc mật khẩu Admin (Demo: admin / 2006)");
  localStorage.setItem("pet_admin_session", "true");
  showAdmin();
}

function showAdmin() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("adminApp").classList.remove("hidden");
  renderDashboard();
  renderProductsAdmin();
}

function adminLogout() {
  localStorage.removeItem("pet_admin_session");
  location.reload();
}

if (localStorage.getItem("pet_admin_session") === "true") showAdmin();

const statuses = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao", "Đã hủy"];
const titles = {
  dashboard: "Tổng quan hệ thống King Pet (Đồ ăn & Phụ kiện)",
  products: "Quản lý thực đơn đồ ăn & phụ kiện thú cưng",
  orders: "Quản lý đơn đặt hàng",
  users: "Tài khoản thành viên",
  categories: "Danh mục đồ ăn & phụ kiện",
  reviews: "Đánh giá khách hàng",
  project: "Quản lý dự án SPM"
};

function switchTab(id) {
  document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((x) => x.classList.toggle("active", x.dataset.tab === id));
  document.getElementById("pageTitle").textContent = titles[id];
  ({
    dashboard: renderDashboard,
    products: renderProductsAdmin,
    orders: renderOrdersAdmin,
    users: renderUsers,
    categories: renderCategories,
    reviews: renderReviews
  }[id] || function () {})();
}

document.querySelectorAll(".nav-item").forEach((b) => (b.onclick = () => switchTab(b.dataset.tab)));

function renderDashboard() {
  const revenue = orders.filter((o) => o.status !== "Đã hủy").reduce((s, o) => s + (o.total || 0), 0);
  const customerCount = users.filter((u) => u.role === "user").length || 18;
  const stock = products.reduce((s, p) => s + (p.stock || 0), 0);

  document.getElementById("stats").innerHTML = `
    <div class="stat"><div class="ico">💰</div><small>DOANH THU THỰC</small><strong>${money(revenue)}</strong></div>
    <div class="stat"><div class="ico">🧾</div><small>TỔNG ĐƠN HÀNG</small><strong>${orders.length}</strong></div>
    <div class="stat"><div class="ico">👥</div><small>KHÁCH HÀNG / SEN</small><strong>${customerCount}</strong></div>
    <div class="stat"><div class="ico">📦</div><small>TỔNG TỒN KHO</small><strong>${stock} món</strong></div>
  `;

  document.getElementById("recentOrders").innerHTML =
    orders
      .slice(0, 5)
      .map(
        (o) => `
      <div class="recent-row">
        <div>
          <b>${esc(o.customer)}</b> — <span class="muted">${esc(o.id)}</span>
          <div class="muted">${esc(o.date)} • ${(o.items || []).length} sản phẩm</div>
        </div>
        <div style="text-align:right">
          <b>${money(o.total)}</b>
          <div><span class="badge ${o.status === "Đã giao" ? "" : "red"}">${esc(o.status)}</span></div>
        </div>
      </div>`
      )
      .join("") || '<div class="empty">Chưa có đơn đặt hàng nào.</div>';

  document.getElementById("lowStock").innerHTML =
    products
      .filter((p) => p.stock <= 15)
      .slice(0, 6)
      .map(
        (p) => `
      <div class="low-row">
        <div class="product-cell">
          <img class="prod-thumb" src="${getProductImage(p)}" alt="">
          <div><b>${esc(p.name)}</b><div class="muted">${esc(p.cat)} • ${esc(p.weight || "500g")}</div></div>
        </div>
        <span class="badge red">Còn ${p.stock}</span>
      </div>`
      )
      .join("") || '<div class="empty">Tồn kho đồ ăn và phụ kiện đang dồi dào.</div>';
}

function renderProductsAdmin() {
  const q = (document.getElementById("productSearch")?.value || "").toLowerCase();
  const cat = document.getElementById("productCat")?.value || "";
  const list = products.filter((p) => (!q || p.name.toLowerCase().includes(q)) && (!cat || p.cat === cat));

  document.getElementById("productsTable").innerHTML =
    list
      .map(
        (p) => `
      <tr>
        <td>
          <div class="product-cell">
            <img class="prod-thumb" src="${getProductImage(p)}" alt="">
            <div>
              <b>${esc(p.name)}</b>
              <div class="muted">${esc(p.nutrition || "Chuẩn an toàn thú y")}</div>
            </div>
          </div>
        </td>
        <td><b>${esc(p.cat)}</b></td>
        <td>${esc(p.petType || "Chó & Mèo")} • <span class="badge">${esc(p.weight || "500g")}</span></td>
        <td><b>${money(p.price)}</b></td>
        <td>${p.stock}</td>
        <td>⭐ ${p.rating}</td>
        <td><span class="badge ${p.stock <= 15 ? "red" : ""}">${p.stock <= 0 ? "Hết hàng" : p.stock <= 15 ? "Sắp hết" : "Đang bán"}</span></td>
        <td>
          <div class="action-row">
            <button onclick="openProduct(${p.id})" title="Sửa">✏️</button>
            <button class="danger" onclick="deleteProduct(${p.id})" title="Xóa">🗑️</button>
          </div>
        </td>
      </tr>`
      )
      .join("") || '<tr><td colspan="8" class="empty">Không tìm thấy sản phẩm phù hợp.</td></tr>';
}

function openProduct(id) {
  const p = id
    ? products.find((x) => x.id === id)
    : {
        name: "",
        cat: "Hạt khô",
        petType: "Chó & Mèo",
        weight: "1.5kg",
        nutrition: "Đạm 32% • Béo 16% • Omega-3",
        price: "",
        stock: 25,
        rating: 4.9,
        emoji: "🥩",
        tag: "Mới",
        img: ""
      };
  const catOpts = categories.map((c) => c.name);
  openModal(`
    <h2>${id ? "✏️ Chỉnh sửa sản phẩm" : "🍖 Thêm sản phẩm mới"}</h2>
    <div class="form">
      <input id="pn" value="${esc(p.name)}" placeholder="Tên sản phẩm đồ ăn / phụ kiện (VD: Hạt Cá Hồi Hoàng Gia)">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <select id="pc">${catOpts.map((c) => `<option ${p.cat === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
        <select id="ppet">
          ${["Chó", "Mèo", "Chó & Mèo"].map((pt) => `<option ${p.petType === pt ? "selected" : ""}>${pt}</option>`).join("")}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <input id="pp" type="number" value="${p.price}" placeholder="Giá bán (VNĐ)">
        <input id="ps" type="number" value="${p.stock}" placeholder="Số lượng tồn kho">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <input id="pw" value="${esc(p.weight || "1.0kg")}" placeholder="Quy cách (VD: 1.5kg, 400g, Size M)">
        <input id="pr" type="number" min="1" max="5" step=".1" value="${p.rating}" placeholder="Đánh giá (1-5)">
      </div>
      <input id="pnutri" value="${esc(p.nutrition || "")}" placeholder="Thông tin dinh dưỡng / chất liệu (VD: Đạm 35% • Omega-3)">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <input id="pe" value="${esc(p.emoji || "🍖")}" placeholder="Icon biểu trưng (🥩, 🐟, 🥫, 🧸, 🥣...)">
        <input id="pt" value="${esc(p.tag || "")}" placeholder="Nhãn (Bán chạy / Hoàng gia / Mới)">
      </div>
      <input id="pimg" value="${p.img && p.img.startsWith("http") ? esc(p.img) : ""}" placeholder="Link ảnh URL (Để trống sẽ tự tạo ảnh 3D King Pet)">
    </div>
    <div class="modal-actions">
      <button class="secondary" onclick="closeModal()">Hủy</button>
      <button class="primary" onclick="saveProduct(${id || 0})">Lưu sản phẩm</button>
    </div>
  `);
}

function saveProduct(id) {
  const name = document.getElementById("pn").value.trim(),
    cat = document.getElementById("pc").value,
    petType = document.getElementById("ppet").value,
    price = parseInt(document.getElementById("pp").value) || 0,
    stock = parseInt(document.getElementById("ps").value) || 0,
    weight = document.getElementById("pw").value.trim(),
    rating = parseFloat(document.getElementById("pr").value) || 4.9,
    nutrition = document.getElementById("pnutri").value.trim(),
    emoji = document.getElementById("pe").value.trim() || "🍖",
    tag = document.getElementById("pt").value.trim(),
    img = document.getElementById("pimg").value.trim();

  if (!name || !price) return toast("⚠️ Vui lòng nhập tên và giá sản phẩm");

  if (id) {
    const p = products.find((x) => x.id === id);
    Object.assign(p, { name, cat, petType, price, stock, weight, rating, nutrition, emoji, tag, img });
    if (!img) p.img = generateFoodPackageSVG(p);
    toast("✓ Đã cập nhật sản phẩm thành công!");
  } else {
    const newId = (products[products.length - 1]?.id || 0) + 1;
    const newProd = { id: newId, name, cat, petType, price, stock, weight, rating, nutrition, emoji, tag, img };
    if (!img) newProd.img = generateFoodPackageSVG(newProd);
    products.unshift(newProd);
    toast("✓ Đã thêm sản phẩm mới vào thực đơn!");
  }
  save();
  closeModal();
  renderProductsAdmin();
  renderDashboard();
}

function deleteProduct(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống King Pet?")) return;
  products = products.filter((x) => x.id !== id);
  save();
  renderProductsAdmin();
  renderDashboard();
  toast("✓ Đã xóa sản phẩm khỏi hệ thống");
}

function renderOrdersAdmin() {
  document.getElementById("ordersTable").innerHTML =
    orders
      .map(
        (o) => `
    <tr>
      <td><b>${esc(o.id)}</b></td>
      <td>
        <b>${esc(o.customer)}</b>
        <div class="muted">${esc(o.phone)} • ${esc(o.address)}</div>
        ${o.pet ? `<div class="muted">🐾 Boss: <b>${esc(o.pet)}</b></div>` : ""}
      </td>
      <td>
        ${(o.items || []).map((i) => `<div>${esc(i.name)} × <b>${i.qty}</b></div>`).join("")}
      </td>
      <td><b>${money(o.total)}</b></td>
      <td>
        <select class="status-select" onchange="changeOrderStatus('${o.id}', this.value)">
          ${statuses.map((s) => `<option ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </td>
      <td><span class="muted">${esc(o.date)}</span></td>
      <td>
        <button class="danger" onclick="deleteOrder('${o.id}')" title="Xóa đơn">🗑️</button>
      </td>
    </tr>`
      )
      .join("") || '<tr><td colspan="7" class="empty">Chưa có đơn hàng nào.</td></tr>';
}

function changeOrderStatus(id, st) {
  const o = orders.find((x) => x.id === id);
  if (o) {
    o.status = st;
    save();
    renderDashboard();
    toast(`✓ Đã cập nhật đơn ${id} → ${st}`);
  }
}

function deleteOrder(id) {
  if (!confirm("Xóa đơn hàng này?")) return;
  orders = orders.filter((x) => x.id !== id);
  save();
  renderOrdersAdmin();
  renderDashboard();
  toast("✓ Đã xóa đơn hàng");
}

function renderUsers() {
  const usersList = JSON.parse(localStorage.getItem("pet_users_list") || "[]");
  const allUsers = users.length ? users : usersList;
  document.getElementById("usersTable").innerHTML =
    allUsers
      .map(
        (u) => `
    <tr>
      <td><b>${esc(u.username)}</b></td>
      <td>${esc(u.name || "Khách hàng")}</td>
      <td>${esc(u.phone || "0900 123 321")}</td>
      <td><span class="badge ${u.role === "admin" ? "red" : ""}">${esc(u.role || "user")}</span></td>
      <td>${esc(u.address || "TP. Hồ Chí Minh")}</td>
      <td>
        <button class="danger" onclick="deleteUser('${u.username}')">🗑️</button>
      </td>
    </tr>`
      )
      .join("") || '<tr><td colspan="6" class="empty">Chưa có tài khoản nào.</td></tr>';
}

function deleteUser(username) {
  if (username === "admin") return toast("⚠️ Không thể xóa tài khoản Quản trị viên tối cao!");
  if (!confirm(`Xóa tài khoản ${username}?`)) return;
  users = users.filter((x) => x.username !== username);
  save();
  renderUsers();
  toast("✓ Đã xóa người dùng");
}

function renderCategories() {
  document.getElementById("categoriesGrid").innerHTML = categories
    .map(
      (c) => `
    <div class="cat-card">
      <div class="cat-icon">${c.icon}</div>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.desc)}</p>
      <div class="cat-actions">
        <button class="secondary" onclick="editCat(${c.id})">✏️ Sửa</button>
        <button class="danger" onclick="delCat(${c.id})">🗑️ Xóa</button>
      </div>
    </div>`
    )
    .join("");
}

function editCat(id) {
  const c = categories.find((x) => x.id === id);
  if (!c) return;
  openModal(`
    <h2>✏️ Chỉnh sửa danh mục</h2>
    <div class="form">
      <input id="cname" value="${esc(c.name)}" placeholder="Tên danh mục">
      <input id="cicon" value="${esc(c.icon)}" placeholder="Icon emoji (🥩, 🥫, 🧸...)">
      <input id="cdesc" value="${esc(c.desc)}" placeholder="Mô tả công dụng">
    </div>
    <div class="modal-actions">
      <button class="secondary" onclick="closeModal()">Hủy</button>
      <button class="primary" onclick="saveCat(${c.id})">Lưu danh mục</button>
    </div>
  `);
}

function saveCat(id) {
  const name = document.getElementById("cname").value.trim(),
    icon = document.getElementById("cicon").value.trim(),
    desc = document.getElementById("cdesc").value.trim();
  if (!name) return toast("⚠️ Tên danh mục không được để trống!");
  const c = categories.find((x) => x.id === id);
  if (c) {
    Object.assign(c, { name, icon, desc });
    save();
    closeModal();
    renderCategories();
    toast("✓ Đã cập nhật danh mục thành công!");
  }
}

function delCat(id) {
  if (categories.length <= 1) return toast("⚠️ Cần giữ lại ít nhất 1 danh mục!");
  if (!confirm("Xóa danh mục này?")) return;
  categories = categories.filter((x) => x.id !== id);
  save();
  renderCategories();
  toast("✓ Đã xóa danh mục");
}

function renderReviews() {
  document.getElementById("reviewsList").innerHTML =
    reviews
      .map(
        (r, idx) => `
    <div class="review">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <div>
          <b>${esc(r.name)}</b> <span class="muted">• ${esc(r.product || "King Pet Food")}</span>
          ${r.pet ? `<div class="muted">🐾 Boss: <b>${esc(r.pet)}</b></div>` : ""}
        </div>
        <div class="stars">${"★".repeat(r.stars || 5)}</div>
      </div>
      <p>"${esc(r.text)}"</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
        <span class="muted">${esc(r.date || "Gần đây")}</span>
        <button class="danger" onclick="delReview(${idx})">🗑️ Xóa đánh giá</button>
      </div>
    </div>`
      )
      .join("") || '<div class="empty">Chưa có đánh giá nào.</div>';
}

function delReview(idx) {
  if (!confirm("Xóa đánh giá này?")) return;
  reviews.splice(idx, 1);
  save();
  renderReviews();
  toast("✓ Đã xóa đánh giá");
}

function openModal(html) {
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("adminModal").classList.add("open");
}

function closeModal() {
  document.getElementById("adminModal").classList.remove("open");
}
