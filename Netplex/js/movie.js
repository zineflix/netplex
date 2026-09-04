// ============================================================
// TMDB CONFIG
// ============================================================
const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";

// ============================================================
// DOM ELEMENTS
// ============================================================
const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");

// ============================================================
// TMDB REQUEST
// ============================================================
async function tmdbFetch(endpoint, params = {}) {
    try {
        const url = new URL(`${baseURL}${endpoint}`);
        url.searchParams.set("api_key", apiKey);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, value);
            }
        });

        console.log("TMDB Request:", url.toString());

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`TMDB HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status_code) {
            throw new Error(`TMDB Error ${data.status_code}: ${data.status_message}`);
        }

        return data;
    } catch (error) {
        console.error("TMDB request failed:", error);
        throw error;
    }
}

// ============================================================
// MOVIE GENRES
// ============================================================
let movieGenreMap = {};

async function loadMovieGenres() {
    try {
        const data = await tmdbFetch("/genre/movie/list", {
            language: "en-US"
        });

        if (data.genres) {
            movieGenreMap = Object.fromEntries(
                data.genres.map(genre => [genre.id, genre.name])
            );
        }
    } catch (error) {
        console.error("Unable to load movie genres:", error);
    }
}

// ============================================================
// BANNER
// ============================================================
async function fetchBanner() {
    if (!banner) return;

    try {
        const data = await tmdbFetch("/trending/all/week", {
            language: "en-US"
        });

        const bannerItems = (data.results || []).filter(
            item => item.backdrop_path
        );

        if (!bannerItems.length) return;

        const randomItem =
            bannerItems[Math.floor(Math.random() * bannerItems.length)];

        banner.style.backgroundImage =
            `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;

        if (bannerTitle) {
            bannerTitle.textContent =
                randomItem.title || randomItem.name || "Unknown";
        }

        if (bannerDescription) {
            bannerDescription.textContent =
                randomItem.overview || "No description available.";
        }

        if (bannerGenre) {
            const genres = (randomItem.genre_ids || [])
                .map(id => movieGenreMap[id])
                .filter(Boolean)
                .join(", ");

            bannerGenre.textContent = `Genre: ${genres || "Unknown"}`;
        }

        // Wire Play Button to redirect based on media type
        const playBtn = document.getElementById("banner-play-btn");
        if (playBtn) {
            const openBannerMedia = () => {
                const isTv = randomItem.media_type === "tv" || !randomItem.title;
                if (isTv) {
                    window.location.href = `tvshows-details.html?id=${randomItem.id}`;
                } else {
                    window.location.href = `movie-details.html?movie_id=${randomItem.id}`;
                }
            };

            playBtn.onclick = openBannerMedia;
            playBtn.onkeydown = (e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                    openBannerMedia();
                }
            };
        }
    } catch (error) {
        console.error("Failed to load banner:", error);
    }
}

