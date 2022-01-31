import Link from 'next/link'
import React from 'react'

const Header = () => {
  return <div>
    <Link href='/' >
      <a className='link'>Home</a>
    </Link>
  </div>
}

export default Header
