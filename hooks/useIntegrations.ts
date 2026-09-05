import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchIntegrations,
  connectGitHub,
  disconnectGitHub,
  connectJira,
  disconnectJira,
} from '@/lib/api/integrations'

export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: fetchIntegrations,
  })
}

export function useConnectGitHub() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { repoUrl: string; token: string }) =>
      connectGitHub(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}

export function useDisconnectGitHub() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disconnectGitHub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}

export function useConnectJira() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { domain: string; token: string; projectKey?: string }) =>
      connectJira(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}

export function useDisconnectJira() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disconnectJira,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}
