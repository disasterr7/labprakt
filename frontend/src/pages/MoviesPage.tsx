import { useState } from 'react'
import { Link } from 'react-router'
import { MovieCard } from '../components/MovieCard'
import type { Movie, MovieStatus } from '../types/movie'

interface MoviesPageProps {
  movies: Movie[]
}

type FilterOption = 'all' | MovieStatus

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'planned', label: 'В планах' },
  { value: 'watching', label: 'Смотрю' },
  { value: 'watched', label: 'Просмотрено' },
]

export function MoviesPage({ movies }: MoviesPageProps) {
  const [statusFilter, setStatusFilter] = useState<FilterOption>('all')

  const filteredMovies =
    statusFilter === 'all'
      ? movies
      : movies.filter((movie) => movie.status === statusFilter)

  return (
    <section className="page-section">
      <div className="page-header-row">
        <div>
          <h1>Моя медиатека</h1>
          <p className="page-description">
            Список фильмов и сериалов, доступных для просмотра и оценивания.
          </p>
        </div>
        <Link to="/movies/new" className="button-primary">
          + Добавить фильм
        </Link>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Фильтр по статусу:</span>
        <div className="filter-chips">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-chip ${statusFilter === opt.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
              {opt.value !== 'all' && (
                <span className="filter-count">
                  ({movies.filter((m) => m.status === opt.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
        {statusFilter !== 'all' && (
          <button
            type="button"
            className="filter-reset-button"
            onClick={() => setStatusFilter('all')}
          >
            Сбросить фильтр
          </button>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="empty-placeholder">
          <h3>Каталог пуст</h3>
          <p>В вашей медиатеке пока нет ни одного фильма или сериала.</p>
          <Link to="/movies/new" className="button-primary" style={{ marginTop: '1rem' }}>
            + Добавить первый фильм
          </Link>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="empty-placeholder">
          <h3>Ничего не найдено</h3>
          <p>Нет картин с выбранным статусом просмотра.</p>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setStatusFilter('all')}
            style={{ marginTop: '1rem' }}
          >
            Показать все картины ({movies.length})
          </button>
        </div>
      ) : (
        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  )
}
