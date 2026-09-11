'use client'

import React from 'react'
import { IntegrationConfig } from '@/types'
import { CheckCircle2, XCircle, ExternalLink, Loader2, RefreshCw } from 'lucide-react'

interface IntegrationCardProps {
  config?: IntegrationConfig
  isLoading?: boolean
  onConnect: () => void
  onDisconnect: () => void
  isDisconnecting?: boolean
  icon: React.ReactNode
  description: string
  features: string[]
}

export default function IntegrationCard({
  config,
  isLoading = false,
  onConnect,
  onDisconnect,
  isDisconnecting = false,
  icon,
  description,
  features,
}: IntegrationCardProps) {
  const isConnected = config?.isConnected ?? false

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all duration-200">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-xs">
              {icon}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A] tracking-tight">
                {config?.name || 'Integration'}
              </h3>
              <p className="text-[12px] text-[#64748B] font-medium truncate max-w-[220px]">
                {isConnected && config?.targetResource
                  ? config.targetResource
                  : 'Not connected to any workspace'}
              </p>
            </div>
          </div>

          {/* Status Pill */}
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading
            </div>
          ) : isConnected ? (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Connected
            </span>
          ) : (
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Not Connected
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#64748B] leading-relaxed">{description}</p>

        {/* Connected Details or Feature list */}
        {isConnected ? (
          <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-[#64748B]">Target Resource:</span>
              <span className="font-mono font-semibold text-[#0F172A] truncate max-w-[200px]">
                {config?.targetResource}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-[#64748B]">Sync Status:</span>
              <span className="font-medium text-emerald-700 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-emerald-600" />
                Live Webhooks Active
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Key Capabilities:
            </p>
            <ul className="text-[12px] text-slate-600 space-y-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-5 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
        <span className="text-[11px] text-[#64748B]">
          {isConnected ? 'Last synced: Just now' : 'Authentication required'}
        </span>

        {isConnected ? (
          <button
            type="button"
            onClick={onDisconnect}
            disabled={isDisconnecting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Disconnecting...
              </>
            ) : (
              'Disconnect'
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <span>Connect</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
