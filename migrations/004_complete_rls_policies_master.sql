-- ==============================================================================
-- PROJECTPILOT AI — COMPLETE MASTER ROW LEVEL SECURITY (RLS) POLICIES
-- Single unified migration covering 100% of all database tables.
-- Run this script in the Supabase SQL Editor.
-- ==============================================================================

-- ==============================================================================
-- 1. HELPER FUNCTION: Verify Team Membership
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_team_member(check_team_id uuid)
RETURNS boolean AS $$
SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = check_team_id AND user_id = auth.uid()
);
$$ LANGUAGE sql SECURITY DEFINER;

-- ==============================================================================
-- 2. PROFILES TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
    ON public.profiles FOR SELECT
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (id = auth.uid());

-- ==============================================================================
-- 3. TEAMS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members and creators can view teams" ON public.teams;
CREATE POLICY "Team members and creators can view teams"
    ON public.teams FOR SELECT
    USING (public.is_team_member(id) OR created_by = auth.uid() OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
CREATE POLICY "Authenticated users can create teams"
    ON public.teams FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Team creators and members can update teams" ON public.teams;
CREATE POLICY "Team creators and members can update teams"
    ON public.teams FOR UPDATE
    USING (created_by = auth.uid() OR public.is_team_member(id));

DROP POLICY IF EXISTS "Team creators can delete teams" ON public.teams;
CREATE POLICY "Team creators can delete teams"
    ON public.teams FOR DELETE
    USING (created_by = auth.uid());

-- ==============================================================================
-- 4. TEAM_MEMBERS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view members" ON public.team_members;
CREATE POLICY "Team members can view members"
    ON public.team_members FOR SELECT
    USING (public.is_team_member(team_id) OR user_id = auth.uid() OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Team members can add new members" ON public.team_members;
CREATE POLICY "Team members can add new members"
    ON public.team_members FOR INSERT
    WITH CHECK (public.is_team_member(team_id) OR EXISTS (
        SELECT 1 FROM public.teams WHERE id = team_id AND created_by = auth.uid()
    ) OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Team members can update members" ON public.team_members;
CREATE POLICY "Team members can update members"
    ON public.team_members FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members and creators can remove members" ON public.team_members;
CREATE POLICY "Team members and creators can remove members"
    ON public.team_members FOR DELETE
    USING (public.is_team_member(team_id) OR user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.teams WHERE id = team_id AND created_by = auth.uid()
    ));

-- ==============================================================================
-- 5. SPRINTS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.sprints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view sprints" ON public.sprints;
CREATE POLICY "Team members can view sprints"
    ON public.sprints FOR SELECT
    USING (public.is_team_member(team_id) OR team_id IS NULL);

DROP POLICY IF EXISTS "Team members can insert sprints" ON public.sprints;
CREATE POLICY "Team members can insert sprints"
    ON public.sprints FOR INSERT
    WITH CHECK (public.is_team_member(team_id) OR team_id IS NULL);

DROP POLICY IF EXISTS "Team members can update sprints" ON public.sprints;
CREATE POLICY "Team members can update sprints"
    ON public.sprints FOR UPDATE
    USING (public.is_team_member(team_id) OR team_id IS NULL);

DROP POLICY IF EXISTS "Team members can delete sprints" ON public.sprints;
CREATE POLICY "Team members can delete sprints"
    ON public.sprints FOR DELETE
    USING (public.is_team_member(team_id) OR team_id IS NULL);

-- ==============================================================================
-- 6. TICKETS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view tickets" ON public.tickets;
CREATE POLICY "Team members can view tickets"
    ON public.tickets FOR SELECT
    USING (public.is_team_member(team_id) OR team_id IS NULL);

DROP POLICY IF EXISTS "Team members can insert tickets" ON public.tickets;
CREATE POLICY "Team members can insert tickets"
    ON public.tickets FOR INSERT
    WITH CHECK (public.is_team_member(team_id) OR team_id IS NULL);

DROP POLICY IF EXISTS "Team members can update tickets" ON public.tickets;
CREATE POLICY "Team members can update tickets"
    ON public.tickets FOR UPDATE
    USING (public.is_team_member(team_id) OR team_id IS NULL);

DROP POLICY IF EXISTS "Team members can delete tickets" ON public.tickets;
CREATE POLICY "Team members can delete tickets"
    ON public.tickets FOR DELETE
    USING (public.is_team_member(team_id) OR team_id IS NULL);

-- ==============================================================================
-- 7. REPORTS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.reports ENABLE ROW LEVEL SECURITY;

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

-- ==============================================================================
-- 8. NOTIFICATIONS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and team members can view notifications" ON public.notifications;
CREATE POLICY "Users and team members can view notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid() OR (team_id IS NOT NULL AND public.is_team_member(team_id)) OR team_id IS NULL);

DROP POLICY IF EXISTS "Users and team members can update notifications" ON public.notifications;
CREATE POLICY "Users and team members can update notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid() OR (team_id IS NOT NULL AND public.is_team_member(team_id)) OR team_id IS NULL);

DROP POLICY IF EXISTS "Users and team members can delete notifications" ON public.notifications;
CREATE POLICY "Users and team members can delete notifications"
    ON public.notifications FOR DELETE
    USING (user_id = auth.uid() OR (team_id IS NOT NULL AND public.is_team_member(team_id)) OR team_id IS NULL);

-- ==============================================================================
-- 9. MEETINGS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view meetings" ON public.meetings;
CREATE POLICY "Team members can view meetings"
    ON public.meetings FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert meetings" ON public.meetings;
CREATE POLICY "Team members can insert meetings"
    ON public.meetings FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update meetings" ON public.meetings;
CREATE POLICY "Team members can update meetings"
    ON public.meetings FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete meetings" ON public.meetings;
CREATE POLICY "Team members can delete meetings"
    ON public.meetings FOR DELETE
    USING (public.is_team_member(team_id));

-- ==============================================================================
-- 10. ACTION_ITEMS TABLE (Links to team via meetings)
-- ==============================================================================
ALTER TABLE IF EXISTS public.action_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view action items" ON public.action_items;
CREATE POLICY "Team members can view action items"
    ON public.action_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.meetings
            WHERE public.meetings.id = action_items.meeting_id
            AND public.is_team_member(public.meetings.team_id)
        ) OR auth.uid() IS NOT NULL
    );

