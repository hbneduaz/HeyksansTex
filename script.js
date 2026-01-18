// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9zHIN9tSuvfjqIMwjXQWhxkwTlsCMXB4",
  authDomain: "heyksans-technology-1e22d.firebaseapp.com",
  projectId: "heyksans-technology-1e22d",
  storageBucket: "heyksans-technology-1e22d.firebasestorage.app",
  messagingSenderId: "267409530621",
  appId: "1:267409530621:web:9f45d0dc159e97ecba2894",
  measurementId: "G-J6J56Q0GR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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

  if (!readPortfolio()) writePortfolio([]);

  authHint.textContent = "Profil yaradıldı. İndi portfolio əlavə edə bilərsiniz.";
  closeAuthModal();
  loadAndRender();
}

/* ---------- Render ---------- */
function loadAndRender() {
  const profile = readProfile();
  if (!profile) {
    updateCount(0);
    return;
  }
  ensureProfileSection(profile);
  updateCount(1);
}

/* ---------- Create / Update Profile section ---------- */
function ensureProfileSection(profile) {
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
              <input class="field__input" id="workImg" placeholder="Şəkil linki (https://...)" />
              <input class="field__input" id="workTitle" placeholder="Başlıq" />
              <textarea class="field__input" id="workDesc" placeholder="Qısa izah"></textarea>
              <div class="workForm__actions">
                <button class="btn btn--primary btn--sm" id="saveWorkBtn" type="button">Saxla</button>
                <button class="btn btn--ghost btn--sm" id="cancelWorkBtn" type="button">Ləğv et</button>
              </div>
              <div class="hint" id="workHint">Şəkil linki mütləq https:// ilə başlamalıdır.</div>
            </div>
            <div class="workGrid" id="workGrid"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(section);
  }

  $("p_name").textContent = profile.name;
  $("p_role").textContent = profile.role;
  $("p_bio").textContent = profile.bio;

  renderPortfolio();
  bindPortfolioActions();
}

/* ---------- Portfolio ---------- */
function bindPortfolioActions() {
  $("addWorkBtn").onclick = () => {
    $("workForm").style.display = "block";
  };
  $("cancelWorkBtn").onclick = () => {
    $("workForm").style.display = "none";
  };
  $("saveWorkBtn").onclick = () => {
    const img = $("workImg").value.trim();
    const title = $("workTitle").value.trim();
    const desc = $("workDesc").value.trim();
    if (!img || !title) return;
    const list = readPortfolio() || [];
    list.unshift({ id: cryptoId(), img, title, desc });
    writePortfolio(list);
    $("workForm").style.display = "none";
    renderPortfolio();
  };
}

function renderPortfolio() {
  const grid = $("workGrid");
  const list = readPortfolio() || [];
  grid.innerHTML = list.map(i => `
    <div class="workCard">
      <img src="${esc(i.img)}">
      <div>${esc(i.title)}</div>
      <div>${esc(i.desc)}</div>
    </div>
  `).join("");
}

/* ---------- Storage ---------- */
function readProfile() {
  const raw = localStorage.getItem(KEY_PROFILE);
  return raw ? JSON.parse(raw) : null;
}
function writeProfile(p) {
  localStorage.setItem(KEY_PROFILE, JSON.stringify(p));
}
function readPortfolio() {
  const raw = localStorage.getItem(KEY_PORTFOLIO);
  return raw ? JSON.parse(raw) : [];
}
function writePortfolio(l) {
  localStorage.setItem(KEY_PORTFOLIO, JSON.stringify(l));
}

/* ---------- Utils ---------- */
function updateCount(n) {
  if (resultCount) resultCount.textContent = n;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}
function cryptoId() {
  return "id_" + Math.random().toString(16).slice(2);
}
