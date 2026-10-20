import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { MoviesPage } from './pages/MoviesPage'
import { MovieDetailsPage } from './pages/MovieDetailsPage'
import { NewMoviePage } from './pages/NewMoviePage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/movies" replace />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="movies/new" element={<NewMoviePage />} />
        <Route path="movies/:id" element={<MovieDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
