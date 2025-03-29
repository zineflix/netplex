document.addEventListener("DOMContentLoaded", function () {
    applyOverlayListeners(); // Apply initially
    observeContentChanges(); // Watch for changes (e.g., when modal opens)
    observeModalClose(); // Detect when modal is closed
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

// 🟢 Watches for new content (e.g., when a new modal opens)
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

// 🔴 Detects when modal is closed and re-applies overlay handling
function observeModalClose() {
    document.querySelectorAll(".modal-close").forEach(closeBtn => {
        closeBtn.addEventListener("click", function () {
            setTimeout(() => {
                console.log("Modal closed! Reapplying overlay listeners...");
                applyOverlayListeners();
            }, 500); // Small delay to allow modal to fully close
        });
    });
}
