import { Link, useParams } from 'react-router'
import { movies } from '../data/movies'
import type { MovieStatus } from '../types/movie'

const statusLabels: Record<MovieStatus, string> = {
  planned: 'В планах к просмотру',
  watching: 'Смотрю сейчас',
  watched: 'Просмотрено полностью',
}

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const movie = movies.find((item) => item.id === id)

  if (!movie) {
    return (
      <section className="page-section not-found-box">
        <h1>Фильм или сериал не найден</h1>
        <p className="page-description">
          Записи с идентификатором «{id}» нет в базе данных приложения.
        </p>
        <Link to="/movies" className="button-secondary">
          ← Вернуться к списку
        </Link>
      </section>
    )
  }

  return (
    <article className="page-section movie-details">
      <div className="movie-details-top">
        <Link to="/movies" className="back-link">
          ← К списку фильмов
        </Link>
        <span className={`status-badge status-${movie.status}`}>
          {statusLabels[movie.status]}
        </span>
      </div>

      <header className="movie-details-header">
        <h1>{movie.title}</h1>
        <p className="movie-original-title-large">
          {movie.originalTitle} ({movie.releaseYear})
        </p>
      </header>

      <div className="movie-meta-grid">
        <div className="meta-item">
          <span className="meta-label">Формат:</span>
          <span className="meta-value">{movie.type === 'movie' ? 'Фильм' : 'Сериал'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Жанр:</span>
          <span className="meta-value">{movie.genre}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Режиссёр / Создатель:</span>
          <span className="meta-value">{movie.directorOrCreator}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Длительность:</span>
          <span className="meta-value">{movie.durationOrEpisodes}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Рейтинг:</span>
          <span className="meta-value rating-highlight">★ {movie.rating.toFixed(1)} / 10</span>
        </div>
      </div>

      <div className="movie-synopsis">
        <h2>Описание сюжета</h2>
        <p>{movie.description}</p>
      </div>

      <footer className="movie-details-footer">
        <Link to="/movies" className="button-primary">
          ← Вернуться в каталог
        </Link>
      </footer>
    </article>
  )
}
