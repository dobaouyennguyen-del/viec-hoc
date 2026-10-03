-- Chạy file này trong Supabase Dashboard -> SQL Editor

create table if not exists public.tasks (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);

-- Bật Row Level Security: mỗi người chỉ xem và sửa được công việc của mình
alter table public.tasks enable row level security;

create policy "Xem công việc của mình" on public.tasks
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Thêm công việc của mình" on public.tasks
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Sửa công việc của mình" on public.tasks
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Xóa công việc của mình" on public.tasks
  for delete to authenticated
  using ((select auth.uid()) = user_id);
