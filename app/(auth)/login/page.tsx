'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'

// Self-contained ProjectPilot AI Logo
function Logo({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'
  const textSize = size === 'lg' ? 'text-[22px]' : 'text-[18px]'

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-br from-[#1F3864] via-[#2F5496] to-[#4F46E5] flex items-center justify-center shadow-md shadow-indigo-950/20 ring-1 ring-white/20 relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-500"
        >
          <polygon points="12 2 19 21 12 17 5 21 12 2" fill="rgba(255,255,255,0.15)" />
          <circle cx="12" cy="11" r="1.5" fill="#818CF8" stroke="none" />
        </svg>
      </div>
      <div className={`font-extrabold tracking-tight leading-none ${textSize}`}>
        <span className="text-[#1F3864]">ProjectPilot</span>
        <span className="text-[#4F46E5] ml-0.5">.ai</span>
      </div>
    </div>
  )
}

// Clean GitHub SVG Icon
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGitHubLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 400)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#1F3864] via-[#1F3864]/95 to-[#F8FAFC] p-4 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Login Card */}
      <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-8 text-center transition-all relative z-10">
        {/* Brand Logo & Name */}
        <div className="flex justify-center mb-3">
          <Logo size="lg" />
        </div>

        {/* Subtitle */}
        <p className="text-[13px] text-[#64748B] mb-8 font-medium">
          Sign in to your team&apos;s project intelligence dashboard
        </p>

        {/* Continue with GitHub Button */}
        <button
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="w-full h-12 flex items-center justify-center gap-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[14px] rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <GitHubIcon className="w-5 h-5 text-white" />
          )}
          <span>{isLoading ? 'Entering Dashboard...' : 'Continue with GitHub'}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Footer Note */}
        <p className="text-[11px] text-[#64748B] mt-6 leading-relaxed">
          Explainable ML risk prediction, code-aware bottlenecks &amp; automated project analytics for engineering teams.
        </p>
      </div>
    </div>
  )
}