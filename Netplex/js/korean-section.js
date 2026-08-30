// ===================================
//  STICKY HEADER
// ===================================
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add("nav-solid");
        } else {
            nav.classList.remove("nav-solid");
        }
    }
});

// ==================================================
//  INTERACTIVE DROPDOWN MENU & MOBILE MENU TOGGLE
// ==================================================
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    }

    const mobileMoreBtn = document.getElementById("mobile-more-btn");
    const mobileMoreMenu = document.getElementById("mobile-more-menu");
    if (mobileMoreBtn && mobileMoreMenu) {
        mobileMoreBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            mobileMoreMenu.classList.toggle("show");
        });
        document.addEventListener("click", function (e) {
            if (!mobileMoreMenu.contains(e.target) && e.target !== mobileMoreBtn) {
                mobileMoreMenu.classList.remove("show");
            }
        });
    }

    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownButton && dropdownContent) {
        dropdownButton.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownContent.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.classList.remove("active");
            }
        });
    }
});

// ===================================
// KDRAMA SECTION
// ===================================
// ===================================
// 1. TMDB CONFIG
// ===================================
const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";
const currentYear = new Date().getFullYear();

let currentBannerItem = null;
let bannerItems = [];
let bannerIndex = 0;
let bannerInterval = null;
let movieGenreMap = {};
let tvGenreMap = {};

const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");
const bannerPlayButton = document.getElementById("banner-play-btn");

// ===================================
// 2. BANNER LOGIC
// ===================================
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

async function loadBannerItems() {
    try {
        const movieRequests = [];
        const tvRequests = [];

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

        const movies = moviePages.flatMap(data =>
            (data.results || []).map(item => ({
                ...item,
                media_type: "movie"
            }))
        );

        const tvShows = tvPages.flatMap(data =>
            (data.results || []).map(item => ({
                ...item,
                media_type: "tv"
            }))
        );

        const combinedItems = [...movies, ...tvShows].filter(item => item.backdrop_path);
        const seen = new Set();

        bannerItems = combinedItems.filter(item => {
            const key = `${item.media_type}-${item.id}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        shuffleBannerItems();

        if (bannerItems.length === 0) {
            console.error("No Korean movies or TV shows with backdrop images were found.");
            return;
        }

        showNextBanner();

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

function shuffleBannerItems() {
    for (let i = bannerItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bannerItems[i], bannerItems[j]] = [bannerItems[j], bannerItems[i]];
    }
}

function showNextBanner() {
    if (!bannerItems.length || !banner) return;

    currentBannerItem = bannerItems[bannerIndex];
    bannerIndex++;

    if (bannerIndex >= bannerItems.length) {
        bannerIndex = 0;
        shuffleBannerItems();
    }

    const item = currentBannerItem;

    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`;

    const originalTitle = item.title || item.name || "Unknown";
    const maxLength = 35;

    if (bannerTitle) {
        bannerTitle.textContent =
            originalTitle.length > maxLength
                ? originalTitle.substring(0, maxLength - 3) + "..."
                : originalTitle;
    }

    if (bannerDescription) {
        bannerDescription.textContent = item.overview || "No description available.";
    }

    const genreMap = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
    const genreNames = (item.genre_ids || [])
        .map(id => genreMap[id])
        .filter(Boolean)
        .join(", ");

    if (bannerGenre) {
        bannerGenre.textContent = `Genre: ${genreNames || "Unknown"}`;
    }
}

// Banner Play Action (Remote and Click Accessible)
if (bannerPlayButton) {
    bannerPlayButton.setAttribute("tabindex", "0");
    const launchBannerMedia = () => {
        if (!currentBannerItem) return;
        const item = currentBannerItem;
        window.location.href =
            item.media_type === "movie"
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
    };

    bannerPlayButton.addEventListener("click", launchBannerMedia);
    bannerPlayButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            launchBannerMedia();
        }
    });
}

async function startBannerSystem() {
    await loadBannerGenres();
    await loadBannerItems();
}

