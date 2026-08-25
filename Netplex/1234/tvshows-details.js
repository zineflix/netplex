// ==============================
// TMDB CONFIG
// ==============================
const apiKey='a1e72fd93ed59f56e6332813b9f8dcae';
const baseUrl='https://api.themoviedb.org/3';

// ==============================
// UTILITIES
// ==============================
const getJSON=async(url)=>{
  const res=await fetch(url);
  if(!res.ok)throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};
const imgUrl=(path,size='w500')=>path?`https://image.tmdb.org/t/p/${size}${path}`:'https://via.placeholder.com/500x750?text=No+Image';
const byId=id=>document.getElementById(id);
const qs=(sel,root=document)=>root.querySelector(sel);
const qsa=(sel,root=document)=>[...root.querySelectorAll(sel)];
const safeOn=(el,ev,fn)=>el&&el.addEventListener(ev,fn);

// ==============================
// LIST/ROW FETCHING (HOME)
// ==============================
const CATEGORY_ENDPOINTS_TV={
  popular:'/tv/popular',
  trending:'/trending/tv/week',
  top_rated:'/tv/top_rated',
  action_adventure:'/discover/tv?with_genres=10759',
  comedy:'/discover/tv?with_genres=35',
  mystery:'/discover/tv?with_genres=9648',
  scifi_fantasy:'/discover/tv?with_genres=10765',
  animation:'/discover/tv?with_genres=16'
};

async function fetchTVShows(category,rowId){
  const endpoint=CATEGORY_ENDPOINTS_TV[category];
  if(!endpoint)return console.warn(`Unknown TV category: ${category}`);
  const container=byId(rowId);
  if(!container)return;
  try{
    const separator=endpoint.includes('?')?'&':'?';
    const data=await getJSON(`${baseUrl}${endpoint}${separator}api_key=${apiKey}&language=en-US&page=1`);
    container.innerHTML='';
    (data.results||[]).forEach(show=>{
      const card=document.createElement('div');
      card.className='movie-card';
      card.style.position='relative';
      card.innerHTML=`
        <img class="row__poster" src="${imgUrl(show.poster_path)}" alt="${show.name}">
        <div class="movie-rating"><i class="fas fa-star"></i> ${Number(show.vote_average||0).toFixed(1)}</div>
        <div class="play-button"><i class="fas fa-play"></i></div>
      `;
      card.addEventListener('click',()=>window.location.href=`tv-details.html?tv_id=${show.id}`);
      container.appendChild(card);
    });
  }catch(err){
    console.error(`Error fetching ${category} TV shows:`,err);
  }
}

// ==============================
// BANNER (HOME)
// ==============================
async function fetchTVBanner(){
  const banner=qs('.banner');
  if(!banner)return;
  try{
    const {results=[]}=await getJSON(`${baseUrl}/tv/popular?api_key=${apiKey}&language=en-US&page=1`);
    if(!results.length)return;
    const show=results[Math.floor(Math.random()*results.length)];
    banner.style.backgroundImage=`url(${imgUrl(show.backdrop_path,'original')})`;
    const titleEl=qs('.banner__title');
    const descEl=qs('.banner__description');
    if(titleEl)titleEl.textContent=show.name||'Untitled';
    if(descEl){
      const text=show.overview||'';
      descEl.textContent=text.length>150?text.slice(0,150)+'...':text;
    }
    const bannerPlay=banner.querySelector('.play-button')||byId('banner-play-btn');
    safeOn(bannerPlay,'click',()=>window.location.href=`tv-details.html?tv_id=${show.id}`);
  }catch(err){
    console.error('Error fetching TV banner:',err);
  }
}

