import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export function AppLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-brand">
          <Link to="/movies" className="app-title">Каталог фильмов и сериалов</Link>
        </div>

        <nav aria-label="Основная навигация" className="app-nav">
          <NavLink to="/movies" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Каталог
          </NavLink>
          <NavLink to="/movies/new" className={({ isActive }) => (isActive ? 'active' : '')}>
            Добавить
          </NavLink>

          {user ? (
            <div className="user-profile-badge">
              <span className="user-email-text" title={user.email}>
                👤 {user.email}
              </span>
              <button
                type="button"
                className="button-logout"
                onClick={signOut}
                title="Выйти из учетной записи"
              >
                Выйти
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Войти
            </NavLink>
          )}
        </nav>
      </header>

      {user ? (
        <div className="memory-banner memory-banner-active" role="status">
          <span className="memory-banner-icon">☁️</span>
          <span className="memory-banner-text">
            <strong>База данных Supabase подключена:</strong> Записи привязаны к вашему аккаунту (<em>{user.email}</em>) и сохраняются при перезагрузке (F5).
          </span>
        </div>
      ) : (
        <div className="memory-banner" role="status">
          <span className="memory-banner-icon">ℹ️</span>
          <span className="memory-banner-text">
            <strong>Гостевой режим:</strong> Чтобы сохранять фильмы в персональную облачную базу данных, <Link to="/login">войдите в аккаунт</Link>.
          </span>
        </div>
      )}

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
