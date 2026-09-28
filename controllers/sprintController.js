const { SprintService, SprintServiceError } = require('../services/sprintService');

/**
 * Sprint Controller
 * Thin HTTP Controller dispatching requests to SprintService.
 */
class SprintController {
  static async getSprints(req, res) {
    try {
      const { team_id, status } = req.query;
      const sprints = await SprintService.listSprints({ team_id, status });

      return res.status(200).json({
        success: true,
        count: sprints.length,
        sprints,
      });
    } catch (error) {
      if (error instanceof SprintServiceError) {
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

  static async createSprint(req, res) {
    try {
      const sprint = await SprintService.createSprint(req.body);
      return res.status(201).json({
        success: true,
        message: 'Sprint created successfully',
        sprint,
      });
    } catch (error) {
      if (error instanceof SprintServiceError) {
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

  static async getSprintTickets(req, res) {
    try {
      const { sprintId } = req.params;
      const tickets = await SprintService.getSprintTickets(sprintId);

      return res.status(200).json({
        success: true,
        tickets,
      });
    } catch (error) {
      if (error instanceof SprintServiceError) {
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

  static async deleteSprint(req, res) {
    try {
      const { sprintId } = req.params;
      const sprint = await SprintService.deleteSprint(sprintId);

      return res.status(200).json({
        success: true,
        message: 'Sprint deleted successfully',
        sprint,
      });
    } catch (error) {
      if (error instanceof SprintServiceError) {
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
  getSprints: SprintController.getSprints,
  createSprint: SprintController.createSprint,
  getSprintTickets: SprintController.getSprintTickets,
  deleteSprint: SprintController.deleteSprint,
};