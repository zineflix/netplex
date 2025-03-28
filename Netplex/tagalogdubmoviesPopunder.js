document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");
    const tvShowModal = document.getElementById("tvModal");

    if (movieModal) {
        movieModal.addEventListener("click", function () {
            createAdOverlay("movie");
        });
    }

    if (tvShowModal) {
        tvShowModal.addEventListener("click", function () {
            createAdOverlay("tv");
        });
    }
});

function createAdOverlay(type) {
    const iframeContainer = document.getElementById(type === "movie" ? "movieIframeContainer" : "tvIframeContainer");
    if (!iframeContainer) return;

    let adOverlay = document.createElement("div");
    adOverlay.id = "adOverlay";
    adOverlay.style.position = "absolute";
    adOverlay.style.top = "0";
    adOverlay.style.left = "0";
    adOverlay.style.width = "100%";
    adOverlay.style.height = "100%";
    adOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    adOverlay.style.color = "#fff";
    adOverlay.style.display = "flex";
    adOverlay.style.justifyContent = "center";
    adOverlay.style.alignItems = "center";
    adOverlay.style.zIndex = "1000";
    adOverlay.style.cursor = "pointer";
    adOverlay.innerHTML = "Click to Continue to Video";
    
    adOverlay.addEventListener("click", function () {
        handleAdTrigger(type);
        adOverlay.remove(); // Remove overlay after click
    });

    iframeContainer.appendChild(adOverlay);
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

    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
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
