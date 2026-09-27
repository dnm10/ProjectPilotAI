import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ReportsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Controls Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-xl" />
      </div>

      {/* Main Report Card Skeleton */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xs space-y-7">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>
            <Skeleton className="h-7 w-80" />
          </div>

          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* 4 Metric Chips Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((m) => (
            <div
              key={m}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50/60 space-y-2"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>

        {/* Prose Section Skeleton */}
        <div className="space-y-4 pt-2">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="pt-2 space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
