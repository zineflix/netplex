(const popunderUrl = "https://boredomcuff.com/k3f2mnd5nf?key=5b3642b3df8de5a4268e2002a5af413d"; // Replace with your actual direct link

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
