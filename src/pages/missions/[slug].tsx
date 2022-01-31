import Frontmatter from '@typings/Frontmatter'
import { Mission } from '@typings/mission'
import { postFilePaths, POSTS_PATH } from '@utils/posts'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'next/image'
import path from 'path'
import React from 'react'
import missions from '../../../public/missions.json'

interface PageProps {
  source: MDXRemoteSerializeResult<Record<string, unknown>>
  frontmatter: Frontmatter
  mission: Mission
}

const Mission = ({source, frontmatter, mission} : PageProps) => {
  return (
    <div >
      <div className="head">
        <h1 >{mission.id}</h1>
        <Image className='mission-patch' src={mission.patchURL} width={400} height={400} alt={`Mission patch for ${mission.id}`}/>
      </div>
      <main>
        <MDXRemote {...source} />
      </main>
      <h3>Crew</h3>
      {mission.crew.map((member, idx) => 
        (<p key={idx}>{member}</p>)
      )}
      <iframe src={mission.playlist} width="100%" height="380" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
    </div>)
  
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postPaths = postFilePaths.map((path) => path.replace(/\.mdx$/, ''))
  const paths = missions.filter((mission) => postPaths.includes(mission.id)).map((mission) => ({params: {slug: mission.id}}))

  return {paths, fallback: false}
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  const source = fs.readFileSync(postFilePath)

  const {content, data} = matter(source)

  if (!data.isPublished)
    return {redirect: {statusCode: 302, destination: '/'}}
  else {
    const mdxSource = await serialize(content, {scope: data})
    return {props: {source: mdxSource, frontmatter: data as Frontmatter, mission: missions.find((mission) => mission.id === params.slug)}}
  }
}



export default Mission
