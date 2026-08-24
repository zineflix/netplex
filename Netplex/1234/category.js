/* =========================================================
   TMDB MOVIE & TV SHOWS
   ========================================================= */

const apiKey = 'aa1e72fd93ed59f56e6332813b9f8dcae';
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const movieGrid = document.getElementById('movie-grid');
const contentTypeSelect = document.getElementById('contentType');
const genreSelect = document.getElementById('genreSelect');
const yearSelect = document.getElementById('yearSelect');
const sortSelect = document.getElementById('sortSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');

/* =========================================================
   STATE
   ========================================================= */

let movieGenres = [];
let tvGenres = [];

const currentYear = new Date().getFullYear();

let currentPage = 1;
let currentContentType = 'both';
let currentGenre = 'all';
let currentYearFilter = 'all';
let currentSort = 'popularity.desc';

let isLoading = false;

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeNavigation();
    initializeMoreDropdown();
    initializeMobileMoreMenu();
});


async function initializeApp() {
    try {
        populateYearDropdown();

        await fetchGenres();

        updateGenreDropdown();

        await updateAndFetch();

    } catch (error) {
        console.error('Application initialization failed:', error);
        showError('Unable to load movies and TV shows. Please refresh the page.');
    }
}


/* =========================================================
   TMDB API HELPER
   ========================================================= */

