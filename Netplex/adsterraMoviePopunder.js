let adShown = false; // to show only once, remove if you want multiple triggers

  document.addEventListener('click', (e) => {
    if (!adShown && !e.target.closest('#adContainer')) {
      adShown = true;
      showAdPopup('https://beddingfetched.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5', 5); // change to your ad link and seconds
    }
  });

  function showAdPopup(adUrl, countdownSeconds) {
    document.getElementById('adIframe').src = adUrl;
    document.getElementById('adContainer').style.display = 'flex';
    let timeLeft = countdownSeconds;
    document.getElementById('timeLeft').innerText = timeLeft;
    document.getElementById('skipBtn').style.display = 'none';
    document.getElementById('countdown').style.display = 'block';

    const timer = setInterval(() => {
      timeLeft--;
      document.getElementById('timeLeft').innerText = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('skipBtn').style.display = 'block';
      }
    }, 1000);
  }

  function closeAd() {
    document.getElementById('adContainer').style.display = 'none';
    document.getElementById('adIframe').src = '';
  }
