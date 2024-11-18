import React from 'react'

export const loader = async () => {
  const response = await fetch("http:localhost:8787/api/")
}


function Username() {
  return (
    <div>$username</div>
  )
}

export default Username
