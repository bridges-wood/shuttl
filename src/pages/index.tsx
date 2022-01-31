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

export default function Home({missions}: PageProps) {

  return <div>
    <Head>
      <title>Shttl | Home</title>
    </Head>
    <header>
      <h1>Shttl</h1>
      <small className='tagline'>In space, all you can hear is this.</small>
    </header>
    <p>An archival repository of every wake-up playlist on every shuttle mission, from 1981 to 2011.</p>
    <div className="mission-deck">
      {missions.map((mission, idx) => (
        <MissionCard
          mission={mission}
          key={idx}
        />
      ))}
    </div>
  </div>
}

export const getStaticProps: GetStaticProps = () => {
  const hydratedPosts = postFilePaths.map((postFileName) => {
    const completePath = path.join(POSTS_PATH, postFileName)
    const source = fs.readFileSync(completePath)
    const {data} = matter(source)
    return {
      ...(data as Frontmatter)
    }
  })

  const published = hydratedPosts.filter(post => post.isPublished)

  console.log('published', published);
  return {props: {missions: missions.filter(mission => published.find(post => post.title === mission.id))}}
}
