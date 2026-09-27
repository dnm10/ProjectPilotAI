import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function MeetingsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3.5 shadow-xs"
          >
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Meeting Cards Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4 flex flex-col justify-between h-[210px]"
          >
            <div className="space-y-3">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-3.5 w-16" />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Participants */}
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4].map((p) => (
                  <Skeleton key={p} className="w-6 h-6 rounded-full" />
                ))}
              </div>
            </div>

            {/* Footer row */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
