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
const CURRENT_USER_KEY = 'projectpilot_mock_current_user'

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

export function setMockSession(user: { name: string; email: string }) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } catch {
    // Ignore storage quota errors
  }
}

export function getMockSession(): { name: string; email: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearMockSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function registerMockAccount(
  name: string,
  email: string,
  password: string
): { success: boolean; error?: string; user?: MockUserAccount } {
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
    password,
    createdAt: new Date().toISOString(),
  }

  try {
    accounts.push(newAccount)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
    setMockSession({ name: newAccount.name, email: newAccount.email })
    return { success: true, user: newAccount }
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

  setMockSession({ name: found.name, email: found.email })

  return {
    success: true,
    user: found,
  }
}
