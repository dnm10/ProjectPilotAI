const { NotificationService, NotificationServiceError } = require('../services/notificationService');

/**
 * Notification Controller
 * Thin HTTP Controller dispatching requests to NotificationService.
 */
class NotificationController {
  static async getNotifications(req, res) {
    try {
      const { user_id, team_id, is_read, type, limit, offset } = req.query;
      const notifications = await NotificationService.listNotifications({
        user_id,
        team_id,
        is_read,
        type,
        limit,
        offset,
      });

      return res.status(200).json({
        success: true,
        count: notifications.length,
        notifications,
      });
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  static async createNotification(req, res) {
    try {
      const notification = await NotificationService.createNotification(req.body);
      return res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        notification,
      });
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.markAsRead(id);

      return res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        notification,
      });
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const { user_id, team_id } = req.body;
      const updatedCount = await NotificationService.markAllAsRead({ user_id, team_id });

      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        updated_count: updatedCount,
      });
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const deleted = await NotificationService.deleteNotification(id);

      return res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
        deleted,
      });
    } catch (error) {
      if (error instanceof NotificationServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

module.exports = {
  getNotifications: NotificationController.getNotifications,
  createNotification: NotificationController.createNotification,
  markAsRead: NotificationController.markAsRead,
  markAllAsRead: NotificationController.markAllAsRead,
  deleteNotification: NotificationController.deleteNotification,
};