DROP POLICY IF EXISTS "Team members can insert action items" ON public.action_items;
CREATE POLICY "Team members can insert action items"
    ON public.action_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.meetings
            WHERE public.meetings.id = action_items.meeting_id
            AND public.is_team_member(public.meetings.team_id)
        ) OR auth.uid() IS NOT NULL
    );

DROP POLICY IF EXISTS "Team members can update action items" ON public.action_items;
CREATE POLICY "Team members can update action items"
    ON public.action_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.meetings
            WHERE public.meetings.id = action_items.meeting_id
            AND public.is_team_member(public.meetings.team_id)
        ) OR auth.uid() IS NOT NULL
    );

DROP POLICY IF EXISTS "Team members can delete action items" ON public.action_items;
CREATE POLICY "Team members can delete action items"
    ON public.action_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.meetings
            WHERE public.meetings.id = action_items.meeting_id
            AND public.is_team_member(public.meetings.team_id)
        ) OR auth.uid() IS NOT NULL
    );

-- ==============================================================================
-- 11. COMMITS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.commits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view commits" ON public.commits;
CREATE POLICY "Team members can view commits"
    ON public.commits FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert commits" ON public.commits;
CREATE POLICY "Team members can insert commits"
    ON public.commits FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update commits" ON public.commits;
CREATE POLICY "Team members can update commits"
    ON public.commits FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete commits" ON public.commits;
CREATE POLICY "Team members can delete commits"
    ON public.commits FOR DELETE
    USING (public.is_team_member(team_id));

-- ==============================================================================
-- 12. PULL_REQUESTS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.pull_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view pull requests" ON public.pull_requests;
CREATE POLICY "Team members can view pull requests"
    ON public.pull_requests FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert pull requests" ON public.pull_requests;
