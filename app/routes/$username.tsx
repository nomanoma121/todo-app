import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import "../styles/username.css";
import { useEffect, useState } from "react";

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
    const checkbox = formData.get("checkbox");
    const completed = (checkbox === "on") ? 1 : 0;
    const response = await fetch(`http://localhost:8787/api/edit/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: completed })
    });
  } else if (method === "DELETE") {
    const taskId = formData.get("id");
    const response = await fetch(`http://localhost:8787/api/delete/${taskId}`,{ method: "DELETE" });
  }
  return null;
};

function Todos() {
  const tasks = useLoaderData<typeof loader>();
  const [taskInput, setTaskInput] = useState("");
  const [copyTask, setCopyTask] = useState("");
  const userid = tasks.data.id !== 0 ? tasks.data[0].userid : tasks.data.userid;
  
  useEffect(() => {
    setCopyTask(taskInput);
  }, [taskInput]);

  return (
    <div className="todos-container">
      <Form method="POST" className="add-task-form">
        <input type="hidden" name="_method" value="POST" />
        <input type="hidden" name="userid" value={userid} />
        <input type="hidden" name="task" value={copyTask} />
        <label className="task-label">
          タスクを追加:
          <input
            type="text"
            name="task"
            className="task-input"
            placeholder="新しいタスクを入力"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
        </label>
        <button type="submit" className="add-button" onClick={() => setTaskInput("")}>
          追加
        </button>
      </Form>
      <ul className="task-list">
        {tasks.data.id !== 0 &&
          tasks.data.map((task) => (
            <li key={task.id} className="task-item">
              <Form method="POST">
                <input type="hidden" name="_method" value="PUT" />
                <input type="hidden" name="id" value={task.id} />
                <input
                  type="checkbox"
                  name="checkbox"
                  checked={task.completed}
                  onClick={(e) => e.target.form.submit()}
                  readOnly
                />
                  <span className="task-text">{task.task}</span>
              </Form>
              <Form method="POST">
                <input type="hidden" name="_method" value="DELETE" />
                <input type="hidden" name="id" value={task.id} />
                <button type="submit" className="delete-button">削除</button>
              </Form>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Todos;
