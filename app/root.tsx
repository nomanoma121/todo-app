import { Links, Meta, Scripts, Outlet, redirect } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import Header from "./Header";

//Header.tsxからPOST
export const action = async ({ request }: ActionFunctionArgs ) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const registername = formData.get("register");
  const searchname = formData.get("search");

  if (actionType == "register") {
    const response = await fetch("http://localhost:8787/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registername),
    });

    if (response.ok) {
      console.log("ユーザー登録に成功しました。");
    }
  }

  if (actionType == "search") {
    const response = await fetch("http://localhost:8787/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchname),
    });
    const data = await response.json();

    if(response.ok){
      console.log(data);
      return redirect(`/${data.name}`);
    }
  }
  return null;
};

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main>
          <Outlet />
        </main>
        <Scripts />
      </body>
    </html>
  );
}
