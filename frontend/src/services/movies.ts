import { supabase } from '../lib/supabase'
import type { Movie, MovieDraft, MoviePriority, MovieStatus, MovieType } from '../types/movie'

interface DatabaseMediaEntry {
  id: string
  owner_id: string
  genre_id: string
  title: string
  original_title: string
  description: string
  type: MovieType
  release_year: number
  rating: number
  status: MovieStatus
  priority: MoviePriority
  duration_or_episodes: string
  director_or_creator: string
  created_at: string
}

function mapToMovie(row: DatabaseMediaEntry): Movie {
  return {
    id: row.id,
    title: row.title,
    originalTitle: row.original_title || '',
    description: row.description || '',
    type: row.type,
    genre: row.genre_id,
    releaseYear: row.release_year,
    rating: Number(row.rating),
    status: row.status,
    priority: row.priority,
    durationOrEpisodes: row.duration_or_episodes || '',
    directorOrCreator: row.director_or_creator || '',
  }
}

export async function fetchUserMovies(signal?: AbortSignal): Promise<Movie[]> {
  let query = supabase
    .from('media_entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Не удалось загрузить фильмы: ${error.message}`)
  }

  return (data as DatabaseMediaEntry[]).map(mapToMovie)
}

export async function createUserMovie(
  draft: MovieDraft,
  userId: string,
): Promise<Movie> {
  const insertPayload = {
    owner_id: userId,
    genre_id: draft.genre,
    title: draft.title,
    original_title: draft.originalTitle,
    description: draft.description,
    type: draft.type,
    release_year: draft.releaseYear,
    rating: draft.rating,
    status: draft.status,
    priority: draft.priority,
    duration_or_episodes: draft.durationOrEpisodes,
    director_or_creator: draft.directorOrCreator,
  }

  const { data, error } = await supabase
    .from('media_entries')
    .insert([insertPayload])
    .select()
    .single()

  if (error) {
    throw new Error(`Не удалось сохранить фильм в базе данных: ${error.message}`)
  }

  return mapToMovie(data as DatabaseMediaEntry)
}

export async function updateUserMovie(
  id: string,
  draft: MovieDraft,
): Promise<void> {
  const updatePayload = {
    genre_id: draft.genre,
    title: draft.title,
    original_title: draft.originalTitle,
    description: draft.description,
    type: draft.type,
    release_year: draft.releaseYear,
    rating: draft.rating,
    status: draft.status,
    priority: draft.priority,
    duration_or_episodes: draft.durationOrEpisodes,
    director_or_creator: draft.directorOrCreator,
  }

  const { error } = await supabase
    .from('media_entries')
    .update(updatePayload)
    .eq('id', id)

  if (error) {
    throw new Error(`Не удалось обновить фильм в базе данных: ${error.message}`)
  }
}

export async function deleteUserMovie(id: string): Promise<void> {
  const { error } = await supabase
    .from('media_entries')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Не удалось удалить фильм из базы данных: ${error.message}`)
  }
}
