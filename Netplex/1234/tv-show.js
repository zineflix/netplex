const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";

// Function to fetch and set a random trending movie/TV show as a banner
const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");

async function fetchBanner() {
    const response = await fetch(
        `${baseURL}/trending/all/week?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const randomItem = data.results[Math.floor(Math.random() * data.results.length)];

    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;
    bannerTitle.textContent = randomItem.title || randomItem.name;
    bannerDescription.textContent = randomItem.overview || "No description available.";

    // Fetch genres (for TV this can be replaced with TV genre list if needed)
    const genresResponse = await fetch(`${baseURL}/genre/tv/list?api_key=${apiKey}&language=en-US`);
    const genresData = await genresResponse.json();
    const genreMap = Object.fromEntries(genresData.genres.map(g => [g.id, g.name]));
    const genreNames = (randomItem.genre_ids || []).map(id => genreMap[id]).join(", ");

    bannerGenre.textContent = `Genre: ${genreNames || "Unknown"}`;
}

async function fetchMedia(url, containerId, type, pages = 3) {
    const container = document.getElementById(containerId);
    for (let page = 1; page <= pages; page++) {
        const response = await fetch(`${url}&page=${page}`);
        const data = await response.json();

        data.results.forEach(item => {
            const mediaItem = document.createElement("div");
            mediaItem.classList.add("media-item");

            const year = (item.first_air_date || item.release_date || "").slice(0, 4) || "—";
            const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

            mediaItem.innerHTML = `
                <div class="poster-title" title="${item.name || item.title}">${item.name || item.title}</div>
                <div class="poster-card">
                    <div class="rating">
                        <span class="star"><i class="fas fa-star"></i></span>
                        <span class="rating-number">${rating}</span>
                    </div>
                    <div class="year-container">
                        <span class="year">${year}</span>
                    </div>
                    <img src="${imgURL + item.poster_path}" alt="${item.name || item.title}">
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
    }
}

// ==============================
// Get Current Year
// ==============================
const currentYear = new Date().getFullYear();

// ==============================
// Load Data
// ==============================
fetchBanner();

// ✅ New Releases (TV Shows this year)
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
document.addEventListener("DOMContentLoaded", function () {
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
        if (container) {
            container.scrollBy({ left: 300, behavior: "smooth" });
        } else {
            console.error("Container not found:", containerId);
        }
    }

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

// ==============================
// Responsive Header
// ==============================
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid");
    } else {
        nav.classList.remove("nav-solid");
    }
});

// ==============================
// Toggle Menu
// ==============================
document.getElementById("menu-btn").addEventListener("click", function () {
    document.getElementById("menu").classList.toggle("active");
});

// ==============================
// Dropdown Toggle
// ==============================
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    }
});
