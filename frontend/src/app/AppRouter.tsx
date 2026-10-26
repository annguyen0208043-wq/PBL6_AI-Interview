import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../auth/AuthContext'
import { RoleGuard } from '../auth/RoleGuard'
import { HOME_BY_ROLE } from '../auth/types'
import { Login, type Page } from '../App'
import { CandidatesPage, Dashboard, InterviewsPage, JobsPage, ReportPage, ReportsPage, SettingsPage, StartInterview } from '../admin/pages'
import { AnalysisPage, DeviceCheckPage, InterviewRoom, ProcessingPage } from '../interview/pages'
import { CandidateCreateInterview, CandidateHome, CandidateJobs, CandidateProfile, CandidateResultDetail, CandidateResults } from '../candidate/CandidatePages'

const adminPath:Record<Page,string>={
  login:'/login',dashboard:'/admin/dashboard',start:'/admin/interviews/new',interviews:'/admin/interviews',candidates:'/admin/candidates',jobs:'/admin/jobs',reports:'/admin/reports',settings:'/admin/settings',analysis:'/admin/interviews/demo/analysis',device:'/admin/interviews/demo/device-check',room:'/admin/interviews/demo/room',processing:'/admin/interviews/demo/processing',report:'/admin/reports/1042'
}

function AdminScreen({component:Component}:{component:React.ComponentType<{go:(page:Page)=>void}>}){
  const navigate=useNavigate()
  return <Component go={(page)=>navigate(adminPath[page])}/>
}

function CandidateFlow({screen}:{screen:'device'|'room'|'processing'}){
  const navigate=useNavigate()
  const go=(page:Page)=>{
    const paths:Partial<Record<Page,string>>={dashboard:'/app',start:'/app/interviews/new',device:'/app/interviews/demo/device-check',room:'/app/interviews/demo/room',processing:'/app/interviews/demo/processing',report:'/app/results/1042'}
    navigate(paths[page]||'/app')
  }
  if(screen==='device') return <DeviceCheckPage go={go}/>
  if(screen==='room') return <InterviewRoom go={go}/>
  return <ProcessingPage go={go}/>
}

function LoginRoute(){
  const navigate=useNavigate(),{loginAs}=useAuth()
  return <Login onLogin={()=>{loginAs('ADMIN');navigate('/admin/dashboard')}} onCandidate={()=>{loginAs('CANDIDATE');navigate('/app')}}/>
}

function RootRedirect(){const {user}=useAuth();return <Navigate to={user?HOME_BY_ROLE[user.role]:'/login'} replace/>}

const admin=(node:React.ReactNode)=><RoleGuard roles={['ADMIN','RECRUITER']}>{node}</RoleGuard>
const adminOnly=(node:React.ReactNode)=><RoleGuard roles={['ADMIN']}>{node}</RoleGuard>
const candidate=(node:React.ReactNode)=><RoleGuard roles={['CANDIDATE']}>{node}</RoleGuard>

function AppRoutes(){return <Routes>
  <Route path="/" element={<RootRedirect/>}/>
  <Route path="/login" element={<LoginRoute/>}/>
  <Route path="/admin/dashboard" element={admin(<AdminScreen component={Dashboard}/>)}/>
  <Route path="/admin/interviews" element={admin(<AdminScreen component={InterviewsPage}/>)}/>
  <Route path="/admin/interviews/new" element={admin(<AdminScreen component={StartInterview}/>)}/>
  <Route path="/admin/interviews/:id/analysis" element={admin(<AdminScreen component={AnalysisPage}/>)}/>
  <Route path="/admin/interviews/:id/device-check" element={admin(<AdminScreen component={DeviceCheckPage}/>)}/>
  <Route path="/admin/interviews/:id/room" element={admin(<AdminScreen component={InterviewRoom}/>)}/>
  <Route path="/admin/interviews/:id/processing" element={admin(<AdminScreen component={ProcessingPage}/>)}/>
  <Route path="/admin/candidates" element={admin(<AdminScreen component={CandidatesPage}/>)}/>
  <Route path="/admin/jobs" element={admin(<AdminScreen component={JobsPage}/>)}/>
  <Route path="/admin/reports" element={admin(<AdminScreen component={ReportsPage}/>)}/>
  <Route path="/admin/reports/:id" element={admin(<AdminScreen component={ReportPage}/>)}/>
  <Route path="/admin/settings" element={adminOnly(<AdminScreen component={SettingsPage}/>)}/>

  <Route path="/app" element={candidate(<CandidateHome/>)}/>
  <Route path="/app/jobs" element={candidate(<CandidateJobs/>)}/>
  <Route path="/app/interviews/new" element={candidate(<CandidateCreateInterview/>)}/>
  <Route path="/app/interviews/:id/device-check" element={candidate(<CandidateFlow screen="device"/>)}/>
  <Route path="/app/interviews/:id/room" element={candidate(<CandidateFlow screen="room"/>)}/>
  <Route path="/app/interviews/:id/processing" element={candidate(<CandidateFlow screen="processing"/>)}/>
  <Route path="/app/results" element={candidate(<CandidateResults/>)}/>
  <Route path="/app/results/:id" element={candidate(<CandidateResultDetail/>)}/>
  <Route path="/app/profile" element={candidate(<CandidateProfile/>)}/>
  <Route path="*" element={<RootRedirect/>}/>
</Routes>}

export default function AppRouter(){return <BrowserRouter><AuthProvider><AppRoutes/></AuthProvider></BrowserRouter>}
