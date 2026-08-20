// ==============================
// TMDB CONFIG
// ==============================
const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const baseUrl = 'https://api.themoviedb.org/3';

// ==============================
// UTILITIES
// ==============================
const getJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};

const imgUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';

const byId = (id) => document.getElementById(id);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
const safeOn = (el, ev, fn) => el && el.addEventListener(ev, fn);

// ==============================
// LIST/ROW FETCHING (HOME)
// ==============================
const CATEGORY_ENDPOINTS = {
  popular: `/movie/popular`,
  movies: `/discover/movie?sort_by=popularity.desc&vote_count.gte=500&vote_average=10`,
  trending: `/trending/movie/week`,
  top_rated: `/movie/top_rated`,
  action: `/discover/movie?with_genres=28`,
  comedy: `/discover/movie?with_genres=35`,
  horror: `/discover/movie?with_genres=27`,
  romance: `/discover/movie?with_genres=10749`,
  animation: `/discover/movie?with_genres=16`,
};

async function fetchMovies(category, rowId) {
  const endpoint = CATEGORY_ENDPOINTS[category];
  if (!endpoint) return console.warn(`Unknown category: ${category}`);
  const container = byId(rowId);
  if (!container) return; // Not on this page

  try {
    const data = await getJSON(`${baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US&page=1`);
    container.innerHTML = '';

    (data.results || []).forEach((movie) => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.style.position = 'relative';
      card.innerHTML = `
        <img class="row__poster" src="${imgUrl(movie.poster_path)}" alt="${movie.title}">
        <div class="movie-rating"><i class="fas fa-star"></i> ${Number(movie.vote_average || 0).toFixed(1)}</div>
        <div class="play-button"><i class="fas fa-play"></i></div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `movie-details.html?movie_id=${movie.id}`;
      });
      container.appendChild(card);
    });
  } catch (err) {
    console.error(`Error fetching ${category}:`, err);
  }
}

// ==============================
// BANNER (HOME)
// ==============================
async function fetchBanner() {
  const banner = qs('.banner');
  if (!banner) return; // Not on this page
  try {
    const { results = [] } = await getJSON(`${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
    if (!results.length) return;

    const movie = results[Math.floor(Math.random() * results.length)];
    banner.style.backgroundImage = `url(${imgUrl(movie.backdrop_path, 'original')})`;
    const titleEl = qs('.banner__title');
    const descEl = qs('.banner__description');
    if (titleEl) titleEl.textContent = movie.title || 'Untitled';
    if (descEl) {
      const text = movie.overview || '';
      descEl.textContent = text.length > 150 ? text.slice(0, 150) + '...' : text;
    }

    // Play button inside banner, if present
    const bannerPlay = banner.querySelector('.play-button') || byId('banner-play-btn');
    safeOn(bannerPlay, 'click', () => {
      window.location.href = `movie-details.html?movie_id=${movie.id}`;
    });
  } catch (err) {
    console.error('Error fetching banner:', err);
  }
}

// ==============================
// HORIZONTAL ARROW NAV (HOME)
// ==============================
function initArrowNavigation() {
  qsa('.row__posters').forEach((row) => {
    const prev = row.parentElement?.querySelector('.arrow-button.prev');
    const next = row.parentElement?.querySelector('.arrow-button.next');
    if (!prev || !next) return;

    let x = 0;
    const step = 220;
    safeOn(prev, 'click', () => {
      x = Math.max(0, x - step);
      row.scrollTo({ left: x, behavior: 'smooth' });
    });
    safeOn(next, 'click', () => {
      const max = row.scrollWidth - row.clientWidth;
      x = Math.min(max, x + step);
      row.scrollTo({ left: x, behavior: 'smooth' });
    });
  });
}

// ==============================
// SEARCH BAR UI (GLOBAL)
// ==============================
function toggleSearchBar() {
  qs('.search-bar')?.classList.toggle('show');
}

function openSearchPage() {
  window.location.href = 'search.html';
}

// ==============================
// FAVORITES / LIST PAGE (GLOBAL)
// ==============================
function renderSavedList() {
  const container = byId('movie-list-container');
  if (!container) return; // Not on this page
  const movieList = JSON.parse(localStorage.getItem('movieList') || '[]');

  if (!movieList.length) {
    container.innerHTML = '<p>Your movie list is empty!</p>';
    return;
  }

  container.innerHTML = '';
  movieList.forEach((movie) => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img class="row__poster" src="${imgUrl(movie.poster_path)}" alt="${movie.title}">
      <p>${movie.title}</p>
    `;
    card.addEventListener('click', () => {
      window.location.href = `movie-details.html?movie_id=${movie.id}`;
    });
    container.appendChild(card);
  });
}

// ==============================
// STREAMING SERVERS (DETAILS)
// ==============================
const MOVIE_ENDPOINTS = [
  { url: 'https://cinesrc.st/embed/movie/', name: 'Server 1' },  
  { url: 'https://web.nxsha.app/embed/movie/', name: 'Server 2' },  
  { url: 'https://anicine.xyz/embed?url=https://embed.asfnsa-alig.workers.dev/movie/', name: 'Server 3' },
  { url: 'https://1embed.cc/embed/movie/', name: 'Server 4' },
  { url: 'https://yapgrid.com/embed/movie/', name: 'Server 5' },
  { url: 'https://cinevaro.app/media/tmdb-movie-', name: 'Server 6' },
  { url: 'https://anyembed.xyz/embed/tmdb-movie-', name: 'Server 7' },  
  { url: 'https://hexa.su/watch/movie/', name: 'Server 8' },
  { url: 'https://vidzen.fun/movie/', name: 'Server 9' },
  { url: 'https://rivestream.ru/watch?type=movie&id=', name: 'Server 10' },
  { url: 'https://vidlux.xyz/embed/movie/', name: 'Server 11' },
  { url: 'https://vidup.to/movie/', name: 'Server 12 Ads' },
  { url: 'https://vsembed.ru/embed/movie/', name: 'Server 13 Ads' },
  { url: 'https://api.cineby.homes/embed/movie/', name: 'Server 14 Ads' },
  { url: 'https://vidbolt.pro/movie/', name: 'Server 15 Ads' },
  { url: 'https://player.videasy.to/movie/', name: 'Server 16 Ads' },
  { url: 'https://vidcore.io/movie/', name: 'Server 17 Ads' },
  { url: 'https://vaplayer.ru/embed/movie/', name: 'Server 18 Ads' },
  { url: 'https://vidsrc.hair/embed/movie/', name: 'Server 19 Ads' },
  { url: 'https://player.zxcstream.xyz/player/movie/', name: 'Server 20 Ads' },
  { url: 'https://111movies.net/movie/', name: 'Server 21 Ads' },
  { url: 'https://moviesapi.to/movie/', name: 'Server 22 Ads' },
  { url: 'https://vidrock.net/movie/', name: 'Server 23 Ads' },
  { url: 'https://embedmaster.link/movie/', name: 'Server 24 Ads' },
  { url: 'https://mapple.rip/watch/movie/', name: 'Server 25 Ads' },
];

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movie_id');
let currentServerIndex = 0;

// ==============================
// DETAILS PAGE
// ==============================
async function fetchMovieDetails() {
  if (!movieId) return; // Not on details page
  try {
    // Details
    const movie = await getJSON(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`);

    const poster = byId('movie-poster');
    if (poster) poster.src = imgUrl(movie.poster_path);

    const bgEl = qs('.blurred-background');
    if (bgEl) {
      bgEl.style.backgroundImage = 'none';
      bgEl.style.backgroundColor = 'black';
    }

    const desc = byId('movie-description');
    if (desc) desc.textContent = movie.overview || 'No description available.';

    const titleEl = byId('movie-title');
    if (titleEl) titleEl.textContent = movie.title || 'Untitled';
    
    // Cast
    const { cast = [] } = await getJSON(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`);
    const castContainer = byId('movie-cast');
    if (castContainer) {
      castContainer.innerHTML = '';
      cast.slice(0, 6).forEach((actor) => {
        const member = document.createElement('div');
        member.className = 'cast-member';
        member.innerHTML = `
          <img src="${actor.profile_path ? imgUrl(actor.profile_path, 'w185') : 'https://via.placeholder.com/100x150?text=No+Image'}" alt="${actor.name}">
          <p style="color:white">${actor.name}</p>
        `;
        castContainer.appendChild(member);
      });
    }

    // Trailer (YouTube)
    const videos = await getJSON(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`);
    const trailer = (videos.results || []).find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    const trailerIframe = byId('movie-iframe-trailer');
    const trailerPopup = byId('trailer-popup');
    const closeTrailerBtn = byId('close-trailer');
    const trailerBtn = byId('watch-trailer-btn');

    if (trailer && trailerBtn && trailerPopup && trailerIframe) {
      safeOn(trailerBtn, 'click', () => {
        trailerPopup.style.display = 'flex';
        trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
      });
      safeOn(closeTrailerBtn, 'click', () => {
        trailerPopup.style.display = 'none';
        trailerIframe.src = ''; // stop video
      });
    }

    // Download
    const downloadBtn = byId('download-btn');
    safeOn(downloadBtn, 'click', () => {
      if (movieId) {
        const downloadUrl = `https://dl.vidsrc.vip/movie/${movieId}`;
        window.open(downloadUrl, '_blank');
      }
    });
    
    // Rating (5 stars)
    const starWrap = byId('movie-rating');
    if (starWrap) {
      starWrap.innerHTML = '';
      const filled = Math.round((movie.vote_average || 0) / 2);
      const empty = 5 - filled;
      for (let i = 0; i < filled; i++) {
        const s = document.createElement('span');
        s.className = 'star filled';
        starWrap.appendChild(s);
      }
      for (let i = 0; i < empty; i++) {
        const s = document.createElement('span');
        s.className = 'star empty';
        starWrap.appendChild(s);
      }
    }

    // Genres
    const genreWrap = byId('movie-genres');
    if (genreWrap) {
      genreWrap.innerHTML = '';
      (movie.genres || []).forEach((g) => {
        const sp = document.createElement('span');
        sp.className = 'genre';
        sp.textContent = g.name;
        genreWrap.appendChild(sp);
      });
    }

    // Iframe + Auto-load Server 1
    const iframeContainer = byId('iframe-container');
    const movieIframe = byId('movie-iframe');
    const watchNowBtn = byId('watch-now-btn');

    if (iframeContainer && movieIframe) {
      iframeContainer.style.display = 'flex';
      movieIframe.src = `${MOVIE_ENDPOINTS[0].url}${movieId}?autoplay=true`;
      if (watchNowBtn) watchNowBtn.style.display = 'none';
    }

    // Servers dropdown
    const changeServerBtn = byId('change-server-btn');
    const serverDropdown = byId('server-dropdown');
    const serverList = byId('server-list');

    if (serverList) {
      serverList.innerHTML = '';
      MOVIE_ENDPOINTS.forEach((endpoint, idx) => {
        const li = document.createElement('li');
        li.textContent = endpoint.name;
        li.addEventListener('click', () => changeServer(idx));
        serverList.appendChild(li);
      });
    }

    // Toggle server dropdown menu on button click
    safeOn(changeServerBtn, 'click', (e) => {
      e.stopPropagation();
      if (!serverDropdown) return;
      
      const isCurrentlyDisplayed = serverDropdown.style.display === 'block' || serverDropdown.classList.contains('show');
      
      if (isCurrentlyDisplayed) {
        serverDropdown.style.display = 'none';
        serverDropdown.classList.remove('show');
      } else {
        serverDropdown.style.display = 'block';
        serverDropdown.classList.add('show');
      }
      
      const icon = changeServerBtn.querySelector('.dropdown-icon');
      if (icon) icon.classList.toggle('open', !isCurrentlyDisplayed);
    });

    function changeServer(index) {
      if (index < 0 || index >= MOVIE_ENDPOINTS.length) {
        console.error("Invalid server index.");
        return;
      }

      currentServerIndex = index;
      const movieIframe = byId('movie-iframe');
      const serverDropdown = byId('server-dropdown');
      const changeServerBtn = byId('change-server-btn');
      let dropdownIcon = changeServerBtn ? changeServerBtn.querySelector('.dropdown-icon') : null;
      const sandboxBtn = byId('sandbox-toggle');
      const selectedServer = MOVIE_ENDPOINTS[currentServerIndex];

      // Enable sandbox
      if (movieIframe) {
        movieIframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
      }
      if (sandboxBtn) {
        sandboxBtn.classList.remove('off');
        sandboxBtn.classList.add('on');
        sandboxBtn.textContent = "Sandbox: ON";
      }

      // Build URL based on server format
      let url;
      if (selectedServer.url.includes('?id=')) {
        url = `${selectedServer.url}${movieId}`;
      } else if (selectedServer.url.includes('moviesapi.to/movie/')) {
        url = `${selectedServer.url}${movieId}`;
      } else {
        url = `${selectedServer.url}${movieId}?autoplay=true`;
      }

      if (movieIframe) movieIframe.src = url;

      // Update button text while preserving the icon
      if (changeServerBtn) {
        changeServerBtn.textContent = selectedServer.name + ' ';
        if (!dropdownIcon) {
          dropdownIcon = document.createElement('i');
          dropdownIcon.className = 'fas fa-chevron-down dropdown-icon';
        }
        dropdownIcon.classList.remove('open');
        changeServerBtn.appendChild(dropdownIcon);
      }

      // Close dropdown
      if (serverDropdown) {
        serverDropdown.style.display = 'none';
        serverDropdown.classList.remove('show');
      }

      console.log(`Changed to server: ${selectedServer.name}, URL: ${url}`);
    }

    // Close iframe
    const closeIframeBtn = byId('close-iframe-btn');
    safeOn(closeIframeBtn, 'click', () => {
      if (!iframeContainer || !movieIframe || !watchNowBtn) return;
      iframeContainer.style.display = 'none';
      movieIframe.src = '';
      watchNowBtn.style.display = 'block';
      window.location.reload();
    });

  } catch (err) {
    console.error('Error fetching movie details:', err);
  }  
}

// ==============================
// GLOBAL OUTSIDE CLICK HANDLER
// ==============================
document.addEventListener('click', (e) => {
  // Search bar outside click logic
  const bar = qs('.search-bar');
  const icons = qs('.icons-container');
  if (bar && !bar.contains(e.target) && !icons?.contains(e.target)) {
    bar.classList.remove('show');
  }

  // Server Dropdown outside click logic
  const changeServerBtn = byId('change-server-btn');
  const serverDropdown = byId('server-dropdown');
  const serverControl = qs('.server-control');

  if (serverDropdown && (serverDropdown.style.display === 'block' || serverDropdown.classList.contains('show'))) {
    // If the click is outside both the button and the dropdown list
    if (
      (!changeServerBtn || !changeServerBtn.contains(e.target)) &&
      (!serverControl || !serverControl.contains(e.target)) &&
      !serverDropdown.contains(e.target)
    ) {
      serverDropdown.style.display = 'none';
      serverDropdown.classList.remove('show');
      const icon = changeServerBtn?.querySelector('.dropdown-icon');
      if (icon) icon.classList.remove('open');
    }
  }
});

// ==============================
// GLOBAL UI / MISC
// ==============================
safeOn(document, 'DOMContentLoaded', () => {
  // Home rows (only render where containers exist)
  const rowMap = [
    ['popular', 'popularMovies'],
    ['movies', 'popularMovie'],
    ['trending', 'trendingNow'],
    ['top_rated', 'topRated'],
    ['action', 'actionMovies'],
    ['comedy', 'comedyMovies'],
    ['horror', 'horrorMovies'],
    ['romance', 'romanceMovies'],
    ['animation', 'animation'],
  ];
  rowMap.forEach(([cat, id]) => fetchMovies(cat, id));

  // Banner (home)
  fetchBanner();

  // Saved list page
  renderSavedList();

  // Horizontal scrollers
  initArrowNavigation();

  // Header behavior
  safeOn(window, 'scroll', () => {
    const nav = qs('nav');
    if (nav) nav.classList.toggle('nav-solid', window.scrollY > 50);
  });

  // Menu toggle
  safeOn(byId('menu-btn'), 'click', () => {
    byId('menu')?.classList.toggle('active');
  });

  // Close button (back to home)
  safeOn(byId('close-button'), 'click', () => (window.location.href = 'index.html'));

  // Loading screen hide
  safeOn(window, 'load', () => {
    setTimeout(() => {
      const loader = byId('loading-screen');
      if (loader) loader.style.display = 'none';
    }, 1000);
  });

  // Comments fetch hook (kept, but guarded)
  if (typeof getComments === 'function') {
    safeOn(window, 'load', getComments);
  }

  // Details page
  fetchMovieDetails();
});

// ==============================
// Floating message close
// ==============================
function closeMessage() {
  const el = byId('floating-message');
  if (el) el.style.display = 'none';
}

// ==============================
// Fullscreen for iframe (TV + Desktop + Mobile)
// ==============================
function toggleFullscreen() {
  const iframe = document.getElementById('movie-iframe');
  const iframeContainer = document.getElementById('iframe-container');

  if (!iframeContainer || !iframe) {
    console.error('Iframe or container not found.');
    return;
  }

  // Detect fullscreen support
  const doc = document;
  const isFullscreen =
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement;

  // Detect if running on a Smart TV / TV browser
  const userAgent = navigator.userAgent.toLowerCase();
  const isTV =
    /smart-tv|smarttv|appletv|googletv|hbbtv|netcast|viera|roku|dtv|firetv|aftb|afta|bravia|tizen|web0s|tv bro|tvbrowser|tv safari/.test(
      userAgent
    );

  if (isFullscreen) {
    // Exit fullscreen mode
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }

    // Exit CSS pseudo-fullscreen
    iframeContainer.classList.remove('pseudo-fullscreen');

    // Unlock orientation (for mobile)
    if (!isTV && screen.orientation?.unlock) {
      screen.orientation.unlock().catch(() => {});
    }

  } else {
    // Try Fullscreen API first
    const requestFs =
      iframe.requestFullscreen ||
      iframe.webkitRequestFullscreen ||
      iframe.mozRequestFullScreen ||
      iframe.msRequestFullscreen;

    const containerRequestFs =
      iframeContainer.requestFullscreen ||
      iframeContainer.webkitRequestFullscreen ||
      iframeContainer.mozRequestFullScreen ||
      iframeContainer.msRequestFullscreen;

    // If browser supports fullscreen
    if (requestFs) {
      requestFs.call(iframe).catch(() => {
        // fallback if iframe blocks fullscreen
        if (containerRequestFs) containerRequestFs.call(iframeContainer);
      });
    } else if (containerRequestFs) {
      containerRequestFs.call(iframeContainer);
    } else {
      // No fullscreen API — fallback for some TVs
      iframeContainer.classList.add('pseudo-fullscreen');
    }

    // Lock to landscape on mobile devices
    if (!isTV && screen.orientation?.lock) {
      screen.orientation.lock('landscape').catch((e) => {
        console.log('Orientation lock failed:', e);
      });
    }
  }
}

