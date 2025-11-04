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
document.addEventListener('click', (e) => {
  const bar = qs('.search-bar');
  const icons = qs('.icons-container');
  if (bar && !bar.contains(e.target) && !icons?.contains(e.target)) {
    bar.classList.remove('show');
  }
});
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
  { url: 'https://vidsrc.cc/v2/embed/movie/', name: 'Server 1' },  
  { url: 'https://vidjoy.pro/embed/movie/', name: 'Server 2' },
  { url: 'https://vidsrc.cc/v3/embed/movie/', name: 'Server 3' },
  { url: 'https://embed.rgshows.me/api/1/movie/?id=', name: 'Server 4' },
  { url: 'https://vidsrc.wtf/api/1/movie/?id=', name: 'Server 5' },  
  { url: 'https://embed.rgshows.me/api/3/movie/?id=', name: 'Server 6' },
  { url: 'https://hexa.watch/watch/movie/', name: 'Server 7' },
  { url: 'https://apimocine.vercel.app/movie/', name: 'Server 8' },
  { url: 'https://vidsrc.wtf/api/3/movie/?id=', name: 'Server 9' },
  { url: 'https://www.2embed.cc/embed/', name: 'Server 10' },
  { url: 'https://rivestream.org/embed?type=movie&id=', name: 'Server 11' },
  { url: 'https://player.vidplus.to/embed/movie/', name: 'Server 12' },
  { url: 'https://flixer.sh/watch/movie/', name: 'Server 13' },
  { url: 'https://player.videasy.net/movie/', name: 'Server 14 Ads' },
  { url: 'https://vidrock.net/movie/', name: 'Server 15 Ads' },  
  { url: 'https://vidfast.pro/movie/', name: 'Server 16 Ads' },
  { url: 'https://vidsrc.su/embed/movie/', name: 'Server 17 Ads' },
  { url: 'https://111movies.com/movie/', name: 'Server 18 Ads' },
  { url: 'https://vidlink.pro/movie/', name: 'Server 19 Ads' },
  { url: 'https://vidsrc.net/embed/movie/', name: 'Server 20 Ads' },
  { url: 'https://player.embed-api.stream/?id=', name: 'Server 21 Ads' },
  { url: 'https://moviesapi.to/movie/', name: 'Server 22 Ads' },
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
    const button = document.getElementById("toggleSandbox");
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

    safeOn(changeServerBtn, 'click', () => {
      if (!serverDropdown) return;
      serverDropdown.style.display = serverDropdown.style.display === 'block' ? 'none' : 'block';
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
  const dropdownIcon = changeServerBtn.querySelector('.dropdown-icon');
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
    // Query string format
    url = `${selectedServer.url}${movieId}`;
  } else if (selectedServer.url.includes('moviesapi.to/movie/')) {
    // Special case for Server 18 (no ?autoplay)
    url = `${selectedServer.url}${movieId}`;
  } else {
    // Standard path format
    url = `${selectedServer.url}${movieId}?autoplay=true`;
  }

  if (movieIframe) movieIframe.src = url;

  // Update button text
  if (changeServerBtn) {
    changeServerBtn.textContent = '';
    changeServerBtn.appendChild(document.createTextNode(selectedServer.name));
    changeServerBtn.appendChild(dropdownIcon);
  }

  if (serverDropdown) serverDropdown.style.display = 'none';

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
  sandboxWarning.style.display = 'none';
}

// Event listener for the main toggle button
safeOn(byId('sandbox-toggle'), 'click', () => {
  const sandboxBtn = byId('sandbox-toggle');
  const iframe = byId('movie-iframe');

  if (!iframe) return;

  if (sandboxBtn.classList.contains('on')) {
    // Show the warning pop-up
    sandboxWarning.style.display = 'flex';
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
  sandboxWarning.style.display = 'none';
});


// ==============================
// BLOCK ADBANNERS / ADSENSE INSIDE IFRAME CONTAINER
// ==============================
function removeAdsFromIframeContainer() {
  const container = document.getElementById('iframe-container');
  if (!container) return;

  // Remove any Google ads or suspicious iframes inside the container
  const ads = container.querySelectorAll(
    'iframe[src*="ads"], iframe[src*="doubleclick"], iframe[src*="googlesyndication"], iframe[src*="adservice"], ' +
    'iframe[name*="google"], iframe[id*="aswift"], div[id*="ad"], div[class*="ad"]'
  );

  ads.forEach(ad => {
    console.warn('Removed ad iframe:', ad);
    ad.remove();
  });

  // Optional: prevent new ads from being injected
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 &&
          (
            node.matches('iframe[src*="ads"]') ||
            node.matches('iframe[src*="doubleclick"]') ||
            node.matches('iframe[src*="googlesyndication"]') ||
            node.matches('iframe[src*="adservice"]') ||
            node.matches('iframe[name*="google"]') ||
            node.matches('iframe[id*="aswift"]') ||
            node.matches('div[id*="ad"]') ||
            node.matches('div[class*="ad"]')
          )
        ) {
          console.warn('Blocked new ad node:', node);
          node.remove();
        }
      });
    });
  });

  observer.observe(container, { childList: true, subtree: true });
}

// Run on load and periodically to ensure ads don't reappear
window.addEventListener('load', () => {
  removeAdsFromIframeContainer();
  // Double-check every 5 seconds in case ads are dynamically reinserted
  setInterval(removeAdsFromIframeContainer, 5000);
});
