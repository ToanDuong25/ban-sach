import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createApp } from '../src/app.js';
import jwt from 'jsonwebtoken';

const jwtSecret = randomBytes(48).toString('base64url');
const password = randomBytes(24).toString('base64url');
let server, base;
before(async () => {
  const app = createApp({ jwtSecret, demoPassword: password });
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
});
const login = (username, suppliedPassword = password) => fetch(`${base}/api/auth/login`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ username, password: suppliedPassword })
});

test('login accepts a demo user and rejects an SQL injection login', async () => {
  assert.equal((await login('alice')).status, 200);
  assert.equal((await login('alice', 'wrong')).status, 401);
  assert.equal((await login("alice' OR 1=1 --", 'wrong')).status, 401);
});

test('preview escapes reflected HTML input', async () => {
  const input = '<img src=x onerror=alert(1)>';
  const response = await fetch(`${base}/preview/echo?message=${encodeURIComponent(input)}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.ok(html.includes('&lt;img'));
  assert.ok(!html.includes(input));
});

test('downloads allow catalog and reject traversal to the synthetic private file', async () => {
  const catalog = await fetch(`${base}/api/files/download?name=catalog.txt`);
  assert.equal(catalog.status, 200);
  assert.match(await catalog.text(), /Clean Code/);
  const traversal = await fetch(`${base}/api/files/download?name=..%2Fprivate%2Fcanary.txt`);
  assert.equal(traversal.status, 400);
  assert.ok(!(await traversal.text()).includes('SYNTHETIC-PRIVATE-CANARY'));
});

test('orders require a JWT and prevent access to another user order', async () => {
  assert.equal((await fetch(`${base}/api/orders/1`)).status, 401);
  const { token } = await (await login('alice')).json();
  const headers = { authorization: `Bearer ${token}` };
  const own = await fetch(`${base}/api/orders/1`, { headers });
  assert.equal(own.status, 200);
  assert.equal((await own.json()).title, 'Clean Code');
  assert.equal((await fetch(`${base}/api/orders/2`, { headers })).status, 404);
});

test('JWT signing uses the configured environment secret', async () => {
  assert.throws(() => createApp({ jwtSecret: '', demoPassword: password }), /JWT_SECRET/);
  const { token } = await (await login('alice')).json();
  const claims = jwt.verify(token, jwtSecret, {
    algorithms: ['HS256'], issuer: 'ban-sach-lab', audience: 'ban-sach-lab'
  });
  assert.equal(claims.sub, '1');
  assert.throws(() => jwt.verify(token, randomBytes(48).toString('base64url')));
});
