// ===== CSS INJECTION =====
const style = document.createElement("style");
style.textContent = `
  .ads-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin: 20px auto;
    max-width: 1200px;
  }

  .responsive-iframe-container {
    flex: 1 1 calc(25% - 20px);
    height: 150px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-width: 200px;
  }

  @media (max-width: 991px) {
    .responsive-iframe-container {
      flex: 1 1 calc(50% - 20px);
    }
  }

  @media (max-width: 480px) {
    .responsive-iframe-container {
      flex: 1 1 100%;
    }
  }
`;
document.head.appendChild(style);

// ===== LINK ROTATION LOGIC =====
const adLinks = [
  "https://raptripeessentially.com/rft89532?key=c6c77823af757f93e17bbfa7ebad2639",
  "https://raptripeessentially.com/rft89532?key=c6c77823af757f93e17bbfa7ebad2639",
  "https://raptripeessentially.com/a7mm18sw6?key=79442492f5fe436b0bc2484d9d0a8660",
  "https://raptripeessentially.com/y9x32b69?key=e34ce979bf4d0e0b4a7bc7a637034e73"
];

// Select one random link
const selectedUrl = adLinks[Math.floor(Math.random() * adLinks.length)];

// Apply selected link to all iframes
document.querySelectorAll('.responsive-iframe-container iframe').forEach(iframe => {
  iframe.src = selectedUrl;
});
