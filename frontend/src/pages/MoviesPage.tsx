import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { MovieCard } from '../components/MovieCard'
import { useGenres } from '../hooks/useGenres'
import type { Movie, MovieStatus, MovieType } from '../types/movie'

interface MoviesPageProps {
  movies: Movie[]
}

type StatusFilterOption = 'all' | MovieStatus
type TypeFilterOption = 'all' | MovieType

const statusFilterOptions: { value: StatusFilterOption; label: string }[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'planned', label: 'В планах' },
  { value: 'watching', label: 'Смотрю' },
  { value: 'watched', label: 'Просмотрено' },
]

export function MoviesPage({ movies }: MoviesPageProps) {
  // Параметры фильтрации и поиска (ЛР 7)
  const [searchQuery, setSearchQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>('all')

  const { load: genresLoad } = useGenres()
  const genres = genresLoad.status === 'success' ? genresLoad.data : []
  const genreMap = useMemo(
    () => new Map(genres.map((g) => [g.id, g.name])),
    [genres],
  )

  // Фильтрация по поисковой строке и параметрам
  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return movies.filter((movie) => {
      // 1. Поиск по подстроке (название, оригинальное название, режиссёр)
      if (query !== '') {
        const matchesTitle = movie.title.toLowerCase().includes(query)
        const matchesOriginal = movie.originalTitle.toLowerCase().includes(query)
        const matchesDirector = movie.directorOrCreator.toLowerCase().includes(query)
        if (!matchesTitle && !matchesOriginal && !matchesDirector) {
          return false
        }
      }

      // 2. Фильтр по жанру
      if (genreFilter !== 'all' && movie.genre !== genreFilter) {
        return false
      }

      // 3. Фильтр по статусу просмотра
      if (statusFilter !== 'all' && movie.status !== statusFilter) {
        return false
      }

      // 4. Фильтр по формату (фильм / сериал)
      if (typeFilter !== 'all' && movie.type !== typeFilter) {
        return false
      }

      return true
    })
  }, [movies, searchQuery, genreFilter, statusFilter, typeFilter])

  const isFiltered =
    searchQuery.trim() !== '' ||
    genreFilter !== 'all' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all'

  const handleResetFilters = () => {
    setSearchQuery('')
    setGenreFilter('all')
    setStatusFilter('all')
    setTypeFilter('all')
  }

  return (
    <section className="page-section">
      <div className="page-header-row">
        <div>
          <h1>Моя медиатека</h1>
          <p className="page-description">
            Персональный каталог фильмов и сериалов с синхронизацией в облачной базе Supabase.
          </p>
        </div>
        <Link to="/movies/new" className="button-primary">
          + Добавить фильм
        </Link>
      </div>

      {/* Панель поиска и многопараметрической фильтрации (ЛР 7) */}
      <div className="search-filter-panel">
        <div className="search-row">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, оригиналу или режиссёру..."
              className="search-input"
              aria-label="Поиск по каталогу"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-select-group">
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="filter-select"
              aria-label="Фильтр по жанру"
            >
              <option value="all">Все жанры</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilterOption)}
              className="filter-select"
              aria-label="Фильтр по формату"
            >
              <option value="all">Все форматы</option>
              <option value="movie">Только фильмы</option>
              <option value="series">Только сериалы</option>
            </select>
          </div>
        </div>

        <div className="filter-chips-row">
          <div className="filter-chips">
            {statusFilterOptions.map((opt) => (
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

          {isFiltered && (
            <div className="filter-status-actions">
              <span className="filter-results-badge">
                Найдено: {filteredMovies.length} из {movies.length}
              </span>
              <button
                type="button"
                className="filter-reset-button"
                onClick={handleResetFilters}
              >
                ✕ Сбросить все фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Список фильмов либо пустые состояния */}
      {movies.length === 0 ? (
        <div className="empty-placeholder">
          <h3>Каталог пуст</h3>
          <p>В вашей личной базе данных пока нет ни одного фильма или сериала.</p>
          <Link to="/movies/new" className="button-primary" style={{ marginTop: '1rem' }}>
            + Добавить первый фильм
          </Link>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="empty-placeholder">
          <h3>Ничего не найдено</h3>
          <p>По заданным параметрам поиска и фильтрации совпадений не обнаружено.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="button-primary"
              onClick={handleResetFilters}
            >
              Показать все картины ({movies.length})
            </button>
          </div>
        </div>
      ) : (
        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              genreName={genreMap.get(movie.genre)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