CREATE POLICY "Team members can insert pull requests"
    ON public.pull_requests FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update pull requests" ON public.pull_requests;
CREATE POLICY "Team members can update pull requests"
    ON public.pull_requests FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete pull requests" ON public.pull_requests;
CREATE POLICY "Team members can delete pull requests"
    ON public.pull_requests FOR DELETE
    USING (public.is_team_member(team_id));

-- ==============================================================================
-- 13. RISK_SCORES TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.risk_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view risk scores" ON public.risk_scores;
CREATE POLICY "Team members can view risk scores"
    ON public.risk_scores FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert risk scores" ON public.risk_scores;
CREATE POLICY "Team members can insert risk scores"
    ON public.risk_scores FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update risk scores" ON public.risk_scores;
CREATE POLICY "Team members can update risk scores"
    ON public.risk_scores FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete risk scores" ON public.risk_scores;
CREATE POLICY "Team members can delete risk scores"
    ON public.risk_scores FOR DELETE
    USING (public.is_team_member(team_id));

-- ==============================================================================
-- 14. WORKLOAD_SNAPSHOTS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.workload_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view workload snapshots" ON public.workload_snapshots;
CREATE POLICY "Team members can view workload snapshots"
    ON public.workload_snapshots FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert workload snapshots" ON public.workload_snapshots;
CREATE POLICY "Team members can insert workload snapshots"
    ON public.workload_snapshots FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update workload snapshots" ON public.workload_snapshots;
CREATE POLICY "Team members can update workload snapshots"
    ON public.workload_snapshots FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete workload snapshots" ON public.workload_snapshots;
CREATE POLICY "Team members can delete workload snapshots"
    ON public.workload_snapshots FOR DELETE
    USING (public.is_team_member(team_id));

-- ==============================================================================
-- 15. SIMULATION_RUNS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.simulation_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view simulation runs" ON public.simulation_runs;
CREATE POLICY "Team members can view simulation runs"
    ON public.simulation_runs FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert simulation runs" ON public.simulation_runs;
CREATE POLICY "Team members can insert simulation runs"
    ON public.simulation_runs FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update simulation runs" ON public.simulation_runs;
CREATE POLICY "Team members can update simulation runs"
    ON public.simulation_runs FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete simulation runs" ON public.simulation_runs;
CREATE POLICY "Team members can delete simulation runs"
    ON public.simulation_runs FOR DELETE
    USING (public.is_team_member(team_id));

-- ==============================================================================
-- 16. CHAT_MESSAGES TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view chat messages" ON public.chat_messages;
CREATE POLICY "Team members can view chat messages"
    ON public.chat_messages FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert chat messages" ON public.chat_messages;
CREATE POLICY "Team members can insert chat messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update chat messages" ON public.chat_messages;
CREATE POLICY "Team members can update chat messages"
    ON public.chat_messages FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete chat messages" ON public.chat_messages;
CREATE POLICY "Team members can delete chat messages"
    ON public.chat_messages FOR DELETE
    USING (public.is_team_member(team_id));

-- ==============================================================================
-- 17. DOCUMENT_EMBEDDINGS TABLE
-- ==============================================================================
ALTER TABLE IF EXISTS public.document_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members can view document embeddings" ON public.document_embeddings;
CREATE POLICY "Team members can view document embeddings"
    ON public.document_embeddings FOR SELECT
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can insert document embeddings" ON public.document_embeddings;
CREATE POLICY "Team members can insert document embeddings"
    ON public.document_embeddings FOR INSERT
    WITH CHECK (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can update document embeddings" ON public.document_embeddings;
CREATE POLICY "Team members can update document embeddings"
    ON public.document_embeddings FOR UPDATE
    USING (public.is_team_member(team_id));

DROP POLICY IF EXISTS "Team members can delete document embeddings" ON public.document_embeddings;
CREATE POLICY "Team members can delete document embeddings"
    ON public.document_embeddings FOR DELETE
    USING (public.is_team_member(team_id));
