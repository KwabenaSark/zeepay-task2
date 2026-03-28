/**
 * Dev-only: forwards /api/* to your Netlify API so the browser sees same-origin
 * requests to the Expo dev host (via this proxy) and avoids CORS.
 *
 * Production fix: add CORS on the API, e.g. Netlify `[[headers]]` for `/api/*`
 * with Access-Control-Allow-Origin (or use a Netlify Function that sets headers).
 */
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const TARGET =
  process.env.API_PROXY_TARGET || 'https://boisterous-sunshine-346924.netlify.app';
const PORT = Number(process.env.API_PROXY_PORT || 8787);

const app = express();
app.use(cors({ origin: true }));
// Express strips the `/api` mount from req.url, so `/api/stat` becomes `/stat` upstream.
// Rewrite back to `/api/...` so the Netlify app receives the correct path.
app.use(
  '/api',
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: (path) => `/api${path}`,
  })
);

app.listen(PORT, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`API proxy: http://127.0.0.1:${PORT}/api → ${TARGET}`);
});
