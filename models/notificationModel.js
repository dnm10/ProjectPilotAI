const supabase = require('../config/supabase');

/**
 * Notification Model
 * Data access layer for `notifications` in Supabase.
 */
class NotificationModel {
  static async findAll(filters = {}) {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters.team_id) {
      query = query.eq('team_id', filters.team_id);
    }

    if (filters.is_read !== undefined) {
      const isReadBool = filters.is_read === 'true' || filters.is_read === true;
      query = query.eq('is_read', isReadBool);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.limit) {
      query = query.limit(parseInt(filters.limit, 10));
    }

    if (filters.offset) {
      const offsetNum = parseInt(filters.offset, 10);
      const limitNum = parseInt(filters.limit || 50, 10);
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    return await query;
  }

  static async create(payload) {
    return await supabase
      .from('notifications')
      .insert([payload])
      .select();
  }

  static async markOneAsRead(id) {
    return await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select();
  }

  static async markAllAsRead(filters = {}) {
    let query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    } else if (filters.team_id) {
      query = query.eq('team_id', filters.team_id);
    }

    return await query.select();
  }

  static async delete(id) {
    return await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .select();
  }
}

module.exports = NotificationModel;
