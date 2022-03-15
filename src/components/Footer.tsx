import React from 'react'

const Footer = () => {
  return (
    <footer>
      <span>
        &#169;{' '}
        <a href="https://maxwood.tech" className="link">
          Max Wood
        </a>{' '}
        {new Date().getFullYear()}
      </span>
      <span className="acknowlegdement">
        Mission patches courtesy of{' '}
        <a href="https://www.nasa.gov/" className="link">
          NASA
        </a>
      </span>
    </footer>
  )
}

export default Footer
