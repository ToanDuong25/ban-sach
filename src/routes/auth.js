import { Router } from 'express';
import jwt from 'jsonwebtoken';

export function authRoutes({ db, passwordHash, jwtSecret }) {
  const router = Router();
  const signingSecret = jwtSecret;
  router.post('/login', (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string' ||
        username.length > 200 || password.length > 200) {
      return res.status(400).json({ error: 'Invalid credentials format' });
    }
    const hash = passwordHash(password);
    const user = db.query('SELECT id, username FROM users WHERE username = ? AND password_hash = ?', [username, hash]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: String(user.id) }, signingSecret, {
      algorithm: 'HS256', expiresIn: '15m', issuer: 'ban-sach-lab', audience: 'ban-sach-lab'
    });
    return res.json({ token, user: { id: user.id, username: user.username } });
  });
  return router;
}
