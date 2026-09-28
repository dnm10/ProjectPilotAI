const NotificationModel = require('../models/notificationModel');
const { validateNotificationPayload, sanitizeNotificationPayload } = require('../schemas/notificationSchema');

class NotificationServiceError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotificationService {
  static async listNotifications(filters = {}) {
    const { data, error } = await NotificationModel.findAll(filters);
    if (error) {
      throw new NotificationServiceError(`Failed to fetch notifications: ${error.message}`, 500);
    }
    return data || [];
  }

  static async createNotification(payload) {
    const validation = validateNotificationPayload(payload);
    if (!validation.isValid) {
      throw new NotificationServiceError(validation.error, 400);
    }

    const sanitized = sanitizeNotificationPayload(payload);
    const { data, error } = await NotificationModel.create(sanitized);

    if (error) {
      throw new NotificationServiceError(`Failed to create notification: ${error.message}`, 500);
    }

    return data && data.length > 0 ? data[0] : null;
  }

  static async markAsRead(id) {
    if (!id) {
      throw new NotificationServiceError('Notification ID is required', 400);
    }

    const { data, error } = await NotificationModel.markOneAsRead(id);
    if (error) {
      throw new NotificationServiceError(`Failed to mark notification as read: ${error.message}`, 500);
    }

    if (!data || data.length === 0) {
      throw new NotificationServiceError('Notification not found', 404);
    }

    return data[0];
  }

  static async markAllAsRead({ user_id, team_id }) {
    if (!user_id && !team_id) {
      throw new NotificationServiceError('user_id or team_id is required to mark all notifications as read', 400);
    }

    const { data, error } = await NotificationModel.markAllAsRead({ user_id, team_id });
    if (error) {
      throw new NotificationServiceError(`Failed to mark notifications as read: ${error.message}`, 500);
    }

    return data ? data.length : 0;
  }

  static async deleteNotification(id) {
    if (!id) {
      throw new NotificationServiceError('Notification ID is required', 400);
    }

    const { data, error } = await NotificationModel.delete(id);
    if (error) {
      throw new NotificationServiceError(`Failed to delete notification: ${error.message}`, 500);
    }

    return data && data.length > 0 ? data[0] : null;
  }
}

module.exports = {
  NotificationService,
  NotificationServiceError,
};
