  // Scroll Bar Background Effect
      window.addEventListener("scroll", function () {
          let nav = document.querySelector("nav");
          if (window.scrollY > 30) {
              nav.classList.add("nav-solid");
          } else {
              nav.classList.remove("nav-solid");
          }
      });

      // Mobile Dropdown Handling
      document.addEventListener("DOMContentLoaded", function () {
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

          // Fetch initial recommendations on load
          getRandomRecommendations();
      });

      const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
      const apiUrl = 'https://api.themoviedb.org/3/';

      async function getRandomRecommendations() {
          const randomPage = Math.floor(Math.random() * 10) + 1;
          const randomMediaType = Math.random() > 0.5 ? 'movie' : 'tv';

          const url = `${apiUrl}discover/${randomMediaType}?api_key=${apiKey}&page=${randomPage}&language=en-US`;

          try {
              const response = await fetch(url);
              const data = await response.json();
              displayResults(data.results);
          } catch (error) {
              console.error('Error fetching data: ', error);
          }
      }

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    results.forEach(item => {
        if (!item.poster_path) return;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        const posterPath = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        const title = item.title || item.name;
        const itemId = item.id;
        const mediaType = item.title ? 'movie' : 'tv';

        // Extract year from release_date (movies) or first_air_date (TV shows)
        const dateStr = item.release_date || item.first_air_date || '';
        const year = dateStr ? dateStr.split('-')[0] : 'N/A';

        const targetUrl = mediaType === 'movie' 
            ? `movie-details.html?movie_id=${itemId}` 
            : `tvshows-details.html?id=${itemId}`;

        itemDiv.innerHTML = `
            <a href="${targetUrl}">
                <img src="${posterPath}" alt="${title}" loading="lazy">
                <div class="item-info">
                    <div class="item-meta">
                        <span class="item-badge">${mediaType}</span>
                        <span class="item-year">${year}</span>
                    </div>
                    <div class="item-title">${title}</div>
                </div>
            </a>
        `;

        resultsContainer.appendChild(itemDiv);
    });
}
