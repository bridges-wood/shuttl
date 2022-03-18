import Post from '@typings/Post'

// This cannot go with the post utils due to fs and path not being available client-side
export const isPublished = (post: Post) => new Date(post.date) < new Date()

/**
 * Generate a message to indicate how long ago a post was published.
 * @param post The post.
 * @returns A message indicating how long ago the post was published.
 */
export const publishedMessage = (post: Post): string => {
  const difference =
    (new Date().getTime() - new Date(post.date).getTime()) / 1000

  if (difference < 0) throw new Error('This post has not yet been published.')
  else if (difference < 60) return 'moments ago'
  else if (difference < 3600)
    return `${Math.floor(difference / 60)} minutes ago`
  else if (difference < 3600 * 24)
    return `${Math.floor(difference / 3600)} hours ago`
  else if (difference < 3600 * 24 * 7)
    return `${Math.floor(difference / (3600 * 24))} days ago`
  else return new Date(post.date).toLocaleDateString('en-GB')
}
