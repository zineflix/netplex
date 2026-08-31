window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add("nav-solid");
        } else {
            nav.classList.remove("nav-solid");
        }
    }
});

/* =========================================================
   UNIVERSAL EMBED PLAY / PAUSE & AUTOPLAY LOGIC
========================================================= */
function appendAutoplayParam(url) {
    if (!url) return "";
    try {
        let cleanUrl = url.startsWith("//") ? "https:" + url : url;
        let urlObj = new URL(cleanUrl);
        if (!urlObj.searchParams.has("autoplay")) {
            urlObj.searchParams.set("autoplay", "1");
        }
        return url.startsWith("//") ? urlObj.toString().replace(/^https?:/, "") : urlObj.toString();
    } catch (e) {
        if (url.indexOf("?") === -1) {
            return url + "?autoplay=1";
        }
        return url + "&autoplay=1";
    }
}

function updatePlayPauseBtnUI(btn, isPlaying) {
    if (!btn) return;
    if (isPlaying) {
        btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
    }
}

function setPauseOverlayStatus(modalType, isPaused) {
    const overlayId = (modalType === "tv") ? "tvPauseOverlay" : "moviePauseOverlay";
    const overlay = document.getElementById(overlayId);
    if (overlay) {
        if (isPaused) {
            overlay.classList.add("active");
        } else {
            overlay.classList.remove("active");
        }
    }
}

function toggleIframePlayback(iframe, btn, modalType) {
    if (!iframe) return;

    let isPlaying = iframe.dataset.isPlaying !== "false"; 

    if (isPlaying) {
        iframe.dataset.isPlaying = "false";
        updatePlayPauseBtnUI(btn, false);
        setPauseOverlayStatus(modalType, true);

        try {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            iframe.contentWindow.postMessage('{"method":"pause"}', '*');
            iframe.contentWindow.postMessage('pause', '*');
            iframe.contentWindow.postMessage(JSON.stringify({ event: "pause" }), '*');
        } catch (e) {}

        if (iframe.src && iframe.src !== "about:blank") {
            iframe.dataset.savedSrc = iframe.src;
            iframe.src = "about:blank";
        }
    } else {
        iframe.dataset.isPlaying = "true";
        updatePlayPauseBtnUI(btn, true);
        setPauseOverlayStatus(modalType, false);

        if (iframe.dataset.savedSrc) {
            iframe.src = iframe.dataset.savedSrc;
        }

        try {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            iframe.contentWindow.postMessage('{"method":"play"}', '*');
            iframe.contentWindow.postMessage('play', '*');
            iframe.contentWindow.postMessage(JSON.stringify({ event: "play" }), '*');
        } catch (e) {}
    }

    if (btn) {
        btn.focus();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    }

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

    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownButton && dropdownContent) {
        dropdownButton.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownContent.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.classList.remove("active");
            }
        });
    }

    const moviePlayBtn = document.getElementById("moviePlayBtn");
    if (moviePlayBtn) {
        moviePlayBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const iframe = document.getElementById("movieTrailer");
            toggleIframePlayback(iframe, moviePlayBtn, "movie");
        });
    }

    const tvPlayBtn = document.getElementById("tvPlayBtn");
    if (tvPlayBtn) {
        tvPlayBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const iframe = document.getElementById("tvTrailer");
            toggleIframePlayback(iframe, tvPlayBtn, "tv");
        });
    }

    window.addEventListener("blur", function () {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal && !activeModal.classList.contains("auth-modal-content") && !activeModal.classList.contains("auth-modal-root")) {
            setTimeout(() => {
                const targetBtn = activeModal.querySelector('.play-pause-btn') || activeModal.querySelector('#fullscreenButton');
                if (targetBtn) {
                    window.focus();
                    targetBtn.focus();
                }
            }, 10);
        }
    });
});

let lastActiveCard = null;

// MOVIE SECTION LOGIC
const API_KEY = "a1e72fd93ed59f56e6332813b9f8dcae";
const MOVIE_IDS = [
    18377, 597, 57627, 455714, 9470, 396535, 20453, 1001311, 11770, 41387, 16269, 57663, 
    53658, 570511, 200085, 433945, 184219, 11178, 15859, 158445, 851644, 9056, 10753, 
    11134, 9404, 11636, 52324, 58233, 219246, 1269208, 75612, 811646, 76826,
];
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const movieGallery = document.getElementById("movieGallery");
const movieModal = document.getElementById("movieModal");
const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieGenres = document.getElementById("movieGenres");
const movieDescription = document.getElementById("movieDescription");
const movieTrailer = document.getElementById("movieTrailer");

