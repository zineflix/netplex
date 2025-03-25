const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const baseUrl = 'https://api.themoviedb.org/3';
const movieGrid = document.getElementById('movie-grid');
const contentTypeSelect = document.getElementById('contentType');
const genreSelect = document.getElementById('genreSelect');
const yearSelect = document.getElementById('yearSelect');
const sortSelect = document.getElementById('sortSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let movieGenres = [];
let tvGenres = [];
let currentYear = new Date().getFullYear();
let currentPage = 1;
let currentContentType = 'both';
let currentGenre = 'all';
let currentYearFilter = 'all';
let currentSort = 'popularity.desc';

async function fetchGenres() {
    try {
        const movieGenresResponse = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`);
        const tvGenresResponse = await fetch(`${baseUrl}/genre/tv/list?api_key=${apiKey}&language=en-US`);
        const movieGenresData = await movieGenresResponse.json();
        const tvGenresData = await tvGenresResponse.json();
        movieGenres = movieGenresData.genres;
        tvGenres = tvGenresData.genres;
        populateGenreDropdown();
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

function populateGenreDropdown() {
    genreSelect.innerHTML = '<option value="all">All Genres</option>';
    let genresToShow = [];

    if (currentContentType === 'movies') {
        genresToShow = movieGenres;
    } else if (currentContentType === 'tvShows') {
        genresToShow = tvGenres;
    } else {
        genresToShow = [...movieGenres, ...tvGenres];
    }

    genresToShow.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

function populateYearDropdown() {
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
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
            const moviesResponse = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&page=${page}${yearQuery}${genreQuery}${sortQuery}`);
            const moviesDataResponse = await moviesResponse.json();
            moviesData = moviesDataResponse.results;
        }

        if (contentType === 'both' || contentType === 'tvShows') {
            const yearQuery = year !== 'all' ? `&first_air_date_year=${year}` : '';
            const tvShowsResponse = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&language=en-US&page=${page}${yearQuery}${genreQuery}${sortQuery}`);
            const tvShowsDataResponse = await tvShowsResponse.json();
            tvShowsData = tvShowsDataResponse.results;
        }

        const combinedData = [...moviesData, ...tvShowsData];

        if (append) {
            appendItems(combinedData);
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
        const imgUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        const detailUrl = item.title
            ? `movie-details.html?movie_id=${item.id}`
            : `tvshows-details.html?id=${item.id}`;

        card.innerHTML = `
            <a href="${detailUrl}">
                <img src="${imgUrl}" alt="${item.title || item.name}">
            </a>
        `;
        movieGrid.appendChild(card);
    });
}

function appendItems(items) {
    displayItems(items);
}

function updateAndFetch() {
    currentYearFilter = yearSelect.value;
    currentSort = sortSelect.value;
    currentPage = 1;
    fetchMoviesAndTVShows(currentContentType, currentGenre, currentYearFilter, currentSort, currentPage);
}

// Content type changes — refresh genres and fetch
contentTypeSelect.addEventListener('change', () => {
    currentContentType = contentTypeSelect.value;
    populateGenreDropdown();
    currentGenre = 'all';
    genreSelect.value = 'all';
    updateAndFetch();
});

// Genre changes — update currentGenre and fetch
genreSelect.addEventListener('change', () => {
    currentGenre = genreSelect.value;
    updateAndFetch();
});

// Year and sort changes
yearSelect.addEventListener('change', updateAndFetch);
sortSelect.addEventListener('change', updateAndFetch);

// Load more button
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchMoviesAndTVShows(currentContentType, currentGenre, currentYearFilter, currentSort, currentPage, true);
});

window.onload = () => {
    fetchGenres();
    populateYearDropdown();
    fetchMoviesAndTVShows(currentContentType, currentGenre, currentYearFilter, currentSort);
};





/* FOR RESPONSIVE NAVIGATION BAR START */
// For Responsive Header
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Solid color after scrolling down
    } else {
        nav.classList.remove("nav-solid"); // Transparent at the top
    }
});

// For sticky header when scrolling
    window.addEventListener("scroll", function () {
      let nav = document.querySelector("nav");
      if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Add solid background when scrolled
      } else {
        nav.classList.remove("nav-solid"); // Remove solid background at top
      }
    });

    // Toggle menu visibility when menu button is clicked
document.getElementById("menu-btn").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("active");
});
/* FOR RESPONSIVE NAVIGATION BAR END */


// For Dropdown More Button Function Start
document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");

    dropdownButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        dropdownContent.classList.toggle("active");
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove("active");
        }
    });
});

// For Dropdown More Button Function End
