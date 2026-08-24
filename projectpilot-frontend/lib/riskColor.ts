/**
 * Single source of truth for Risk Severity thresholds & colors across ProjectPilot AI.
 * (Section 2 & Global Rule on Page 11 of PDF)
 *
 * Rules:
 * - High Risk:   >= 70%  (Red   #DC2626)
 * - Medium Risk: 40 - 69% (Amber #D97706)
 * - Low Risk:    < 40%   (Green #16A34A)
 * - Burnout:     Sensitive (Purple #A21CAF)
 */

export type RiskLevel = 'high' | 'medium' | 'low'

export interface RiskColorConfig {
  level: RiskLevel
  label: string
  hex: string
  bgClass: string
  textClass: string
  borderClass: string
  badgeClass: string
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

export function getRiskConfig(score: number): RiskColorConfig {
  const level = getRiskLevel(score)

  switch (level) {
    case 'high':
      return {
        level: 'high',
        label: 'High Risk',
        hex: '#DC2626',
        bgClass: 'bg-red-500',
        textClass: 'text-red-600',
        borderClass: 'border-red-500',
        badgeClass: 'bg-[#DC2626] text-white',
      }
    case 'medium':
      return {
        level: 'medium',
        label: 'Medium Risk',
        hex: '#D97706',
        bgClass: 'bg-amber-500',
        textClass: 'text-amber-600',
        borderClass: 'border-amber-500',
        badgeClass: 'bg-[#D97706] text-white',
      }
    case 'low':
      return {
        level: 'low',
        label: 'Low Risk',
        hex: '#16A34A',
        bgClass: 'bg-emerald-500',
        textClass: 'text-emerald-600',
        borderClass: 'border-emerald-500',
        badgeClass: 'bg-[#16A34A] text-white',
      }
  }
}

/**
 * Dedicated color config for Sensitive Burnout / Wellbeing signals (Page 3 of PDF)
 */
export const BURNOUT_COLOR_CONFIG = {
  label: 'Burnout Signal',
  hex: '#A21CAF',
  bgClass: 'bg-fuchsia-700',
  textClass: 'text-[#A21CAF]',
  badgeClass: 'bg-[#A21CAF] text-white',
}