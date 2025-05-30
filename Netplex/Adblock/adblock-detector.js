function showAdblockPopup() {
  document.body.innerHTML = '';
  const overlay = document.getElementById('adblock-overlay');
  if (overlay) {
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
  } else {
    alert("Ad Blocker Detected. Please disable it and refresh the page.");
  }
}

function adblockDetected() {
  setTimeout(showAdblockPopup, 100);
}

function runAdblockCheck() {
  const bait1 = document.createElement('div');
  bait1.className = 'adsbox';
  bait1.style.cssText = 'width:1px;height:1px;position:absolute;top:-1000px;';

  const bait2 = document.createElement('div');
  bait2.className = 'ad-banner';
  bait2.style.cssText = 'width:1px;height:1px;position:absolute;top:-1000px;';

  const bait3 = document.createElement('div');
  bait3.id = 'sponsored-link';
  bait3.style.cssText = 'width:1px;height:1px;position:absolute;top:-1000px;';

  document.body.append(bait1, bait2, bait3);

  fetch("https://example.com/ad.js", { method: "HEAD", mode: "no-cors" })
    .then(() => {
      setTimeout(() => {
        const hidden = [bait1, bait2, bait3].some(el => el.offsetHeight === 0 || getComputedStyle(el).display === 'none');
        bait1.remove(); bait2.remove(); bait3.remove();
        if (hidden) adblockDetected();
      }, 100);
    })
    .catch(() => {
      bait1.remove(); bait2.remove(); bait3.remove();
      adblockDetected();
    });
}

document.addEventListener("DOMContentLoaded", runAdblockCheck);
