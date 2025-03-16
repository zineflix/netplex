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
            11134, 9404, 11636, 52324, 58233,
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
            18377: "https://short.icu/mMFEhpYrX",
            597: "https://short.icu/GRLGWepBh",
            57627: "https://short.icu/OYN0PwNIr",
            455714: "https://short.icu/6gHYKfSkg",
            9470: "https://short.icu/XoTnMZi8e",
            396535: "https://short.icu/LqFDAWPgr",
            20453: "https://short.icu/UcOXhP3kE",
            1001311: "https://drive.google.com/file/d/18nb0r8cIjLF17bCYo0gf6R35En1laH9R/preview",
            11770: "https://short.icu/9WQZkbpvM",
            41387: "https://short.icu/Vs4-n_xYk",
            16269: "https://short.icu/f3PqFTBwx",
            57663: "https://short.icu/9eWDFK1_b",
            53658: "https://short.icu/NyUhbCXeM",
            570511: "https://short.icu/huzd-YP-7",
            200085: "https://short.icu/zoXWX72TZ",
            433945: "https://short.icu/isDXfa25J",
            184219: "https://short.icu/XPzzoD2vJ",
            11178: "https://short.icu/YgRYrtWSR",
            15859: "https://short.icu/nCTdrm_azG",
            158445: "https://short.icu/38tub1wQA",
            851644: "https://short.icu/T4YN2WXat",
            9056: "https://short.icu/LyAD42eIb",
            10753: "https://short.icu/9kRkCQp1V",
            11134: "https://short.icu/mAo8J7sVwG",
            9404: "https://short.icu/dQgJ64N1S",
            11636: "https://short.icu/b4IONWrDS",
            52324: "https://short.icu/q0qYQCjXX",
            58233: "//ok.ru/videoembed/9643975313998?nochat=1",
        };

        async function fetchMovies() {
            try {
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

            // Get unique video link for the movie
            const videoUrl = MOVIE_VIDEOS[movie.id] || "https://www.youtube.com/embed/defaultVideo";

            // Set the iframe source
            movieTrailer.src = videoUrl;

            // Show the modal
            movieModal.classList.add("show");
        }

        function closeModal() {
            movieModal.classList.remove("show");
            movieTrailer.src = ""; // Stop video playback
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

// Fullscreen Button Start //
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
// Fullscreen Button End //
