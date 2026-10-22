-- Миграция для Лабораторной работы №7: Связанный сценарий (Рецензии и заметки к фильмам)
-- Таблица public.movie_reviews со связью foreign key и каскадным удалением

-- 1. Создание таблицы рецензий и заметок пользователя к медиазаписям
create table public.movie_reviews (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media_entries(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  review_text text not null,
  rating numeric(3, 1) not null,
  watched_date date not null default current_date,
  created_at timestamptz not null default now(),

  constraint movie_reviews_text_length
    check (char_length(btrim(review_text)) >= 3),
  constraint movie_reviews_rating_range
    check (rating between 1.0 and 10.0)
);

-- 2. Индексы для ускорения выборок по фильму и пользователю
create index idx_movie_reviews_media_id on public.movie_reviews(media_id);
create index idx_movie_reviews_owner_id on public.movie_reviews(owner_id);

-- 3. Включение Row Level Security (RLS)
alter table public.movie_reviews enable row level security;

-- Отзыв клиентских прав по умолчанию
revoke all on table public.movie_reviews from anon, authenticated;

-- Выдача прав роли authenticated для работы со своими рецензиями
grant select, insert, update, delete on table public.movie_reviews to authenticated;

-- 4. Политики изоляции данных (RLS) по auth.uid() = owner_id

-- Пользователь видит только свои рецензии
create policy "movie_reviews_select_own"
  on public.movie_reviews
  for select
  to authenticated
  using (auth.uid() = owner_id);

-- Пользователь может добавлять рецензии только со своим owner_id
create policy "movie_reviews_insert_own"
  on public.movie_reviews
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Пользователь может изменять только свои рецензии
create policy "movie_reviews_update_own"
  on public.movie_reviews
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Пользователь может удалять только свои рецензии
create policy "movie_reviews_delete_own"
  on public.movie_reviews
  for delete
  to authenticated
  using (auth.uid() = owner_id);
