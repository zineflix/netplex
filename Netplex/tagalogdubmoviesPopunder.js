document.addEventListener("DOMContentLoaded", function () {
    setupPopunder("movieTrailer", "movieTitle");
    setupPopunder("tvTrailer", "tvTitle");
});

function setupPopunder(iframeId, titleId) {
    const iframe = document.getElementById(iframeId);
    if (!iframe) return;

    iframe.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents bubbling issues

        let contentId = getContentId(titleId);
        if (!contentId) return;

        let lastPopunder = localStorage.getItem(`popunder_${contentId}`);
        let today = new Date().toISOString().split('T')[0];

        if (lastPopunder === today) {
            console.log(`Popunder already triggered today for ${titleId}.`);
            return;
        }

        // Open popunder in the background
        openPopunderInBackground("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");

        // Store the trigger date
        localStorage.setItem(`popunder_${contentId}`, today);
    });
}

function getContentId(titleId) {
    let titleElement = document.getElementById(titleId);
    return titleElement ? titleElement.textContent.trim() : null;
}

function openPopunderInBackground(url) {
    let a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.style.display = "none";
    document.body.appendChild(a);

    let event = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
    a.dispatchEvent(event);
    document.body.removeChild(a);
}