// ==============================
// HORIZONTAL ARROW NAV (HOME)
// ==============================
function initArrowNavigation(){
  qsa('.row__posters').forEach(row=>{
    const prev=row.parentElement?.querySelector('.arrow-button.prev');
    const next=row.parentElement?.querySelector('.arrow-button.next');
    if(!prev||!next)return;
    let x=0;
    const step=220;
    safeOn(prev,'click',()=>{
      x=Math.max(0,x-step);
      row.scrollTo({left:x,behavior:'smooth'});
    });
    safeOn(next,'click',()=>{
      const max=row.scrollWidth-row.clientWidth;
      x=Math.min(max,x+step);
      row.scrollTo({left:x,behavior:'smooth'});
    });
  });
}

// ==============================
// SEARCH BAR UI (GLOBAL)
// ==============================
function toggleSearchBar(){
  qs('.search-bar')?.classList.toggle('show');
}

document.addEventListener('click',e=>{
  const bar=qs('.search-bar');
  const icons=qs('.icons-container');
  if(bar&&!bar.contains(e.target)&&!icons?.contains(e.target))bar.classList.remove('show');
});

function openSearchPage(){
  window.location.href='search.html';
}

// ==============================
// FAVORITES / LIST PAGE (GLOBAL)
// ==============================
function renderSavedTVList(){
  const container=byId('tv-list-container');
  if(!container)return;
  const tvList=JSON.parse(localStorage.getItem('tvList')||'[]');

  if(!tvList.length){
    container.innerHTML='<p>Your TV show list is empty!</p>';
    return;
  }

  container.innerHTML='';

  tvList.forEach(show=>{
    const card=document.createElement('div');
    card.className='movie-card';
    card.innerHTML=`
      <img class="row__poster" src="${imgUrl(show.poster_path)}" alt="${show.name}">
      <p>${show.name}</p>
    `;
    card.addEventListener('click',()=>window.location.href=`tv-details.html?tv_id=${show.id}`);
    container.appendChild(card);
  });
}

// ==============================
// STREAMING SERVERS (DETAILS)
// ==============================
const TV_ENDPOINTS=[
  {url:'https://cinesrc.st/embed/tv/',name:'Server 1'},
  {url:'https://web.nxsha.app/embed/tv/',name:'Server 2'},
  {url:'https://anicine.xyz/embed?url=https://embed.asfnsa-alig.workers.dev/tv/',name:'Server 3'},
  {url:'https://1embed.cc/embed/tv/',name:'Server 4'},
  {url:'https://yapgrid.com/embed/tv/',name:'Server 5'},
  {url:'https://cinevaro.app/media/tmdb-tv-',name:'Server 6'},
  {url:'https://anyembed.xyz/embed/tmdb-tv-',name:'Server 7'},
  {url:'https://hexa.su/watch/tv/',name:'Server 8'},
  {url:'https://vidzen.fun/tv/',name:'Server 9'},
  {url:'https://www.rivestream.ru/watch?type=tv&id=',name:'Server 10'},
  {url:'https://vidlux.xyz/embed/tv/',name:'Server 11'},
  {url:'https://vidup.to/tv/',name:'Server 12 Ads'},
  {url:'https://vsembed.ru/embed/tv/',name:'Server 13 Ads'},
  {url:'https://api.cineby.homes/embed/tv/',name:'Server 14 Ads'},
  {url:'https://vidbolt.pro/tv/',name:'Server 15 Ads'},
  {url:'https://player.videasy.to/tv/',name:'Server 16 Ads'},
  {url:'https://vidcore.io/tv/',name:'Server 17 Ads'},
  {url:'https://vaplayer.ru/embed/tv/',name:'Server 18 Ads'},
  {url:'https://vidsrc.hair/embed/tv/',name:'Server 19 Ads'},
  {url:'https://player.zxcstream.xyz/player/tv/',name:'Server 20 Ads'},
  {url:'https://111movies.net/tv/',name:'Server 21 Ads'},
  {url:'https://moviesapi.to/tv/',name:'Server 22 Ads'},
  {url:'https://vidrock.net/tv/',name:'Server 23 Ads'},
  {url:'https://embedmaster.link/tv/',name:'Server 24 Ads'},
  {url:'https://mapple.rip/watch/tv/',name:'Server 25 Ads'}
];

