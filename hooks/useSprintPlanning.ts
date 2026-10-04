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

export interface GenerateTasksArgs {
  requirements: string
  teamMembers?: TeamMember[]
  startDate?: string
  endDate?: string
  duration?: number | null
}

export function useGenerateTasks() {
  return useMutation<
    DraftTask[],
    Error,
    GenerateTasksArgs | string
  >({
    mutationFn: (
      args: GenerateTasksArgs | string
    ) => {
      if (typeof args === 'string') {
        return generateTasksFromRequirements(args)
      }
      return generateTasksFromRequirements(
        args.requirements,
        args.teamMembers,
        {
          startDate: args.startDate,
          endDate: args.endDate,
          duration: args.duration,
        }
      )
    },
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
