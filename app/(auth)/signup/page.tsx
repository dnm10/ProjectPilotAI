'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { registerMockAccount } from '@/lib/mockAuth'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  TrendingUp,
  CheckSquare,
  Users,
  CheckCircle2,
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
          <linearGradient id="skyGlowSignup" x1="180" y1="0" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.15" />
            <stop offset="0.6" stopColor="#1E3A8A" stopOpacity="0.05" />
            <stop offset="1" stopColor="#0F172A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mountainBackSignup" x1="180" y1="40" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E3A6C" />
            <stop offset="1" stopColor="#0F1F3D" />
          </linearGradient>
          <linearGradient id="mountainMidSignup" x1="240" y1="50" x2="240" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#18315B" />
            <stop offset="1" stopColor="#0A152A" />
          </linearGradient>
          <linearGradient id="mountainFrontSignup" x1="180" y1="90" x2="180" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#132749" />
            <stop offset="1" stopColor="#070E1C" />
          </linearGradient>
          <linearGradient id="pathGradientSignup" x1="280" y1="65" x2="160" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#60A5FA" stopOpacity="0.7" />
            <stop offset="1" stopColor="#3B82F6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="280" cy="70" r="90" fill="url(#skyGlowSignup)" />

        {/* Distant Stars */}
        <circle cx="210" cy="40" r="1.5" fill="#E0F2FE" opacity="0.8" />
        <circle cx="320" cy="35" r="1" fill="#E0F2FE" opacity="0.6" />
        <circle cx="250" cy="25" r="1.2" fill="#E0F2FE" opacity="0.7" />
        <circle cx="160" cy="60" r="1" fill="#E0F2FE" opacity="0.5" />
        <circle cx="300" cy="85" r="1.2" fill="#E0F2FE" opacity="0.8" />

        {/* Background Mountain Layer */}
        <path
          d="M100 230L200 90L290 180L360 110V230H100Z"
          fill="url(#mountainBackSignup)"
          opacity="0.7"
        />

        {/* Mid-ground Mountain Peak (Summit with Flag) */}
        <path
          d="M130 230L280 65L360 150V230H130Z"
          fill="url(#mountainMidSignup)"
        />

        {/* Foreground Mountain Ridges */}
        <path
          d="M0 230L90 140L210 230H0Z"
          fill="url(#mountainFrontSignup)"
          opacity="0.95"
        />
        <path
          d="M210 230L310 135L360 180V230H210Z"
          fill="url(#mountainFrontSignup)"
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
          stroke="url(#pathGradientSignup)"
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

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Password Requirement Checks (Checked upon submit)
  const validatePasswordStrength = (pwd: string) => {
    const hasMinLength = pwd.length >= 8
    const hasUppercase = /[A-Z]/.test(pwd)
    const hasLowercase = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)

    return (
      hasMinLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    )
  }

  // Frontend-Only Registration Handler
  // TODO: Replace temporary frontend authentication with real backend/Supabase authentication.
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

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
      setErrorMessage('Please enter a password.')
      return
    }

    if (!validatePasswordStrength(password)) {
      setErrorMessage(
        'Password must be at least 8 characters and include a number and special character.'
      )
      return
    }

    if (!confirmPassword) {
      setErrorMessage('Please confirm your password.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    // Register into temporary mock account storage
    const result = registerMockAccount(name, email, password)

    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed. Please try again.')
      return
    }

    setIsLoading(true)
    setSuccessMessage('Account created successfully. Please sign in.')

    // Frontend-only transition back to login page
    setTimeout(() => {
      router.push('/login')
    }, 700)
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
        {/* RIGHT SIGNUP PANEL (~58% on desktop: 7 cols out of 12) */}
        {/* ======================================================= */}
        <div className="lg:col-span-7 bg-[#F8FAFC] flex items-center justify-center p-6 sm:p-10 lg:p-12">
          {/* Centered Signup Card */}
          <div className="w-full max-w-[460px] bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-9 transition-all">
            
            {/* Signup Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center gap-2.5">
                <BrandBarLogo className="h-7" />
                <h2 className="text-[26px] font-bold text-[#1F3864] tracking-tight">
                  ProjectPilot AI
                </h2>
              </div>
              <p className="text-[13px] text-[#64748B] mt-1.5">
                Create your team account
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-[12.5px] text-red-600 text-center leading-relaxed animate-in fade-in duration-150">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[12.5px] text-emerald-700 text-center flex items-center justify-center gap-2 leading-relaxed animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full h-12 bg-white rounded-xl border border-[#E2E8F0] pl-10 pr-4 text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 outline-none transition-all"
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full h-12 bg-white rounded-xl border border-[#E2E8F0] pl-10 pr-11 text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Create Account Primary Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[15px] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>
            </form>

            {/* Already have an account? Sign In Footer */}
            <p className="text-center text-[13px] text-[#64748B] mt-6">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline ml-1 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
