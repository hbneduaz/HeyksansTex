// script.js
"use strict";

/* =========================================================
   HEYKSANS TECHNOLOGY — GitHub Pages üçün işlək UI bazası
   Qeyd: Bu versiyada login/profil UI var, amma real auth yoxdur.
   Firebase qoşanda (Auth + Firestore + Storage) tam sistem olacaq.
========================================================= */

/* ---------------- DOM helpers ---------------- */
const $ = (id) => document.getElementById(id);

/* ---------------- Elements ---------------- */
const q = $("q");
const clearSearch = $("clearSearch");
const chips = $("chips");
const grid = $("grid");
const resultCount = $("resultCount");

const emptyPreview = $("emptyPreview");
const previewWrap = $("preview");

const pCover = $("pCover");
const pAvatar = $("pAvatar");
const pName = $("pName");
const pRole = $("pRole");
const pTags = $("pTags");
const pBio = $("pBio");
const pGallery = $("pGallery");
const pWhatsapp = $("pWhatsapp");
const pInstagram = $("pInstagram");
const pEmail = $("pEmail");
const openProfile = $("openProfile");
const orderBtn = $("orderBtn");

const btnLogin = $("btnLogin");
const btnRegister = $("btnRegister");

const openAuthFromEmpty = $("openAuthFromEmpty");
const learnMore = $("learnMore");

/* Profile modal */
const modal = $("modal");
const modalBackdrop = $("modalBackdrop");
const closeModal = $("closeModal");

const mTitle = $("mTitle");
const mAvatar = $("mAvatar");
const mName = $("mName");
const mRole = $("mRole");
const mTags = $("mTags");
const mBio = $("mBio");
const mGallery = $("mGallery");
const mWhatsapp = $("mWhatsapp");
const mInstagram = $("mInstagram");
const mEmail = $("mEmail");
const mUser = $("mUser");
const mCat = $("mCat");

/* Auth modal */
const authModal = $("authModal");
const authBackdrop = $("authBackdrop");
const authClose = $("authClose");
const tabLogin = $("tabLogin");
const tabRegister = $("tabRegister");
const authTitle = $("authTitle");
const authSubmit = $("authSubmit");
const authForm = $("authForm");
const googleBtn = $("googleBtn");
const authHint = $("authHint");

/* Info modal */
const infoModal = $("infoModal");
const infoBackdrop = $("infoBackdrop");
const infoClose = $("infoClose");

/* ---------------- State ---------------- */
const state = {
  activeCategory: "Hamısı",
  query: "",
  selectedId: null,
  authMode: "login",
};

/* ---------------- Demo data (opsional) ----------------
   İstəmirsənsə: DEMO_MODE = false et, kataloq boş olacaq.
-------------------------------------------------------- */
const DEMO_MODE = true;

const DATA = DEMO_MODE ? [
  {
    id: "ayan",
    name: "Ayan Məmmədzadə",
    username: "ayan_design",
    category: "Dizayn",
    role: "Qrafik Dizayner",
    tags: ["Loqo", "Brend", "Poster"],
    bio: "Brend kimliyi, loqo sistemləri və sosial media dizaynları hazırlayıram.",
    whatsapp: "https://wa.me/994000000000",
    instagram: "https://instagram.com/",
    email: "mailto:example@email.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    portfolio: [
      { img: "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=900&q=80", title: "Poster", desc: "Təqdimat poster işi" },
      { img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80", title: "Loqo", desc: "Minimal loqo konsepti" },
      { img: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80", title: "Brend", desc: "Brend kimliyi paketi" },
    ],
  },
  {
    id: "samira",
    name: "Samirə Abbasova",
    username: "samira_photo",
    category: "Foto",
    role: "Fotoqraf",
    tags: ["Portret", "Studia", "Retuş"],
    bio: "Portret və studia çəkilişləri. Təmiz işıq və təbii rəng balansı.",
    whatsapp: "https://wa.me/994000000001",
    instagram: "https://instagram.com/",
    email: "mailto:example@email.com",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80",
    cover: "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=1400&q=80",
    portfolio: [
      { img: "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80", title: "Portret", desc: "Studia portreti" },
      { img: "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80", title: "Retuş", desc: "Təmiz retuş nümunəsi" },
      { img: "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80", title: "Kadr", desc: "İşıq kompozisiyası" },
    ],
  },
] : [];

/* ---------------- Init ---------------- */
init();

function init() {
  bindEvents();
  renderChips();
  renderGrid();
  if (!DATA.length) showEmptyPreview();
}

/* ---------------- Events ---------------- */
function bindEvents() {
  q?.addEventListener("input", () => {
    state.query = (q.value || "").trim();
    renderGrid();
  });

  clearSearch?.addEventListener("click", () => {
    if (q) q.value = "";
    state.query = "";
    renderGrid();
    q?.focus();
  });

  btnLogin?.addEventListener("click", () => openAuthModal("login"));
  btnRegister?.addEventListener("click", () => openAuthModal("register"));
  openAuthFromEmpty?.addEventListener("click", () => openAuthModal("register"));

  learnMore?.addEventListener("click", openInfoModal);

  // Profile modal
  openProfile?.addEventListener("click", () => {
    const u = getSelected();
    if (u) openProfileModal(u);
  });

  orderBtn?.addEventListener("click", () => {
    const u = getSelected();
    if (!u) return;
    // Prioritet WhatsApp
    if (u.whatsapp && u.whatsapp !== "#") window.open(u.whatsapp, "_blank", "noopener");
  });

  closeModal?.addEventListener("click", closeProfileModal);
  modalBackdrop?.addEventListener("click", closeProfileModal);

  // Auth modal
  authClose?.addEventListener("click", closeAuthModal);
  authBackdrop?.addEventListener("click", closeAuthModal);

  tabLogin?.addEventListener("click", () => setAuthMode("login"));
  tabRegister?.addEventListener("click", () => setAuthMode("register"));

  authForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    authHint.textContent = "Bu UI bazadır. Firebase qoşulanda giriş/qeydiyyat real işləyəcək.";
  });

  googleBtn?.addEventListener("click", () => {
    authHint.textContent = "Google giriş Firebase ilə aktivləşəcək.";
  });

  // Info modal
  infoClose?.addEventListener("click", closeInfoModal);
  infoBackdrop?.addEventListener("click", closeInfoModal);

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProfileModal();
      closeAuthModal();
      closeInfoModal();
    }
  });
}

