-- ============================================
-- Studio Valentin - Database Schema
-- Execute this SQL in Supabase SQL Editor
-- ============================================

-- 1. Players table (simple auth with name + 4-digit PIN)
create table players (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  pin text not null,
  created_at timestamptz default now()
);

-- 2. Rooms table
create table rooms (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  admin_id uuid references players(id) not null,
  max_players int not null default 4,
  status text not null default 'waiting',
  current_phrase_id uuid,
  created_at timestamptz default now()
);

-- 3. Room players (junction table with scores)
create table room_players (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  player_id uuid references players(id) not null,
  score int default 0,
  unique(room_id, player_id)
);

-- 4. Phrases
create table phrases (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  player_id uuid references players(id) not null,
  content text not null,
  used boolean default false,
  unique(room_id, player_id)
);

-- 5. Votes
create table votes (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  phrase_id uuid references phrases(id) not null,
  voter_id uuid references players(id) not null,
  voted_for_id uuid references players(id) not null,
  unique(room_id, phrase_id, voter_id)
);

-- Add foreign key for current_phrase_id
alter table rooms add constraint rooms_current_phrase_fk
  foreign key (current_phrase_id) references phrases(id);

-- ============================================
-- Row Level Security (permissive for party game)
-- ============================================
alter table players enable row level security;
alter table rooms enable row level security;
alter table room_players enable row level security;
alter table phrases enable row level security;
alter table votes enable row level security;

create policy "Allow all on players" on players for all using (true) with check (true);
create policy "Allow all on rooms" on rooms for all using (true) with check (true);
create policy "Allow all on room_players" on room_players for all using (true) with check (true);
create policy "Allow all on phrases" on phrases for all using (true) with check (true);
create policy "Allow all on votes" on votes for all using (true) with check (true);

-- ============================================
-- Enable Realtime
-- ============================================
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table room_players;
alter publication supabase_realtime add table phrases;
alter publication supabase_realtime add table votes;