let currentTVServerIndex=0;
let currentSeason=1;
let currentEpisode=1;
let totalSeasons=1;

// Helper to close all custom dropdown menus
function closeAllDropdowns(exceptId = null) {
  const dropdownIds = ['season-dropdown', 'episode-dropdown', 'server-dropdown'];
  dropdownIds.forEach(id => {
    if (id !== exceptId) {
      const el = byId(id);
      if (el) el.style.display = 'none';
    }
  });
}

// Close dropdowns when clicking anywhere outside of buttons or containers
document.addEventListener('click', (e) => {
  const isDropdownClick = e.target.closest(
    '#season-dropdown-btn, #episode-dropdown-btn, #change-server-btn, #season-dropdown, #episode-dropdown, #server-dropdown'
  );
  if (!isDropdownClick) {
    closeAllDropdowns();
  }
});

// ==============================
// TV SERVER URL BUILDER
// ==============================
function buildTVServerURL(serverIndex,id,season,episode){
  const server=TV_ENDPOINTS[serverIndex];

  if(!server){
    console.error('Invalid TV server index:',serverIndex);
    return '';
  }

  // Server 1, 7 and 25: ID-SEASON-EPISODE
  if(serverIndex===0||serverIndex===6||serverIndex===24){
    return `${server.url}${id}-${season}-${episode}`;
  }

  // Server 10: RiveStream query format
  if(serverIndex===9){
    return `${server.url}${id}&season=${season}&episode=${episode}`;
  }

  // Server 22: ID-SEASON-EPISODE
  if(serverIndex===21){
    return `${server.url}${id}-${season}-${episode}`;
  }

  // All other servers: ID/SEASON/EPISODE
  return `${server.url}${id}/${season}/${episode}`;
}

