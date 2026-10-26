import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BarChart3, Bell, BriefcaseBusiness, Check, ChevronDown, CircleHelp, FileText, Home, LogOut, Menu, Search, Settings, Sparkles, UploadCloud, UserRound, Users, X } from 'lucide-react'
import { AnalysisPage, CandidatesPage, DeviceCheckPage, InterviewRoom, InterviewsPage, JobsPage, ProcessingPage, ReportPage, ReportsPage, SettingsPage } from './Pages'

export type Page = 'login' | 'dashboard' | 'start' | 'interviews' | 'candidates' | 'jobs' | 'reports' | 'settings' | 'analysis' | 'device' | 'room' | 'processing' | 'report'
type Job = { id: number; title: string; department: string; type: string; location: string; accent: string; skills: string[] }

const jobs: Job[] = [
  { id: 1, title: 'Senior Frontend Developer', department: 'Product & Engineering', type: 'Toàn thời gian', location: 'Hà Nội · Hybrid', accent: '#5b5bd6', skills: ['React', 'TypeScript', 'System Design'] },
  { id: 2, title: 'Backend Developer', department: 'Engineering', type: 'Toàn thời gian', location: 'TP. Hồ Chí Minh', accent: '#12805c', skills: ['Node.js', 'PostgreSQL', 'REST API'] },
  { id: 3, title: 'Product Designer', department: 'Product & Design', type: 'Toàn thời gian', location: 'Remote', accent: '#d97745', skills: ['Figma', 'UX Research', 'Design System'] },
]

function Logo({ light = false }: { light?: boolean }) {
  return <div className={`logo ${light ? 'light' : ''}`}><span className="logo-mark"><Sparkles size={17}/></span><span>Interviewly</span></div>
}

export function Login({ onLogin, onCandidate }: { onLogin: () => void; onCandidate?: () => void }) {
  const [showPass, setShowPass] = useState(false)
  const [busy, setBusy] = useState(false)
  const [email,setEmail]=useState('admin')
  const [password,setPassword]=useState('123456')
  const [error,setError]=useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault();setError('')
    const isAdmin=email.trim().toLowerCase()==='admin'&&password==='123456'
    const isCandidate=email.trim().toLowerCase()==='user'&&password==='123456'
    if(!isAdmin&&!isCandidate){setError('Email hoặc mật khẩu không đúng. Vui lòng dùng tài khoản mẫu bên dưới.');return}
    setBusy(true);setTimeout(()=>isCandidate&&onCandidate?onCandidate():onLogin(),500)
  }
  return <main className="login-page">
    <section className="login-panel">
      <div className="login-top"><Logo /></div>
      <div className="login-box">
        <div className="eyebrow">CHÀO MỪNG TRỞ LẠI</div>
        <h1>Đăng nhập vào<br/>không gian tuyển dụng.</h1>
        <p className="lead">Tiếp tục hành trình tìm kiếm những ứng viên phù hợp nhất cùng trợ lý AI của bạn.</p>
        <button className="google-btn" onClick={onLogin}><span className="google-g">G</span> Tiếp tục với Google</button>
        <div className="divider"><span>hoặc đăng nhập bằng email</span></div>
        <form onSubmit={submit}>
          <label>Tên đăng nhập</label>
          <input type="text" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Nhập tên đăng nhập" required />
          <div className="password-label"><label>Mật khẩu</label><a href="#">Quên mật khẩu?</a></div>
          <div className="pass-wrap"><input type={showPass ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? 'Ẩn' : 'Hiện'}</button></div>
          {error&&<div className="login-error">{error}</div>}
          <label className="remember"><input type="checkbox" defaultChecked/> <span>Ghi nhớ đăng nhập</span></label>
          <button className="primary full" disabled={busy}>{busy ? 'Đang đăng nhập…' : <>Đăng nhập <ArrowRight size={17}/></>}</button>
        </form>
        <div className="demo-accounts"><p>TÀI KHOẢN DÙNG THỬ</p><button type="button" onClick={()=>{setEmail('admin');setPassword('123456');setError('')}}><span className="demo-admin">AD</span><span><b>Quản trị viên</b><small>admin · 123456</small></span><ArrowRight/></button><button type="button" onClick={()=>{setEmail('user');setPassword('123456');setError('')}}><span className="demo-candidate">UV</span><span><b>Ứng viên</b><small>user · 123456</small></span><ArrowRight/></button></div>
        <p className="signup">Chưa có tài khoản? <a href="#">Đăng ký miễn phí</a></p>
      </div>
      <p className="copyright">© 2026 Interviewly · <a href="#">Quyền riêng tư</a> · <a href="#">Điều khoản</a></p>
    </section>
    <aside className="login-aside">
      <div className="orb orb-one"></div><div className="orb orb-two"></div>
      <div className="quote-badge"><span></span> AI INTERVIEW PLATFORM</div>
      <blockquote>“Tuyển đúng người không nên là một trò may rủi.”</blockquote>
      <p>Interviewly giúp đội ngũ của bạn đánh giá ứng viên nhất quán, khách quan và sâu sắc hơn.</p>
      <div className="mini-report">
        <div className="mini-head"><div className="avatar">NA</div><div><b>Nguyễn Minh Anh</b><small>Frontend Developer</small></div><span className="score">86</span></div>
        <div className="bars"><span style={{width:'86%'}}></span><span style={{width:'74%'}}></span><span style={{width:'91%'}}></span></div>
        <div className="mini-foot"><span><Check size={13}/> Phân tích hoàn tất</span><small>Vừa xong</small></div>
      </div>
      <div className="trusted"><span>Được tin dùng bởi đội ngũ tuyển dụng hiện đại</span><div>northstar &nbsp;&nbsp; ACME® &nbsp;&nbsp; VERTEX</div></div>
    </aside>
  </main>
}