// ============================================================
// ESCAPE HTML
// ============================================================
function escapeHTML(value) {
    if (value === undefined || value === null) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================================
// CREATE MEDIA CARD (WITH ANDROID TV SUPPORT)
// ============================================================
function createMediaCard(item, type = "movie") {
    if (!item || !item.id || !item.poster_path) {
        return null;
    }

    const mediaItem = document.createElement("div");
    mediaItem.classList.add("media-item");
    mediaItem.setAttribute("tabindex", "0");
    mediaItem.setAttribute("role", "button");

    const title = item.title || item.name || "Unknown";
    const year = (
        item.release_date ||
        item.first_air_date ||
        ""
    ).slice(0, 4) || "—";

    const rating =
        typeof item.vote_average === "number"
            ? item.vote_average.toFixed(1)
            : "0.0";

    mediaItem.innerHTML = `
        <div class="poster-title" title="${escapeHTML(title)}">
            ${escapeHTML(title)}
        </div>
        <div class="poster-card">
            <div class="rating">
                <span class="star">
                    <i class="fas fa-star"></i>
                </span>
                <span class="rating-number">${rating}</span>
            </div>
            <div class="year-container">
                <span class="year">${year}</span>
            </div>
            <img
                src="${imgURL}${item.poster_path}"
                alt="${escapeHTML(title)}"
                loading="lazy"
            >
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `;

    const openDetails = () => {
        if (type === "movie") {
            window.location.href = `movie-details.html?movie_id=${item.id}`;
        } else {
            window.location.href = `tvshows-details.html?id=${item.id}`;
        }
    };

    mediaItem.addEventListener("click", openDetails);

    mediaItem.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            openDetails();
        }
    });

    mediaItem.addEventListener("focus", () => {
        mediaItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    return mediaItem;
}

// ============================================================
// FETCH MEDIA
// ============================================================
async function fetchMedia(endpoint, containerId, type = "movie", params = {}) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container not found: #${containerId}`);
        return;
    }

    try {
        const data = await tmdbFetch(endpoint, {
            language: "en-US",
            page: 1,
            ...params
        });

        if (!Array.isArray(data.results)) {
            throw new Error("TMDB returned no results.");
        }

        container.innerHTML = "";

        data.results.forEach(item => {
            const card = createMediaCard(item, type);
            if (card) {
                container.appendChild(card);
            }
        });

        if (!container.children.length) {
            container.innerHTML = `
                <p style="color:#aaa;padding:20px;">
                    No movies available.
                </p>
            `;
        }
    } catch (error) {
        console.error(`Failed to load ${containerId}:`, error);
        container.innerHTML = `
            <p style="color:#aaa;padding:20px;">
                Unable to load movies.
            </p>
        `;
    }
}

// ============================================================
// LOAD MOVIE SECTIONS
// ============================================================
function loadMovieSections() {
    fetchMedia("/movie/upcoming", "upcoming-movies", "movie");
    fetchMedia("/discover/movie", "popular-movies", "movie", {
        sort_by: "popularity.desc",
        vote_count_gte: 500,
        vote_average_gte: 7
    });
    fetchMedia("/trending/movie/week", "trending-now", "movie");
    fetchMedia("/movie/top_rated", "top-rated", "movie");
    fetchMedia("/discover/movie", "action-movies", "movie", {
        sort_by: "popularity.desc",
        with_genres: "28"
    });
    fetchMedia("/discover/movie", "comedy-movies", "movie", {
        sort_by: "popularity.desc",
        with_genres: "35"
    });
    fetchMedia("/discover/movie", "horror-movies", "movie", {
        sort_by: "popularity.desc",
        with_genres: "27"
    });
    fetchMedia("/discover/movie", "romance-movies", "movie", {
        sort_by: "popularity.desc",
        with_genres: "10749"
    });
    fetchMedia("/discover/movie", "animation-movies", "movie", {
        sort_by: "popularity.desc",
        with_genres: "16"
    });
    fetchMedia("/discover/movie", "philippine-movies", "movie", {
        sort_by: "popularity.desc",
        with_companies: "149142"
    });  
}

// ============================================================
// HORIZONTAL SCROLL
// ============================================================
function scrollLeft(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.scrollBy({ left: -600, behavior: "smooth" });
}

function scrollRight(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.scrollBy({ left: 600, behavior: "smooth" });
}

window.scrollLeft = scrollLeft;
window.scrollRight = scrollRight;

// ============================================================
// SCROLL BUTTONS
// ============================================================
function initializeScrollButtons() {
    document.querySelectorAll(".scroll-left").forEach(button => {
        button.addEventListener("click", () => {
            const container = button.nextElementSibling;
            if (container) scrollLeft(container.id);
        });
    });

    document.querySelectorAll(".scroll-right").forEach(button => {
        button.addEventListener("click", () => {
            const container = button.previousElementSibling;
            if (container) scrollRight(container.id);
        });
    });
}