// ==============================
// DETAILS PAGE (TV SHOW)
// ==============================
async function fetchTVDetails(){
  const params=new URLSearchParams(window.location.search);
  const tvId=params.get('tv_id')||params.get('id');

  if(!tvId)return;

  try{
    const show=await getJSON(`${baseUrl}/tv/${tvId}?api_key=${apiKey}&language=en-US`);

    const poster=byId('tv-poster');
    if(poster)poster.src=imgUrl(show.poster_path);

    const bgEl=qs('.blurred-background');
    if(bgEl){
      bgEl.style.backgroundImage='none';
      bgEl.style.backgroundColor='black';
    }

    const desc=byId('tv-description');
    if(desc)desc.textContent=show.overview||'No description available.';

    const titleEl=byId('tv-title');
    if(titleEl)titleEl.textContent=show.name||'Untitled';

    // ==============================
    // CAST
    // ==============================
    const {cast=[]}=await getJSON(`${baseUrl}/tv/${tvId}/credits?api_key=${apiKey}&language=en-US`);
    const castContainer=byId('tv-cast');

    if(castContainer){
      castContainer.innerHTML='';

      cast.slice(0,6).forEach(actor=>{
        const member=document.createElement('div');
        member.className='cast-member';

        member.innerHTML=`
          <img src="${actor.profile_path?imgUrl(actor.profile_path,'w185'):'https://via.placeholder.com/100x150?text=No+Image'}" alt="${actor.name}">
          <p style="color:white">${actor.name}</p>
        `;

        castContainer.appendChild(member);
      });
    }

    // ==============================
    // TRAILER
    // ==============================
    const videos=await getJSON(`${baseUrl}/tv/${tvId}/videos?api_key=${apiKey}&language=en-US`);
    const trailer=(videos.results||[]).find(v=>v.type==='Trailer'&&v.site==='YouTube');

    const trailerIframe=byId('tv-iframe-trailer');
    const trailerPopup=byId('trailer-popup');
    const closeTrailerBtn=byId('close-trailer');
    const trailerBtn=byId('watch-trailer-btn');

    if(trailer&&trailerBtn&&trailerPopup&&trailerIframe){
      safeOn(trailerBtn,'click',()=>{
        trailerPopup.style.display='flex';
        trailerIframe.src=`https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
      });

      safeOn(closeTrailerBtn,'click',()=>{
        trailerPopup.style.display='none';
        trailerIframe.src='';
      });
    }

// ==============================
// DOWNLOAD OPTIONS
// ==============================
const downloadBtn = byId('download-btn');
const downloadPopup = byId('download-popup');
const closeDownloadBtn = byId('close-download-popup');

const primaryDownloadBtn = byId('primary-download-btn');
const alternativeDownloadBtn = byId('alternative-download-btn');

if (
    downloadBtn &&
    downloadPopup &&
    closeDownloadBtn &&
    primaryDownloadBtn &&
    alternativeDownloadBtn
) {

    // Open download options
    safeOn(downloadBtn, 'click', () => {
        if (!tvId) return;

        downloadPopup.style.display = 'flex';
    });

    // ==============================
    // PRIMARY DOWNLOAD
    // ==============================
    safeOn(primaryDownloadBtn, 'click', () => {
        if (!tvId) return;

        const primaryUrl =
            `https://web.nxsha.app/dl/tv/${tvId}/${currentSeason}/${currentEpisode}`;

        window.open(
            primaryUrl,
            '_blank',
            'noopener,noreferrer'
        );

        downloadPopup.style.display = 'none';
    });

    // ==============================
    // ALTERNATIVE DOWNLOAD
    // ==============================
    safeOn(alternativeDownloadBtn, 'click', () => {
        if (!tvId) return;

        const alternativeUrl =
            `https://vidvault.ru/tv/${tvId}/${currentSeason}/${currentEpisode}`;

        window.open(
            alternativeUrl,
            '_blank',
            'noopener,noreferrer'
        );

        downloadPopup.style.display = 'none';
    });

    // ==============================
    // CLOSE POPUP
    // ==============================
    safeOn(closeDownloadBtn, 'click', () => {
        downloadPopup.style.display = 'none';
    });

    // Close when clicking outside modal
    safeOn(downloadPopup, 'click', (e) => {
        if (e.target === downloadPopup) {
            downloadPopup.style.display = 'none';
        }
    });
}

    // ==============================
    // RATING
    // ==============================
    const starWrap=byId('tv-rating');

    if(starWrap){
      starWrap.innerHTML='';

      const filled=Math.round((show.vote_average||0)/2);
      const empty=5-filled;

      for(let i=0;i<filled;i++){
        const s=document.createElement('span');
        s.className='star filled';
        starWrap.appendChild(s);
      }

      for(let i=0;i<empty;i++){
        const s=document.createElement('span');
        s.className='star empty';
        starWrap.appendChild(s);
      }
    }

    // ==============================
    // GENRES
    // ==============================
    const genreWrap=byId('tv-genres');

    if(genreWrap){
      genreWrap.innerHTML='';

      (show.genres||[]).forEach(g=>{
        const sp=document.createElement('span');
        sp.className='genre';
        sp.textContent=g.name;
        genreWrap.appendChild(sp);
      });
    }

    // ==============================
    // SEASON AND EPISODE LOGIC
    // ==============================
    totalSeasons=show.number_of_seasons||1;

    const seasonsList=byId('season-list');
    const episodesList=byId('episode-list');
    const currentSeasonEl=byId('current-season');
    const currentEpisodeEl=byId('current-episode');

    function populateSeasons(){
      if(!seasonsList)return;

      seasonsList.innerHTML='';

      for(let i=1;i<=totalSeasons;i++){
        const li=document.createElement('li');
        li.textContent=`Season ${i}`;

        li.addEventListener('click',()=>{
          currentSeason=i;
          currentEpisode=1;

          if(currentSeasonEl)currentSeasonEl.textContent=i;
          if(currentEpisodeEl)currentEpisodeEl.textContent=1;

          populateEpisodes(i);
          changeTVEpisode(tvId,currentSeason,currentEpisode);

          const dropdown=byId('season-dropdown');
          if(dropdown)dropdown.style.display='none';
        });

        seasonsList.appendChild(li);
      }
    }

    async function populateEpisodes(seasonNumber){
      if(!episodesList)return;

      try{
        const seasonData=await getJSON(`${baseUrl}/tv/${tvId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`);

        episodesList.innerHTML='';

        (seasonData.episodes||[]).forEach(episode=>{
          const li=document.createElement('li');
          li.textContent=`Episode ${episode.episode_number}`;

          li.addEventListener('click',()=>{
            currentEpisode=episode.episode_number;

            if(currentEpisodeEl)currentEpisodeEl.textContent=currentEpisode;

            changeTVEpisode(tvId,currentSeason,currentEpisode);

            const dropdown=byId('episode-dropdown');
            if(dropdown)dropdown.style.display='none';
          });

          episodesList.appendChild(li);
        });
      }catch(err){
        console.error('Error fetching episodes:',err);
      }
    }

    populateSeasons();
    populateEpisodes(currentSeason);

    // ==============================
    // SEASON DROPDOWN
    // ==============================
    safeOn(byId('season-dropdown-btn'),'click',()=>{
      const dropdown=byId('season-dropdown');

      if(!dropdown)return;

      const isOpening = dropdown.style.display !== 'block';
      closeAllDropdowns('season-dropdown');
      dropdown.style.display = isOpening ? 'block' : 'none';
    });

    // ==============================
    // EPISODE DROPDOWN
    // ==============================
    safeOn(byId('episode-dropdown-btn'),'click',()=>{
      const dropdown=byId('episode-dropdown');

      if(!dropdown)return;

      const isOpening = dropdown.style.display !== 'block';
      closeAllDropdowns('episode-dropdown');
      dropdown.style.display = isOpening ? 'block' : 'none';
    });

    // ==============================
    // IFRAME + AUTO-LOAD SERVER 1
    // ==============================
    const iframeContainer=byId('iframe-container');
    const tvIframe=byId('tv-iframe');
    const watchNowBtn=byId('watch-now-btn');

    if(iframeContainer&&tvIframe){
      iframeContainer.style.display='flex';
      currentTVServerIndex=0;

      changeTVEpisode(tvId,currentSeason,currentEpisode);

      if(watchNowBtn)watchNowBtn.style.display='none';
    }

    // ==============================
    // SERVERS DROPDOWN
    // ==============================
    const changeServerBtn=byId('change-server-btn');
    const serverDropdown=byId('server-dropdown');
    const serverList=byId('server-list');

    if(serverList){
      serverList.innerHTML='';

      TV_ENDPOINTS.forEach((endpoint,idx)=>{
        const li=document.createElement('li');

        li.textContent=endpoint.name;

        li.addEventListener('click',()=>changeTVServer(idx,tvId));

        serverList.appendChild(li);
      });
    }

    safeOn(changeServerBtn,'click',()=>{
      if(!serverDropdown)return;

      const isOpening = serverDropdown.style.display !== 'block';
      closeAllDropdowns('server-dropdown');
      serverDropdown.style.display = isOpening ? 'block' : 'none';
    });

    // ==============================
    // CLOSE IFRAME
    // ==============================
    const closeIframeBtn=byId('close-iframe-btn');

    safeOn(closeIframeBtn,'click',()=>{
      if(!iframeContainer||!tvIframe||!watchNowBtn)return;

      iframeContainer.style.display='none';
      tvIframe.src='';
      watchNowBtn.style.display='block';

      window.location.reload();
    });

    // ==============================
    // MORE LIKE THIS
    // ==============================
    fetchMoreLikeThisTV(tvId);

  }catch(err){
    console.error('Error fetching TV show details:',err);
  }
}

