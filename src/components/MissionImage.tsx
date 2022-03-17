import Image, { ImageProps } from 'next/image'
import React from 'react'

interface ComponentProps extends ImageProps {
  alt: string
}

const MissionImage = ({ alt, ...props }: ComponentProps) => {
  return (
    <figure className="mission-image">
      <Image {...props} alt={alt} loading="lazy" />
      <figcaption>
        <i>{alt}</i>
      </figcaption>
    </figure>
  )
}

export default MissionImage
