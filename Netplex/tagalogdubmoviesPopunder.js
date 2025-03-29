document.addEventListener("DOMContentLoaded", function () {
    applyOverlayListeners(); // Initial call when page loads
    observeContentChanges(); // Observe changes dynamically
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

    // Open popunder ad
    openPopunder("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

    // Store the trigger date per content ID
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

function observeContentChanges() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = function () {
        console.log("Content changed! Reapplying overlay listeners...");
        applyOverlayListeners();
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}
