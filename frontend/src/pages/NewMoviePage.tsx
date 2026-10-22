import { useNavigate } from 'react-router'
import { MovieForm } from '../components/MovieForm'
import type { MovieDraft } from '../types/movie'

interface NewMoviePageProps {
  onCreate: (draft: MovieDraft) => Promise<string> | string
}

const defaultDraft: MovieDraft = {
  title: '',
  originalTitle: '',
  description: '',
  type: 'movie',
  genre: '',
  releaseYear: new Date().getFullYear(),
  rating: 7.0,
  status: 'planned',
  priority: 'medium',
  durationOrEpisodes: '',
  directorOrCreator: '',
}

export function NewMoviePage({ onCreate }: NewMoviePageProps) {
  const navigate = useNavigate()

  const handleSave = async (draft: MovieDraft) => {
    const newId = await onCreate(draft)
    navigate(`/movies/${newId}`)
  }

  const handleCancel = () => {
    navigate('/movies')
  }

  return (
    <section className="page-section">
      <div className="form-container">
        <header className="form-header">
          <h1>Добавление фильма или сериала</h1>
          <p className="page-description">
            Заполните данные о картине для добавления в персональную медиатеку.
          </p>
        </header>

        <MovieForm
          initialValues={defaultDraft}
          onSave={handleSave}
          onCancel={handleCancel}
          submitButtonText="Добавить фильм"
        />
      </div>
    </section>
  )
}
