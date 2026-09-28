/**
 * Notification Schema & Validation Layer
 */

function validateNotificationPayload(payload = {}) {
  const { message } = payload;

  if (!message || !message.trim()) {
    return { isValid: false, error: 'Notification message is required' };
  }

  return { isValid: true, error: null };
}

function sanitizeNotificationPayload(payload = {}) {
  return {
    user_id: payload.user_id || null,
    team_id: payload.team_id || null,
    type: payload.type || 'GENERAL',
    message: payload.message.trim(),
    related_entity_type: payload.related_entity_type || null,
    related_entity_id: payload.related_entity_id || null,
    priority_score: typeof payload.priority_score === 'number' ? payload.priority_score : 0,
    is_read: false,
  };
}

module.exports = {
  validateNotificationPayload,
  sanitizeNotificationPayload,
};
