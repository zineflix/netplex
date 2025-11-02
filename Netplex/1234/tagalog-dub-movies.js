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
            11134, 9404, 11636, 52324, 58233, 219246, 1269208, 75612, 811646,
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
            1269208: "https://drive.google.com/file/d/1fbECy9qUZg1Jc-21EReRWk3rZzr82Ahk/preview",
			75612: "https://drive.google.com/file/d/1JS4jt9FXtjS0zuIE9Wruzq5kX6DC9ABf/preview",
			811646: "https://drive.google.com/file/d/1--IpZfNaFtjyOCvqLdXDoUMN_I1IS-cg/preview",
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
    119051, // Wednesday (2022)
	66776, // Love O2O (2016)
	255779, // Bet (2025)
	112836, // Money Heist: Korea - Joint Economic Area (2022)
	99966, // All of Us Are Dead (2022)
    
    
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
            "https://drive.google.com/file/d/1s6427sNEcXzPMt3hmNgeexsaSBa-djRz/preview",
            "https://drive.google.com/file/d/1DTLgO_bGTlWKjpWGDVuzaew-vbQp70y4/preview",
            "https://drive.google.com/file/d/1fLy8sx7t2asaFxjSv-QngLgnBRdmfiE8/preview",
            "https://drive.google.com/file/d/1oHUqZK4GzE688f7CBLRXKKYz6467rD3h/preview",
            "https://drive.google.com/file/d/1_JfcBppcElSapyxwH-zD4QkiADLiESgt/preview",
            "https://drive.google.com/file/d/1FVx-47Ysrh03tpk0rjScxhZUbz2SZWNM/preview",
            "https://drive.google.com/file/d/1f-QqJiNFCh1P8p8l0r_eSQR1bUEoCYvN/preview",
            "https://drive.google.com/file/d/1exb6Gb-vvqY0r8Ky52yAvdNC-C5w6LJc/preview",
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
            "Season 1 Episode 1",
            "Season 1 Episode 2",
            "Season 1 Episode 3",
            "Season 1 Episode 4",
            "Season 1 Episode 5",
            "Season 1 Episode 6",
            "Season 1 Episode 7",
            "Season 1 Episode 8",
            "Season 2 Episode 1",
            "Season 2 Episode 2",
            "Season 2 Episode 3",
            "Season 2 Episode 4",
            "Season 2 Episode 5(Soon)",
            "Season 2 Episode 6(Soon)",
            "Season 2 Episode 7(Soon)",
            "Season 2 Episode 8(Soon)",
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
            "https://drive.google.com/file/d/1-H92eL74dwnuiRXX5DiAmhMrFr6FHR1E/preview",
            "https://drive.google.com/file/d/1-IsbCqatIo8BP2EhfdeoIVBsq4UUEspH/preview",
            "https://drive.google.com/file/d/1-T6tVfDPAvaL8DXCzEpnJM2kjZKdFZS-/preview",
            "https://drive.google.com/file/d/1-FCILrQER3CyXSZo61kHIPlQNJH_c7dR/preview",
            "https://drive.google.com/file/d/1-Ijg-EhcwfQAfFHCUlq3vQw-KAR2AeR3/preview",
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
            "Season 1 Episode 21",
            "Season 1 Episode 22",
            "Season 1 Episode 23",
            "Season 1 Episode 24",
            "Season 1 Episode 25",
            "Season 1 Episode 26",
            "Season 1 Episode 27",
            "Season 1 Episode 28",
            "Season 1 Episode 29",
            "Season 1 Episode 30",

        ]
    },
	255779: {
        links: [
            "https://drive.google.com/file/d/1x0NS3sTlKPOMvcP6Q3cG8bLEKHs1ftwZ/preview",
            "https://drive.google.com/file/d/1RFqv0aIBby4VQTJTm0na1T5Wca1_7Y0-/preview",
            "https://drive.google.com/file/d/1mRmIRjcTwWygak6eBVVr7l3sgUTUGTU8/preview",
            "https://drive.google.com/file/d/1-FHnc386YHty9p38FuRjj-hh_E8zQ41g/preview",
            "https://drive.google.com/file/d/1FLIAUPIn0W8u4lRUlDrRoGLWoQHT-x-F/preview",
            "https://drive.google.com/file/d/1y1-aAzIEhoxqxh-e2dE6MfVgo9gVrNHq/preview",
            "https://drive.google.com/file/d/114aSwH2ASll2yrRKjYOB1WgyVbGGz6N2/preview",
            "https://drive.google.com/file/d/1JSN0tFkx6Bl7gHD1bnDZBhykwnfQ6BLs/preview",
            "https://drive.google.com/file/d/1RHCTXC6qBq-pKSTGKW4eVssQtoxHfn_t/preview",
            "https://drive.google.com/file/d/1KYL-Wb36Tds4FNMwBo-9cRCExBLZX0sV/preview",

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

        ]
    },
	112836: {
        links: [
            "https://drive.google.com/file/d/11TOlTDkI9uYVKSe_9Y8NgbSk8LAqpjKQ/preview",
            "https://drive.google.com/file/d/12bEqQWr3TUFBzHIpptuPGXfjav0fPegw/preview",
            "https://drive.google.com/file/d/13CpN0ntYbkNvFXMLAyFpqFukO_3bUwot/preview",
            "https://drive.google.com/file/d/15JKQxizL1nX1Ln19IS5mS3vq5Me-af_M/preview",
            "https://drive.google.com/file/d/15M4LdTGUsLg9IZFJmcT7M1RZuSDzi0NL/preview",
            "https://drive.google.com/file/d/16rw3CcGgtHgArkiQHFubrR_qTFjxHw9q/preview",

        ],
        titles: [
            "Episode 1",
            "Episode 2",
            "Episode 3",
            "Episode 4",
            "Episode 5",
            "Episode 6",

        ]
    },
	99966: {
        links: [
            "https://drive.google.com/file/d/1hnGgota30kTY-zkCDIHCtMJYw2N3zs7S/preview",
            "https://drive.google.com/file/d/19pbUbtlY1G3iXRoo6HqFeB3pX9upBLzb/preview",
            "https://drive.google.com/file/d/1kaX-ElIJsxSuyK2PppTzbvKTsobJ0XDw/preview",
            "https://drive.google.com/file/d/1uOWoICat8RN1agGwsBzpV4VMpi0fKMnF/preview",
            "https://drive.google.com/file/d/15gJCABlOhDs9NSU7AbUeTAxNCNZob_9e/preview",
            "https://drive.google.com/file/d/1wSii8PV69wSOuoxwfrR12_T06lO8EX8G/preview",
	   	    "https://drive.google.com/file/d/1MDXwjrOitwKTj_82PonRwl5FWbLj9TyT/preview",
	        "https://drive.google.com/file/d/1ActvH4O60sZb5DGdVKxa5pLgdGkl-vqr/preview",
	        "https://drive.google.com/file/d/1Arw292ynbzrnYoS_m5FR3kMYtxWNMRTt/preview",
	        "https://drive.google.com/file/d/1u6ONazARwEfU1LjzFJ1nAjoYXQckMpLm/preview",
	        "https://drive.google.com/file/d/1ZcIP0EAGRkFr5TTSrLno8i9RDzIQm_RE/preview",
	        "https://drive.google.com/file/d/1lIbFNZGdvnHxxCvOJC365zFexkXke6dp/preview",
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


