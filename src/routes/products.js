import { Router } from 'express';

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

export function productRoutes() {
  const router = Router();
  router.get('/api/products', (_req, res) => res.json([
    { id: 1, title: 'Clean Code', price: 250000 },
    { id: 2, title: 'Refactoring', price: 320000 }
  ]));
  router.get('/preview/echo', (req, res) => {
    const message = String(req.query.message ?? 'Book preview');
    res.type('html');
    return res.send('<h1>Book preview</h1><p>' + escapeHtml(message) + '</p>');
  });
  return router;
}
