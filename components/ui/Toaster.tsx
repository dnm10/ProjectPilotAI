'use client'

import React from 'react'
import { useToastStore, ToastItem } from '@/store/useToastStore'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

function ToastCard({ toast }: { toast: ToastItem }) {
  const { removeToast } = useToastStore()

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
      case 'info':
      default:
        return <Info className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200 bg-white'
      case 'error':
        return 'border-red-200 bg-white'
      case 'info':
      default:
        return 'border-[#E2E8F0] bg-white'
    }
  }

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in ${getBorderColor()}`}
      role="status"
    >
      <div className="flex items-start gap-2.5 min-w-0">
        {getIcon()}
        <div className="min-w-0">
          {toast.title && (
            <p className="text-[13px] font-bold text-[#0F172A] truncate">
              {toast.title}
            </p>
          )}
          <p className="text-[12px] font-medium text-slate-700 leading-snug">
            {toast.message}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function Toaster() {
  const { toasts } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
