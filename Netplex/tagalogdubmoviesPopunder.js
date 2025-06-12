document.addEventListener("DOMContentLoaded", function () {
    applyOverlayListeners(); // Apply initially
    observeUrlAndModalChanges(); // Detect dynamic content updates
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

    openPopunder("https://preoccupyray.com/wi0ysdhc?key=255bd01e810de84ae6fd6404001fb5e3");

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
            console.log("URL changed! Reapplying overlay popunder...");
            applyOverlayListeners();
            handleAdTrigger("movie"); // Ensure new content gets its own popunder
            lastUrl = currentUrl; // Update last URL to prevent duplicate triggers
        }
    }, 500); // Check URL every 500ms (adjust if needed)

    // 🔴 Also detect modal opens and reapply overlay
    document.body.addEventListener("click", function (event) {
        if (event.target.matches(".modal-open")) {
            console.log("Modal opened! Reapplying overlay popunder...");
            setTimeout(() => {
                applyOverlayListeners();
                handleAdTrigger("movie"); // Ensure popunder works for new content
            }, 500); // Small delay to allow modal content to load
        }
    });
}
