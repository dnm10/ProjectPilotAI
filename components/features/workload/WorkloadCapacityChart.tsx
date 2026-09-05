'use client'

import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'
import { DeveloperWorkload } from '@/types'
import { useWorkloadStore } from '@/store/useWorkloadStore'
import {
  Users,
  AlertTriangle,
  ChevronRight,
  GitCommit,
} from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

interface WorkloadCapacityChartProps {
  data?: DeveloperWorkload[]
}

export default function WorkloadCapacityChart({
  data = [],
}: WorkloadCapacityChartProps) {
  const { openDrilldown } = useWorkloadStore()

  const totalPoints = data.reduce((acc, curr) => acc + curr.story_points, 0)
  const overloadedCount = data.filter((d) => d.workload_percentage > 80).length
  const avgWorkload =
    data.length > 0
      ? Math.round(
          data.reduce((acc, curr) => acc + curr.workload_percentage, 0) /
            data.length
        )
      : 0

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No workload data recorded"
        description="Team members and story points will display here once sprint backlog allocation begins."
      />
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
      {/* Header & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              Weekly Capacity &amp; Workload Distribution
            </h2>
            <p className="text-[12px] text-[#64748B]">
              Real-time sprint point allocation &bull; Click any developer to inspect Git commits and PR turnaround
            </p>
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[12px]">
            <span className="text-[#64748B]">Avg Workload:</span>
            <span className="font-bold text-[#0F172A]">{avgWorkload}%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[12px]">
            <span className="text-[#64748B]">Total Points:</span>
            <span className="font-bold text-[#4F46E5]">{totalPoints} pts</span>
          </div>

          {overloadedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>{overloadedCount} Overloaded (&gt;80%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Recharts Horizontal Bar Chart */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-2 px-1">
          <span className="font-semibold uppercase tracking-wider">
            Developer Capacity (% of Weekly Bandwidth)
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#4F46E5]" />
              <span>Optimal (&le; 80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]" />
              <span>Overloaded (&gt; 80%)</span>
            </div>
          </div>
        </div>

        <div className="h-[220px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis
                type="number"
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 11, fill: '#64748B' }}
                stroke="#CBD5E1"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#0F172A', fontWeight: 600 }}
                stroke="#CBD5E1"
                width={110}
              />
              <Tooltip
                formatter={(value: unknown) => [`${value}%`, 'Workload Capacity']}
                labelFormatter={(label: unknown) => `${label}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px -4px rgba(15,23,42,0.08)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="workload_percentage"
                radius={[0, 6, 6, 0]}
                barSize={20}
              >
                {data.map((entry) => {
                  const isOverloaded = entry.workload_percentage > 80
                  return (
                    <Cell
                      key={`bar-${entry.id}`}
                      fill={isOverloaded ? '#DC2626' : '#4F46E5'}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      onClick={() => openDrilldown(entry.id)}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Developer Cards List */}
      <div className="pt-3 border-t border-[#E2E8F0]">
        <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
          Member Allocation Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {data.map((dev) => {
            const isOverloaded = dev.workload_percentage > 80

            return (
              <button
                key={dev.id}
                type="button"
                onClick={() => openDrilldown(dev.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 group cursor-pointer ${
                  isOverloaded
                    ? 'border-red-200 bg-red-50/20 hover:border-red-300 hover:bg-red-50/40'
                    : 'border-[#E2E8F0] bg-slate-50/40 hover:border-[#4F46E5]/40 hover:bg-slate-50/90'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12px] shadow-xs shrink-0 ${
                        isOverloaded
                          ? 'bg-red-600 text-white'
                          : 'bg-[#1F3864] text-white'
                      }`}
                    >
                      {dev.initials}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors flex items-center gap-1.5">
                        <span>{dev.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#4F46E5]" />
                      </h4>
                      <p className="text-[12px] text-[#64748B]">{dev.role}</p>
                    </div>
                  </div>

                  {/* Percentage badge */}
                  <span
                    className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isOverloaded
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-indigo-50 text-[#4F46E5] border-indigo-200'
                    }`}
                  >
                    {dev.workload_percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverloaded ? 'bg-[#DC2626]' : 'bg-[#4F46E5]'
                      }`}
                      style={{ width: `${Math.min(100, dev.workload_percentage)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>{dev.story_points} story points ({dev.assigned_tickets_count} tickets)</span>
                    <span className="font-semibold text-[#4F46E5] flex items-center gap-1 group-hover:underline">
                      <GitCommit className="w-3 h-3" />
                      View Commits &amp; PRs
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
