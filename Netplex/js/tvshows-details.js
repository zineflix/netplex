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
const imgUrl = (path, size = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
const byId = (id) => document.getElementById(id);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
const safeOn = (el, ev, fn) => el && el.addEventListener(ev, fn);

// Navigate to previous page or fall back to default
function goBackOrHome() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'tv-show.html';
  }
}

// ==============================
// STREAMING SERVERS (DETAILS)
// ==============================
const TV_ENDPOINTS = [
  { url: 'https://cinesrc.st/embed/tv/', name: 'Server 1' },
  { url: 'https://web.nxsha.app/embed/tv/', name: 'Server 2' },
  { url: 'https://anicine.xyz/embed?url=https://embed.asfnsa-alig.workers.dev/tv/', name: 'Server 3' },
  { url: 'https://1embed.cc/embed/tv/', name: 'Server 4' },
  { url: 'https://yapgrid.com/embed/tv/', name: 'Server 5' },
  { url: 'https://cinevaro.app/media/tmdb-tv-', name: 'Server 6' },
  { url: 'https://anyembed.xyz/embed/tmdb-tv-', name: 'Server 7' },
  { url: 'https://hexa.su/watch/tv/', name: 'Server 8' },
  { url: 'https://vidzen.fun/tv/', name: 'Server 9' },
  { url: 'https://www.rivestream.ru/watch?type=tv&id=', name: 'Server 10' },
  { url: 'https://vidlux.xyz/embed/tv/', name: 'Server 11' },
  { url: 'https://vidup.to/tv/', name: 'Server 12 Ads' },
  { url: 'https://vsembed.ru/embed/tv/', name: 'Server 13 Ads' },
  { url: 'https://api.cineby.homes/embed/tv/', name: 'Server 14 Ads' },
  { url: 'https://vidbolt.pro/tv/', name: 'Server 15 Ads' },
  { url: 'https://player.videasy.to/tv/', name: 'Server 16 Ads' },
  { url: 'https://vidcore.io/tv/', name: 'Server 17 Ads' },
  { url: 'https://vaplayer.ru/embed/tv/', name: 'Server 18 Ads' },
  { url: 'https://vidsrc.hair/embed/tv/', name: 'Server 19 Ads' },
  { url: 'https://player.zxcstream.xyz/player/tv/', name: 'Server 20 Ads' },
  { url: 'https://111movies.net/tv/', name: 'Server 21 Ads' },
  { url: 'https://moviesapi.to/tv/', name: 'Server 22 Ads' },
  { url: 'https://vidrock.net/tv/', name: 'Server 23 Ads' },
  { url: 'https://embedmaster.link/tv/', name: 'Server 24 Ads' },
  { url: 'https://mapple.rip/watch/tv/', name: 'Server 25 Ads' }
];

let currentTVServerIndex = 0;
let currentSeason = 1;
let currentEpisode = 1;
let totalSeasons = 1;

// Helper to close custom dropdown menus
function closeAllDropdowns(exceptId = null) {
  const dropdownIds = ['season-dropdown', 'episode-dropdown', 'server-dropdown'];
  dropdownIds.forEach(id => {
    if (id !== exceptId) {
      const el = byId(id);
      if (el) {
        el.style.display = 'none';
        el.classList.remove('show');
      }
      const parentBtn = el?.previousElementSibling;
      const icon = parentBtn?.querySelector('.dropdown-icon');
      if (icon) icon.classList.remove('open');
    }
  });
}

function openSpecificDropdown(dropdownId, btnId) {
  closeAllDropdowns(dropdownId);
  const dropdown = byId(dropdownId);
  const btn = byId(btnId);
  if (!dropdown) return;

  dropdown.style.display = 'block';
  dropdown.classList.add('show');
  const icon = btn?.querySelector('.dropdown-icon');
  if (icon) icon.classList.add('open');

  const firstItem = dropdown.querySelector('li');
  if (firstItem) firstItem.focus();
}

function closeTrailerModal() {
  const trailerPopup = byId('trailer-popup');
  const trailerIframe = byId('tv-iframe-trailer');
  const trailerBtn = byId('watch-trailer-btn');

  if (trailerPopup) trailerPopup.style.display = 'none';
  if (trailerIframe) trailerIframe.src = '';
  if (trailerBtn) trailerBtn.focus();
}

// ==============================
// TV SERVER URL BUILDER
// ==============================
function buildTVServerURL(serverIndex, id, season, episode) {
  const server = TV_ENDPOINTS[serverIndex];
  if (!server) return '';

  if (serverIndex === 0 || serverIndex === 6 || serverIndex === 24) {
    return `${server.url}${id}-${season}-${episode}`;
  }
  if (serverIndex === 9) {
    return `${server.url}${id}&season=${season}&episode=${episode}`;
  }
  if (serverIndex === 21) {
    return `${server.url}${id}-${season}-${episode}`;
  }
  return `${server.url}${id}/${season}/${episode}`;
}

