import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, useLoaderData } from '@remix-run/react';
import styles from "../styles/username.css";

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const loader = async ({ request }:LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const username = url.pathname.replace(/^\/+/, '');
  const response = await fetch(`http://localhost:8787/api/tasks?name=${username}`);
  const data = await response.json();
  return json({data});
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userid = formData.get("userid");
  const task = formData.get("task");
  const response = await fetch("http://localhost:8787/api/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"userid": userid, "task": task, "completed": 0}),
  });

  if (response.ok) {
    console.log("タスク追加に成功しました");
  }
  return null;
}

function Todos() {
  const tasks = useLoaderData<typeof loader>();
  const userid = tasks.data.id !== 0 ? tasks.data[0].userid : tasks.data.userid;
  console.log(tasks.data);
  return (
    <div className="todos-container">
      <Form method="POST" className="add-task-form">
        <input type="hidden" name="userid" value={userid} />
        <label className="task-label">
          タスクを追加:
          <input type="text" name="task" className="task-input" placeholder="新しいタスクを入力" />
        </label>
        <button type="submit" className="add-button">追加</button>
      </Form>
      <ul className="task-list">
        {(tasks.data.id !== 0) &&
          tasks.data.map((e: any) => (
            <li key={e.id} className="task-item">
              <span className="task-text">{e.task}</span>
              <button className="edit-button">編集</button>
              <button className="delete-button">削除</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Todos;

