import React from 'react'
import { ShapReason } from '@/types'
import { getRiskConfig, BURNOUT_COLOR_CONFIG } from '@/lib/riskColor'

interface RiskExplainPanelProps {
  score: number
  riskType?: string
  reasons?: ShapReason[]
  isBurnout?: boolean
  compact?: boolean
}

export default function RiskExplainPanel({
  score,
  riskType = 'Code-Aware',
  reasons = [],
  isBurnout = false,
  compact = false,
}: RiskExplainPanelProps) {
  const riskConfig = isBurnout ? BURNOUT_COLOR_CONFIG : getRiskConfig(score)
  const maxContribution = Math.max(...reasons.map((r) => r.contribution), 30)

  return (
    <div
      className={`rounded-xl border p-5 ${
        isBurnout
          ? 'bg-purple-50/50 border-purple-200'
          : 'bg-white border-[#E2E8F0]'
      } shadow-sm`}
    >
      {/* Top Header: Score + Risk Type Pill */}
      <div className="flex items-center gap-4">
        <span
          className="text-[34px] font-extrabold tracking-tight"
          style={{ color: riskConfig.hex }}
        >
          {score}%
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-[13px] font-bold"
              style={{ color: riskConfig.hex }}
            >
              {isBurnout ? 'Burnout Signal' : `${riskConfig.label} — ${riskType}`}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">
            Updated 14 minutes ago &bull; SHAP Explanation Model
          </p>
        </div>
      </div>

      {/* Why is this risky? Header */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
          Why is this risky? (Explainable, not a black box)
        </h4>

        {/* Ranked Reasons with Proportional Bars */}
        <div className="space-y-3">
          {reasons.map((item, index) => {
            const widthPercentage = Math.min(
              100,
              Math.round((item.contribution / maxContribution) * 100)
            )

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-[#0F172A]">{item.reason}</span>
                  <span
                    className="font-bold text-[12px] shrink-0 ml-2"
                    style={{ color: riskConfig.hex }}
                  >
                    +{item.contribution}%
                  </span>
                </div>

                {/* Horizontal Weighted Bar */}
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPercentage}%`,
                      backgroundColor: riskConfig.hex,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}