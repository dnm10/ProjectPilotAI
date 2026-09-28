const supabase = require('../config/supabase');

/**
 * Sprint Model
 * Data access layer for `sprints` and related sprint tickets in Supabase.
 */
class SprintModel {
  /**
   * Find sprints with optional filtering by team_id and status.
   * @param {object} filters
   * @returns {Promise<{data: array|null, error: object|null}>}
   */
  static async findAll(filters = {}) {
    let query = supabase
      .from('sprints')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.team_id) {
      query = query.eq('team_id', filters.team_id);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    return await query;
  }

  /**
   * Find a sprint by its ID.
   * @param {string} sprintId
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  static async findById(sprintId) {
    return await supabase
      .from('sprints')
      .select('*')
      .eq('id', sprintId)
      .maybeSingle();
  }

  /**
   * Insert a new sprint record.
   * @param {object} sprintPayload
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  static async create(sprintPayload) {
    return await supabase
      .from('sprints')
      .insert([sprintPayload])
      .select()
      .single();
  }

  /**
   * Fetch all tickets for a sprint and attach assignee profiles.
   * @param {string} sprintId
   * @returns {Promise<{data: array|null, error: object|null}>}
   */
  static async findTicketsWithProfiles(sprintId) {
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .eq('sprint_id', sprintId)
      .order('created_at', { ascending: true });

    if (ticketsError) {
      return { data: null, error: ticketsError };
    }

    const assignedIds = [
      ...new Set(
        (tickets || [])
          .map((ticket) => ticket.assignee_id)
          .filter(Boolean)
      ),
    ];

    let profiles = [];
    if (assignedIds.length > 0) {
      const { data: profileData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', assignedIds);

      if (profilesError) {
        return { data: null, error: profilesError };
      }

      profiles = profileData || [];
    }

    const ticketsWithProfiles = (tickets || []).map((ticket) => ({
      ...ticket,
      profiles:
        profiles.find((profile) => profile.id === ticket.assignee_id) || null,
    }));

    return { data: ticketsWithProfiles, error: null };
  }

  /**
   * Delete a sprint and its tickets.
   * @param {string} sprintId
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  static async delete(sprintId) {
    // Delete tickets first
    const { error: ticketsError } = await supabase
      .from('tickets')
      .delete()
      .eq('sprint_id', sprintId);

    if (ticketsError) {
      return { data: null, error: ticketsError };
    }

    const { data, error: sprintError } = await supabase
      .from('sprints')
      .delete()
      .eq('id', sprintId)
      .select();

    if (sprintError) {
      return { data: null, error: sprintError };
    }

    return { data: data && data.length > 0 ? data[0] : null, error: null };
  }
}

module.exports = SprintModel;
