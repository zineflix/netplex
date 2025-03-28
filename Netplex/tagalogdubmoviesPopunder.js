document.addEventListener("DOMContentLoaded", function () {
    const movieIframe = document.querySelector("#movieModal iframe");
    const tvIframe = document.querySelector("#tvModal iframe");

    if (movieIframe) {
        attachPlayListener(movieIframe, "movie");
    }

    if (tvIframe) {
        attachPlayListener(tvIframe, "tv");
    }
});

function attachPlayListener(iframe, type) {
    iframe.addEventListener("load", function () {
        let iframeWindow = iframe.contentWindow || iframe;
        iframeWindow.addEventListener("playing", function () {
            handleAdTrigger(type);
        }, true);
    });
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
