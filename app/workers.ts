import { Hono } from "hono";

const app = new Hono();

app.get("/api/get", async (c: any) => {
  try {
    const result = await c.env.DB.prepare("SELECT * FROM users").all();
    return c.json(result);
  } catch (err) {
    return c.json({ error: "データ取得エラー" });
  }
});

app.post("/api/post", async (c: any) => {
  const param = await c.req.json();
  try {
    await c.env.DB.prepare(`INSERT INTO users (name) VALUES (?)`).bind(param.name).run();
    return c.json({ message: "Successfully created." });
  } catch (err) {
    return c.json({ error: "データ挿入エラー" });
  }
});

app.post("/api/register", async (c: any) => {
  const username = await c.req.json();
  console.log(username);

  c.env.DB.prepare('INSERT INTO users (name) VALUES (?)').bind(username).run();
  return c.text('User registered successfully');
});

app.post("/api/search", async (c: any) => {
  console.log("searching...");
  const username = await c.req.json();

  const result = await c.env.DB.prepare(`SELECT * FROM users WHERE name = ?`).bind(username).all();
  if (result.results.length > 0) {
    return c.json(result.results[0]);
  }
  return c.text("User not found", 404);
});

export default app;