// ============================================================
// NAVIGATION
// ============================================================
function initializeNavigation() {
    const nav = document.querySelector("nav");

    window.addEventListener("scroll", () => {
        if (!nav) return;
        if (window.scrollY > 50) {
            nav.classList.add("nav-solid");
        } else {
            nav.classList.remove("nav-solid");
        }
    });

    const menuButton = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }

    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        const dropButton = dropdown.querySelector(".dropbtn");
        if (dropButton) {
            dropButton.addEventListener("click", event => {
                event.stopPropagation();
                dropdown.classList.toggle("active");
            });
        }
    }

    document.addEventListener("click", event => {
        const dropdown = document.querySelector(".dropdown");
        if (dropdown && !dropdown.contains(event.target)) {
            dropdown.classList.remove("active");
        }
    });
}

// ============================================================
// INITIALIZE
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("NETPLEX MOVIE PAGE INITIALIZING...");

    initializeNavigation();
    initializeScrollButtons();

    await loadMovieGenres();
    fetchBanner();
    loadMovieSections();
});

// ===================================
//  MOBILE NAVIGATION
// ===================================
document.addEventListener("DOMContentLoaded", function () {
    const moreButton = document.getElementById("mobile-more-btn");
    const moreMenu = document.getElementById("mobile-more-menu");

    if (!moreButton || !moreMenu) return;

    moreButton.addEventListener("click", function (event) {
        event.stopPropagation();
        moreMenu.classList.toggle("show");
        moreButton.classList.toggle("active");
    });

    moreMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        moreMenu.classList.remove("show");
        moreButton.classList.remove("active");
    });
});

// ============================================================
// SMART TV D-PAD NAVIGATION SYSTEM
// ============================================================
function navigateSpatial(direction) {
    const focusables = Array.from(document.querySelectorAll('[tabindex="0"], a[href], button, input'))
        .filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        });

    let current = document.activeElement;
    if (!current || !focusables.includes(current)) {
        if (focusables.length > 0) focusables[0].focus();
        return;
    }

    const currentRect = current.getBoundingClientRect();
    const currentCenter = {
        x: currentRect.left + currentRect.width / 2,
        y: currentRect.top + currentRect.height / 2
    };

    let bestCandidate = null;
    let bestDistance = Infinity;

    focusables.forEach(candidate => {
        if (candidate === current) return;
        const rect = candidate.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        let isValid = false;
        if (direction === "ArrowRight" && center.x > currentCenter.x + 5) isValid = true;
        if (direction === "ArrowLeft" && center.x < currentCenter.x - 5) isValid = true;
        if (direction === "ArrowDown" && center.y > currentCenter.y + 5) isValid = true;
        if (direction === "ArrowUp" && center.y < currentCenter.y - 5) isValid = true;

        if (isValid) {
            const dx = center.x - currentCenter.x;
            const dy = center.y - currentCenter.y;
            const distance = (direction === "ArrowLeft" || direction === "ArrowRight")
                ? Math.abs(dx) + Math.abs(dy) * 2.5
                : Math.abs(dy) + Math.abs(dx) * 2.5;

            if (distance < bestDistance) {
                bestDistance = distance;
                bestCandidate = candidate;
            }
        }
    });

    if (bestCandidate) {
        bestCandidate.focus();
    }
}

window.addEventListener("keydown", (e) => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Up", "Down", "Left", "Right"];
    if (keys.includes(e.key) || [37, 38, 39, 40].includes(e.keyCode)) {
        let dir = e.key;
        if (e.keyCode === 37 || e.key === "Left") dir = "ArrowLeft";
        if (e.keyCode === 38 || e.key === "Up") dir = "ArrowUp";
        if (e.keyCode === 39 || e.key === "Right") dir = "ArrowRight";
        if (e.keyCode === 40 || e.key === "Down") dir = "ArrowDown";

        e.preventDefault();
        navigateSpatial(dir);
    }
});
