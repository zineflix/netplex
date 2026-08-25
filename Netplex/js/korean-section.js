// ===================================
// 1. TMDB CONFIG
// ===================================
const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";
const currentYear = new Date().getFullYear();

// Global variable to store the banner item's data for the play button
let currentBannerItem = null;
let bannerItems = [];
let bannerIndex = 0;
let bannerInterval = null;
let movieGenreMap = {};
let tvGenreMap = {};

// DOM elements
const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");
const bannerPlayButton = document.getElementById("banner-play-btn");

// ===================================
// 2. BANNER LOGIC
// ===================================

// Load movie and TV genres once
async function loadBannerGenres() {
    try {
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
            fetch(`${baseURL}/genre/movie/list?api_key=${apiKey}&language=en-US`),
            fetch(`${baseURL}/genre/tv/list?api_key=${apiKey}&language=en-US`)
        ]);

        const movieGenresData = await movieGenresResponse.json();
        const tvGenresData = await tvGenresResponse.json();

        movieGenreMap = Object.fromEntries(
            movieGenresData.genres.map(genre => [genre.id, genre.name])
        );

        tvGenreMap = Object.fromEntries(
            tvGenresData.genres.map(genre => [genre.id, genre.name])
        );
    } catch (error) {
        console.error("Failed to load banner genres:", error);
    }
}

