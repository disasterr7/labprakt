import { Link, useNavigate, useParams } from 'react-router'
import { MovieForm } from '../components/MovieForm'
import type { Movie, MovieDraft } from '../types/movie'

interface EditMoviePageProps {
  movies: Movie[]
  onUpdate: (id: string, draft: MovieDraft) => void
}

export function EditMoviePage({ movies, onUpdate }: EditMoviePageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

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

  const handleSave = (draft: MovieDraft) => {
    onUpdate(movie.id, draft)
    navigate(`/movies/${movie.id}`)
  }

  const handleCancel = () => {
    navigate(`/movies/${movie.id}`)
  }

  return (
    <section className="page-section">
      <div className="form-container">
        <header className="form-header">
          <h1>Редактирование картины</h1>
          <p className="page-description">
            Изменение параметров для: <strong>{movie.title}</strong>
          </p>
        </header>

        <MovieForm
          key={movie.id}
          initialValues={movie}
          onSave={handleSave}
          onCancel={handleCancel}
          submitButtonText="Сохранить изменения"
        />
      </div>
    </section>
  )
}
