import { Link, useNavigate, useParams } from 'react-router'
import { useGenres } from '../hooks/useGenres'
import type { Movie, MovieStatus } from '../types/movie'

interface MovieDetailsPageProps {
  movies: Movie[]
  onDelete: (id: string) => void
}

const statusLabels: Record<MovieStatus, string> = {
  planned: 'В планах к просмотру',
  watching: 'Смотрю сейчас',
  watched: 'Просмотрено полностью',
}

export function MovieDetailsPage({ movies, onDelete }: MovieDetailsPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const movie = movies.find((item) => item.id === id)

  const { load: genresLoad } = useGenres()
  const genres = genresLoad.status === 'success' ? genresLoad.data : []
  const genreName = movie ? genres.find((g) => g.id === movie.genre)?.name || movie.genre : ''

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

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить запись «${movie.title}» из медиатеки?`,
    )
    if (confirmed) {
      onDelete(movie.id)
      navigate('/movies')
    }
  }

  return (
    <article className="page-section movie-details">
      <div className="movie-details-top">
        <Link to="/movies" className="back-link">
          ← К списку фильмов
        </Link>
        <div className="movie-details-actions">
          <Link to={`/movies/${movie.id}/edit`} className="button-secondary btn-sm">
            ✎ Редактировать
          </Link>
          <button
            type="button"
            className="button-danger btn-sm"
            onClick={handleDelete}
          >
            🗑 Удалить
          </button>
        </div>
      </div>

      <header className="movie-details-header">
        <div className="header-status-row">
          <span className={`status-badge status-${movie.status}`}>
            {statusLabels[movie.status]}
          </span>
          <span className="priority-badge">
            Приоритет: {movie.priority === 'high' ? 'Высокий' : movie.priority === 'medium' ? 'Средний' : 'Низкий'}
          </span>
        </div>
        <h1>{movie.title}</h1>
        {movie.originalTitle && (
          <p className="movie-original-title-large">
            {movie.originalTitle} ({movie.releaseYear})
          </p>
        )}
      </header>

      <div className="movie-meta-grid">
        <div className="meta-item">
          <span className="meta-label">Формат:</span>
          <span className="meta-value">{movie.type === 'movie' ? 'Фильм' : 'Сериал'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Год выпуска:</span>
          <span className="meta-value">{movie.releaseYear}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Жанр:</span>
          <span className="meta-value">{genreName || 'Не указан'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Режиссёр / Создатель:</span>
          <span className="meta-value">{movie.directorOrCreator || 'Не указан'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Длительность:</span>
          <span className="meta-value">{movie.durationOrEpisodes || 'Не указана'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Рейтинг:</span>
          <span className="meta-value rating-highlight">★ {movie.rating.toFixed(1)} / 10</span>
        </div>
      </div>

      <div className="movie-synopsis">
        <h2>Описание сюжета</h2>
        <p>{movie.description || 'Описание пока не добавлено.'}</p>
      </div>

      <footer className="movie-details-footer">
        <Link to="/movies" className="button-secondary">
          ← Вернуться в каталог
        </Link>
      </footer>
    </article>
  )
}
