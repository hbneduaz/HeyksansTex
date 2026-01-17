// script.js
"use strict";

/* ====== DEMO DATA (sonra Firebase-dən gələcək) ====== */
const DATA = [
  {
    id: "ayan",
    name: "Ayan Məmmədzadə",
    role: "Qrafik Dizayner",
    username: "ayan_design",
    category: "Dizayn",
    tags: ["Brend", "Loqo", "Poster"],
    bio: "Brend kimliyi, loqo sistemləri və sosial media dizaynları hazırlayıram. Səliqəli, premium və məqsədyönlü iş təqdimatı əsas prinsipimdir.",
    whatsapp: "https://wa.me/994000000000",
    instagram: "https://instagram.com/",
    email: "mailto:example@email.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80",
    cover:  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "tural",
    name: "Tural Əlizadə",
    role: "UI/UX Dizayner",
    username: "tural_ux",
    category: "Proqramlaşdırma",
    tags: ["UI/UX", "Məhsul", "Mobil"],
    bio: "Mobil və web məhsullar üçün UI/UX hazırlayıram. Fokus: istifadəçi axını, sadəlik, nəticə.",
    whatsapp: "https://wa.me/994000000001",
    instagram: "https://instagram.com/",
    email: "mailto:example@email.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80",
    cover:  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "samira",
    name: "Samirə Abbasova",
    role: "Fotoqraf",
    username: "samira_photo",
    category: "Foto",
    tags: ["Portret", "Studia", "Retuş"],
    bio: "Portret və studia çəkilişləri. Təbii rəng, təmiz retuş və düzgün işıq.",
    whatsapp: "https://wa.me/994000000002",
    instagram: "https://instagram.com/",
    email: "mailto:example@email.com",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80",
    cover:  "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=1400&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520975958225-748215ed0f3f?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

/* ====== STATE ====== */
const state = {
  activeCategory: "Hamısı",
  query: "",
  selectedId: null,
};

/* ====== DOM ====== */
const $ = (id) => document.getElementById(id);

const grid = $("grid");
const chips = $("chips");
const resultCount = $("resultCount");
const q = $("q");
const clearSearch = $("clearSearch");

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

/* Auth modal (UI only) */
const authModal = $("authModal");
const authBackdrop = $("authBackdrop");
const authClose = $("authClose");
const btnLogin = $("btnLogin");
const btnRegister = $("btnRegister");
const tabLogin = $("tabLogin");
const tabRegister = $("tabRegister");
const authTitle = $("authTitle");
const authSubmit = $("authSubmit");
const authForm = $("authForm");
const googleBtn = $("googleBtn");
const authNote = $("authNote");

/* ====== INIT ====== */
init();

function init(){
  renderChips();
  renderGrid();
  bind();
}

function bind(){
  q.addEventListener("input", () => {
    state.query = q.value.trim();
    renderGrid();
  });

  clearSearch.addEventListener("click", () => {
    q.value = "";
    state.query = "";
    renderGrid();
    q.focus();
  });

  openProfile.addEventListener("click", () => {
    const user = getSelected();
    if(!user) return;
    openProfileModal(user);
  });

  // Modal close
  closeModal.addEventListener("click", closeProfileModal);
  modalBackdrop.addEventListener("click", closeProfileModal);
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      closeProfileModal();
      closeAuthModal();
    }
  });

  // Auth open
  btnLogin.addEventListener("click", () => openAuthModal("login"));
  btnRegister.addEventListener("click", () => openAuthModal("register"));
  authClose.addEventListener("click", closeAuthModal);
  authBackdrop.addEventListener("click", closeAuthModal);

  tabLogin.addEventListener("click", () => setAuthMode("login"));
  tabRegister.addEventListener("click", () => setAuthMode("register"));

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Demo: real auth sonradan Firebase ilə
    authNote.textContent = "Demo: Firebase qoşulanda bu hissə real işləyəcək.";
  });

  googleBtn.addEventListener("click", () => {
    authNote.textContent = "Demo: Google giriş Firebase ilə aktivləşəcək.";
  });
}

/* ====== CHIPS ====== */
function renderChips(){
  const cats = ["Hamısı", ...unique(DATA.map(x => x.category))];
  chips.innerHTML = cats.map(c => {
    const active = c === state.activeCategory ? "is-active" : "";
    return `<button class="chip ${active}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`;
  }).join("");

  chips.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.cat;
      chips.querySelectorAll(".chip").forEach(b => b.classList.toggle("is-active", b === btn));
      renderGrid();
    });
  });
}

