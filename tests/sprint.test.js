const { describe, it, beforeEach, after, before } = require('node:test');
const assert = require('node:assert');
const express = require('express');

const SprintModel = require('../models/sprintModel');
const { validateSprintPayload, sanitizeSprintPayload } = require('../schemas/sprintSchema');
const { SprintService } = require('../services/sprintService');
const sprintRoutes = require('../routes/sprintRoutes');

const MOCK_SPRINTS = [
  {
    id: 'sprint-001',
    team_id: 'team-1',
    name: 'Sprint 1 - Foundations',
    start_date: '2026-09-01',
    end_date: '2026-09-14',
    planned_velocity: 30,
    actual_velocity: 28,
    status: 'completed',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'sprint-002',
    team_id: 'team-1',
    name: 'Sprint 2 - Core Engine',
    start_date: '2026-09-15',
    end_date: '2026-09-28',
    planned_velocity: 35,
    actual_velocity: null,
    status: 'active',
    created_at: '2026-09-15T00:00:00.000Z',
  },
];

const app = express();
app.use(express.json());
app.use('/api/sprints', sprintRoutes);

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

beforeEach(() => {
  SprintModel.findAll = async ({ team_id, status } = {}) => {
    let list = [...MOCK_SPRINTS];
    if (team_id) list = list.filter((s) => s.team_id === team_id);
    if (status) list = list.filter((s) => s.status === status);
    return { data: list, error: null };
  };

  SprintModel.create = async (payload) => {
    return {
      data: { id: 'sprint-new-999', ...payload, created_at: new Date().toISOString() },
      error: null,
    };
  };

  SprintModel.findTicketsWithProfiles = async (sprintId) => {
    return {
      data: [
        {
          id: 'ticket-1',
          sprint_id: sprintId,
          title: 'Implement Reports API',
          profiles: { id: 'user-1', full_name: 'Developer Alice' },
        },
      ],
      error: null,
    };
  };

  SprintModel.delete = async (sprintId) => {
    const found = MOCK_SPRINTS.find((s) => s.id === sprintId);
    return { data: found || null, error: null };
  };
});

describe('Sprints Module - Schema & Validation Unit Tests', () => {
  it('validates sprint payload correctly', () => {
    assert.strictEqual(validateSprintPayload({ name: 'Sprint 3' }).isValid, true);
    assert.strictEqual(validateSprintPayload({ name: '' }).isValid, false);
    assert.strictEqual(validateSprintPayload({ name: 'Sprint 3', status: 'invalid_status' }).isValid, false);
  });

  it('sanitizes sprint payload properly', () => {
    const sanitized = sanitizeSprintPayload({
      name: '  Sprint Alpha  ',
      planned_velocity: '40',
      status: 'ACTIVE',
    });
    assert.strictEqual(sanitized.name, 'Sprint Alpha');
    assert.strictEqual(sanitized.planned_velocity, 40);
    assert.strictEqual(sanitized.status, 'active');
  });
});

describe('Sprints Module - API Endpoint Integration Tests', () => {
  it('GET /api/sprints returns sprint list', async () => {
    const res = await fetch(`${baseUrl}/api/sprints?team_id=team-1`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.sprints.length, 2);
  });

  it('POST /api/sprints creates a sprint with team_id', async () => {
    const res = await fetch(`${baseUrl}/api/sprints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_id: 'team-1',
        name: 'Sprint 3',
        planned_velocity: 45,
      }),
    });
    const body = await res.json();

    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.sprint.name, 'Sprint 3');
  });

  it('GET /api/sprints/:sprintId/tickets returns tickets with profiles', async () => {
    const res = await fetch(`${baseUrl}/api/sprints/sprint-001/tickets`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.tickets.length, 1);
    assert.strictEqual(body.tickets[0].profiles.full_name, 'Developer Alice');
  });

  it('DELETE /api/sprints/:sprintId removes sprint', async () => {
    const res = await fetch(`${baseUrl}/api/sprints/sprint-001`, {
      method: 'DELETE',
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.message, 'Sprint deleted successfully');
  });
});
