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
const CATEGORY_ENDPOINTS_TV = {
  popular: `/tv/popular`,
  trending: `/trending/tv/week`,
  top_rated: `/tv/top_rated`,
  action_adventure: `/discover/tv?with_genres=10759`,
  comedy: `/discover/tv?with_genres=35`,
  mystery: `/discover/tv?with_genres=9648`,
  scifi_fantasy: `/discover/tv?with_genres=10765`,
  animation: `/discover/tv?with_genres=16`,
};

async function fetchTVShows(category, rowId) {
  const endpoint = CATEGORY_ENDPOINTS_TV[category];
  if (!endpoint) return console.warn(`Unknown TV category: ${category}`);
  const container = byId(rowId);
  if (!container) return;

  try {
    const data = await getJSON(`${baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US&page=1`);
    container.innerHTML = '';

    (data.results || []).forEach((show) => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.style.position = 'relative';
      card.innerHTML = `
        <img class="row__poster" src="${imgUrl(show.poster_path)}" alt="${show.name}">
        <div class="movie-rating"><i class="fas fa-star"></i> ${Number(show.vote_average || 0).toFixed(1)}</div>
        <div class="play-button"><i class="fas fa-play"></i></div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `tv-details.html?tv_id=${show.id}`;
      });
      container.appendChild(card);
    });
  } catch (err) {
    console.error(`Error fetching ${category} TV shows:`, err);
  }
}

// ==============================
// BANNER (HOME)
// ==============================
async function fetchTVBanner() {
  const banner = qs('.banner');
  if (!banner) return;
  try {
    const { results = [] } = await getJSON(`${baseUrl}/tv/popular?api_key=${apiKey}&language=en-US&page=1`);
    if (!results.length) return;

    const show = results[Math.floor(Math.random() * results.length)];
    banner.style.backgroundImage = `url(${imgUrl(show.backdrop_path, 'original')})`;
    const titleEl = qs('.banner__title');
    const descEl = qs('.banner__description');
    if (titleEl) titleEl.textContent = show.name || 'Untitled';
    if (descEl) {
      const text = show.overview || '';
      descEl.textContent = text.length > 150 ? text.slice(0, 150) + '...' : text;
    }

    const bannerPlay = banner.querySelector('.play-button') || byId('banner-play-btn');
    safeOn(bannerPlay, 'click', () => {
      window.location.href = `tv-details.html?tv_id=${show.id}`;
    });
  } catch (err) {
    console.error('Error fetching TV banner:', err);
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
function renderSavedTVList() {
  const container = byId('tv-list-container');
  if (!container) return;
  const tvList = JSON.parse(localStorage.getItem('tvList') || '[]');

  if (!tvList.length) {
    container.innerHTML = '<p>Your TV show list is empty!</p>';
    return;
  }

  container.innerHTML = '';
  tvList.forEach((show) => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img class="row__poster" src="${imgUrl(show.poster_path)}" alt="${show.name}">
      <p>${show.name}</p>
    `;
    card.addEventListener('click', () => {
      window.location.href = `tv-details.html?tv_id=${show.id}`;
    });
    container.appendChild(card);
  });
}

// ==============================
// STREAMING SERVERS (DETAILS)
// ==============================
const TV_ENDPOINTS = [
  { url: 'https://vidsrc.cc/v2/embed/tv/', name: 'Server 1' },  
  { url: 'https://vidjoy.pro/embed/tv/', name: 'Server 2' },
  { url: 'https://vidsrc.cc/v3/embed/tv/', name: 'Server 3' },
  { url: 'https://embed.rgshows.me/api/1/tv/?id=', name: 'Server 4' },
  { url: 'https://vidsrc.wtf/api/1/tv/?id=', name: 'Server 5' },  
  { url: 'https://embed.rgshows.me/api/3/tv/?id=', name: 'Server 6' },
  { url: 'https://hexa.watch/watch/tv/', name: 'Server 7' },
  { url: 'https://apimocine.vercel.app/tv/', name: 'Server 8' },
  { url: 'https://vidsrc.wtf/api/3/tv/?id=', name: 'Server 9' },
  { url: 'https://rivestream.org/embed?type=tv&id=', name: 'Server 10' },
  { url: 'https://player.vidplus.to/embed/tv/', name: 'Server 11' },
  { url: 'https://player.videasy.net/tv/', name: 'Server 12' },
  { url: 'https://flixer.sh/watch/tv/', name: 'Server 13' },
  { url: 'https://vidrock.net/tv/', name: 'Server 14 Ads' },  
  { url: 'https://vidfast.pro/tv/', name: 'Server 15 Ads' },
  { url: 'https://vidsrc.su/embed/tv/', name: 'Server 16 Ads' },
  { url: 'https://111movies.com/tv/', name: 'Server 17 Ads' },
  { url: 'https://vidlink.pro/tv/', name: 'Server 18 Ads' },
  { url: 'https://vidsrc.net/embed/tv/', name: 'Server 19 Ads' },
  { url: 'https://player.embed-api.stream/?id=', name: 'Server 20 Ads' },
  { url: 'https://moviesapi.to/tv/', name: 'Server 21 Ads' },  
];

