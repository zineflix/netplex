(const popunderUrl = "https://preoccupyray.com/xd85svczxx?key=5616a1fff848a3cb7920a6b47a4958fc"; // Replace with your actual direct link

function openPopunder() {
  const features = "width=1,height=1,left=9999,top=9999";
  let popunder = window.open(popunderUrl, '_blank', features);

  if (popunder) {
    popunder.blur();
    window.focus();
    try {
      popunder.opener.window.focus();
    } catch (e) {}
  }
}

function initPopunderOnInteraction() {
  openPopunder();
  setInterval(openPopunder, 60000); // Every 60 seconds
  document.removeEventListener('click', initPopunderOnInteraction);
}

document.addEventListener('click', initPopunderOnInteraction);
