const SprintModel = require('../models/sprintModel');
const { validateSprintPayload, sanitizeSprintPayload } = require('../schemas/sprintSchema');

class SprintServiceError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

class SprintService {
  static async listSprints(filters = {}) {
    const { data, error } = await SprintModel.findAll(filters);
    if (error) {
      throw new SprintServiceError(`Failed to fetch sprints: ${error.message}`, 500);
    }
    return data || [];
  }

  static async createSprint(payload) {
    const validation = validateSprintPayload(payload);
    if (!validation.isValid) {
      throw new SprintServiceError(validation.error, 400);
    }

    const sanitized = sanitizeSprintPayload(payload);
    const { data, error } = await SprintModel.create(sanitized);

    if (error) {
      throw new SprintServiceError(`Failed to create sprint: ${error.message}`, 500);
    }

    return data;
  }

  static async getSprintTickets(sprintId) {
    if (!sprintId) {
      throw new SprintServiceError('Sprint ID is required', 400);
    }

    const { data, error } = await SprintModel.findTicketsWithProfiles(sprintId);
    if (error) {
      throw new SprintServiceError(`Failed to fetch sprint tickets: ${error.message}`, 500);
    }

    return data || [];
  }

  static async deleteSprint(sprintId) {
    if (!sprintId) {
      throw new SprintServiceError('Sprint ID is required', 400);
    }

    const { data, error } = await SprintModel.delete(sprintId);
    if (error) {
      throw new SprintServiceError(`Failed to delete sprint: ${error.message}`, 500);
    }

    if (!data) {
      throw new SprintServiceError('Sprint not found', 404);
    }

    return data;
  }
}

module.exports = {
  SprintService,
  SprintServiceError,
};
