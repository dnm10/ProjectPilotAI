import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 2 Integration Cards Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5 flex flex-col justify-between h-[280px]"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-11 h-11 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3.5 w-48" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Team Members Card Skeleton */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-60" />
            </div>
          </div>
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {[1, 2, 3, 4, 5].map((m) => (
            <div key={m} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-28 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