// ==============================
// Sandbox Toggle
// ==============================
const sandboxWarning = byId('sandbox-warning');
const proceedBtn = byId('proceed-btn');
const abortBtn = byId('abort-btn');

// Function to safely turn OFF sandbox
function disableSandbox() {
  const sandboxBtn = byId('sandbox-toggle');
  const iframe = byId('movie-iframe');

  if (!iframe) return;

  iframe.removeAttribute('sandbox');
  sandboxBtn.classList.remove('on');
  sandboxBtn.classList.add('off');
  sandboxBtn.textContent = "Sandbox: OFF";
  console.log("Sandbox disabled");

  // Reload the iframe to apply the change
  iframe.src = iframe.src;
  if (sandboxWarning) sandboxWarning.style.display = 'none';
}

// Event listener for the main toggle button
safeOn(byId('sandbox-toggle'), 'click', () => {
  const sandboxBtn = byId('sandbox-toggle');
  const iframe = byId('movie-iframe');

  if (!iframe) return;

  if (sandboxBtn.classList.contains('on')) {
    // Show the warning pop-up
    if (sandboxWarning) sandboxWarning.style.display = 'flex';
  } else {
    // Turn ON sandbox directly
    iframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    sandboxBtn.classList.remove('off');
    sandboxBtn.classList.add('on');
    sandboxBtn.textContent = "Sandbox: ON";
    console.log("Sandbox enabled");
    // Reload the iframe to apply the change
    iframe.src = iframe.src;
  }
});

// Event listeners for the pop-up buttons
safeOn(proceedBtn, 'click', disableSandbox);

safeOn(abortBtn, 'click', () => {
  if (sandboxWarning) sandboxWarning.style.display = 'none';
});
