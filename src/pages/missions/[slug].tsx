import AnchoredHeading from '@components/AnchoredHeading'
import MissionImage from '@components/MissionImage'
import { MDXProvider } from '@mdx-js/react'
import { Mission } from '@typings/mission'
import Post from '@typings/Post'
import { isPublished, publishedMessage } from '@utils/index'
import imageMetadata from '@utils/plugins/image-metadata'
import { postFilenames, POSTS_PATH } from '@utils/posts'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Head from 'next/head'
import Image from 'next/image'
import path from 'path'
import React from 'react'
import missions from '../../../public/missions.json'

interface PageProps {
  source: MDXRemoteSerializeResult<Record<string, unknown>>
  post: Post
  mission: Mission
}

const components: React.ComponentProps<typeof MDXProvider>['components'] = {
  Image: MissionImage,
  h1: (props: any) => <AnchoredHeading level={1} {...props} />,
  h2: (props: any) => <AnchoredHeading level={2} {...props} />,
  h3: (props: any) => <AnchoredHeading level={3} {...props} />,
  h4: (props: any) => <AnchoredHeading level={4} {...props} />,
  h5: (props: any) => <AnchoredHeading level={5} {...props} />,
  h6: (props: any) => <AnchoredHeading level={6} {...props} />,
}

const Mission = ({ source, post, mission }: PageProps) => {
  return (
    <>
      <Head>
        <title>Shuttl | {mission.id}</title>
        <meta name="description" content={post.description} />
        <meta
          property="og:url"
          content={`https://shuttl.maxwood.tech/${mission.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Shuttl | ${mission.id}`} />
        <meta property="og:description" content={post.description} />
        <meta
          property="og:image"
          content={`https://shuttl-images.s3.eu-west-2.amazonaws.com/images/${mission.id}/preview.jpeg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="shuttl.maxwood.tech" />
        <meta
          property="twitter:url"
          content={`https://shuttl.maxwood.tech/missions/${mission.id}`}
        />
        <meta name="twitter:title" content={`Shuttl | ${mission.id}`} />
        <meta name="twitter:description" content={post.description} />
        <meta
          property="twitter:image"
          content={`https://shuttl-images.s3.eu-west-2.amazonaws.com/images/${mission.id}/preview.jpeg`}
        />
      </Head>
      <div>
        <div className="head">
          <h1 className="mission-name">{mission.id}</h1>
          <p className="tagline">Published {publishedMessage(post)}.</p>
          <Image
            className="mission-patch"
            src={mission.patchURL}
            width={400}
            height={400}
            alt={`Mission patch for ${mission.id}`}
            placeholder="empty"
            priority
          />
        </div>
        <main>
          <MDXRemote {...source} components={components} />
        </main>
        <iframe
          src={mission.playlist}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * List of paths to all post files.
   */
  let filePaths = []

  for (const filename of postFilenames) {
    const post = path.join(POSTS_PATH, filename)
    const source = fs.readFileSync(post)
    const { data } = matter(source)

    // Skip unpublished posts
    if (!isPublished(data as Post)) continue

    filePaths.push(filename)
  }

  // The ID of each post can be determined by removing the file extension.
  const postIDs = filePaths.map((path) => path.replace(/\.mdx$/, ''))

  // Only posts with logged missions can be included.
  const paths = missions
    .filter((mission) => postIDs.includes(mission.id))
    .map((mission) => ({ params: { slug: mission.id } }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  const source = fs.readFileSync(postFilePath)

  const { content, data } = matter(source)

  if (!isPublished(data as Post)) {
    return { redirect: { statusCode: 302, destination: '/' } }
  } else {
    const mdxSource = await serialize(content, {
      scope: data,
      mdxOptions: {
        rehypePlugins: [imageMetadata],
      },
    })

    const mission: Mission = missions.find(
      (mission) => mission.id === params.slug
    )

    return {
      props: {
        source: mdxSource,
        post: data as Post,
        mission,
      },
      revalidate: 10,
    }
  }
}

export default Mission
