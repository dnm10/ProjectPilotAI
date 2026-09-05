'use client'

import React, { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useUpdateTeamMemberRole, useCurrentUserRole } from '@/hooks/useTeamMembers'
import {
  X,
  ShieldCheck,
  User,
  Crown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react'
import { toast } from '@/lib/toast'

export default function EditRoleModal() {
  const { isEditRoleModalOpen, closeEditRoleModal, editingMember } = useSettingsStore()
  const { isLead } = useCurrentUserRole()
  const { mutateAsync: updateRoleMutation, isPending } = useUpdateTeamMemberRole()

  const [selectedRole, setSelectedRole] = useState<'lead' | 'member'>('member')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (editingMember) {
      setSelectedRole(editingMember.role_in_team)
      setError(null)
      setIsSuccess(false)
    }
  }, [editingMember, isEditRoleModalOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditRoleModalOpen && !isPending) {
        closeEditRoleModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditRoleModalOpen, isPending, closeEditRoleModal])

  if (!isEditRoleModalOpen || !editingMember) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLead) {
      setError('Only workspace Leads have permission to modify team member roles.')
      return
    }

    setError(null)
    try {
      await updateRoleMutation({
        memberId: editingMember.id,
        newRole: selectedRole,
      })
      setIsSuccess(true)
      toast.success(
        `${editingMember.name}'s role updated to ${selectedRole === 'lead' ? 'Lead Admin' : 'Team Member'}`,
        'Role Updated'
      )
      setTimeout(() => {
        closeEditRoleModal()
      }, 700)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update member role.'
      setError(msg)
      toast.error(msg, 'Update Failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A]">Edit Member Role</h3>
              <p className="text-[12px] text-[#64748B]">Manage team permissions and access level</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeEditRoleModal}
            disabled={isPending}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-[16px] font-bold text-[#0F172A]">Role Updated Successfully!</h4>
              <p className="text-[13px] text-[#64748B]">
                {editingMember.name}&apos;s role has been updated to{' '}
                <span className="font-bold text-[#0F172A] capitalize">{selectedRole}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Member Preview Card */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#1F3864] text-white flex items-center justify-center font-bold text-[13px] shadow-xs shrink-0">
                  {editingMember.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#0F172A] truncate">
                    {editingMember.name}
                  </p>
                  <p className="text-[12px] text-[#64748B] truncate">{editingMember.email}</p>
                </div>
              </div>

              {/* Lead RBAC check warning if not lead */}
              {!isLead && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-800">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    You are currently in <strong>Member</strong> mode. Only workspace <strong>Leads</strong> can save role changes.
                  </span>
                </div>
              )}

              {/* Role Selection Options */}
              <div className="space-y-2.5">
                <label className="block text-[12px] font-semibold text-[#0F172A]">
                  Select Role Level
                </label>

                {/* Lead Option */}
                <label
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === 'lead'
                      ? 'border-[#1F3864] bg-slate-50 ring-2 ring-[#1F3864]/10'
                      : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="lead"
                    checked={selectedRole === 'lead'}
                    onChange={() => setSelectedRole('lead')}
                    className="mt-1 text-[#1F3864] focus:ring-[#1F3864]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[#1F3864]" />
                      <span className="text-[13px] font-bold text-[#0F172A]">Lead</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1F3864] text-white">
                        Admin
                      </span>
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1">
                      Full authority to configure repository integrations, manage team roles, and trigger sprint simulations.
                    </p>
                  </div>
                </label>

                {/* Member Option */}
                <label
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === 'member'
                      ? 'border-[#4F46E5] bg-indigo-50/40 ring-2 ring-[#4F46E5]/10'
                      : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="member"
                    checked={selectedRole === 'member'}
                    onChange={() => setSelectedRole('member')}
                    className="mt-1 text-[#4F46E5] focus:ring-[#4F46E5]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#64748B]" />
                      <span className="text-[13px] font-bold text-[#0F172A]">Member</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        Standard
                      </span>
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1">
                      Standard team contributor access to sprint boards, ticket details, and automated meeting action checklists.
                    </p>
                  </div>
                </label>
              </div>

              {/* Error Feedback */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={closeEditRoleModal}
                  disabled={isPending}
                  className="px-4 py-2 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !isLead}
                  className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-[#1F3864] hover:bg-[#16294a] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Role</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
