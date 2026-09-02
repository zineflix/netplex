    // ===================================
    // 1. TMDB CONFIG
    // ===================================
    const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
    const baseURL = "https://api.themoviedb.org/3";
    const imgURL = "https://image.tmdb.org/t/p/w500";
    const currentYear = new Date().getFullYear();

    let currentBannerItem = null;

    const bannerTitle = document.getElementById("banner-title");
    const bannerGenre = document.getElementById("banner-genre");
    const bannerDescription = document.getElementById("banner-description");
    const banner = document.querySelector(".banner");
    const bannerPlayButton = document.getElementById("banner-play-btn");

    // ===================================
    // 2. BANNER LOGIC (MOVIES ONLY)
    // ===================================
    async function fetchBanner() {
        try {
            const movieRes = await fetch(
                `${baseURL}/discover/movie?api_key=${apiKey}&with_companies=149142&primary_release_year=${currentYear}&sort_by=popularity.desc&page=1`
            );
            
            const movieData = await movieRes.json();
            const movies = (movieData.results || []).filter(item => item.backdrop_path);
            if (movies.length === 0) return;

            const randomItem = movies[Math.floor(Math.random() * movies.length)];
            currentBannerItem = randomItem;

            banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;
            
            const originalTitle = randomItem.title;
            bannerTitle.textContent = originalTitle.length > 35 ? originalTitle.substring(0, 32) + '...' : originalTitle; 
            bannerDescription.textContent = randomItem.overview || "No description available.";
            
            const genresResponse = await fetch(`${baseURL}/genre/movie/list?api_key=${apiKey}&language=en-US`);
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
            window.location.href = `movie-details.html?movie_id=${currentBannerItem.id}`;
        });
    }

    // ===================================
    // 3. PAGINATION & MEDIA LOGIC
    // ===================================
    let currentPage = 1;
    let totalPages = 1;

    const moviesContainer = document.getElementById("movies-container");
    const prevBtn = document.getElementById("prev-page-btn");
    const nextBtn = document.getElementById("next-page-btn");
    const pageNumbersEl = document.getElementById("page-numbers");

    function createMediaCard(item) {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");
        mediaItem.setAttribute("tabindex", "0");
        mediaItem.setAttribute("role", "button");

        const title = item.title;
        const year = (item.release_date || '').slice(0, 4) || '—';
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
            window.location.href = `movie-details.html?movie_id=${item.id}`;
        };

        mediaItem.addEventListener("click", openDetails);
        mediaItem.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.keyCode === 13) openDetails();
        });

        mediaItem.addEventListener("focus", () => {
            mediaItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });

        return mediaItem;
    }

    function renderPaginationNumbers() {
        if (!pageNumbersEl) return;
        pageNumbersEl.innerHTML = "";

        const delta = 2;
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        const createButton = (page) => {
            const btn = document.createElement("button");
            btn.className = `num-btn ${page === currentPage ? 'active' : ''}`;
            btn.textContent = page;
            btn.addEventListener("click", () => {
                if (page !== currentPage) loadMoviesByPage(page);
            });
            return btn;
        };

        const createDots = () => {
            const span = document.createElement("span");
            span.className = "page-dots";
            span.textContent = "...";
            return span;
        };

        pageNumbersEl.appendChild(createButton(1));

        if (currentPage - delta > 2) {
            pageNumbersEl.appendChild(createDots());
        }

        range.forEach(page => {
            pageNumbersEl.appendChild(createButton(page));
        });

        if (currentPage + delta < totalPages - 1) {
            pageNumbersEl.appendChild(createDots());
        }

        if (totalPages > 1) {
            pageNumbersEl.appendChild(createButton(totalPages));
        }

        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    async function loadMoviesByPage(page = 1) {
        if (!moviesContainer) return;

        const today = new Date().toISOString().split("T")[0];

        try {
            const res = await fetch(
                `${baseURL}/discover/movie?api_key=${apiKey}&with_companies=149142&sort_by=primary_release_date.desc&primary_release_date.lte=${today}&page=${page}`
            );
            const data = await res.json();
            
            currentPage = data.page;
            totalPages = Math.min(data.total_pages, 500);

            moviesContainer.innerHTML = "";
            const movies = (data.results || []).filter(item => item.poster_path);

            movies.forEach(movie => {
                moviesContainer.appendChild(createMediaCard(movie));
            });

            renderPaginationNumbers();
            window.scrollTo({ top: moviesContainer.offsetTop - 90, behavior: "smooth" });
        } catch (error) {
            console.error("Error loading movies:", error);
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) loadMoviesByPage(currentPage - 1);
        });

        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) loadMoviesByPage(currentPage + 1);
        });
    }

    // ===================================
    // 4. SMART TV D-PAD NAVIGATION SYSTEM
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
        }
    });

    // ===================================
    // 5. INITIALIZATION & LISTENERS
    // ===================================
    fetchBanner();
    loadMoviesByPage(1);

    document.addEventListener("DOMContentLoaded", function () {
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
