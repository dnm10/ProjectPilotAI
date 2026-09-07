const supabase = require('../config/supabase');

const createTickets = async (req, res) => {
  try {
    const { sprint_id, tickets } = req.body;

    if (!sprint_id) {
      return res.status(400).json({
        success: false,
        message: 'Sprint ID is required',
      });
    }

    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one ticket is required',
      });
    }

    const ticketRows = tickets.map((ticket) => ({
      sprint_id,
      title: ticket.title,
      description: ticket.description || null,
      status: ticket.status || 'todo',
      story_points: ticket.story_points || 0,
      priority: ticket.priority || 'medium',
      ai_generated: true,
    }));

    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketRows)
      .select();

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to create tickets',
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Tickets created successfully',
      tickets: data,
    });
  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const validStatuses = ['todo', 'in_progress', 'in_review', 'done'];

    if (!ticketId) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID is required',
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket status',
      });
    }

    const { data, error } = await supabase
      .from('tickets')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to update ticket status',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      ticket: data,
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
  createTickets,
  updateTicketStatus,
};