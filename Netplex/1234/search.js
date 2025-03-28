const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');

let currentPage = 1;
let currentQuery = '';

// Function to search for a person (actor/actress)
async function searchPerson(query) {
    try {
        const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results.length) {
            movieGrid.innerHTML = `<p>No actor/actress found for "${query}"</p>`;
            return;
        }

        const person = data.results[0]; // Get the first match (best match)
        const personId = person.id;

        recommendationText.innerHTML = `<p>Showing results for <strong>${person.name}</strong></p>`;

        fetchPersonCredits(personId);
    } catch (error) {
        console.error("Error fetching actor:", error);
        movieGrid.innerHTML = '<p>Failed to fetch actor details. Try again.</p>';
    }
}

// Function to fetch the movies and TV shows an actor has appeared in
async function fetchPersonCredits(personId) {
    try {
        const url = `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        const data = await response.json();

        movieGrid.innerHTML = '';

        if (!data.cast.length) {
            movieGrid.innerHTML = '<p>No movies or TV shows found for this actor.</p>';
            return;
        }

        displayMovies(data.cast);
    } catch (error) {
        console.error("Error fetching credits:", error);
        movieGrid.innerHTML = '<p>Failed to fetch movie and TV show details.</p>';
    }
}

// Function to display movies and TV shows
function displayMovies(results) {
    results.forEach(item => {
        if (item.poster_path) {
            const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
            const title = item.title || item.name;
            const rating = item.vote_average?.toFixed(1) || 'N/A';
            const id = item.id;
            const mediaType = item.media_type; // "movie" or "tv"

            const link = document.createElement('a');
            link.href = mediaType === 'movie' 
                ? `movie-details.html?movie_id=${id}` 
                : `tvshows-details.html?id=${id}`;

            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <div class="rating-container">
                    <div class="rating">
                        <span class="star">&#9733;</span><span class="rating-number">${rating}</span>
                    </div>
                </div>
                <img src="${posterUrl}" alt="${title}" />
            `;

            link.appendChild(movieItem);
            movieGrid.appendChild(link);
        }
    });
}

// Debounce function to limit API calls
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const handleSearchInput = debounce((e) => {
    currentQuery = e.target.value.trim();
    currentPage = 1;
    if (currentQuery) {
        recommendationText.innerHTML = `<p>Searching for "${currentQuery}"...</p>`;
        searchPerson(currentQuery);
    } else {
        recommendationText.innerHTML = '<p>Recommend Movies and TV Shows</p>';
        fetchRecommendations();
    }
}, 300);

searchInput.addEventListener('input', handleSearchInput);

// Fetch trending movies/TV shows when no search is performed
async function fetchRecommendations() {
    try {
        const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        movieGrid.innerHTML = '';

        if (!data.results.length) {
            movieGrid.innerHTML = '<p>No recommendations available</p>';
            return;
        }

        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        movieGrid.innerHTML = '<p>Failed to load recommendations. Please try again later.</p>';
    }
}

// Initial Load
fetchRecommendations();





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
    const dropdown = document.querySelector(".dropdown");

    dropdown.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});
// For Dropdown More Button Function End
