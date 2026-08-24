import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Fixed 220px Navy Sidebar */}
      <Sidebar />

      {/* Fixed Topbar */}
      <Topbar />

      {/* Main Content Area (Offset for 220px Sidebar & 64px Topbar) */}
      <main className="pl-[220px] pt-16 min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  )
}