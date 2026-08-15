const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";

const currentYear = new Date().getFullYear();

// Global variable to store the banner item's data for the play button
let currentBannerItem = null;

// DOM elements
const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");
const bannerPlayButton = document.getElementById("banner-play-btn");

// ===================================
// 1. BANNER LOGIC
// ===================================

async function fetchBanner() {
    // 1. Fetch New Releases for the current year (movies and TV) concurrently
    const [movieRes, tvRes] = await Promise.all([
        fetch(`${baseURL}/discover/movie?api_key=${apiKey}&primary_release_year=${currentYear}&sort_by=popularity.desc&page=1`),
        fetch(`${baseURL}/discover/tv?api_key=${apiKey}&first_air_date_year=${currentYear}&sort_by=popularity.desc&page=1`)
    ]);
    
    const movieData = await movieRes.json();
    const tvData = await tvRes.json();

    // Add media type property for consistent handling later
    const movies = movieData.results.map(item => ({...item, media_type: 'movie'}));
    const tvShows = tvData.results.map(item => ({...item, media_type: 'tv'}));

    const allNewReleases = [...movies, ...tvShows].filter(item => item.backdrop_path);

    if (allNewReleases.length === 0) {
        console.error("No new releases found to set as banner.");
        return;
    }

    // 2. Select a random item
    const randomItem = allNewReleases[Math.floor(Math.random() * allNewReleases.length)];

    currentBannerItem = randomItem;

    // 3. Set banner background and content
    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;
    
    const originalTitle = randomItem.title || randomItem.name;
    const maxLength = 35; 
    let displayTitle = originalTitle;

    // Title truncation
    if (originalTitle.length > maxLength) {
        displayTitle = originalTitle.substring(0, maxLength - 3) + '...';
    }

    bannerTitle.textContent = displayTitle; 
    bannerDescription.textContent = randomItem.overview || "No description available.";
    
    // 4. Fetch and display genres
    const mediaType = randomItem.media_type;
    const genresResponse = await fetch(`${baseURL}/genre/${mediaType}/list?api_key=${apiKey}&language=en-US`);
    const genresData = await genresResponse.json();
    const genreMap = Object.fromEntries(genresData.genres.map(g => [g.id, g.name]));
    const genreNames = (randomItem.genre_ids || []).map(id => genreMap[id]).join(", ");
    
    bannerGenre.textContent = `Genre: ${genreNames || "Unknown"}`;
}

// Attach event listener for the banner play button
if (bannerPlayButton) {
    bannerPlayButton.addEventListener("click", () => {
        if (!currentBannerItem) {
            console.error("Banner item data not loaded yet.");
            return;
        }
        
        const item = currentBannerItem;
        const mediaType = item.media_type;

        window.location.href = mediaType === "movie"
            ? `movie-details.html?movie_id=${item.id}`
            : `tvshows-details.html?id=${item.id}`;
    });
}

// ===================================
// 2. MEDIA ROW GENERATION LOGIC
// ===================================

const mediaState = {};

async function fetchMedia(url, containerId, type, page = 1) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const response = await fetch(`${url}&page=${page}`);
    const data = await response.json();

    if (!mediaState[containerId]) {
        mediaState[containerId] = { page: 1, loading: false };
    }
    
    const results = data.results.filter(item => item.poster_path);

    results.forEach(item => {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");

        const title = item.title || item.name;
        const year = (item.release_date || item.first_air_date || '').slice(0, 4) || '—';
        const rating = item.vote_average.toFixed(1);
        
        mediaItem.innerHTML = `
            <div class="poster-title" title="${title}">${title}</div>
            <div class="poster-card">
                <div class="rating">
                    <span class="star"><i class="fas fa-star"></i></span> <span class="rating-number">${rating}</span>
                </div>
                <div class="year-container">
                    <span class="year">${year}</span>
                </div>
                <img src="${imgURL + item.poster_path}" alt="${title}">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        `;

        mediaItem.addEventListener("click", () => {
            window.location.href = type === "movie" 
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
        });

        container.appendChild(mediaItem);
    });

    mediaState[containerId].loading = false;
}

// Fetch both Movies & TV released in the current year
async function fetchNewReleases(containerId, pages = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create an array of Promises for all page fetches (5 pages * 2 types = 10 calls)
    const allFetches = [];
    for (let page = 1; page <= pages; page++) {
        allFetches.push(
            fetch(`${baseURL}/discover/movie?api_key=${apiKey}&primary_release_year=${currentYear}&sort_by=popularity.desc&page=${page}`),
            fetch(`${baseURL}/discover/tv?api_key=${apiKey}&first_air_date_year=${currentYear}&sort_by=popularity.desc&page=${page}`)
        );
    }

    // Execute all fetches concurrently
    const responses = await Promise.all(allFetches);
    
    let allItems = [];
    for (const response of responses) {
        const data = await response.json();
        // Explicitly set media type here for consistent click handling
        const type = response.url.includes('/movie') ? 'movie' : 'tv';
        const typedResults = data.results.map(item => ({...item, type: type}));
        allItems.push(...typedResults);
    }
    
    // Process all items
    allItems.filter(item => item.poster_path).forEach(item => {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");

        const rating = item.vote_average.toFixed(1);
        const yearText = (item.release_date || item.first_air_date || "").slice(0,4) || "—";
        const title = item.title || item.name;

        mediaItem.innerHTML = `
            <div class="poster-title" title="${title}">${title}</div>
            <div class="poster-card">
                <div class="rating">
                    <span class="star"><i class="fas fa-star"></i></span> 
                    <span class="rating-number">${rating}</span>
                </div>
                <img src="${imgURL + item.poster_path}" alt="${title}">
                <div class="play-button"><i class="fas fa-play"></i></div>
                ${yearText ? `<div class="year-container">${yearText}</div>` : ""}
            </div>
        `;

        mediaItem.addEventListener("click", () => {
            window.location.href = item.type === "movie"
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
        });

        container.appendChild(mediaItem);
    });
}

