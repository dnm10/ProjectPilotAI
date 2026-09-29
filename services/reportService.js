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
   * Checks context, then user's membership, then first available team in Supabase.
   * @param {object} context - { userId, teamId }
   * @returns {Promise<string>}
   */
  static async resolveUserTeamId(context = {}) {
    if (context.teamId) {
      return context.teamId;
    }

    if (context.userId) {
      const { teamId, error } = await ReportModel.findUserTeamId(context.userId);

      if (error) {
        throw new ServiceError(`Failed to determine user team: ${error.message}`, 500);
      }

      if (teamId) {
        return teamId;
      }
    }

    // Dynamic fallback: select primary active team from Supabase database
    const supabase = require('../config/supabase');
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (teamError) {
      throw new ServiceError(`Failed to query teams: ${teamError.message}`, 500);
    }

    if (teamData && teamData.id) {
      return teamData.id;
    }

    throw new ServiceError('No team found in database', 404);
  }

  /**
   * Retrieves available report weeks for a team from the database.
   * @param {object} context
   * @returns {Promise<Array>}
   */
  static async getReportWeeks(context) {
    const teamId = await this.resolveUserTeamId(context);
    const { data, error } = await ReportModel.findWeeksByTeamId(teamId);

    if (error) {
      throw new ServiceError(`Database error fetching report weeks: ${error.message}`, 500);
    }

    return (data || []).map((r, index) => {
      const formattedDate = new Date(r.week_start).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return {
        weekStart: r.week_start,
        label: `Week of ${formattedDate}`,
        sprintName: `Sprint Report #${data.length - index}`,
      };
    });
  }

  /**
   * Retrieves the latest report for the authenticated user's team.
   * @param {object} context - { userId, teamId }
   * @param {string|undefined} versionParam
   * @param {string|undefined} weekStart
   * @returns {Promise<object>}
   */
  static async getLatestReport(context, versionParam, weekStart) {
    // 1. Validate version parameter
    const { isValid, sanitizedVersion, error: validationError } = validateVersion(versionParam);
    if (!isValid) {
      throw new ServiceError(validationError, 400);
    }

    // 2. Resolve the user's team
    const teamId = await this.resolveUserTeamId(context);

    // 3. Query report from database (by week_start if supplied, or latest)
    let report = null;
    if (weekStart) {
      const { data, error: dbError } = await ReportModel.findByTeamAndWeek(teamId, weekStart);
      if (dbError) {
        throw new ServiceError(`Database error fetching report: ${dbError.message}`, 500);
      }
      report = data;
    }

    if (!report) {
      const { data, error: dbError } = await ReportModel.findLatestByTeamId(teamId);
      if (dbError) {
        throw new ServiceError(`Database error fetching latest report: ${dbError.message}`, 500);
      }
      report = data;
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