// ==============================
// CHANGE TV SERVER
// ==============================
function changeTVServer(index,id){
  if(index<0||index>=TV_ENDPOINTS.length){
    console.error('Invalid server index.');
    return;
  }

  currentTVServerIndex=index;

  const tvIframe=byId('tv-iframe');
  const serverDropdown=byId('server-dropdown');
  const changeServerBtn=byId('change-server-btn');
  const dropdownIcon=changeServerBtn?.querySelector('.dropdown-icon');
  const sandboxBtn=byId('sandbox-toggle');
  const selectedServer=TV_ENDPOINTS[currentTVServerIndex];

  if(tvIframe){
    tvIframe.setAttribute('sandbox','allow-scripts allow-presentation allow-same-origin');

    if(sandboxBtn){
      sandboxBtn.classList.remove('off');
      sandboxBtn.classList.add('on');
      sandboxBtn.textContent='Sandbox: ON';
    }
  }

  const url=buildTVServerURL(currentTVServerIndex,id,currentSeason,currentEpisode);

  if(tvIframe)tvIframe.src=url;

  if(changeServerBtn){
    changeServerBtn.textContent='';
    changeServerBtn.appendChild(document.createTextNode(selectedServer.name));

    if(dropdownIcon)changeServerBtn.appendChild(dropdownIcon);
  }

  if(serverDropdown)serverDropdown.style.display='none';

  console.log(`Changed to TV server: ${selectedServer.name}, URL: ${url}`);
}

