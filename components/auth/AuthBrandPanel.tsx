import React from 'react'
import Image from 'next/image'
import { TrendingUp, CheckSquare, Users } from 'lucide-react'

// Brand Logo Icon Component
export function BrandBarLogo({ className = 'w-6 h-6' }: { className?: string; light?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <Image
        src="/favicon-proj.png"
        alt="ProjectPilot AI Logo"
        width={32}
        height={32}
        className="w-full h-full object-contain rounded-sm"
        priority
      />
    </div>
  )
}

// Mountain Path Illustration Component
function MountainPathIllustration() {
  return (
    <div className="absolute right-0 bottom-0 w-full max-w-[280px] h-[160px] pointer-events-none select-none overflow-hidden">
      <svg
        viewBox="0 0 360 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="skyGlowAuth" x1="180" y1="0" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.15" />
            <stop offset="0.6" stopColor="#1E3A8A" stopOpacity="0.05" />
            <stop offset="1" stopColor="#0F172A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mountainBackAuth" x1="180" y1="40" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E3A6C" />
            <stop offset="1" stopColor="#0F1F3D" />
          </linearGradient>
          <linearGradient id="mountainMidAuth" x1="240" y1="50" x2="240" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#18315B" />
            <stop offset="1" stopColor="#0A152A" />
          </linearGradient>
          <linearGradient id="mountainFrontAuth" x1="180" y1="90" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#132749" />
            <stop offset="1" stopColor="#070E1C" />
          </linearGradient>
          <linearGradient id="pathGradientAuth" x1="280" y1="65" x2="160" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#60A5FA" stopOpacity="0.7" />
            <stop offset="1" stopColor="#3B82F6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <circle cx="280" cy="70" r="90" fill="url(#skyGlowAuth)" />
        <circle cx="210" cy="40" r="1.5" fill="#E0F2FE" opacity="0.8" />
        <circle cx="320" cy="35" r="1" fill="#E0F2FE" opacity="0.6" />
        <circle cx="250" cy="25" r="1.2" fill="#E0F2FE" opacity="0.7" />
        <circle cx="160" cy="60" r="1" fill="#E0F2FE" opacity="0.5" />
        <circle cx="300" cy="85" r="1.2" fill="#E0F2FE" opacity="0.8" />

        <path d="M100 230L200 90L290 180L360 110V230H100Z" fill="url(#mountainBackAuth)" opacity="0.7" />
        <path d="M130 230L280 65L360 150V230H130Z" fill="url(#mountainMidAuth)" />
        <path d="M0 230L90 140L210 230H0Z" fill="url(#mountainFrontAuth)" opacity="0.95" />
        <path d="M210 230L310 135L360 180V230H210Z" fill="url(#mountainFrontAuth)" />

        <line x1="280" y1="65" x2="280" y2="48" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M280 48L294 53L280 58V48Z" fill="#38BDF8" />

        <path
          d="M150 230C180 215 210 195 215 175C220 155 190 145 220 120C245 100 265 85 280 66"
          stroke="url(#pathGradientAuth)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M150 230C180 215 210 195 215 175C220 155 190 145 220 120C245 100 265 85 280 66"
          stroke="#E0F2FE"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </svg>
    </div>
  )
}

const BRAND_FEATURES = [
  {
    icon: TrendingUp,
    bgClass: 'bg-[#2563EB]/40',
    iconColor: 'text-[#93C5FD]',
    title: 'Predict Risks',
    description: 'Identify and mitigate risks early',
  },
  {
    icon: CheckSquare,
    bgClass: 'bg-[#4F46E5]',
    iconColor: 'text-white',
    title: 'Generate Tasks',
    description: 'Create structured, actionable plans',
  },
  {
    icon: Users,
    bgClass: 'bg-[#10B981]',
    iconColor: 'text-white',
    title: 'Improve Team Productivity',
    description: 'Keep everyone aligned and on track',
  },
]

export function AuthBrandPanel() {
  return (
    <div className="lg:col-span-5 bg-gradient-to-b from-[#11254A] via-[#1F3864] to-[#152B52] p-6 sm:p-7 lg:p-8 text-white relative flex flex-col justify-between overflow-hidden">
      {/* Top Brand Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <BrandBarLogo className="h-5" light />
          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-white leading-tight">
              ProjectPilot AI
            </h2>
            <p className="text-[11px] font-medium text-white/70 tracking-normal mt-0.5">
              Plan Smarter. Build Better.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Headline & Features */}
      <div className="my-5 lg:my-0 relative z-10">
        <div className="space-y-0.5">
          <h1 className="text-[22px] sm:text-[25px] font-bold text-white tracking-tight leading-[1.18]">
            Turn Ideas into
          </h1>
          <h1 className="text-[22px] sm:text-[25px] font-bold text-[#93C5FD] tracking-tight leading-[1.18]">
            Successful Projects
          </h1>
        </div>

        <p className="text-[12px] text-white/75 mt-2 mb-4 max-w-xs leading-relaxed">
          AI-powered project planning, risk analysis, and task management &mdash; all in one place.
        </p>

        <div className="space-y-2.5">
          {BRAND_FEATURES.map(({ icon: Icon, bgClass, iconColor, title, description }) => (
            <div key={title} className="flex items-center gap-3 group">
              <div className={`w-8 h-8 rounded-lg ${bgClass} border border-white/15 flex items-center justify-center ${iconColor} shadow-inner shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white leading-tight">{title}</h4>
                <p className="text-[11.5px] text-white/70 mt-0.5 leading-tight">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="pt-3 relative z-10">
        <p className="italic text-white/80 font-light text-[12px] leading-snug">
          &ldquo;Better planning today,
          <br />
          brighter outcomes tomorrow.&rdquo;
        </p>
        <div className="w-8 h-[2px] bg-white/40 rounded-full mt-1.5" />
      </div>

      <MountainPathIllustration />
    </div>
  )
}
