# 📷 Photo Gallery

An interactive web application built with **HTML, CSS and JavaScript** for
**CSE-2340 Software Development I – MP3/MP4** (International Islamic University Chittagong).

## 🔗 Live Demo (Vercel)

**Deployed link:** https://sdminiproject3and4.vercel.app/

## 📂 GitHub Repository

https://github.com/Kaify-36/sdminiproject3and4
## About

Photo Gallery loads photos from an external API, lets you search by photographer
name, browse pages of photos, and save favourites. Favourites stay saved even
after refreshing the page.

## API Used

[Lorem Picsum](https://picsum.photos/) – free, no API key required.

- `GET https://picsum.photos/v2/list?page=1&limit=60` – list of photos (id, author, size)
- `https://picsum.photos/id/{id}/400/300` – the image itself

## Features

- Fetches data using `fetch()` with `async/await`
- Loading, error (with Retry button) and empty states
- Live search by photographer name
- Pagination (Prev / Next)
- Save / remove favourite photos
- Favourites stored in `localStorage` (persist after refresh)
- Responsive layout

## Requirements Mapping

| Requirement | Where in the code |
|---|---|
| DOM manipulation & dynamic rendering | `render()`, `renderGallery()`, `renderFavourites()` |
| Event handling & JS logic | `addEventListener()` calls; `map()`, `filter()`, `forEach()`, `find()`, `slice()` |
| API integration & async operations | `fetchPhotos()`, status helpers |
| Local Storage | `loadFavourites()`, `saveFavourites()` |

## How to Run Locally

1. Download or clone this repository.
2. Open `index.html` in your browser (or use the VS Code "Live Server" extension).

## Project Structure

```
photo-gallery/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Author

Md Hasnat Monowar Kaify – C253072
