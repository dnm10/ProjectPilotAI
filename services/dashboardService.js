const DashboardModel = require('../models/dashboardModel');
const supabase = require('../config/supabase');

/**
 * Format relative time helper
 */
function getRelativeTime(isoDateStr) {
  if (!isoDateStr) return 'Just now';
  const diffMs = Date.now() - new Date(isoDateStr).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

class DashboardService {
  /**
   * Helper to resolve team_id
   */
  static async resolveTeamId(teamId) {
    if (teamId && teamId !== 'undefined' && teamId !== 'null') {
      return teamId;
    }
    const { data: team } = await supabase.from('teams').select('id, name').limit(1).maybeSingle();
    return team ? team.id : null;
  }

  /**
   * Get main dashboard metrics & stat cards
   */
  static async getStats(teamId) {
    const resolvedTeamId = await this.resolveTeamId(teamId);
    const { sprint, tickets } = await DashboardModel.getSprintAndTickets(resolvedTeamId);
    const notifications = await DashboardModel.getRecentNotifications(resolvedTeamId, 50);

    // Sprint Day Count & Name calculation
    let sprintName = sprint?.name ? (sprint.name.toLowerCase().startsWith('sprint') ? sprint.name : `Sprint ${sprint.name}`) : 'Active Sprint';
    let sprintDayCount = 'Day 1 of 14';

    if (sprint?.start_date && sprint?.end_date) {
      const start = new Date(sprint.start_date);
      const end = new Date(sprint.end_date);
      const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      const daysPassed = Math.max(1, Math.min(totalDays, Math.round((Date.now() - start) / (1000 * 60 * 60 * 24))));
      sprintDayCount = `Day ${daysPassed} of ${totalDays}`;
    }

    // Story points and completion %
    let totalPoints = 0;
    let completedPoints = 0;
    let highRiskCount = 0;

    tickets.forEach((t) => {
      const pts = Number(t.story_points) || 1;
      totalPoints += pts;
      if (t.status === 'done') {
        completedPoints += pts;
      }
      if (t.priority === 'critical' || t.priority === 'high') {
        highRiskCount++;
      }
    });

    const sprintProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    
    // Release readiness dynamic formula
    const baseReadiness = Math.round(55 + (sprintProgress * 0.4) - (highRiskCount * 3));
    const releaseReadinessScore = Math.max(20, Math.min(95, baseReadiness));

    // Unread alerts count
    const unreadAlertsCount = notifications.filter((n) => !n.is_read).length;

    return {
      sprintProgress,
      highRiskCount,
      releaseReadinessScore,
      unreadAlertsCount,
      sprintName,
      sprintDayCount,
    };
  }

  /**
   * Get top risks list with explainable reasons
   */
  static async getTopRisks(teamId) {
    const resolvedTeamId = await this.resolveTeamId(teamId);
    const tickets = await DashboardModel.getAllTeamTickets(resolvedTeamId);

    if (!tickets || tickets.length === 0) {
      return [];
    }

    const scoredTickets = tickets
      .filter((t) => t.status !== 'done')
      .map((t) => {
        let score = 30;
        let riskType = 'delay';

        if (t.priority === 'critical') {
          score = 85;
          riskType = 'code_aware';
        } else if (t.priority === 'high') {
          score = 72;
          riskType = 'delay';
        } else if (t.priority === 'medium') {
          score = 52;
          riskType = 'delay';
        } else {
          score = 25;
        }

        if (t.status === 'in_progress') {
          score = Math.min(96, score + 8);
        }

        const assigneeName = t.profiles?.full_name || 'Unassigned';
        const pointsStr = t.story_points ? `${t.story_points} story points` : 'Points unestimated';

        let reason = `${pointsStr} · Assignee: ${assigneeName} · Status: ${t.status.replace('_', ' ')}`;
        if (t.priority === 'critical') {
          reason = `Critical priority · ${pointsStr} · Assignee: ${assigneeName} · Pending verification`;
        } else if (!t.assignee_id) {
          reason = `Unassigned deliverable (${pointsStr}) · Needs owner assignment`;
        }

        const ticketKey = t.jira_ticket_key || `TICK-${t.id.slice(0, 4).toUpperCase()}`;

        return {
          ticketId: ticketKey,
          title: t.title,
          riskScore: score,
          reason,
          riskType,
        };
      });

    scoredTickets.sort((a, b) => b.riskScore - a.riskScore);
    return scoredTickets.slice(0, 4);
  }

  /**
   * Get team member workload breakdown
   */
  static async getWorkloadSummary(teamId) {
    const resolvedTeamId = await this.resolveTeamId(teamId);
    const members = await DashboardModel.getTeamMembers(resolvedTeamId);
    const tickets = await DashboardModel.getAllTeamTickets(resolvedTeamId);

    if (!members || members.length === 0) {
      return [];
    }

    return members.map((member) => {
      const name = member.profiles?.full_name || 'Developer';
      const userId = member.user_id || member.profiles?.id;

      // Sum active points assigned to this developer
      const memberTickets = tickets.filter(
        (t) => t.assignee_id === userId && t.status !== 'done'
      );
      const activePoints = memberTickets.reduce((acc, t) => acc + (Number(t.story_points) || 2), 0);

      // Standard developer capacity = 12 points per sprint
      const targetCapacity = 12;
      const calculatedPercentage = Math.min(95, Math.max(30, Math.round((activePoints / targetCapacity) * 100)));

      return {
        name,
        percentage: calculatedPercentage,
      };
    });
  }

  /**
   * Get live activity feed from notifications, tickets, and reports
   */
  static async getRecentActivity(teamId) {
    const resolvedTeamId = await this.resolveTeamId(teamId);
    const notifications = await DashboardModel.getRecentNotifications(resolvedTeamId, 8);
    const report = await DashboardModel.getLatestReport(resolvedTeamId);

    const activities = [];

    // Add notifications to feed
    notifications.forEach((n) => {
      let dotColor = '#4F46E5'; // Indigo default
      if (n.type === 'BLOCKER_ALERT' || (n.priority_score && n.priority_score > 0.7)) {
        dotColor = '#DC2626'; // Red
      } else if (n.type === 'BURNOUT_SIGNAL') {
        dotColor = '#A21CAF'; // Purple
      } else if (n.type === 'SUCCESS' || (n.message && n.message.includes('Resolved'))) {
        dotColor = '#16A34A'; // Green
      } else if (n.type === 'WARNING' || (n.priority_score && n.priority_score > 0.4)) {
        dotColor = '#D97706'; // Amber
      }

      activities.push({
        id: n.id,
        text: n.message,
        timestamp: getRelativeTime(n.created_at),
        rawTime: new Date(n.created_at).getTime(),
        dotColor,
      });
    });

    // Add latest weekly report event if present
    if (report) {
      activities.push({
        id: report.id,
        text: `Weekly AI telemetry report generated — Technical & Stakeholder summaries available`,
        timestamp: getRelativeTime(report.generated_at || report.created_at),
        rawTime: new Date(report.generated_at || report.created_at).getTime(),
        dotColor: '#16A34A',
      });
    }

    // Sort chronologically descending
    activities.sort((a, b) => b.rawTime - a.rawTime);

    return activities.slice(0, 6).map(({ id, text, timestamp, dotColor }) => ({
      id,
      text,
      timestamp,
      dotColor,
    }));
  }

  /**
   * Aggregate full summary in a single call for high performance
   */
  static async getFullSummary(teamId) {
    const resolvedTeamId = await this.resolveTeamId(teamId);
    
    // Fetch team info
    let teamName = 'Zenith';
    if (resolvedTeamId) {
      const { data: team } = await supabase.from('teams').select('name').eq('id', resolvedTeamId).maybeSingle();
      if (team?.name) teamName = team.name;
    }

    const [stats, topRisks, workload, activity] = await Promise.all([
      this.getStats(resolvedTeamId),
      this.getTopRisks(resolvedTeamId),
      this.getWorkloadSummary(resolvedTeamId),
      this.getRecentActivity(resolvedTeamId),
    ]);

    return {
      teamName,
      stats,
      topRisks,
      workload,
      activity,
    };
  }
}

module.exports = DashboardService;
