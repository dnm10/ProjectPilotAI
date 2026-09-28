const { describe, it, beforeEach, after, before } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const express = require('express');

const ReportModel = require('../models/reportModel');
const { validateVersion, serializeReport } = require('../schemas/reportSchema');
const { ReportService, ServiceError } = require('../services/reportService');
const reportRoutes = require('../routes/reportRoutes');

// Mock data fixtures
const TEAM_A_ID = 'team-aaa-111';
const TEAM_B_ID = 'team-bbb-222';
const USER_A_ID = 'user-alice-111';
const USER_B_ID = 'user-bob-222';

const MOCK_REPORTS = [
  {
    id: 'rep-001',
    team_id: TEAM_A_ID,
    week_start: '2026-09-22',
    technical_version_text: 'Technical Report for Week 38: Completed Sprint 4 backend migrations, fixed 3 critical bugs.',
    stakeholder_version_text: 'Stakeholder Report for Week 38: Development is on track with 95% milestone completion.',
    created_at: '2026-09-22T10:00:00.000Z',
    updated_at: '2026-09-22T10:00:00.000Z',
  },
  {
    id: 'rep-002',
    team_id: TEAM_A_ID,
    week_start: '2026-09-29',
    technical_version_text: 'Technical Report for Week 39: Implemented Reports Module, integrated Supabase data layer.',
    stakeholder_version_text: 'Stakeholder Report for Week 39: New automated reporting dashboard launched for executive view.',
    created_at: '2026-09-29T10:00:00.000Z',
    updated_at: '2026-09-29T10:00:00.000Z',
  },
  {
    id: 'rep-003',
    team_id: TEAM_B_ID,
    week_start: '2026-09-29',
    technical_version_text: 'Team B Tech: Microservice decoupling completed.',
    stakeholder_version_text: 'Team B Stakeholder: Architecture modernized.',
    created_at: '2026-09-29T11:00:00.000Z',
    updated_at: '2026-09-29T11:00:00.000Z',
  },
];

// Test app setup
const app = express();
app.use(express.json());
app.use('/reports', reportRoutes);
app.use('/api/reports', reportRoutes);

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

// Mock ReportModel methods for testing
beforeEach(() => {
  ReportModel.findUserTeamId = async (userId) => {
    if (userId === USER_A_ID) return { teamId: TEAM_A_ID, error: null };
    if (userId === USER_B_ID) return { teamId: TEAM_B_ID, error: null };
    return { teamId: null, error: null };
  };

  ReportModel.findLatestByTeamId = async (teamId) => {
    const teamReports = MOCK_REPORTS
      .filter((r) => r.team_id === teamId)
      .sort((a, b) => new Date(b.week_start) - new Date(a.week_start));
    return { data: teamReports[0] || null, error: null };
  };

  ReportModel.findById = async (reportId) => {
    const report = MOCK_REPORTS.find((r) => r.id === reportId);
    return { data: report || null, error: null };
  };
});

describe('Reports Module - Schema & Validation Unit Tests', () => {
  it('validates correct version values (technical, stakeholder, undefined)', () => {
    assert.strictEqual(validateVersion('technical').isValid, true);
    assert.strictEqual(validateVersion('technical').sanitizedVersion, 'technical');
    assert.strictEqual(validateVersion('stakeholder').isValid, true);
    assert.strictEqual(validateVersion('stakeholder').sanitizedVersion, 'stakeholder');
    assert.strictEqual(validateVersion(undefined).isValid, true);
    assert.strictEqual(validateVersion(undefined).sanitizedVersion, null);
  });

  it('rejects invalid version values', () => {
    const result = validateVersion('executive');
    assert.strictEqual(result.isValid, false);
    assert.match(result.error, /Invalid version parameter/);
  });

  it('serializes technical report correctly', () => {
    const report = MOCK_REPORTS[1];
    const serialized = serializeReport(report, 'technical');
    assert.strictEqual(serialized.id, 'rep-002');
    assert.strictEqual(serialized.technical_version_text, report.technical_version_text);
    assert.strictEqual(serialized.stakeholder_version_text, undefined);
  });

  it('serializes stakeholder report correctly', () => {
    const report = MOCK_REPORTS[1];
    const serialized = serializeReport(report, 'stakeholder');
    assert.strictEqual(serialized.id, 'rep-002');
    assert.strictEqual(serialized.stakeholder_version_text, report.stakeholder_version_text);
    assert.strictEqual(serialized.technical_version_text, undefined);
  });

  it('serializes full report when version is omitted', () => {
    const report = MOCK_REPORTS[1];
    const serialized = serializeReport(report, null);
    assert.strictEqual(serialized.technical_version_text, report.technical_version_text);
    assert.strictEqual(serialized.stakeholder_version_text, report.stakeholder_version_text);
  });
});

