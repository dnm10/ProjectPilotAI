const ReportModel = require('../models/reportModel');
const { validateVersion, serializeReport } = require('../schemas/reportSchema');

/**
 * Custom Service Error with HTTP status code
 */
class ServiceError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Report Service
 * Implements business logic and access control for Reports.
 */
class ReportService {
  /**
   * Resolves the team ID for the requesting user context.
   * @param {object} context - { userId, teamId }
   * @returns {Promise<string>}
   */
  static async resolveUserTeamId(context = {}) {
    if (context.teamId) {
      return context.teamId;
    }

    if (!context.userId) {
      throw new ServiceError('User authentication or team identification required', 401);
    }

    const { teamId, error } = await ReportModel.findUserTeamId(context.userId);

    if (error) {
      throw new ServiceError(`Failed to determine user team: ${error.message}`, 500);
    }

    if (!teamId) {
      throw new ServiceError('User does not belong to any team', 404);
    }

    return teamId;
  }

  /**
   * Retrieves the latest report for the authenticated user's team.
   * @param {object} context - { userId, teamId }
   * @param {string|undefined} versionParam
   * @returns {Promise<object>}
   */
  static async getLatestReport(context, versionParam) {
    // 1. Validate version parameter
    const { isValid, sanitizedVersion, error: validationError } = validateVersion(versionParam);
    if (!isValid) {
      throw new ServiceError(validationError, 400);
    }

    // 2. Resolve the user's team
    const teamId = await this.resolveUserTeamId(context);

    // 3. Query the latest report from database
    const { data: report, error: dbError } = await ReportModel.findLatestByTeamId(teamId);

    if (dbError) {
      throw new ServiceError(`Database error fetching latest report: ${dbError.message}`, 500);
    }

    if (!report) {
      throw new ServiceError('No report found for this team', 404);
    }

    // 4. Serialize according to requested version schema
    const serializedReport = serializeReport(report, sanitizedVersion);

    return {
      success: true,
      report: serializedReport,
    };
  }

  /**
   * Retrieves a specific report by ID, verifying team ownership.
   * @param {object} context - { userId, teamId }
   * @param {string} reportId
   * @returns {Promise<object>}
   */
  static async getReportById(context, reportId) {
    if (!reportId || !reportId.trim()) {
      throw new ServiceError('Report ID is required', 400);
    }

    // 1. Resolve user's team
    const teamId = await this.resolveUserTeamId(context);

    // 2. Query the report
    const { data: report, error: dbError } = await ReportModel.findById(reportId.trim());

    if (dbError) {
      throw new ServiceError(`Database error fetching report: ${dbError.message}`, 500);
    }

    // 3. Verify existence and cross-team security
    if (!report || report.team_id !== teamId) {
      // Return 404 for both non-existent and cross-team access to prevent ID probing
      throw new ServiceError('Report not found', 404);
    }

    // 4. Return serialized full report
    const serializedReport = serializeReport(report, null);

    return {
      success: true,
      report: serializedReport,
    };
  }
}

module.exports = {
  ReportService,
  ServiceError,
};
