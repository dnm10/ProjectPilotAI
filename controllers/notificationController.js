const supabase = require('../config/supabase');

/**
 * GET /api/notifications
 * Retrieve notifications with optional filtering by user_id, team_id, is_read, or type.
 */
const getNotifications = async (req, res) => {
  try {
    const { user_id, team_id, is_read, type, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (team_id) {
      query = query.eq('team_id', team_id);
    }

    if (is_read !== undefined) {
      const isReadBool = is_read === 'true' || is_read === true;
      query = query.eq('is_read', isReadBool);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    if (offset) {
      query = query.range(
        parseInt(offset, 10),
        parseInt(offset, 10) + parseInt(limit, 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data ? data.length : 0,
      notifications: data || [],
    });
  } catch (error) {
    console.error('Server error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * POST /api/notifications
 * Create a new notification alert in Supabase.
 */
const createNotification = async (req, res) => {
  try {
    const {
      user_id,
      team_id,
      type,
      message,
      related_entity_type,
      related_entity_id,
      priority_score = 0.5,
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Notification message is required',
      });
    }

    const notificationPayload = {
      user_id: user_id || null,
      team_id: team_id || null,
      type: type || 'GENERAL',
      message: message.trim(),
      related_entity_type: related_entity_type || null,
      related_entity_id: related_entity_id || null,
      priority_score: typeof priority_score === 'number' ? priority_score : 0.5,
      is_read: false,
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationPayload])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create notification',
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: data[0],
    });
  } catch (error) {
    console.error('Server error creating notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read by its ID.
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required',
      });
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification: data[0],
    });
  } catch (error) {
    console.error('Server error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications for a user or team as read.
 */
const markAllAsRead = async (req, res) => {
  try {
    const { user_id, team_id } = req.body;

    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (user_id) {
      query = query.eq('user_id', user_id);
    } else if (team_id) {
      query = query.eq('team_id', team_id);
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Supabase update all error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as read',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      updated_count: data ? data.length : 0,
    });
  } catch (error) {
    console.error('Server error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a single notification by its ID.
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required',
      });
    }

    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete notification',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      deleted: data && data.length > 0 ? data[0] : null,
    });
  } catch (error) {
    console.error('Server error deleting notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