/* ====== GRID ====== */
function renderGrid(){
  const filtered = filterData(DATA, state.query, state.activeCategory);
  resultCount.textContent = String(filtered.length);

  grid.innerHTML = filtered.map(u => cardUser(u)).join("");

  grid.querySelectorAll(".cardUser").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      selectUser(id);
    });
  });

  // Auto-select first if none selected
  if(filtered.length && (!state.selectedId || !filtered.some(x => x.id === state.selectedId))){
    selectUser(filtered[0].id, true);
  }
  if(!filtered.length){
    state.selectedId = null;
    showEmptyPreview();
  }
}

function cardUser(u){
  const active = u.id === state.selectedId ? "is-active" : "";
  return `
    <div class="cardUser ${active}" data-id="${escapeHtml(u.id)}" role="button" tabindex="0">
      <div class="cardUser__row">
        <div class="avatar">
          <img src="${escapeAttr(u.avatar)}" alt="${escapeAttr(u.name)}" loading="lazy" />
        </div>
        <div class="cardUser__meta">
          <div class="cardUser__name">${escapeHtml(u.name)}</div>
          <div class="cardUser__role">${escapeHtml(u.role)}</div>
        </div>
      </div>
      <div class="cardUser__chips">
        <span class="mini">${escapeHtml(u.category)}</span>
        ${u.tags.slice(0,2).map(t => `<span class="mini">${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  `;
}

/* ====== PREVIEW ====== */
function selectUser(id, silent=false){
  state.selectedId = id;

  // active border
  document.querySelectorAll(".cardUser").forEach(c => c.classList.toggle("is-active", c.dataset.id === id));

  const user = getSelected();
  if(!user){
    showEmptyPreview();
    return;
  }
  fillPreview(user);
  if(!silent){
    // no-op
  }
}

function getSelected(){
  return DATA.find(x => x.id === state.selectedId) || null;
}

function showEmptyPreview(){
  emptyPreview.hidden = false;
  previewWrap.hidden = true;
}

function fillPreview(u){
  emptyPreview.hidden = true;
  previewWrap.hidden = false;

  pCover.src = u.cover;
  pCover.alt = `${u.name} cover`;

  pAvatar.src = u.avatar;
  pAvatar.alt = u.name;

  pName.textContent = u.name;
  pRole.textContent = u.role;

  pTags.innerHTML = u.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  pBio.textContent = u.bio;

  pWhatsapp.href = u.whatsapp || "#";
  pInstagram.href = u.instagram || "#";
  pEmail.href = u.email || "#";

  pGallery.innerHTML = u.portfolio.slice(0,6).map(src => {
    return `<div class="gItem"><img src="${escapeAttr(src)}" alt="${escapeAttr(u.name)} işi" loading="lazy" /></div>`;
  }).join("");
}

/* ====== PROFILE MODAL ====== */
function openProfileModal(u){
  mTitle.textContent = `@${u.username}`;
  mAvatar.src = u.avatar;
  mAvatar.alt = u.name;
  mName.textContent = u.name;
  mRole.textContent = u.role;
  mTags.innerHTML = u.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  mBio.textContent = u.bio;

  mWhatsapp.href = u.whatsapp || "#";
  mInstagram.href = u.instagram || "#";
  mEmail.href = u.email || "#";

  mGallery.innerHTML = u.portfolio.map(src => {
    return `<div class="gItem"><img src="${escapeAttr(src)}" alt="${escapeAttr(u.name)} işi" loading="lazy" /></div>`;
  }).join("");

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");
}

function closeProfileModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");
}

/* ====== AUTH MODAL (UI) ====== */
let authMode = "login";

function openAuthModal(mode){
  authMode = mode;
  setAuthMode(mode);
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden","false");
}
function closeAuthModal(){
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden","true");
}
function setAuthMode(mode){
  authMode = mode;
  tabLogin.classList.toggle("is-active", mode==="login");
  tabRegister.classList.toggle("is-active", mode==="register");
  authTitle.textContent = mode==="login" ? "Giriş" : "Qeydiyyat";
  authSubmit.textContent = mode==="login" ? "Daxil ol" : "Hesab yarat";
  authNote.textContent = "Qeyd: Bu demo UI-dir. Firebase qoşanda giriş real işləyəcək.";
}

/* ====== HELPERS ====== */
function filterData(list, query, category){
  const q = (query || "").toLowerCase();
  return list.filter(u => {
    const catOk = (category === "Hamısı") || (u.category === category);
    const qOk = !q || (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q) ||
      u.tags.join(" ").toLowerCase().includes(q)
    );
    return catOk && qOk;
  });
}
function unique(arr){ return [...new Set(arr)]; }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(s){ return escapeHtml(s); }