function Sidebar({ page, go }: { page: Page; go: (p: Page) => void }) {
  const [open, setOpen] = useState(false)
  return <><button className="mobile-menu" onClick={() => setOpen(true)}><Menu/></button>{open && <div className="scrim" onClick={() => setOpen(false)}/>}<aside className={`sidebar ${open ? 'open' : ''}`}>
    <div className="side-logo"><Logo/><button onClick={() => setOpen(false)}><X/></button></div>
    <nav>
      <small>KHÔNG GIAN LÀM VIỆC</small>
      <button className={page === 'dashboard' ? 'active':''} onClick={() => {go('dashboard');setOpen(false)}}><Home/> Tổng quan</button>
      <button className={['start','interviews','analysis','device','room','processing'].includes(page) ? 'active':''} onClick={() => {go('interviews');setOpen(false)}}><Sparkles/> Phỏng vấn <span>12</span></button>
      <button className={page === 'candidates' ? 'active':''} onClick={() => {go('candidates');setOpen(false)}}><Users/> Ứng viên</button><button className={page === 'jobs' ? 'active':''} onClick={() => {go('jobs');setOpen(false)}}><BriefcaseBusiness/> Công việc</button><button className={['reports','report'].includes(page) ? 'active':''} onClick={() => {go('reports');setOpen(false)}}><BarChart3/> Báo cáo</button>
      <small>QUẢN LÝ</small><button className={page === 'settings' ? 'active':''} onClick={() => {go('settings');setOpen(false)}}><Settings/> Cài đặt</button><button><CircleHelp/> Trung tâm hỗ trợ</button>
    </nav>
    <div className="upgrade"><div className="spark"><Sparkles size={18}/></div><b>Mở khóa sức mạnh AI</b><p>Nâng cấp để phỏng vấn không giới hạn.</p><button>Tìm hiểu thêm</button></div>
    <div className="profile"><div className="avatar">HN</div><div><b>Hoàng Nam</b><small>Talent Lead</small></div><button><ChevronDown/></button></div>
  </aside></>
}

