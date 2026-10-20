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

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
