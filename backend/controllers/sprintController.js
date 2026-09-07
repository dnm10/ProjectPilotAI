const supabase = require('../config/supabase');

const getSprintTickets = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('sprint_id', sprintId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sprint tickets',
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      tickets: data,
    });
  } catch (error) {
    console.error('Server error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const deleteSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    if (!sprintId) {
      return res.status(400).json({
        success: false,
        message: 'Sprint ID is required',
      });
    }

    // Delete tickets belonging to this sprint
    const { error: ticketsError } = await supabase
      .from('tickets')
      .delete()
      .eq('sprint_id', sprintId);

    if (ticketsError) {
      console.error('Error deleting tickets:', ticketsError);

      return res.status(500).json({
        success: false,
        message: 'Failed to delete sprint tickets',
        error: ticketsError.message,
      });
    }

    // Delete the sprint
    const { data, error: sprintError } = await supabase
      .from('sprints')
      .delete()
      .eq('id', sprintId)
      .select();

    if (sprintError) {
      console.error('Error deleting sprint:', sprintError);

      return res.status(500).json({
        success: false,
        message: 'Failed to delete sprint',
        error: sprintError.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sprint not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sprint deleted successfully',
      sprint: data[0],
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
  getSprintTickets,
  deleteSprint,
};