export function Dashboard({ go }: { go: (p: Page) => void }) {
  return <AppShell page="dashboard" go={go}>
    <header className="topbar"><div><p>THỨ BA, 29 THÁNG 9</p><h1>Chào buổi sáng, Nam <span>👋</span></h1></div><div className="top-actions"><button className="icon-btn"><Bell/></button><button className="primary" onClick={() => go('start')}><Sparkles size={17}/> Tạo phỏng vấn mới</button></div></header>
    <section className="hero-card"><div><span className="pill"><Sparkles size={13}/> AI INTERVIEW</span><h2>Tìm đúng người,<br/><em>nhanh hơn.</em></h2><p>Tải CV lên, chọn vị trí tuyển dụng và để AI giúp bạn chuẩn bị một buổi phỏng vấn chuyên sâu.</p><button onClick={() => go('start')}>Bắt đầu phỏng vấn <ArrowRight size={17}/></button></div><div className="hero-visual"><div className="ring r1"></div><div className="ring r2"></div><div className="candidate-card c1"><div className="avatar purple">LT</div><span><b>Linh Trần</b><small>Khớp 92%</small></span></div><div className="candidate-card c2"><div className="avatar green">KM</div><span><b>Khoa Mai</b><small>Khớp 87%</small></span></div><div className="ai-core"><Sparkles/><small>AI</small></div></div></section>
    <div className="section-title"><div><h3>Tổng quan tuyển dụng</h3><p>Cập nhật hiệu suất trong 30 ngày gần nhất</p></div><button className="filter">30 ngày qua <ChevronDown size={15}/></button></div>
    <section className="stats"><div><span className="stat-icon lilac"><Users/></span><p>TỔNG ỨNG VIÊN</p><h3>128</h3><small className="up">↗ 12.5%</small></div><div><span className="stat-icon mint"><Sparkles/></span><p>ĐÃ PHỎNG VẤN</p><h3>42</h3><small className="up">↗ 8.2%</small></div><div><span className="stat-icon amber"><BriefcaseBusiness/></span><p>VỊ TRÍ ĐANG MỞ</p><h3>08</h3><small>2 sắp đóng</small></div><div><span className="stat-icon blue"><BarChart3/></span><p>ĐIỂM AI TRUNG BÌNH</p><h3>78.4</h3><small className="up">↗ 3.1%</small></div></section>
    <section className="recent"><div className="section-title"><div><h3>Phỏng vấn gần đây</h3><p>Những ứng viên mới nhất được đánh giá</p></div><button className="text-btn">Xem tất cả <ArrowRight size={15}/></button></div><div className="table-wrap"><table><thead><tr><th>ỨNG VIÊN</th><th>VỊ TRÍ</th><th>NGÀY PHỎNG VẤN</th><th>TRẠNG THÁI</th><th>ĐIỂM AI</th><th></th></tr></thead><tbody>{[['Nguyễn Minh Anh','Frontend Developer','28/09/2026','Hoàn thành','86'],['Trần Gia Bảo','Backend Developer','27/09/2026','Hoàn thành','79'],['Lê Thu Hà','Product Designer','27/09/2026','Đang xử lý','—']].map((r,i)=><tr key={i}><td><span className={`avatar a${i}`}>{r[0].split(' ').slice(-2).map(x=>x[0]).join('')}</span><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td><span className={`status ${i===2?'processing':''}`}><i></i>{r[3]}</span></td><td><b>{r[4]}</b></td><td>•••</td></tr>)}</tbody></table></div></section>
  </AppShell>
}

