'use client'

import React from 'react'
import Link from 'next/link'
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
import {
  TrendingUp,
  AlertTriangle,
  Gauge,
  Bell,
  Play,
  CalendarDays,
  MessageSquare,
} from 'lucide-react'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: topRisks, isLoading: risksLoading } = useTopRisks()
  const { data: workload, isLoading: workloadLoading } = useWorkloadSummary()
  const { data: activity, isLoading: activityLoading } = useRecentActivity()

  return (
    <div className="relative space-y-6">
      {/* Ambient Background Glow Blobs */}
      <div className="absolute -top-10 left-1/4 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-[#1F3864]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Greeting & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Sync
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#0F172A] tracking-tight">
            Good morning, Team Zenith
          </h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Wednesday, 19 August &bull; Sprint 3, Day 6 of 10
          </p>
        </div>

        {/* Quick Action Shortcut Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/simulation"
            className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all shadow-sm hover:shadow-md hover:scale-102"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run What-If</span>
          </Link>
          <Link
            href="/sprints/plan"
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all shadow-xs"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>AI Sprint Planner</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Row of 4 Glassmorphism Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Sprint Progress"
          value={`${stats?.sprintProgress ?? 64}%`}
          trend="+12% velocity"
          trendUp={true}
          progressPercentage={stats?.sprintProgress ?? 64}
          icon={TrendingUp}
          iconBg="bg-gradient-to-br from-[#1F3864] to-[#4F46E5]"
        />
        <StatCard
          title="High-Risk Items"
          value={stats?.highRiskCount ?? 3}
          valueColor="text-[#DC2626]"
          subtitle="Requires attention"
          icon={AlertTriangle}
          iconBg="bg-gradient-to-br from-[#DC2626] to-[#EF4444]"
        />
        <StatCard
          title="Release Readiness"
          value={`${stats?.releaseReadinessScore ?? 74}/100`}
          valueColor="text-[#D97706]"
          trend="81% on-time prob"
          trendUp={true}
          icon={Gauge}
          iconBg="bg-gradient-to-br from-[#D97706] to-[#F59E0B]"
        />
        <StatCard
          title="Unread Alerts"
          value={stats?.unreadAlertsCount ?? 5}
          subtitle="2 lead-only signals"
          icon={Bell}
          iconBg="bg-gradient-to-br from-[#1F3864] to-[#2F5496]"
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