// Load multiple pages of Korean movies and TV shows
async function loadBannerItems() {
    try {
        const movieRequests = [];
        const tvRequests = [];

        // Load 5 pages of Korean movies
        for (let page = 1; page <= 5; page++) {
            movieRequests.push(
                fetch(
                    `${baseURL}/discover/movie?api_key=${apiKey}` +
                    `&with_origin_country=KR` +
                    `&vote_average.gte=6.0` +
                    `&vote_count.gte=100` +
                    `&sort_by=popularity.desc` +
                    `&page=${page}`
                ).then(response => response.json())
            );
        }

        // Load 5 pages of Korean TV shows
        for (let page = 1; page <= 5; page++) {
            tvRequests.push(
                fetch(
                    `${baseURL}/discover/tv?api_key=${apiKey}` +
                    `&with_origin_country=KR` +
                    `&vote_average.gte=6.5` +
                    `&vote_count.gte=50` +
                    `&sort_by=popularity.desc` +
                    `&page=${page}`
                ).then(response => response.json())
            );
        }

        const [moviePages, tvPages] = await Promise.all([
            Promise.all(movieRequests),
            Promise.all(tvRequests)
        ]);

        // Add media type to movies
        const movies = moviePages.flatMap(data =>
            (data.results || []).map(item => ({
                ...item,
                media_type: "movie"
            }))
        );

        // Add media type to TV shows
        const tvShows = tvPages.flatMap(data =>
            (data.results || []).map(item => ({
                ...item,
                media_type: "tv"
            }))
        );

        // Combine movies and TV shows
        const combinedItems = [...movies, ...tvShows]
            .filter(item => item.backdrop_path);

        // Remove duplicates
        const seen = new Set();

        bannerItems = combinedItems.filter(item => {
            const key = `${item.media_type}-${item.id}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });

        // Shuffle the banners
        shuffleBannerItems();

        console.log(`Loaded ${bannerItems.length} Korean banner items.`);

        if (bannerItems.length === 0) {
            console.error("No Korean movies or TV shows with backdrop images were found.");
            return;
        }

        // Show first banner immediately
        showNextBanner();

        // Start 5-second rotation
        if (bannerInterval) {
            clearInterval(bannerInterval);
        }

        bannerInterval = setInterval(() => {
            showNextBanner();
        }, 5000);

    } catch (error) {
        console.error("Failed to load banner items:", error);
    }
}

// Shuffle banner items
function shuffleBannerItems() {
    for (let i = bannerItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bannerItems[i], bannerItems[j]] = [bannerItems[j], bannerItems[i]];
    }
}

// Show the next banner
function showNextBanner() {
    if (!bannerItems.length) {
        return;
    }

    currentBannerItem = bannerItems[bannerIndex];
    bannerIndex++;

    // When all banners have been shown, shuffle and start again
    if (bannerIndex >= bannerItems.length) {
        bannerIndex = 0;
        shuffleBannerItems();
    }

    const item = currentBannerItem;

    // Set background
    banner.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`;

    // Set title
    const originalTitle = item.title || item.name || "Unknown";
    const maxLength = 35;

    bannerTitle.textContent =
        originalTitle.length > maxLength
            ? originalTitle.substring(0, maxLength - 3) + "..."
            : originalTitle;

    // Set description
    bannerDescription.textContent =
        item.overview || "No description available.";

    // Set genre
    const genreMap =
        item.media_type === "movie"
            ? movieGenreMap
            : tvGenreMap;

    const genreNames = (item.genre_ids || [])
        .map(id => genreMap[id])
        .filter(Boolean)
        .join(", ");

    bannerGenre.textContent =
        `Genre: ${genreNames || "Unknown"}`;
}

// ===================================
// BANNER PLAY BUTTON
// ===================================
if (bannerPlayButton) {
    bannerPlayButton.addEventListener("click", () => {
        if (!currentBannerItem) {
            console.error("Banner item data not loaded yet.");
            return;
        }

        const item = currentBannerItem;

        window.location.href =
            item.media_type === "movie"
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
    });
}

// Start banner system
async function startBannerSystem() {
    await loadBannerGenres();
    await loadBannerItems();
}

startBannerSystem();

// ===================================
// 3. MEDIA ROW GENERATION LOGIC
// ===================================
const mediaState = {};

async function fetchMedia(url, containerId, type, page = 1) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const response = await fetch(`${url}&page=${page}`);
    const data = await response.json();

    if (!mediaState[containerId]) {
        mediaState[containerId] = {
            page: 1,
            loading: false
        };
    }

    const results = data.results.filter(item => item.poster_path);

    results.forEach(item => {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");

        const title = item.title || item.name;
        const year = (item.release_date || item.first_air_date || "").slice(0, 4) || "—";
        const rating = item.vote_average.toFixed(1);

        mediaItem.innerHTML = `
            <div class="poster-title" title="${title}">${title}</div>
            <div class="poster-card">
                <div class="rating">
                    <span class="star"><i class="fas fa-star"></i></span>
                    <span class="rating-number">${rating}</span>
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
            window.location.href =
                type === "movie"
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

    const allFetches = [];

    for (let page = 1; page <= pages; page++) {
        allFetches.push(
            fetch(
                `${baseURL}/discover/movie?api_key=${apiKey}` +
                `&primary_release_year=${currentYear}` +
                `&with_origin_country=KR` +
                `&vote_count.gte=0` +
                `&sort_by=popularity.desc` +
                `&page=${page}`
            ),
            fetch(
                `${baseURL}/discover/tv?api_key=${apiKey}` +
                `&first_air_date_year=${currentYear}` +
                `&with_origin_country=KR` +
                `&vote_count.gte=0` +
                `&sort_by=popularity.desc` +
                `&page=${page}`
            )
        );
    }

    const responses = await Promise.all(allFetches);

    let allItems = [];

    for (const response of responses) {
        const data = await response.json();

        const type =
            response.url.includes("/movie")
                ? "movie"
                : "tv";

        const typedResults = data.results.map(item => ({
            ...item,
            type: type
        }));

        allItems.push(...typedResults);
    }

    allItems
        .filter(item => item.poster_path)
        .forEach(item => {
            const mediaItem = document.createElement("div");
            mediaItem.classList.add("media-item");

            const rating = item.vote_average.toFixed(1);
            const yearText =
                (item.release_date || item.first_air_date || "").slice(0, 4) || "—";
            const title = item.title || item.name;

            mediaItem.innerHTML = `
                <div class="poster-title" title="${title}">${title}</div>
                <div class="poster-card">
                    <div class="rating">
                        <span class="star"><i class="fas fa-star"></i></span>
                        <span class="rating-number">${rating}</span>
                    </div>
                    <img src="${imgURL + item.poster_path}" alt="${title}">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    ${yearText ? `<div class="year-container">${yearText}</div>` : ""}
                </div>
            `;

            mediaItem.addEventListener("click", () => {
                window.location.href =
                    item.type === "movie"
                        ? `movie-details.html?movie_id=${item.id}`
                        : `tvshows-details.html?id=${item.id}`;
            });

            container.appendChild(mediaItem);
        });
}

// ===================================
// 4. SCROLLING AND LAZY LOADING
// ===================================

function getURLForContainer(containerId) {
    const urls = {
        "popular-movies":
            `${baseURL}/discover/movie?api_key=${apiKey}&with_origin_country=KR&vote_average.gte=6.5&vote_count.gte=500&sort_by=popularity.desc`,
        "korean-tv-shows":
            `${baseURL}/discover/tv?api_key=${apiKey}&with_origin_country=KR&vote_average.gte=7.5&vote_count.gte=200&sort_by=popularity.desc`
    };

    if (containerId === "new-releases") {
        return null;
    }

    return urls[containerId];
}

function getTypeForContainer(containerId) {
    return containerId.includes("tv") ||
           containerId.includes("animations")
        ? "tv"
        : "movie";
}

function scrollLeft(containerId) {
    const container = document.getElementById(containerId);

    if (container) {
        container.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    } else {
        console.error("Container not found:", containerId);
    }
}

function scrollRight(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.scrollBy({
        left: 300,
        behavior: "smooth"
    });

    // Lazy load more when near end
    if (
        container.scrollLeft + container.clientWidth >= container.scrollWidth - 300 &&
        mediaState[containerId] &&
        !mediaState[containerId].loading &&
        containerId !== "new-releases"
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
// 5. INITIALIZATION AND UI HANDLERS
// ===================================

// Initial Data Load
// Banner is initialized by startBannerSystem() above.
fetchNewReleases("new-releases", 3);
fetchMedia(
    getURLForContainer("popular-movies"),
    "popular-movies",
    "movie",
    3
);
fetchMedia(
    getURLForContainer("korean-tv-shows"),
    "korean-tv-shows",
    "tv",
    3
);

document.addEventListener("DOMContentLoaded", function () {
    // Attach event listeners to buttons
    document.querySelectorAll(".scroll-left").forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.nextElementSibling.id;
            scrollLeft(targetId);
        });
    });

    document.querySelectorAll(".scroll-right").forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.previousElementSibling.id;
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

    // Dropdown More Button Function
    const dropdown = document.querySelector(".dropdown");

    if (dropdown) {
        dropdown.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    }
});

// ===================================
// 6. STICKY HEADER
// ===================================

window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");

    if (!nav) return;

    if (window.scrollY > 50) {
        nav.classList.add("nav-solid");
    } else {
        nav.classList.remove("nav-solid");
    }
});

// ===================================
// 7. FLOATING MESSAGE
// ===================================

function closeMessage() {
    const message = document.getElementById("floating-message");

    if (message) {
        message.style.display = "none";
    }
}

// ===================================
// 8. MOBILE NAVIGATION
// ===================================

document.addEventListener("DOMContentLoaded", function () {
    const moreButton =
        document.getElementById("mobile-more-btn");

    const moreMenu =
        document.getElementById("mobile-more-menu");

    if (!moreButton || !moreMenu) return;

    // Open / close More menu
    moreButton.addEventListener("click", function (event) {
        event.stopPropagation();

        moreMenu.classList.toggle("show");
        moreButton.classList.toggle("active");
    });

    // Prevent popup from closing when clicking inside
    moreMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Close popup when clicking elsewhere
    document.addEventListener("click", function () {
        moreMenu.classList.remove("show");
        moreButton.classList.remove("active");
    });
});