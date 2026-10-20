import { Link } from 'react-router'

export function NewMoviePage() {
  return (
    <section className="page-section new-entry-box">
      <h1>Добавление фильма или сериала</h1>
      <p className="page-description">
        Интерактивная форма добавления, валидация полей и сохранение новых записей появятся в <strong>Лабораторной работе №3</strong>.
      </p>

      <div className="stub-info-card">
        <p>
          В следующей работе здесь можно будет указать название, жанр, статус просмотра, рейтинг и описание картины.
        </p>
      </div>

      <div className="new-entry-actions">
        <Link to="/movies" className="button-secondary">
          ← Вернуться в каталог
        </Link>
      </div>
    </section>
  )
}
