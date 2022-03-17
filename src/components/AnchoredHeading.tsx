import LinkSolid from '@components/svg/link-solid.svg'
import React from 'react'

export interface ComponentProps {
  level: number
  children?: React.ReactNode
}

/**
 * Generate an anchor from the first text node of a ReactNode.
 *
 * @param text The text node to generate an anchor from.
 * @returns An anchor string.
 */
const getAnchor = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
}

const AnchoredHeading = ({ level, children }) => {
  const anchor = getAnchor(children)
  const link = `#${anchor}`

  switch (level) {
    case 1:
      return (
        <h1 id={anchor}>
          <a href={link} className="anchor-link">
            {LinkSolid()}
          </a>
          {children}
        </h1>
      )
    case 2:
      return (
        <h2 id={anchor}>
          <a href={link} className="anchor-link">
            {LinkSolid()}
          </a>
          {children}
        </h2>
      )
    case 3:
      return (
        <h3 id={anchor}>
          <a href={link} className="anchor-link">
            {LinkSolid()}
          </a>
          {children}
        </h3>
      )
    case 4:
      return (
        <h4 id={anchor}>
          <a href={link} className="anchor-link">
            {LinkSolid()}
          </a>
          {children}
        </h4>
      )
    case 5:
      return (
        <h5 id={anchor}>
          <a href={link} className="anchor-link">
            {LinkSolid()}
          </a>
          {children}
        </h5>
      )
    case 6:
      return (
        <h6 id={anchor}>
          <a href={link} className="anchor-link">
            {LinkSolid()}
          </a>
          {children}
        </h6>
      )
    default:
      return (
        <h1 id={anchor}>
          <a href={link} className="anchor-link">
            {LinkSolid()}
          </a>
          {children}
        </h1>
      )
  }
}

export default AnchoredHeading
