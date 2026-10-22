import { useState } from 'react'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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
        <div className="form-group flex-1">
          <label htmlFor="movie-genre">Жанры</label>
          <input
            id="movie-genre"
            type="text"
            value={draft.genre}
            onChange={(e) => setDraft((prev) => ({ ...prev, genre: e.target.value }))}
            placeholder="Например: Фантастика, Драма"
            className="form-input"
          />
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
        <button type="submit" className="button-primary">
          {submitButtonText}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  )
}
