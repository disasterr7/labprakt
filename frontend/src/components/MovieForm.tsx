import { useState } from 'react'
import { useGenres } from '../hooks/useGenres'
import type { MovieDraft, MoviePriority, MovieStatus, MovieType } from '../types/movie'

interface MovieFormProps {
  initialValues: MovieDraft
  onSave: (draft: MovieDraft) => void
  onCancel: () => void
  submitButtonText?: string
}

export function MovieForm({
  initialValues,
  onSave,
  onCancel,
  submitButtonText = 'Сохранить',
}: MovieFormProps) {
  const [draft, setDraft] = useState<MovieDraft>(() => ({ ...initialValues }))
  const [error, setError] = useState<string | null>(null)

  const { load, retry } = useGenres()
  const genres = load.status === 'success' ? load.data : []
  const selectedGenreExists = genres.some((genre) => genre.id === draft.genre)
  const canSave = load.status === 'success' && selectedGenreExists

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSave) {
      setError('Дождитесь загрузки справочника и выберите доступный жанр.')
      return
    }

    const trimmedTitle = draft.title.trim()
    if (trimmedTitle.length < 2 || trimmedTitle.length > 100) {
      setError('Название картины должно содержать от 2 до 100 символов.')
      return
    }

    if (!draft.releaseYear || draft.releaseYear < 1895 || draft.releaseYear > 2100) {
      setError('Год выпуска должен быть в диапазоне от 1895 до 2100.')
      return
    }

    if (isNaN(draft.rating) || draft.rating < 1 || draft.rating > 10) {
      setError('Рейтинг должен быть числом от 1.0 до 10.0.')
      return
    }

    setError(null)
    onSave({
      ...draft,
      title: trimmedTitle,
    })
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div role="alert" className="form-error-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="movie-title">
          Название картины <span className="required-star">*</span>
        </label>
        <input
          id="movie-title"
          type="text"
          value={draft.title}
          onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Например: Интерстеллар"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="movie-original-title">Оригинальное название</label>
        <input
          id="movie-original-title"
          type="text"
          value={draft.originalTitle}
          onChange={(e) => setDraft((prev) => ({ ...prev, originalTitle: e.target.value }))}
          placeholder="Например: Interstellar"
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="movie-type">Формат</label>
          <select
            id="movie-type"
            value={draft.type}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, type: e.target.value as MovieType }))
            }
            className="form-input"
          >
            <option value="movie">Фильм</option>
            <option value="series">Сериал</option>
          </select>
        </div>

        <div className="form-group flex-1">
          <label htmlFor="movie-year">
            Год выпуска <span className="required-star">*</span>
          </label>
          <input
            id="movie-year"
            type="number"
            min={1895}
            max={2100}
            value={draft.releaseYear || ''}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, releaseYear: Number(e.target.value) }))
            }
            placeholder="2024"
            className="form-input"
            required
          />
        </div>

        <div className="form-group flex-1">
          <label htmlFor="movie-rating">
            Рейтинг (1.0 - 10.0) <span className="required-star">*</span>
          </label>
          <input
            id="movie-rating"
            type="number"
            step="0.1"
            min={1}
            max={10}
            value={draft.rating || ''}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))
            }
            placeholder="8.5"
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="movie-status">Статус просмотра</label>
          <select
            id="movie-status"
            value={draft.status}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, status: e.target.value as MovieStatus }))
            }
            className="form-input"
          >
            <option value="planned">В планах к просмотру</option>
            <option value="watching">Смотрю сейчас</option>
            <option value="watched">Просмотрено</option>
          </select>
        </div>

        <div className="form-group flex-1">
          <label htmlFor="movie-priority">Приоритет</label>
          <select
            id="movie-priority"
            value={draft.priority}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, priority: e.target.value as MoviePriority }))
            }
            className="form-input"
          >
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        {/* Поле Жанр из сетевого справочника (ЛР 4) */}
        <div className="form-group flex-1">
          <label htmlFor="movie-genre">
            Жанр <span className="required-star">*</span>
          </label>
          <select
            id="movie-genre"
            value={draft.genre}
            required
            disabled={load.status !== 'success' || genres.length === 0}
            onChange={(e) => setDraft((prev) => ({ ...prev, genre: e.target.value }))}
            className="form-input"
          >
            <option value="">Выберите жанр</option>
            {draft.genre !== '' && !selectedGenreExists && (
              <option value={draft.genre} disabled>
                Текущий код: {draft.genre} — выберите доступный жанр
              </option>
            )}
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          {load.status === 'loading' && (
            <p role="status" className="field-hint field-hint-loading">
              ⏳ Загружаем справочник жанров…
            </p>
          )}

          {load.status === 'error' && (
            <div className="field-retry-row">
              <p role="alert" className="field-hint field-hint-error">
                ⚠️ {load.message}
              </p>
              <button type="button" className="button-retry" onClick={retry}>
                Повторить
              </button>
            </div>
          )}

          {load.status === 'success' && genres.length === 0 && (
            <div className="field-retry-row">
              <p role="status" className="field-hint field-hint-empty">
                Справочник жанров пуст. Сохранение недоступно.
              </p>
              <button type="button" className="button-retry" onClick={retry}>
                Повторить
              </button>
            </div>
          )}

          {load.status === 'success' && genres.length > 0 && (
            <div className="field-action-row">
              <button
                type="button"
                className="button-refresh"
                onClick={retry}
              >
                🔄 Обновить справочник
              </button>
            </div>
          )}

          {load.status === 'success' && draft.genre !== '' && !selectedGenreExists && (
            <p role="alert" className="field-hint field-hint-warning">
              Ранее сохранённый код «{draft.genre}» не найден в справочнике. Пожалуйста, выберите существующий жанр.
            </p>
          )}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="movie-director">Режиссёр / Создатель</label>
          <input
            id="movie-director"
            type="text"
            value={draft.directorOrCreator}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, directorOrCreator: e.target.value }))
            }
            placeholder="Например: Кристофер Нолан"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="movie-duration">Длительность / Сезоны</label>
        <input
          id="movie-duration"
          type="text"
          value={draft.durationOrEpisodes}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, durationOrEpisodes: e.target.value }))
          }
          placeholder="Например: 169 мин. или 5 сезонов"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="movie-description">Описание сюжета</label>
        <textarea
          id="movie-description"
          rows={4}
          value={draft.description}
          onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Краткое содержание или ваши личные заметки о фильме..."
          className="form-input form-textarea"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="button-primary" disabled={!canSave}>
          {submitButtonText}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  )
}
