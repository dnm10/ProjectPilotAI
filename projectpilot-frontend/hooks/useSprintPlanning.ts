import { useMutation } from '@tanstack/react-query'
import {
  generateTasksFromRequirements,
  planSprintSchedule,
  DraftTask,
} from '@/lib/api/planning'

export function useGenerateTasks() {
  return useMutation({
    mutationFn: (requirements: string) =>
      generateTasksFromRequirements(requirements),
  })
}

export function usePlanSprint() {
  return useMutation({
    mutationFn: (tasks: DraftTask[]) => planSprintSchedule(tasks),
  })
}