const MOVIE_VIDEOS = {
    18377: "//ok.ru/videoembed/9633107347995?nochat=1",
    597: "//ok.ru/videoembed/9644046748238?nochat=1",
    57627: "//ok.ru/videoembed/9644096817742?nochat=1",
    455714: "//ok.ru/videoembed/9644110776910?nochat=1",
    9470: "https://short.icu/XoTnMZi8e",
    396535: "https://short.icu/LqFDAWPgr",
    20453: "//ok.ru/videoembed/9644393499214?nochat=1",
    1001311: "//ok.ru/videoembed/9644423055950?nochat=1",
    11770: "https://short.icu/9WQZkbpvM",
    41387: "https://short.icu/Vs4-n_xYk",
    16269: "//ok.ru/videoembed/9644806376014?nochat=1",
    57663: "//ok.ru/videoembed/9644935875150?nochat=1",
    53658: "//ok.ru/videoembed/9645021006414?nochat=1",
    570511: "//ok.ru/videoembed/9645632719438?nochat=1",
    200085: "//ok.ru/videoembed/9648220408398?nochat=1",
    433945: "https://short.icu/isDXfa25J",
    184219: "//ok.ru/videoembed/9653891828302?nochat=1",
    11178: "//ok.ru/videoembed/9663357454926?nochat=1",
    15859: "//ok.ru/videoembed/9663417485902?nochat=1",
    158445: "https://short.icu/38tub1wQA",
    851644: "//ok.ru/videoembed/9668446128718?nochat=1",
    9056: "//ok.ru/videoembed/9671771294286?nochat=1",
    10753: "//ok.ru/videoembed/9671802948174?nochat=1",
    11134: "https://short.icu/mAo8J7sVwG",
    9404: "//ok.ru/videoembed/9671888276046?nochat=1",
    11636: "https://short.icu/b4IONWrDS",
    52324: "//ok.ru/videoembed/9671939918414?nochat=1",
    58233: "//ok.ru/videoembed/9643975313998?nochat=1",
    1269208: "https://drive.google.com/file/d/1fbECy9qUZg1Jc-21EReRWk3rZzr82Ahk/preview",
    75612: "https://drive.google.com/file/d/1JS4jt9FXtjS0zuIE9Wruzq5kX6DC9ABf/preview",
    811646: "https://drive.google.com/file/d/1--IpZfNaFtjyOCvqLdXDoUMN_I1IS-cg/preview",
    76826: "//ok.ru/videoembed/11124806453787?nochat=1",
};

async function fetchMovies() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get("movie");

        const movieRequests = MOVIE_IDS.map(id =>
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
                .then(response => response.json())
        );

        const movies = await Promise.all(movieRequests);

        movies.forEach(movie => {
            if (movie.poster_path) {
                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");
                movieCard.setAttribute("tabindex", "0");
                movieCard.setAttribute("role", "button");

                const year = (movie.release_date || "").slice(0, 4) || "—";

                movieCard.innerHTML = `
                    <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                    <span class="category-badge movie">Movie</span>
                    <span class="year-badge">${year}</span>
                    <div class="play-button"><i class="fa-solid fa-play"></i></div>
                `;
                
                movieCard.addEventListener("click", () => {
                    lastActiveCard = movieCard;
                    openModal(movie);
                });
                
                movieCard.addEventListener("focus", () => {
                    movieCard.scrollIntoView({ behavior: "smooth", block: "center" });
                });

                movieGallery.appendChild(movieCard);

                if (movieId && movie.id == movieId) {
                    openModal(movie);
                }
            }
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
        movieGallery.innerHTML = "<p>Failed to load movies. Please try again later.</p>";
    }
}

function openModal(movie) {
    moviePoster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
    moviePoster.alt = movie.title;
    movieTitle.textContent = movie.title;
    movieGenres.textContent = movie.genres ? movie.genres.map(genre => genre.name).join(", ") : "Unknown";
    movieDescription.textContent = movie.overview || "No description available.";
    
    let rawUrl = MOVIE_VIDEOS[movie.id] || "https://www.youtube.com/embed/defaultVideo";
    let videoUrl = appendAutoplayParam(rawUrl);

    movieTrailer.src = videoUrl;
    movieTrailer.dataset.isPlaying = "true";
    movieTrailer.dataset.savedSrc = videoUrl;

    const moviePlayBtn = document.getElementById("moviePlayBtn");
    updatePlayPauseBtnUI(moviePlayBtn, true);
    setPauseOverlayStatus("movie", false);

    movieModal.classList.add("show");
    document.body.classList.add("modal-open");
    
    const modalContent = document.getElementById("movieModalContent");
    if (modalContent) modalContent.scrollTop = 0;

    window.history.pushState({ type: "movie", id: movie.id }, "", `?movie=${movie.id}`);

    setTimeout(() => {
        if (moviePlayBtn) {
            moviePlayBtn.focus();
        }
    }, 150);
}

function closeModal() {
    movieModal.classList.remove("show");
    document.body.classList.remove("modal-open");
    movieTrailer.src = "";
    movieTrailer.dataset.isPlaying = "false";
    movieTrailer.dataset.savedSrc = "";
    setPauseOverlayStatus("movie", false);
    window.history.pushState({}, "", window.location.pathname);

    if (lastActiveCard) {
        lastActiveCard.focus();
    }
}

window.addEventListener("click", event => {
    if (event.target === movieModal) closeModal();
    if (event.target === document.getElementById("authModal")) closeAuthModal();
});

fetchMovies();

// TV SHOWS LOGIC
const TV_SHOW_IDS = [
    219246, 135238, 117378, 43899, 68814, 119051, 66776, 255779, 112836, 99966, 76557
];
const tvGallery = document.getElementById("tvGallery");
const tvModal = document.getElementById("tvModal");
const tvPoster = document.getElementById("tvPoster");
const tvTitle = document.getElementById("tvTitle");
const tvDescription = document.getElementById("tvDescription");
const tvTrailer = document.getElementById("tvTrailer");
const episodeDropdown = document.getElementById("episodeDropdown");

