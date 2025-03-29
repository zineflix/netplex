document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal");
    const movieOverlay = document.getElementById("movieOverlay");
    const tvOverlay = document.getElementById("tvOverlay");

    // Reset overlay states if a new day starts
    resetDailyOverlays();

    // Hide overlays if ad was already triggered today for this content
    hideOverlayIfAdTriggered("movie", movieOverlay);
    hideOverlayIfAdTriggered("tv", tvOverlay);

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
        console.log(`Popunder already triggered today for ${type}: ${contentId}`);
        return;
    }

    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
    localStorage.setItem(`popunder_${type}_${contentId}`, today);
    localStorage.setItem(`overlay_hidden_${type}_${contentId}`, "true"); // Keep overlay hidden after refresh

    if (overlay) {
        overlay.style.display = "none";
    }
}

function hideOverlayIfAdTriggered(type, overlay) {
    let contentId = getCurrentContentId(type);
    if (!contentId || !overlay) return;

    let today = new Date().toISOString().split('T')[0];
    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);
    let overlayHidden = localStorage.getItem(`overlay_hidden_${type}_${contentId}`);
    
    // Ensure the overlay only hides when modal is opened
    let modal = document.getElementById(type === "movie" ? "movieModal" : "tvModal");
    
    if ((lastPopunder === today || overlayHidden === "true") && modal.classList.contains("active")) {
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none";  // Ensure clicks go through
} else {
    overlay.style.display = "block";
    overlay.style.pointerEvents = "auto";
}

}


// Reset overlay states daily
function resetDailyOverlays() {
    let today = new Date().toISOString().split('T')[0];
    let lastReset = localStorage.getItem("overlay_last_reset");

    if (lastReset !== today) {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("overlay_hidden_") || key.startsWith("popunder_")) {
                localStorage.removeItem(key);
            }
        });
        localStorage.setItem("overlay_last_reset", today);
    }
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

let isAdTriggered = false;

function handleAdTrigger(type, overlay) {
    if (isAdTriggered) return; // Prevent multiple triggers
    isAdTriggered = true;

    setTimeout(() => {
        isAdTriggered = false; // Reset after short delay
    }, 500);

    let contentId = getCurrentContentId(type);
    if (!contentId) return;

    let today = new Date().toISOString().split('T')[0];
    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for ${type}: ${contentId}`);
        return;
    }

    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
    localStorage.setItem(`popunder_${type}_${contentId}`, today);
    localStorage.setItem(`overlay_hidden_${type}_${contentId}`, "true");

    if (overlay) {
        overlay.style.display = "none";
        overlay.style.pointerEvents = "none"; // Ensure it doesn't block interactions
    }
}
