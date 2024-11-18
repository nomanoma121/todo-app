import { Form } from '@remix-run/react';
import React from 'react'

function Header() {
  return (
    <div>
      <h1>Todoリスト</h1>
      <Form method="POST">
        <input type="text" />
        <input type="submit" value="登録" />
      </Form>
    </div>
  )
}

export default Header;