async function tmdbFetch(endpoint, params = {}) {
    const url = new URL(`${baseUrl}${endpoint}`);

    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('language', 'en-US');

    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== ''
        ) {
            url.searchParams.set(key, value);
        }
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `TMDB request failed: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    if (data.success === false) {
        throw new Error(data.status_message || 'TMDB API error.');
    }

    return data;
}


/* =========================================================
   FETCH GENRES
   ========================================================= */

async function fetchGenres() {
    try {
        const [movieData, tvData] = await Promise.all([
            tmdbFetch('/genre/movie/list'),
            tmdbFetch('/genre/tv/list')
        ]);

        movieGenres = Array.isArray(movieData.genres)
            ? movieData.genres
            : [];

        tvGenres = Array.isArray(tvData.genres)
            ? tvData.genres
            : [];

    } catch (error) {
        console.error('Error fetching genres:', error);

        movieGenres = [];
        tvGenres = [];

        throw error;
    }
}


/* =========================================================
   GENRE DROPDOWN
   ========================================================= */

function updateGenreDropdown() {
    if (!genreSelect) return;

    const previousValue = currentGenre;

    genreSelect.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Genres';
    genreSelect.appendChild(allOption);

    let genresToShow = [];

    if (currentContentType === 'movies') {

        genresToShow = [...movieGenres];

    } else if (currentContentType === 'tvShows') {

        genresToShow = [...tvGenres];

    } else {

        /*
         * Movies and TV have some different genre IDs.
         * Merge them by genre name so the dropdown doesn't
         * contain duplicate names.
         */
        const genreMap = new Map();

        [...movieGenres, ...tvGenres].forEach(genre => {
            if (!genreMap.has(genre.name)) {
                genreMap.set(genre.name, genre);
            }
        });

        genresToShow = [...genreMap.values()];
    }

    genresToShow.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    genresToShow.forEach(genre => {
        const option = document.createElement('option');

        option.value = genre.id;
        option.textContent = genre.name;

        genreSelect.appendChild(option);
    });

    /*
     * Keep the previous selection if it still exists.
     * Otherwise reset to All Genres.
     */
    const optionExists = [...genreSelect.options]
        .some(option => option.value === String(previousValue));

    if (optionExists) {
        genreSelect.value = previousValue;
    } else {
        currentGenre = 'all';
        genreSelect.value = 'all';
    }
}


/* =========================================================
   YEAR DROPDOWN
   ========================================================= */

function populateYearDropdown() {
    if (!yearSelect) return;

    yearSelect.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Years';

    yearSelect.appendChild(allOption);

    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }
}


/* =========================================================
   FETCH MOVIES
   ========================================================= */

async function fetchMovies(year, genreId, sortBy, page) {

    const params = {
        page: page,
        sort_by: sortBy
    };

    if (year !== 'all') {
        params.primary_release_year = year;
    }

    if (genreId !== 'all') {
        params.with_genres = genreId;
    }

    return tmdbFetch('/discover/movie', params);
}


/* =========================================================
   FETCH TV SHOWS
   ========================================================= */

async function fetchTVShows(year, genreId, sortBy, page) {

    const params = {
        page: page,
        sort_by: sortBy
    };

    if (year !== 'all') {
        params.first_air_date_year = year;
    }

    if (genreId !== 'all') {
        params.with_genres = genreId;
    }

    return tmdbFetch('/discover/tv', params);
}


/* =========================================================
   FETCH CONTENT
   ========================================================= */

async function fetchMoviesAndTVShows(
    contentType,
    genreId,
    year,
    sortBy,
    page = 1,
    append = false
) {

    if (isLoading) return;

    isLoading = true;

    setLoadingState(true);

    try {

        let movies = [];
        let tvShows = [];

        /*
         * Fetch movies and TV independently.
         */
        if (
            contentType === 'both' ||
            contentType === 'movies'
        ) {

            const moviesData = await fetchMovies(
                year,
                genreId,
                sortBy,
                page
            );

            movies = moviesData.results || [];
        }


        if (
            contentType === 'both' ||
            contentType === 'tvShows'
        ) {

            const tvData = await fetchTVShows(
                year,
                genreId,
                sortBy,
                page
            );

            tvShows = tvData.results || [];
        }


        /*
         * Add media type so we always know whether an item
         * is a movie or TV show.
         */
        movies = movies.map(movie => ({
            ...movie,
            media_type: 'movie'
        }));

        tvShows = tvShows.map(show => ({
            ...show,
            media_type: 'tv'
        }));


        /*
         * Combine results.
         */
        let combinedData = [
            ...movies,
            ...tvShows
        ];


        /*
         * Remove items without posters.
         */
        combinedData = combinedData.filter(
            item => item.poster_path
        );


        /*
         * When displaying both types, sort the combined
         * results again so the order is more consistent.
         */
        if (contentType === 'both') {

            combinedData.sort((a, b) => {

                if (sortBy === 'popularity.desc') {
                    return (
                        (b.popularity || 0) -
                        (a.popularity || 0)
                    );
                }

                if (sortBy === 'popularity.asc') {
                    return (
                        (a.popularity || 0) -
                        (b.popularity || 0)
                    );
                }

                if (sortBy === 'vote_average.desc') {
                    return (
                        (b.vote_average || 0) -
                        (a.vote_average || 0)
                    );
                }

                if (sortBy === 'vote_average.asc') {
                    return (
                        (a.vote_average || 0) -
                        (b.vote_average || 0)
                    );
                }

                return 0;
            });
        }


        if (append) {

            appendItems(combinedData);

        } else {

            movieGrid.innerHTML = '';

            displayItems(combinedData);
        }


        /*
         * Show/hide Load More.
         */
        if (combinedData.length > 0) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';

            if (!append) {
                showEmptyState();
            }
        }

    } catch (error) {

        console.error('Error fetching movies and TV shows:', error);

        if (!append) {
            showError(
                'Unable to load content. Please try again.'
            );
        }

    } finally {

        isLoading = false;

        setLoadingState(false);
    }
}


/* =========================================================
   DISPLAY ITEMS
   ========================================================= */

function displayItems(items) {

    if (!movieGrid) return;

    items.forEach(item => {

        if (!item.poster_path) return;


        const card = document.createElement('div');

        card.classList.add('card');


        /*
         * Determine whether this is a movie or TV show.
         */
        const isMovie =
            item.media_type === 'movie' ||
            (
                !item.media_type &&
                Boolean(item.title)
            );


        const title =
            item.title ||
            item.name ||
            'Untitled';


        const rawDate =
            item.release_date ||
            item.first_air_date ||
            '';


        const year =
            rawDate
                ? String(rawDate).substring(0, 4)
                : '—';


        const imgUrl =
            `${imageBaseUrl}${item.poster_path}`;


        /*
         * Correct details page.
         */
        const detailUrl = isMovie
            ? `movie-details.html?movie_id=${encodeURIComponent(item.id)}`
            : `tvshows-details.html?id=${encodeURIComponent(item.id)}`;


        /*
         * Create elements instead of inserting untrusted
         * TMDB data directly into innerHTML.
         */
        const link = document.createElement('a');
        link.href = detailUrl;


        const image = document.createElement('img');

        image.src = imgUrl;
        image.alt = title;
        image.loading = 'lazy';


        /*
         * Prevent broken images from leaving ugly empty cards.
         */
        image.onerror = function () {
            card.remove();
        };


        const yearBadge = document.createElement('span');

        yearBadge.classList.add('year-badge');
        yearBadge.textContent = year;


        link.appendChild(image);
        link.appendChild(yearBadge);

        card.appendChild(link);

        movieGrid.appendChild(card);
    });
}


/* =========================================================
   APPEND ITEMS
   ========================================================= */

function appendItems(items) {
    displayItems(items);
}


/* =========================================================
   UPDATE & FETCH
   ========================================================= */

async function updateAndFetch() {

    currentYearFilter =
        yearSelect.value;

    currentSort =
        sortSelect.value;

    currentPage = 1;

    await fetchMoviesAndTVShows(
        currentContentType,
        currentGenre,
        currentYearFilter,
        currentSort,
        currentPage,
        false
    );
}


/* =========================================================
   CONTENT TYPE CHANGE
   ========================================================= */

if (contentTypeSelect) {

    contentTypeSelect.addEventListener(
        'change',
        async () => {

            currentContentType =
                contentTypeSelect.value;

            currentGenre = 'all';

            updateGenreDropdown();

            genreSelect.value = 'all';

            await updateAndFetch();
        }
    );
}


/* =========================================================
   GENRE CHANGE
   ========================================================= */

if (genreSelect) {

    genreSelect.addEventListener(
        'change',
        async () => {

            currentGenre =
                genreSelect.value;

            await updateAndFetch();
        }
    );
}


/* =========================================================
   YEAR CHANGE
   ========================================================= */

if (yearSelect) {

    yearSelect.addEventListener(
        'change',
        async () => {

            await updateAndFetch();
        }
    );
}


/* =========================================================
   SORT CHANGE
   ========================================================= */

if (sortSelect) {

    sortSelect.addEventListener(
        'change',
        async () => {

            await updateAndFetch();
        }
    );
}


/* =========================================================
   LOAD MORE
   ========================================================= */

if (loadMoreBtn) {

    loadMoreBtn.addEventListener(
        'click',
        async () => {

            if (isLoading) return;

            currentPage++;

            await fetchMoviesAndTVShows(
                currentContentType,
                currentGenre,
                currentYearFilter,
                currentSort,
                currentPage,
                true
            );
        }
    );
}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoadingState(loading) {

    if (!loadMoreBtn) return;

    if (loading) {

        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';

    } else {

        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More';
    }
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function showEmptyState() {

    if (!movieGrid) return;

    movieGrid.innerHTML = '';

    const message = document.createElement('div');

    message.classList.add('empty-message');

    message.textContent =
        'No movies or TV shows found.';

    movieGrid.appendChild(message);
}


/* =========================================================
   ERROR STATE
   ========================================================= */

function showError(message) {

    if (!movieGrid) return;

    movieGrid.innerHTML = '';

    const errorMessage = document.createElement('div');

    errorMessage.classList.add('error-message');

    errorMessage.textContent = message;

    movieGrid.appendChild(errorMessage);

    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}


/* =========================================================
   RESPONSIVE NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const nav = document.querySelector('nav');

    if (!nav) return;


    /*
     * One scroll listener only.
     */
    window.addEventListener(
        'scroll',
        () => {

            if (window.scrollY > 50) {

                nav.classList.add('nav-solid');

            } else {

                nav.classList.remove('nav-solid');
            }
        },
        { passive: true }
    );


    /*
     * Mobile menu.
     */
    const menuButton =
        document.getElementById('menu-btn');

    const menu =
        document.getElementById('menu');


    if (menuButton && menu) {

        menuButton.addEventListener(
            'click',
            () => {

                menu.classList.toggle('active');

                menuButton.classList.toggle('active');
            }
        );
    }
}


/* =========================================================
   DESKTOP "MORE" DROPDOWN
   ========================================================= */

function initializeMoreDropdown() {

    const dropdownButton =
        document.querySelector('.dropbtn');

    const dropdownContent =
        document.querySelector('.dropdown-content');


    if (!dropdownButton || !dropdownContent) {
        return;
    }


    dropdownButton.addEventListener(
        'click',
        event => {

            event.stopPropagation();

            dropdownContent.classList.toggle('active');
        }
    );


    document.addEventListener(
        'click',
        event => {

            if (
                !dropdownButton.contains(event.target) &&
                !dropdownContent.contains(event.target)
            ) {

                dropdownContent.classList.remove('active');
            }
        }
    );
}


/* =========================================================
   MOBILE "MORE" MENU
   ========================================================= */

function initializeMobileMoreMenu() {

    const moreButton =
        document.getElementById('mobile-more-btn');

    const moreMenu =
        document.getElementById('mobile-more-menu');


    if (!moreButton || !moreMenu) {
        return;
    }


    moreButton.addEventListener(
        'click',
        event => {

            event.stopPropagation();

            moreMenu.classList.toggle('show');

            moreButton.classList.toggle('active');
        }
    );


    moreMenu.addEventListener(
        'click',
        event => {

            event.stopPropagation();
        }
    );


    document.addEventListener(
        'click',
        () => {

            moreMenu.classList.remove('show');

            moreButton.classList.remove('active');
        }
    );
}
