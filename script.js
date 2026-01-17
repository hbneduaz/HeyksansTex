// script.js
"use strict";

/* =========================================================
   HEYKSANS TECHNOLOGY — GitHub Pages üçün tam işlək baza
   - NÜMUNƏ PROFİL YOXDUR
   - Qeydiyyat formu ilə profil yaradılır
   - Profil localStorage-da saxlanır (GitHub Pages üçün real çıxış)
   - Portfolio: şəkil linki + başlıq + izah əlavə olunur
   Qeyd: Firebase qoşanda localStorage yerinə DB olacaq.
========================================================= */

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);

/* Buttons / inputs */
const btnLogin = $("btnLogin");
const btnRegister = $("btnRegister");
const createFirst = $("createFirst");
const openAuthFromEmpty = $("openAuthFromEmpty");
const learnMore = $("learnMore");

const q = $("q");
const clearSearch = $("clearSearch");
const resultCount = $("resultCount");

/* Modals */
const authModal = $("authModal");
const authBackdrop = $("authBackdrop");
const authClose = $("authClose");
const tabLogin = $("tabLogin");
const tabRegister = $("tabRegister");
const authTitle = $("authTitle");
const authForm = $("authForm");
const authHint = $("authHint");

const infoModal = $("infoModal");
const infoBackdrop = $("infoBackdrop");
const infoClose = $("infoClose");

/* Form fields */
const fullName = $("fullName");
const job = $("job");
const bio = $("bio");
const whatsapp = $("whatsapp");
const instagram = $("instagram");

/* ---------- Storage keys ---------- */
const KEY_PROFILE = "heyksans_profile_v1";
const KEY_PORTFOLIO = "heyksans_portfolio_v1";

/* ---------- Init ---------- */
init();

function init() {
  bind();
  loadAndRender();
}

/* ---------- Bind events ---------- */
function bind() {
  btnRegister?.addEventListener("click", () => openAuthModal("register"));
  btnLogin?.addEventListener("click", () => openAuthModal("login"));

  createFirst?.addEventListener("click", () => openAuthModal("register"));
  openAuthFromEmpty?.addEventListener("click", () => openAuthModal("register"));

  learnMore?.addEventListener("click", openInfoModal);
  infoClose?.addEventListener("click", closeInfoModal);
  infoBackdrop?.addEventListener("click", closeInfoModal);

  authClose?.addEventListener("click", closeAuthModal);
  authBackdrop?.addEventListener("click", closeAuthModal);

  tabLogin?.addEventListener("click", () => setAuthMode("login"));
  tabRegister?.addEventListener("click", () => setAuthMode("register"));

  authForm?.addEventListener("submit", onAuthSubmit);

  q?.addEventListener("input", () => {
    // Bu mərhələdə kataloq olmadığı üçün yalnız UI qalır
    // gələcəkdə katalog əlavə ediləndə işlədiləcək
    updateCount(0);
  });

  clearSearch?.addEventListener("click", () => {
    if (q) q.value = "";
    updateCount(0);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAuthModal();
      closeInfoModal();
    }
  });
}

/* ---------- Auth submit (profile create) ---------- */
function onAuthSubmit(e) {
  e.preventDefault();

  // Mode:
  // login = bu baza mərhələsində yalnız "profil varsa göstər" kimi işləyir
  // register = profil yaradır
  const mode = currentAuthMode();

  if (mode === "login") {
    const p = readProfile();
    if (!p) {
      authHint.textContent = "Profil tapılmadı. Qeydiyyat bölməsindən profil yaradın.";
      return;
    }
    authHint.textContent = "Profil mövcuddur. Aşağıda profil bölməsi aktivdir.";
    closeAuthModal();
    loadAndRender();
    return;
  }

  // register mode: validate required
  const nameVal = (fullName?.value || "").trim();
  const jobVal = (job?.value || "").trim();
  const bioVal = (bio?.value || "").trim();

  if (!nameVal || !jobVal || !bioVal) {
    authHint.textContent = "Ad Soyad, Peşə və Haqqımda sahələri mütləqdir.";
    return;
  }

  const profile = {
    id: "me",
    name: nameVal,
    role: jobVal,
    bio: bioVal,
    whatsapp: (whatsapp?.value || "").trim(),
    instagram: (instagram?.value || "").trim(),
    createdAt: Date.now(),
  };

  writeProfile(profile);

  // İlk dəfə portfolio boş saxlanılır
  if (!readPortfolio()) writePortfolio([]);

  authHint.textContent = "Profil yaradıldı. İndi portfolio əlavə edə bilərsiniz.";
  closeAuthModal();
  loadAndRender();
}

