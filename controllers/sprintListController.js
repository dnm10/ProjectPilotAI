const supabase = require('../config/supabase');

const getSprints = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sprints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sprints',
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      sprints: data,
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
  getSprints,
};