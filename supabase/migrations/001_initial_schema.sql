-- ============================================================
-- ArtSyntax – Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ============================================================
-- 1. admin_users table (must be created first – referenced by prompts RLS)
-- ============================================================
create table if not exists public.admin_users (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Users can only see their own row (used for middleware admin check)
create policy "admin_users_self_select"
  on public.admin_users for select
  using (auth.uid() = id);

-- ============================================================
-- 2. prompts table
-- ============================================================
create table if not exists public.prompts (
  id              uuid        primary key default gen_random_uuid(),
  title           text        not null,
  image_url       text        not null,
  core_prompt     text        not null,
  negative_prompt text        not null default '',
  model           text        not null,
  category        text        not null,
  aspect_ratio    text        not null,
  seed            bigint,
  steps           integer,
  cfg_scale       numeric(5,2),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger prompts_updated_at
  before update on public.prompts
  for each row execute procedure public.set_updated_at();

-- Row-Level Security
alter table public.prompts enable row level security;

-- Anyone can read
create policy "prompts_select_public"
  on public.prompts for select
  using (true);

-- Only admins can insert / update / delete
create policy "prompts_insert_admin"
  on public.prompts for insert
  with check (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "prompts_update_admin"
  on public.prompts for update
  using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "prompts_delete_admin"
  on public.prompts for delete
  using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- ============================================================
-- 3. Seed data
-- ============================================================
insert into public.prompts
  (title, image_url, core_prompt, negative_prompt, model, category, aspect_ratio, seed, steps, cfg_scale)
values
  ('Cosmic Dreamscape',
   'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=800&auto=format&fit=crop&q=80',
   'ethereal cosmic landscape, swirling nebulas in deep purple and cyan, floating crystalline structures, bioluminescent flora, cinematic lighting, volumetric fog, 8k ultra detailed, artstation trending',
   'blurry, low quality, pixelated, watermark, text, logo',
   'Midjourney v6', 'Landscape', '16:9', 42891, 50, 7.5),
  ('Abstract Geometry',
   'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
   'abstract geometric composition, flowing organic shapes, gradient mesh, soft pastels mixed with bold accents, minimalist design, clean edges, studio lighting',
   'noisy, cluttered, photorealistic, faces, text',
   'DALL-E 3', 'Abstract', '1:1', 12847, 40, 8.0),
  ('Neon Metropolis',
   'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop&q=80',
   'cyberpunk cityscape at night, neon signs reflecting on wet streets, towering skyscrapers, flying vehicles, atmospheric fog, blade runner aesthetic, hyper detailed',
   'daylight, empty streets, low detail, cartoon style',
   'Stable Diffusion XL', 'Sci-Fi', '21:9', 98234, 45, 7.0),
  ('Celestial Portrait',
   'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format&fit=crop&q=80',
   'portrait of ethereal being made of stardust, glowing constellation patterns on skin, cosmic backdrop, soft rim lighting, dreamy atmosphere, fine art photography style',
   'ugly, deformed, disfigured, poor anatomy, bad hands',
   'Midjourney v6', 'Portrait', '4:5', 55123, 50, 8.5),
  ('Fluid Dynamics',
   'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
   'macro photography of colorful liquid art, swirling paint drops in water, vibrant color explosion, high speed capture, pristine white background, commercial quality',
   'murky, dark, low saturation, grainy',
   'DALL-E 3', 'Abstract', '1:1', 77456, 35, 6.5);

-- ============================================================
-- HOW TO CREATE YOUR FIRST ADMIN USER
-- 1. Create a user in Dashboard → Authentication → Users
-- 2. Copy the user UUID
-- 3. Run:
--    insert into public.admin_users (id, email)
--    values ('<user-uuid>', '<user-email>');
-- ============================================================
