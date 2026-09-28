/**
 * Report Schema & Serialization Layer
 * Validates input parameters and serializes response payloads.
 */

const ALLOWED_VERSIONS = ['technical', 'stakeholder'];

/**
 * Validates the `version` query parameter.
 * @param {string|undefined|null} version
 * @returns {{isValid: boolean, sanitizedVersion: string|null, error: string|null}}
 */
function validateVersion(version) {
  if (version === undefined || version === null || version.trim() === '') {
    return { isValid: true, sanitizedVersion: null, error: null };
  }

  const normalized = version.trim().toLowerCase();
  if (!ALLOWED_VERSIONS.includes(normalized)) {
    return {
      isValid: false,
      sanitizedVersion: null,
      error: `Invalid version parameter '${version}'. Allowed values: ${ALLOWED_VERSIONS.join(', ')}.`,
    };
  }

  return { isValid: true, sanitizedVersion: normalized, error: null };
}

/**
 * Serializes a report database row into the specified response schema.
 * @param {object} report
 * @param {string|null} version - 'technical' | 'stakeholder' | null
 * @returns {object}
 */
function serializeReport(report, version = null) {
  if (!report) return null;

  const timestamp = report.created_at || report.generated_at || new Date().toISOString();

  const base = {
    id: report.id,
    team_id: report.team_id,
    week_start: report.week_start,
    created_at: timestamp,
    updated_at: report.updated_at || timestamp,
    generated_at: report.generated_at || timestamp,
  };

  if (version === 'technical') {
    return {
      ...base,
      technical_version_text: report.technical_version_text,
    };
  }

  if (version === 'stakeholder') {
    return {
      ...base,
      stakeholder_version_text: report.stakeholder_version_text,
    };
  }

  return {
    ...base,
    technical_version_text: report.technical_version_text,
    stakeholder_version_text: report.stakeholder_version_text,
  };
}

module.exports = {
  ALLOWED_VERSIONS,
  validateVersion,
  serializeReport,
};
