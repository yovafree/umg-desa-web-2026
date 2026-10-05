const express = require('express');

const app = express();
// App Service injects PORT; locally we fall back to 3000
const port = process.env.PORT || 3000;
const site = process.env.WEBSITE_SITE_NAME || 'localhost';

app.get('/', (req, res) => {
  res.send(`
    <main style="font-family: system-ui; max-width: 640px; margin: 4rem auto;">
      <h1>Hello from ${site} 👋 - Versión 2</h1>
      <p>This Express app is running on <strong>Azure App Service</strong> (PaaS).</p>
      <p>No VM, no Nginx, no OS patching. Try <a href="/api/health">/api/health</a>.</p>
    </main>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    site,
    node: process.version,
    instance: process.env.WEBSITE_INSTANCE_ID || 'local',
    time: new Date().toISOString()
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
