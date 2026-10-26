import type { UserRole } from '../auth/types'

export type RouteAccess = { path:string; roles:UserRole[]; label:string }

export const ACCESS_MATRIX: RouteAccess[] = [
  { path:'/admin/dashboard', roles:['ADMIN','RECRUITER'], label:'Tổng quan quản trị' },
  { path:'/admin/interviews', roles:['ADMIN','RECRUITER'], label:'Quản lý phỏng vấn' },
  { path:'/admin/candidates', roles:['ADMIN','RECRUITER'], label:'Quản lý ứng viên' },
  { path:'/admin/jobs', roles:['ADMIN','RECRUITER'], label:'Quản lý công việc' },
  { path:'/admin/reports', roles:['ADMIN','RECRUITER'], label:'Báo cáo toàn hệ thống' },
  { path:'/admin/settings', roles:['ADMIN'], label:'Cài đặt hệ thống' },
  { path:'/app', roles:['CANDIDATE'], label:'Trang cá nhân ứng viên' },
  { path:'/app/jobs', roles:['CANDIDATE'], label:'Xem công việc' },
  { path:'/app/interviews/new', roles:['CANDIDATE'], label:'Tạo phiên phỏng vấn' },
  { path:'/app/interviews/:id/*', roles:['CANDIDATE'], label:'Thực hiện phỏng vấn cá nhân' },
  { path:'/app/results', roles:['CANDIDATE'], label:'Kết quả cá nhân' },
  { path:'/app/results/:id', roles:['CANDIDATE'], label:'Chi tiết kết quả cá nhân' },
]
