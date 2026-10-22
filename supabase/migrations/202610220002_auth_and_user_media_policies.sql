-- Миграция для Лабораторной работы №6: Аутентификация и политики RLS для личных записей

-- 1. Выдача прав роли authenticated на таблицу media_entries
grant select, insert, update, delete on table public.media_entries to authenticated;

-- 2. Политики Row Level Security (RLS) для изоляции данных между пользователями

-- Пользователь видит только свои записи
create policy "Users can view own media entries"
  on public.media_entries
  for select
  to authenticated
  using (auth.uid() = owner_id);

-- Пользователь может добавлять записи только с собственным owner_id
create policy "Users can insert own media entries"
  on public.media_entries
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Пользователь может обновлять только свои записи
create policy "Users can update own media entries"
  on public.media_entries
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Пользователь может удалять только свои записи
create policy "Users can delete own media entries"
  on public.media_entries
  for delete
  to authenticated
  using (auth.uid() = owner_id);
