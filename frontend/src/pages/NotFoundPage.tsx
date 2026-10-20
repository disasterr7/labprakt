import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="page-section not-found-box">
      <h1>404 — Страница не найдена</h1>
      <p className="page-description">
        Запрошенный веб-адрес не существует в нашем каталоге фильмов.
      </p>
      <Link to="/movies" className="button-primary">
        ← Перейти в каталог фильмов
      </Link>
    </section>
  )
}