let currentTVServerIndex = 0;
let currentSeason = 1;
let currentEpisode = 1;
let totalSeasons = 1;

// ==============================
// DETAILS PAGE (TV SHOW)
// ==============================
async function fetchTVDetails() {
    const params = new URLSearchParams(window.location.search);
    const tvId = params.get('id');
    if (!tvId) return;

  try {
    // Details
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

    // Cast
    const { cast = [] } = await getJSON(`${baseUrl}/tv/${tvId}/credits?api_key=${apiKey}&language=en-US`);
    const castContainer = byId('tv-cast');
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
    const videos = await getJSON(`${baseUrl}/tv/${tvId}/videos?api_key=${apiKey}&language=en-US`);
    const trailer = (videos.results || []).find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    const trailerIframe = byId('tv-iframe-trailer');
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
        trailerIframe.src = '';
      });
    }

    const downloadBtn = byId('download-btn');
    safeOn(downloadBtn, 'click', () => {
      if (tvId && currentSeason && currentEpisode) {
        const downloadUrl = `https://dl.vidsrc.vip/tv/${tvId}/${currentSeason}/${currentEpisode}`;
        window.open(downloadUrl, '_blank');
      }
    });

    // Rating (5 stars)
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
      (show.genres || []).forEach((g) => {
        const sp = document.createElement('span');
        sp.className = 'genre';
        sp.textContent = g.name;
        genreWrap.appendChild(sp);
      });
    }
    
    // Season and Episode Logic
    totalSeasons = show.number_of_seasons;
    const seasonsList = byId('season-list');
    const episodesList = byId('episode-list');
    const currentSeasonEl = byId('current-season');
    const currentEpisodeEl = byId('current-episode');

    function populateSeasons() {
        if (!seasonsList) return;
        seasonsList.innerHTML = '';
        for (let i = 1; i <= totalSeasons; i++) {
            const li = document.createElement('li');
            li.textContent = `Season ${i}`;
            li.addEventListener('click', () => {
                currentSeason = i;
                currentEpisode = 1;
                currentSeasonEl.textContent = i;
                currentEpisodeEl.textContent = 1;
                populateEpisodes(i);
                changeTVEpisode(tvId, currentSeason, currentEpisode);
                byId('season-dropdown').style.display = 'none';
            });
            seasonsList.appendChild(li);
        }
    }
    
    async function populateEpisodes(seasonNumber) {
        if (!episodesList) return;
        try {
            const seasonData = await getJSON(`${baseUrl}/tv/${tvId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`);
            episodesList.innerHTML = '';
            (seasonData.episodes || []).forEach((episode) => {
                const li = document.createElement('li');
                li.textContent = `Episode ${episode.episode_number}`;
                li.addEventListener('click', () => {
                    currentEpisode = episode.episode_number;
                    currentEpisodeEl.textContent = currentEpisode;
                    changeTVEpisode(tvId, currentSeason, currentEpisode);
                    byId('episode-dropdown').style.display = 'none';
                });
                episodesList.appendChild(li);
            });
        } catch (err) {
            console.error('Error fetching episodes:', err);
        }
    }
    
    populateSeasons();
    populateEpisodes(currentSeason);
    
    safeOn(byId('season-dropdown-btn'), 'click', () => {
        const dropdown = byId('season-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    safeOn(byId('episode-dropdown-btn'), 'click', () => {
        const dropdown = byId('episode-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Iframe + Auto-load Server 1
    const iframeContainer = byId('iframe-container');
    const tvIframe = byId('tv-iframe');
    const watchNowBtn = byId('watch-now-btn');

    if (iframeContainer && tvIframe) {
      iframeContainer.style.display = 'flex';
      changeTVEpisode(tvId, currentSeason, currentEpisode);
      if (watchNowBtn) watchNowBtn.style.display = 'none';
    }

    // Servers dropdown
    const changeServerBtn = byId('change-server-btn');
    const serverDropdown = byId('server-dropdown');
    const serverList = byId('server-list');

    if (serverList) {
      serverList.innerHTML = '';
      TV_ENDPOINTS.forEach((endpoint, idx) => {
        const li = document.createElement('li');
        li.textContent = endpoint.name;
        li.addEventListener('click', () => changeTVServer(idx, tvId));
        serverList.appendChild(li);
      });
    }

    safeOn(changeServerBtn, 'click', () => {
      if (!serverDropdown) return;
      serverDropdown.style.display = serverDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close iframe
    const closeIframeBtn = byId('close-iframe-btn');
    safeOn(closeIframeBtn, 'click', () => {
      if (!iframeContainer || !tvIframe || !watchNowBtn) return;
      iframeContainer.style.display = 'none';
      tvIframe.src = '';
      watchNowBtn.style.display = 'block';
      window.location.reload();
    });

    // More Like This
    fetchMoreLikeThisTV(tvId);
  } catch (err) {
    console.error('Error fetching TV show details:', err);
  }
}

// UPDATED TO HANDLE DIFFERENT URL FORMATS
function changeTVServer(index, id) {
  if (index < 0 || index >= TV_ENDPOINTS.length) {
    console.error("Invalid server index.");
    return;
  }

  currentTVServerIndex = index;
  const tvIframe = byId('tv-iframe');
  const serverDropdown = byId('server-dropdown');
  const changeServerBtn = byId('change-server-btn');
  const dropdownIcon = changeServerBtn.querySelector('.dropdown-icon');
  const sandboxBtn = byId('sandbox-toggle');
  const selectedServer = TV_ENDPOINTS[currentTVServerIndex];

  if (tvIframe) {
    tvIframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    if (sandboxBtn) {
      sandboxBtn.classList.remove('off');
      sandboxBtn.classList.add('on');
      sandboxBtn.textContent = "Sandbox: ON";
    }
  }

  let url;
  if (selectedServer.url.includes('?id=')) {
    // Query string format
    url = `${selectedServer.url}${id}&s=${currentSeason}&e=${currentEpisode}`;
  } else if (selectedServer.url.includes('moviesapi.to/tv/')) {
    // Special case for Server 18 (dash format)
    url = `${selectedServer.url}${id}-${currentSeason}-${currentEpisode}`;
  } else {
    // Standard path format
    url = `${selectedServer.url}${id}/${currentSeason}/${currentEpisode}`;
  }

  if (tvIframe) tvIframe.src = url;

  if (changeServerBtn) {
    changeServerBtn.textContent = '';
    changeServerBtn.appendChild(document.createTextNode(selectedServer.name));
    changeServerBtn.appendChild(dropdownIcon);
  }
  if (serverDropdown) serverDropdown.style.display = 'none';

  console.log(`Changed to TV server: ${selectedServer.name}, URL: ${url}`);
}

function changeTVEpisode(id, season, episode) {
  const tvIframe = byId('tv-iframe');
  const sandboxBtn = byId('sandbox-toggle');
  const selectedServer = TV_ENDPOINTS[currentTVServerIndex];

  if (tvIframe) {
    tvIframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
    if (sandboxBtn) {
      sandboxBtn.classList.remove('off');
      sandboxBtn.classList.add('on');
      sandboxBtn.textContent = "Sandbox: ON";
    }
  }

  let url;
  if (selectedServer.url.includes('?id=')) {
    url = `${selectedServer.url}${id}&s=${season}&e=${episode}`;
  } else if (selectedServer.url.includes('moviesapi.to/tv/')) {
    url = `${selectedServer.url}${id}-${season}-${episode}`;
  } else {
    url = `${selectedServer.url}${id}/${season}/${episode}`;
  }

  if (tvIframe) tvIframe.src = url;

  console.log(`Changed to Season ${season}, Episode ${episode} on ${selectedServer.name}, URL: ${url}`);
}

async function fetchMoreLikeThisTV(id) {
  const container = byId('similar-tv-container');
  if (!container) return;
  try {
    const data = await getJSON(`${baseUrl}/tv/${id}/similar?api_key=${apiKey}&language=en-US`);
    container.innerHTML = '';
    (data.results || []).forEach((s) => {
      const item = document.createElement('div');
      item.className = 'similar-movie';
      item.innerHTML = `
        <img class="similar-movie-img" src="${imgUrl(s.poster_path, 'original')}" alt="${s.name}">
        <span class="movie-title" style="display:none">${s.name}</span>
      `;
      item.addEventListener('click', () => {
        window.location.href = `tv-details.html?tv_id=${s.id}`;
      });
      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error fetching similar TV shows:', err);
  }
}

// ==============================
// GLOBAL UI / MISC
// ==============================
safeOn(document, 'DOMContentLoaded', () => {
  // Home rows (only render where containers exist)
  const rowMap = [
    ['popular', 'popularTVShows'],
    ['trending', 'trendingTVShows'],
    ['top_rated', 'topRatedTV'],
    ['action_adventure', 'actionAdventureTV'],
    ['comedy', 'comedyTV'],
    ['mystery', 'mysteryTV'],
    ['scifi_fantasy', 'sciFiFantasyTV'],
    ['animation', 'animationTV'],
  ];
  rowMap.forEach(([cat, id]) => fetchTVShows(cat, id));

  // Banner (home)
  fetchTVBanner();

  // Saved list page
  renderSavedTVList();

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
  fetchTVDetails();
});

// Floating message close
function closeMessage() {
  const el = byId('floating-message');
  if (el) el.style.display = 'none';
}

// Fullscreen for iframe
function toggleFullscreen() {
  const iframeContainer = document.getElementById('iframe-container');

  if (!iframeContainer) {
    console.error('Iframe container not found.');
    return;
  }

  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (iframeContainer.requestFullscreen) {
      iframeContainer.requestFullscreen();
    } else if (iframeContainer.mozRequestFullScreen) {
      iframeContainer.mozRequestFullScreen();
    } else if (iframeContainer.webkitRequestFullscreen) {
      iframeContainer.webkitRequestFullscreen();
    } else if (iframeContainer.msRequestFullscreen) {
      iframeContainer.msRequestFullscreen();
    }
  }
  if (screen.orientation?.lock) {
    screen.orientation.lock('landscape').catch((e) => console.log('Orientation lock failed:', e));
  }
}

// ==============================
// Sandbox Toggle
// ==============================
const sandboxWarning = byId('sandbox-warning');
const proceedBtn = byId('proceed-btn');
const abortBtn = byId('abort-btn');

// Function to safely turn OFF sandbox and hide the warning
function disableSandbox() {
    const sandboxBtn = byId('sandbox-toggle');
    const iframe = byId('tv-iframe');

    if (!iframe) return;

    iframe.removeAttribute('sandbox');
    sandboxBtn.classList.remove('on');
    sandboxBtn.classList.add('off');
    sandboxBtn.textContent = "Sandbox: OFF";
    console.log("Sandbox disabled");

    // Refresh the iframe to apply the change
    if (iframe.src && iframe.src.trim() !== "") {
        const currentSrc = iframe.src;
        iframe.src = "";
        setTimeout(() => {
            iframe.src = currentSrc;
        }, 50);
    }
    sandboxWarning.style.display = 'none';
}

// Event listener for the main toggle button
safeOn(byId('sandbox-toggle'), 'click', () => {
    const sandboxBtn = byId('sandbox-toggle');
    const iframe = byId('tv-iframe');

    if (!iframe) return;

    if (sandboxBtn.classList.contains('on')) {
        // If sandbox is currently ON, show the warning pop-up
        sandboxWarning.style.display = 'flex';
    } else {
        // If sandbox is OFF, enable it directly
        iframe.setAttribute('sandbox', 'allow-scripts allow-presentation allow-same-origin');
        sandboxBtn.classList.remove('off');
        sandboxBtn.classList.add('on');
        sandboxBtn.textContent = "Sandbox: ON";
        console.log("Sandbox enabled");

        // Refresh the iframe to apply the change
        if (iframe.src && iframe.src.trim() !== "") {
            const currentSrc = iframe.src;
            iframe.src = "";
            setTimeout(() => {
                iframe.src = currentSrc;
            }, 50);
        }
    }
});

// Event listeners for the pop-up buttons
safeOn(proceedBtn, 'click', disableSandbox);
safeOn(abortBtn, 'click', () => {
    sandboxWarning.style.display = 'none';
});

