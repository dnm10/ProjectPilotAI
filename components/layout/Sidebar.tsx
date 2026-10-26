'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Kanban,
  CalendarDays,
  Ticket,
  Video,
  ShieldAlert,
  BarChart3,
  Sparkles,
  FileText,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sprint Board', href: '/sprints/board', icon: Kanban },
  { name: 'Sprint Planning', href: '/sprints/plan', icon: CalendarDays },
  { name: 'Tickets', href: '/tickets/TICKET-142', icon: Ticket },
  { name: 'Meetings', href: '/meetings', icon: Video },
  { name: 'Risk Overview', href: '/risk', icon: ShieldAlert },
  { name: 'Workload', href: '/workload', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'What-If Simulation', href: '/simulation', icon: Sparkles },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Chat Assistant', href: '/chat', icon: MessageSquare },
  { name: 'Settings', href: '/settings/integrations', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] h-screen fixed left-0 top-0 bg-[#1F3864] text-white flex flex-col z-30 select-none shadow-lg">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Image
            src="/favicon-proj.png"
            alt="ProjectPilot AI Logo"
            width={28}
            height={28}
            className="w-7 h-7 object-contain rounded-md shrink-0"
            priority
          />
          <span className="font-bold text-[16px] tracking-tight text-white">
            ProjectPilot AI
          </span>
        </div>
      </div>

      {/* Navigation Items - Scrollbar hidden completely */}
      <nav className="flex-1 py-2 px-2.5 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#2F5496] text-white font-semibold shadow-inner'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {/* Indigo Active Left Indicator */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#4F46E5] rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#818CF8]' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 text-[11px] text-slate-400 text-center">
        Sprint 3 &bull; Day 6 of 10
      </div>
    </aside>
  )
}