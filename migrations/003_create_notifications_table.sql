-- ==============================================================================
-- ProjectPilot AI - Notifications Module Migration
-- Follows ProjectPilot AI Supabase Database Architecture Guide (Sections 3.7, 3.9, 5.6, 8)
-- ==============================================================================

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    related_entity_type TEXT,
    related_entity_id UUID,
    priority_score NUMERIC DEFAULT 0,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for Speed (Section 3.9)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
    ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_team 
    ON public.notifications(team_id);

-- 3. Row Level Security & Policies (Sections 5.1 & 5.6)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see only their own notifications" ON public.notifications;
CREATE POLICY "Users see only their own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can mark their own notifications read" ON public.notifications;
CREATE POLICY "Users can mark their own notifications read"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    USING (user_id = auth.uid());

-- 4. Enable Realtime Replication for Notifications (Section 8)
-- NOTE: In Supabase dashboard or via SQL:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
