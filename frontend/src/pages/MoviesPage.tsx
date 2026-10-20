import { Link } from 'react-router'
import { MovieCard } from '../components/MovieCard'
import { movies } from '../data/movies'

export function MoviesPage() {
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

      {movies.length === 0 ? (
        <div className="empty-placeholder">
          <p>Фильмов и сериалов пока нет в каталоге.</p>
        </div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  )
}
