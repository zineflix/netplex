document.addEventListener("DOMContentLoaded", function () {
    observeUrlAndModalChanges(); // Detect dynamic content updates
    setupIframeClickListener(); // Setup listener for iframe clicks
});

function setupIframeClickListener() {
    let iframe = document.querySelector("iframe");
    if (!iframe) return;

    iframe.onload = function () {
        try {
            iframe.contentWindow.document.addEventListener("click", function () {
                triggerAdOnClick();
            });
        } catch (error) {
            console.warn("Cross-origin iframe detected. Using postMessage instead.");
            enablePostMessageListener(iframe);
        }
    };
}

function enablePostMessageListener(iframe) {
    window.addEventListener("message", function (event) {
        if (event.origin !== iframe.src) return;
        if (event.data === "iframe-clicked") {
            triggerAdOnClick();
        }
    });

    let script = document.createElement("script");
    script.innerHTML = `
        document.addEventListener("click", function () {
            window.parent.postMessage("iframe-clicked", "*");
        });
    `;

    iframe.onload = function () {
        try {
            iframe.contentWindow.document.body.appendChild(script);
        } catch (error) {
            console.warn("Cannot inject script due to cross-origin policy.");
        }
    };
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

// 🟢 Detects when URL changes (e.g., new movie/TV show opened)
function observeUrlAndModalChanges() {
    let lastUrl = location.href;

    setInterval(() => {
        let currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log("URL changed! Reapplying iframe click listener...");
            setupIframeClickListener();
            lastUrl = currentUrl;
        }
    }, 500);

    // 🔴 Also detect modal opens and reapply listener
    document.body.addEventListener("click", function (event) {
        if (event.target.matches(".modal-open")) {
            console.log("Modal opened! Reapplying iframe click listener...");
            setTimeout(() => {
                setupIframeClickListener();
            }, 500);
        }
    });
}
