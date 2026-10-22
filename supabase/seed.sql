-- Начальные справочные данные (seed.sql)
-- Лабораторная работа №5: Справочник жанров кино и сериалов

insert into public.genres (id, name)
values
  ('sci-fi', 'Научная фантастика'),
  ('drama', 'Драма'),
  ('crime', 'Криминал'),
  ('action', 'Боевик'),
  ('thriller', 'Триллер'),
  ('comedy', 'Комедия'),
  ('horror', 'Ужасы')
on conflict (id) do update
set name = excluded.name;
