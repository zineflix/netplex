const express = require('express');
const fetch = require('node-fetch'); // or global fetch in newer Node.js
const app = express();
const PORT = 3000;

app.get('/proxy', async (req, res) => {
  const targetUrl = 'https://establishscarcely.com/s95r30t1n?key=37511c0ed4a09d8981528da2aa7dcff7';

  try {
    const response = await fetch(targetUrl);
    const body = await response.text();
    res.set('Content-Type', 'text/html');
    res.send(body);
  } catch (err) {
    res.status(500).send('Error fetching remote content.');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}/proxy`);
});
