// ==============================
// TMDB CONFIG
// ==============================
const apiKey = "a1PDx4Vtw4Y4F6XfduRwwS6nKZ6sPAC9nCeR";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";


// ==============================
// BANNER
// ==============================
const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");

async function fetchBanner() {
    try {
        const response = await fetch(
            `${baseURL}/trending/all/week?api_key=${apiKey}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`Banner HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return;
        }

        const randomItem =
            data.results[Math.floor(Math.random() * data.results.length)];

        if (randomItem.backdrop_path) {
            banner.style.backgroundImage =
                `url("https://image.tmdb.org/t/p/original${randomItem.backdrop_path}")`;
        }

        bannerTitle.textContent =
            randomItem.title || randomItem.name || "Untitled";

        bannerDescription.textContent =
            randomItem.overview || "No description available.";

        // Get movie genres
        const movieGenresResponse = await fetch(
            `${baseURL}/genre/movie/list?api_key=${apiKey}&language=en-US`
        );

        const movieGenresData = await movieGenresResponse.json();

        const genreMap = Object.fromEntries(
            movieGenresData.genres.map(g => [g.id, g.name])
        );

        const genreNames = (randomItem.genre_ids || [])
            .map(id => genreMap[id])
            .filter(Boolean)
            .join(", ");

        bannerGenre.textContent =
            `Genre: ${genreNames || "Unknown"}`;

    } catch (error) {
        console.error("Banner error:", error);
    }
}


// ==============================
// FETCH MEDIA
// ==============================
async function fetchMedia(url, containerId, type, pages = 1) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container not found: #${containerId}`);
        return;
    }

    try {

        // Clear existing content
        container.innerHTML = "";

        for (let page = 1; page <= pages; page++) {

            // Remove any existing page parameter
            const cleanUrl = url.replace(/([?&])page=\d+/g, "");

            const separator = cleanUrl.includes("?") ? "&" : "?";

            const requestUrl =
                `${cleanUrl}${separator}page=${page}`;

            console.log(`Fetching ${containerId}:`, requestUrl);

            const response = await fetch(requestUrl);

            if (!response.ok) {
                console.error(
                    `${containerId} HTTP error:`,
                    response.status
                );
                continue;
            }

            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                console.warn(
                    `No results for ${containerId}, page ${page}`
                );
                continue;
            }

            data.results.forEach(item => {

                // Don't display movies without posters
                if (!item.poster_path) {
                    return;
                }

                const mediaItem = document.createElement("div");
                mediaItem.classList.add("media-item");

                const title =
                    item.title ||
                    item.name ||
                    "Untitled";

                const year =
                    (
                        item.release_date ||
                        item.first_air_date ||
                        ""
                    ).slice(0, 4) || "—";

                const rating =
                    typeof item.vote_average === "number"
                        ? item.vote_average.toFixed(1)
                        : "—";

                mediaItem.innerHTML = `
                    <div class="poster-title" title="${title}">
                        ${title}
                    </div>

                    <div class="poster-card">

                        <div class="rating">
                            <span class="star">
                                <i class="fas fa-star"></i>
                            </span>

                            <span class="rating-number">
                                ${rating}
                            </span>
                        </div>

                        <div class="year-container">
                            <span class="year">
                                ${year}
                            </span>
                        </div>

                        <img
                            src="${imgURL}${item.poster_path}"
                            alt="${title}"
                            loading="lazy"
                        >

                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>

                    </div>
                `;

                mediaItem.addEventListener("click", () => {

                    if (type === "movie") {

                        window.location.href =
                            `movie-details.html?movie_id=${item.id}`;

                    } else {

                        window.location.href =
                            `tvshows-details.html?id=${item.id}`;

                    }

                });

                container.appendChild(mediaItem);
            });
        }

    } catch (error) {

        console.error(
            `Error loading ${containerId}:`,
            error
        );

        container.innerHTML = `
            <div style="padding:20px;color:#aaa;">
                Failed to load movies.
            </div>
        `;
    }
}


// ==============================
// LOAD DATA
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    fetchBanner();

    // Upcoming
    fetchMedia(
        `${baseURL}/movie/upcoming?api_key=${apiKey}&language=en-US`,
        "upcoming-movies",
        "movie",
        1
    );

    // Popular
    fetchMedia(
        `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&vote_count.gte=500&vote_average.gte=8`,
        "popular-movies",
        "movie",
        1
    );

    // Trending
    fetchMedia(
        `${baseURL}/trending/movie/week?api_key=${apiKey}&language=en-US`,
        "trending-now",
        "movie",
        1
    );

    // ==============================
    // TOP RATED
    // ==============================
    fetchMedia(
        `${baseURL}/movie/top_rated?api_key=${apiKey}&language=en-US`,
        "top-rated",
        "movie",
        1
    );

    // ==============================
    // ACTION
    // ==============================
    fetchMedia(
        `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=28&sort_by=popularity.desc`,
        "action-movies",
        "movie",
        1
    );

    // ==============================
    // COMEDY
    // ==============================
    fetchMedia(
        `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=35&sort_by=popularity.desc`,
        "comedy-movies",
        "movie",
        1
    );

    // ==============================
    // HORROR
    // ==============================
    fetchMedia(
        `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=27&sort_by=popularity.desc`,
        "horror-movies",
        "movie",
        1
    );

    // ==============================
    // ROMANCE
    // ==============================
    fetchMedia(
        `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=10749&sort_by=popularity.desc`,
        "romance-movies",
        "movie",
        1
    );

    // ==============================
    // ANIMATION
    // ==============================
    fetchMedia(
        `${baseURL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=16&sort_by=popularity.desc`,
        "animation-movies",
        "movie",
        1
    );

});
