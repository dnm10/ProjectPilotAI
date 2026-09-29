import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Hero Greeting Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md px-5 py-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/90 rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section Skeleton: Top Risks + Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Top Risks */}
        <div className="lg:col-span-8 bg-white/90 rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-3.5 w-56 rounded-md" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((r) => (
              <div
                key={r}
                className="p-3.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-60 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Team Workload */}
        <div className="lg:col-span-4 bg-white/90 rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-3.5 w-40 rounded-md" />
            </div>
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map((w) => (
              <div key={w} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-10 rounded-md" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed Skeleton */}
      <div className="bg-white/90 rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
        <div className="space-y-3 pt-1">
          {[1, 2, 3, 4].map((a) => (
            <div key={a} className="flex items-center gap-3 py-2">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
