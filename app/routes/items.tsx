import { json, useLoaderData } from "@remix-run/react";

// `loader` 関数でデータを取得する
export const loader = async ({ context }) => {
  const response = await fetch("http://localhost:8787/api/get");
  const data = await response.json();
  console.log("loader function running!!");
  return json({data});
};

// コンポーネントで useLoaderData を使用
export default function ItemsList() {
  const items: any = useLoaderData();
  
  // useLoaderData で取得したデータをコンソールに表示
  console.log("Loaded Items in Component:", items.data.results);

  const itemsArray = items.data.results;

  return (
    <div>
      {itemsArray.map((e:any) => (
        <li key={e.id}>{e.name}</li>
      ))}
    </div>
  );
}
