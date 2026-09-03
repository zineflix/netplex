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

    // Dropdown More Button Handlers
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

/* =========================================
   TV SHOWS SECTION
========================================= */
const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";

let currentBannerItem = null;

const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");
const bannerPlayButton = document.getElementById("banner-play-btn");

async function fetchBanner() {
    if (!banner) return;
    try {
        const response = await fetch(
            `${baseURL}/trending/all/week?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();
        const validItems = (data.results || []).filter(item => item.backdrop_path);
        if (!validItems.length) return;

        const randomItem = validItems[Math.floor(Math.random() * validItems.length)];
        currentBannerItem = randomItem;

        banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;
        if (bannerTitle) bannerTitle.textContent = randomItem.title || randomItem.name;
        if (bannerDescription) bannerDescription.textContent = randomItem.overview || "No description available.";

        const genresResponse = await fetch(`${baseURL}/genre/tv/list?api_key=${apiKey}&language=en-US`);
        const genresData = await genresResponse.json();
        const genreMap = Object.fromEntries(genresData.genres.map(g => [g.id, g.name]));
        const genreNames = (randomItem.genre_ids || []).map(id => genreMap[id]).join(", ");

        if (bannerGenre) bannerGenre.textContent = `Genre: ${genreNames || "Unknown"}`;
    } catch (e) {
        console.error("Banner fetch error", e);
    }
}

// Banner Play Action (Works with TV Remote OK/Enter)
if (bannerPlayButton) {
    bannerPlayButton.setAttribute("tabindex", "0");
    const launchBannerMedia = () => {
        if (!currentBannerItem) return;
        const isMovie = currentBannerItem.media_type === "movie";
        window.location.href = isMovie
            ? `movie-details.html?movie_id=${currentBannerItem.id}`
            : `tvshows-details.html?id=${currentBannerItem.id}`;
    };

    bannerPlayButton.addEventListener("click", launchBannerMedia);
    bannerPlayButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) launchBannerMedia();
    });
}

// ===================================
// MEDIA CARD CREATION & FETCH
// ===================================
async function fetchMedia(url, containerId, type, pages = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let page = 1; page <= pages; page++) {
        try {
            const response = await fetch(`${url}&page=${page}`);
            const data = await response.json();

            (data.results || []).filter(item => item.poster_path).forEach(item => {
                const mediaItem = document.createElement("div");
                mediaItem.classList.add("media-item");

                // Enables Android TV remote focus
                mediaItem.setAttribute("tabindex", "0");
                mediaItem.setAttribute("role", "button");

                const title = item.name || item.title || "Unknown";
                const year = (item.first_air_date || item.release_date || "").slice(0, 4) || "—";
                const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

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
                    window.location.href = type === "movie"
                        ? `movie-details.html?movie_id=${item.id}`
                        : `tvshows-details.html?id=${item.id}`;
                };

                // Mouse Click Support
                mediaItem.addEventListener("click", openDetails);

                // Remote OK / Enter button support
                mediaItem.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                        openDetails();
                    }
                });

                // Auto-scroll focused card into screen center
                mediaItem.addEventListener("focus", () => {
                    mediaItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                });

                container.appendChild(mediaItem);
            });
        } catch (err) {
            console.error(`Error fetching page ${page} for ${containerId}:`, err);
        }
    }
}

// ==============================
// Initialization & Calls
// ==============================
const currentYear = new Date().getFullYear();

fetchBanner();

fetchMedia(
    `${baseURL}/discover/tv?api_key=${apiKey}&language=en-US&sort_by=first_air_date.desc&first_air_date_year=${currentYear}&vote_count.gte=10`,
    "new-tv-releases",
    "tv",
    5
);

fetchMedia(`${baseURL}/tv/on_the_air?api_key=${apiKey}&language=en-US`, "upcoming-tv", "tv", 10);
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=3000&vote_average=8`, "popular-tv-series", "tv", 10);
fetchMedia(`${baseURL}/trending/tv/week?api_key=${apiKey}`, "trending-tv-series", "tv", 10);
fetchMedia(`${baseURL}/tv/top_rated?api_key=${apiKey}&language=en-US`, "top-rated-tv-series", "tv", 10);
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=500&with_genres=9648`, "mystery-tv-series", "tv", 10);
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&vote_average.gte=3&vote_count.gte=3&with_genres=10749`, "romance-tv-series", "tv", 10);
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&vote_average.gte=6&with_genres=18`, "drama-tv-series", "tv", 10);
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=1000&with_genres=35`, "comedy-tv-series", "tv", 10);
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=500&with_genres=80`, "crime-tv-series", "tv", 10);

// ==============================
// Scroll Controls
// ==============================
function scrollLeft(containerId) {
    let container = document.getElementById(containerId);
    if (container) {
        container.scrollBy({ left: -300, behavior: "smooth" });
    }
}

function scrollRight(containerId) {
    let container = document.getElementById(containerId);
    if (container) {
        container.scrollBy({ left: 300, behavior: "smooth" });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".scroll-left").forEach(button => {
        button.addEventListener("click", function () {
            let targetId = this.nextElementSibling.id;
            scrollLeft(targetId);
        });
    });

    document.querySelectorAll(".scroll-right").forEach(button => {
        button.addEventListener("click", function () {
            let targetId = this.previousElementSibling.id;
            scrollRight(targetId);
        });
    });
});

// ===================================
// SMART TV D-PAD NAVIGATION SYSTEM
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
            // Favor items aligned along the movement axis
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
    } else if (e.key === "Escape" || e.key === "Back" || e.keyCode === 10009 || e.keyCode === 27) {
        const floatingMessage = document.getElementById("floating-message");
        if (floatingMessage && floatingMessage.style.display !== "none") {
            floatingMessage.style.display = "none";
        }
    }
});
