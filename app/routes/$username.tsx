import { ActionFunctionArgs } from '@remix-run/node';
import { Form, json, useLoaderData } from '@remix-run/react';

export const loader = async ({ request }) => {
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
    <div>
      <Form method="POST">
        <input type="hidden" name="userid" value={userid} />
        <label>
          タスクを追加
          <input type="text" name="task" />
        </label>
        <input type="submit" value="追加" />
      </Form>
      <ul>
        {(tasks.data.id !== 0) && tasks.data.map((e) => (
          <li key={e.id}>{e.task}</li>
        ))}
      </ul>
    </div>
  )
}

export default Todos 