/* ---------- Render: create a real working profile UI ---------- */
function loadAndRender() {
  const profile = readProfile();
  if (!profile) {
    // Profil yoxdur → saytda boş görünüş qalır
    updateCount(0);
    return;
  }

  // Profil var → səhifəyə “Hazır Profil Paneli” əlavə edirik (tam işlək)
  ensureProfileSection(profile);
  updateCount(1);
}

/* ---------- Create / Update Profile section in DOM ---------- */
function ensureProfileSection(profile) {
  // Əgər artıq varsa yenilə
  let section = document.getElementById("myProfileSection");
  if (!section) {
    section = document.createElement("section");
    section.id = "myProfileSection";
    section.className = "wrap myProfile";

    section.innerHTML = `
      <div class="myProfile__card">
        <div class="myProfile__head">
          <div class="myProfile__title">Mənim Profilim</div>
          <div class="myProfile__actions">
            <button class="btn btn--ghost btn--sm" id="editProfileBtn" type="button">Redaktə</button>
            <button class="btn btn--ghost btn--sm" id="logoutBtn" type="button">Çıxış</button>
          </div>
        </div>

        <div class="myProfile__grid">
          <div>
            <div class="myProfile__name" id="p_name"></div>
            <div class="myProfile__role" id="p_role"></div>
            <div class="myProfile__bio" id="p_bio"></div>

            <div class="myProfile__links">
              <a class="btn btn--primary btn--sm" id="p_whatsapp" target="_blank" rel="noopener">WhatsApp</a>
              <a class="btn btn--ghost btn--sm" id="p_instagram" target="_blank" rel="noopener">Instagram</a>
            </div>
          </div>

          <div class="myProfile__portfolio">
            <div class="myProfile__subhead">
              <div class="myProfile__subtitle">Portfolio</div>
              <button class="btn btn--primary btn--sm" id="addWorkBtn" type="button">İş əlavə et</button>
            </div>

            <div class="workForm" id="workForm" style="display:none;">
              <div class="workForm__row">
                <input class="field__input" id="workImg" placeholder="Şəkil linki (https://...)" />
              </div>
              <div class="workForm__row">
                <input class="field__input" id="workTitle" placeholder="Başlıq" />
              </div>
              <div class="workForm__row">
                <textarea class="field__input" id="workDesc" placeholder="Qısa izah"></textarea>
              </div>
              <div class="workForm__actions">
                <button class="btn btn--primary btn--sm" id="saveWorkBtn" type="button">Saxla</button>
                <button class="btn btn--ghost btn--sm" id="cancelWorkBtn" type="button">Ləğv et</button>
              </div>
              <div class="hint" id="workHint" style="margin-top:10px;">Şəkil linki mütləq https:// ilə başlamalıdır.</div>
            </div>

            <div class="workGrid" id="workGrid"></div>
          </div>
        </div>
      </div>
    `;

    // Səhifənin sonunda əlavə edək (main-dən sonra)
    const main = document.querySelector("main");
    if (main && main.parentElement) main.parentElement.insertBefore(section, main.nextSibling);
    else document.body.appendChild(section);
  }

  // Fill profile data
  $("p_name").textContent = profile.name;
  $("p_role").textContent = profile.role;
  $("p_bio").textContent = profile.bio;

  // Links
  const w = $("p_whatsapp");
  const i = $("p_instagram");

  if (profile.whatsapp) {
    w.href = profile.whatsapp;
    w.style.display = "inline-flex";
  } else {
    w.href = "#";
    w.style.display = "none";
  }

  if (profile.instagram) {
    i.href = profile.instagram;
    i.style.display = "inline-flex";
  } else {
    i.href = "#";
    i.style.display = "none";
  }

  // Bind buttons
  $("logoutBtn").onclick = () => {
    // “Çıxış” = localStorage profil silinsin
    localStorage.removeItem(KEY_PROFILE);
    localStorage.removeItem(KEY_PORTFOLIO);
    location.reload();
  };

  $("editProfileBtn").onclick = () => {
    // Edit: auth modal-da form doldurulsun
    openAuthModal("register");
    fullName.value = profile.name || "";
    job.value = profile.role || "";
    bio.value = profile.bio || "";
    whatsapp.value = profile.whatsapp || "";
    instagram.value = profile.instagram || "";
    authHint.textContent = "Məlumatı dəyişin və “Profil yarat” düyməsi ilə yeniləyin.";
  };

  // Portfolio render + actions
  renderPortfolio();
  bindPortfolioActions();
}

