import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { HOME_BY_ROLE, type UserRole } from './types'

export function RoleGuard({roles,children}:{roles:UserRole[];children:React.ReactNode}){
  const {user}=useAuth()
  const location=useLocation()
  if(!user) return <Navigate to="/login" replace state={{from:location.pathname}}/>
  if(!roles.includes(user.role)) return <Navigate to={HOME_BY_ROLE[user.role]} replace/>
  return children
}
