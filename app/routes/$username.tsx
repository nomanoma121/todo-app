import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import "../styles/username.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "/styles/username.css",
    },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const username = url.pathname.replace(/^\/+/, "");
  const response = await fetch(
    `http://localhost:8787/api/tasks?name=${username}`
  );
  const data = await response.json();
  return json({ data });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const method = formData.get("_method");

  if (method === "POST") {
    const userid = formData.get("userid");
    const task = formData.get("task");
    const response = await fetch("http://localhost:8787/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: userid, task: task, completed: 0 }),
    });

    if (response.ok) {
      console.log("タスク追加に成功しました");
    }
  } else if (method === "PUT") {
    const taskId = formData.get("id");
    const task = formData.get("task");
    const completed = formData.get("checkbox");
    const response = await fetch(`http://localhost:8787/api/edit/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: task, completed: completed}),
    });
    
    if (response.ok) {
      console.log("タスクの編集に成功しました。");
    }
  } else if (method === "DELETE") {
    const taskId = formData.get("id");
    const response = await fetch(`http://localhost:8787/api/delete/${taskId}`,{ method: "DELETE" });
  }


  return null;
};

function Todos() {
  const tasks = useLoaderData<typeof loader>();
  const userid = tasks.data.id !== 0 ? tasks.data[0].userid : tasks.data.userid;
  console.log(tasks.data);
  return (
    <div className="todos-container">
      <Form method="POST" className="add-task-form">
        <input type="hidden" name="_method" value="POST" />
        <input type="hidden" name="userid" value={userid} />
        <label className="task-label">
          タスクを追加:
          <input
            type="text"
            name="task"
            className="task-input"
            placeholder="新しいタスクを入力"
          />
        </label>
        <button type="submit" className="add-button">
          追加
        </button>
      </Form>
      <ul className="task-list">
        {tasks.data.id !== 0 &&
          tasks.data.map((e: any) => (
            <li key={e.id} className="task-item">
              <Form method="POST">
                <input type="hidden" name="_method" value="PUT" />
                <input type="hidden" name="id" value={e.id} />
                <input type="checkbox" name="checkbox" value={e.completed} />
                {/* valueの中身を一時的に消している */}
                <input type="textarea" name="task" className="task-text" value={e.task} readOnly />
                <button type="submit" className="edit-button">編集</button>
              </Form>
              <Form method="POST">
                <input type="hidden" name="_method" value="DELETE" />
                <input type="hidden" name="id" value={e.id} />
                <button type="submit" className="delete-button">削除</button>
              </Form>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Todos;