describe('Reports Module - API Endpoint Integration Tests', () => {
  // Test 1: Latest technical report
  it('1. GET /reports/latest?version=technical returns technical_version_text', async () => {
    const res = await fetch(`${baseUrl}/reports/latest?version=technical`, {
      headers: { 'x-user-id': USER_A_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.report.id, 'rep-002');
    assert.strictEqual(body.report.week_start, '2026-09-29');
    assert.strictEqual(body.report.technical_version_text, MOCK_REPORTS[1].technical_version_text);
    assert.strictEqual(body.report.stakeholder_version_text, undefined);
  });

  // Test 2: Latest stakeholder report
  it('2. GET /reports/latest?version=stakeholder returns stakeholder_version_text', async () => {
    const res = await fetch(`${baseUrl}/reports/latest?version=stakeholder`, {
      headers: { 'x-user-id': USER_A_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.report.id, 'rep-002');
    assert.strictEqual(body.report.week_start, '2026-09-29');
    assert.strictEqual(body.report.stakeholder_version_text, MOCK_REPORTS[1].stakeholder_version_text);
    assert.strictEqual(body.report.technical_version_text, undefined);
  });

  // Test 3: Latest report without version
  it('3. GET /reports/latest (omitted version) returns both versions', async () => {
    const res = await fetch(`${baseUrl}/reports/latest`, {
      headers: { 'x-user-id': USER_A_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.report.id, 'rep-002');
    assert.strictEqual(body.report.technical_version_text, MOCK_REPORTS[1].technical_version_text);
    assert.strictEqual(body.report.stakeholder_version_text, MOCK_REPORTS[1].stakeholder_version_text);
  });

  // Test 4: No reports available for team
  it('4. GET /reports/latest returns 404 when no reports exist for team', async () => {
    // Override findLatestByTeamId to simulate empty reports
    const origFind = ReportModel.findLatestByTeamId;
    ReportModel.findLatestByTeamId = async () => ({ data: null, error: null });

    const res = await fetch(`${baseUrl}/reports/latest`, {
      headers: { 'x-user-id': USER_A_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 404);
    assert.strictEqual(body.success, false);
    assert.match(body.message, /No report found/i);

    ReportModel.findLatestByTeamId = origFind;
  });

  // Test 5: Invalid version parameter
  it('5. GET /reports/latest with invalid version returns 400 validation error', async () => {
    const res = await fetch(`${baseUrl}/reports/latest?version=invalid_format`, {
      headers: { 'x-user-id': USER_A_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Invalid version parameter/);
  });

  // Test 6: Existing report by ID
  it('6. GET /reports/:report_id returns the report for the authenticated user team', async () => {
    const res = await fetch(`${baseUrl}/reports/rep-001`, {
      headers: { 'x-user-id': USER_A_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.report.id, 'rep-001');
    assert.strictEqual(body.report.team_id, TEAM_A_ID);
    assert.strictEqual(body.report.technical_version_text, MOCK_REPORTS[0].technical_version_text);
    assert.strictEqual(body.report.stakeholder_version_text, MOCK_REPORTS[0].stakeholder_version_text);
  });

  // Test 7: Unauthorized cross-team report access
  it('7. GET /reports/:report_id returns 404 when user tries to access another team report', async () => {
    // User B belongs to Team B, trying to access rep-001 (which belongs to Team A)
    const res = await fetch(`${baseUrl}/reports/rep-001`, {
      headers: { 'x-user-id': USER_B_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 404);
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, 'Report not found');
  });

  // Test 8: Non-existent report
  it('8. GET /reports/:report_id returns 404 when report ID does not exist', async () => {
    const res = await fetch(`${baseUrl}/reports/rep-non-existent-999`, {
      headers: { 'x-user-id': USER_A_ID },
    });
    const body = await res.json();

    assert.strictEqual(res.status, 404);
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, 'Report not found');
  });
});
