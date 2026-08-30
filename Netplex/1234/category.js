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

function getRandomizedContent() {
    window.location.href = 'collection.html';
}

// Utility to catch any Android TV OK/Enter key variant
function isTvOkKey(e) {
    return (
        e.key === "Enter" ||
        e.key === "Select" ||
        e.key === "OK" ||
        e.keyCode === 13 ||
        e.keyCode === 23
    );
}

/* =====================================================
   CATEGORY DATA & TV MODAL PICKER LOGIC
===================================================== */
const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const baseUrl = 'https://api.themoviedb.org/3';
const movieGrid = document.getElementById('movie-grid');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Trigger Elements
const contentTypeBtn = document.getElementById('contentTypeBtn');
const genreBtn = document.getElementById('genreBtn');
const yearBtn = document.getElementById('yearBtn');
const sortBtn = document.getElementById('sortBtn');

const contentTypeVal = document.getElementById('contentTypeVal');
const genreVal = document.getElementById('genreVal');
const yearVal = document.getElementById('yearVal');
const sortVal = document.getElementById('sortVal');

// Modal Elements
const pickerModal = document.getElementById('tv-picker-modal');
const pickerTitle = document.getElementById('tv-picker-title');
const pickerOptions = document.getElementById('tv-picker-options');

let lastFocusedElement = null;
let movieGenres = [];
let tvGenres = [];
let availableGenres = [];
let currentYear = new Date().getFullYear();
let currentPage = 1;

let currentContentType = 'both';
let currentGenre = 'all';
let currentYearFilter = 'all';
let currentSort = 'popularity.desc';

const contentTypes = [
    { value: 'both', label: 'Both Movies & TV Shows' },
    { value: 'movies', label: 'Movies' },
    { value: 'tvShows', label: 'TV Shows' }
];

const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity (Descending)' },
    { value: 'release_date.desc', label: 'Release Date (Newest to Oldest)' },
    { value: 'vote_average.desc', label: 'Rating (Descending)' }
];

// Open Selector Modal on Enter/OK
function openPicker(title, items, currentValue, onSelect) {
    lastFocusedElement = document.activeElement;
    pickerTitle.textContent = title;
    pickerOptions.innerHTML = '';

    items.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('tv-picker-item');
        btn.setAttribute('tabindex', '0');
        btn.textContent = item.label;

        if (String(item.value) === String(currentValue)) {
            btn.classList.add('active');
        }

        const selectThis = () => {
            onSelect(item);
            closePicker();
        };

        btn.addEventListener('click', selectThis);
        btn.addEventListener('keydown', (e) => {
            if (isTvOkKey(e)) {
                e.preventDefault();
                e.stopPropagation();
                selectThis();
            }
        });

        pickerOptions.appendChild(btn);
    });

    pickerModal.style.display = 'flex';

    setTimeout(() => {
        const activeItem = pickerOptions.querySelector('.active') || pickerOptions.querySelector('button');
        if (activeItem) activeItem.focus();
    }, 50);
}

