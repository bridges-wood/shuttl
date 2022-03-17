import Post from '@typings/Post'
import fs from 'fs'
import path from 'path'

export const POSTS_PATH = path.join(process.cwd(), 'src/posts')

export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  .filter((path) => /\.mdx?$/.test(path))

export const isPublished = (post: Post) => new Date(post.date) < new Date()
