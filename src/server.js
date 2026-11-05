import { createApp } from './app.js';

const port = Number(process.env.PORT || 3100);
const host = process.env.HOST || '127.0.0.1';
createApp({ jwtSecret: process.env.JWT_SECRET, demoPassword: process.env.DEMO_PASSWORD })
  .listen(port, host, () => console.log(`Bookstore lab listening on http://${host}:${port}`));
