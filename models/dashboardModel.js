const supabase = require('../config/supabase');

/**
 * Dashboard Model
 * Data access layer for aggregating live metrics, sprint health, team workload, and telemetry.
 */
class DashboardModel {
  /**
   * Fetch active or latest sprint for a team along with its tickets.
   * @param {string} teamId
   */
  static async getSprintAndTickets(teamId) {
    let sprintQuery = supabase
      .from('sprints')
      .select('*')
      .order('created_at', { ascending: false });

    if (teamId) {
      sprintQuery = sprintQuery.or(`team_id.eq.${teamId},team_id.is.null`);
    }

    const { data: sprints, error: sprintErr } = await sprintQuery.limit(5);
    if (sprintErr) {
      console.error('Error fetching sprint for dashboard:', sprintErr);
    }

    // Select active sprint or latest planned sprint
    const activeSprint = sprints?.find((s) => s.status === 'active') || sprints?.[0] || null;

    let tickets = [];
    if (activeSprint) {
      const { data: sprintTickets, error: ticketErr } = await supabase
        .from('tickets')
        .select('*, profiles:assignee_id(id, full_name, email, role)')
        .eq('sprint_id', activeSprint.id);

      if (!ticketErr && sprintTickets) {
        tickets = sprintTickets;
      }
    } else if (teamId) {
      // Fallback to latest team tickets
      const { data: teamTickets } = await supabase
        .from('tickets')
        .select('*, profiles:assignee_id(id, full_name, email, role)')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(20);

      tickets = teamTickets || [];
    }

    return { sprint: activeSprint, tickets };
  }

  /**
   * Fetch all tickets for a team to calculate risk metrics.
   * @param {string} teamId
   */
  static async getAllTeamTickets(teamId) {
    let query = supabase
      .from('tickets')
      .select('*, profiles:assignee_id(id, full_name, email, role)')
      .order('created_at', { ascending: false });

    if (teamId) {
      query = query.or(`team_id.eq.${teamId},team_id.is.null`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching team tickets for dashboard:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Fetch team members with profile details.
   * @param {string} teamId
   */
  static async getTeamMembers(teamId) {
    let query = supabase
      .from('team_members')
      .select('*, profiles:user_id(id, full_name, email, role)');

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching team members for dashboard:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Fetch recent notifications for activity feed and unread count.
   * @param {string} teamId
   */
  static async getRecentNotifications(teamId, limit = 10) {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (teamId) {
      query = query.or(`team_id.eq.${teamId},team_id.is.null`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching notifications for dashboard:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Fetch latest report for the team.
   * @param {string} teamId
   */
  static async getLatestReport(teamId) {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error('Error fetching latest report for dashboard:', error);
      return null;
    }
    return data;
  }
}

module.exports = DashboardModel;
