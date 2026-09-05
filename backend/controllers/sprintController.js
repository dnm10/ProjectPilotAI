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

module.exports = {
  getSprintTickets,
};