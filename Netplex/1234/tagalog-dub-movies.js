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


// For Dropdown More Button Function Start
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");

    dropdown.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});
// For Dropdown More Button Function End


// FOR TAGALOG DUB MOVIE SECTION START //
const API_KEY = "a1e72fd93ed59f56e6332813b9f8dcae";
        const MOVIE_IDS = [
            18377, 597, 57627, 455714, 9470, 396535, 20453, 1001311, 11770, 41387, 16269, 57663, 
            53658, 570511, 200085, 433945, 184219, 11178, 15859, 158445, 851644, 9056, 10753, 
            11134, 9404, 11636, 52324, 58233, 219246, 
        ];
        const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
        const movieGallery = document.getElementById("movieGallery");
        const movieModal = document.getElementById("movieModal");
        const moviePoster = document.getElementById("moviePoster");
        const movieTitle = document.getElementById("movieTitle");
        const movieGenres = document.getElementById("movieGenres");
        const movieDescription = document.getElementById("movieDescription");
        const movieTrailer = document.getElementById("movieTrailer");

        // Custom video links for each movie
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

                movieCard.innerHTML = `
                    <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                    <div class="play-button">▶</div>
                `;
                movieCard.addEventListener("click", () => openModal(movie));
                movieGallery.appendChild(movieCard);

                // If URL contains a movie ID, open the modal automatically
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
    
    const videoUrl = MOVIE_VIDEOS[movie.id] || "https://www.youtube.com/embed/defaultVideo";
    movieTrailer.src = videoUrl;
    
    movieModal.classList.add("show");

    // Update the URL
    window.history.pushState({ type: "movie", id: movie.id }, "", `?movie=${movie.id}`);
}


function closeModal() {
    movieModal.classList.remove("show");
    movieTrailer.src = "";
    
    // Reset URL without refreshing
    window.history.pushState({}, "", window.location.pathname);
}

        // Close modal on outside click or Escape key
        window.addEventListener("click", event => {
            if (event.target === movieModal) closeModal();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeModal();
        });

        fetchMovies();
// FOR TAGALOG DUB MOVIE SECTION END //

// === FOR TV SHOW SECTION START === //
const TV_SHOW_IDS = [
    219246, // When Life Gives You Tangerines
    135238,  // Gyeongseong Creature
    117378, // Mouse
    43899, // The Bible
    68814, // Strong Woman Do Bong-Soon
    
    
];
const tvGallery = document.getElementById("tvGallery");
const tvModal = document.getElementById("tvModal");
const tvPoster = document.getElementById("tvPoster");
const tvTitle = document.getElementById("tvTitle");
const tvDescription = document.getElementById("tvDescription");
const tvTrailer = document.getElementById("tvTrailer");
const episodeDropdown = document.getElementById("episodeDropdown");

