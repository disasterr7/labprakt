import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { AuthProvider, useAuth } from './context/AuthContext'
import { movies as initialMovies } from './data/movies'
import { EditMoviePage } from './pages/EditMoviePage'
import { LoginPage } from './pages/LoginPage'
import { MovieDetailsPage } from './pages/MovieDetailsPage'
import { MoviesPage } from './pages/MoviesPage'
import { NewMoviePage } from './pages/NewMoviePage'
import { NotFoundPage } from './pages/NotFoundPage'
import {
  createUserMovie,
  deleteUserMovie,
  fetchUserMovies,
  updateUserMovie,
} from './services/movies'
import type { Movie, MovieDraft } from './types/movie'
import './App.css'

function AppRoutes() {
  const { user } = useAuth()
  const [movies, setMovies] = useState<Movie[]>(() =>
    initialMovies.map((movie) => ({ ...movie })),
  )

  useEffect(() => {
    let active = true

    if (user) {
      fetchUserMovies()
        .then((userMovies) => {
          if (active) {
            setMovies(userMovies)
          }
        })
        .catch((err) => {
          console.error('Ошибка загрузки фильмов из Supabase:', err)
        })
    } else {
      // Гостевой режим: начальные демонстрационные записи
      setMovies(initialMovies.map((movie) => ({ ...movie })))
    }

    return () => {
      active = false
    }
  }, [user])

  const handleCreateMovie = async (draft: MovieDraft): Promise<string> => {
    if (user) {
      const created = await createUserMovie(draft, user.id)
      setMovies((prev) => [created, ...prev])
      return created.id
    }

    // Гостевой режим (локальный генератор)
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

  const handleUpdateMovie = async (id: string, draft: MovieDraft) => {
    if (user) {
      await updateUserMovie(id, draft)
    }

    setMovies((prev) =>
      prev.map((item) => (item.id === id ? { ...draft, id } : item)),
    )
  }

  const handleDeleteMovie = async (id: string) => {
    if (user) {
      await deleteUserMovie(id)
    }

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
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
