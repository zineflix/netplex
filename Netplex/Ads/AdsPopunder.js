const popunderUrl = "https://www.effectivegatecpm.com/rft89532?key=c6c77823af757f93e17bbfa7ebad2639"; // your single popunder link

function openPopunder() {
  // ✅ Calculate 50% of the user's screen
  const width = window.screen.availWidth / 2;
  const height = window.screen.availHeight / 2;

  // ✅ Center position
  const left = (window.screen.availWidth - width) / 2;
  const top = (window.screen.availHeight - height) / 2;

  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

  let popunder = window.open(popunderUrl, '_blank', features);

  if (popunder) {
    popunder.blur();
    window.focus();
    try {
      popunder.opener.window.focus();
    } catch (e) {}
  }
}

// ✅ Open only once per reload (on first click)
function handleUserClick() {
  openPopunder();
  document.removeEventListener('click', handleUserClick);
}

document.addEventListener('click', handleUserClick);
