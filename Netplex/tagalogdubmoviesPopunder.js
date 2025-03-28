document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal");
    const movieOverlay = document.getElementById("movieOverlay");
    const tvOverlay = document.getElementById("tvOverlay");

    if (movieModal) {
        movieModal.addEventListener("click", function () {
            handleAdTrigger("movie");
        });
    }

    if (tvShowModal) {
        tvShowModal.addEventListener("click", function () {
            handleAdTrigger("tv");
        });
    }

    // Overlay click triggers the ad
    if (movieOverlay) {
        movieOverlay.addEventListener("click", function (event) {
            event.stopPropagation();
            handleAdTrigger("movie");
        });
    }

    if (tvOverlay) {
        tvOverlay.addEventListener("click", function (event) {
            event.stopPropagation();
            handleAdTrigger("tv");
        });
    }
});

function handleAdTrigger(type) {
    let contentId = getCurrentContentId(type);
    if (!contentId) return;

    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);
    let today = new Date().toISOString().split('T')[0];

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for this ${type}.`);
        return;
    }

    // Open popunder ad
    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

    // Store the trigger date
    localStorage.setItem(`popunder_${type}_${contentId}`, today);

    // Hide the overlay after triggering the ad
    let overlay = document.getElementById(type === "movie" ? "movieOverlay" : "tvOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

function getCurrentContentId(type) {
    let titleElement = document.getElementById(type === "movie" ? "movieTitle" : "tvTitle");
    return titleElement ? titleElement.textContent.trim() : null;
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
    if (popunder) {
        popunder.blur();
        window.focus();
    }
}
