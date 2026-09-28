const supabase = require('../config/supabase');

/**
 * Report Model
 * Handles data access operations for the `reports` table in Supabase.
 */
class ReportModel {
  /**
   * Find the latest report for a given team ID, sorted by week_start descending.
   * @param {string} teamId
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  static async findLatestByTeamId(teamId) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('team_id', teamId)
      .order('week_start', { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  }

  /**
   * Find a report by its primary key ID.
   * @param {string} reportId
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  static async findById(reportId) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .maybeSingle();

    return { data, error };
  }

  /**
   * Find the primary team_id for a given user ID.
   * Checks `team_members` table first, and falls back to `teams` created_by.
   * @param {string} userId
   * @returns {Promise<{teamId: string|null, error: object|null}>}
   */
  static async findUserTeamId(userId) {
    // 1. Check team_members
    const { data: memberData, error: memberError } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (memberError && memberError.code !== 'PGRST116') {
      return { teamId: null, error: memberError };
    }

    if (memberData && memberData.team_id) {
      return { teamId: memberData.team_id, error: null };
    }

    // 2. Check if user is the creator of any team
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('created_by', userId)
      .limit(1)
      .maybeSingle();

    if (teamError && teamError.code !== 'PGRST116') {
      return { teamId: null, error: teamError };
    }

    if (teamData && teamData.id) {
      return { teamId: teamData.id, error: null };
    }

    return { teamId: null, error: null };
  }

  /**
   * Insert a new report into the database.
   * @param {object} reportData
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  static async createReport(reportData) {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        team_id: reportData.team_id,
        week_start: reportData.week_start,
        technical_version_text: reportData.technical_version_text || null,
        stakeholder_version_text: reportData.stakeholder_version_text || null,
      })
      .select()
      .single();

    return { data, error };
  }
}

module.exports = ReportModel;
