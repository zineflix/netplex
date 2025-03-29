document.addEventListener("DOMContentLoaded", function () {
    applyOverlayListeners(); // Apply initially
    observeUrlChanges(); // Watch for URL changes dynamically
});

function applyOverlayListeners() {
    document.querySelectorAll(".iframe-overlay").forEach(overlay => {
        overlay.removeEventListener("click", overlayClickHandler); // Prevent duplicate events
        overlay.addEventListener("click", overlayClickHandler);
    });
}

function overlayClickHandler() {
    let contentId = getContentIdFromUrl();
    if (!contentId) return;

    this.style.display = "none"; // Hide only the clicked overlay
    handleAdTrigger("movie"); // Trigger popunder per content dynamically
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

// 🟢 Watch for URL changes to detect new content without refreshing
function observeUrlChanges() {
    let lastUrl = location.href;

    setInterval(() => {
        let currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log("URL changed! Reapplying overlay listeners...");
            applyOverlayListeners();
            lastUrl = currentUrl; // Update last URL to prevent duplicate triggers
        }
    }, 500); // Check URL every 500ms (adjust if needed)
}