export function StartInterview({ go }: { go: (p: Page) => void }) {
  const [file, setFile] = useState<File | null>(null), [selected, setSelected] = useState<number|null>(null), [query,setQuery]=useState(''), [drag,setDrag]=useState(false), [started,setStarted]=useState(false)
  const input = useRef<HTMLInputElement>(null)
  const filtered = jobs.filter(j => j.title.toLowerCase().includes(query.toLowerCase()))
  const drop = (e: React.DragEvent) => {e.preventDefault();setDrag(false);if(e.dataTransfer.files[0])setFile(e.dataTransfer.files[0])}
  if(started) return <AppShell page="start" go={go}><div className="success-page"><div className="success-mark"><Check/></div><span className="pill"><Sparkles size={13}/> ĐÃ TIẾP NHẬN</span><h1>Thông tin đã sẵn sàng!</h1><p>AI đã nhận CV và yêu cầu cho vị trí <b>{jobs.find(j=>j.id===selected)?.title}</b>.</p><div className="progress-box"><div><span>Hồ sơ ứng viên</span><b>Hoàn tất</b></div><div className="progress"><i></i></div><div><span>Bước tiếp theo</span><b className="working">Phân tích với AI</b></div></div><button className="primary full" onClick={()=>go('analysis')}>Bắt đầu phân tích <ArrowRight size={17}/></button><button className="secondary success-back" onClick={()=>setStarted(false)}>Quay lại chỉnh sửa</button></div></AppShell>
  return <AppShell page="start" go={go}>
    <header className="simple-header"><div><button className="back" onClick={()=>go('dashboard')}>←</button><div><p>TẠO PHỎNG VẤN MỚI</p><h1>Chuẩn bị buổi phỏng vấn</h1></div></div><button className="icon-btn"><Bell/></button></header>
    <div className="stepper"><div className="done"><i><Check/></i><span><b>Hồ sơ ứng viên</b><small>Tải lên CV</small></span></div><em></em><div className={file?'current':''}><i>2</i><span><b>Chọn công việc</b><small>Vị trí ứng tuyển</small></span></div><em></em><div className={selected?'current':''}><i>3</i><span><b>Xác nhận</b><small>Sẵn sàng bắt đầu</small></span></div></div>
    <div className="create-grid"><div className="create-main">
      <section className="form-card"><div className="card-heading"><span className="number">01</span><div><h2>Hồ sơ ứng viên</h2><p>Tải CV để AI phân tích kinh nghiệm và kỹ năng.</p></div>{file&&<span className="complete"><Check/> Hoàn tất</span>}</div>
        {!file ? <div className={`dropzone ${drag?'drag':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={drop} onClick={()=>input.current?.click()}><input ref={input} type="file" accept=".pdf,.doc,.docx" onChange={e=>setFile(e.target.files?.[0]||null)}/><span><UploadCloud/></span><h3>Kéo & thả CV vào đây</h3><p>hoặc <b>chọn tệp từ máy tính</b></p><small>Hỗ trợ PDF, DOCX · Tối đa 10MB</small></div> : <div className="file-item"><span className="pdf"><FileText/></span><div><b>{file.name}</b><small>{(file.size/1024/1024).toFixed(1)} MB · Sẵn sàng phân tích</small></div><span className="file-ok"><Check/></span><button onClick={()=>setFile(null)}><X/></button></div>}
      </section>
      <section className={`form-card ${!file?'muted-card':''}`}><div className="card-heading"><span className="number">02</span><div><h2>Chọn vị trí tuyển dụng</h2><p>AI sẽ dựa trên yêu cầu công việc để tạo câu hỏi.</p></div></div>
        <div className="job-search"><Search/><input placeholder="Tìm kiếm theo tên vị trí..." value={query} onChange={e=>setQuery(e.target.value)} disabled={!file}/></div>
        <div className="job-list">{filtered.map(job=><button key={job.id} disabled={!file} className={`job-option ${selected===job.id?'selected':''}`} onClick={()=>setSelected(job.id)}><span className="job-icon" style={{background:job.accent}}>{job.title.split(' ').slice(0,2).map(x=>x[0]).join('')}</span><span className="job-info"><b>{job.title}</b><small>{job.department} · {job.location}</small><span>{job.skills.map(s=><i key={s}>{s}</i>)}</span></span><i className="radio">{selected===job.id&&<span/>}</i></button>)}</div>
      </section>
    </div><aside className="summary-card"><span className="pill"><Sparkles size={13}/> TÓM TẮT</span><h3>Buổi phỏng vấn của bạn</h3><div className="summary-row"><small>HỒ SƠ</small>{file?<div><span className="pdf tiny"><FileText/></span><p><b>{file.name}</b><small>Đã tải lên</small></p></div>:<p className="empty-value">Chưa có CV</p>}</div><div className="summary-row"><small>VỊ TRÍ</small>{selected?<div><span className="job-icon tiny-job" style={{background:jobs.find(j=>j.id===selected)?.accent}}>{jobs.find(j=>j.id===selected)?.title[0]}</span><p><b>{jobs.find(j=>j.id===selected)?.title}</b><small>{jobs.find(j=>j.id===selected)?.department}</small></p></div>:<p className="empty-value">Chưa chọn công việc</p>}</div><div className="summary-note"><Sparkles/><p><b>AI sẽ chuẩn bị gì?</b><span>Phân tích CV, đối chiếu yêu cầu và tạo 10–12 câu hỏi cá nhân hóa.</span></p></div><button className="primary full" disabled={!file||!selected} onClick={()=>setStarted(true)}>Tiếp tục với AI <ArrowRight/></button><p className="secure">🔒 Dữ liệu được mã hóa và bảo mật</p></aside></div>
  </AppShell>
}

function AppShell({ page, go, children }: {page:Page;go:(p:Page)=>void;children:React.ReactNode}) { return <div className="app"><Sidebar page={page} go={go}/><main className="content">{children}</main></div> }

export default function App(){
  const initial = (localStorage.getItem('iv-page') as Page) || 'login'
  const [page,setPage]=useState<Page>(initial)
  const go=(p:Page)=>{setPage(p);localStorage.setItem('iv-page',p);window.scrollTo(0,0)}
  useEffect(()=>{document.title = page==='login'?'Đăng nhập — Interviewly':page==='dashboard'?'Tổng quan — Interviewly':'Tạo phỏng vấn — Interviewly'},[page])
  if(page==='login') return <Login onLogin={()=>go('dashboard')}/>
  if(page==='start') return <StartInterview go={go}/>
  if(page==='interviews') return <InterviewsPage go={go}/>
  if(page==='candidates') return <CandidatesPage go={go}/>
  if(page==='jobs') return <JobsPage go={go}/>
  if(page==='reports') return <ReportsPage go={go}/>
  if(page==='settings') return <SettingsPage go={go}/>
  if(page==='analysis') return <AnalysisPage go={go}/>
  if(page==='device') return <DeviceCheckPage go={go}/>
  if(page==='room') return <InterviewRoom go={go}/>
  if(page==='processing') return <ProcessingPage go={go}/>
  if(page==='report') return <ReportPage go={go}/>
  return <Dashboard go={go}/>
}
