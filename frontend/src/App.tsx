import './App.css'

const appTitle: string = 'Каталог фильмов и сериалов'


export default function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>{appTitle}</h1>
        <p className="subtitle">
          Персональная медиатека: списки к просмотру, оценки и избранное.
        </p>
      </header>

      <section aria-labelledby="items-title" className="catalog-section">
        <h2 id="items-title">Мои фильмы и сериалы</h2>
        <div className="empty-placeholder">
          <p>Здесь появится каталог добавленных фильмов и сериалов.</p>
          <span className="badge">Раздел в разработке (ЛР 2)</span>
        </div>
      </section>
    </main>
  )
}
