import { Mission } from '@typings/mission'

export default interface Post {
  title: string
  description: string
  date: string
}

export interface UpcomingPost extends Mission {
  releaseDate: Date | string
}
