// ---------- Config & State ----------
const API_URL = "https://picsum.photos/v2/list?page=1&limit=60";
const PER_PAGE = 12;
const STORAGE_KEY = "photoGalleryFavourites";

let allPhotos = [];                       // all photos from the API
let currentPage = 1;                      // current page number
let favourites = loadFavourites();        // restored from localStorage

// ---------- DOM Selectors ----------
const searchInput = document.querySelector("#searchInput");
const statusBox = document.querySelector("#status");
const gallery = document.querySelector("#gallery");
const favGallery = document.querySelector("#favGallery");
const favCount = document.querySelector("#favCount");
const clearFavsBtn = document.querySelector("#clearFavs");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const pageInfo = document.querySelector("#pageInfo");

// ---------- Local Storage ----------
function loadFavourites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveFavourites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
}

// ---------- Status helpers (loading / error / empty) ----------
function showLoading(message) {
  statusBox.className = "status loading";
  statusBox.textContent = message;
}

function showError(message, retryFn) {
  statusBox.className = "status error";
  statusBox.textContent = message;
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Retry";
  retryBtn.addEventListener("click", retryFn);
  statusBox.appendChild(retryBtn);
}

function clearStatus() {
  statusBox.className = "status";
  statusBox.textContent = "";
}

// ---------- API call (fetch + async/await) ----------
async function fetchPhotos() {
  showLoading("Loading photos...");
  gallery.innerHTML = "";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Request failed: " + response.status);
    const data = await response.json();

    // Build our own photo objects (image URL is made from the photo id)
    allPhotos = data.map((photo) => ({
      id: photo.id,
      author: photo.author,
      url: `https://picsum.photos/id/${photo.id}/400/300`,
    }));

    clearStatus();
    render();
  } catch (error) {
    showError("Could not load photos. Check your internet connection.", fetchPhotos);
  }
}

// ---------- Logic ----------
function getFilteredPhotos() {
  const text = searchInput.value.trim().toLowerCase();
  return allPhotos.filter((photo) => photo.author.toLowerCase().includes(text));
}

function toggleFavourite(photo) {
  const exists = favourites.find((fav) => fav.id === photo.id);

  if (exists) {
    favourites = favourites.filter((fav) => fav.id !== photo.id);
  } else {
    favourites.push(photo);
  }

  saveFavourites();
  render();
}

// ---------- Rendering (DOM manipulation) ----------
function render() {
  const filtered = getFilteredPhotos();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PER_PAGE;
  const pagePhotos = filtered.slice(start, start + PER_PAGE);

  renderGallery(gallery, pagePhotos, "No photos found for that photographer.");
  renderFavourites();

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function renderGallery(container, photos, emptyMessage) {
  container.innerHTML = "";

  if (photos.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }

  photos.forEach((photo) => {
    const isSaved = favourites.find((fav) => fav.id === photo.id) !== undefined;

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = photo.url;
    img.alt = "Photo by " + photo.author;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body";

    const name = document.createElement("span");
    name.textContent = photo.author;

    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn" + (isSaved ? " saved" : "");
    favBtn.textContent = isSaved ? "★ Saved" : "☆ Save";
    favBtn.addEventListener("click", () => toggleFavourite(photo));

    body.append(name, favBtn);
    card.append(img, body);
    container.appendChild(card);
  });
}

function renderFavourites() {
  favCount.textContent = favourites.length;
  renderGallery(favGallery, favourites, "No favourites yet. Click ☆ Save on a photo.");
}

// ---------- Event Listeners ----------
searchInput.addEventListener("input", () => {
  currentPage = 1;
  render();
});

prevBtn.addEventListener("click", () => {
  currentPage--;
  render();
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  render();
});

clearFavsBtn.addEventListener("click", () => {
  favourites = [];
  saveFavourites();
  render();
});

// ---------- Start ----------
renderFavourites();
fetchPhotos();
