'use client'

import React, { useEffect, useState } from 'react'
import {
  Users,
  Plus,
  Search,
  X,
  UserPlus,
  Loader2,
  ArrowLeft,
  UsersRound,
  Pencil,
  Trash2,
} from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import {
  addTeamMember,
  createTeam,
  fetchAvailableUsers,
  fetchTeamMembers,
  fetchTeams,
  updateTeam,
  deleteTeam,
  updateTeamMember,
  removeTeamMember,
  AvailableUser,
  Team,
} from '@/lib/api/team'
import { TeamMember } from '@/types'

const TEAM_ID_STORAGE_KEY = 'projectpilot_team_id'

const teamRoles = [
  'Project Manager',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'QA Tester',
  'DevOps Engineer',
  'Member',
]

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState('Member')
  const [searchTerm, setSearchTerm] = useState('')

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showEditTeam, setShowEditTeam] = useState(false)

  const [teamName, setTeamName] = useState('')
  const [editingTeamName, setEditingTeamName] = useState('')

  const [editingMember, setEditingMember] =
    useState<TeamMember | null>(null)
  const [editingMemberRole, setEditingMemberRole] = useState('Member')

  const [loadingTeams, setLoadingTeams] = useState(true)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [creatingTeam, setCreatingTeam] = useState(false)
  const [addingMember, setAddingMember] = useState(false)
  const [updatingTeam, setUpdatingTeam] = useState(false)
  const [deletingTeam, setDeletingTeam] = useState(false)
  const [updatingMember, setUpdatingMember] = useState(false)
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(
    null
  )

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTeams = async () => {
    try {
      setLoadingTeams(true)

      const fetchedTeams = await fetchTeams()
      setTeams(fetchedTeams)

      const savedTeamId = localStorage.getItem(TEAM_ID_STORAGE_KEY)

      if (savedTeamId) {
        const savedTeam = fetchedTeams.find(
          (team) => team.id === savedTeamId
        )

        if (savedTeam) {
          setSelectedTeam(savedTeam)
          await loadMembers(savedTeam.id)
        }
      }
    } catch (error) {
      console.error('Failed to load teams:', error)
      setError('Failed to load teams')
    } finally {
      setLoadingTeams(false)
    }
  }

  const loadMembers = async (teamId: string) => {
    try {
      setLoadingMembers(true)

      const members = await fetchTeamMembers(teamId)
      setTeamMembers(members)
    } catch (error) {
      console.error('Failed to load team members:', error)
      setError('Failed to load team members')
    } finally {
      setLoadingMembers(false)
    }
  }

  const loadAvailableUsers = async () => {
    try {
      setLoadingUsers(true)

      const users = await fetchAvailableUsers()
      setAvailableUsers(users)
    } catch (error) {
      console.error('Failed to load available users:', error)
      setError('Failed to load available users')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const handleSelectTeam = async (team: Team) => {
    setSelectedTeam(team)
    setTeamMembers([])
    setSearchTerm('')
    setError('')
    setSuccess('')

    localStorage.setItem(TEAM_ID_STORAGE_KEY, team.id)

    await loadMembers(team.id)
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setTeamMembers([])
    setSearchTerm('')
    setError('')
    setSuccess('')
  }

  const handleOpenAddMember = async () => {
    if (!selectedTeam) {
      setError('Please select a team first')
      return
    }

    setError('')
    setSuccess('')
    setSelectedUserId('')
    setSelectedRole('Member')

    await loadAvailableUsers()
    setShowAddMember(true)
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError('Please enter a team name')
      return
    }

    try {
      setCreatingTeam(true)
      setError('')
      setSuccess('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in to create a team')
        return
      }

      const createdTeam = await createTeam(teamName, user.id)

      setTeams((previousTeams) => [createdTeam, ...previousTeams])
      setSelectedTeam(createdTeam)
      setTeamMembers([])

      localStorage.setItem(TEAM_ID_STORAGE_KEY, createdTeam.id)

      setTeamName('')
      setShowCreateTeam(false)
      setSuccess('Team created successfully')
    } catch (error) {
      console.error('Failed to create team:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to create team'
      )
    } finally {
      setCreatingTeam(false)
    }
  }

  const handleAddMember = async () => {
    if (!selectedTeam) {
      setError('Please select a team first')
      return
    }

    if (!selectedUserId) {
      setError('Please select a user')
      return
    }

    try {
      setAddingMember(true)
      setError('')
      setSuccess('')

      await addTeamMember(
        selectedTeam.id,
        selectedUserId,
        selectedRole
      )

      setShowAddMember(false)
      setSelectedUserId('')
      setSelectedRole('Member')

      await loadMembers(selectedTeam.id)

      setSuccess('Team member added successfully')
    } catch (error) {
      console.error('Failed to add team member:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to add team member'
      )
    } finally {
      setAddingMember(false)
    }
  }

  const handleOpenEditTeam = (team: Team) => {
    setSelectedTeam(team)
    setEditingTeamName(team.name)
    setError('')
    setSuccess('')
    setShowEditTeam(true)
  }

  const handleUpdateTeam = async () => {
    if (!selectedTeam) return

    if (!editingTeamName.trim()) {
      setError('Please enter a team name')
      return
    }

    try {
      setUpdatingTeam(true)
      setError('')
      setSuccess('')

      const updatedTeam = await updateTeam(
        selectedTeam.id,
        editingTeamName.trim()
      )

      setTeams((previousTeams) =>
        previousTeams.map((team) =>
          team.id === updatedTeam.id ? updatedTeam : team
        )
      )

      setSelectedTeam(updatedTeam)
      setShowEditTeam(false)
      setSuccess('Team updated successfully')
    } catch (error) {
      console.error('Failed to update team:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update team'
      )
    } finally {
      setUpdatingTeam(false)
    }
  }

  const handleDeleteTeam = async (team: Team) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${team.name}"? This will also remove its members.`
    )

    if (!confirmed) return

    try {
      setDeletingTeam(true)
      setError('')
      setSuccess('')

      await deleteTeam(team.id)

      setTeams((previousTeams) =>
        previousTeams.filter((item) => item.id !== team.id)
      )

      if (selectedTeam?.id === team.id) {
        setSelectedTeam(null)
        setTeamMembers([])
        localStorage.removeItem(TEAM_ID_STORAGE_KEY)
      }

      setSuccess('Team deleted successfully')
    } catch (error) {
      console.error('Failed to delete team:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete team'
      )
    } finally {
      setDeletingTeam(false)
    }
  }

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setEditingMemberRole(member.role_in_team || 'Member')
    setError('')
    setSuccess('')
  }

  const handleUpdateMember = async () => {
    if (!editingMember) return

    try {
      setUpdatingMember(true)
      setError('')
      setSuccess('')

      await updateTeamMember(
        editingMember.id,
        editingMemberRole
      )

      if (selectedTeam) {
        await loadMembers(selectedTeam.id)
      }

      setEditingMember(null)
      setSuccess('Member role updated successfully')
    } catch (error) {
      console.error('Failed to update member:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update member'
      )
    } finally {
      setUpdatingMember(false)
    }
  }

  const handleRemoveMember = async (member: TeamMember) => {
    const confirmed = window.confirm(
      `Remove ${member.name} from this team?`
    )

    if (!confirmed) return

    try {
      setRemovingMemberId(member.id)
      setError('')
      setSuccess('')

      await removeTeamMember(member.id)

      setTeamMembers((previousMembers) =>
        previousMembers.filter((item) => item.id !== member.id)
      )

      setSuccess('Member removed successfully')
    } catch (error) {
      console.error('Failed to remove member:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to remove member'
      )
    } finally {
      setRemovingMemberId(null)
    }
  }

  const filteredMembers = teamMembers.filter((member) => {
    const search = searchTerm.toLowerCase()

    return (
      member.name.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search) ||
      member.role_in_team.toLowerCase().includes(search)
    )
  })

  const existingMemberIds = new Set(
    teamMembers.map((member) => member.id)
  )

  const selectableUsers = availableUsers.filter(
    (user) => !existingMemberIds.has(user.id)
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {!selectedTeam ? (
          <>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-xl bg-sky-100 p-3">
                    <Users className="h-6 w-6 text-sky-600" />
                  </div>

                  <h1 className="text-3xl font-bold text-slate-900">
                    Teams
                  </h1>
                </div>

                <p className="text-slate-500">
                  Select a team to manage its members.
                </p>
              </div>

              <button
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setShowCreateTeam(true)
                }}
                className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700"
              >
                <Plus className="h-4 w-4" />
                Create Team
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {loadingTeams ? (
              <div className="flex items-center justify-center py-20 text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading teams...
              </div>
            ) : teams.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
                <UsersRound className="mx-auto mb-4 h-12 w-12 text-slate-300" />

                <h2 className="mb-2 text-lg font-semibold text-slate-700">
                  No teams created yet
                </h2>

                <p className="mb-6 text-sm text-slate-500">
                  Create a team to start adding members.
                </p>

                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="mx-auto flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Team
                </button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <button
                        onClick={() => handleSelectTeam(team)}
                        className="rounded-xl bg-sky-100 p-3"
                        title="Open team"
                      >
                        <UsersRound className="h-6 w-6 text-sky-600" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditTeam(team)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                          title="Edit team"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteTeam(team)}
                          disabled={deletingTeam}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete team"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectTeam(team)}
                      className="w-full text-left"
                    >
                      <h2 className="text-xl font-semibold text-slate-900">
                        {team.name}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        Click to view members and manage this team.
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <button
                  onClick={handleBackToTeams}
                  className="mb-4 flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Teams
                </button>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-sky-100 p-3">
                    <Users className="h-6 w-6 text-sky-600" />
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      {selectedTeam.name}
                    </h1>

                    <p className="text-slate-500">
                      Manage members of this team.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenEditTeam(selectedTeam)}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-600"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Team
                </button>

                <button
                  onClick={() => handleDeleteTeam(selectedTeam)}
                  disabled={deletingTeam}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Team
                </button>

                <button
                  onClick={handleOpenAddMember}
                  className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>

            {loadingMembers ? (
              <div className="flex items-center justify-center py-20 text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading team members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-slate-300" />

                <h2 className="mb-2 text-lg font-semibold text-slate-700">
                  No members in this team yet
                </h2>

                <p className="mb-6 text-sm text-slate-500">
                  Add users to this team and assign their responsibilities.
                </p>

                <button
                  onClick={handleOpenAddMember}
                  className="mx-auto flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700"
                >
                  <UserPlus className="h-4 w-4" />
                  Add First Member
                </button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
                          {member.initials}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {member.name}
                          </h3>

                          <p className="truncate text-sm text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => handleOpenEditMember(member)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                          title="Edit member role"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleRemoveMember(member)}
                          disabled={removingMemberId === member.id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Remove member"
                        >
                          {removingMemberId === member.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-500">
                        Role in Team
                      </p>

                      <p className="font-medium text-slate-800">
                        {member.role_in_team}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showCreateTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Create Team
              </h2>

              <button
                onClick={() => setShowCreateTeam(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Team Name
            </label>

            <input
              type="text"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Enter team name"
              className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />

            <button
              onClick={handleCreateTeam}
              disabled={creatingTeam}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {creatingTeam && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {creatingTeam ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </div>
      )}

      {showEditTeam && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Edit Team
              </h2>

              <button
                onClick={() => setShowEditTeam(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Team Name
            </label>

            <input
              type="text"
              value={editingTeamName}
              onChange={(event) =>
                setEditingTeamName(event.target.value)
              }
              placeholder="Enter team name"
              className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />

            <button
              onClick={handleUpdateTeam}
              disabled={updatingTeam}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {updatingTeam && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {updatingTeam ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Edit Member
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update role for {editingMember.name}.
                </p>
              </div>

              <button
                onClick={() => setEditingMember(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role in Team
            </label>

            <select
              value={editingMemberRole}
              onChange={(event) =>
                setEditingMemberRole(event.target.value)
              }
              className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              {teamRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <button
              onClick={handleUpdateMember}
              disabled={updatingMember}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {updatingMember && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {updatingMember ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {showAddMember && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Add Member
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a member to {selectedTeam.name}.
                </p>
              </div>

              <button
                onClick={() => setShowAddMember(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading users...
              </div>
            ) : (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select User
                </label>

                <select
                  value={selectedUserId}
                  onChange={(event) =>
                    setSelectedUserId(event.target.value)
                  }
                  className="mb-5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">Choose a user</option>

                  {selectableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.email || 'Unnamed User'}
                      {' — '}
                      {user.email}
                    </option>
                  ))}
                </select>

                {selectableUsers.length === 0 && (
                  <p className="mb-5 text-sm text-amber-600">
                    No available users found. Create another account first.
                  </p>
                )}

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role in Team
                </label>

                <select
                  value={selectedRole}
                  onChange={(event) =>
                    setSelectedRole(event.target.value)
                  }
                  className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                >
                  {teamRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddMember}
                  disabled={addingMember || selectableUsers.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                >
                  {addingMember && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {addingMember ? 'Adding...' : 'Add Member'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}