-- Миграция начальной схемы данных для проекта «Каталог фильмов и сериалов»
-- Лабораторная работа №5: Схема данных и справочник в Supabase

-- 1. Таблица-справочник жанров
create table public.genres (
  id text primary key,
  name text not null unique,
  constraint genres_id_not_blank
    check (id = btrim(id) and id <> ''),
  constraint genres_name_not_blank
    check (name = btrim(name) and name <> '')
);

-- 2. Таблица основных записей медиатеки пользователя
create table public.media_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  genre_id text not null references public.genres(id)
    on update cascade on delete restrict,
  title text not null,
  original_title text not null default '',
  description text not null default '',
  type text not null,
  release_year integer not null,
  rating numeric(3, 1) not null,
  status text not null,
  priority text not null,
  duration_or_episodes text not null default '',
  director_or_creator text not null default '',
  created_at timestamptz not null default now(),

  constraint media_entries_title_length
    check (char_length(btrim(title)) between 2 and 100),
  constraint media_entries_type_allowed
    check (type in ('movie', 'series')),
  constraint media_entries_year_allowed
    check (release_year between 1895 and 2100),
  constraint media_entries_rating_allowed
    check (rating between 1.0 and 10.0),
  constraint media_entries_status_allowed
    check (status in ('planned', 'watching', 'watched')),
  constraint media_entries_priority_allowed
    check (priority in ('low', 'medium', 'high'))
);

-- 3. Настройка Row Level Security (RLS) и минимальных прав доступа
alter table public.genres enable row level security;
alter table public.media_entries enable row level security;

-- Отзыв всех клиентских прав по умолчанию
revoke all on table public.genres from anon, authenticated;
revoke all on table public.media_entries from anon, authenticated;

-- Разрешение публичного чтения справочника жанров для всех пользователей
grant select on table public.genres to anon, authenticated;

create policy "genres are publicly readable"
  on public.genres
  for select
  to anon, authenticated
  using (true);

-- Примечание: Таблица media_entries закрыта для клиентских ролей до ЛР 6 (подключение Supabase Auth).
