-- Enterprise RBAC + Company Management OS schema for Supabase
-- Run in Supabase SQL editor after enabling pgcrypto extension.

create extension if not exists pgcrypto;

-- ============ Core organization ============
create table if not exists public.company_departments (
  id uuid primary key default gen_random_uuid(),
  parent_department_id uuid references public.company_departments(id) on delete set null,
  name text not null unique,
  code text not null unique,
  manager_user_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_teams (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.company_departments(id) on delete cascade,
  parent_team_id uuid references public.company_teams(id) on delete set null,
  name text not null,
  team_lead_user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (department_id, name)
);

create table if not exists public.company_roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  hierarchy_level int not null default 1,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.company_permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  scope text not null default 'company',
  created_at timestamptz not null default now()
);

create table if not exists public.company_role_permissions (
  role_id uuid not null references public.company_roles(id) on delete cascade,
  permission_id uuid not null references public.company_permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.company_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique,
  full_name text not null,
  role_id uuid not null references public.company_roles(id),
  department_id uuid references public.company_departments(id) on delete set null,
  team_id uuid references public.company_teams(id) on delete set null,
  supervisor_user_id uuid references public.company_users(id) on delete set null,
  employment_type text not null default 'full-time',
  status text not null default 'active',
  permissions_override jsonb not null default '[]'::jsonb,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status in ('active','suspended','invited','archived'))
);

