'use client'

import React from 'react'
import {
  useDashboardStats,
  useTopRisks,
  useWorkloadSummary,
  useRecentActivity,
} from '@/hooks/useDashboard'
import StatCard from '@/components/features/dashboard/StatCard'
import TopRisksList from '@/components/features/dashboard/TopRisksList'
import WorkloadBarList from '@/components/features/dashboard/WorkloadBarList'
import ActivityFeed from '@/components/features/dashboard/ActivityFeed'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: topRisks, isLoading: risksLoading } = useTopRisks()
  const { data: workload, isLoading: workloadLoading } = useWorkloadSummary()
  const { data: activity, isLoading: activityLoading } = useRecentActivity()

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
          Good morning, Team Zenith
        </h1>
        <p className="text-[13px] text-[#64748B] mt-0.5">
          Wednesday, 19 August &bull; Sprint 3, Day 6 of 10
        </p>
      </div>

      {/* Row of 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Sprint Progress"
          value={`${stats?.sprintProgress ?? 64}%`}
          progressPercentage={stats?.sprintProgress ?? 64}
        />
        <StatCard
          title="High-Risk Items"
          value={stats?.highRiskCount ?? 3}
          valueColor="text-[#DC2626]"
        />
        <StatCard
          title="Release Readiness"
          value={`${stats?.releaseReadinessScore ?? 74}/100`}
          valueColor="text-[#D97706]"
        />
        <StatCard
          title="Unread Alerts"
          value={stats?.unreadAlertsCount ?? 5}
        />
      </div>

      {/* Two-Column Middle Section: Top Risks (62%) + Team Workload (36%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TopRisksList risks={topRisks} loading={risksLoading} />
        </div>
        <div className="lg:col-span-4">
          <WorkloadBarList workloads={workload} loading={workloadLoading} />
        </div>
      </div>

      {/* Full-Width Recent Activity Feed */}
      <ActivityFeed activities={activity} loading={activityLoading} />
    </div>
  )
}