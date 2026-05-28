-- Create the inquiries table
create table public.inquiries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  service_type text not null,
  design_preference text not null,
  budget_range text not null,
  timeline text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  company_name text,
  project_notes text,
  status text not null default 'In Review' check (status in ('In Review', 'Blueprint Phase', 'Engineering', 'Deploying', 'Completed')),
  created_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.inquiries enable row level security;

-- Policy: Enable anyone (including anonymous visitors) to submit inquiries
create policy "Enable insert for all users" on public.inquiries
  for insert
  with check (true);

-- Policy: Enable users to view their own inquiries
create policy "Enable select for users who created them" on public.inquiries
  for select
  using (auth.uid() = user_id);
