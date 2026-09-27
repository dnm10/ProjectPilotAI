'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  TrendingUp,
  CheckSquare,
  Users,
} from 'lucide-react'

// Brand 3-Bar Chart Logo Icon
function BrandBarLogo({ className = 'w-6 h-6', light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`}>
      <span
        className={`w-[5px] h-[12px] rounded-sm ${
          light ? 'bg-[#93C5FD]' : 'bg-[#60A5FA]'
        }`}
      />
      <span
        className={`w-[5px] h-[18px] rounded-sm ${
          light ? 'bg-[#60A5FA]' : 'bg-[#3B82F6]'
        }`}
      />
      <span
        className={`w-[5px] h-[24px] rounded-sm ${
          light ? 'bg-white' : 'bg-[#1F3864]'
        }`}
      />
    </div>
  )
}

// GitHub Icon
function GitHubIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// Mountain Path Illustration Component
function MountainPathIllustration() {
  return (
    <div className="absolute right-0 bottom-0 w-full max-w-[360px] h-[230px] pointer-events-none select-none overflow-hidden">
      <svg
        viewBox="0 0 360 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="skyGlowLogin" x1="180" y1="0" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.15" />
            <stop offset="0.6" stopColor="#1E3A8A" stopOpacity="0.05" />
            <stop offset="1" stopColor="#0F172A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mountainBackLogin" x1="180" y1="40" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E3A6C" />
            <stop offset="1" stopColor="#0F1F3D" />
          </linearGradient>
          <linearGradient id="mountainMidLogin" x1="240" y1="50" x2="240" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#18315B" />
            <stop offset="1" stopColor="#0A152A" />
          </linearGradient>
          <linearGradient id="mountainFrontLogin" x1="180" y1="90" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#132749" />
            <stop offset="1" stopColor="#070E1C" />
          </linearGradient>
          <linearGradient id="pathGradientLogin" x1="280" y1="65" x2="160" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#60A5FA" stopOpacity="0.7" />
            <stop offset="1" stopColor="#3B82F6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="280" cy="70" r="90" fill="url(#skyGlowLogin)" />

        {/* Distant Stars */}
        <circle cx="210" cy="40" r="1.5" fill="#E0F2FE" opacity="0.8" />
        <circle cx="320" cy="35" r="1" fill="#E0F2FE" opacity="0.6" />
        <circle cx="250" cy="25" r="1.2" fill="#E0F2FE" opacity="0.7" />
        <circle cx="160" cy="60" r="1" fill="#E0F2FE" opacity="0.5" />
        <circle cx="300" cy="85" r="1.2" fill="#E0F2FE" opacity="0.8" />

        {/* Background Mountain Layer */}
        <path
          d="M100 230L200 90L290 180L360 110V230H100Z"
          fill="url(#mountainBackLogin)"
          opacity="0.7"
        />

        {/* Mid-ground Mountain Peak (Summit with Flag) */}
        <path
          d="M130 230L280 65L360 150V230H130Z"
          fill="url(#mountainMidLogin)"
        />

        {/* Foreground Mountain Ridges */}
        <path
          d="M0 230L90 140L210 230H0Z"
          fill="url(#mountainFrontLogin)"
          opacity="0.95"
        />
        <path
          d="M210 230L310 135L360 180V230H210Z"
          fill="url(#mountainFrontLogin)"
        />

        {/* Flag Pole and Flag at Summit */}
        <line x1="280" y1="65" x2="280" y2="48" stroke="#E2E8F0" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M280 48L294 53L280 58V48Z"
          fill="#38BDF8"
        />

        {/* Winding Blue Path Leading to Summit */}
        <path
          d="M150 230C180 215 210 195 215 175C220 155 190 145 220 120C245 100 265 85 280 66"
          stroke="url(#pathGradientLogin)"
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

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoNotice, setInfoNotice] = useState<string | null>(null)

  // Frontend-Only Sign In Verification
  // TODO: Replace temporary frontend authentication with real backend/Supabase authentication.
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setInfoNotice(null)

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

   setIsLoading(true)

const { error } = await supabase.auth.signInWithPassword({
  email: email.trim().toLowerCase(),
  password,
})

if (error) {
  setIsLoading(false)
  setErrorMessage(error.message)
  return
}

router.push('/dashboard')
router.refresh()
  }

  // GitHub Button Handler (Frontend Notice)
  const handleGitHubClick = () => {
    setErrorMessage(null)
    setInfoNotice('GitHub login will be available after authentication integration.')
  }

  // Forgot Password Handler (Frontend Notice)
  const handleForgotPassword = () => {
    setErrorMessage(null)
    setInfoNotice('Password recovery will be available after authentication integration.')
  }

  return (
    <main className="min-h-screen w-full bg-[#DCE4EE] flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-10 font-sans antialiased selection:bg-[#4F46E5] selection:text-white">
      {/* Main Split Container */}
      <div className="w-full max-w-[1180px] min-h-[640px] lg:min-h-[700px] bg-white rounded-[24px] md:rounded-[28px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.16)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#E2E8F0]/70">
        
        {/* ======================================================= */}
        {/* LEFT BRAND PANEL (~42% on desktop: 5 cols out of 12)   */}
        {/* ======================================================= */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#11254A] via-[#1F3864] to-[#152B52] p-8 sm:p-10 lg:p-11 text-white relative flex flex-col justify-between overflow-hidden">
          {/* Top-Left Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <BrandBarLogo className="h-6" light />
              <div>
                <h2 className="text-[19px] font-bold tracking-tight text-white leading-tight">
                  ProjectPilot AI
                </h2>
                <p className="text-[11.5px] font-medium text-white/70 tracking-normal mt-0.5">
                  Plan Smarter. Build Better.
                </p>
              </div>
            </div>
          </div>

          {/* Main Left Content & Features */}
          <div className="my-8 lg:my-0 relative z-10">
            {/* Heading */}
            <div className="space-y-1">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-[1.18]">
                Turn Ideas into
              </h1>
              <h1 className="text-[28px] sm:text-[32px] font-bold text-[#93C5FD] tracking-tight leading-[1.18]">
                Successful Projects
              </h1>
            </div>

            {/* Description */}
            <p className="text-[13px] text-white/75 mt-3 mb-7 max-w-sm leading-relaxed">
              AI-powered project planning, risk analysis, and task management &mdash; all in one place.
            </p>

            {/* 3 Feature Rows */}
            <div className="space-y-4">
              {/* Feature 1: Predict Risks */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/40 border border-white/15 flex items-center justify-center text-[#93C5FD] shadow-inner shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white leading-tight">
                    Predict Risks
                  </h4>
                  <p className="text-[12px] text-white/70 mt-0.5 leading-snug">
                    Identify and mitigate risks early
                  </p>
                </div>
              </div>

              {/* Feature 2: Generate Tasks */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5] border border-white/15 flex items-center justify-center text-white shadow-inner shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white leading-tight">
                    Generate Tasks
                  </h4>
                  <p className="text-[12px] text-white/70 mt-0.5 leading-snug">
                    Create structured, actionable plans
                  </p>
                </div>
              </div>

              {/* Feature 3: Improve Team Productivity */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#10B981] border border-white/15 flex items-center justify-center text-white shadow-inner shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-white leading-tight">
                    Improve Team Productivity
                  </h4>
                  <p className="text-[12px] text-white/70 mt-0.5 leading-snug">
                    Keep everyone aligned and on track
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left Quote & Decorative Line */}
          <div className="pt-4 relative z-10">
            <p className="italic text-white/80 font-light text-[13px] leading-snug">
              &ldquo;Better planning today,
              <br />
              brighter outcomes tomorrow.&rdquo;
            </p>
            <div className="w-10 h-[2px] bg-white/40 rounded-full mt-2.5" />
          </div>

          {/* Bottom Illustration (Mountain Path & Summit Flag) */}
          <MountainPathIllustration />
        </div>

        {/* ======================================================= */}
        {/* RIGHT LOGIN PANEL (~58% on desktop: 7 cols out of 12)  */}
        {/* ======================================================= */}
        <div className="lg:col-span-7 bg-[#F8FAFC] flex items-center justify-center p-6 sm:p-10 lg:p-12">
          {/* Centered Login Card */}
          <div className="w-full max-w-[460px] bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-9 transition-all">
            
            {/* Login Card Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center gap-2.5">
                <BrandBarLogo className="h-7" />
                <h2 className="text-[26px] font-bold text-[#1F3864] tracking-tight">
                  ProjectPilot AI
                </h2>
              </div>
              <p className="text-[13px] text-[#64748B] mt-1.5">
                Sign in to your team&apos;s dashboard
              </p>
            </div>

            {/* Error or Info Notice */}
            {errorMessage && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-[12.5px] text-red-600 text-center leading-relaxed animate-in fade-in duration-150">
                {errorMessage}
              </div>
            )}

            {infoNotice && (
              <div className="mb-5 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-[12.5px] text-[#4F46E5] text-center leading-relaxed animate-in fade-in duration-150">
                {infoNotice}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full h-12 bg-white rounded-xl border border-[#E2E8F0] pl-10 pr-4 text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full h-12 bg-white rounded-xl border border-[#E2E8F0] pl-10 pr-11 text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                  />
                  <span className="text-[13px] text-[#64748B]">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[13px] font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Primary Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[15px] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>

            {/* OR Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-[#E2E8F0]" />
              <span className="absolute bg-white px-3 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                OR
              </span>
            </div>

            {/* Continue with GitHub Secondary Button */}
            <button
              type="button"
              onClick={handleGitHubClick}
              className="w-full h-12 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-semibold text-[14px] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <GitHubIcon className="w-5 h-5 text-[#0F172A]" />
              <span>Continue with GitHub</span>
            </button>

            {/* Sign Up Footer Link */}
            <p className="text-center text-[13px] text-[#64748B] mt-6">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline ml-1 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}