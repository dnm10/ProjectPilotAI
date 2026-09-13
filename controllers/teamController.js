const supabase = require('../config/supabase');

// GET /api/team/list
const getTeams = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        github_repo_url,
        jira_project_key,
        created_by,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch teams',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      teams: data,
    });
  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/team?team_id=<team-id>
const getTeamMembers = async (req, res) => {
  try {
    const { team_id } = req.query;

    if (!team_id) {
      return res.status(400).json({
        success: false,
        message: 'Team ID is required',
      });
    }

    const { data, error } = await supabase
      .from('team_members')
      .select(`
        id,
        team_id,
        user_id,
        role_in_team,
        joined_at,
        profiles (
          id,
          full_name,
          email,
          role,
          github_username,
          jira_account_id
        )
      `)
      .eq('team_id', team_id)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch team members',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      teamMembers: data,
    });
  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /api/team/users
const getAvailableUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        role,
        github_username,
        jira_account_id
      `)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      users: data,
    });
  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// POST /api/team
const createTeam = async (req, res) => {
  try {
    const { name, created_by } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required',
      });
    }

    if (!created_by) {
      return res.status(400).json({
        success: false,
        message: 'Creator user ID is required',
      });
    }

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: name.trim(),
        created_by,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to create team',
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      team: data,
    });
  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// POST /api/team/members
const addTeamMember = async (req, res) => {
  try {
    const { team_id, user_id, role_in_team } = req.body;

    if (!team_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Team ID and user ID are required',
      });
    }

    const { data: existingMember, error: existingError } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', team_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingError) {
      console.error('Supabase error:', existingError);

      return res.status(500).json({
        success: false,
        message: 'Failed to check existing member',
        error: existingError.message,
      });
    }

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'This user is already a member of the team',
      });
    }

    const { data, error } = await supabase
      .from('team_members')
      .insert({
        team_id,
        user_id,
        role_in_team: role_in_team || 'Member',
        joined_at: new Date().toISOString(),
      })
      .select(`
        id,
        team_id,
        user_id,
        role_in_team,
        joined_at,
        profiles (
          id,
          full_name,
          email,
          role,
          github_username,
          jira_account_id
        )
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to add team member',
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      teamMember: data,
    });
  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getTeams,
  getTeamMembers,
  getAvailableUsers,
  createTeam,
  addTeamMember,
};