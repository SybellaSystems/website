-- Supabase operational workspace schema for all admin feature modules.
-- Paste this script directly into Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.workspace_modules (
  feature_key text primary key,
  title text not null,
  mission text not null,
  default_owner_role text not null default 'manager',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(feature_key) > 1)
);

insert into public.workspace_modules (feature_key, title, mission, default_owner_role)
values
  ('tasks', 'Tasks', 'Coordinate execution workload across teams.', 'manager'),
  ('goals', 'Goals', 'Drive measurable objective ownership and progress.', 'executive'),
  ('approvals', 'Approvals', 'Govern critical operational decisions.', 'executive'),
  ('calendar', 'Calendar', 'Align execution timelines and scheduling.', 'manager'),
  ('checkins', 'Check-ins', 'Capture wellbeing, blockers, and support signals.', 'manager'),
  ('announcements', 'Announcements', 'Broadcast internal updates and narratives.', 'executive'),
  ('wiki', 'Wiki', 'Build structured institutional knowledge.', 'manager'),
  ('reports', 'Reports', 'Publish operational and leadership reporting outputs.', 'executive'),
  ('accountability', 'Accountability', 'Track ownership, commitments, and follow-through.', 'manager'),
  ('progress', 'Progress & KPIs', 'Monitor delivery and KPI trends in realtime.', 'executive'),
  ('trust', 'Trust Scores', 'Track confidence and cross-team trust factors.', 'manager'),
  ('burnout', 'Burnout Watch', 'Detect burnout risk and intervention opportunities.', 'manager'),
  ('timeline', 'Timeline', 'Stream company-wide operational activity.', 'manager'),
  ('alerts', 'Alerts', 'Manage incidents and escalation workflows.', 'executive'),
  ('integrations', 'Integrations', 'Observe and operate external system sync jobs.', 'executive'),
  ('ai-assistant', 'AI Assistant', 'Operationalize AI copilots and insights.', 'manager'),
  ('audit', 'Audit Log', 'Provide secure and accountable event history.', 'executive'),
  ('os', 'Internal OS', 'Unify connected workflows across all modules.', 'executive')
on conflict (feature_key) do update set
  title = excluded.title,
  mission = excluded.mission,
  default_owner_role = excluded.default_owner_role,
  is_active = true,
  updated_at = now();

create table if not exists public.workspace_records (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null references public.workspace_modules(feature_key) on delete cascade,
  title text not null check (char_length(title) between 2 and 180),
  description text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium',
  severity text not null default 'normal',
  assignee_name text,
  due_at timestamptz,
  starts_at timestamptz,
  linked_module text references public.workspace_modules(feature_key),
  linked_record_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (status in ('todo', 'in_progress', 'blocked', 'review', 'approved', 'done', 'cancelled')),
  check (priority in ('low', 'medium', 'high', 'critical')),
  check (severity in ('info', 'normal', 'major', 'critical'))
);

create index if not exists idx_workspace_records_feature on public.workspace_records (feature_key, created_at desc);
create index if not exists idx_workspace_records_status on public.workspace_records (feature_key, status);
create index if not exists idx_workspace_records_due on public.workspace_records (due_at);
create index if not exists idx_workspace_records_linked on public.workspace_records (linked_module, linked_record_id);
create index if not exists idx_workspace_records_metadata_gin on public.workspace_records using gin (metadata);

