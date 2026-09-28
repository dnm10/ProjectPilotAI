const { ReportService, ServiceError } = require('../services/reportService');
const supabase = require('../config/supabase');

/**
 * Extracts authenticated user and team context from request.
 * Supports Bearer JWT tokens, custom headers, and query fallback.
 * @param {import('express').Request} req
 * @returns {Promise<{userId: string|null, teamId: string|null}>}
 */
async function extractRequestContext(req) {
  let userId = req.user?.id || req.headers['x-user-id'] || req.query.user_id || null;
  let teamId = req.headers['x-team-id'] || req.query.team_id || null;

  if (userId && typeof userId === 'string') {
    userId = userId.trim().replace(/^<|>$/g, '');
  }
  if (teamId && typeof teamId === 'string') {
    teamId = teamId.trim().replace(/^<|>$/g, '');
  }

  // If Authorization Bearer token is provided, verify with Supabase Auth
  const authHeader = req.headers.authorization;
  if (!userId && authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    } catch (e) {
      console.warn('Could not verify bearer token with Supabase:', e.message);
    }
  }

  return { userId, teamId };
}

/**
 * Report Controller
 * Thin controller dispatching requests to ReportService.
 */
class ReportController {
  /**
   * GET /reports/latest
   * Query params:
   *   - version: 'technical' | 'stakeholder' (optional)
   *   - user_id / team_id (optional for direct context)
   */
  static async getLatestReport(req, res) {
    try {
      const context = await extractRequestContext(req);
      const { version } = req.query;

      const result = await ReportService.getLatestReport(context, version);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error('Unexpected error in getLatestReport:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  /**
   * GET /reports/:report_id
   * Path params:
   *   - report_id: UUID string
   */
  static async getReportById(req, res) {
    try {
      const context = await extractRequestContext(req);
      let reportId = req.params.report_id || req.params.id;
      if (reportId && typeof reportId === 'string') {
        reportId = reportId.trim().replace(/^<|>$/g, '');
      }

      const result = await ReportService.getReportById(context, reportId);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      console.error('Unexpected error in getReportById:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

module.exports = {
  ReportController,
  getLatestReport: ReportController.getLatestReport,
  getReportById: ReportController.getReportById,
};
