'use client'

import React from 'react'
import { Users, ShieldCheck, HeartHandshake } from 'lucide-react'

export default function WorkloadPage() {
  const members = [
    { name: 'Aditi Sharma', role: 'Lead Backend', percentage: 82, points: 13, initials: 'AS', isOverloaded: true },
    { name: 'Kabir Mehta', role: 'AI Engineer', percentage: 63, points: 8, initials: 'KM', isOverloaded: false },
    { name: 'Rohan Verma', role: 'Frontend UI', percentage: 58, points: 8, initials: 'RV', isOverloaded: false },
    { name: 'Meera Iyer', role: 'Database & Auth', percentage: 45, points: 5, initials: 'MI', isOverloaded: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1F3864]" />
            Team Workload &amp; Capacity
          </h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Weekly developer capacity allocation and fatigue monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-3.5 py-1.5 rounded-lg shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#1F3864]" />
          <span className="text-[12px] font-medium text-[#64748B]">Active Role:</span>
          <span className="text-[12px] font-bold uppercase text-[#1F3864] bg-slate-100 px-2 py-0.5 rounded">
            Lead
          </span>
        </div>
      </div>

      {/* Allocation Bars */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
        <h2 className="text-[15px] font-bold text-[#0F172A]">Weekly Capacity Distribution</h2>
        <div className="space-y-4">
          {members.map((m) => (
            <div key={m.name} className="space-y-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="font-semibold text-[#0F172A]">{m.name} ({m.role})</span>
                <span className={`font-bold ${m.isOverloaded ? 'text-[#DC2626]' : 'text-[#4F46E5]'}`}>{m.percentage}% ({m.points} pts)</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${m.isOverloaded ? 'bg-[#DC2626]' : 'bg-[#4F46E5]'}`}
                  style={{ width: `${m.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead-Only Wellbeing Signal */}
      <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-sm bg-gradient-to-b from-purple-50/30 to-transparent space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#A21CAF]" />
            <h2 className="text-[15px] font-bold text-[#0F172A]">Wellbeing Signals (Lead Only)</h2>
          </div>
          <span className="text-[11px] font-bold uppercase text-[#A21CAF] bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full">
            Confidential
          </span>
        </div>
        <p className="text-[13px] text-[#64748B]">
          Aditi Sharma: 3 late-night commits detected past 11:30 PM this week. Velocity surge exceeding 140% historical baseline.
        </p>
      </div>
    </div>
  )
}