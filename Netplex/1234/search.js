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
   SEARCH SECTION
========================================= */
const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');

let currentPage = 1;
let currentQuery = '';

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Load More';
loadMoreButton.classList.add('load-more-button');
loadMoreButton.setAttribute('tabindex', '0');
loadMoreButton.addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentQuery, currentPage);
});
movieGrid.after(loadMoreButton);

function createCardElement(item) {
    const posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    const title = item.title || item.name || '';
    const rating = item.vote_average || 0;
    const id = item.id;
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

    const year = (item.release_date || item.first_air_date || '').slice(0, 4) || '—';
    const detailUrl = mediaType === 'movie' 
        ? `movie-details.html?movie_id=${id}` 
        : `tvshows-details.html?id=${id}`;

    const card = document.createElement('div');
    card.classList.add('movie-item');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.innerHTML = `
        <div class="rating-container">
            <div class="rating">
                <span class="star">&#9733;</span><span class="rating-number">${rating.toFixed(1)}</span>
            </div>
        </div>
        <div class="year-container">
            <span class="year">${year}</span>
        </div>
        <img src="${posterUrl}" alt="${title}" loading="lazy" />
        <div class="play-button">
            <i class="fas fa-play"></i>
        </div>
    `;

    const openDetails = () => {
        window.location.href = detailUrl;
    };

    card.addEventListener('click', openDetails);
    card.addEventListener('focus', () => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    return card;
}

async function fetchRecommendations() {
    try {
        const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        movieGrid.innerHTML = '';

        if (!data.results || data.results.length === 0) {
            movieGrid.innerHTML = '<p>No recommendations available</p>';
            return;
        }

        data.results.filter(item => item.poster_path).forEach(item => {
            movieGrid.appendChild(createCardElement(item));
        });
    } catch (err) {
        console.error('Failed to fetch recommendations:', err);
    }
}

async function fetchMovies(query, page = 1) {
    try {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`;
        const response = await fetch(url);
        const data = await response.json();

        if (page === 1) {
            movieGrid.innerHTML = '';
        }

        const validResults = (data.results || []).filter(item => item.poster_path);

        if (validResults.length === 0 && page === 1) {
            movieGrid.innerHTML = '<p>No results found</p>';
            loadMoreButton.style.display = 'none';
            return;
        }

        validResults.forEach(item => {
            movieGrid.appendChild(createCardElement(item));
        });

        if (data.page < data.total_pages) {
            loadMoreButton.style.display = 'block';
        } else {
            loadMoreButton.style.display = 'none';
        }
    } catch (err) {
        console.error('Failed to search:', err);
    }
}

searchInput.addEventListener('input', (e) => {
    currentQuery = e.target.value.trim();
    currentPage = 1;
    if (currentQuery) {
        recommendationText.innerHTML = `<p>Searching for "${currentQuery}"...</p>`;
        fetchMovies(currentQuery, currentPage);
    } else {
        recommendationText.innerHTML = '<p>Recommended For You</p>';
        fetchRecommendations();
        loadMoreButton.style.display = 'none';
    }
});

/* =========================================================
   NETPLEX UNIFIED ANDROID TV SPATIAL NAVIGATION ENGINE
========================================================= */
(function () {
    "use strict";

    function isTvOk(e) {
        return (
            e.key === "Enter" ||
            e.key === "Select" ||
            e.key === "OK" ||
            e.keyCode === 13 ||
            e.keyCode === 23
        );
    }

    function isElementVisible(el) {
        if (!el || el.offsetParent === null) return false;
        const style = window.getComputedStyle(el);
        if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            style.opacity === "0" ||
            style.pointerEvents === "none"
        ) {
            return false;
        }
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function getFocusableElements() {
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]';
        return Array.from(document.querySelectorAll(selector)).filter(isElementVisible);
    }

    function navigateSpatial(direction) {
        const focusables = getFocusableElements();
        let current = document.activeElement;

        if (!current || current === document.body || !focusables.includes(current)) {
            const firstTarget = focusables.find(el => el.id === "search") || focusables[0];
            if (firstTarget) firstTarget.focus();
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

                let distance = 0;
                if (direction === "ArrowLeft" || direction === "ArrowRight") {
                    distance = Math.abs(dx) + (Math.abs(dy) * 2.5);
                } else {
                    // Lowered horizontal penalty so navigation can travel down into footer links
                    distance = Math.abs(dy) + (Math.abs(dx) * 0.8);
                }

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestCandidate = candidate;
                }
            }
        });

        if (bestCandidate) {
            bestCandidate.focus();
            bestCandidate.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    window.addEventListener("keydown", function (e) {
        const active = document.activeElement;
        const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");

        if (isTvOk(e)) {
            if (active && active !== document.body && !isInput) {
                e.preventDefault();
                active.click();
            }
            return;
        }

        const navKeys = [
            "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
            "Up", "Down", "Left", "Right",
            37, 38, 39, 40
        ];

        if (navKeys.includes(e.key) || navKeys.includes(e.keyCode)) {
            if (isInput && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.keyCode === 37 || e.keyCode === 39)) {
                return;
            }

            let dir = e.key;
            if (e.keyCode === 37 || e.key === "Left") dir = "ArrowLeft";
            if (e.keyCode === 38 || e.key === "Up") dir = "ArrowUp";
            if (e.keyCode === 39 || e.key === "Right") dir = "ArrowRight";
            if (e.keyCode === 40 || e.key === "Down") dir = "ArrowDown";

            e.preventDefault();
            navigateSpatial(dir);
            return;
        }

        const backKeys = ["Escape", "Back", "GoBack", 10009, 27, 461];
        if (backKeys.includes(e.key) || backKeys.includes(e.keyCode)) {
            const activeDropdown = document.querySelector(".dropdown.active, .dropdown-content.active");
            if (activeDropdown) {
                e.preventDefault();
                activeDropdown.classList.remove("active");
                return;
            }

            if (window.history.length > 1) {
                window.history.back();
            }
        }
    });
})();

fetchRecommendations();
