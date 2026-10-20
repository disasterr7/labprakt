import { Link } from 'react-router'

export function NewMoviePage() {
  return (
    <section className="page-section">
      <div className="form-container">
        <header className="form-header">
          <h1>Добавление фильма или сериала</h1>
          <p className="page-description">
            Заполните данные о картине для добавления в персональную медиатеку.
          </p>
        </header>

        <form className="movie-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="movie-title">Название картины *</label>
            <input
              id="movie-title"
              type="text"
              placeholder="Например: Интерстеллар"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-original-title">Оригинальное название</label>
            <input
              id="movie-original-title"
              type="text"
              placeholder="Например: Interstellar"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="movie-type">Формат</label>
              <select id="movie-type" className="form-input" defaultValue="movie">
                <option value="movie">Фильм</option>
                <option value="series">Сериал</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="movie-year">Год выпуска</label>
              <input
                id="movie-year"
                type="number"
                placeholder="2024"
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="movie-status">Статус</label>
              <select id="movie-status" className="form-input" defaultValue="planned">
                <option value="planned">В планах</option>
                <option value="watching">Смотрю</option>
                <option value="watched">Просмотрено</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="movie-genre">Жанры</label>
            <input
              id="movie-genre"
              type="text"
              placeholder="Например: Фантастика, Драма, Приключения"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-director">Режиссёр / Создатель</label>
            <input
              id="movie-director"
              type="text"
              placeholder="Например: Кристофер Нолан"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-description">Описание сюжета</label>
            <textarea
              id="movie-description"
              rows={4}
              placeholder="Краткое содержание или ваши личные заметки о фильме..."
              className="form-input form-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary">
              Сохранить фильм
            </button>
            <Link to="/movies" className="button-secondary">
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}
