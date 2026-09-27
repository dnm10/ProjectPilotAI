const express = require('express');
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

// GET /api/notifications - List all notifications (with optional query filters)
router.get('/', getNotifications);

// POST /api/notifications - Create a new notification
router.post('/', createNotification);

// PATCH /api/notifications/read-all - Bulk mark notifications as read
router.patch('/read-all', markAllAsRead);

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', markAsRead);

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;
