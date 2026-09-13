const supabase = require('../config/supabase')

const getSprintTickets = async (req, res) => {
  try {
    const { sprintId } = req.params

    if (!sprintId) {
      return res.status(400).json({
        success: false,
        message: 'Sprint ID is required',
      })
    }

    // Fetch tickets without using a foreign-key join
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .eq('sprint_id', sprintId)
      .order('created_at', { ascending: true })

    if (ticketsError) {
      console.error('Tickets fetch error:', ticketsError)

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sprint tickets',
        error: ticketsError.message,
      })
    }

    // Collect assigned profile IDs
    const assignedIds = [
      ...new Set(
        (tickets || [])
          .map((ticket) => ticket.assignee_id)
          .filter(Boolean)
      ),
    ]

    let profiles = []

    // Fetch profiles only when assigned IDs exist
    if (assignedIds.length > 0) {
      const { data: profileData, error: profilesError } =
        await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', assignedIds)

      if (profilesError) {
        console.error('Profiles fetch error:', profilesError)

        return res.status(500).json({
          success: false,
          message: 'Failed to fetch assigned profiles',
          error: profilesError.message,
        })
      }

      profiles = profileData || []
    }

    // Attach the matching profile to each ticket
    const ticketsWithProfiles = (tickets || []).map((ticket) => ({
      ...ticket,
      profiles:
        profiles.find(
          (profile) => profile.id === ticket.assignee_id
        ) || null,
    }))

    return res.status(200).json({
      success: true,
      tickets: ticketsWithProfiles,
    })
  } catch (error) {
    console.error('Server error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

const deleteSprint = async (req, res) => {
  try {
    const { sprintId } = req.params

    if (!sprintId) {
      return res.status(400).json({
        success: false,
        message: 'Sprint ID is required',
      })
    }

    // Delete tickets belonging to this sprint
    const { error: ticketsError } = await supabase
      .from('tickets')
      .delete()
      .eq('sprint_id', sprintId)

    if (ticketsError) {
      console.error('Error deleting tickets:', ticketsError)

      return res.status(500).json({
        success: false,
        message: 'Failed to delete sprint tickets',
        error: ticketsError.message,
      })
    }

    // Delete the sprint
    const { data, error: sprintError } = await supabase
      .from('sprints')
      .delete()
      .eq('id', sprintId)
      .select()

    if (sprintError) {
      console.error('Error deleting sprint:', sprintError)

      return res.status(500).json({
        success: false,
        message: 'Failed to delete sprint',
        error: sprintError.message,
      })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sprint not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Sprint deleted successfully',
      sprint: data[0],
    })
  } catch (error) {
    console.error('Server error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

module.exports = {
  getSprintTickets,
  deleteSprint,
}