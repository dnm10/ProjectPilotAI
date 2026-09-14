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


// PUT /api/team/:teamId
const updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name } = req.body;

    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Team ID is required',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required',
      });
    }

    const { data, error } = await supabase
      .from('teams')
      .update({
        name: name.trim(),
      })
      .eq('id', teamId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to update team',
        error: error.message,
      });
    }

    return res.status(200).json({
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

// DELETE /api/team/:teamId
const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Team ID is required',
      });
    }

    // Delete team members first
    const { error: membersError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId);

    if (membersError) {
      console.error('Supabase error:', membersError);

      return res.status(500).json({
        success: false,
        message: 'Failed to delete team members',
        error: membersError.message,
      });
    }

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to delete team',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


// PUT /api/team/members/:memberId
const updateTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role_in_team } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID is required',
      });
    }

    if (!role_in_team || !role_in_team.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Member role is required',
      });
    }

    const { data, error } = await supabase
      .from('team_members')
      .update({
        role_in_team: role_in_team.trim(),
      })
      .eq('id', memberId)
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
        message: 'Failed to update team member',
        error: error.message,
      });
    }

    return res.status(200).json({
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


// DELETE /api/team/members/:memberId
const removeTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID is required',
      });
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to remove team member',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
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
  updateTeam,
  deleteTeam,
  updateTeamMember,
  removeTeamMember,
};