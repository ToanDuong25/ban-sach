import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync } from 'node:crypto';

export function createDatabase(demoPassword) {
  const database = new DatabaseSync(':memory:');
  const salt = randomBytes(32);
  const passwordHash = password => scryptSync(password, salt, 64).toString('hex');
  database.exec(`
    CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password_hash TEXT);
    CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, total INTEGER);
    INSERT INTO orders VALUES (1, 1, 'Clean Code', 250000), (2, 2, 'Refactoring', 320000);
  `);
  const insert = database.prepare('INSERT INTO users VALUES (?, ?, ?)');
  insert.run(1, 'alice', passwordHash(demoPassword));
  insert.run(2, 'bob', passwordHash(demoPassword));
  const db = { query: (sql, parameters = []) => database.prepare(sql).get(...parameters) };
  const orders = {
    findOne: ({ id, userId }) => userId === undefined
      ? database.prepare('SELECT id, user_id, title, total FROM orders WHERE id = ?').get(id)
      : database.prepare('SELECT id, user_id, title, total FROM orders WHERE id = ? AND user_id = ?').get(id, userId)
  };
  return { db, orders, passwordHash };
}
