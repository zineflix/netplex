(function () {
  // 1. Create and inject modal HTML + CSS
  const style = document.createElement('style');
  style.textContent = `
    #adblock-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
    }

    #adblock-popup {
      background: #1e1e1e;
      color: #f0f0f0;
      padding: 30px;
      border-radius: 12px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
      border: 1px solid #444;
    }

    #adblock-popup h2 {
      color: #ff4d4d;
      margin-bottom: 15px;
    }

    #adblock-popup button {
      margin-top: 20px;
      padding: 10px 24px;
      background: #ff4d4d;
      color: #fff;
      font-weight: bold;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    #adblock-popup button:hover {
      background: #e03e3e;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'adblock-overlay';
  overlay.innerHTML = `
    <div id="adblock-popup">
      <h2>Ad Blocker Detected</h2>
      <p>This site is ad-supported. Please disable your ad blocker to access the content.</p>
      <button onclick="location.reload()">I've Disabled It, Refresh</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // 2. Show popup function
  function showAdblockPopup() {
    document.body.innerHTML = ''; // clear site content
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
  }

  // 3. Run detection logic
  function detectAdblock() {
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

    // Check via network + style hiding
    fetch("https://example.com/ad.js", { method: "HEAD", mode: "no-cors" })
      .then(() => {
        setTimeout(() => {
          const hidden = [bait1, bait2, bait3].some(el => el.offsetHeight === 0 || getComputedStyle(el).display === 'none');
          bait1.remove(); bait2.remove(); bait3.remove();
          if (hidden) showAdblockPopup();
        }, 100);
      })
      .catch(() => {
        bait1.remove(); bait2.remove(); bait3.remove();
        showAdblockPopup();
      });
  }

  // 4. Start detection when DOM is ready
  document.addEventListener('DOMContentLoaded', detectAdblock);
})();
