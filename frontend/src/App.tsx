import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { movies as initialMovies } from './data/movies'
import { EditMoviePage } from './pages/EditMoviePage'
import { MovieDetailsPage } from './pages/MovieDetailsPage'
import { MoviesPage } from './pages/MoviesPage'
import { NewMoviePage } from './pages/NewMoviePage'
import { NotFoundPage } from './pages/NotFoundPage'
import type { Movie, MovieDraft } from './types/movie'
import './App.css'

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(() =>
    initialMovies.map((movie) => ({ ...movie })),
  )

  const handleCreateMovie = (draft: MovieDraft): string => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `m-${Date.now()}`

    const newMovie: Movie = {
      ...draft,
      id: newId,
    }

    setMovies((prev) => [newMovie, ...prev])
    return newId
  }

  const handleUpdateMovie = (id: string, draft: MovieDraft) => {
    setMovies((prev) =>
      prev.map((item) => (item.id === id ? { ...draft, id } : item)),
    )
  }

  const handleDeleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/movies" replace />} />
        <Route path="movies" element={<MoviesPage movies={movies} />} />
        <Route
          path="movies/new"
          element={<NewMoviePage onCreate={handleCreateMovie} />}
        />
        <Route
          path="movies/:id"
          element={
            <MovieDetailsPage movies={movies} onDelete={handleDeleteMovie} />
          }
        />
        <Route
          path="movies/:id/edit"
          element={
            <EditMoviePage movies={movies} onUpdate={handleUpdateMovie} />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
