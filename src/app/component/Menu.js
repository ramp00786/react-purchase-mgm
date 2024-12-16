import React from 'react'
import Link from "next/link";
export default function Menu() {
  return (
    <div className='d-flex gap-4 justify-content-end'>
      <Link href={'/purchase'}>Create New</Link>
      <Link href={'/'}>All Orders</Link>
    </div>
  )
}
