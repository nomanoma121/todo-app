import { Hono } from 'hono';
import { Env } from './env';  // Envインターフェース

const app = new Hono();

app.get('/', async (c) => {
  const items = await c.env.DB.prepare('SELECT * FROM items').all();
  return c.json(items);
});

app.post('/add-item', async (c) => {
  const { name } = await c.req.json();
  const result = await c.env.DB.prepare('INSERT INTO items(name) VALUES (?) RETURNING *').bind(name).first();
  return c.json(result);
});

export default app;
