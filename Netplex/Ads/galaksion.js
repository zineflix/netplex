// Create a new <script> element
const scriptElement = document.createElement('script');

// Set the script's source to the external URL
scriptElement.src = "//xn.ariledreinfer.com/rQx3ZYA6wM2gva/122481";

// Set additional attributes (async and data-cfasync)
scriptElement.async = true;
scriptElement.setAttribute('data-cfasync', 'false');

// Error handling to log if the script fails to load
scriptElement.onerror = function () {
    console.error('Failed to load the external script.');
};

// Append the script to the document's body (or head)
document.body.appendChild(scriptElement);

// Optionally, you can add a success callback after the script is loaded
scriptElement.onload = function () {
    console.log('External script loaded successfully.');
};