// ==============================
// DETAILS PAGE (TV SHOW)
// ==============================
async function fetchTVDetails() {
  const params = new URLSearchParams(window.location.search);
  const tvId = params.get('tv_id') || params.get('id');
  if (!tvId) return;

  try {
    const show = await getJSON(`${baseUrl}/tv/${tvId}?api_key=${apiKey}&language=en-US`);

    const poster = byId('tv-poster');
    if (poster) poster.src = imgUrl(show.poster_path);

    const bgEl = qs('.blurred-background');
    if (bgEl) {
      bgEl.style.backgroundImage = 'none';
      bgEl.style.backgroundColor = 'black';
    }

    const desc = byId('tv-description');
    if (desc) desc.textContent = show.overview || 'No description available.';

    const titleEl = byId('tv-title');
    if (titleEl) titleEl.textContent = show.name || 'Untitled';

    // Cast (Excluded from TV remote tab stops)
    const { cast = [] } = await getJSON(`${baseUrl}/tv/${tvId}/credits?api_key=${apiKey}&language=en-US`);
    const castContainer = byId('tv-cast');
    if (castContainer) {
      castContainer.innerHTML = '';
      cast.slice(0, 6).forEach(actor => {
        const member = document.createElement('div');
        member.className = 'cast-member';
        member.innerHTML = `
          <img src="${actor.profile_path ? imgUrl(actor.profile_path, 'w185') : 'https://via.placeholder.com/100x150?text=No+Image'}" alt="${actor.name}">
          <p style="color:white">${actor.name}</p>
        `;
        castContainer.appendChild(member);
      });
    }

    // Trailer (AutoPlay enabled with origin & parameters)
    const videos = await getJSON(`${baseUrl}/tv/${tvId}/videos?api_key=${apiKey}&language=en-US`);
    const trailer = (videos.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const trailerIframe = byId('tv-iframe-trailer');
    const trailerPopup = byId('trailer-popup');
    const closeTrailerBtn = byId('close-trailer');
    const trailerBtn = byId('watch-trailer-btn');

    if (trailer && trailerBtn && trailerPopup && trailerIframe && closeTrailerBtn) {
      safeOn(trailerBtn, 'click', () => {
        trailerPopup.style.display = 'flex';
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

    // Download Modal
    setupDownloadModal(tvId);

    // Rating
    const starWrap = byId('tv-rating');
    if (starWrap) {
      starWrap.innerHTML = '';
      const filled = Math.round((show.vote_average || 0) / 2);
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
    const genreWrap = byId('tv-genres');
    if (genreWrap) {
      genreWrap.innerHTML = '';
      (show.genres || []).forEach(g => {
        const sp = document.createElement('span');
        sp.className = 'genre';
        sp.textContent = g.name;
        genreWrap.appendChild(sp);
      });
    }

    // Season and Episode Logic
    totalSeasons = show.number_of_seasons || 1;
    populateSeasons(tvId);
    await populateEpisodes(tvId, currentSeason);

    // Dropdown Toggles
    setupDropdownControls(tvId);

    // Initial Iframe Embed
    const iframeContainer = byId('iframe-container');
    const tvIframe = byId('tv-iframe');
    const watchNowBtn = byId('watch-now-btn');

    if (iframeContainer && tvIframe) {
      iframeContainer.style.display = 'flex';
      currentTVServerIndex = 0;
      changeTVEpisode(tvId, currentSeason, currentEpisode);
      if (watchNowBtn) watchNowBtn.style.display = 'none';
    }

    buildServerList(tvId);

    // Close Iframe (Home Refresh)
    const closeIframeBtn = byId('close-iframe-btn');
    safeOn(closeIframeBtn, 'click', () => {
      if (!iframeContainer || !tvIframe || !watchNowBtn) return;
      iframeContainer.style.display = 'none';
      tvIframe.src = '';
      watchNowBtn.style.display = 'block';
      window.location.reload();
    });

  } catch (err) {
    console.error('Error fetching TV show details:', err);
  }
}

function setupDownloadModal(tvId) {
  const downloadBtn = byId('download-btn');
  const downloadPopup = byId('download-popup');
  const closeDownloadBtn = byId('close-download-popup');
  const primaryDownloadBtn = byId('primary-download-btn');
  const alternativeDownloadBtn = byId('alternative-download-btn');

  if (downloadBtn && downloadPopup && closeDownloadBtn && primaryDownloadBtn && alternativeDownloadBtn) {
    safeOn(downloadBtn, 'click', () => {
      if (!tvId) return;
      downloadPopup.style.display = 'flex';
      primaryDownloadBtn.focus();
    });

    safeOn(primaryDownloadBtn, 'click', () => {
      if (!tvId) return;
      window.open(`https://web.nxsha.app/dl/tv/${tvId}/${currentSeason}/${currentEpisode}`, '_blank', 'noopener,noreferrer');
      downloadPopup.style.display = 'none';
      downloadBtn.focus();
    });

    safeOn(alternativeDownloadBtn, 'click', () => {
      if (!tvId) return;
      window.open(`https://vidvault.ru/tv/${tvId}/${currentSeason}/${currentEpisode}`, '_blank', 'noopener,noreferrer');
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
}

function populateSeasons(tvId) {
  const seasonsList = byId('season-list');
  const currentSeasonEl = byId('current-season');
  const currentEpisodeEl = byId('current-episode');
  const seasonBtn = byId('season-dropdown-btn');

  if (!seasonsList) return;
  seasonsList.innerHTML = '';

  for (let i = 1; i <= totalSeasons; i++) {
    const li = document.createElement('li');
    li.textContent = `Season ${i}`;
    li.setAttribute('tabindex', '0');

    const selectSeason = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      currentSeason = i;
      currentEpisode = 1;

      if (currentSeasonEl) currentSeasonEl.textContent = i;
      if (currentEpisodeEl) currentEpisodeEl.textContent = 1;

      populateEpisodes(tvId, i);
      changeTVEpisode(tvId, currentSeason, currentEpisode);

      closeAllDropdowns();
      if (seasonBtn) seasonBtn.focus();
    };

    li.addEventListener('click', selectSeason);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13 || e.key === 'Select') {
        selectSeason(e);
      }
    });

    seasonsList.appendChild(li);
  }
}

async function populateEpisodes(tvId, seasonNumber) {
  const episodesList = byId('episode-list');
  const currentEpisodeEl = byId('current-episode');
  const episodeBtn = byId('episode-dropdown-btn');

  if (!episodesList) return;

  try {
    const seasonData = await getJSON(`${baseUrl}/tv/${tvId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`);
    episodesList.innerHTML = '';

    (seasonData.episodes || []).forEach(episode => {
      const li = document.createElement('li');
      li.textContent = `Episode ${episode.episode_number}`;
      li.setAttribute('tabindex', '0');

      const selectEpisode = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        currentEpisode = episode.episode_number;

        if (currentEpisodeEl) currentEpisodeEl.textContent = currentEpisode;

        changeTVEpisode(tvId, currentSeason, currentEpisode);

        closeAllDropdowns();
        if (episodeBtn) episodeBtn.focus();
      };

      li.addEventListener('click', selectEpisode);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13 || e.key === 'Select') {
          selectEpisode(e);
        }
      });

      episodesList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching episodes:', err);
  }
}

function setupDropdownControls(tvId) {
  safeOn(byId('season-dropdown-btn'), 'click', (e) => {
    e.stopPropagation();
    const dropdown = byId('season-dropdown');
    const isCurrentlyDisplayed = dropdown?.classList.contains('show') || dropdown?.style.display === 'block';
    if (isCurrentlyDisplayed) {
      closeAllDropdowns();
    } else {
      openSpecificDropdown('season-dropdown', 'season-dropdown-btn');
    }
  });

  safeOn(byId('episode-dropdown-btn'), 'click', (e) => {
    e.stopPropagation();
    const dropdown = byId('episode-dropdown');
    const isCurrentlyDisplayed = dropdown?.classList.contains('show') || dropdown?.style.display === 'block';
    if (isCurrentlyDisplayed) {
      closeAllDropdowns();
    } else {
      openSpecificDropdown('episode-dropdown', 'episode-dropdown-btn');
    }
  });
}

function buildServerList(tvId) {
  const changeServerBtn = byId('change-server-btn');
  const serverDropdown = byId('server-dropdown');
  const serverList = byId('server-list');

  if (serverList) {
    serverList.innerHTML = '';
    TV_ENDPOINTS.forEach((endpoint, idx) => {
      const li = document.createElement('li');
      li.textContent = endpoint.name;
      li.setAttribute('tabindex', '0');

      const selectServer = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        changeTVServer(idx, tvId);
      };

      li.addEventListener('click', selectServer);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13 || e.key === 'Select') {
          selectServer(e);
        }
      });

      serverList.appendChild(li);
    });
  }

  safeOn(changeServerBtn, 'click', (e) => {
    e.stopPropagation();
    const isCurrentlyDisplayed = serverDropdown?.classList.contains('show') || serverDropdown?.style.display === 'block';
    if (isCurrentlyDisplayed) {
      closeAllDropdowns();
    } else {
      openSpecificDropdown('server-dropdown', 'change-server-btn');
    }
  });
}

