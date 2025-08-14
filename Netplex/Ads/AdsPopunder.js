const popunderUrl = "https://suburban-anxiety.com/b.3lVU0WPm3TpTvib/mgVKJ_ZXDk0R2/N-Twk/xsN/zCkWwgL/TkYX1_OhTUES3QOKTjEP"; // Replace with your actual direct link
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



