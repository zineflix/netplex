// adsterra-container.js
const adContainer = document.querySelector('.ads-row');

const adSources = [
  "https://www.profitableratecpm.com/vzyrnaz7zc?key=391b4a1582450f14e319d72f64c7cc3c",
  "https://www.profitableratecpm.com/rft89532?key=c6c77823af757f93e17bbfa7ebad2639",
  "https://www.profitableratecpm.com/a7mm18sw6?key=79442492f5fe436b0bc2484d9d0a8660",
  "https://www.profitableratecpm.com/y9x32b69?key=e34ce979bf4d0e0b4a7bc7a637034e73"
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
