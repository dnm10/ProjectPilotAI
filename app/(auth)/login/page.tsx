'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { verifyMockLogin } from '@/lib/mockAuth'
import { AuthBrandPanel, BrandBarLogo } from '@/components/auth/AuthBrandPanel'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

// GitHub Icon
function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoNotice, setInfoNotice] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setInfoNotice(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.')
      return
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail.toLowerCase(),
        password,
      })

      if (error) {
        const mockResult = verifyMockLogin(trimmedEmail, password)
        if (mockResult.success) {
          router.push('/dashboard')
          router.refresh()
          return
        }

        setIsLoading(false)
        setErrorMessage(error.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      const mockResult = verifyMockLogin(trimmedEmail, password)
      if (mockResult.success) {
        router.push('/dashboard')
        router.refresh()
        return
      }
      setIsLoading(false)
      setErrorMessage('Authentication failed. Please try again.')
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#DCE4EE] flex items-center justify-center p-2.5 sm:p-4 md:p-6 font-sans antialiased selection:bg-[#4F46E5] selection:text-white">
      <div className="w-full max-w-[1040px] bg-white rounded-[20px] md:rounded-[24px] shadow-[0_20px_50px_-15px_rgba(15,23,42,0.14)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#E2E8F0]/70">
        
        {/* Left Brand Panel */}
        <AuthBrandPanel />

        {/* Right Login Panel */}
        <div className="lg:col-span-7 bg-[#F8FAFC] flex items-center justify-center p-5 sm:p-7 lg:p-9">
          <div className="w-full max-w-[420px] bg-white rounded-xl border border-[#E2E8F0] shadow-[0_6px_25px_rgb(0,0,0,0.03)] p-6 sm:p-7 transition-all">
            
            {/* Header */}
            <div className="text-center mb-4 sm:mb-5">
              <div className="inline-flex items-center justify-center gap-2">
                <BrandBarLogo className="h-6" />
                <h2 className="text-[22px] font-bold text-[#1F3864] tracking-tight">
                  ProjectPilot AI
                </h2>
              </div>
              <p className="text-[12px] text-[#64748B] mt-1">
                Sign in to your team&apos;s dashboard
              </p>
            </div>

            {/* Notifications */}
            {errorMessage && (
              <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600 text-center leading-relaxed animate-in fade-in duration-150">
                {errorMessage}
              </div>
            )}

            {infoNotice && (
              <div className="mb-3.5 p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[12px] text-[#4F46E5] text-center leading-relaxed animate-in fade-in duration-150">
                {infoNotice}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full h-10 bg-white rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-[13.5px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full h-10 bg-white rounded-lg border border-[#E2E8F0] pl-9 pr-10 text-[13.5px] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                  />
                  <span className="text-[12px] text-[#64748B]">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null)
                    setInfoNotice('Password recovery will be available after authentication integration.')
                  }}
                  className="text-[12px] font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[14px] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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

            {/* Divider */}
            <div className="relative my-3.5 flex items-center justify-center">
              <div className="w-full border-t border-[#E2E8F0]" />
              <span className="absolute bg-white px-2.5 text-[10.5px] font-medium text-[#94A3B8] uppercase tracking-wider">
                OR
              </span>
            </div>

            {/* Secondary Option */}
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null)
                setInfoNotice('GitHub login will be available after authentication integration.')
              }}
              className="w-full h-10 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-semibold text-[13.5px] rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <GitHubIcon className="w-4 h-4 text-[#0F172A]" />
              <span>Continue with GitHub</span>
            </button>

            {/* Footer */}
            <p className="text-center text-[12px] text-[#64748B] mt-4">
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