function changeTVServer(index, id) {
  if (index < 0 || index >= TV_ENDPOINTS.length) return;

  currentTVServerIndex = index;
  const tvIframe = byId('tv-iframe');
  const changeServerBtn = byId('change-server-btn');
  const sandboxBtn = byId('sandbox-toggle');
  const selectedServer = TV_ENDPOINTS[currentTVServerIndex];

  if (tvIframe) {
    tvIframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    if (sandboxBtn) {
      sandboxBtn.classList.remove('off');
      sandboxBtn.classList.add('on');
      sandboxBtn.textContent = 'Sandbox: ON';
    }
  }

  const url = buildTVServerURL(currentTVServerIndex, id, currentSeason, currentEpisode);
  if (tvIframe) tvIframe.src = url;

  if (changeServerBtn) {
    changeServerBtn.innerHTML = `${selectedServer.name} <span class="dropdown-icon">&#9660;</span>`;
  }

  closeAllDropdowns();
  if (changeServerBtn) changeServerBtn.focus();
}

function changeTVEpisode(id, season, episode) {
  const tvIframe = byId('tv-iframe');
  const sandboxBtn = byId('sandbox-toggle');
  const selectedServer = TV_ENDPOINTS[currentTVServerIndex];

  if (!selectedServer) return;

  if (tvIframe) {
    tvIframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    if (sandboxBtn) {
      sandboxBtn.classList.remove('off');
      sandboxBtn.classList.add('on');
      sandboxBtn.textContent = 'Sandbox: ON';
    }
  }

  const url = buildTVServerURL(currentTVServerIndex, id, season, episode);
  if (tvIframe) tvIframe.src = url;
}

