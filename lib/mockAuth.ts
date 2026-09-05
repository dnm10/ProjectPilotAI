/**
 * Temporary Frontend Mock Authentication Helper
 *
 * NOTE: This is for frontend prototyping and demonstration purposes only.
 * No real backend, database, or Supabase calls are performed.
 *
 * TODO: Replace temporary frontend authentication with real backend/Supabase authentication.
 */

export interface MockUserAccount {
  name: string
  email: string
  password: string
  createdAt: string
}

const STORAGE_KEY = 'projectpilot_mock_users_v1'

export function getMockAccounts(): MockUserAccount[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as MockUserAccount[]
  } catch {
    return []
  }
}

export function registerMockAccount(
  name: string,
  email: string,
  password: string
): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Storage not available' }
  }

  const normalizedEmail = email.trim().toLowerCase()
  const accounts = getMockAccounts()

  const existing = accounts.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail
  )

  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please sign in.',
    }
  }

  const newAccount: MockUserAccount = {
    name: name.trim(),
    email: normalizedEmail,
    password, // Stored locally only for mock UI testing
    createdAt: new Date().toISOString(),
  }

  try {
    accounts.push(newAccount)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to save account locally.' }
  }
}

export function verifyMockLogin(
  email: string,
  password: string
): { success: boolean; error?: string; user?: MockUserAccount } {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = getMockAccounts()

  const found = accounts.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail
  )

  if (!found) {
    return {
      success: false,
      error: 'No account found. Please sign up first.',
    }
  }

  if (found.password !== password) {
    return {
      success: false,
      error: 'Invalid email or password.',
    }
  }

  return {
    success: true,
    user: found,
  }
}
