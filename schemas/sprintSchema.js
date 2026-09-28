/**
 * Sprint Schema & Validation Layer
 */

const ALLOWED_STATUSES = ['planned', 'active', 'completed'];

function validateSprintPayload(payload = {}) {
  const { name, status } = payload;

  if (!name || !name.trim()) {
    return { isValid: false, error: 'Sprint name is required' };
  }

  if (status && !ALLOWED_STATUSES.includes(status.toLowerCase())) {
    return {
      isValid: false,
      error: `Invalid status '${status}'. Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
    };
  }

  return { isValid: true, error: null };
}

function sanitizeSprintPayload(payload = {}) {
  const status = payload.status && ALLOWED_STATUSES.includes(payload.status.toLowerCase())
    ? payload.status.toLowerCase()
    : 'planned';

  return {
    team_id: payload.team_id || null,
    name: payload.name.trim(),
    start_date: payload.start_date || null,
    end_date: payload.end_date || null,
    planned_velocity: payload.planned_velocity !== undefined && payload.planned_velocity !== null
      ? Number(payload.planned_velocity)
      : null,
    actual_velocity: payload.actual_velocity !== undefined && payload.actual_velocity !== null
      ? Number(payload.actual_velocity)
      : null,
    status,
  };
}

module.exports = {
  ALLOWED_STATUSES,
  validateSprintPayload,
  sanitizeSprintPayload,
};