const TV_EPISODES = {
    219246: {
        links: [
            "https://drive.google.com/file/d/1NYnmWLsps_4j3bxJflerFgbuooFkrLMI/preview",
            "https://drive.google.com/file/d/1DMLS5t3Vq2MwRF3zeNRvpNIFpDKYNZAS/preview",
            "https://drive.google.com/file/d/1MDbrNZz8N_Q1PBKxRbnZ4pGSWgERHP8k/preview",
            "https://drive.google.com/file/d/1sFFrEIApC25AzfjnXSDDV05K-W1-7Uoz/preview",
            "https://drive.google.com/file/d/12YOGBdgVYboi17jISnF4sHO4UvH97Svh/preview",
            "https://drive.google.com/file/d/1PDx4Vtw4YF6XfduRwwS6nKZ6sPAC9nCeR/preview",
            "https://drive.google.com/file/d/1aC6lA84DiI3uoqPLZK8GRuQfLDhORPF9/preview",
            "https://drive.google.com/file/d/1dAA0BrlHeS4aHqY0Yq1tkSJblMVyMgo5/preview",
            "https://drive.google.com/file/d/1WBh7QpvfHN2zGQ6VjV18_yickANOmMcW/preview",
        ],
        titles: [
            "Season 1 Episode 1", "Season 1 Episode 2", "Season 1 Episode 3", "Season 1 Episode 4",
            "Season 1 Episode 5", "Season 1 Episode 6", "Season 1 Episode 7", "Season 1 Episode 8", "Season 1 Episode 9 to 12"
        ]
    },
    135238: {
        links: [
            "https://drive.google.com/file/d/1v8ZkyzNj4QAgpGREQVzRVVIzs5KMvuyJ/preview",
            "https://drive.google.com/file/d/1LNua7Pu36G-T9sBbIqdBxIJr5h2obLIj/preview",
            "https://drive.google.com/file/d/1eXlm8bWVXD_LcWBvHTattIgyW_XznAbm/preview",
            "https://drive.google.com/file/d/1Iwp08zXFEvft-dnrYTzsW87VKRbKGLVN/preview",
            "https://drive.google.com/file/d/1hAw3aZZ-77eI99PbEUmMGnff1EyD47oW/preview",
            "https://drive.google.com/file/d/1H0EOjB_S6A24-MPlwKJmPRRfulD9MILN/preview",
            "https://drive.google.com/file/d/15676A_B9lmohU6QaFkr7pGhWzGAWl64V/preview",
            "https://drive.google.com/file/d/1i9-ROhq6Zzl_dTsGDfVc5l00A38cuB16/preview",
            "https://drive.google.com/file/d/1zIyQKj7xtn3zum01J9Rnb0fVlpuPrHU5/preview",
            "https://drive.google.com/file/d/1PDx4Vtw4YF6XfduRwwS6nKZ6sPAC9nCeR/preview",
            "https://drive.google.com/file/d/11dU7wkT6pRY0YR3Nd_Hv2PKyI4B_XGYi/preview",
            "https://drive.google.com/file/d/1kmaj_RV5tmZEQpvs_UkULdcJXbqZNAcd/preview",
            "https://drive.google.com/file/d/1rLDuViEVQfNF9NGOe6v_E5HOPVZ7wvwY/preview",
            "https://drive.google.com/file/d/1Dm1dL_VPeI_184iVhK-vE1KbbJsHra_b/preview",
            "https://drive.google.com/file/d/1aazMO8elC7248KYwOIbV-SR4YEUn3mMF/preview",
            "https://drive.google.com/file/d/1blNQ7TXK-bSgE54jDB0aSNi_fMTXFjc_/preview",
            "https://drive.google.com/file/d/1QSdgkFxeDjPmTtSoYwq4T_O5TT4R1stp/preview",
        ],
        titles: [
            "Season 1 Episode 1", "Season 1 Episode 2", "Season 1 Episode 3", "Season 1 Episode 4",
            "Season 1 Episode 5", "Season 1 Episode 6", "Season 1 Episode 7", "Season 1 Episode 8",
            "Season 1 Episode 9", "Season 1 Episode 10", "Season 2 Episode 1", "Season 2 Episode 2",
            "Season 2 Episode 3", "Season 2 Episode 4", "Season 2 Episode 5", "Season 2 Episode 6", "Season 2 Episode 7"
        ]
    },
    117378: {
        links: [
            "https://drive.google.com/file/d/1evVcI5DJaroYmsaPbJ1Ubuh4BAvHB1H7/preview",
            "https://drive.google.com/file/d/1ewOxJPhJ8avorLXX1A4B1FWqVq93M4sN/preview",
            "https://drive.google.com/file/d/1f1tBHWvoNaRuddI5Ym51aBU994s1mV_D/preview",
            "https://drive.google.com/file/d/1fGZ4OdmaTwsouT8Vvtkj9qsih1JzD_BX/preview",
            "https://drive.google.com/file/d/1f2FxXZmtaOW4uB6rU1pTcyBPJGd3fGmZ/preview",
            "https://drive.google.com/file/d/1f5dk71vjAcc4gpM5i_XyZ0Bt8u03Rzt2/preview",
            "https://drive.google.com/file/d/1fO7hChLTkPRye-qCbIzyWg3a_le1M7OB/preview",
            "https://drive.google.com/file/d/1fOCe6kJd98N4yEhBsNdhGA50xPMuLHs6/preview",
            "https://drive.google.com/file/d/1fHniIZSnCZ9ALSM4oqVz1WruAwqzOLiM/preview",
            "https://drive.google.com/file/d/1fHyy7iKC7u1LZZPcf18e_iJU2TA56Vx6/preview",
            "https://drive.google.com/file/d/1flu38bZQ4SAhll1d35Qeter0ODjrxCMe/preview",
            "https://drive.google.com/file/d/1frwJbuHKA_l0KkrpgZRigAqXEIOFlVyx/preview",
            "https://drive.google.com/file/d/1fXxqvBwlFWuFdN7JNXAX5ltRpaCWPEJr/preview",
            "https://drive.google.com/file/d/1feRkqY9_x6fGjldGODTcbKLsNpe6oEeX/preview",
            "https://drive.google.com/file/d/1fSNYpP6qSV7GJZVLR_U02bsoiRESNCkq/preview",
            "https://drive.google.com/file/d/1fzbxTdJIGdI4v5ZgDpfQwYyqLJwe6CCs/preview",
            "https://drive.google.com/file/d/1fvyznAmGWC6lwWK7dxddiLraMR1gPDu1/preview",
            "https://drive.google.com/file/d/1PDx4Vtw4YF6XfduRwwS6nKZ6sPAC9nCeR/preview",
            "https://drive.google.com/file/d/1g1iPf1-sOLY7KLZ4XnGQxhxL2jxXbPjs/preview",
            "https://drive.google.com/file/d/1g5QpVihX8vOFzvwjrJLxQJdkLUSwyEOF/preview",
        ],
        titles: [
            "Season 1 Episode 1", "Season 1 Episode 2", "Season 1 Episode 3", "Season 1 Episode 4",
            "Season 1 Episode 5", "Season 1 Episode 6", "Season 1 Episode 7", "Season 1 Episode 8",
            "Season 1 Episode 9", "Season 1 Episode 10", "Season 1 Episode 11", "Season 1 Episode 12",
            "Season 1 Episode 13", "Season 1 Episode 14", "Season 1 Episode 15", "Season 1 Episode 16",
            "Season 1 Episode 17", "Season 1 Episode 18", "Season 1 Episode 19", "Season 1 Episode 20"
        ]
    },
    43899: {
        links: [
            "https://drive.google.com/file/d/1zWJejfshlnuloPZzKhsU0vwkkfM1l5T6/preview",
            "https://drive.google.com/file/d/1H6-dlE_tNy-Wr_n1E_ZadivdUlig1oz-/preview",
            "https://drive.google.com/file/d/1ToXlThfEWBDbkgsodMPbnSFT1_ELpk4K/preview",
            "https://drive.google.com/file/d/1TJfGI7EoRESoINM9jhpVLlXjgA5zWCqj/preview",
            "https://drive.google.com/file/d/1sa3ySJUYOjQ3MORCx_7QJi9JVLjH4Ynd/preview",
            "https://drive.google.com/file/d/19cAE_yt-3gnt61PJfBYjY00oG4McY7Fs/preview",
            "https://drive.google.com/file/d/1G8l7mjV6FY_rhhQLbzsMnbONWzMXANyi/preview",
            "https://drive.google.com/file/d/1PC5q2TIEpO0gKSNVaVLHwK4A-1NFaXyu/preview",
            "https://drive.google.com/file/d/1dkhZBi6rt5CL35PKwCJaWlBz6oonJkhw/preview",
            "https://drive.google.com/file/d/1ciXIzP7xihTqMZdYwEBGnDArZXxDNRE3/preview",
        ],
        titles: [
            "Episode 1", "Episode 2", "Episode 3", "Episode 4", "Episode 5",
            "Episode 6", "Episode 7", "Episode 8", "Episode 9", "Episode 10"
        ]
    },
    68814: {
        links: [
            "https://drive.google.com/file/d/1mPc1PMbWb3JAZuRxdSgy6wmIT4Ff0pD2/preview",
            "https://drive.google.com/file/d/1KMBx_YfyG9QMJxlFsSKj41dCjuARWz16/preview",
            "https://drive.google.com/file/d/1-Q6U-Zw5taPKKL5IBx1WiJ0AqyyaSBKG/preview",
            "https://drive.google.com/file/d/1m4oQnzx_sMbCGoj3xQrUfilKrFw5cvtU/preview",
            "https://drive.google.com/file/d/1RPIOVSlbuHITdn5TCkhvihhMeGx5GzbO/preview",
            "https://drive.google.com/file/d/1y1gd0poT_yVdX299lSubPzHGNcbx8U_k/preview",
            "https://drive.google.com/file/d/1o2ij2B7ykOm0HcjKAQ-szlT8quBbM5C3/preview",
            "https://drive.google.com/file/d/1UUcWL33I5seiLugpbXSxDVNo2-9_VgnE/preview",
            "https://drive.google.com/file/d/1PDx4Vtw4YF6XfduRwwS6nKZ6sPAC9nCeR-djRz/preview",
            "https://drive.google.com/file/d/1DTLgO_bGTlWKjpWGDVuzaew-vbQp70y4/preview",
            "https://drive.google.com/file/d/1fLy8sx7t2asaFxjSv-QngLgnBRdmfiE8/preview",
            "https://drive.google.com/file/d/1PDx4Vtw4YF6XfduRwwS6nKZ6sPAC9nCeR/preview",
            "https://drive.google.com/file/d/1_JfcBppcElSapyxwH-zD4QkiADLiESgt/preview",
            "https://drive.google.com/file/d/1FVx-47Ysrh03tpk0rjScxhZUbz2SZWNM/preview",
            "https://drive.google.com/file/d/1f-QqJiNFCh1P8p8l0r_eSQR1bUEoCYvN/preview",
            "https://drive.google.com/file/d/1exb6Gb-vvqY0r8Ky52yAvdNC-C5w6LJc/preview",
        ],
        titles: [
            "Episode 1", "Episode 2", "Episode 3", "Episode 4", "Episode 5", "Episode 6",
            "Episode 7", "Episode 8", "Episode 9", "Episode 10", "Episode 11", "Episode 12",
            "Episode 13", "Episode 14", "Episode 15", "Episode 16"
        ]
    },
    119051: {
        links: [
            "https://mxdrop.to/e/kn7kp7pkskol4x",
            "https://mxdrop.to/e/1vr0mzelfw3p1g",
            "https://mxdrop.to/e/6qkjlv10bqr41v",
            "https://mxdrop.to/e/dqpv1pvnuvdjz3",
            "https://mxdrop.to/e/dqpv1pxkaq8qxv",
            "https://mxdrop.to/e/pk1xmz8kagnr7x",
            "https://mxdrop.to/e/j90733v8fplnp6",
            "https://mxdrop.to/e/rwzmddxka8n801",
            "https://ico3c.com/bkg/vu9wfs8uis2n",
            "https://ico3c.com/bkg/clkaqce8m5s1",
            "https://ico3c.com/bkg/wary01wvkjjg",
            "https://ico3c.com/bkg/k3ii4plllli2",
        ],
        titles: [
            "Season 1 Episode 1", "Season 1 Episode 2", "Season 1 Episode 3", "Season 1 Episode 4",
            "Season 1 Episode 5", "Season 1 Episode 6", "Season 1 Episode 7", "Season 1 Episode 8",
            "Season 2 Episode 1", "Season 2 Episode 2", "Season 2 Episode 3", "Season 2 Episode 4",
            "Season 2 Episode 5(Soon)", "Season 2 Episode 6(Soon)", "Season 2 Episode 7(Soon)", "Season 2 Episode 8(Soon)"
        ]
    },
    66776: {
        links: [
            "https://drive.google.com/file/d/1-00qYD9BcJRmGRZgKl49YGe5tOqh6zbF/preview",
            "https://drive.google.com/file/d/1-0lhHRy0wu_16WgQaKqBcOl5KDYrclkD/preview",
            "https://drive.google.com/file/d/1-Idxa1_A-EmF2dEaVtW8zxfPS3Ak2I1t/preview",
            "https://drive.google.com/file/d/1-O6mxiWYWBu2vORbchLJGjZ4gdRDKXXb/preview",
            "https://drive.google.com/file/d/1-CEcNwFVrnBMfRNWpawQJuBvAVA3LSqC/preview",
            "https://drive.google.com/file/d/1-FxH4Vmjlp-rSR_2Y0jgXrtdShqBo_jM/preview",
            "https://drive.google.com/file/d/1-HozFQjRW26ArPeldIbUJfXHl6Yu_Swe/preview",
            "https://drive.google.com/file/d/1-H92eL74dwnuiRXX5DiAmhMrFr6FHR1E/preview",
            "https://drive.google.com/file/d/1-JXTPFV2lrBBxs9WlPcP_RXj2z1gBkgh/preview",
            "https://drive.google.com/file/d/1-As0mGo6COFVgp2hHq94gdOLgN3q2EDX/preview",
            "https://drive.google.com/file/d/1-AyLArhlhrWcwxD05EVrDUbmmjfADi5u/preview",
            "https://drive.google.com/file/d/10so3ylSNPs8-Sg27x_otMh4E_gudnMjz/preview",
            "https://drive.google.com/file/d/11pbW-Hm9IktiQyvD9Rm0XijOPrwFV0Zs/preview",
            "https://drive.google.com/file/d/10aMEYqPSZ-sPOL1QBPJuKwX_ODNlboa2/preview",
            "https://drive.google.com/file/d/10cDhxptdbSXpKPgT_g9dy7tVWYn7STxw/preview",
            "https://drive.google.com/file/d/10eA6XtGLlJcDjoyJpgS7jwFBJNA2wO5q/preview",
            "https://drive.google.com/file/d/10eHSBAY0wLgesgsH5GC1Ak30qrJNrqDz/preview",
            "https://drive.google.com/file/d/11PW2g-xE0Vwk7q09lmcdCEDOexKhDPmX/preview",
            "https://drive.google.com/file/d/11RBlbL8xoNnHOBrQRXQTlh7h8A_qCTBX/preview",
            "https://drive.google.com/file/d/11U0tAB6F8e7v9ripQLoel6KpewvaJWEq/preview",
            "https://drive.google.com/file/d/11UDx85MNV2pIC7roNQN9G-G3d9bQ3bks/preview",
            "https://drive.google.com/file/d/1-8OLXP1NVsk__w02TjO0_Bn-AMe8qEVL/preview",
            "https://drive.google.com/file/d/1-95ola9cdm_Wdp7rlfSq10cg1y6QtG0X/preview",
            "https://drive.google.com/file/d/1-DeaQetLhI5DBRplM1esgHby13GcqQHJ/preview",
            "https://drive.google.com/file/d/1-WLeiAFu8moC4yUGjKLtpF4mWHQ5i7aZ/preview",
            "https://drive.google.com/file/d/1-9sJB8q4do2Tzu9x5osORqEiRPTD5pU8/preview",
            "https://drive.google.com/file/d/1-HozFQjRW26ArPeldIbUJfXHl6Yu_Swe/preview",
            "https://drive.google.com/file/d/1-IsbCqatIo8BP2EhfdeoIVBsq4UUEspH/preview",
            "https://drive.google.com/file/d/1-T6tVfDPAvaL8DXCzEpnJM2kjZKdFZS-/preview",
            "https://drive.google.com/file/d/1-FCILrQER3CyXSZo61kHIPlQNJH_c7dR/preview",
            "https://drive.google.com/file/d/1-Ijg-EhcwfQAfFHCUlq3vQw-KAR2AeR3/preview",
        ],
        titles: [
            "Season 1 Episode 1", "Season 1 Episode 2", "Season 1 Episode 3", "Season 1 Episode 4",
            "Season 1 Episode 5", "Season 1 Episode 6", "Season 1 Episode 7", "Season 1 Episode 8",
            "Season 1 Episode 9", "Season 1 Episode 10", "Season 1 Episode 11", "Season 1 Episode 12",
            "Season 1 Episode 13", "Season 1 Episode 14", "Season 1 Episode 15", "Season 1 Episode 16",
            "Season 1 Episode 17", "Season 1 Episode 18", "Season 1 Episode 19", "Season 1 Episode 20",
            "Season 2 Episode 1", "Season 2 Episode 2", "Season 2 Episode 3", "Season 2 Episode 4",
            "Season 2 Episode 5", "Season 2 Episode 6", "Season 2 Episode 7", "Season 2 Episode 8",
            "Season 2 Episode 9", "Season 2 Episode 10", "Season 2 Episode 11", "Season 2 Episode 12",
            "Season 2 Episode 13", "Season 2 Episode 14", "Season 2 Episode 15", "Season 2 Episode 16"
        ]
    }
};

