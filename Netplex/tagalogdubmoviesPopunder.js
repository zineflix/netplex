document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal");

    if (movieModal) {
        movieModal.addEventListener("click", function (event) {
            handleModalClick(event, "movie");
        });
    }

    if (tvShowModal) {
        tvShowModal.addEventListener("click", function (event) {
            handleModalClick(event, "tv");
        });
    }

    addClickOverlay("movieTrailer", "movie");
    addClickOverlay("tvTrailer", "tv");
});

function handleModalClick(event, type) {
    const modal = type === "movie" ? document.getElementById("movieModal") : document.getElementById("tvModal");
    if (event.target === modal || modal.contains(event.target)) {
        handleAdTrigger(type);
    }
}

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

function addClickOverlay(iframeId, type) {
    const iframe = document.getElementById(iframeId);
    if (!iframe) return;

    // Create overlay div
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "transparent"; // Invisible
    overlay.style.zIndex = "10";
    overlay.style.cursor = "pointer"; 

    // Append overlay to the parent container
    const parent = iframe.parentElement;
    parent.style.position = "relative"; // Ensure correct placement
    parent.appendChild(overlay);

    overlay.addEventListener("click", function () {
        handleAdTrigger(type);
        setTimeout(() => overlay.remove(), 500); // Remove after click to allow video interaction
    });
}
