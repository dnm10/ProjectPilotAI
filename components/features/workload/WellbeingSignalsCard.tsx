'use client'

import { HeartHandshake, Sparkles, Loader2, Info } from 'lucide-react'
import { useBurnoutSignals } from '@/hooks/useWorkload'
import { BURNOUT_COLOR_CONFIG } from '@/lib/riskColor'

export default function WellbeingSignalsCard() {
  const { data: burnoutSignals = [], isLoading } = useBurnoutSignals()

  return (
    <div className="bg-white rounded-2xl border border-purple-200/80 p-6 shadow-xs space-y-6 relative overflow-hidden bg-gradient-to-b from-purple-50/20 to-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs border border-purple-200"
            style={{ backgroundColor: `${BURNOUT_COLOR_CONFIG.hex}15`, color: BURNOUT_COLOR_CONFIG.hex }}
          >
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              Wellbeing &amp; Burnout Signals
              <span
                className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border shadow-2xs"
                style={{
                  backgroundColor: `${BURNOUT_COLOR_CONFIG.hex}15`,
                  color: BURNOUT_COLOR_CONFIG.hex,
                  borderColor: `${BURNOUT_COLOR_CONFIG.hex}30`,
                }}
              >
                Lead Confidential
              </span>
            </h2>
            <p className="text-[12px] text-[#64748B]">
              Fatigue heuristics, consecutive sprint load, and velocity anomaly detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] bg-purple-50/60 px-3 py-1.5 rounded-xl border border-purple-100">
          <Info className="w-3.5 h-3.5 shrink-0" style={{ color: BURNOUT_COLOR_CONFIG.hex }} />
          <span>SHAP Fatigue Heuristics Engine</span>
        </div>
      </div>

      {/* Signals Content */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#64748B]">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: BURNOUT_COLOR_CONFIG.hex }} />
          <p className="text-[13px]">Evaluating team fatigue indicators...</p>
        </div>
      ) : burnoutSignals.length === 0 ? (
        <div className="py-8 text-center text-[#64748B] text-[13px]">
          No elevated burnout signals detected across active team members this sprint.
        </div>
      ) : (
        <div className="space-y-5">
          {burnoutSignals.map((signal) => {
            const maxContribution = Math.max(
              ...signal.reasons.map((r) => r.contribution),
              30
            )

            return (
              <div
                key={signal.id}
                className="p-5 rounded-xl border border-purple-100/90 bg-purple-50/20 hover:border-purple-200 transition-all space-y-4"
              >
                {/* Developer Info & Burnout Score Banner */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] text-white shadow-xs"
                      style={{ backgroundColor: BURNOUT_COLOR_CONFIG.hex }}
                    >
                      {signal.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[15px] font-bold text-[#0F172A]">
                          {signal.developer_name}
                        </h4>
                        <span className="text-[11px] font-semibold text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          {signal.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Last assessed: {signal.last_evaluated}
                      </p>
                    </div>
                  </div>

                  {/* Score Pill */}
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span
                        className="text-[28px] font-extrabold tracking-tight leading-none"
                        style={{ color: BURNOUT_COLOR_CONFIG.hex }}
                      >
                        {signal.burnout_score}%
                      </span>
                    </div>
                    <span
                      className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 border"
                      style={{
                        backgroundColor: `${BURNOUT_COLOR_CONFIG.hex}15`,
                        color: BURNOUT_COLOR_CONFIG.hex,
                        borderColor: `${BURNOUT_COLOR_CONFIG.hex}30`,
                      }}
                    >
                      Burnout Signal ({signal.risk_level.toUpperCase()})
                    </span>
                  </div>
                </div>

                {/* SHAP-Style Weighted Reason Bars (Reusing RiskExplainPanel pattern) */}
                <div className="pt-3 border-t border-purple-100/70 space-y-2.5">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Contributing Fatigue Factors (SHAP Explanation)
                  </h5>

                  <div className="space-y-3">
                    {signal.reasons.map((item, idx) => {
                      const widthPercentage = Math.min(
                        100,
                        Math.round((item.contribution / maxContribution) * 100)
                      )

                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-[12px]">
                            <span className="font-medium text-[#0F172A]">
                              {item.reason}
                            </span>
                            <span
                              className="font-bold text-[12px] shrink-0 ml-2"
                              style={{ color: BURNOUT_COLOR_CONFIG.hex }}
                            >
                              +{item.contribution}%
                            </span>
                          </div>

                          {/* Horizontal Weighted Bar in Purple */}
                          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${widthPercentage}%`,
                                backgroundColor: BURNOUT_COLOR_CONFIG.hex,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Actionable Notes */}
                {signal.burnout_notes && (
                  <div className="p-3 bg-white/90 rounded-xl border border-purple-100 text-[12px] text-slate-700 flex items-start gap-2">
                    <Sparkles
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: BURNOUT_COLOR_CONFIG.hex }}
                    />
                    <span>
                      <strong className="text-[#0F172A]">AI Recommendation: </strong>
                      {signal.burnout_notes}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
