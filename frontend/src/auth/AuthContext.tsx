import { createContext, useContext, useState } from 'react'
import type { AuthUser, UserRole } from './types'

type AuthContextValue = {
  user: AuthUser | null
  loginAs: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const users: Record<UserRole, AuthUser> = {
  ADMIN: { id: 'admin-01', name: 'Hoàng Nam', email: 'admin@interviewly.vn', role: 'ADMIN' },
  RECRUITER: { id: 'recruiter-01', name: 'Hoàng Nam', email: 'recruiter@interviewly.vn', role: 'RECRUITER' },
  CANDIDATE: { id: 'candidate-01', name: 'Nguyễn Minh Anh', email: 'minhanh@email.com', role: 'CANDIDATE' },
}

export function AuthProvider({children}:{children:React.ReactNode}){
  const stored = sessionStorage.getItem('interviewly-role') as UserRole | null
  const [user,setUser] = useState<AuthUser|null>(stored ? users[stored] : null)
  const loginAs=(role:UserRole)=>{sessionStorage.setItem('interviewly-role',role);setUser(users[role])}
  const logout=()=>{sessionStorage.removeItem('interviewly-role');setUser(null)}
  return <AuthContext.Provider value={{user,loginAs,logout}}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const value=useContext(AuthContext)
  if(!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