// ==============================
// CHANGE TV EPISODE
// ==============================
function changeTVEpisode(id,season,episode){
  const tvIframe=byId('tv-iframe');
  const sandboxBtn=byId('sandbox-toggle');
  const selectedServer=TV_ENDPOINTS[currentTVServerIndex];

  if(!selectedServer){
    console.error('TV server not found.');
    return;
  }

  if(tvIframe){
    tvIframe.setAttribute('sandbox','allow-scripts allow-presentation allow-same-origin');

    if(sandboxBtn){
      sandboxBtn.classList.remove('off');
      sandboxBtn.classList.add('on');
      sandboxBtn.textContent='Sandbox: ON';
    }
  }

  const url=buildTVServerURL(currentTVServerIndex,id,season,episode);

  if(tvIframe)tvIframe.src=url;

  console.log(`Changed to Season ${season}, Episode ${episode} on ${selectedServer.name}, URL: ${url}`);
}

// ==============================
// MORE LIKE THIS
// ==============================
async function fetchMoreLikeThisTV(id){
  const container=byId('similar-tv-container');

  if(!container)return;

  try{
    const data=await getJSON(`${baseUrl}/tv/${id}/similar?api_key=${apiKey}&language=en-US`);

    container.innerHTML='';

    (data.results||[]).forEach(s=>{
      const item=document.createElement('div');
      item.className='similar-movie';

      item.innerHTML=`
        <img class="similar-movie-img" src="${imgUrl(s.poster_path,'original')}" alt="${s.name}">
        <span class="movie-title" style="display:none">${s.name}</span>
      `;

      item.addEventListener('click',()=>{
        window.location.href=`tv-details.html?tv_id=${s.id}`;
      });

      container.appendChild(item);
    });
  }catch(err){
    console.error('Error fetching similar TV shows:',err);
  }
}