create table if not exists public.company_user_project_access (
  user_id uuid not null references public.company_users(id) on delete cascade,
  project_id uuid not null,
  access_level text not null default 'contributor',
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

-- ============ Operational modules ============
create table if not exists public.company_projects (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.company_departments(id) on delete set null,
  owner_user_id uuid references public.company_users(id) on delete set null,
  name text not null,
  code text not null unique,
  description text not null default '',
  status text not null default 'active',
  budget numeric(14,2) default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.company_projects(id) on delete cascade,
  department_id uuid references public.company_departments(id) on delete set null,
  assignee_user_id uuid references public.company_users(id) on delete set null,
  reporter_user_id uuid references public.company_users(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_announcements (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.company_departments(id) on delete set null,
  author_user_id uuid references public.company_users(id) on delete set null,
  title text not null,
  content text not null,
  audience_scope text not null default 'company',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_meetings (
  id uuid primary key default gen_random_uuid(),
  organizer_user_id uuid references public.company_users(id) on delete set null,
  department_id uuid references public.company_departments(id) on delete set null,
  title text not null,
  agenda text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.company_users(id) on delete cascade,
  category text not null default 'general',
  title text not null,
  body text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.company_messages (
  id uuid primary key default gen_random_uuid(),
  thread_key text not null,
  sender_user_id uuid references public.company_users(id) on delete set null,
  recipient_user_id uuid references public.company_users(id) on delete set null,
  department_id uuid references public.company_departments(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.company_reports (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.company_users(id) on delete set null,
  department_id uuid references public.company_departments(id) on delete set null,
  report_type text not null,
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.company_support_tickets (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid references public.company_users(id) on delete set null,
  assignee_user_id uuid references public.company_users(id) on delete set null,
  department_id uuid references public.company_departments(id) on delete set null,
  subject text not null,
  description text not null default '',
  status text not null default 'open',
  priority text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_recruitment_candidates (
  id uuid primary key default gen_random_uuid(),
  recruiter_user_id uuid references public.company_users(id) on delete set null,
  department_id uuid references public.company_departments(id) on delete set null,
  full_name text not null,
  email text not null,
  stage text not null default 'sourcing',
  score numeric(5,2) default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_documents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.company_users(id) on delete set null,
  department_id uuid references public.company_departments(id) on delete set null,
  project_id uuid references public.company_projects(id) on delete set null,
  storage_bucket text not null,
  storage_path text not null,
  document_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.company_performance_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.company_users(id) on delete cascade,
  department_id uuid references public.company_departments(id) on delete set null,
  metric_key text not null,
  metric_value numeric(14,2) not null default 0,
  measured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.company_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.company_users(id) on delete set null,
  target_user_id uuid references public.company_users(id) on delete set null,
  module_key text not null,
  action_key text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.company_security_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.company_users(id) on delete cascade,
  ip_address text,
  user_agent text,
  login_at timestamptz not null default now(),
  logout_at timestamptz,
  revoked boolean not null default false
);

-- ============ indexes ============
create index if not exists idx_company_users_role on public.company_users(role_id);
create index if not exists idx_company_users_department on public.company_users(department_id);
create index if not exists idx_company_projects_department on public.company_projects(department_id);
create index if not exists idx_company_tasks_assignee on public.company_tasks(assignee_user_id);
create index if not exists idx_company_tasks_project on public.company_tasks(project_id);
create index if not exists idx_company_messages_thread on public.company_messages(thread_key, created_at desc);
create index if not exists idx_company_notifications_user on public.company_notifications(user_id, created_at desc);
create index if not exists idx_company_logs_actor on public.company_activity_logs(actor_user_id, created_at desc);
create index if not exists idx_company_documents_owner on public.company_documents(owner_user_id, created_at desc);

-- ============ helper functions ============
create or replace function public.current_company_user_id()
returns uuid
language sql
stable
as $$
  select cu.id
  from public.company_users cu
  where cu.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_company_role_key()
returns text
language sql
stable
as $$
  select r.key
  from public.company_users cu
  join public.company_roles r on r.id = cu.role_id
  where cu.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_company_department_id()
returns uuid
language sql
stable
as $$
  select cu.department_id
  from public.company_users cu
  where cu.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.has_company_permission(permission_key text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.company_users cu
    join public.company_roles r on r.id = cu.role_id
    join public.company_role_permissions rp on rp.role_id = r.id
    join public.company_permissions p on p.id = rp.permission_id
    where cu.auth_user_id = auth.uid()
      and p.key = permission_key
  )
$$;

-- ============ row level security ============
alter table public.company_departments enable row level security;
alter table public.company_teams enable row level security;
alter table public.company_users enable row level security;
alter table public.company_projects enable row level security;
alter table public.company_tasks enable row level security;
alter table public.company_announcements enable row level security;
alter table public.company_meetings enable row level security;
alter table public.company_notifications enable row level security;
alter table public.company_messages enable row level security;
alter table public.company_reports enable row level security;
alter table public.company_support_tickets enable row level security;
alter table public.company_recruitment_candidates enable row level security;
alter table public.company_documents enable row level security;
alter table public.company_performance_metrics enable row level security;
alter table public.company_activity_logs enable row level security;
alter table public.company_security_sessions enable row level security;

-- read-your-scope policies
create policy "departments read by same department or elevated" on public.company_departments
for select using (
  public.current_company_department_id() = id
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive')
);

create policy "teams read by department scope" on public.company_teams
for select using (
  department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive')
);

create policy "users read self or managed scope" on public.company_users
for select using (
  id = public.current_company_user_id()
  or supervisor_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','hr-manager')
);

create policy "users update by hr and executive" on public.company_users
for update using (
  public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','hr-manager')
);

create policy "projects read by assignment or department" on public.company_projects
for select using (
  owner_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or exists (
    select 1 from public.company_user_project_access a
    where a.project_id = company_projects.id and a.user_id = public.current_company_user_id()
  )
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','project-manager')
);

create policy "tasks scoped read" on public.company_tasks
for select using (
  assignee_user_id = public.current_company_user_id()
  or reporter_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','project-manager','operations-manager')
);

create policy "notifications own only" on public.company_notifications
for all using (user_id = public.current_company_user_id());

create policy "messages thread access" on public.company_messages
for select using (
  sender_user_id = public.current_company_user_id()
  or recipient_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
);

create policy "reports scoped read" on public.company_reports
for select using (
  owner_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','business-analyst','finance-manager')
);

create policy "support scoped read" on public.company_support_tickets
for select using (
  requester_user_id = public.current_company_user_id()
  or assignee_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','customer-support')
);

create policy "recruitment scoped read" on public.company_recruitment_candidates
for select using (
  recruiter_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','recruiter','hr-manager')
);

create policy "documents scoped read" on public.company_documents
for select using (
  owner_user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','legal-counsel')
);

create policy "performance scoped read" on public.company_performance_metrics
for select using (
  user_id = public.current_company_user_id()
  or department_id = public.current_company_department_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','hr-manager')
);

create policy "activity logs restricted read" on public.company_activity_logs
for select using (
  actor_user_id = public.current_company_user_id()
  or target_user_id = public.current_company_user_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','hr-manager')
);

create policy "security sessions own or elevated" on public.company_security_sessions
for select using (
  user_id = public.current_company_user_id()
  or public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive')
);

-- generic elevated write policies
create policy "company elevated writes projects" on public.company_projects
for all using (public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','project-manager'));

create policy "company elevated writes tasks" on public.company_tasks
for all using (public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','project-manager','operations-manager'));

create policy "company elevated writes announcements" on public.company_announcements
for all using (public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','content-manager','marketing'));

create policy "company elevated writes meetings" on public.company_meetings
for all using (public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','operations-manager'));

create policy "company elevated writes reports" on public.company_reports
for all using (public.current_company_role_key() in ('superadmin','founder','ceo','managing-director','executive','business-analyst','finance-manager'));

-- ============ bootstrap roles and permissions ============
insert into public.company_roles (key, label, hierarchy_level)
values
  ('superadmin', 'Superadmin', 100),
  ('founder', 'Founder', 99),
  ('ceo', 'CEO', 98),
  ('managing-director', 'Managing Director', 97),
  ('executive', 'Executive', 95),
  ('operations-manager', 'Operations Manager', 80),
  ('project-manager', 'Project Manager', 75),
  ('product-manager', 'Product Manager', 74),
  ('technical-lead', 'Technical Lead', 73),
  ('developer', 'Developer', 50),
  ('designer', 'Designer', 50),
  ('qa-tester', 'QA Tester', 50),
  ('marketing', 'Marketing', 55),
  ('sales', 'Sales', 55),
  ('customer-support', 'Customer Support', 45),
  ('accountant', 'Accountant', 55),
  ('finance-manager', 'Finance Manager', 72),
  ('hr-manager', 'HR Manager', 72),
  ('recruiter', 'Recruiter', 58),
  ('legal-counsel', 'Legal Counsel', 70),
  ('business-analyst', 'Business Analyst', 60),
  ('content-manager', 'Content Manager', 60),
  ('social-media-manager', 'Social Media Manager', 58),
  ('intern', 'Intern', 20),
  ('viewer', 'Viewer', 10)
on conflict (key) do update set label = excluded.label, hierarchy_level = excluded.hierarchy_level;

insert into public.company_permissions (key, label, scope)
values
  ('users.create','Create users','company'),
  ('users.update','Update users','company'),
  ('users.suspend','Suspend users','company'),
  ('users.activate','Activate users','company'),
  ('users.assign_role','Assign roles','company'),
  ('users.assign_permissions','Assign permissions','company'),
  ('departments.manage','Manage departments','department'),
  ('teams.manage','Manage teams','department'),
  ('projects.manage','Manage projects','project'),
  ('finance.view','View finance','finance'),
  ('finance.manage','Manage finance','finance'),
  ('hr.view','View HR','hr'),
  ('hr.manage','Manage HR','hr'),
  ('legal.view','View legal','legal'),
  ('legal.manage','Manage legal','legal'),
  ('announcements.manage','Manage announcements','company'),
  ('reports.manage','Manage reports','company'),
  ('audit.view','View audit','company'),
  ('rbac.manage','Manage RBAC','company')
on conflict (key) do update set label = excluded.label, scope = excluded.scope;

