import { Form } from "@remix-run/react";

function Header() {
  return (
    <div>
      <h1>Todoリスト</h1>
      <Form method="POST">
        <input type="hidden" name="actionType" value="register" />
        <label>
          ユーザ登録
          <input type="text" name="register" />
        </label>
        <input type="submit" value="登録"/>
      </Form >
      <Form method="POST">
        <input type="hidden" name="actionType" value="search" />
        <label>
          ユーザー検索 
          <input type="text" name="search" />
        </label>
        <input type="submit" value="さがす" />
      </Form>
    </div>
  );
}

export default Header;
