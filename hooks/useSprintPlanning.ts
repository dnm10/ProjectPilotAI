import { useMutation } from '@tanstack/react-query'

import {
  generateTasksFromRequirements,
  planSprintSchedule,
} from '@/lib/api/planning'

import type {
  DraftTask,
  DeveloperSchedule,
} from '@/lib/api/planning'

import type { TeamMember } from '@/types'

export function useGenerateTasks() {
  return useMutation<DraftTask[], Error, string>({
    mutationFn: (requirements: string) =>
      generateTasksFromRequirements(requirements),
  })
}

export function usePlanSprint() {
  return useMutation<
    DeveloperSchedule[],
    Error,
    {
      tasks: DraftTask[]
      teamMembers: TeamMember[]
    }
  >({
    mutationFn: ({
      tasks,
      teamMembers,
    }) => planSprintSchedule(tasks, teamMembers),
  })
}