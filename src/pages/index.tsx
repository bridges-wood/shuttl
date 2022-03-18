import MissionCard from '@components/MissionCard'
import Teaser from '@components/Teaser'
import { Mission } from '@typings/mission'
import Post, { UpcomingPost } from '@typings/Post'
import { isPublished } from '@utils/index'
import { postFilenames, POSTS_PATH } from '@utils/posts'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import path from 'path'
import React from 'react'
import missions from '../../public/missions.json'

interface PageProps {
  missions: Mission[]
  upNext: UpcomingPost
}

export default function Home({ missions, upNext }: PageProps) {
  const totalMissions = missions.length + (upNext !== null ? 1 : 0)

  return (
    <React.Fragment>
      <Head>
        <meta
          name="description"
          content="A weekly blog on the music of the shuttle program, from 1981 to 2011. Join us every Friday for a new playlist and discussion."
        />
        <meta property="og:url" content="https://shuttl.maxwood.tech/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shuttl" />
        <meta
          property="og:description"
          content="A weekly blog on the music of the shuttle program, from 1981 to 2011. Join us every Friday for a new playlist and discussion."
        />
        <meta
          property="og:image"
          content="https://shuttl-images.s3.eu-west-2.amazonaws.com/preview.jpeg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="shuttl.maxwood.tech" />
        <meta property="twitter:url" content="https://shuttl.maxwood.tech/" />
        <meta name="twitter:title" content="Shuttl" />
        <meta
          name="twitter:description"
          content="A weekly blog on the music of the shuttle program, from 1981 to 2011. Join us every Friday for a new playlist and discussion."
        />
        <meta
          name="twitter:image"
          content="https://shuttl-images.s3.eu-west-2.amazonaws.com/preview.jpeg"
        />
      </Head>
      <header>
        <h1 className="name">Shuttl</h1>
        <small className="tagline">In space, all you can hear is this.</small>
      </header>
      <main>
        <p>
          Join us weekly for a new post on the music of the shuttle program,
          from 1981 to 2011.
        </p>
        {totalMissions > 0 ? (
          <div
            className="mission-deck"
            style={{
              gridTemplateColumns: `repeat(${
                totalMissions === 0
                  ? 1
                  : totalMissions % 3 === 0
                  ? 3
                  : totalMissions % 2 === 0
                  ? 2
                  : 1
              }, 1fr)`,
            }}
          >
            {missions.map((mission, idx) => (
              <MissionCard mission={mission} key={idx} />
            ))}
            {upNext !== null ? (
              <Teaser
                mission={upNext}
                releaseDate={new Date(upNext.releaseDate)}
              />
            ) : null}
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

export const getStaticProps: GetStaticProps<PageProps> = () => {
  const hydratedPosts = postFilenames.map((postFileName) => {
    const completePath = path.join(POSTS_PATH, postFileName)
    const source = fs.readFileSync(completePath)
    const { data } = matter(source)
    return {
      ...(data as Post),
    }
  })

  const published = hydratedPosts.filter(isPublished)
  const nextPost = hydratedPosts
    .filter((post) => !isPublished(post))
    .reduce((prev, cur) =>
      new Date(prev.date) < new Date(cur.date) ? prev : cur
    )
  return {
    props: {
      missions: missions.filter((mission) =>
        published.find((post) => post.title === mission.id)
      ),
      upNext:
        new Date(nextPost.date) > new Date()
          ? {
              ...missions.find((mission) => mission.id === nextPost.title),
              releaseDate: nextPost.date.toString(),
            }
          : null,
    },
    revalidate: 10,
  }
}
