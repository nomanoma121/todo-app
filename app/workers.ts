import { Hono } from "hono";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const app = new Hono();

//TODO:エラーハンドリングを全くやっていないのでやる


app.get("/api/get", async (c: any) => {
  const table = await c.req.query("table");
  try {
    const result = await c.env.DB.prepare(`SELECT * FROM ${table}`).all();
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
  return c.json({ message: "User not found"}, 404);
});

//usernameからuseridを取得し、taskを取得する
app.get("/api/tasks", async (c: any) => {
  const username: string = await c.req.query("name");

  try {
    // ユーザーidを取得
    const userResult = await c.env.DB.prepare("SELECT id FROM users WHERE name = ?").bind(username).first();
    const userid = userResult.id;
    // ユーザーidをもとにタスクを取得
    const result = await c.env.DB.prepare("SELECT * FROM tasks WHERE userid = ?").bind(userid).all();
    //タスクが一つもない場合はuseridを渡す
    if ( result.results.length == 0 ) {
      return c.json({ "id": 0, "userid": userid });
    }

    return c.json(result.results);
  } catch {
    console.log("Internal Server Error.");
    return c.json({ message: "Internal Server Error."}, 500);
  }
});

//タスクを追加
app.post("/api/add", async (c: any) => {
  const param = await c.req.json();
  try {
    await c.env.DB.prepare(
      "INSERT INTO tasks (userid, task, completed) VALUES (?, ?, ?)"
    ).bind(param.userid, param.task, param.completed).run();

    return c.json({ message: "Successfully added" });
  } catch (error) {
    return c.json({ message: "Internal Server Error."});
 }
});

//completedを変更
app.put("/api/edit/:id", async(c: any) => {
  const id = c.req.param("id");

  const param = await c.req.json();
  //completedの値を反転させる
  const completed = param.completed ? 1 : 0;
  console.log(param);
  
  try {
    await c.env.DB.prepare(
      "UPDATE tasks SET completed = ? WHERE id = ?" 
    ).bind(completed, id).run();

    return c.json({ message: "Successfully edited" });
  } catch (err) {
    console.log(err);
    return c.json({ message: "Internal Server Error." });
  }
});

//タスクを削除
app.delete("/api/delete/:id", async(c:any) => {
  const id = c.req.param("id");
  
  try {
    await c.env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
    return c.json({ message: "Successfully deleted" });
  } catch (err) {
    return c.json({ message: "Internal Server Error" });
  }
});

export default app;
