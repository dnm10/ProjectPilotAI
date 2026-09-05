'use client'

import React, { useState } from 'react'
import { useRunSimulation } from '@/hooks/useSimulation'
import { SimulationResponse } from '@/lib/api/simulation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Sparkles,
  Play,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Info,
} from 'lucide-react'

export default function SimulationPage() {
  const [sprint, setSprint] = useState('Sprint 3 (Aug 14–24)')
  const [scenarioType, setScenarioType] = useState('Developer unavailable')
  const [developer, setDeveloper] = useState('Rohan Verma')
  const [duration, setDuration] = useState('2 days, starting Monday')
  const [reassignTo, setReassignTo] = useState('Meera Iyer (Auto-suggested)')

  const [result, setResult] = useState<SimulationResponse | null>({
    summarySentence:
      '81% chance of finishing by Oct 23 if TICKET-114 is reassigned to Meera — up from 62% if left unchanged.',
    baselineProbability: 62,
    scenarioProbability: 81,
    baselineMedianDate: 'Oct 27, 2026',
    scenarioMedianDate: 'Oct 23, 2026',
    histogramData: [
      { date: 'Oct 20', probability: 8 },
      { date: 'Oct 21', probability: 18 },
      { date: 'Oct 22', probability: 64 },
      { date: 'Oct 23', probability: 81 },
      { date: 'Oct 24', probability: 45 },
      { date: 'Oct 25', probability: 28 },
      { date: 'Oct 26', probability: 14 },
      { date: 'Oct 27', probability: 6 },
    ],
  })

  const runSimulationMutation = useRunSimulation()

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await runSimulationMutation.mutateAsync({
      sprintId: sprint,
      scenarioType,
      developer,
      duration,
      reassignTo,
    })
    setResult(res)
  }

  const getProbabilityBadge = (prob: number) => {
    if (prob >= 75) {
      return (
        <span className="text-[12px] font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {prob}%
        </span>
      )
    }
    if (prob >= 50) {
      return (
        <span className="text-[12px] font-bold text-[#D97706] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          {prob}%
        </span>
      )
    }
    return (
      <span className="text-[12px] font-bold text-[#DC2626] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
        {prob}%
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#4F46E5]" />
          What-If Simulation
        </h1>
        <p className="text-[13px] text-[#64748B] mt-0.5">
          Test a scenario before it happens — runs 500 Monte Carlo trials over your team&apos;s real velocity history.
        </p>
      </div>

      {/* Two-Column Layout: Left (32%) + Right (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (32% / 4 cols): Scenario Builder Form */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
            <h2 className="text-[15px] font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Build a Scenario
            </h2>

            <form onSubmit={handleRun} className="space-y-4">
              {/* Sprint Select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Sprint
                </label>
                <select
                  value={sprint}
                  onChange={(e) => setSprint(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                >
                  <option>Sprint 3 (Aug 14–24)</option>
                  <option>Sprint 2 (Completed)</option>
                </select>
              </div>

              {/* Scenario Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Scenario Type
                </label>
                <select
                  value={scenarioType}
                  onChange={(e) => setScenarioType(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                >
                  <option>Developer unavailable</option>
                  <option>Ticket delayed</option>
                  <option>Scope increase (+8 pts)</option>
                  <option>PR review bottleneck</option>
                </select>
              </div>

              {/* Developer */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Developer
                </label>
                <select
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                >
                  <option>Rohan Verma</option>
                  <option>Aditi Sharma</option>
                  <option>Meera Iyer</option>
                  <option>Kabir Mehta</option>
                </select>
              </div>

              {/* Duration Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              {/* Reassign Select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Reassign Open Tickets To
                </label>
                <select
                  value={reassignTo}
                  onChange={(e) => setReassignTo(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                >
                  <option>Meera Iyer (Auto-suggested)</option>
                  <option>Aditi Sharma</option>
                  <option>Kabir Mehta</option>
                  <option>Leave unassigned</option>
                </select>
              </div>

              {/* Run Simulation Button */}
              <button
                type="submit"
                disabled={runSimulationMutation.isPending}
                className="w-full h-11 flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[13px] rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {runSimulationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running 500 Monte Carlo trials...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (65% / 8 cols): Simulation Results */}
        <div className="lg:col-span-8 space-y-5">
          {result && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-6">
              <h2 className="text-[16px] font-bold text-[#0F172A]">
                Result — Probability of On-Time Completion
              </h2>

              {/* Green-Tinted Result Banner (Page 9 of PDF) */}
              <div className="bg-[#ECFDF5] border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#065F46] shrink-0 mt-0.5" />
                <p className="text-[13px] font-semibold text-[#065F46] leading-relaxed">
                  {result.summarySentence}
                </p>
              </div>

              {/* Recharts BarChart Probability Histogram */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
                    Completion Date Probability Distribution
                  </h3>
                  <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    500 Monte Carlo Iterations
                  </span>
                </div>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={result.histogramData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        stroke="#E2E8F0"
                      />
                      <YAxis
                        unit="%"
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        stroke="#E2E8F0"
                      />
                      <Tooltip
                        formatter={(value: any) => [`${value}% Likelihood`, 'Probability']}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                        {result.histogramData.map((entry, index) => {
                          // Color gradient from #818CF8 to #4F46E5 by probability height
                          const isPeak = entry.probability >= 75
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={isPeak ? '#4F46E5' : '#818CF8'}
                            />
                          )
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparison Table: Baseline vs Scenario */}
              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  Scenario Comparison
                </h3>

                <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F8FAFC] text-[#64748B] text-[11px] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                      <tr>
                        <th className="py-3 px-4">Scenario</th>
                        <th className="py-3 px-4">Median Finish Date</th>
                        <th className="py-3 px-4">On-Time Probability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-medium text-[#64748B]">
                          No change (baseline)
                        </td>
                        <td className="py-3.5 px-4 text-[#0F172A]">
                          {result.baselineMedianDate}
                        </td>
                        <td className="py-3.5 px-4">
                          {getProbabilityBadge(result.baselineProbability)}
                        </td>
                      </tr>
                      <tr className="bg-indigo-50/30 hover:bg-indigo-50/50 font-semibold">
                        <td className="py-3.5 px-4 text-[#4F46E5] flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" />
                          Reassign TICKET-114 to Meera
                        </td>
                        <td className="py-3.5 px-4 text-[#0F172A]">
                          {result.scenarioMedianDate}
                        </td>
                        <td className="py-3.5 px-4">
                          {getProbabilityBadge(result.scenarioProbability)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}