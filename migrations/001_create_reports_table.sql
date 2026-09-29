-- ==============================================================================
-- ProjectPilot AI - Reports Module Migration
-- Follows ProjectPilot AI Supabase Database Architecture Guide (Sections 3.7 & 5.3)
-- ==============================================================================

-- 1. Create the reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    technical_version_text TEXT,
    stakeholder_version_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create index for fast weekly queries per team
CREATE INDEX IF NOT EXISTS idx_reports_team_week 
    ON public.reports(team_id, week_start DESC);

-- 3. Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reports_updated_at ON public.reports;
CREATE TRIGGER trg_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 4. Row Level Security (RLS) - Matching Supabase Guide Step 5.1 - 5.3
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper function: verify team membership (if not already created)
CREATE OR REPLACE FUNCTION public.is_team_member(check_team_id uuid)
RETURNS boolean AS $$
SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = check_team_id AND user_id = auth.uid()
);
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS Policies for reports table
DROP POLICY IF EXISTS "Team members can view reports" ON public.reports;
CREATE POLICY "Team members can view reports"
    ON public.reports FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert reports" ON public.reports;
CREATE POLICY "Team members can insert reports"
    ON public.reports FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update reports" ON public.reports;
CREATE POLICY "Team members can update reports"
    ON public.reports FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete reports" ON public.reports;
CREATE POLICY "Team members can delete reports"
    ON public.reports FOR DELETE
    USING (public.is_team_member(team_id));
