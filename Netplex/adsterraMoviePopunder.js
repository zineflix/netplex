document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true });
});

function triggerPopunder() {
    const movieId = getMovieIdFromURL();
    if (!movieId) return;

    const today = new Date().toISOString().split("T")[0];
    const savedData = JSON.parse(localStorage.getItem("popunderData")) || {};

    if (savedData[movieId] === today) return;

    localStorage.setItem("popunderData", JSON.stringify({ ...savedData, [movieId]: today }));

    openPopupContainer("https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5");
}

function openPopupContainer(url) {
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
    skipBtn.onclick = () => document.body.removeChild(popup);

    const countdown = document.createElement("div");
    countdown.style.color = "#fff";
    countdown.style.fontSize = "24px";
    countdown.style.marginTop = "60px";

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.width = "90%";
    iframe.style.height = "80%";
    iframe.style.border = "none";

    let adLoadedAndVisible = false;

    iframe.onload = () => {
        adLoadedAndVisible = true;
    };

    popup.appendChild(skipBtn);
    popup.appendChild(countdown);
    popup.appendChild(iframe);
    document.body.appendChild(popup);

    let timer = 20; // 20-second countdown
    countdown.innerText = `Loading ad... Please wait ${timer} seconds to Skip...`;

    const interval = setInterval(() => {
        timer--;
        if (skipBtn.style.display !== "block") {
            countdown.innerText = `Loading ad... Please wait ${timer} seconds to Skip...`;
        }
        if ((timer <= 0 || adLoadedAndVisible) && skipBtn.style.display !== "block") {
            clearInterval(interval);
            countdown.innerText = "You can skip now.";
            skipBtn.style.display = "block";
        }
    }, 1000);
}

function getMovieIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("movie_id");
}
