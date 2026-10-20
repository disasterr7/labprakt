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
