const DashboardService = require('../services/dashboardService');

class DashboardController {
  /**
   * GET /api/dashboard/summary
   * Returns aggregated dashboard metrics, top risks, workload and activity.
   */
  static async getDashboardSummary(req, res) {
    try {
      const { team_id } = req.query;
      const summary = await DashboardService.getFullSummary(team_id);

      return res.status(200).json({
        success: true,
        ...summary,
      });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard summary',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/dashboard/stats
   */
  static async getStats(req, res) {
    try {
      const { team_id } = req.query;
      const stats = await DashboardService.getStats(team_id);

      return res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard stats',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/dashboard/risks
   */
  static async getTopRisks(req, res) {
    try {
      const { team_id } = req.query;
      const risks = await DashboardService.getTopRisks(team_id);

      return res.status(200).json({
        success: true,
        risks,
      });
    } catch (error) {
      console.error('Error fetching top risks:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch top risks',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/dashboard/workload
   */
  static async getWorkloadSummary(req, res) {
    try {
      const { team_id } = req.query;
      const workload = await DashboardService.getWorkloadSummary(team_id);

      return res.status(200).json({
        success: true,
        workload,
      });
    } catch (error) {
      console.error('Error fetching workload summary:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch workload summary',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/dashboard/activity
   */
  static async getRecentActivity(req, res) {
    try {
      const { team_id } = req.query;
      const activity = await DashboardService.getRecentActivity(team_id);

      return res.status(200).json({
        success: true,
        activity,
      });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recent activity',
        error: error.message,
      });
    }
  }
}

module.exports = DashboardController;
