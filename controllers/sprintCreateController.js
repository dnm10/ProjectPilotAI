const supabase = require('../config/supabase');

const createSprint = async (req, res) => {
  try {
    const {
      name,
      start_date,
      end_date,
      planned_velocity,
      status,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Sprint name is required',
      });
    }

    const { data, error } = await supabase
      .from('sprints')
      .insert([
        {
          name,
          start_date: start_date || null,
          end_date: end_date || null,
          planned_velocity: planned_velocity || null,
          status: status || 'planned',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to create sprint',
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Sprint created successfully',
      sprint: data,
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
  createSprint,
};