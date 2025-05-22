const adContainer = document.querySelector('.ads-row');

const adSources = [
  "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5",
  "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5",
  "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5"
];

function loadAds() {
  // Clear previous ads
  adContainer.innerHTML = '';

  adSources.forEach(src => {
    const wrapper = document.createElement("div");
    wrapper.className = "responsive-iframe-container";

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.border = "none";
    iframe.loading = "lazy";

    wrapper.appendChild(iframe);
    adContainer.appendChild(wrapper);
  });
}

// Initial load
loadAds();

// Reload ads every 30 minutes (30 * 60 * 1000 ms)
setInterval(loadAds, 30 * 60 * 1000);