async function fetchTvShows() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const tvId = urlParams.get("tv");

        const tvRequests = TV_SHOW_IDS.map(id =>
            fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`)
                .then(response => response.json())
        );

        const shows = await Promise.all(tvRequests);

        shows.forEach(show => {
            if (show.poster_path) {
                const showCard = document.createElement("div");
                showCard.classList.add("movie-card");
                showCard.setAttribute("tabindex", "0");
                showCard.setAttribute("role", "button");

                const year = (show.first_air_date || "").slice(0, 4) || "—";

                showCard.innerHTML = `
                    <img src="${IMAGE_BASE_URL}${show.poster_path}" alt="${show.name}">
                    <span class="category-badge tv">TV</span>
                    <span class="year-badge">${year}</span>
                    <div class="play-button"><i class="fa-solid fa-play"></i></div>
                `;
                
                showCard.addEventListener("click", () => {
                    lastActiveCard = showCard;
                    openTvModal(show);
                });
                
                showCard.addEventListener("focus", () => {
                    showCard.scrollIntoView({ behavior: "smooth", block: "center" });
                });

                tvGallery.appendChild(showCard);

                if (tvId && show.id == tvId) {
                    openTvModal(show);
                }
            }
        });
    } catch (error) {
        console.error("Error fetching TV shows:", error);
        tvGallery.innerHTML = "<p>Failed to load TV shows. Please try again later.</p>";
    }
}

function openTvModal(show) {
    tvPoster.src = `${IMAGE_BASE_URL}${show.poster_path}`;
    tvPoster.alt = show.name;
    tvTitle.textContent = show.name;
    tvDescription.textContent = show.overview || "No description available.";
    
    episodeDropdown.innerHTML = "";

    const episodesInfo = TV_EPISODES[show.id];
    let initialLink = "https://www.youtube.com/embed/defaultVideo";

    if (episodesInfo && episodesInfo.links.length > 0) {
        episodesInfo.links.forEach((link, index) => {
            const option = document.createElement("option");
            const epTitle = episodesInfo.titles ? episodesInfo.titles[index] : `Episode ${index + 1}`;
            option.value = link;
            option.textContent = epTitle;
            episodeDropdown.appendChild(option);
        });

        initialLink = episodesInfo.links[0];

        episodeDropdown.onchange = (e) => {
            let autoUrl = appendAutoplayParam(e.target.value);
            tvTrailer.src = autoUrl;
            tvTrailer.dataset.isPlaying = "true";
            tvTrailer.dataset.savedSrc = autoUrl;
            updatePlayPauseBtnUI(document.getElementById("tvPlayBtn"), true);
            setPauseOverlayStatus("tv", false);
        };
    }

    let activeAutoUrl = appendAutoplayParam(initialLink);
    tvTrailer.src = activeAutoUrl;
    tvTrailer.dataset.isPlaying = "true";
    tvTrailer.dataset.savedSrc = activeAutoUrl;

    const tvPlayBtn = document.getElementById("tvPlayBtn");
    updatePlayPauseBtnUI(tvPlayBtn, true);
    setPauseOverlayStatus("tv", false);

    tvModal.classList.add("show");
    document.body.classList.add("modal-open");
    
    const modalContent = document.getElementById("tvModalContent");
    if (modalContent) modalContent.scrollTop = 0;

    window.history.pushState({ type: "tv", id: show.id }, "", `?tv=${show.id}`);

    setTimeout(() => {
        if (tvPlayBtn) {
            tvPlayBtn.focus();
        }
    }, 150);
}

function closeTvModal() {
    tvModal.classList.remove("show");
    document.body.classList.remove("modal-open");
    tvTrailer.src = "";
    tvTrailer.dataset.isPlaying = "false";
    tvTrailer.dataset.savedSrc = "";
    setPauseOverlayStatus("tv", false);
    window.history.pushState({}, "", window.location.pathname);

    if (lastActiveCard) {
        lastActiveCard.focus();
    }
}

window.addEventListener("click", event => {
    if (event.target === tvModal) closeTvModal();
});

fetchTvShows();

// FPJ COLLECTION LOGIC
const FPJ_MOVIE_IDS = [861421, 515847, 880757, 507653, 359768, 399456, 492887, 533243, 491127, 801546, 496150, 586724, 954933, 360772, 966196, 767016, 515794, 799393];

const FPJ_VIDEOS = {
    861421: "https://drive.google.com/file/d/1gGEkNBjFTYewkIYA9s6mvB9T6sTT6-XQ/preview",
    515847: "https://drive.google.com/file/d/1Th3HpZgeY5SpNhGFtNY39GVgOKiasc4I/preview",
    880757: "https://drive.google.com/file/d/1JNpJqll-0hfXk8kTDPOdQ9wUpaA5GgGo/preview",
    507653: "https://drive.google.com/file/d/1ATqgMznm0YPkvTEkYdfmwI4SXYynj4jf/preview",
    359768: "https://drive.google.com/file/d/1OXyWQOqyfnHKHdc--AXfbfYh8CJWXq-B/preview",
    399456: "https://drive.google.com/file/d/1-5gTzL83W6mPlLz0MskxTzX2B8l1t5v1/preview"
};

const fpjGallery = document.getElementById("fpjGallery");

async function fetchFpjMovies() {
    try {
        const fpjRequests = FPJ_MOVIE_IDS.map(id =>
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
                .then(response => response.json())
        );

        const movies = await Promise.all(fpjRequests);

        movies.forEach(movie => {
            if (movie.poster_path) {
                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");
                movieCard.setAttribute("tabindex", "0");
                movieCard.setAttribute("role", "button");

                const year = (movie.release_date || "").slice(0, 4) || "—";

                movieCard.innerHTML = `
                    <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                    <span class="category-badge movie">Movie</span>
                    <span class="year-badge">${year}</span>
                    <div class="play-button"><i class="fa-solid fa-play"></i></div>
                `;
                
                movieCard.addEventListener("click", () => {
                    lastActiveCard = movieCard;
                    const fpjVideo = FPJ_VIDEOS[movie.id];
                    if (fpjVideo) {
                        MOVIE_VIDEOS[movie.id] = fpjVideo;
                    }
                    openModal(movie);
                });
                
                movieCard.addEventListener("focus", () => {
                    movieCard.scrollIntoView({ behavior: "smooth", block: "center" });
                });

                fpjGallery.appendChild(movieCard);
            }
        });
    } catch (error) {
        console.error("Error fetching FPJ movies:", error);
    }
}
fetchFpjMovies();

// FULLSCREEN BUTTONS
document.getElementById("fullscreenButton").addEventListener("click", function (e) {
    e.preventDefault();
    let iframe = document.getElementById("movieTrailer");
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(() => {});
    }
});

document.getElementById("tvFullscreenButton").addEventListener("click", function (e) {
    e.preventDefault();
    let iframe = document.getElementById("tvTrailer");
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(() => {});
    }
});

/* =========================================================
   NETPLEX NATIVE ANDROID TV ENGINE (CAPTURE PHASE)
========================================================= */
(function () {
    "use strict";

    function isElementVisible(el) {
        if (!el || el.offsetParent === null) return false;
        const style = window.getComputedStyle(el);
        if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            style.opacity === "0" ||
            style.pointerEvents === "none"
        ) {
            return false;
        }
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function getModalNavElements(openModal) {
        const closeBtn = openModal.querySelector('.close-btn, .close');
        const dropdown = openModal.querySelector('#episodeDropdown');
        const fullscreenBtn = openModal.querySelector('#fullscreenButton, #tvFullscreenButton');
        const playBtn = openModal.querySelector('.play-pause-btn');

        const elements = [];
        if (closeBtn && isElementVisible(closeBtn)) elements.push(closeBtn);
        if (dropdown && isElementVisible(dropdown)) elements.push(dropdown);
        if (fullscreenBtn && isElementVisible(fullscreenBtn)) elements.push(fullscreenBtn);
        if (playBtn && isElementVisible(playBtn)) elements.push(playBtn);

        return elements;
    }

    function getFocusableElements() {
        const selector = 'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
        return Array.from(document.querySelectorAll(selector))
            .filter(el => el.tagName !== "IFRAME" && !el.classList.contains("dpad-focus-guard"))
            .filter(isElementVisible);
    }

    function focusAndScroll(el, container) {
        if (!el) return;
        el.focus();
        if (container) {
            const rect = el.getBoundingClientRect();
            const cRect = container.getBoundingClientRect();
            if (rect.top < cRect.top || rect.bottom > cRect.bottom) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }

    function handleModalDpad(openModal, dir) {
        const items = getModalNavElements(openModal);
        if (!items.length) return;

        const container = openModal.querySelector('.modal-content');
        let active = document.activeElement;
        const closeBtn = openModal.querySelector('.close-btn, .close');
        const playBtn = openModal.querySelector('.play-pause-btn');
        const fullscreenBtn = openModal.querySelector('#fullscreenButton, #tvFullscreenButton');
        const dropdown = openModal.querySelector('#episodeDropdown');

        if (dir === "ArrowUp") {
            if (active === playBtn) {
                if (container && container.scrollTop > 80) {
                    container.scrollBy({ top: -250, behavior: "smooth" });
                } else if (fullscreenBtn) {
                    focusAndScroll(fullscreenBtn, container);
                }
            } else if (active === fullscreenBtn) {
                if (dropdown) {
                    focusAndScroll(dropdown, container);
                } else if (closeBtn) {
                    focusAndScroll(closeBtn, container);
                }
            } else if (active === dropdown) {
                if (closeBtn) {
                    focusAndScroll(closeBtn, container);
                }
            } else if (active === closeBtn) {
                if (container) {
                    container.scrollTo({ top: 0, behavior: "smooth" });
                }
            } else {
                if (playBtn) {
                    focusAndScroll(playBtn, container);
                }
            }
            return;
        }

        if (dir === "ArrowDown") {
            if (active === closeBtn) {
                if (dropdown) {
                    focusAndScroll(dropdown, container);
                } else if (fullscreenBtn) {
                    focusAndScroll(fullscreenBtn, container);
                } else if (playBtn) {
                    focusAndScroll(playBtn, container);
                }
            } else if (active === dropdown) {
                if (fullscreenBtn) {
                    focusAndScroll(fullscreenBtn, container);
                } else if (playBtn) {
                    focusAndScroll(playBtn, container);
                }
            } else if (active === fullscreenBtn) {
                if (playBtn) {
                    focusAndScroll(playBtn, container);
                }
            } else if (active === playBtn) {
                if (container) {
                    container.scrollBy({ top: 250, behavior: "smooth" });
                }
            } else {
                if (playBtn) {
                    focusAndScroll(playBtn, container);
                }
            }
            return;
        }

        if (dir === "ArrowRight" || dir === "ArrowLeft") {
            let index = items.indexOf(active);
            if (index === -1) {
                if (playBtn) focusAndScroll(playBtn, container);
                return;
            }
            let nextIndex = (dir === "ArrowRight")
                ? (index + 1) % items.length
                : (index - 1 + items.length) % items.length;
            focusAndScroll(items[nextIndex], container);
            return;
        }
    }

    function navigateSpatial(direction) {
        const focusables = getFocusableElements();
        let current = document.activeElement;

        if (!current || current === document.body || !focusables.includes(current)) {
            const firstTarget = focusables[0];
            if (firstTarget) firstTarget.focus();
            return;
        }

        const currentRect = current.getBoundingClientRect();
        const currentCenter = {
            x: currentRect.left + currentRect.width / 2,
            y: currentRect.top + currentRect.height / 2
        };

        let bestCandidate = null;
        let bestDistance = Infinity;

        focusables.forEach(candidate => {
            if (candidate === current) return;

            const rect = candidate.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };

            let isValid = false;

            if (direction === "ArrowRight" && center.x > currentCenter.x + 5) isValid = true;
            if (direction === "ArrowLeft" && center.x < currentCenter.x - 5) isValid = true;
            if (direction === "ArrowDown" && center.y > currentCenter.y + 5) isValid = true;
            if (direction === "ArrowUp" && center.y < currentCenter.y - 5) isValid = true;

            if (isValid) {
                const dx = center.x - currentCenter.x;
                const dy = center.y - currentCenter.y;

                let distance = (direction === "ArrowLeft" || direction === "ArrowRight")
                    ? Math.abs(dx) + (Math.abs(dy) * 2.5)
                    : Math.abs(dy) + (Math.abs(dx) * 0.8);

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestCandidate = candidate;
                }
            }
        });

        if (bestCandidate) {
            bestCandidate.focus();
            bestCandidate.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    window.addEventListener("keydown", function (e) {
        const code = e.keyCode || e.which;
        const key = e.key;

        const isOkKey = (
            key === "Enter" || key === "Select" || key === "OK" ||
            code === 13 || code === 23
        );

        const active = document.activeElement;
        const openModal = document.querySelector('.modal.show:not(#authModal)');
        const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");

        if (isOkKey) {
            if (active && active !== document.body && !isInput) {
                e.preventDefault();
                e.stopPropagation();
                active.click();
            }
            return;
        }

        let dir = null;
        if (key === "ArrowUp" || key === "Up" || code === 38 || code === 19) dir = "ArrowUp";
        if (key === "ArrowDown" || key === "Down" || code === 40 || code === 20) dir = "ArrowDown";
        if (key === "ArrowLeft" || key === "Left" || code === 37 || code === 21) dir = "ArrowLeft";
        if (key === "ArrowRight" || key === "Right" || code === 39 || code === 22) dir = "ArrowRight";

        if (dir) {
            if (openModal) {
                e.preventDefault();
                e.stopPropagation();
                handleModalDpad(openModal, dir);
                return;
            }

            if (isInput && (dir === "ArrowLeft" || dir === "ArrowRight")) {
                return;
            }

            if (active && active.tagName === "SELECT" && (dir === "ArrowUp" || dir === "ArrowDown")) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            navigateSpatial(dir);
            return;
        }

        const isBack = (
            key === "Escape" || key === "Back" || key === "GoBack" ||
            code === 27 || code === 4 || code === 461 || code === 10009
        );

        if (isBack) {
            const authModal = document.getElementById("authModal");
            if (authModal && authModal.classList.contains("show")) {
                e.preventDefault();
                e.stopPropagation();
                closeAuthModal();
                return;
            }

            if (movieModal && movieModal.classList.contains("show")) {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
                return;
            }

            if (tvModal && tvModal.classList.contains("show")) {
                e.preventDefault();
                e.stopPropagation();
                closeTvModal();
                return;
            }

            const activeDropdown = document.querySelector(".dropdown.active, .dropdown-content.active");
            if (activeDropdown) {
                e.preventDefault();
                e.stopPropagation();
                activeDropdown.classList.remove("active");
                return;
            }

            if (window.history.length > 1) {
                window.history.back();
            }
        }
    }, true);
})();
