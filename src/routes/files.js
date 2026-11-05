import { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const downloadRoot = fileURLToPath(new URL('../../data/downloads/', import.meta.url));

export function fileRoutes() {
  const router = Router();
  router.get('/download', (req, res, next) => {
    const name = req.query.name;
    if (typeof name !== 'string' || !/^[a-zA-Z0-9_-]+\.txt$/.test(name)) {
      return res.status(400).json({ error: 'Invalid file name' });
    }
    const target = path.resolve(downloadRoot, name);
    return res.sendFile(target, { dotfiles: 'allow' }, error => {
      if (error && !res.headersSent) next(error);
    });
  });
  return router;
}
