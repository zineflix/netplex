const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');

// Function to fetch trending movies & TV shows
async function fetchRecommendations() {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  movieGrid.innerHTML = ''; // Clear previous results

  if (data.results.length === 0) {
    movieGrid.innerHTML = '<p>No recommendations available</p>';
    return;
  }

  displayResults(data.results);
}

// Function to fetch movies, TV shows, or people
async function fetchMoviesOrShows(query, page = 1) {
  movieGrid.innerHTML = '<p>Loading...</p>';

  // Search for movies
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=${page}&include_adult=false`;
  let response = await fetch(movieUrl);
  let data = await response.json();

  if (data.results.length > 0) {
    movieGrid.innerHTML = ''; // Clear loading text
    displayResults(data.results);
    return;
  }

  // Search for TV shows
  const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}&language=en-US&page=${page}`;
  response = await fetch(tvUrl);
  data = await response.json();

  if (data.results.length > 0) {
    movieGrid.innerHTML = ''; // Clear loading text
    displayResults(data.results);
    return;
  }

  // Search for people (actors)
  const personUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}&language=en-US&page=${page}`;
  response = await fetch(personUrl);
  data = await response.json();

  if (data.results.length > 0) {
    fetchPersonCredits(data.results[0].id);
    return;
  }

  // If no results found
  movieGrid.innerHTML = '<p>No results found</p>';
}

// Function to fetch movies & TV shows of a person
async function fetchPersonCredits(personId) {
  const creditsUrl = `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${apiKey}&language=en-US`;
  const response = await fetch(creditsUrl);
  const data = await response.json();

  movieGrid.innerHTML = ''; // Clear previous results

  if (data.cast.length === 0) {
    movieGrid.innerHTML = '<p>No movies or TV shows found for this person</p>';
    return;
  }

  displayResults(data.cast);
}

// Function to display search results
function displayResults(results) {
  results.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average || 0;
      const id = item.id;
      const mediaType = item.media_type;

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
        <img src="${posterUrl}" alt="${title}" />
      `;

      link.appendChild(movieItem);
      movieGrid.appendChild(link);
    }
  });

  loadMoreButton.style.display = 'none'; // Hide load more button for person search
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
