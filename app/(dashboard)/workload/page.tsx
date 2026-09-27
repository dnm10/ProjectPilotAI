'use client'

import React from 'react'
import { Users, Crown, User, ShieldCheck } from 'lucide-react'
import { useWorkload } from '@/hooks/useWorkload'
import { useCurrentUserRole } from '@/hooks/useTeamMembers'
import { toast } from '@/lib/toast'
import WorkloadCapacityChart from '@/components/features/workload/WorkloadCapacityChart'
import WellbeingSignalsCard from '@/components/features/workload/WellbeingSignalsCard'
import DeveloperDrilldownModal from '@/components/features/workload/DeveloperDrilldownModal'
import WorkloadSkeleton from '@/components/features/workload/WorkloadSkeleton'

export default function WorkloadPage() {
  const { data: workloadData = [], isLoading } = useWorkload()
  const { isLead, toggleRole } = useCurrentUserRole()

  const handleToggleRole = () => {
    toggleRole()
    if (isLead) {
      toast.info('Switched to Team Member view (Wellbeing signals hidden)', 'Role Simulator')
    } else {
      toast.success('Switched to Lead Admin view (Confidential signals enabled)', 'Role Simulator')
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#1F3864] flex items-center justify-center border border-[#E2E8F0] shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            Team Workload &amp; Capacity
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Weekly developer bandwidth distribution, commit activity telemetry, and fatigue monitoring.
          </p>
        </div>

        {/* Current User Role RBAC Switcher */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-white border border-[#E2E8F0] p-1.5 rounded-xl shadow-2xs">
          <div className="flex items-center gap-1.5 px-2 text-[12px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F3864]" />
            <span className="font-semibold text-[#0F172A]">My Role:</span>
          </div>

          <button
            type="button"
            onClick={handleToggleRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer shadow-2xs ${
              isLead
                ? 'bg-[#1F3864] text-white'
                : 'bg-slate-100 text-slate-700 border border-[#CBD5E1]'
            }`}
            title="Toggle between Lead and Member role to test confidential Wellbeing visibility"
          >
            {isLead ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Lead (Admin)</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Member (Standard)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <WorkloadSkeleton />
      ) : (
        <>
          {/* Top Section: Recharts Workload & Capacity Distribution */}
          <WorkloadCapacityChart data={workloadData} />

          {/* Bottom Section: Lead-Only Wellbeing Signals */}
          {/* Strict RBAC: If not lead, component is NOT rendered in the DOM */}
          {isLead ? <WellbeingSignalsCard /> : null}
        </>
      )}

      {/* Drilldown Dialog Modal */}
      <DeveloperDrilldownModal />
    </div>
  )
}