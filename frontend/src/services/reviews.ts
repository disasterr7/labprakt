import { supabase } from '../lib/supabase'
import type { MovieReview, MovieReviewDraft } from '../types/movie'

interface DatabaseMovieReview {
  id: string
  media_id: string
  owner_id: string
  review_text: string
  rating: number
  watched_date: string
  created_at: string
}

function mapToReview(row: DatabaseMovieReview): MovieReview {
  return {
    id: row.id,
    mediaId: row.media_id,
    reviewText: row.review_text,
    rating: Number(row.rating),
    watchedDate: row.watched_date,
    createdAt: row.created_at,
  }
}

export async function fetchReviewsByMovieId(
  mediaId: string,
  signal?: AbortSignal,
): Promise<MovieReview[]> {
  let query = supabase
    .from('movie_reviews')
    .select('*')
    .eq('media_id', mediaId)
    .order('created_at', { ascending: false })

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Не удалось загрузить рецензии к фильму: ${error.message}`)
  }

  return (data as DatabaseMovieReview[]).map(mapToReview)
}

export async function createMovieReview(
  draft: MovieReviewDraft,
  userId: string,
): Promise<MovieReview> {
  const insertPayload = {
    media_id: draft.mediaId,
    owner_id: userId,
    review_text: draft.reviewText.trim(),
    rating: draft.rating,
    watched_date: draft.watchedDate || new Date().toISOString().split('T')[0],
  }

  const { data, error } = await supabase
    .from('movie_reviews')
    .insert([insertPayload])
    .select()
    .single()

  if (error) {
    throw new Error(`Не удалось сохранить рецензию: ${error.message}`)
  }

  return mapToReview(data as DatabaseMovieReview)
}

export async function deleteMovieReview(id: string): Promise<void> {
  const { error } = await supabase.from('movie_reviews').delete().eq('id', id)

  if (error) {
    throw new Error(`Не удалось удалить рецензию: ${error.message}`)
  }
}
