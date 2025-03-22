let preloadedAdIframe;

document.addEventListener("DOMContentLoaded", function () {
    // Preload the ad iframe in the background for faster loading
    preloadedAdIframe = document.createElement("iframe");
    preloadedAdIframe.src = "https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5";
    preloadedAdIframe.style.display = "none";
    preloadedAdIframe.style.width = "0";
    preloadedAdIframe.style.height = "0";
    preloadedAdIframe.style.border = "none";
    document.body.appendChild(preloadedAdIframe);

    // Wait for user interaction
    document.addEventListener("click", function () {
        triggerPopunder();
    }, { once: true });
});

function triggerPopunder() {
    const tvShowId = getTvShowIdFromURL();
    if (!tvShowId) return;

    const today = new Date().toISOString().split("T")[0];
    const savedData = JSON.parse(localStorage.getItem("popunderData")) || {};

    if (savedData[tvShowId] === today) return; // Already triggered today

    localStorage.setItem("popunderData", JSON.stringify({ ...savedData, [tvShowId]: today }));

    openPopupContainer();
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
        // Reset and remove the preloaded iframe so it can preload again if needed
        if (preloadedAdIframe) {
            preloadedAdIframe.remove();
            preloadedAdIframe = null;
        }
    };

    const countdown = document.createElement("div");
    countdown.style.color = "#fff";
    countdown.style.fontSize = "24px";
    countdown.style.marginTop = "60px";

    // Use the preloaded iframe and make it visible
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

    let timer = 10; // Reduced countdown to 10 seconds for faster skip
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

function getTvShowIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}
