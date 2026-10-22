export type MovieType = 'movie' | 'series'

export type MovieStatus = 'planned' | 'watching' | 'watched'

export type MoviePriority = 'low' | 'medium' | 'high'

export type Movie = {
  id: string
  title: string
  originalTitle: string
  description: string
  type: MovieType
  genre: string
  releaseYear: number
  rating: number
  status: MovieStatus
  priority: MoviePriority
  durationOrEpisodes: string
  directorOrCreator: string
}

export type MovieDraft = Omit<Movie, 'id'>

export interface MovieReview {
  id: string
  mediaId: string
  reviewText: string
  rating: number
  watchedDate: string
  createdAt: string
}

export type MovieReviewDraft = Omit<MovieReview, 'id' | 'createdAt'>
