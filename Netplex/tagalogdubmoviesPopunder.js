document.addEventListener("DOMContentLoaded", function () {
    applyOverlayListeners(); // Apply initially
    observeUrlAndModalChanges(); // Detect new content dynamically
});

function applyOverlayListeners() {
    document.querySelectorAll(".iframe-overlay").forEach(overlay => {
        overlay.removeEventListener("click", overlayClickHandler); // Prevent duplicate events
        overlay.addEventListener("click", overlayClickHandler);
        overlay.style.display = "block"; // Ensure overlay is visible for new content
    });

    document.querySelectorAll("video, .video-player").forEach(video => {
        video.removeEventListener("click", videoClickHandler);
        video.addEventListener("click", videoClickHandler);
    });
}

function overlayClickHandler() {
    this.style.display = "none"; // Hide only the clicked overlay
}

function videoClickHandler() {
    let contentId = getContentIdFromUrl();
    if (!contentId) return;

    handleAdTrigger("movie"); // Trigger popunder when user clicks video
    document.querySelectorAll(".iframe-overlay").forEach(overlay => {
        overlay.style.display = "none"; // Hide overlay when clicking video
    });
}

function handleAdTrigger(type) {
    let contentId = getContentIdFromUrl();
    if (!contentId) return;

    let lastPopunder = localStorage.getItem(`popunder_${type}_${contentId}`);
    let today = new Date().toISOString().split('T')[0];

    if (lastPopunder === today) {
        console.log(`Popunder already triggered today for ${type} ID: ${contentId}`);
        return;
    }

    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

    localStorage.setItem(`popunder_${type}_${contentId}`, today);
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

// 🟢 Detects when URL changes (e.g., new movie/TV show opened)
function observeUrlAndModalChanges() {
    let lastUrl = location.href;

    setInterval(() => {
        let currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log("URL changed! Reapplying overlay and popunder...");
            applyOverlayListeners(); // Ensure overlay appears for new content
            lastUrl = currentUrl; // Update last URL to prevent duplicate triggers
        }
    }, 500);
}
