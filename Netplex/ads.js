// ads.js
const adContainer = document.querySelector('.ads-row');

const adSources = [
  "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5",
  "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5",
  "https://beddingfetched.com/xfeh17rkn?key=7ede7876efcc5a81490997f5911d84d5"
];

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
