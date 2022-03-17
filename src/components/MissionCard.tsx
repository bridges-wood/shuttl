import { Mission } from '@typings/mission'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ComponentProps {
  mission: Mission
}

const MissionCard = ({ mission }: ComponentProps) => {
  return (
    <div className="mission-card">
      <Link href={`/missions/${mission.id}`} passHref>
        <a>
          <Image
            src={mission.patchURL}
            width="200px"
            height="200px"
            alt={`Mission patch for ${mission.id}`}
            className="mission-patch"
          />
          <h2 className="link">{mission.id}</h2>
        </a>
      </Link>
    </div>
  )
}

export default MissionCard
