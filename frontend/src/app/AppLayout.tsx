import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="app-title">Каталог фильмов и сериалов</p>
        <nav aria-label="Основная навигация" className="app-nav">
          <NavLink to="/movies" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Каталог
          </NavLink>
          <NavLink to="/movies/new" className={({ isActive }) => (isActive ? 'active' : '')}>
            Добавить
          </NavLink>
        </nav>
      </header>

      <div className="memory-banner" role="status">
        <span className="memory-banner-icon">ℹ️</span>
        <span className="memory-banner-text">
          <strong>Внимание:</strong> Данные хранятся в оперативной памяти (React-состояние). При перезагрузке страницы (F5) список вернется к исходным данным.
        </span>
      </div>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
