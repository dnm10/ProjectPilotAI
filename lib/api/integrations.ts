import { IntegrationConfig } from '@/types'

const GITHUB_STORAGE_KEY = 'projectpilot_github_integration'
const JIRA_STORAGE_KEY = 'projectpilot_jira_integration'

const defaultGitHubIntegration: IntegrationConfig = {
  id: 'int-github',
  name: 'GitHub Integration',
  type: 'github',
  isConnected: true,
  targetResource: 'dnm10/ProjectPilotAI',
  lastSyncedAt: 'Just now',
}

const defaultJiraIntegration: IntegrationConfig = {
  id: 'int-jira',
  name: 'Jira Software',
  type: 'jira',
  isConnected: true,
  targetResource: 'ZENITH-BOARD (Sprint 3)',
  lastSyncedAt: '12 mins ago',
}

let inMemoryGitHub: IntegrationConfig = { ...defaultGitHubIntegration }
let inMemoryJira: IntegrationConfig = { ...defaultJiraIntegration }

function loadIntegrations() {
  if (typeof window !== 'undefined') {
    try {
      const storedGh = localStorage.getItem(GITHUB_STORAGE_KEY)
      if (storedGh) inMemoryGitHub = JSON.parse(storedGh)
      const storedJira = localStorage.getItem(JIRA_STORAGE_KEY)
      if (storedJira) inMemoryJira = JSON.parse(storedJira)
    } catch {
      // fallback to memory
    }
  }
}

function saveIntegrations() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify(inMemoryGitHub))
      localStorage.setItem(JIRA_STORAGE_KEY, JSON.stringify(inMemoryJira))
    } catch {
      // ignore
    }
  }
}

export interface IntegrationsResponse {
  github: IntegrationConfig
  jira: IntegrationConfig
}

export async function fetchIntegrations(): Promise<IntegrationsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  loadIntegrations()
  return {
    github: { ...inMemoryGitHub },
    jira: { ...inMemoryJira },
  }
}

export async function connectGitHub(payload: {
  repoUrl: string
  token: string
}): Promise<IntegrationConfig> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  // Extract repository name from URL if possible
  let repoName = payload.repoUrl.trim()
  try {
    if (repoName.includes('github.com/')) {
      const parts = repoName.split('github.com/')[1].split('/')
      if (parts.length >= 2) {
        repoName = `${parts[0]}/${parts[1].replace('.git', '')}`
      }
    }
  } catch {
    // Keep raw string
  }

  inMemoryGitHub = {
    ...inMemoryGitHub,
    isConnected: true,
    targetResource: repoName || 'dnm10/ProjectPilotAI',
    lastSyncedAt: 'Just now',
  }
  saveIntegrations()
  return { ...inMemoryGitHub }
}

export async function disconnectGitHub(): Promise<IntegrationConfig> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  inMemoryGitHub = {
    ...inMemoryGitHub,
    isConnected: false,
    targetResource: undefined,
    lastSyncedAt: undefined,
  }
  saveIntegrations()
  return { ...inMemoryGitHub }
}

export async function connectJira(payload: {
  domain: string
  token: string
  projectKey?: string
}): Promise<IntegrationConfig> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const cleanDomain = payload.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const project = payload.projectKey ? payload.projectKey.toUpperCase() : 'ZENITH-BOARD'
  const target = `${project} (${cleanDomain || 'atlassian.net'})`

  inMemoryJira = {
    ...inMemoryJira,
    isConnected: true,
    targetResource: target,
    lastSyncedAt: 'Just now',
  }
  saveIntegrations()
  return { ...inMemoryJira }
}

export async function disconnectJira(): Promise<IntegrationConfig> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  inMemoryJira = {
    ...inMemoryJira,
    isConnected: false,
    targetResource: undefined,
    lastSyncedAt: undefined,
  }
  saveIntegrations()
  return { ...inMemoryJira }
}
