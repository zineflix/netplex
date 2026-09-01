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

// Helper to reliably close trailer
function closeTrailerModal() {
  const trailerPopup = byId('trailer-popup');
  const trailerIframe = byId('movie-iframe-trailer');
  const trailerBtn = byId('watch-trailer-btn');

  if (trailerPopup) trailerPopup.style.display = 'none';
  if (trailerIframe) trailerIframe.src = '';
  if (trailerBtn) {
    trailerBtn.focus();
  }
}

// ==============================
// DETAILS PAGE
// ==============================
async function fetchMovieDetails() {
  if (!movieId) return;
  try {
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

    // Trailer (Guaranteed Autoplay on TV)
    const videos = await getJSON(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`);
    const trailer = (videos.results || []).find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    const trailerIframe = byId('movie-iframe-trailer');
    const trailerPopup = byId('trailer-popup');
    const closeTrailerBtn = byId('close-trailer');
    const trailerBtn = byId('watch-trailer-btn');

    if (trailer && trailerBtn && trailerPopup && trailerIframe && closeTrailerBtn) {
      safeOn(trailerBtn, 'click', () => {
        trailerPopup.style.display = 'flex';
        // Note: Android TV webviews require mute=1 and playsinline=1 to bypass silent auto-block policy
        trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&playsinline=1&controls=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
        
        setTimeout(() => {
          closeTrailerBtn.focus();
        }, 100);
      });

      safeOn(closeTrailerBtn, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeTrailerModal();
      });

      safeOn(closeTrailerBtn, 'keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13 || e.key === 'Select') {
          e.preventDefault();
          e.stopPropagation();
          closeTrailerModal();
        }
      });
    }

    // Rating
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

    // Iframe Auto-load
    const iframeContainer = byId('iframe-container');
    const movieIframe = byId('movie-iframe');

    if (iframeContainer && movieIframe) {
      iframeContainer.style.display = 'flex';
      movieIframe.src = `${MOVIE_ENDPOINTS[0].url}${movieId}?autoplay=true`;
    }

    // Build Server List
    buildServerList();

  } catch (err) {
    console.error('Error fetching movie details:', err);
  }  
}

function buildServerList() {
  const serverDropdown = byId('server-dropdown');
  const serverList = byId('server-list');
  const changeServerBtn = byId('change-server-btn');

  if (serverList) {
    serverList.innerHTML = '';
    MOVIE_ENDPOINTS.forEach((endpoint, idx) => {
      const li = document.createElement('li');
      li.textContent = endpoint.name;
      li.setAttribute('tabindex', '0');
      
      const chooseThisServer = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        changeServer(idx);
      };

      li.addEventListener('click', chooseThisServer);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13 || e.key === 'Select') {
          chooseThisServer(e);
        }
      });

      serverList.appendChild(li);
    });
  }

  safeOn(changeServerBtn, 'click', (e) => {
    e.stopPropagation();
    if (!serverDropdown) return;
    
    const isCurrentlyDisplayed = serverDropdown.classList.contains('show') || serverDropdown.style.display === 'block';
    
    if (isCurrentlyDisplayed) {
      closeServerDropdown();
    } else {
      openServerDropdown();
    }
  });
}

function openServerDropdown() {
  const serverDropdown = byId('server-dropdown');
  const changeServerBtn = byId('change-server-btn');
  if (!serverDropdown) return;

  serverDropdown.style.display = 'block';
  serverDropdown.classList.add('show');
  const icon = changeServerBtn?.querySelector('.dropdown-icon');
  if (icon) icon.classList.add('open');

  const firstServerItem = serverDropdown.querySelector('li');
  if (firstServerItem) firstServerItem.focus();
}

function closeServerDropdown() {
  const serverDropdown = byId('server-dropdown');
  const changeServerBtn = byId('change-server-btn');
  if (!serverDropdown) return;

  serverDropdown.style.display = 'none';
  serverDropdown.classList.remove('show');
  const icon = changeServerBtn?.querySelector('.dropdown-icon');
  if (icon) icon.classList.remove('open');
}

function changeServer(index) {
  if (index < 0 || index >= MOVIE_ENDPOINTS.length) return;

  currentServerIndex = index;
  const movieIframe = byId('movie-iframe');
  const changeServerBtn = byId('change-server-btn');
  const sandboxBtn = byId('sandbox-toggle');
  const selectedServer = MOVIE_ENDPOINTS[currentServerIndex];

  if (movieIframe) {
    movieIframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
  }
  if (sandboxBtn) {
    sandboxBtn.classList.remove('off');
    sandboxBtn.classList.add('on');
    sandboxBtn.textContent = "Sandbox: ON";
  }

  let url;
  if (selectedServer.url.includes('?id=') || selectedServer.url.includes('moviesapi.to/movie/')) {
    url = `${selectedServer.url}${movieId}`;
  } else {
    url = `${selectedServer.url}${movieId}?autoplay=true`;
  }

  if (movieIframe) movieIframe.src = url;

  if (changeServerBtn) {
    changeServerBtn.innerHTML = `${selectedServer.name} <span class="dropdown-icon">&#9660;</span>`;
  }

  closeServerDropdown();
  if (changeServerBtn) {
    changeServerBtn.focus();
  }
}

// ==============================
// DOWNLOAD OPTIONS
// ==============================
const downloadBtn = byId('download-btn');
const downloadPopup = byId('download-popup');
const closeDownloadBtn = byId('close-download-popup');
const primaryDownloadBtn = byId('primary-download-btn');
const alternativeDownloadBtn = byId('alternative-download-btn');

if (downloadBtn && downloadPopup && closeDownloadBtn && primaryDownloadBtn && alternativeDownloadBtn) {
    safeOn(downloadBtn, 'click', () => {
        if (!movieId) return;
        downloadPopup.style.display = 'flex';
        primaryDownloadBtn.focus();
    });

    safeOn(primaryDownloadBtn, 'click', () => {
        if (!movieId) return;
        window.open(`https://web.nxsha.app/dl/movie/${movieId}`, '_blank', 'noopener,noreferrer');
        downloadPopup.style.display = 'none';
        downloadBtn.focus();
    });

    safeOn(alternativeDownloadBtn, 'click', () => {
        if (!movieId) return;
        window.open(`https://vidvault.ru/movie/${movieId}`, '_blank', 'noopener,noreferrer');
        downloadPopup.style.display = 'none';
        downloadBtn.focus();
    });

    safeOn(closeDownloadBtn, 'click', () => {
        downloadPopup.style.display = 'none';
        downloadBtn.focus();
    });

    safeOn(downloadPopup, 'click', (e) => {
        if (e.target === downloadPopup) {
            downloadPopup.style.display = 'none';
            downloadBtn.focus();
        }
    });
}

// ==============================
// FULLSCREEN
// ==============================
function toggleFullscreen() {
  const iframe = document.getElementById('movie-iframe');
  const iframeContainer = document.getElementById('iframe-container');
  if (!iframeContainer || !iframe) return;

  const doc = document;
  const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
  const isTV = /smart-tv|smarttv|appletv|googletv|hbbtv|netcast|viera|roku|dtv|firetv|aftb|afta|bravia|tizen|web0s|tv bro|tvbrowser|tv safari/.test(navigator.userAgent.toLowerCase());

  if (isFullscreen) {
    if (doc.exitFullscreen) doc.exitFullscreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
    else if (doc.msExitFullscreen) doc.msExitFullscreen();

    iframeContainer.classList.remove('pseudo-fullscreen');
    if (!isTV && screen.orientation?.unlock) screen.orientation.unlock().catch(() => {});
  } else {
    const requestFs = iframe.requestFullscreen || iframe.webkitRequestFullscreen || iframe.mozRequestFullScreen || iframe.msRequestFullscreen;
    const containerRequestFs = iframeContainer.requestFullscreen || iframeContainer.webkitRequestFullscreen || iframeContainer.mozRequestFullScreen || iframeContainer.msRequestFullscreen;

    if (requestFs) {
      requestFs.call(iframe).catch(() => {
        if (containerRequestFs) containerRequestFs.call(iframeContainer);
      });
    } else if (containerRequestFs) {
      containerRequestFs.call(iframeContainer);
    } else {
      iframeContainer.classList.add('pseudo-fullscreen');
    }

    if (!isTV && screen.orientation?.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  }
}

// ==============================
// SANDBOX TOGGLE
// ==============================
const sandboxWarning = byId('sandbox-warning');
const proceedBtn = byId('proceed-btn');
const abortBtn = byId('abort-btn');

function disableSandbox() {
  const sandboxBtn = byId('sandbox-toggle');
  const iframe = byId('movie-iframe');
  if (!iframe) return;

  iframe.removeAttribute('sandbox');
  sandboxBtn.classList.remove('on');
  sandboxBtn.classList.add('off');
  sandboxBtn.textContent = "Sandbox: OFF";
  iframe.src = iframe.src;
  if (sandboxWarning) sandboxWarning.style.display = 'none';
  sandboxBtn.focus();
}

safeOn(byId('sandbox-toggle'), 'click', () => {
  const sandboxBtn = byId('sandbox-toggle');
  const iframe = byId('movie-iframe');
  if (!iframe) return;

  if (sandboxBtn.classList.contains('on')) {
    if (sandboxWarning) {
      sandboxWarning.style.display = 'flex';
      proceedBtn?.focus();
    }
  } else {
    iframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    sandboxBtn.classList.remove('off');
    sandboxBtn.classList.add('on');
    sandboxBtn.textContent = "Sandbox: ON";
    iframe.src = iframe.src;
  }
});

safeOn(proceedBtn, 'click', disableSandbox);
safeOn(abortBtn, 'click', () => {
  if (sandboxWarning) sandboxWarning.style.display = 'none';
  byId('sandbox-toggle')?.focus();
});

// ==============================
// GLOBAL OUTSIDE CLICK HANDLER
// ==============================
document.addEventListener('click', (e) => {
  const changeServerBtn = byId('change-server-btn');
  const serverDropdown = byId('server-dropdown');
  const serverControl = qs('.server-control');

  if (serverDropdown && (serverDropdown.style.display === 'block' || serverDropdown.classList.contains('show'))) {
    if (
      (!changeServerBtn || !changeServerBtn.contains(e.target)) &&
      (!serverControl || !serverControl.contains(e.target)) &&
      !serverDropdown.contains(e.target)
    ) {
      closeServerDropdown();
    }
  }
});

// ==============================
// ANDROID TV D-PAD SPATIAL NAVIGATION
// ==============================
(function initAndroidTVNavigation() {
  const TV_KEYS = {
    UP: [38, 'ArrowUp', 'Up'],
    DOWN: [40, 'ArrowDown', 'Down'],
    LEFT: [37, 'ArrowLeft', 'Left'],
    RIGHT: [39, 'ArrowRight', 'Right'],
    ENTER: [13, 'Enter', 'Select', 'Ok'],
    BACK: [27, 8, 10009, 'Escape', 'Backspace', 'Back', 'GoBack']
  };

  const BASE_FOCUSABLE_SELECTOR = `
    button:not([disabled]),
    [tabindex="0"]:not([disabled]),
    .server-dropdown li,
    .close-button,
    .download-source-btn,
    .close-download-popup,
    .close-trailer
  `;

  function getFocusableElements() {
    const trailerPopup = byId('trailer-popup');
    if (trailerPopup && trailerPopup.style.display === 'flex') {
      return Array.from(trailerPopup.querySelectorAll(BASE_FOCUSABLE_SELECTOR)).filter(isElementVisible);
    }

    const downloadPopup = byId('download-popup');
    if (downloadPopup && downloadPopup.style.display === 'flex') {
      return Array.from(downloadPopup.querySelectorAll(BASE_FOCUSABLE_SELECTOR)).filter(isElementVisible);
    }

    const sandboxWarning = byId('sandbox-warning');
    if (sandboxWarning && sandboxWarning.style.display === 'flex') {
      return Array.from(sandboxWarning.querySelectorAll(BASE_FOCUSABLE_SELECTOR)).filter(isElementVisible);
    }

    const serverDropdown = byId('server-dropdown');
    if (serverDropdown && (serverDropdown.style.display === 'block' || serverDropdown.classList.contains('show'))) {
      return Array.from(serverDropdown.querySelectorAll('li')).filter(isElementVisible);
    }

    return Array.from(document.querySelectorAll(BASE_FOCUSABLE_SELECTOR)).filter((el) => {
      if (el.closest('#trailer-popup') || el.closest('#download-popup') || el.closest('#sandbox-warning') || el.closest('#server-dropdown')) {
        return false;
      }
      return isElementVisible(el);
    });
  }

  function isElementVisible(el) {
    return el.offsetWidth > 0 && el.offsetHeight > 0 && window.getComputedStyle(el).visibility !== 'hidden';
  }

  function findNextElement(current, direction) {
    const focusables = getFocusableElements().filter(el => el !== current);
    if (focusables.length === 0) return null;

    const curRect = current.getBoundingClientRect();
    const curCenter = { x: curRect.left + curRect.width / 2, y: curRect.top + curRect.height / 2 };

    let bestElement = null;
    let minDistance = Infinity;

    focusables.forEach(candidate => {
      const candRect = candidate.getBoundingClientRect();
      const candCenter = { x: candRect.left + candRect.width / 2, y: candRect.top + candRect.height / 2 };

      const dx = candCenter.x - curCenter.x;
      const dy = candCenter.y - curCenter.y;

      let isValidDirection = false;
      if (direction === 'RIGHT' && dx > 10) isValidDirection = true;
      if (direction === 'LEFT' && dx < -10) isValidDirection = true;
      if (direction === 'DOWN' && dy > 10) isValidDirection = true;
      if (direction === 'UP' && dy < -10) isValidDirection = true;

      if (isValidDirection) {
        const primary = direction === 'UP' || direction === 'DOWN' ? Math.abs(dy) : Math.abs(dx);
        const secondary = direction === 'UP' || direction === 'DOWN' ? Math.abs(dx) : Math.abs(dy);
        const distance = primary * 1.0 + secondary * 2.5;

        if (distance < minDistance) {
          minDistance = distance;
          bestElement = candidate;
        }
      }
    });

    return bestElement || focusables[0];
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key || e.keyCode;
    let direction = null;

    if (TV_KEYS.UP.includes(key)) direction = 'UP';
    else if (TV_KEYS.DOWN.includes(key)) direction = 'DOWN';
    else if (TV_KEYS.LEFT.includes(key)) direction = 'LEFT';
    else if (TV_KEYS.RIGHT.includes(key)) direction = 'RIGHT';

    // 1. Back button handling
    if (TV_KEYS.BACK.includes(key)) {
      const trailerPopup = byId('trailer-popup');
      const downloadPopup = byId('download-popup');
      const sandboxWarning = byId('sandbox-warning');
      const serverDropdown = byId('server-dropdown');

      if (trailerPopup && trailerPopup.style.display === 'flex') {
        closeTrailerModal();
        e.preventDefault();
        return;
      }
      if (downloadPopup && downloadPopup.style.display === 'flex') {
        byId('close-download-popup')?.click();
        e.preventDefault();
        return;
      }
      if (sandboxWarning && sandboxWarning.style.display === 'flex') {
        byId('abort-btn')?.click();
        e.preventDefault();
        return;
      }
      if (serverDropdown && (serverDropdown.style.display === 'block' || serverDropdown.classList.contains('show'))) {
        closeServerDropdown();
        byId('change-server-btn')?.focus();
        e.preventDefault();
        return;
      }

      window.location.href = 'movies.html';
      e.preventDefault();
      return;
    }

    // 2. D-Pad Direction Navigation
    if (direction) {
      const trailerPopup = byId('trailer-popup');
      if (trailerPopup && trailerPopup.style.display === 'flex') {
        byId('close-trailer')?.focus();
        e.preventDefault();
        return;
      }

      const activeEl = document.activeElement;
      const validElements = getFocusableElements();
      const isFocusedValid = activeEl && activeEl !== document.body && validElements.includes(activeEl);

      if (!isFocusedValid) {
        if (validElements.length > 0) {
          validElements[0].focus();
        }
        e.preventDefault();
        return;
      }

      const nextEl = findNextElement(activeEl, direction);
      if (nextEl) {
        nextEl.focus();
        nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        e.preventDefault();
      }
    }

    // 3. OK / Enter trigger
    if (TV_KEYS.ENTER.includes(key)) {
      const trailerPopup = byId('trailer-popup');
      if (trailerPopup && trailerPopup.style.display === 'flex') {
        closeTrailerModal();
        e.preventDefault();
        return;
      }

      const active = document.activeElement;
      if (active && active !== document.body && !active.matches('.server-dropdown li')) {
        active.click();
      }
    }
  });
})();

// ==============================
// INITIALIZATION
// ==============================
safeOn(document, 'DOMContentLoaded', () => {
  safeOn(byId('close-button'), 'click', () => (window.location.href = 'movies.html'));
  
  safeOn(window, 'load', () => {
    setTimeout(() => {
      const loader = byId('loading-screen');
      if (loader) loader.style.display = 'none';
      byId('change-server-btn')?.focus();
    }, 1000);
  });

  fetchMovieDetails();
});
