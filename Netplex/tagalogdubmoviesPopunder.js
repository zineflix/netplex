document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal");
    const movieOverlay = document.getElementById("movieOverlay");
    const tvOverlay = document.getElementById("tvOverlay");

    // Check and hide overlays if ad was already triggered today
    checkOverlayVisibility("movie", movieOverlay);
    checkOverlayVisibility("tv", tvOverlay);

    // Add event listeners only if elements exist
    if (movieModal) {
        movieModal.addEventListener("click", () => handleAdTrigger("movie", movieOverlay));
    }
    if (tvShowModal) {
        tvShowModal.addEventListener("click", () => handleAdTrigger("tv", tvOverlay));
    }
    if (movieOverlay) {
        movieOverlay.addEventListener("click", (event) => {
            event.stopPropagation();
            handleAdTrigger("movie", movieOverlay);
        });
    }
    if (tvOverlay) {
        tvOverlay.addEventListener("click", (event) => {
            event.stopPropagation();
            handleAdTrigger("tv", tvOverlay);
        });
    }
});

function handleAdTrigger(type, overlay) {
    let contentId = getCurrentContentId(type);
    if (!contentId) return;

    let today = new Date().toISOString().split('T')[0];
    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for this ${type}.`);
        return;
    }

    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
    localStorage.setItem(`popunder_${type}_${contentId}`, today);

    if (overlay) {
        overlay.style.display = "none";
    }
}

function checkOverlayVisibility(type, overlay) {
    let contentId = getCurrentContentId(type);
    if (!contentId || !overlay) return;

    let today = new Date().toISOString().split('T')[0];
    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);

    overlay.style.display = lastPopunder === today ? "none" : "block";
}

function getCurrentContentId(type) {
    let titleElement = document.getElementById(type === "movie" ? "movieTitle" : "tvTitle");
    return titleElement && titleElement.textContent.trim() ? titleElement.textContent.trim() : "default_id";
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
    if (popunder) {
        popunder.blur();
        window.focus();
    } else {
        console.warn("Popunder blocked by browser.");
    }
}
