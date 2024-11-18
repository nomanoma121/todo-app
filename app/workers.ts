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
    await c.env.DB.prepare(`INSERT INTO users (name) VALUES (?)`)
      .bind(param.name)
      .run();
    return c.json({ message: "Successfully created." });
  } catch (err) {
    return c.json({ error: "データ挿入エラー" });
  }
});

//ユーザー登録
app.post("/api/register", async (c: any) => {
  const username = await c.req.json();
  console.log(username);

  c.env.DB.prepare("INSERT INTO users (name) VALUES (?)").bind(username).run();
  return c.text("User registered successfully");
});

//ユーザー検索
app.get("/api/search", async (c: any) => {
  const username: string = c.req.query("name");

  const result = await c.env.DB.prepare(`SELECT * FROM users WHERE name = ?`)
    .bind(username)
    .all();
  if (result.results.length > 0) {
    return c.json(result.results[0]);
  }
  return c.text("User not found", 404);
});

//usernameからuseridを取得し、taskを取得する
app.get("/api/tasks", async (c: any) => {
  const username: string = c.req.query("name");

  const userid: number = await c.env.DB.prepare(
    "SELECT id FROM users WHERE name = ?"
  )
    .bind(username)
    .catch(() => {
      return c.json({ message: "User not found. " }, 404);
    });

  type tasksResult = {
    id: number;
    userid: number;
    task: string;
    completed: boolean;
  };

  const result: tasksResult[] | [] = await c.env.DB.prepare(
    "SELECT * FROM tasks WHERE userid = ?"
  )
    .bind(userid)
    .all()
    .catch(() => {
      return c.json({ message: "Internal server error." }, 500);
    });

    return c.json(result);
});

//タスクを追加
app.post("/api/add", async (c: any) => {
  const param = c.req.json();

  c.env.DB.prepare(
    "INSERT INTO tasks (userid, tasks, completed) VALUE (?, ?, ?)"
  ).bind(param.userid, param.tasks, param.completed);

  return c.json({ message: "Successfully added" });
});

export default app;
