import { Mission } from '@typings/mission'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import MissionCard from './MissionCard'

interface ComponentProps {
  mission: Mission
  releaseDate: Date
}

const Teaser = ({ mission, releaseDate }: ComponentProps) => {
  const [timeRemaining, setTimeRemaining] = useState(
    (releaseDate.getTime() - new Date().getTime()) / 1000
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 1) {
        setTimeRemaining(timeRemaining - 1)
      } else {
        clearInterval(interval)
        setTimeRemaining(0)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [timeRemaining])

  if (timeRemaining <= 0) {
    return <MissionCard mission={mission} />
  }

  const days = Math.floor(timeRemaining / (60 * 60 * 24))
  const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((timeRemaining % (60 * 60)) / 60)
  const seconds = Math.ceil((timeRemaining % (60 * 60)) % 60)
  return (
    <div className="mission-card teaser">
      <h3 className="countdown">
        -{days}:{String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </h3>
      <Image
        src={mission.patchURL}
        width="200px"
        height="200px"
        alt={`Mission patch for ${mission.id}`}
        className="mission-patch"
      />
      <h2 className="link">{mission.id}</h2>
    </div>
  )
}

export default Teaser
