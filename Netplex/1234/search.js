const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');

let currentPage = 1;
let currentQuery = '';
let isFetching = false;

// Create loading indicator
const loadingIndicator = document.createElement('p');
loadingIndicator.textContent = 'Loading...';
loadingIndicator.style.display = 'none';
movieGrid.after(loadingIndicator);

// Create Load More button
const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Load More';
loadMoreButton.classList.add('load-more-button');
loadMoreButton.style.display = 'none';
loadMoreButton.addEventListener('click', () => {
  if (!isFetching) {
    currentPage++;
    fetchMoviesOrPerson(currentQuery, currentPage);
  }
});
movieGrid.after(loadMoreButton);

// Function to fetch trending movies/TV shows
async function fetchRecommendations() {
  movieGrid.innerHTML = ''; 
  loadingIndicator.style.display = 'block';

  try {
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    loadingIndicator.style.display = 'none';

    if (!data.results.length) {
      movieGrid.innerHTML = '<p>No recommendations available</p>';
      return;
    }

    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    movieGrid.innerHTML = '<p>Failed to load recommendations</p>';
  }
}

// Function to fetch movies, TV shows, or person
async function fetchMoviesOrPerson(query, page = 1) {
  if (isFetching) return;
  isFetching = true;

  if (page === 1) {
    movieGrid.innerHTML = '';
  }

  loadingIndicator.style.display = 'block';
  
  try {
    const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&language=en-US&page=${page}&include_adult=false`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    loadingIndicator.style.display = 'none';

    if (page === 1 && !data.results.length) {
      movieGrid.innerHTML = '<p>No results found</p>';
      return;
    }

    // Check if the top result is a person
    const person = data.results.find(item => item.media_type === 'person');
    if (person) {
      return fetchPersonCredits(person.id, person.name);
    }

    displayMovies(data.results);

    loadMoreButton.style.display = data.page < data.total_pages ? 'block' : 'none';
  } catch (error) {
    console.error('Error fetching movies:', error);
    movieGrid.innerHTML = '<p>Failed to load results</p>';
  } finally {
    isFetching = false;
  }
}

// Function to fetch movie/TV credits of a person
async function fetchPersonCredits(personId, personName) {
  try {
    const url = `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.cast.length) {
      movieGrid.innerHTML = `<p>No movies or TV shows found for ${personName}</p>`;
      return;
    }

    recommendationText.innerHTML = `<p>Movies and TV Shows featuring ${personName}:</p>`;
    displayMovies(data.cast);
  } catch (error) {
    console.error(`Error fetching credits for ${personName}:`, error);
    movieGrid.innerHTML = `<p>Failed to load movies for ${personName}</p>`;
  }
}

// Function to display movie items
function displayMovies(items) {
  movieGrid.innerHTML = ''; // Clear previous results

  items.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average?.toFixed(1) || 'N/A';
      const id = item.id;
      const mediaType = item.media_type;
      
      const link = document.createElement('a');
      link.href = mediaType === 'movie'
        ? `movie-details.html?movie_id=${id}`
        : `tvshows-details.html?id=${id}`;
      link.setAttribute('aria-label', `View details for ${title}`);

      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');

      movieItem.innerHTML = `
        <div class="rating-container">
          <div class="rating">
            <span class="star">&#9733;</span><span class="rating-number">${rating}</span>
          </div>
        </div>
        <img src="${posterUrl}" alt="Poster of ${title}" />
      `;

      link.appendChild(movieItem);
      movieGrid.appendChild(link);
    }
  });
}

// Debounce function to delay search execution
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Handle search input
searchInput.addEventListener('input', debounce((e) => {
  currentQuery = e.target.value.trim();
  currentPage = 1;

  if (currentQuery) {
    recommendationText.innerHTML = `<p>Searching for "${currentQuery}"...</p>`;
    fetchMoviesOrPerson(currentQuery, currentPage);
  } else {
    recommendationText.innerHTML = '<p>Recommend Movies and TV Shows</p>';
    fetchRecommendations();
    loadMoreButton.style.display = 'none';
  }
}, 500)); // 500ms delay for debounce

// Fetch trending movies on load
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
