const popunderUrl = "https://featuregangster.com/ripsc9by2?key=94df3d2e2fa685eca2ea06a261270804"; // Replace with your actual direct link
let lastPopTime = 0;

function openPopunder() {
  const now = Date.now();
  const timeSinceLast = now - lastPopTime;

  // Only allow a new popunder if 60 seconds have passed
  if (timeSinceLast >= 60000) {
    const features = "width=200,height=150,left=9999,top=9999";
    let popunder = window.open(popunderUrl, '_blank', features);

    if (popunder) {
      popunder.blur();
      window.focus();
      try {
        popunder.opener.window.focus();
      } catch (e) {}
    }

    lastPopTime = now;
  }
}

function handleUserClick() {
  openPopunder();
}

document.addEventListener('click', handleUserClick);










