import { Router } from 'express';
import jwt from 'jsonwebtoken';

export function orderRoutes({ orders, jwtSecret }) {
  const router = Router();
  router.use((req, res, next) => {
    const token = req.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
    try {
      const claims = jwt.verify(token, jwtSecret, {
        algorithms: ['HS256'], issuer: 'ban-sach-lab', audience: 'ban-sach-lab'
      });
      if (!/^[1-9]\d*$/.test(claims.sub)) throw new Error('Invalid subject');
      req.user = { id: Number(claims.sub) };
      next();
    } catch {
      res.status(401).json({ error: 'Authentication required' });
    }
  });
  router.get('/:id', (req, res) => {
    const order = orders.findOne({ id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  });
  return router;
}