startBannerSystem();

// ===================================
// 3. MEDIA ROW GENERATION LOGIC
// ===================================
const mediaState = {};

function createMediaCard(item, type) {
    const mediaItem = document.createElement("div");
    mediaItem.classList.add("media-item");

    // Android TV Accessibility attributes
    mediaItem.setAttribute("tabindex", "0");
    mediaItem.setAttribute("role", "button");

    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || "").slice(0, 4) || "—";
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";

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
            <img src="${imgURL + item.poster_path}" alt="${title}" loading="lazy">
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `;

    const openDetails = () => {
        window.location.href =
            type === "movie"
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
    };

    // Mouse click support
    mediaItem.addEventListener("click", openDetails);

    // TV Remote D-Pad Center/OK selection support
    mediaItem.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            openDetails();
        }
    });

    // Centers the active poster on the screen when navigated by remote control
    mediaItem.addEventListener("focus", () => {
        mediaItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    return mediaItem;
}

async function fetchMedia(url, containerId, type, page = 1) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(`${url}&page=${page}`);
        const data = await response.json();

        if (!mediaState[containerId]) {
            mediaState[containerId] = {
                page: 1,
                loading: false
            };
        }

        const results = (data.results || []).filter(item => item.poster_path);

        results.forEach(item => {
            container.appendChild(createMediaCard(item, type));
        });

        mediaState[containerId].loading = false;
    } catch (err) {
        console.error(`Fetch media error for ${containerId}:`, err);
    }
}

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

    try {
        const responses = await Promise.all(allFetches);
        let allItems = [];

        for (const response of responses) {
            const data = await response.json();
            const type = response.url.includes("/movie") ? "movie" : "tv";
            const typedResults = (data.results || []).map(item => ({
                ...item,
                type: type
            }));
            allItems.push(...typedResults);
        }

        allItems
            .filter(item => item.poster_path)
            .forEach(item => {
                container.appendChild(createMediaCard(item, item.type));
            });
    } catch (err) {
        console.error(`Error loading new releases for ${containerId}:`, err);
    }
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

    if (containerId === "new-releases") return null;
    return urls[containerId];
}

function getTypeForContainer(containerId) {
    return containerId.includes("tv") || containerId.includes("animations") ? "tv" : "movie";
}

function scrollLeft(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.scrollBy({ left: -300, behavior: "smooth" });
    }
}

function scrollRight(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.scrollBy({ left: 300, behavior: "smooth" });

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
// 5. SMART TV D-PAD NAVIGATION SYSTEM
// ===================================
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
            // Weigh axes to prioritize straight lines over diagonals
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
    // D-Pad and standard direction keys
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Up", "Down", "Left", "Right"];
    if (keys.includes(e.key) || [37, 38, 39, 40].includes(e.keyCode)) {
        let dir = e.key;
        if (e.keyCode === 37 || e.key === "Left") dir = "ArrowLeft";
        if (e.keyCode === 38 || e.key === "Up") dir = "ArrowUp";
        if (e.keyCode === 39 || e.key === "Right") dir = "ArrowRight";
        if (e.keyCode === 40 || e.key === "Down") dir = "ArrowDown";

        e.preventDefault();
        navigateSpatial(dir);
    } else if (e.key === "Escape" || e.key === "Back" || e.keyCode === 10009 || e.keyCode === 27) {
        // Smart TV Back key dismiss listener
        closeMessage();
    }
});

// ===================================
// 6. INITIALIZATION AND UI HANDLERS
// ===================================
fetchNewReleases("new-releases", 3);
fetchMedia(getURLForContainer("popular-movies"), "popular-movies", "movie", 3);
fetchMedia(getURLForContainer("korean-tv-shows"), "korean-tv-shows", "tv", 3);

document.addEventListener("DOMContentLoaded", function () {
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

    const menuBtn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");
    if (menuBtn && menu) {
        menuBtn.addEventListener("click", function() {
            menu.classList.toggle("active");
        });
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
