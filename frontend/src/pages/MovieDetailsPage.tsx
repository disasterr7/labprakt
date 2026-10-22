import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useGenres } from '../hooks/useGenres'
import {
  createMovieReview,
  deleteMovieReview,
  fetchReviewsByMovieId,
} from '../services/reviews'
import type { Movie, MovieReview, MovieStatus } from '../types/movie'

interface MovieDetailsPageProps {
  movies: Movie[]
  onDelete: (id: string) => Promise<void> | void
}

const statusLabels: Record<MovieStatus, string> = {
  planned: 'В планах к просмотру',
  watching: 'Смотрю сейчас',
  watched: 'Просмотрено полностью',
}

export function MovieDetailsPage({ movies, onDelete }: MovieDetailsPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const movie = movies.find((item) => item.id === id)

  const { load: genresLoad } = useGenres()
  const genres = genresLoad.status === 'success' ? genresLoad.data : []
  const genreName = movie
    ? genres.find((g) => g.id === movie.genre)?.name || movie.genre
    : ''

  // Состояния для связанных рецензий и заметок
  const [reviews, setReviews] = useState<MovieReview[]>([])
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  // Поля формы новой рецензии
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState<number>(8.0)
  const [watchedDate, setWatchedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewFormError, setReviewFormError] = useState<string | null>(null)

  // Состояние удаления картины
  const [isDeletingMovie, setIsDeletingMovie] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (!movie || !user) {
      setReviews([])
      return
    }

    let active = true
    setLoadingReviews(true)
    setReviewsError(null)

    fetchReviewsByMovieId(movie.id)
      .then((data) => {
        if (active) {
          setReviews(data)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setReviewsError(
            err instanceof Error
              ? err.message
              : 'Не удалось загрузить рецензии',
          )
        }
      })
      .finally(() => {
        if (active) {
          setLoadingReviews(false)
        }
      })

    return () => {
      active = false
    }
  }, [movie, user])

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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить запись «${movie.title}» из медиатеки? Все связанные рецензии также будут удалены (ON DELETE CASCADE).`,
    )
    if (!confirmed) return

    setIsDeletingMovie(true)
    setDeleteError(null)

    try {
      await onDelete(movie.id)
      navigate('/movies')
    } catch (err: unknown) {
      setIsDeletingMovie(false)
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Произошла ошибка при удалении фильма',
      )
    }
  }

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const trimmed = reviewText.trim()
    if (trimmed.length < 3) {
      setReviewFormError('Текст отзыва должен содержать не менее 3 символов.')
      return
    }

    if (isNaN(reviewRating) || reviewRating < 1 || reviewRating > 10) {
      setReviewFormError('Оценка должна быть числом от 1.0 до 10.0.')
      return
    }

    setReviewFormError(null)
    setIsSubmittingReview(true)

    try {
      const createdReview = await createMovieReview(
        {
          mediaId: movie.id,
          reviewText: trimmed,
          rating: reviewRating,
          watchedDate: watchedDate,
        },
        user.id,
      )

      setReviews((prev) => [createdReview, ...prev])
      setReviewText('')
      setReviewRating(8.0)
    } catch (err: unknown) {
      // Текст отзыва reviewText НЕ сбрасывается!
      setReviewFormError(
        err instanceof Error
          ? err.message
          : 'Ошибка при сохранении отзыва в базе данных',
      )
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleDeleteReviewItem = async (reviewId: string) => {
    const confirmed = window.confirm(
      'Удалить эту рецензию из базы данных?',
    )
    if (!confirmed) return

    try {
      await deleteMovieReview(reviewId)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : 'Не удалось удалить рецензию',
      )
    }
  }

  return (
    <article className="page-section movie-details">
      <div className="movie-details-top">
        <Link to="/movies" className="back-link">
          ← К списку фильмов
        </Link>
        <div className="movie-details-actions">
          <Link
            to={`/movies/${movie.id}/edit`}
            className="button-secondary btn-sm"
          >
            ✎ Редактировать
          </Link>
          <button
            type="button"
            className="button-danger btn-sm"
            onClick={handleDelete}
            disabled={isDeletingMovie}
          >
            {isDeletingMovie ? '⏳ Удаление...' : '🗑 Удалить'}
          </button>
        </div>
      </div>

      {deleteError && (
        <div role="alert" className="form-error-banner" style={{ margin: '1rem 0' }}>
          ⚠️ {deleteError}
        </div>
      )}

      <header className="movie-details-header">
        <div className="header-status-row">
          <span className={`status-badge status-${movie.status}`}>
            {statusLabels[movie.status]}
          </span>
          <span className="priority-badge">
            Приоритет:{' '}
            {movie.priority === 'high'
              ? 'Высокий'
              : movie.priority === 'medium'
                ? 'Средний'
                : 'Низкий'}
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
          <span className="meta-value">
            {movie.type === 'movie' ? 'Фильм' : 'Сериал'}
          </span>
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
          <span className="meta-value">
            {movie.directorOrCreator || 'Не указан'}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Длительность:</span>
          <span className="meta-value">
            {movie.durationOrEpisodes || 'Не указана'}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Рейтинг:</span>
          <span className="meta-value rating-highlight">
            ★ {movie.rating.toFixed(1)} / 10
          </span>
        </div>
      </div>

      <div className="movie-synopsis">
        <h2>Описание сюжета</h2>
        <p>{movie.description || 'Описание пока не добавлено.'}</p>
      </div>

      {/* Связанный сценарий темы: Рецензии и личные заметки */}
      <section className="movie-reviews-section">
        <div className="section-header-row">
          <h2>📝 Личные рецензии и впечатления</h2>
          <span className="reviews-count-badge">
            {reviews.length} {reviews.length === 1 ? 'заметка' : 'заметок'}
          </span>
        </div>

        {reviewsError && (
          <div role="alert" className="form-error-banner">
            ⚠️ {reviewsError}
          </div>
        )}

        {user ? (
          <div className="reviews-container">
            {/* Форма добавления новой рецензии */}
            <form className="review-form" onSubmit={handleAddReview} noValidate>
              <h3>Добавить личный отзыв</h3>

              {reviewFormError && (
                <div role="alert" className="form-error-banner form-server-error">
                  ⚠️ {reviewFormError}
                  <div className="error-note">Введённый текст отзыва сохранён.</div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="review-rating">
                    Ваша личная оценка (1.0 - 10.0) <span className="required-star">*</span>
                  </label>
                  <input
                    id="review-rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseFloat(e.target.value) || 0)}
                    className="form-input"
                    disabled={isSubmittingReview}
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="review-date">
                    Дата просмотра <span className="required-star">*</span>
                  </label>
                  <input
                    id="review-date"
                    type="date"
                    value={watchedDate}
                    onChange={(e) => setWatchedDate(e.target.value)}
                    className="form-input"
                    disabled={isSubmittingReview}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="review-text">
                  Текст рецензии или заметка о впечатлениях <span className="required-star">*</span>
                </label>
                <textarea
                  id="review-text"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Опишите ваши впечатления от просмотра, любимые сцены или мысли о финале..."
                  className="form-input form-textarea"
                  disabled={isSubmittingReview}
                  required
                />
              </div>

              <button
                type="submit"
                className="button-primary btn-sm"
                disabled={isSubmittingReview}
              >
                {isSubmittingReview ? '⏳ Сохранение отзыва...' : 'Опубликовать рецензию'}
              </button>
            </form>

            {/* Список рецензий */}
            <div className="reviews-list">
              {loadingReviews ? (
                <p className="field-hint field-hint-loading">⏳ Загрузка рецензий из Supabase...</p>
              ) : reviews.length === 0 ? (
                <div className="empty-reviews-box">
                  <p>Вы пока не оставили ни одного отзыва к этой картине.</p>
                  <span className="empty-subtext">Добавьте первую рецензию, используя форму выше!</span>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-card-top">
                      <div className="review-rating-chip">★ {rev.rating.toFixed(1)} / 10</div>
                      <span className="review-date">Дата: {rev.watchedDate}</span>
                      <button
                        type="button"
                        className="review-delete-btn"
                        onClick={() => handleDeleteReviewItem(rev.id)}
                        title="Удалить рецензию"
                      >
                        🗑
                      </button>
                    </div>
                    <p className="review-text-content">{rev.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="guest-reviews-banner">
            <p>
              ℹ️ Личные рецензии и история просмотров сохраняются в облачной базе Supabase.
            </p>
            <Link to="/login" className="button-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
              Войти для ведения заметок
            </Link>
          </div>
        )}
      </section>

      <footer className="movie-details-footer">
        <Link to="/movies" className="button-secondary">
          ← Вернуться в каталог
        </Link>
      </footer>
    </article>
  )
}
