document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal");
    const movieOverlay = document.getElementById("movieOverlay");
    const tvOverlay = document.getElementById("tvOverlay");

    // Check and hide overlays if ad was already triggered today
    checkOverlayVisibility("movie", movieOverlay);
    checkOverlayVisibility("tv", tvOverlay);

    if (movieModal) {
        movieModal.addEventListener("click", function () {
            handleAdTrigger("movie", movieOverlay);
        });
    }

    if (tvShowModal) {
        tvShowModal.addEventListener("click", function () {
            handleAdTrigger("tv", tvOverlay);
        });
    }

    if (movieOverlay) {
        movieOverlay.addEventListener("click", function (event) {
            event.stopPropagation();
            handleAdTrigger("movie", movieOverlay);
        });
    }

    if (tvOverlay) {
        tvOverlay.addEventListener("click", function (event) {
            event.stopPropagation();
            handleAdTrigger("tv", tvOverlay);
        });
    }
});

function handleAdTrigger(type, overlay) {
    let contentId = getCurrentContentId(type);
    if (!contentId) return;

    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);
    let today = new Date().toISOString().split('T')[0];

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for this ${type}.`);
        return;
    }

    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

    // Store the trigger date
    localStorage.setItem(`popunder_${type}_${contentId}`, today);

    // Hide overlay after triggering ad
    if (overlay) {
        overlay.style.display = "none";
    }
}

function checkOverlayVisibility(type, overlay) {
    let contentId = getCurrentContentId(type);
    if (!contentId) return;

    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);
    let today = new Date().toISOString().split('T')[0];

    if (lastPopunder === today && overlay) {
        overlay.style.display = "none"; // Hide overlay if ad was triggered today
    } else if (overlay) {
        overlay.style.display = "block"; // Show overlay if it's a new day
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
