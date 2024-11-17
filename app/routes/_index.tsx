import { FormEvent, useState } from "react";
import { Form, Outlet } from "@remix-run/react";

type Todo = {
  id: number;
  value: string;
  completed: boolean;
} 


function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  console.log(inputValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
  }

  return (
    <div>
      <h1>Todoリスト</h1>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <input type="submit" />
      </Form>
      <div>
        <ul>
          {todos.map((todo) => (
            <li></li>
          ))} 
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Index;