// ==============================
// GLOBAL UI / MISC
// ==============================
safeOn(document,'DOMContentLoaded',()=>{
  const rowMap=[
    ['popular','popularTVShows'],
    ['trending','trendingTVShows'],
    ['top_rated','topRatedTV'],
    ['action_adventure','actionAdventureTV'],
    ['comedy','comedyTV'],
    ['mystery','mysteryTV'],
    ['scifi_fantasy','sciFiFantasyTV'],
    ['animation','animationTV']
  ];

  rowMap.forEach(([cat,id])=>fetchTVShows(cat,id));

  fetchTVBanner();
  renderSavedTVList();
  initArrowNavigation();

  safeOn(window,'scroll',()=>{
    const nav=qs('nav');
    if(nav)nav.classList.toggle('nav-solid',window.scrollY>50);
  });

  safeOn(byId('menu-btn'),'click',()=>{
    byId('menu')?.classList.toggle('active');
  });

  safeOn(byId('close-button'),'click',()=>{
    window.location.href='tv-show.html';
  });

  safeOn(window,'load',()=>{
    setTimeout(()=>{
      const loader=byId('loading-screen');
      if(loader)loader.style.display='none';
    },1000);
  });

  if(typeof getComments==='function'){
    safeOn(window,'load',getComments);
  }

  fetchTVDetails();
});

// ==============================
// FLOATING MESSAGE CLOSE
// ==============================
function closeMessage(){
  const el=byId('floating-message');

  if(el)el.style.display='none';
}

// ==============================
// FULLSCREEN FOR IFRAME
// ==============================
// ==============================
// FULLSCREEN FOR VIDEO ONLY
// ==============================
function toggleFullscreen() {
    const iframe = document.getElementById('tv-iframe');

    if (!iframe) {
        console.error('TV iframe not found.');
        return;
    }

    const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

    if (isFullscreen) {
        // Exit fullscreen
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
        // Fullscreen ONLY the video iframe
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    }

    // Try landscape mode on mobile/TV devices
    if (screen.orientation?.lock) {
        screen.orientation.lock('landscape').catch(() => {});
    }
}

// ==============================
// SANDBOX TOGGLE
// ==============================
const sandboxWarning=byId('sandbox-warning');
const proceedBtn=byId('proceed-btn');
const abortBtn=byId('abort-btn');

function disableSandbox(){
  const sandboxBtn=byId('sandbox-toggle');
  const iframe=byId('tv-iframe');

  if(!iframe)return;

  iframe.removeAttribute('sandbox');

  if(sandboxBtn){
    sandboxBtn.classList.remove('on');
    sandboxBtn.classList.add('off');
    sandboxBtn.textContent='Sandbox: OFF';
  }

  console.log('Sandbox disabled');

  if(iframe.src&&iframe.src.trim()!==''){
    const currentSrc=iframe.src;

    iframe.src='';

    setTimeout(()=>{
      iframe.src=currentSrc;
    },50);
  }

  if(sandboxWarning)sandboxWarning.style.display='none';
}

// ==============================
// SANDBOX TOGGLE BUTTON
// ==============================
safeOn(byId('sandbox-toggle'),'click',()=>{
  const sandboxBtn=byId('sandbox-toggle');
  const iframe=byId('tv-iframe');

  if(!iframe||!sandboxBtn)return;

  if(sandboxBtn.classList.contains('on')){
    if(sandboxWarning)sandboxWarning.style.display='flex';
  }else{
    iframe.setAttribute('sandbox','allow-scripts allow-presentation allow-same-origin');

    sandboxBtn.classList.remove('off');
    sandboxBtn.classList.add('on');
    sandboxBtn.textContent='Sandbox: ON';

    console.log('Sandbox enabled');

    if(iframe.src&&iframe.src.trim()!==''){
      const currentSrc=iframe.src;

      iframe.src='';

      setTimeout(()=>{
        iframe.src=currentSrc;
      },50);
    }
  }
});

// ==============================
// SANDBOX POPUP BUTTONS
// ==============================
safeOn(proceedBtn,'click',disableSandbox);

safeOn(abortBtn,'click',()=>{
  if(sandboxWarning)sandboxWarning.style.display='none';
});