/* ---------- Portfolio ---------- */
function bindPortfolioActions() {
  const addBtn = $("addWorkBtn");
  const form = $("workForm");
  const saveBtn = $("saveWorkBtn");
  const cancelBtn = $("cancelWorkBtn");

  addBtn.onclick = () => {
    form.style.display = "block";
    $("workImg").value = "";
    $("workTitle").value = "";
    $("workDesc").value = "";
  };

  cancelBtn.onclick = () => {
    form.style.display = "none";
  };

  saveBtn.onclick = () => {
    const img = ($("workImg").value || "").trim();
    const title = ($("workTitle").value || "").trim();
    const desc = ($("workDesc").value || "").trim();

    if (!img || !img.startsWith("http")) {
      $("workHint").textContent = "Şəkil linki düzgün deyil. Mütləq https://... olmalıdır.";
      return;
    }
    if (!title) {
      $("workHint").textContent = "Başlıq boş ola bilməz.";
      return;
    }

    const list = readPortfolio() || [];
    list.unshift({
      id: cryptoId(),
      img,
      title,
      desc,
      createdAt: Date.now(),
    });

    writePortfolio(list);
    $("workHint").textContent = "İş əlavə olundu.";
    form.style.display = "none";
    renderPortfolio();
  };
}

function renderPortfolio() {
  const grid = $("workGrid");
  if (!grid) return;

  const list = readPortfolio() || [];
  if (!list.length) {
    grid.innerHTML = `
      <div class="emptyList" style="margin-top:10px;">
        <div class="emptyList__title">Portfolio boşdur</div>
        <div class="emptyList__text">“İş əlavə et” düyməsi ilə ilk işi yerləşdir.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(item => `
    <div class="workCard">
      <div class="workCard__img">
        <img src="${esc(item.img)}" alt="${esc(item.title)}" loading="lazy">
      </div>
      <div class="workCard__meta">
        <div class="workCard__title">${esc(item.title)}</div>
        ${item.desc ? `<div class="workCard__desc">${esc(item.desc)}</div>` : ``}
      </div>
      <div class="workCard__actions">
        <button class="btn btn--ghost btn--sm" data-del="${esc(item.id)}" type="button">Sil</button>
      </div>
    </div>
  `).join("");

  // delete handlers
  grid.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      const list2 = (readPortfolio() || []).filter(x => x.id !== id);
      writePortfolio(list2);
      renderPortfolio();
    });
  });
}

/* ---------- Auth mode helpers ---------- */
function openAuthModal(mode) {
  setAuthMode(mode);
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
}

function setAuthMode(mode) {
  state.authMode = mode;

  tabLogin.classList.toggle("is-active", mode === "login");
  tabRegister.classList.toggle("is-active", mode === "register");

  authTitle.textContent = (mode === "login") ? "Giriş" : "Qeydiyyat / Profil";
  $("authSubmit").textContent = (mode === "login") ? "Daxil ol" : "Profil yarat / yenilə";
  authHint.textContent = "Bu mərhələdə məlumatlar cihazda saxlanır (localStorage).";
}

function currentAuthMode() {
  return state.authMode || "login";
}

/* ---------- Info modal ---------- */
function openInfoModal() {
  infoModal.classList.add("is-open");
  infoModal.setAttribute("aria-hidden", "false");
}

function closeInfoModal() {
  infoModal.classList.remove("is-open");
  infoModal.setAttribute("aria-hidden", "true");
}

/* ---------- Storage ---------- */
function readProfile() {
  try {
    const raw = localStorage.getItem(KEY_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeProfile(profile) {
  localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
}
function readPortfolio() {
  try {
    const raw = localStorage.getItem(KEY_PORTFOLIO);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writePortfolio(list) {
  localStorage.setItem(KEY_PORTFOLIO, JSON.stringify(list));
}

/* ---------- Misc ---------- */
function updateCount(n) {
  if (resultCount) resultCount.textContent = String(n);
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cryptoId() {
  // GitHub Pages üçün sadə id
  return "id_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}