// ===================================
// 3. SCROLLING AND LAZY LOADING
// (Moved to Global Scope)
// ===================================

function getURLForContainer(containerId) {
    const urls = {
        "popular-movies": `${baseURL}/discover/movie?api_key=${apiKey}&vote_count.gte=500&sort_by=popularity.desc`, // Removed &vote_average=10
        "popular-tv-shows": `${baseURL}/discover/tv?api_key=${apiKey}&vote_count.gte=5000&sort_by=popularity.desc`, // Removed &vote_average=10
        "korean-tv-shows": `${baseURL}/discover/tv?api_key=${apiKey}&with_origin_country=KR&vote_count.gte=300&sort_by=popularity.desc`,
        "japanese-animations": `${baseURL}/discover/tv?api_key=${apiKey}&with_origin_country=JP&with_genres=16&vote_count.gte=500&sort_by=popularity.desc`,
        "philippine-movies": `${baseURL}/discover/movie?api_key=${apiKey}&with_companies=149142&sort_by=popularity.desc`,
    };
    // Special case for New Releases which is handled by a separate function
    if (containerId === "new-releases") return null; 
    return urls[containerId];
}

function getTypeForContainer(containerId) {
    return containerId.includes("tv") || containerId.includes("animations") ? "tv" : "movie";
}

function scrollLeft(containerId) {
    let container = document.getElementById(containerId);
    if (container) {
        container.scrollBy({ left: -300, behavior: "smooth" });
    } else {
        console.error("Container not found:", containerId);
    }
}

function scrollRight(containerId) {
    let container = document.getElementById(containerId);
    if (!container) return;

    container.scrollBy({ left: 300, behavior: "smooth" });

    // Lazy load more when near end
    if (
        container.scrollLeft + container.clientWidth >= container.scrollWidth - 300 &&
        mediaState[containerId] && 
        !mediaState[containerId].loading &&
        containerId !== "new-releases" // Don't lazy load the New Releases section
    ) {
        mediaState[containerId].loading = true;
        mediaState[containerId].page++;
        const nextPage = mediaState[containerId].page;

        const url = getURLForContainer(containerId);
        const type = getTypeForContainer(containerId);
        if (url) {
            fetchMedia(url, containerId, type, nextPage);
        }
    }
}


// ===================================
// 4. INITIALIZATION AND UI HANDLERS
// ===================================

// Initial Data Load
fetchBanner();
fetchNewReleases("new-releases", 3); // Load 3 pages of new releases
fetchMedia(getURLForContainer("popular-movies"), "popular-movies", "movie", 3);
fetchMedia(getURLForContainer("popular-tv-shows"), "popular-tv-shows", "tv", 3);
fetchMedia(getURLForContainer("korean-tv-shows"), "korean-tv-shows", "tv", 3);
fetchMedia(getURLForContainer("japanese-animations"), "japanese-animations", "tv", 3);
fetchMedia(getURLForContainer("philippine-movies"), "philippine-movies", "movie", 3);


document.addEventListener("DOMContentLoaded", function () {
    // Attach event listeners to buttons
    document.querySelectorAll(".scroll-left").forEach(button => {
        button.addEventListener("click", function () {
            // Target is the next element sibling (the media-row)
            let targetId = this.nextElementSibling.id;
            scrollLeft(targetId);
        });
    });

    document.querySelectorAll(".scroll-right").forEach(button => {
        button.addEventListener("click", function () {
            // Target is the previous element sibling (the media-row)
            let targetId = this.previousElementSibling.id;
            scrollRight(targetId);
        });
    });
    
    // Toggle menu visibility when menu button is clicked
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");
    if (menuBtn && menu) {
        menuBtn.addEventListener("click", function() {
            menu.classList.toggle("active");
        });
    }

    // Dropdown More Button Function Start
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.addEventListener("click", function () {
            // This toggle is mainly for mobile views where hover doesn't work well
            this.classList.toggle("active");
        });
    }
});


// Handle Sticky Header (Combined and fixed)
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Solid color after scrolling down
    } else {
        nav.classList.remove("nav-solid"); // Transparent at the top
    }
});

// For Floating Message Close Function Start (Kept for completeness, though already in HTML)
function closeMessage() {
    document.getElementById("floating-message").style.display = "none";
}
// For Floating Message Close Function End
