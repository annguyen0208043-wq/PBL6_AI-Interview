export type UserRole = 'ADMIN' | 'RECRUITER' | 'CANDIDATE'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

export const HOME_BY_ROLE: Record<UserRole, string> = {
  ADMIN: '/admin/dashboard',
  RECRUITER: '/admin/dashboard',
  CANDIDATE: '/app',
}
