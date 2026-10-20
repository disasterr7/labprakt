import { Link } from 'react-router'
import type { Movie, MovieStatus } from '../types/movie'

type MovieCardProps = {
  movie: Movie
}

const statusLabels: Record<MovieStatus, string> = {
  planned: 'В планах',
  watching: 'Смотрю',
  watched: 'Просмотрено',
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="movie-card">
      <header className="movie-card-header">
        <span className="movie-type-badge">
          {movie.type === 'movie' ? 'Фильм' : 'Сериал'} ({movie.releaseYear})
        </span>
        <span className={`status-badge status-${movie.status}`}>
          {statusLabels[movie.status]}
        </span>
      </header>

      <h2 className="movie-card-title">
        <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
      </h2>

      <p className="movie-original-title">{movie.originalTitle}</p>
      <p className="movie-card-description">{movie.description}</p>

      <footer className="movie-card-footer">
        <span className="movie-genre">{movie.genre}</span>
        <span className="movie-rating">★ {movie.rating.toFixed(1)}</span>
      </footer>
    </article>
  )
}
