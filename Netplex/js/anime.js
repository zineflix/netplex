    // ===================================
    // 1. TMDB CONFIG & STATE
    // ===================================
    const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
    const baseURL = "https://api.themoviedb.org/3";
    const imgURL = "https://image.tmdb.org/t/p/w500";
    const currentYear = new Date().getFullYear();

    let currentRegion = "CN"; // Default: 'CN'
    let currentPage = 1;
    let totalPages = 1;
    let currentBannerItem = null;

    const bannerTitle = document.getElementById("banner-title");
    const bannerGenre = document.getElementById("banner-genre");
    const bannerDescription = document.getElementById("banner-description");
    const banner = document.querySelector(".banner");
    const bannerPlayButton = document.getElementById("banner-play-btn");

    const sectionTitle = document.getElementById("section-title");
    const moviesContainer = document.getElementById("movies-container");
    const prevBtn = document.getElementById("prev-page-btn");
    const nextBtn = document.getElementById("next-page-btn");
    const pageNumbersEl = document.getElementById("page-numbers");

    // Endpoint setups for Chinese and Japanese anime
    const regionConfigs = {
        CN: {
            title: "Chinese Anime (Latest to Oldest)",
            movieUrl: (page, today) => `${baseURL}/discover/movie?api_key=${apiKey}&with_genres=16&with_original_language=zh&with_origin_country=CN&vote_average.gte=7&without_genres=10762&sort_by=primary_release_date.desc&primary_release_date.lte=${today}&page=${page}`,
            tvUrl: (page, today) => `${baseURL}/discover/tv?api_key=${apiKey}&with_genres=16&with_original_language=zh&with_origin_country=CN&vote_average.gte=7&without_genres=10762&sort_by=first_air_date.desc&first_air_date.lte=${today}&page=${page}`,
            bannerUrl: `${baseURL}/discover/movie?api_key=${apiKey}&with_genres=16&with_original_language=zh&with_origin_country=CN&vote_count.gte=5&vote_average.gte=7&without_genres=10762&primary_release_year=${currentYear}&sort_by=popularity.desc&page=1`
        },
        JP: {
            title: "Japanese Anime (Popular to Newest)",
            movieUrl: (page) => `${baseURL}/discover/movie?api_key=${apiKey}&with_origin_country=JP&with_genres=16&sort_by=popularity.desc&page=${page}`,
            tvUrl: (page) => `${baseURL}/discover/tv?api_key=${apiKey}&with_origin_country=JP&with_genres=16&sort_by=popularity.desc&page=${page}`,
            bannerUrl: `${baseURL}/discover/movie?api_key=${apiKey}&with_origin_country=JP&with_genres=16&vote_count.gte=500&sort_by=popularity.desc&page=1`
        }
    };

    // ===================================
    // 2. BANNER LOGIC
    // ===================================
    async function fetchBanner() {
        try {
            const config = regionConfigs[currentRegion];
            const movieRes = await fetch(config.bannerUrl);
            const movieData = await movieRes.json();
            const movies = (movieData.results || []).filter(item => item.backdrop_path);
            if (movies.length === 0) return;

            const randomItem = movies[Math.floor(Math.random() * movies.length)];
            currentBannerItem = randomItem;

            banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;
            
            const originalTitle = randomItem.title || randomItem.name || "Featured Anime";
            bannerTitle.textContent = originalTitle.length > 35 ? originalTitle.substring(0, 32) + '...' : originalTitle; 
            bannerDescription.textContent = randomItem.overview || "No description available.";
            
            const genresResponse = await fetch(`${baseURL}/genre/movie/list?api_key=${apiKey}&language=en-US`);
            const genresData = await genresResponse.json();
            const genreMap = Object.fromEntries(genresData.genres.map(g => [g.id, g.name]));
            const genreNames = (randomItem.genre_ids || []).map(id => genreMap[id]).filter(Boolean).join(", ");
            
            bannerGenre.textContent = `Genre: ${genreNames || "Animation"}`;
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
    function renderPaginationNumbers() {
        if (!pageNumbersEl) return;
        pageNumbersEl.innerHTML = "";

        const createBtn = (page, label = page, isActive = false) => {
            const btn = document.createElement("button");
            btn.className = `num-btn${isActive ? " active" : ""}`;
            btn.textContent = label;
            if (!isActive) {
                btn.addEventListener("click", () => loadMoviesByPage(page));
            }
            return btn;
        };

        const createDots = () => {
            const dots = document.createElement("span");
            dots.className = "page-dots";
            dots.textContent = "...";
            return dots;
        };

        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pageNumbersEl.appendChild(createBtn(1, 1, currentPage === 1));
            if (startPage > 2) pageNumbersEl.appendChild(createDots());
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbersEl.appendChild(createBtn(i, i, i === currentPage));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbersEl.appendChild(createDots());
            pageNumbersEl.appendChild(createBtn(totalPages, totalPages, currentPage === totalPages));
        }

        if (prevBtn) {
            prevBtn.disabled = currentPage <= 1;
            prevBtn.onclick = () => {
                if (currentPage > 1) loadMoviesByPage(currentPage - 1);
            };
        }

        if (nextBtn) {
            nextBtn.disabled = currentPage >= totalPages;
            nextBtn.onclick = () => {
                if (currentPage < totalPages) loadMoviesByPage(currentPage + 1);
            };
        }
    }

    function createMediaCard(item) {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");
        mediaItem.setAttribute("tabindex", "0");
        mediaItem.setAttribute("role", "button");

        const title = item.title || item.name || "Untitled";
        const dateStr = item.release_date || item.first_air_date || "";
        const year = dateStr.slice(0, 4) || '—';
        const rating = item.vote_average ? item.vote_average.toFixed(1) : '0.0';
        
        const isTv = item.media_type === "tv";
        const badgeLabel = isTv ? "TV" : "MOVIE";
        const badgeClass = isTv ? "tv" : "movie";
        
        mediaItem.innerHTML = `
            <div class="poster-title" title="${title}">${title}</div>
            <div class="poster-card">
                <div class="rating">
                    <span class="star"><i class="fas fa-star"></i></span> <span class="rating-number">${rating}</span>
                </div>
                <div class="media-badge ${badgeClass}">${badgeLabel}</div>
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
            if (item.media_type === "tv") {
                window.location.href = `tv-details.html?id=${item.id}`;
            } else {
                window.location.href = `movie-details.html?movie_id=${item.id}`;
            }
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

    async function loadMoviesByPage(page = 1) {
        if (!moviesContainer) return;

        const today = new Date().toISOString().split("T")[0];
        const config = regionConfigs[currentRegion];

        try {
            const [movieRes, tvRes] = await Promise.all([
                fetch(config.movieUrl(page, today)),
                fetch(config.tvUrl(page, today))
            ]);

            const movieData = await movieRes.json();
            const tvData = await tvRes.json();

            const movies = (movieData.results || []).map(item => ({ ...item, media_type: 'movie' }));
            const tvShows = (tvData.results || []).map(item => ({ ...item, media_type: 'tv' }));

            // CN sorts by recent dates, JP sorts by popularity
            const combined = [...movies, ...tvShows]
                .filter(item => item.poster_path)
                .sort((a, b) => {
                    if (currentRegion === "CN") {
                        const dateA = new Date(a.release_date || a.first_air_date || 0);
                        const dateB = new Date(b.release_date || b.first_air_date || 0);
                        return dateB - dateA;
                    }
                    return (b.popularity || 0) - (a.popularity || 0);
                });

            currentPage = page;
            totalPages = Math.min(Math.max(movieData.total_pages || 1, tvData.total_pages || 1), 500);

            moviesContainer.innerHTML = "";
            combined.forEach(item => {
                moviesContainer.appendChild(createMediaCard(item));
            });

            renderPaginationNumbers();
            window.scrollTo({ top: moviesContainer.offsetTop - 90, behavior: "smooth" });
        } catch (error) {
            console.error("Error loading media:", error);
        }
    }

    // ===================================
    // 4. TAB CONTROLS
    // ===================================
    function setupTabs() {
        const tabBtns = document.querySelectorAll(".anime-tab-btn");
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const selectedRegion = btn.dataset.region;
                if (selectedRegion === currentRegion) return;

                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                currentRegion = selectedRegion;
                if (sectionTitle) sectionTitle.textContent = regionConfigs[currentRegion].title;

                fetchBanner();
                loadMoviesByPage(1);
            });
        });
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
        }
    });

    // ===================================
    // 6. INITIALIZATION & LISTENERS
    // ===================================
    setupTabs();
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
