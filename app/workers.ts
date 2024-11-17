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

export default app;
