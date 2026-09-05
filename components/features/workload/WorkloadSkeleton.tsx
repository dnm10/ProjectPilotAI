import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function WorkloadSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Capacity & Chart Skeleton Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        {/* Header with stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-3.5 w-80" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32 rounded-xl" />
            <Skeleton className="h-8 w-28 rounded-xl" />
          </div>
        </div>

        {/* Bar chart area skeleton */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>

          <div className="h-[200px] w-full bg-slate-50/70 rounded-xl border border-[#E2E8F0]/80 p-4 flex flex-col justify-around">
            {[82, 63, 58, 45].map((width, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-24 shrink-0" />
                <div className="flex-1 bg-slate-200/40 h-5 rounded-md overflow-hidden">
                  <Skeleton
                    className={`h-full rounded-md ${
                      width > 80 ? 'bg-red-200' : 'bg-indigo-200'
                    }`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member cards grid skeleton */}
        <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
          <Skeleton className="h-3.5 w-40" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[1, 2, 3, 4].map((c) => (
              <div
                key={c}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