create table if not exists public.workspace_comments (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.workspace_records(id) on delete cascade,
  feature_key text not null references public.workspace_modules(feature_key) on delete cascade,
  author_name text not null default 'system',
  body text not null check (char_length(body) between 2 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists idx_workspace_comments_record_created on public.workspace_comments (record_id, created_at desc);

create table if not exists public.workspace_attachments (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.workspace_records(id) on delete cascade,
  feature_key text not null references public.workspace_modules(feature_key) on delete cascade,
  file_path text not null,
  file_name text not null,
  mime_type text,
  bytes bigint not null default 0,
  uploaded_by text not null default 'system',
  created_at timestamptz not null default now()
);
create index if not exists idx_workspace_attachments_record on public.workspace_attachments (record_id, created_at desc);

create table if not exists public.workspace_approvals (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.workspace_records(id) on delete cascade,
  feature_key text not null references public.workspace_modules(feature_key) on delete cascade,
  decision text not null check (decision in ('pending', 'approved', 'rejected')),
  decided_by text,
  reason text not null default '',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_workspace_approvals_record on public.workspace_approvals (record_id, created_at desc);

create table if not exists public.workspace_notifications (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null references public.workspace_modules(feature_key) on delete cascade,
  record_id uuid references public.workspace_records(id) on delete cascade,
  event_type text not null,
  message text not null,
  target_role text not null default 'manager',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_workspace_notifications_feature on public.workspace_notifications (feature_key, is_read, created_at desc);

create table if not exists public.workspace_activity (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null references public.workspace_modules(feature_key) on delete cascade,
  record_id uuid references public.workspace_records(id) on delete set null,
  event_type text not null,
  actor_name text not null default 'system',
  details text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_workspace_activity_feature on public.workspace_activity (feature_key, created_at desc);
create index if not exists idx_workspace_activity_record on public.workspace_activity (record_id, created_at desc);

create or replace function public.set_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_workspace_modules_updated_at on public.workspace_modules;
create trigger trg_workspace_modules_updated_at before update on public.workspace_modules
for each row execute function public.set_updated_at_column();

drop trigger if exists trg_workspace_records_updated_at on public.workspace_records;
create trigger trg_workspace_records_updated_at before update on public.workspace_records
for each row execute function public.set_updated_at_column();

create or replace function public.track_workspace_record_activity()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.workspace_activity(feature_key, record_id, event_type, actor_name, details, payload)
    values (new.feature_key, new.id, 'record_created', new.created_by, new.title, jsonb_build_object('status', new.status, 'priority', new.priority));

    insert into public.workspace_notifications(feature_key, record_id, event_type, message, target_role)
    values (new.feature_key, new.id, 'record_created', concat('New ', new.feature_key, ' record: ', new.title), 'manager');
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.workspace_activity(feature_key, record_id, event_type, actor_name, details, payload)
    values (
      new.feature_key,
      new.id,
      'record_updated',
      coalesce(new.created_by, 'system'),
      concat('Status ', old.status, ' -> ', new.status),
      jsonb_build_object('old_status', old.status, 'new_status', new.status, 'old_priority', old.priority, 'new_priority', new.priority)
    );

    if old.status is distinct from new.status and new.status = 'blocked' then
      insert into public.workspace_notifications(feature_key, record_id, event_type, message, target_role)
      values (new.feature_key, new.id, 'blocked', concat('Blocked item needs attention: ', new.title), 'executive');
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.workspace_activity(feature_key, record_id, event_type, actor_name, details, payload)
    values (old.feature_key, old.id, 'record_deleted', coalesce(old.created_by, 'system'), old.title, '{}'::jsonb);
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_workspace_records_activity on public.workspace_records;
create trigger trg_workspace_records_activity
after insert or update or delete on public.workspace_records
for each row execute function public.track_workspace_record_activity();

create or replace view public.workspace_feature_snapshot as
select
  m.feature_key,
  m.title,
  count(r.id) filter (where r.deleted_at is null) as total_records,
  count(r.id) filter (where r.status = 'in_progress' and r.deleted_at is null) as in_progress_records,
  count(r.id) filter (where r.status = 'blocked' and r.deleted_at is null) as blocked_records,
  count(r.id) filter (where r.status in ('approved', 'done') and r.deleted_at is null) as completed_records,
  count(n.id) filter (where n.is_read = false) as unread_notifications,
  max(r.updated_at) as last_record_update_at
from public.workspace_modules m
left join public.workspace_records r on r.feature_key = m.feature_key
left join public.workspace_notifications n on n.feature_key = m.feature_key
group by m.feature_key, m.title;

alter table public.workspace_modules enable row level security;
alter table public.workspace_records enable row level security;
alter table public.workspace_comments enable row level security;
alter table public.workspace_attachments enable row level security;
alter table public.workspace_approvals enable row level security;
alter table public.workspace_notifications enable row level security;
alter table public.workspace_activity enable row level security;

drop policy if exists workspace_modules_read on public.workspace_modules;
create policy workspace_modules_read on public.workspace_modules for select to anon, authenticated using (true);

drop policy if exists workspace_records_read on public.workspace_records;
create policy workspace_records_read on public.workspace_records for select to anon, authenticated using (true);

drop policy if exists workspace_comments_read on public.workspace_comments;
create policy workspace_comments_read on public.workspace_comments for select to anon, authenticated using (true);

drop policy if exists workspace_attachments_read on public.workspace_attachments;
create policy workspace_attachments_read on public.workspace_attachments for select to anon, authenticated using (true);

drop policy if exists workspace_approvals_read on public.workspace_approvals;
create policy workspace_approvals_read on public.workspace_approvals for select to anon, authenticated using (true);

drop policy if exists workspace_notifications_read on public.workspace_notifications;
create policy workspace_notifications_read on public.workspace_notifications for select to anon, authenticated using (true);

drop policy if exists workspace_activity_read on public.workspace_activity;
create policy workspace_activity_read on public.workspace_activity for select to anon, authenticated using (true);

-- Write operations should be executed through server routes with service role key.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workspace-media',
  'workspace-media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain'];

drop policy if exists "workspace-media public read" on storage.objects;
create policy "workspace-media public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'workspace-media');

drop policy if exists "workspace-media service write" on storage.objects;
create policy "workspace-media service write"
on storage.objects
for all
to authenticated
using (bucket_id = 'workspace-media')
with check (bucket_id = 'workspace-media');

alter publication supabase_realtime add table public.workspace_records;
alter publication supabase_realtime add table public.workspace_comments;
alter publication supabase_realtime add table public.workspace_notifications;
alter publication supabase_realtime add table public.workspace_activity;