/* ---------------- Chips (Categories) ---------------- */
function renderChips() {
  const cats = ["Hamısı", ...unique(DATA.map(x => x.category))];
  chips.innerHTML = cats.map(c => {
    const active = c === state.activeCategory ? "is-active" : "";
    return `<button class="chip ${active}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`;
  }).join("");

  chips.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.cat || "Hamısı";
      chips.querySelectorAll(".chip").forEach(b => b.classList.toggle("is-active", b === btn));
      renderGrid();
    });
  });
}

/* ---------------- Grid (Profiles) ---------------- */
function renderGrid() {
  const list = filterData(DATA, state.query, state.activeCategory);
  if (resultCount) resultCount.textContent = String(list.length);

  if (!list.length) {
    grid.innerHTML = emptyGridHTML();
    state.selectedId = null;
    showEmptyPreview();
    return;
  }

  grid.innerHTML = list.map(u => userCard(u)).join("");

  grid.querySelectorAll(".cardUser").forEach(card => {
    card.addEventListener("click", () => selectUser(card.dataset.id));
  });

  // Auto-select
  if (!state.selectedId || !list.some(x => x.id === state.selectedId)) {
    selectUser(list[0].id, true);
  }
}

function emptyGridHTML() {
  return `
    <div class="emptyList">
      <div class="emptyList__title">Hələ profil yoxdur</div>
      <div class="emptyList__text">Qeydiyyat edib ilk profili yarada bilərsən.</div>
      <button class="btn btn--primary btn--sm" type="button" id="createFirst">Profil yarat</button>
    </div>
  `;
}

function userCard(u) {
  const active = u.id === state.selectedId ? "is-active" : "";
  return `
    <div class="cardUser ${active}" data-id="${esc(u.id)}" role="button" tabindex="0">
      <div class="cardUser__row">
        <div class="avatar">
          <img src="${esc(u.avatar)}" alt="${esc(u.name)}" loading="lazy" />
        </div>
        <div class="cardUser__meta">
          <div class="cardUser__name">${esc(u.name)}</div>
          <div class="cardUser__role">${esc(u.role)}</div>
        </div>
      </div>
      <div class="cardUser__chips">
        <span class="mini">${esc(u.category)}</span>
        ${u.tags.slice(0, 2).map(t => `<span class="mini">${esc(t)}</span>`).join("")}
      </div>
    </div>
  `;
}

/* ---------------- Select + Preview ---------------- */
function selectUser(id, silent = false) {
  state.selectedId = id;

  document.querySelectorAll(".cardUser").forEach(c => {
    c.classList.toggle("is-active", c.dataset.id === id);
  });

  const u = getSelected();
  if (!u) {
    showEmptyPreview();
    return;
  }
  fillPreview(u);

  if (!silent) {
    // no-op
  }
}

function getSelected() {
  return DATA.find(x => x.id === state.selectedId) || null;
}

