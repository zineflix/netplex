const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');
let currentPage = 1;
let currentQuery = '';
let totalPages = 1;

async function fetchRecommendations() {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.results, 'Recommendations');
  } catch (error) {
    movieGrid.innerHTML = '<p>Failed to load recommendations</p>';
  }
}

async function fetchMovies(query, page = 1) {
  const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    totalPages = data.total_pages;
    if (data.results.length === 0 && page === 1) {
      searchByActor(query);
    } else {
      displayResults(data.results, `Results for "${query}"`, page);
    }
  } catch (error) {
    movieGrid.innerHTML = '<p>Error fetching results</p>';
  }
}

async function searchByActor(actorName) {
  const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(actorName)}&language=en-US`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch actor data");

    const data = await response.json();

    if (data.results.length === 0) {
      movieGrid.innerHTML = '<p>No actors found</p>';
      return;
    }

    if (data.results.length === 1) {
      // Only one actor found, display their movies/shows
      displayActorMovies(data.results[0]);
    } else {
      // Multiple actors found, let the user select
      displayActorChoices(data.results);
    }

  } catch (error) {
    console.error("Error fetching actor details:", error);
    movieGrid.innerHTML = '<p>Error fetching actor details. Please try again.</p>';
  }
}

function displayActorChoices(actors) {
  const actorList = actors
    .map((actor, index) => {
      const profilePic = actor.profile_path 
        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
        : "https://via.placeholder.com/100x150?text=No+Image";
      
      return `
        <div class="actor-option" onclick="displayActorMovies(${index})">
          <img src="${profilePic}" alt="${actor.name}" />
          <p>${actor.name}</p>
        </div>
      `;
    })
    .join("");

  movieGrid.innerHTML = `
    <div class="actor-selection">
      <h3>Select an Actor:</h3>
      <div class="actor-list">${actorList}</div>
    </div>
  `;

  // Store actors in a global variable for selection later
  window.selectedActors = actors;
}

function displayActorMovies(actorIndex) {
  const actor = window.selectedActors[actorIndex];

  if (!actor.known_for || actor.known_for.length === 0) {
    movieGrid.innerHTML = `<p>No movies or shows found for ${actor.name}</p>`;
    return;
  }

  displayResults(actor.known_for, `Movies & Shows with ${actor.name}`);
}


function displayResults(items, title, page = 1) {
  if (page === 1) {
    movieGrid.innerHTML = '';
  }
  recommendationText.innerHTML = `<p>${title}</p>`;
  
  items.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average || 0;
      const id = item.id;
      const mediaType = item.media_type || 'movie';
      
      const link = document.createElement('a');
      link.href = mediaType === 'movie' ? `movie-details.html?movie_id=${id}` : `tvshows-details.html?id=${id}`;
      
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
  
  if (currentPage < totalPages) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
}

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Load More';
loadMoreButton.classList.add('load-more-button');
loadMoreButton.style.display = 'none';
loadMoreButton.addEventListener('click', () => {
  currentPage++;
  fetchMovies(currentQuery, currentPage);
});
movieGrid.after(loadMoreButton);

searchInput.addEventListener('input', debounce((e) => {
  currentQuery = e.target.value.trim();
  currentPage = 1;
  if (currentQuery) {
    fetchMovies(currentQuery, currentPage);
  } else {
    recommendationText.innerHTML = '<p>Recommend Movies and TV Shows</p>';
    fetchRecommendations();
    loadMoreButton.style.display = 'none';
  }
}, 500));

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

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
