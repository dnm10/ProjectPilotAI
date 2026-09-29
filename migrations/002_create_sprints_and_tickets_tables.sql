-- ==============================================================================
-- ProjectPilot AI - Sprints and Tickets Migration
-- Follows ProjectPilot AI Supabase Database Architecture Guide (Sections 3.2, 3.9, 3.10, 5.3)
-- ==============================================================================

-- 1. Create Sprints Table
CREATE TABLE IF NOT EXISTS public.sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    planned_velocity NUMERIC,
    actual_velocity NUMERIC,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
    jira_ticket_key TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'in_review', 'done')),
    story_points NUMERIC,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes for Speed (Section 3.9)
CREATE INDEX IF NOT EXISTS idx_sprints_team ON public.sprints(team_id);
CREATE INDEX IF NOT EXISTS idx_tickets_team ON public.tickets(team_id);
CREATE INDEX IF NOT EXISTS idx_tickets_sprint ON public.tickets(sprint_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON public.tickets(assignee_id);

-- 4. Auto-update updated_at Trigger for tickets (Section 3.10)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tickets_updated_at ON public.tickets;
CREATE TRIGGER trg_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- 5. Row Level Security & Policies (Sections 5.1 & 5.3)
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Helper function: verify team membership
CREATE OR REPLACE FUNCTION public.is_team_member(check_team_id uuid)
RETURNS boolean AS $$
SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = check_team_id AND user_id = auth.uid()
);
$$ LANGUAGE sql SECURITY DEFINER;

-- Sprints Policies
DROP POLICY IF EXISTS "Team members can view sprints" ON public.sprints;
CREATE POLICY "Team members can view sprints"
    ON public.sprints FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert sprints" ON public.sprints;
CREATE POLICY "Team members can insert sprints"
    ON public.sprints FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update sprints" ON public.sprints;
CREATE POLICY "Team members can update sprints"
    ON public.sprints FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete sprints" ON public.sprints;
CREATE POLICY "Team members can delete sprints"
    ON public.sprints FOR DELETE
    USING (public.is_team_member(team_id));

-- Tickets Policies
DROP POLICY IF EXISTS "Team members can view tickets" ON public.tickets;
CREATE POLICY "Team members can view tickets"
    ON public.tickets FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert tickets" ON public.tickets;
CREATE POLICY "Team members can insert tickets"
    ON public.tickets FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update tickets" ON public.tickets;
CREATE POLICY "Team members can update tickets"
    ON public.tickets FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete tickets" ON public.tickets;
CREATE POLICY "Team members can delete tickets"
    ON public.tickets FOR DELETE
    USING (public.is_team_member(team_id));

