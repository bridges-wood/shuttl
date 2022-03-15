import MissionCard from '@components/MissionCard'
import Frontmatter from '@typings/Frontmatter'
import { Mission } from '@typings/mission'
import { postFilePaths, POSTS_PATH } from '@utils/posts'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import path from 'path'
import React from 'react'
import missions from '../../public/missions.json'

interface PageProps {
  missions: Mission[]
}

export default function Home({ missions }: PageProps) {
  return (
    <React.Fragment>
      <Head>
        <title>Shuttl | Home</title>
      </Head>
      <header>
        <h1 className="name">Shuttl</h1>
        <small className="tagline">In space, all you can hear is this.</small>
      </header>
      <main>
        <p>The music of the shuttle program, from 1981 to 2011.</p>
        {missions.length !== 0 ? (
          <div className="mission-deck">
            {missions.map((mission, idx) => (
              <MissionCard mission={mission} key={idx} />
            ))}
          </div>
        ) : (
          <p className="no-missions-message">
            Welcome to <span className="name">Shttl</span>. There are no
            missions to see at the moment, check back soon to join us on our
            journey through the history of the Space Transport System and the
            music that accompanied this era of manned spaceflight.
          </p>
        )}
      </main>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps = () => {
  const hydratedPosts = postFilePaths.map((postFileName) => {
    const completePath = path.join(POSTS_PATH, postFileName)
    const source = fs.readFileSync(completePath)
    const { data } = matter(source)
    return {
      ...(data as Frontmatter),
    }
  })

  const published = hydratedPosts.filter((post) => post.isPublished)
  return {
    props: {
      missions: missions.filter((mission) =>
        published.find((post) => post.title === mission.id)
      ),
    },
  }
}