function closePicker() {
    pickerModal.style.display = 'none';
    pickerOptions.innerHTML = '';
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

// Close filter modal when clicking outside the dialog content
pickerModal.addEventListener('click', (e) => {
    // Only close if the backdrop itself was clicked
    if (e.target === pickerModal) {
        closePicker();
    }
});

// Prevent clicks inside the picker dialog from bubbling up to the backdrop
const pickerContent = document.querySelector('.tv-picker-content');
if (pickerContent) {
    pickerContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Attach Picker Triggers
function setupPickerTrigger(triggerBtn, getTitle, getItems, getCurrentVal, onSelect) {
    const handleOpen = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        openPicker(getTitle(), getItems(), getCurrentVal(), onSelect);
    };

    triggerBtn.addEventListener('click', handleOpen);
    triggerBtn.addEventListener('keydown', (e) => {
        if (isTvOkKey(e)) {
            handleOpen(e);
        }
    });
}

// Content Type Picker
setupPickerTrigger(
    contentTypeBtn,
    () => 'Select Content Type',
    () => contentTypes,
    () => currentContentType,
    (selected) => {
        currentContentType = selected.value;
        contentTypeVal.textContent = selected.label;
        updateAvailableGenres();
        currentGenre = 'all';
        genreVal.textContent = 'All Genres';
        updateAndFetch();
    }
);

// Genre Picker
setupPickerTrigger(
    genreBtn,
    () => 'Select Genre',
    () => [{ value: 'all', label: 'All Genres' }, ...availableGenres.map(g => ({ value: g.id, label: g.name }))],
    () => currentGenre,
    (selected) => {
        currentGenre = selected.value;
        genreVal.textContent = selected.label;
        updateAndFetch();
    }
);

// Year Picker
setupPickerTrigger(
    yearBtn,
    () => 'Select Year',
    () => {
        const years = [{ value: 'all', label: 'All Years' }];
        for (let y = currentYear; y >= 1900; y--) {
            years.push({ value: String(y), label: String(y) });
        }
        return years;
    },
    () => currentYearFilter,
    (selected) => {
        currentYearFilter = selected.value;
        yearVal.textContent = selected.label;
        updateAndFetch();
    }
);

// Sort Picker
setupPickerTrigger(
    sortBtn,
    () => 'Select Sort Option',
    () => sortOptions,
    () => currentSort,
    (selected) => {
        currentSort = selected.value;
        sortVal.textContent = selected.label;
        updateAndFetch();
    }
);

async function fetchGenres() {
    try {
        const [movieRes, tvRes] = await Promise.all([
            fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`),
            fetch(`${baseUrl}/genre/tv/list?api_key=${apiKey}&language=en-US`)
        ]);
        const movieData = await movieRes.json();
        const tvData = await tvRes.json();
        movieGenres = movieData.genres || [];
        tvGenres = tvData.genres || [];
        updateAvailableGenres();
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

function updateAvailableGenres() {
    if (currentContentType === 'movies') {
        availableGenres = movieGenres;
    } else if (currentContentType === 'tvShows') {
        availableGenres = tvGenres;
    } else {
        const seen = new Set();
        availableGenres = [...movieGenres, ...tvGenres].filter(g => {
            if (seen.has(g.name)) return false;
            seen.add(g.name);
            return true;
        });
    }
}

async function fetchMoviesAndTVShows(contentType, genreId, year, sortBy, page = 1, append = false) {
    try {
        let moviesData = [];
        let tvShowsData = [];
        const genreQuery = genreId !== 'all' ? `&with_genres=${genreId}` : '';
        const sortQuery = `&sort_by=${sortBy}`;

        if (contentType === 'both' || contentType === 'movies') {
            const yearQuery = year !== 'all' ? `&primary_release_year=${year}` : '';
            const res = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&page=${page}${yearQuery}${genreQuery}${sortQuery}`);
            const data = await res.json();
            moviesData = data.results || [];
        }

        if (contentType === 'both' || contentType === 'tvShows') {
            const yearQuery = year !== 'all' ? `&first_air_date_year=${year}` : '';
            const res = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&language=en-US&page=${page}${yearQuery}${genreQuery}${sortQuery}`);
            const data = await res.json();
            tvShowsData = data.results || [];
        }

        const combinedData = [...moviesData, ...tvShowsData];

        if (append) {
            displayItems(combinedData);
        } else {
            movieGrid.innerHTML = '';
            displayItems(combinedData);
        }

        loadMoreBtn.style.display = combinedData.length > 0 ? 'block' : 'none';
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayItems(items) {
    const validItems = items.filter(item => item.poster_path);
    validItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        const imgUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        const detailUrl = item.title
            ? `movie-details.html?movie_id=${item.id}`
            : `tvshows-details.html?id=${item.id}`;

        const rawDate = item.release_date || item.first_air_date || "";
        const year = rawDate ? String(rawDate).slice(0, 4) : "—";
        const title = item.title || item.name || "";

        card.innerHTML = `
            <a href="${detailUrl}" tabindex="-1" onclick="event.preventDefault();">
                <img src="${imgUrl}" alt="${title}" loading="lazy">
                <span class="year-badge">${year}</span>
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </a>
        `;

        const openDetails = () => {
            window.location.href = detailUrl;
        };

        card.addEventListener('click', openDetails);
        card.addEventListener('keydown', (e) => {
            if (isTvOkKey(e)) {
                e.preventDefault();
                e.stopPropagation();
                openDetails();
            }
        });

        card.addEventListener('focus', () => {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        movieGrid.appendChild(card);
    });
}

function updateAndFetch() {
    currentPage = 1;
    fetchMoviesAndTVShows(currentContentType, currentGenre, currentYearFilter, currentSort, currentPage);
}

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchMoviesAndTVShows(currentContentType, currentGenre, currentYearFilter, currentSort, currentPage, true);
});

loadMoreBtn.addEventListener('keydown', (e) => {
    if (isTvOkKey(e)) {
        e.preventDefault();
        currentPage++;
        fetchMoviesAndTVShows(currentContentType, currentGenre, currentYearFilter, currentSort, currentPage, true);
    }
});

// ===================================
// SMART TV D-PAD NAVIGATION SYSTEM
// ===================================
function navigateSpatial(direction) {
    if (pickerModal.style.display !== 'none') {
        const modalItems = Array.from(pickerOptions.querySelectorAll('.tv-picker-item'));
        const current = document.activeElement;
        const currentIndex = modalItems.indexOf(current);

        if (direction === "ArrowDown") {
            const nextIndex = (currentIndex + 1) < modalItems.length ? currentIndex + 1 : currentIndex;
            modalItems[nextIndex].focus();
            modalItems[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (direction === "ArrowUp") {
            const prevIndex = (currentIndex - 1) >= 0 ? currentIndex - 1 : 0;
            modalItems[prevIndex].focus();
            modalItems[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
    }

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
        if (direction === "ArrowRight" && center.x > currentCenter.x + 10) isValid = true;
        if (direction === "ArrowLeft" && center.x < currentCenter.x - 10) isValid = true;
        if (direction === "ArrowDown" && center.y > currentCenter.y + 10) isValid = true;
        if (direction === "ArrowUp" && center.y < currentCenter.y - 10) isValid = true;

        if (isValid) {
            const dx = center.x - currentCenter.x;
            const dy = center.y - currentCenter.y;
            const distance = (direction === "ArrowLeft" || direction === "ArrowRight")
                ? Math.abs(dx) + Math.abs(dy) * 2.2
                : Math.abs(dy) + Math.abs(dx) * 2.2;

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

// Global Remote Listener
window.addEventListener("keydown", (e) => {
    // 1. Android TV OK key trigger fallback
    if (isTvOkKey(e)) {
        const active = document.activeElement;
        if (active && active !== document.body) {
            active.click();
        }
        return;
    }

    // 2. Direction Keys
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
    // 3. Back Keys
    else if (e.key === "Escape" || e.key === "Back" || e.keyCode === 10009 || e.keyCode === 27) {
        if (pickerModal.style.display !== 'none') {
            e.preventDefault();
            closePicker();
            return;
        }
        window.history.back();
    }
});

window.onload = async () => {
    await fetchGenres();
    updateAndFetch();
};
