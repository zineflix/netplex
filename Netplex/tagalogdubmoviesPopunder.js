document.addEventListener("DOMContentLoaded", function () {
    applyOverlayListeners();
    observeUrlAndModalChanges();
});

function applyOverlayListeners() {
    document.querySelectorAll(".iframe-overlay").forEach(overlay => {
        overlay.removeEventListener("click", overlayClickHandler); // Prevent duplicates
        overlay.addEventListener("click", overlayClickHandler);
    });
}

function overlayClickHandler(event) {
    event.preventDefault(); // Prevent unwanted propagation

    let overlay = event.currentTarget;
    overlay.style.display = "none"; // Hide the overlay so iframe gets direct clicks

    triggerAdOnClick(); // Call function to handle ad popunder
}

function triggerAdOnClick() {
    let contentId = getContentIdFromUrl();
    if (!contentId) return;

    let lastPopunder = localStorage.getItem(`popunder_movie_${contentId}`);
    let today = new Date().toISOString().split("T")[0];

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for movie ID: ${contentId}`);
        return;
    }

    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

    localStorage.setItem(`popunder_movie_${contentId}`, today);
}

function getContentIdFromUrl() {
    let params = new URLSearchParams(window.location.search);
    return params.get("movie") || params.get("tv") || null;
}

function openPopunder(url) {
    let popunder = window.open(url, "_blank", "width=100,height=100,left=9999,top=9999");
    if (popunder) {
        setTimeout(() => {
            popunder.blur();
            window.focus();
        }, 500);
    }
}

// 🟢 Detects when URL changes or modal opens
function observeUrlAndModalChanges() {
    let lastUrl = location.href;

    setInterval(() => {
        let currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log("URL changed! Reapplying overlay...");
            applyOverlayListeners(); // Reset overlay for new content
            lastUrl = currentUrl;
        }
    }, 500);

    document.body.addEventListener("click", function (event) {
        if (event.target.matches(".modal-open")) {
            console.log("Modal opened! Reapplying overlay...");
            setTimeout(() => {
                applyOverlayListeners();
            }, 500);
        }
    });
}
