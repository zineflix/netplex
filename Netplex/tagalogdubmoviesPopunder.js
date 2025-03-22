let preloadedAdIframe;

document.addEventListener("DOMContentLoaded", function () {
    const movieModal = document.getElementById("movieModal");

    if (!movieModal) return;

    // Preload ad iframe hidden for faster display
    preloadedAdIframe = document.createElement("iframe");
    preloadedAdIframe.src = "https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5";
    preloadedAdIframe.style.display = "none";
    preloadedAdIframe.style.width = "0";
    preloadedAdIframe.style.height = "0";
    preloadedAdIframe.style.border = "none";
    document.body.appendChild(preloadedAdIframe);

    movieModal.addEventListener("click", function (event) {
        let movieId = getCurrentMovieId();
        if (!movieId) return;

        let lastPopunder = localStorage.getItem(`popunder_${movieId}`);
        let today = new Date().toISOString().split('T')[0];

        if (lastPopunder === today) {
            console.log("Popunder already triggered today for this movie.");
            return;
        }

        openPopupContainer();

        localStorage.setItem(`popunder_${movieId}`, today);
    });
});

function getCurrentMovieId() {
    let movieTitleElement = document.getElementById("movieTitle");
    return movieTitleElement ? movieTitleElement.textContent.trim() : null;
}

function openPopupContainer() {
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = 0;
    popup.style.left = 0;
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    popup.style.zIndex = 9999;
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "flex-start";

    const skipBtn = document.createElement("button");
    skipBtn.innerText = "Skip Ad";
    skipBtn.style.position = "absolute";
    skipBtn.style.top = "20px";
    skipBtn.style.right = "20px";
    skipBtn.style.padding = "10px 20px";
    skipBtn.style.fontSize = "18px";
    skipBtn.style.display = "none";
    skipBtn.style.cursor = "pointer";
    skipBtn.style.zIndex = 10000;
    skipBtn.onclick = () => {
        document.body.removeChild(popup);
        if (preloadedAdIframe) {
            preloadedAdIframe.remove();
            preloadedAdIframe = null;
            // Re-preload the iframe for next use
            preloadAdIframe();
        }
    };

    const countdown = document.createElement("div");
    countdown.style.color = "#fff";
    countdown.style.fontSize = "24px";
    countdown.style.marginTop = "60px";

    // Move preloaded iframe into popup if available
    if (preloadedAdIframe) {
        preloadedAdIframe.style.display = "block";
        preloadedAdIframe.style.width = "90%";
        preloadedAdIframe.style.height = "80%";
        preloadedAdIframe.style.border = "none";
    }

    popup.appendChild(skipBtn);
    popup.appendChild(countdown);
    popup.appendChild(preloadedAdIframe);
    document.body.appendChild(popup);

    let timer = 15; // Reduced countdown to 15 seconds
    countdown.innerText = `Loading ad... Please wait ${timer} seconds to Skip...`;
    const interval = setInterval(() => {
        timer--;
        countdown.innerText = `Loading ad... Please wait ${timer} seconds to Skip...`;
        if (timer <= 0) {
            clearInterval(interval);
            countdown.innerText = "You can skip now.";
            skipBtn.style.display = "block";
        }
    }, 1000);
}

function preloadAdIframe() {
    preloadedAdIframe = document.createElement("iframe");
    preloadedAdIframe.src = "https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5";
    preloadedAdIframe.style.display = "none";
    preloadedAdIframe.style.width = "0";
    preloadedAdIframe.style.height = "0";
    preloadedAdIframe.style.border = "none";
    document.body.appendChild(preloadedAdIframe);
}
