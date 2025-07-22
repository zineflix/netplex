const popunderUrl = "https://veneeringanguishwhipped.com/yjq7ifj8w?key=4de5ae928742e8b8e44764a15993a110"; // Replace with your actual direct link

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
