// ===================================
    // 1. TMDB CONFIG (SECURE PROXY)
    // ===================================
    // Replace with your actual deployed Cloudflare Worker URL
    const baseURL = "https://tmdb-api-key.streamhdmovie1.workers.dev";
    const imgURL = "https://image.tmdb.org/t/p/w500";
    const currentYear = new Date().getFullYear();

    let currentBannerItem = null;

    const bannerTitle = document.getElementById("banner-title");
    const bannerGenre = document.getElementById("banner-genre");
    const bannerDescription = document.getElementById("banner-description");
    const banner = document.querySelector(".banner");
    const bannerPlayButton = document.getElementById("banner-play-btn");

    // ===================================
    // 2. BANNER LOGIC
    // ===================================
    async function fetchBanner() {
        try {
            const [movieRes, tvRes] = await Promise.all([
                fetch(`${baseURL}/discover/movie?primary_release_year=${currentYear}&sort_by=popularity.desc&page=1`),
                fetch(`${baseURL}/discover/tv?first_air_date_year=${currentYear}&sort_by=popularity.desc&page=1`)
            ]);
            
            const movieData = await movieRes.json();
            const tvData = await tvRes.json();

            const movies = (movieData.results || []).map(item => ({...item, media_type: 'movie'}));
            const tvShows = (tvData.results || []).map(item => ({...item, media_type: 'tv'}));

            const allNewReleases = [...movies, ...tvShows].filter(item => item.backdrop_path);
            if (allNewReleases.length === 0) return;

            const randomItem = allNewReleases[Math.floor(Math.random() * allNewReleases.length)];
            currentBannerItem = randomItem;

            banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;
            
            const originalTitle = randomItem.title || randomItem.name;
            bannerTitle.textContent = originalTitle.length > 35 ? originalTitle.substring(0, 32) + '...' : originalTitle; 
            bannerDescription.textContent = randomItem.overview || "No description available.";
            
            const mediaType = randomItem.media_type;
            const genresResponse = await fetch(`${baseURL}/genre/${mediaType}/list?language=en-US`);
            const genresData = await genresResponse.json();
            const genreMap = Object.fromEntries(genresData.genres.map(g => [g.id, g.name]));
            const genreNames = (randomItem.genre_ids || []).map(id => genreMap[id]).join(", ");
            
            bannerGenre.textContent = `Genre: ${genreNames || "Unknown"}`;
        } catch(e) {
            console.error("Banner fetch error", e);
        }
    }

    if (bannerPlayButton) {
        bannerPlayButton.addEventListener("click", () => {
            if (!currentBannerItem) return;
            const item = currentBannerItem;
            window.location.href = item.media_type === "movie"
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
        });
    }

    // ===================================
    // 3. MEDIA ROW GENERATION LOGIC
    // ===================================
    const mediaState = {};

    function createMediaCard(item, type) {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");
        mediaItem.setAttribute("tabindex", "0");
        mediaItem.setAttribute("role", "button");

        const title = item.title || item.name;
        const year = (item.release_date || item.first_air_date || '').slice(0, 4) || '—';
        const rating = item.vote_average ? item.vote_average.toFixed(1) : '0.0';
        
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

        const openDetails = () => {
            window.location.href = type === "movie" 
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
        };

        mediaItem.addEventListener("click", openDetails);
        mediaItem.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.keyCode === 13) openDetails();
        });

        // Horizontal auto-scroll on focus for TV remotes
        mediaItem.addEventListener("focus", () => {
            mediaItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });

        return mediaItem;
    }

    async function fetchMedia(url, containerId, type, page = 1) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const response = await fetch(`${url}&page=${page}`);
        const data = await response.json();

        if (!mediaState[containerId]) {
            mediaState[containerId] = { page: 1, loading: false };
        }
        
        const results = (data.results || []).filter(item => item.poster_path);

        results.forEach(item => {
            container.appendChild(createMediaCard(item, type));
        });

        mediaState[containerId].loading = false;
    }

    async function fetchNewReleases(containerId, pages = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const allFetches = [];
        for (let page = 1; page <= pages; page++) {
            allFetches.push(
                fetch(`${baseURL}/discover/movie?primary_release_year=${currentYear}&sort_by=popularity.desc&page=${page}`),
                fetch(`${baseURL}/discover/tv?first_air_date_year=${currentYear}&sort_by=popularity.desc&page=${page}`)
            );
        }

        const responses = await Promise.all(allFetches);
        let allItems = [];
        
        for (const response of responses) {
            const data = await response.json();
            const type = response.url.includes('/movie') ? 'movie' : 'tv';
            const typedResults = (data.results || []).map(item => ({...item, type: type}));
            allItems.push(...typedResults);
        }
        
        allItems.filter(item => item.poster_path).forEach(item => {
            container.appendChild(createMediaCard(item, item.type));
        });
    }

    // ===================================
    // 4. SCROLLING AND LAZY LOADING
    // ===================================
    function getURLForContainer(containerId) {
        const urls = {
            "popular-movies": `${baseURL}/discover/movie?vote_count.gte=500&sort_by=popularity.desc`,
            "popular-tv-shows": `${baseURL}/discover/tv?vote_count.gte=5000&sort_by=popularity.desc`,
            "korean-tv-shows": `${baseURL}/discover/tv?with_origin_country=KR&vote_count.gte=300&sort_by=popularity.desc`,
            "japanese-animations": `${baseURL}/discover/tv?with_origin_country=JP&with_genres=16&vote_count.gte=500&sort_by=popularity.desc`,
        };
        return urls[containerId] || null;
    }

    function getTypeForContainer(containerId) {
        return containerId.includes("tv") || containerId.includes("animations") ? "tv" : "movie";
    }

    function scrollLeft(containerId) {
        let container = document.getElementById(containerId);
        if (container) container.scrollBy({ left: -300, behavior: "smooth" });
    }

    function scrollRight(containerId) {
        let container = document.getElementById(containerId);
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
            fetchMedia(getURLForContainer(containerId), containerId, getTypeForContainer(containerId), mediaState[containerId].page);
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
                closeMessage();
            }
        }
    });

    // ===================================
    // 6. INITIALIZATION & LISTENERS
    // ===================================
    fetchBanner();
    fetchNewReleases("new-releases", 3);
    fetchMedia(getURLForContainer("popular-movies"), "popular-movies", "movie", 3);
    fetchMedia(getURLForContainer("popular-tv-shows"), "popular-tv-shows", "tv", 3);
    fetchMedia(getURLForContainer("korean-tv-shows"), "korean-tv-shows", "tv", 3);
    fetchMedia(getURLForContainer("japanese-animations"), "japanese-animations", "tv", 3);

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".scroll-left").forEach(button => {
            button.addEventListener("click", function () {
                scrollLeft(this.nextElementSibling.id);
            });
        });

        document.querySelectorAll(".scroll-right").forEach(button => {
            button.addEventListener("click", function () {
                scrollRight(this.previousElementSibling.id);
            });
        });
        
        const dropdown = document.querySelector(".dropdown");
        if (dropdown) {
            dropdown.addEventListener("click", function () {
                this.classList.toggle("active");
            });
        }

        const moreButton = document.getElementById("mobile-more-btn");
        const moreMenu = document.getElementById("mobile-more-menu");
        if (moreButton && moreMenu) {
            moreButton.addEventListener("click", function (event) {
                event.stopPropagation();
                moreMenu.classList.toggle("show");
                moreButton.classList.toggle("active");
            });

            document.addEventListener("click", function () {
                moreMenu.classList.remove("show");
                moreButton.classList.remove("active");
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

    window.addEventListener("scroll", function () {
        let nav = document.querySelector("nav");
        if (window.scrollY > 50) {
            nav.classList.add("nav-solid");
        } else {
            nav.classList.remove("nav-solid");
        }
    });

    function closeMessage() {
        document.getElementById("floating-message").style.display = "none";
    }