function showEmptyPreview() {
  if (emptyPreview) emptyPreview.hidden = false;
  if (previewWrap) previewWrap.hidden = true;

  // empty grid action hook
  const btn = document.getElementById("createFirst");
  btn?.addEventListener("click", () => openAuthModal("register"));
}

function fillPreview(u) {
  if (emptyPreview) emptyPreview.hidden = true;
  if (previewWrap) previewWrap.hidden = false;

  setImg(pCover, u.cover, `${u.name} cover`);
  setImg(pAvatar, u.avatar, u.name);

  if (pName) pName.textContent = u.name;
  if (pRole) pRole.textContent = u.role;

  if (pTags) pTags.innerHTML = u.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("");

  if (pBio) pBio.textContent = u.bio;

  if (pWhatsapp) pWhatsapp.href = u.whatsapp || "#";
  if (pInstagram) pInstagram.href = u.instagram || "#";
  if (pEmail) pEmail.href = u.email || "#";

  if (pGallery) {
    pGallery.innerHTML = u.portfolio.slice(0, 6).map(item => galleryItem(item, u.name)).join("");
  }
}

function galleryItem(item, name) {
  const title = item.title ? `<div class="gMeta__t">${esc(item.title)}</div>` : "";
  const desc = item.desc ? `<div class="gMeta__d">${esc(item.desc)}</div>` : "";
  return `
    <div class="gItem" role="button" tabindex="0" title="${esc(item.title || "")}">
      <img src="${esc(item.img)}" alt="${esc(name)} işi" loading="lazy" />
      <div class="gMeta">
        ${title}
        ${desc}
      </div>
    </div>
  `;
}

/* ---------------- Profile modal ---------------- */
function openProfileModal(u) {
  if (mTitle) mTitle.textContent = `@${u.username}`;
  setImg(mAvatar, u.avatar, u.name);

  if (mName) mName.textContent = u.name;
  if (mRole) mRole.textContent = u.role;

  if (mTags) mTags.innerHTML = u.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("");
  if (mBio) mBio.textContent = u.bio;

  if (mWhatsapp) mWhatsapp.href = u.whatsapp || "#";
  if (mInstagram) mInstagram.href = u.instagram || "#";
  if (mEmail) mEmail.href = u.email || "#";

  if (mUser) mUser.textContent = `@${u.username}`;
  if (mCat) mCat.textContent = u.category;

  if (mGallery) {
    mGallery.innerHTML = u.portfolio.map(item => galleryItem(item, u.name)).join("");
  }

  modal?.classList.add("is-open");
  modal?.setAttribute("aria-hidden", "false");
}

function closeProfileModal() {
  modal?.classList.remove("is-open");
  modal?.setAttribute("aria-hidden", "true");
}

/* ---------------- Auth modal (UI) ---------------- */
function openAuthModal(mode) {
  setAuthMode(mode);
  authModal?.classList.add("is-open");
  authModal?.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
  authModal?.classList.remove("is-open");
  authModal?.setAttribute("aria-hidden", "true");
}

function setAuthMode(mode) {
  state.authMode = mode;

  tabLogin?.classList.toggle("is-active", mode === "login");
  tabRegister?.classList.toggle("is-active", mode === "register");

  if (authTitle) authTitle.textContent = mode === "login" ? "Giriş" : "Qeydiyyat";
  if (authSubmit) authSubmit.textContent = mode === "login" ? "Daxil ol" : "Hesab yarat";
  if (authHint) authHint.textContent = "Qeyd: Bu HTML bazadır. Firebase qoşulanda giriş və profil real işləyəcək.";
}

/* ---------------- Info modal ---------------- */
function openInfoModal() {
  infoModal?.classList.add("is-open");
  infoModal?.setAttribute("aria-hidden", "false");
}
function closeInfoModal() {
  infoModal?.classList.remove("is-open");
  infoModal?.setAttribute("aria-hidden", "true");
}

/* ---------------- Utils ---------------- */
function filterData(list, query, category) {
  const qq = (query || "").toLowerCase();
  return list.filter(u => {
    const catOk = category === "Hamısı" || u.category === category;
    if (!catOk) return false;
    if (!qq) return true;

    const hay = [
      u.name,
      u.username,
      u.category,
      u.role,
      (u.tags || []).join(" "),
    ].join(" ").toLowerCase();

    return hay.includes(qq);
  });
}

function unique(arr) {
  return [...new Set(arr)];
}

function setImg(el, src, alt) {
  if (!el) return;
  el.src = src || "";
  el.alt = alt || "";
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ---------------- Boot: empty list button hook ---------------- */
document.addEventListener("click", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  if (t.id === "createFirst") openAuthModal("register");
});