// Example structure for TV episodes streaming links:
const TV_EPISODES = {
    219246: {
        links: [
            "https://drive.google.com/file/d/1NYnmWLsps_4j3bxJflerFgbuooFkrLMI/preview",
            "https://drive.google.com/file/d/1DMLS5t3Vq2MwRF3zeNRvpNIFpDKYNZAS/preview",
            "https://drive.google.com/file/d/1MDbrNZz8N_Q1PBKxRbnZ4pGSWgERHP8k/preview",
            "https://drive.google.com/file/d/1sFFrEIApC25AzfjnXSDDV05K-W1-7Uoz/preview",
            "https://drive.google.com/file/d/12YOGBdgVYboi17jISnF4sHO4UvH97Svh/preview",
            "https://drive.google.com/file/d/149mnHaRLqBp3Xi28FcxrPV9BL5k2qqQo/preview",
            "https://drive.google.com/file/d/1aC6lA84DiI3uoqPLZK8GRuQfLDhORPF9/preview",
            "https://drive.google.com/file/d/1dAA0BrlHeS4aHqY0Yq1tkSJblMVyMgo5/preview",
            "https://drive.google.com/file/d/1WBh7QpvfHN2zGQ6VjV18_yickANOmMcW/preview",
        ],
        titles: [
            "Season 1 Episode 1",
            "Season 1 Episode 2",
            "Season 1 Episode 3",
            "Season 1 Episode 4",
            "Season 1 Episode 5",
            "Season 1 Episode 6",
            "Season 1 Episode 7",
            "Season 1 Episode 8",
            "Season 1 Episode 9 to 12",
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
            "https://drive.google.com/file/d/1fyEXiysUHcHZz2hsSLWWpRc2oxVgiEVS/preview",
            "https://drive.google.com/file/d/11dU7wkT6pRY0YR3Nd_Hv2PKyI4B_XGYi/preview",
            "https://drive.google.com/file/d/1kmaj_RV5tmZEQpvs_UkULdcJXbqZNAcd/preview",
            "https://drive.google.com/file/d/1rLDuViEVQfNF9NGOe6v_E5HOPVZ7wvwY/preview",
            "https://drive.google.com/file/d/1Dm1dL_VPeI_184iVhK-vE1KbbJsHra_b/preview",
            "https://drive.google.com/file/d/1aazMO8elC7248KYwOIbV-SR4YEUn3mMF/preview",
            "https://drive.google.com/file/d/1blNQ7TXK-bSgE54jDB0aSNi_fMTXFjc_/preview",
            "https://drive.google.com/file/d/1QSdgkFxeDjPmTtSoYwq4T_O5TT4R1stp/preview",
        ],
        titles: [
            "Season 1 Episode 1",
            "Season 1 Episode 2",
            "Season 1 Episode 3",
            "Season 1 Episode 4",
            "Season 1 Episode 5",
            "Season 1 Episode 6",
            "Season 1 Episode 7",
            "Season 1 Episode 8",
            "Season 1 Episode 9",
            "Season 1 Episode 10",
            "Season 2 Episode 1",
            "Season 2 Episode 2",
            "Season 2 Episode 3",
            "Season 2 Episode 4",
            "Season 2 Episode 5",
            "Season 2 Episode 6",
            "Season 2 Episode 7",
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
            "https://drive.google.com/file/d/1fwDAs9o3oxisXi17AfjgGDi84Ch9ELGi/preview",
            "https://drive.google.com/file/d/1g1iPf1-sOLY7KLZ4XnGQxhxL2jxXbPjs/preview",
            "https://drive.google.com/file/d/1g5QpVihX8vOFzvwjrJLxQJdkLUSwyEOF/preview",
        ],
        titles: [
            "Season 1 Episode 1",
            "Season 1 Episode 2",
            "Season 1 Episode 3",
            "Season 1 Episode 4",
            "Season 1 Episode 5",
            "Season 1 Episode 6",
            "Season 1 Episode 7",
            "Season 1 Episode 8",
            "Season 1 Episode 9",
            "Season 1 Episode 10",
            "Season 1 Episode 11",
            "Season 1 Episode 12",
            "Season 1 Episode 13",
            "Season 1 Episode 14",
            "Season 1 Episode 15",
            "Season 1 Episode 16",
            "Season 1 Episode 17",
            "Season 1 Episode 18",
            "Season 1 Episode 19",
            "Season 1 Episode 20",
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
            "Episode 1",
            "Episode 2",
            "SEpisode 3",
            "Episode 4",
            "Episode 5",
            "Episode 6",
            "Episode 7",
            "Episode 8",
            "Episode 9",
            "Episode 10",
        ]
    },
    // Add more shows with episode links similarly
    68814: {
        links: [
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
            "#",
        ],
        titles: [
            "Episode 1",
            "Episode 2",
            "Episode 3",
            "Episode 4",
            "Episode 5",
            "Episode 6",
            "Episode 7",
            "Episode 8",
            "Episode 9",
            "Episode 10",
            "Episode 11",
            "Episode 12",
            "Episode 13",
            "Episode 14",
            "Episode 15",
            "Episode 16",
        ]
    },
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

                showCard.innerHTML = `
                    <img src="${IMAGE_BASE_URL}${show.poster_path}" alt="${show.name}">
                    <div class="play-button">▶</div>
                `;
                showCard.addEventListener("click", () => openTvModal(show));
                tvGallery.appendChild(showCard);

                // If URL contains a TV ID, open the modal automatically
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
    if (episodesInfo) {
        episodesInfo.links.forEach((link, index) => {
            const option = document.createElement("option");
            const epTitle = episodesInfo.titles ? episodesInfo.titles[index] : `Episode ${index + 1}`;
            option.value = link;
            option.textContent = epTitle;
            episodeDropdown.appendChild(option);
        });

        tvTrailer.src = episodesInfo.links[0];

        episodeDropdown.addEventListener("change", (e) => {
            tvTrailer.src = e.target.value;
        });
    } else {
        tvTrailer.src = "https://www.youtube.com/embed/defaultVideo";
    }

    tvModal.classList.add("show");

    // Update the URL
    window.history.pushState({ type: "tv", id: show.id }, "", `?tv=${show.id}`);
}


function closeTvModal() {
    tvModal.classList.remove("show");
    tvTrailer.src = "";

    // Reset URL without refreshing
    window.history.pushState({}, "", window.location.pathname);
}

window.addEventListener("click", event => {
    if (event.target === tvModal) closeTvModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeTvModal();
});

fetchTvShows();
// === FOR TV SHOW SECTION END === //



// Fullscreen Button Movie Start //
document.getElementById("fullscreenButton").addEventListener("click", function () {
    let iframe = document.getElementById("movieTrailer");

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
    // Rotate the screen to landscape mode (Only works on mobile browsers)
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(error => console.log("Orientation lock failed:", error));
    }
});
// Fullscreen Button Movie End //

// Fullscreen Button for TV Trailer Start //
document.getElementById("tvFullscreenButton").addEventListener("click", function () {
    let iframe = document.getElementById("tvTrailer");

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
    // Rotate the screen to landscape mode (Only works on mobile browsers)
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(error => console.log("Orientation lock failed:", error));
    }
});
// Fullscreen Button for TV Trailer End //


