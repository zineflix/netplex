const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');

// Function to fetch popular or trending movies/TV shows
async function fetchRecommendations() {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  // Clear previous results
  movieGrid.innerHTML = '';

  if (data.results.length === 0) {
    movieGrid.innerHTML = '<p>No recommendations available</p>';
    return;
  }

  // Display the recommended movies/TV shows
  data.results.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average || 0;
      const id = item.id; // Unique ID of the movie or TV show
      const mediaType = item.media_type; // "movie" or "tv"

      // Create a link that points to the correct details page based on media type
      const link = document.createElement('a');
      link.href = mediaType === 'movie' 
        ? `movie-details.html?movie_id=${id}` // Movie details page
        : `tvshows-details.html?id=${id}`; // TV Show details page

      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      
      // grab release year (fallback to first_air_date for TV)
const year = (item.release_date || item.first_air_date || '').slice(0,4) || '—';

movieItem.innerHTML = `
  <div class="rating-container">
    <div class="rating">
      <span class="star">&#9733;</span><span class="rating-number">${rating.toFixed(1)}</span>
    </div>
  </div>

  <div class="year-container">
    <span class="year">${year}</span>
  </div>

  <img src="${posterUrl}" alt="${title}" />
`;


      // Append the movie item to the link and the link to the movie grid
      link.appendChild(movieItem);
      movieGrid.appendChild(link);
    }
  });
}

// Function to fetch movies/TV shows based on search query
let currentPage = 1;
let currentQuery = '';

async function fetchMovies(query, page = 1) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&language=en-US&page=${page}&include_adult=false`;
  const response = await fetch(url);
  const data = await response.json();

  if (page === 1) {
    movieGrid.innerHTML = ''; // Clear only on first page
  }

  if (data.results.length === 0 && page === 1) {
    movieGrid.innerHTML = '<p>No results found</p>';
    return;
  }

  data.results.forEach(item => {
  if (item.poster_path) {
    const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
    const title = item.title || item.name;
    const rating = item.vote_average || 0;
    const id = item.id;
    const mediaType = item.media_type;

    const year = (item.release_date || item.first_air_date || '').slice(0, 4) || '—';

    const link = document.createElement('a');
    link.href = mediaType === 'movie'
      ? `movie-details.html?movie_id=${id}`
      : `tvshows-details.html?id=${id}`;

    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');

    movieItem.innerHTML = `
      <div class="rating-container">
        <div class="rating">
          <span class="star">&#9733;</span><span class="rating-number">${rating.toFixed(1)}</span>
        </div>
      </div>

      <div class="year-container">
        <span class="year">${year}</span>
      </div>

      <img src="${posterUrl}" alt="${title}" />
    `;

    link.appendChild(movieItem);
    movieGrid.appendChild(link);
  }
});


  // Show load more button if more pages exist
  if (data.page < data.total_pages) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
}

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Load More';
loadMoreButton.style.display = 'none';
loadMoreButton.addEventListener('click', () => {
  currentPage++;
  fetchMovies(currentQuery, currentPage);
});
movieGrid.after(loadMoreButton);

searchInput.addEventListener('input', (e) => {
  currentQuery = e.target.value.trim();
  currentPage = 1;
  if (currentQuery) {
    recommendationText.innerHTML = `<p>Searching for "${currentQuery}"...</p>`;
    fetchMovies(currentQuery, currentPage);
  } else {
    recommendationText.innerHTML = '<p>Recommend Movies and TV Shows</p>';
    fetchRecommendations();
    loadMoreButton.style.display = 'none';
  }
});

// Load More Button
loadMoreButton.classList.add('load-more-button');

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
