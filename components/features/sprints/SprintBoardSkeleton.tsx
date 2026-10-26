import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function SprintBoardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header Bar Skeleton (Exact match to real header bar) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-40 rounded-lg" />
          <Skeleton className="h-4 w-60 rounded-md" />
        </div>

        {/* Right Controls Skeleton */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sprint Selector */}
          <Skeleton className="h-9 w-28 rounded-lg" />
          {/* Delete Sprint Button */}
          <Skeleton className="h-9 w-28 rounded-lg" />
          {/* Plan New Sprint Button */}
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      {/* 4-Column Drag & Drop Board Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'To Do', count: 3 },
          { title: 'In Progress', count: 3 },
          { title: 'In Review', count: 3 },
          { title: 'Done', count: 3 },
        ].map((col, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-[#F1F5F9]/70 rounded-2xl border border-[#E2E8F0] p-3 space-y-3 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 py-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>

            {/* Ticket Cards Skeleton */}
            <div className="space-y-3 flex-1">
              {Array.from({ length: col.count }).map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs space-y-3"
                >
                  {/* Card Top: Key + Priority */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>

                  {/* Card Title */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                  </div>

                  {/* Card Bottom: Points + Assignee */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <Skeleton className="h-5 w-12 rounded-md" />
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3.5 w-16 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