// Global outside click handler
document.addEventListener('click', (e) => {
  const isDropdownClick = e.target.closest(
    '#season-dropdown-btn, #episode-dropdown-btn, #change-server-btn, #season-dropdown, #episode-dropdown, #server-dropdown'
  );
  if (!isDropdownClick) {
    closeAllDropdowns();
  }
});

// ==============================
// FULLSCREEN FOR IFRAME
// ==============================
function toggleFullscreen() {
  const iframe = document.getElementById('tv-iframe');
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
  const iframe = byId('tv-iframe');
  if (!iframe) return;

  iframe.removeAttribute('sandbox');
  if (sandboxBtn) {
    sandboxBtn.classList.remove('off');
    sandboxBtn.classList.add('off');
    sandboxBtn.textContent = 'Sandbox: OFF';
  }

  if (iframe.src && iframe.src.trim() !== '') {
    const currentSrc = iframe.src;
    iframe.src = '';
    setTimeout(() => {
      iframe.src = currentSrc;
    }, 50);
  }

  if (sandboxWarning) sandboxWarning.style.display = 'none';
  sandboxBtn?.focus();
}

safeOn(byId('sandbox-toggle'), 'click', () => {
  const sandboxBtn = byId('sandbox-toggle');
  const iframe = byId('tv-iframe');
  if (!iframe || !sandboxBtn) return;

  if (sandboxBtn.classList.contains('on')) {
    if (sandboxWarning) {
      sandboxWarning.style.display = 'flex';
      proceedBtn?.focus();
    }
  } else {
    iframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    sandboxBtn.classList.remove('off');
    sandboxBtn.classList.add('on');
    sandboxBtn.textContent = 'Sandbox: ON';

    if (iframe.src && iframe.src.trim() !== '') {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 50);
    }
  }
});

safeOn(proceedBtn, 'click', disableSandbox);
safeOn(abortBtn, 'click', () => {
  if (sandboxWarning) sandboxWarning.style.display = 'none';
  byId('sandbox-toggle')?.focus();
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

    const openDropdown = document.querySelector('.server-dropdown.show, .server-dropdown[style*="display: block"]');
    if (openDropdown) {
      return Array.from(openDropdown.querySelectorAll('li')).filter(isElementVisible);
    }

    return Array.from(document.querySelectorAll(BASE_FOCUSABLE_SELECTOR)).filter((el) => {
      if (el.closest('#trailer-popup') || el.closest('#download-popup') || el.closest('#sandbox-warning') || el.closest('.server-dropdown')) {
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
      const openDropdown = document.querySelector('.server-dropdown.show, .server-dropdown[style*="display: block"]');

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
      if (openDropdown) {
        closeAllDropdowns();
        byId('season-dropdown-btn')?.focus();
        e.preventDefault();
        return;
      }

      goBackOrHome();
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
  safeOn(byId('close-button'), 'click', goBackOrHome);
  
  safeOn(window, 'load', () => {
    setTimeout(() => {
      const loader = byId('loading-screen');
      if (loader) loader.style.display = 'none';
      byId('season-dropdown-btn')?.focus();
    }, 1000);
  });

  fetchTVDetails();
});
