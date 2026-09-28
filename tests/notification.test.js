const { describe, it, beforeEach, after, before } = require('node:test');
const assert = require('node:assert');
const express = require('express');

const NotificationModel = require('../models/notificationModel');
const { validateNotificationPayload, sanitizeNotificationPayload } = require('../schemas/notificationSchema');
const notificationRoutes = require('../routes/notificationRoutes');

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-001',
    user_id: 'user-1',
    team_id: 'team-1',
    type: 'RISK_ALERT',
    message: 'Sprint delay risk exceeds 40%',
    priority_score: 0.8,
    is_read: false,
    created_at: '2026-09-28T12:00:00.000Z',
  },
];

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

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
  NotificationModel.findAll = async ({ user_id } = {}) => {
    let list = [...MOCK_NOTIFICATIONS];
    if (user_id) list = list.filter((n) => n.user_id === user_id);
    return { data: list, error: null };
  };

  NotificationModel.create = async (payload) => {
    return {
      data: [{ id: 'notif-new-999', ...payload, created_at: new Date().toISOString() }],
      error: null,
    };
  };

  NotificationModel.markOneAsRead = async (id) => {
    const found = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (!found) return { data: [], error: null };
    return { data: [{ ...found, is_read: true }], error: null };
  };

  NotificationModel.markAllAsRead = async () => {
    return { data: [{ id: 'notif-001' }], error: null };
  };

  NotificationModel.delete = async (id) => {
    const found = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    return { data: found ? [{ id }] : [], error: null };
  };
});

describe('Notifications Module - Schema & Validation Unit Tests', () => {
  it('validates notification message correctly', () => {
    assert.strictEqual(validateNotificationPayload({ message: 'Meeting started' }).isValid, true);
    assert.strictEqual(validateNotificationPayload({ message: '' }).isValid, false);
  });

  it('sanitizes notification payload properly', () => {
    const sanitized = sanitizeNotificationPayload({
      user_id: 'u-1',
      team_id: 't-1',
      message: '  PR merged  ',
      type: 'PR_MERGE',
      priority_score: 0.5,
    });
    assert.strictEqual(sanitized.message, 'PR merged');
    assert.strictEqual(sanitized.is_read, false);
    assert.strictEqual(sanitized.priority_score, 0.5);
  });
});

describe('Notifications Module - API Endpoint Integration Tests', () => {
  it('GET /api/notifications returns user notifications', async () => {
    const res = await fetch(`${baseUrl}/api/notifications?user_id=user-1`);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.notifications.length, 1);
  });

  it('POST /api/notifications creates a new notification', async () => {
    const res = await fetch(`${baseUrl}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'user-1',
        message: 'New high-risk ticket created',
        type: 'RISK_ALERT',
      }),
    });
    const body = await res.json();

    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.notification.message, 'New high-risk ticket created');
  });

  it('PATCH /api/notifications/:id/read marks single notification as read', async () => {
    const res = await fetch(`${baseUrl}/api/notifications/notif-001/read`, {
      method: 'PATCH',
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.notification.is_read, true);
  });

  it('PATCH /api/notifications/read-all requires user_id or team_id', async () => {
    const res = await fetch(`${baseUrl}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.success, false);
    assert.match(body.message, /user_id or team_id is required/);
  });

  it('DELETE /api/notifications/:id removes notification', async () => {
    const res = await fetch(`${baseUrl}/api/notifications/notif-001`, {
      method: 'DELETE',
    });
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.message, 'Notification deleted successfully');
  });
});
