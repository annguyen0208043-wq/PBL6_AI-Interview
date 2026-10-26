# NextStepAI — Kiến trúc & Quy trình hệ thống

> **Tài liệu này là nguồn tham chiếu xuyên suốt dự án PBL6.**  
> Mọi thành viên cần tuân theo kiến trúc và quy trình được định nghĩa ở đây.

---

## 1. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────┐
│              ReactJS — Frontend                 │
│  Giao diện đăng nhập, form, hiển thị dữ liệu   │
└────────────────────┬────────────────────────────┘
                     │
              HTTPS + JSON
           Bearer Access Token
                     │
┌────────────────────▼────────────────────────────┐
│          FastAPI — Python Backend               │
│  REST API • Xác thực JWT • Kiểm tra quyền      │
│  Nghiệp vụ (câu hỏi, đánh giá, báo cáo...)     │
└──────────┬─────────────────────┬────────────────┘
           │                     │
  Supabase Python SDK       Supabase Python SDK
           │                     │
┌──────────▼──────┐   ┌──────────▼──────────────┐
│   PostgreSQL    │   │      Supabase Auth       │
│  Users, Jobs,   │   │  Đăng ký, đăng nhập,    │
│  Interviews,    │   │  JWT, refresh token      │
│  Reports...     │   └─────────────────────────┘
└─────────────────┘
```

**Nguyên tắc cốt lõi:**
- Frontend chỉ giao tiếp với Backend qua REST API (HTTPS + JSON)
- Backend là người duy nhất được phép nói chuyện với Supabase
- Mọi xác thực và kiểm tra quyền đều thực hiện tại Backend
- Frontend không tự quyết định role hay permission

---

## 2. Luồng xử lý đăng nhập

```
ReactJS                    FastAPI                  Supabase Auth
   │                          │                          │
   │── POST /auth/login ──────▶│                          │
   │   {email, password}       │── sign_in_with_password ─▶│
   │                          │                          │
   │                          │◀── access_token ─────────│
   │                          │    refresh_token          │
   │◀── {access_token} ───────│                          │
   │    {refresh_token}        │                          │
   │                          │                          │
   │   [Lưu token vào memory] │                          │
   │                          │                          │
   │── GET /interviews ────────▶│                          │
   │   Authorization: Bearer   │── verify JWT ────────────▶│
   │   <access_token>          │                          │
   │                          │◀── user_id, role ─────────│
   │                          │                          │
   │                          │   [Truy vấn DB theo role] │
   │◀── {data} ───────────────│                          │
```

**Các bước chi tiết:**
1. ReactJS gửi `email` và `password` đến FastAPI
2. FastAPI gọi **Supabase Auth** (`sign_in_with_password`)
3. Supabase xác minh thông tin, trả về `access_token` + `refresh_token`
4. FastAPI trả token về frontend
5. Khi cần truy cập tài nguyên, ReactJS gửi token trong header `Authorization: Bearer <token>`
6. FastAPI xác minh token, lấy `user_id` và `role`, thực hiện truy vấn được phép

---

## 3. Luồng phỏng vấn đầy đủ

```
[1] Upload CV + chọn JD
        │
        ▼
[2] FastAPI → LLM sinh bộ câu hỏi cá nhân hóa
        │
        ▼
[3] Kiểm tra thiết bị (camera, mic, kết nối)
        │
        ▼
[4] Phòng phỏng vấn ảo
    ├── AI đặt câu hỏi (TTS)
    ├── Ứng viên trả lời (video + mic)
    └── Background processing:
        ├── STT: giọng nói → văn bản
        ├── Audio: trích xuất đặc trưng (tốc độ, ngập ngừng)
        └── Vision: eye-tracking, phát hiện rời màn hình
        │
        ▼
[5] AI đánh giá từng câu → sinh câu hỏi tiếp theo (adaptive)
        │
        ▼
[6] Tổng hợp kết quả
        │
        ▼
[7] Báo cáo: điểm chuyên môn, độ tự tin, cảnh báo, nhận xét AI
```

---

## 4. Roles & Quyền truy cập

| Role | Mô tả | Quyền |
|---|---|---|
| **Admin** | Quản trị hệ thống | Tất cả quyền |
| **Recruiter** | Nhà tuyển dụng | Xem dữ liệu trong tổ chức của mình |
| **Candidate** | Ứng viên | Chỉ xem dữ liệu của chính mình |

### Routes theo Role

**Public:**
```
/login
```

**Admin / Recruiter:**
```
/admin/dashboard
/admin/interviews
/admin/interviews/new
/admin/interviews/:id/analysis
/admin/interviews/:id/device-check
/admin/interviews/:id/room
/admin/interviews/:id/processing
/admin/candidates
/admin/jobs
/admin/reports
/admin/reports/:id
/admin/settings
```

**Candidate:**
```
/app
/app/jobs
/app/interviews/new
/app/interviews/:id/device-check
/app/interviews/:id/room
/app/interviews/:id/processing
/app/results
/app/results/:id
/app/profile
```

---

## 5. Database Schema (Supabase / PostgreSQL)

```sql
-- Người dùng (mở rộng từ Supabase Auth)
profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users,
  role        text CHECK (role IN ('admin', 'recruiter', 'candidate')),
  full_name   text,
  email       text,
  phone       text,
  created_at  timestamptz DEFAULT now()
)

-- Vị trí tuyển dụng
jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text,
  description   text,
  requirements  text,
  created_by    uuid REFERENCES profiles(id),
  created_at    timestamptz DEFAULT now()
)

-- Ứng viên
candidates (
  id          uuid PRIMARY KEY REFERENCES profiles(id),
  cv_url      text,   -- Supabase Storage signed URL
  skills      text[],
  applied_at  timestamptz DEFAULT now()
)

-- Phiên phỏng vấn
interviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id    uuid REFERENCES profiles(id),
  job_id          uuid REFERENCES jobs(id),
  status          text CHECK (status IN ('pending','in_progress','completed','failed')),
  questions       jsonb,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz DEFAULT now()
)

-- Báo cáo kết quả
reports (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id        uuid REFERENCES interviews(id),
  overall_score       float,
  competency_scores   jsonb,
  audio_analysis      jsonb,
  video_analysis      jsonb,
  ai_feedback         text,
  created_at          timestamptz DEFAULT now()
)
```

---

## 6. Supabase Storage — Cấu trúc bucket

```
[Private Bucket: interview-assets]
├── cvs/
│   └── {user_id}/{filename}.pdf
├── audio/
│   └── {interview_id}/{question_index}.webm
└── video/
    └── {interview_id}/recording.webm
```

**Quy tắc:**
- Tất cả file đều trong **private bucket** (không public)
- Frontend tải file qua **signed URL** có thời hạn (do backend cấp)
- Backend dùng **service role key** để tạo signed URL

---

## 7. API Endpoints (Backend)

### Auth
```
POST   /auth/login          # Đăng nhập → trả access_token
POST   /auth/logout         # Đăng xuất
POST   /auth/refresh        # Làm mới token
GET    /auth/me             # Thông tin user hiện tại
```

### Jobs
```
GET    /jobs                # Danh sách vị trí (candidate: public)
GET    /jobs/:id            # Chi tiết vị trí
POST   /jobs                # Tạo vị trí [Admin/Recruiter]
PUT    /jobs/:id            # Cập nhật [Admin/Recruiter]
DELETE /jobs/:id            # Xóa [Admin]
```

### Interviews
```
POST   /interviews                       # Tạo phiên phỏng vấn mới
GET    /interviews/:id                   # Chi tiết phiên
GET    /interviews                       # Danh sách (lọc theo role)
POST   /interviews/:id/start             # Bắt đầu phỏng vấn
POST   /interviews/:id/answer            # Gửi câu trả lời
POST   /interviews/:id/complete          # Kết thúc phiên
GET    /interviews/:id/questions         # Lấy danh sách câu hỏi
```

### Reports
```
GET    /reports/:interview_id            # Xem báo cáo
GET    /reports                          # Danh sách báo cáo
POST   /reports/:interview_id/generate   # Tạo báo cáo [AI]
```

### Upload
```
POST   /upload/cv                        # Upload CV → trả storage path
GET    /upload/signed-url?path=...       # Lấy signed URL để tải file
```

---

## 8. Quy tắc bảo mật Backend

```
✅ PHẢI LÀM:
  - Xác định role từ JWT access token (không tin dữ liệu frontend)
  - Kiểm tra ownership: candidate chỉ xem interview của chính mình
  - Recruiter chỉ xem dữ liệu trong tổ chức của mình
  - Dùng service role key chỉ trong backend (không bao giờ expose ra frontend)
  - Tất cả file (CV, audio, video) lưu private bucket
  - Cấp signed URL có thời hạn ngắn (15-60 phút)

❌ KHÔNG ĐƯỢC:
  - Tin vào role/user_id do frontend tự gửi
  - Để public bất kỳ bucket nào chứa file người dùng
  - Trả về service role key cho frontend
  - Cho candidate truy cập interview của người khác
```

---

## 9. Tech Stack

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | React 18, TypeScript, Vite | React Router v7 |
| Styling | CSS thuần | DM Sans + Manrope fonts |
| Backend | Python 3.11+, FastAPI | Uvicorn server |
| Database | PostgreSQL (qua Supabase) | |
| Auth | Supabase Auth | JWT HS256 |
| Storage | Supabase Storage | Private bucket |
| AI/LLM | TBD | Sinh câu hỏi, đánh giá |
| STT | TBD | Speech-to-Text |
| Vision | TBD | Eye-tracking, face detection |

---

## 10. Phân công nhóm

| Thành viên | MSSV | Module |
|---|---|---|
| Nguyễn Văn An | 102230001 | STT + phân tích âm thanh |
| Mai Phúc Thịnh | 102230049 | Eye-tracking + phát hiện rời màn hình |
| Nguyễn Đình Duy | 102230067 | AI tạo câu hỏi từ CV/JD + adaptive questioning |

---

## 11. Trạng thái dự án

### ✅ Đã hoàn thành
- Toàn bộ UI/UX Frontend
- Design system, responsive, role guard
- Luồng phỏng vấn (UI mock)
- Báo cáo (UI mock)
- Cấu trúc thư mục dự án (frontend/ + backend/ + docs/)
- Skeleton backend FastAPI + Supabase client

### 🔄 Đang làm
- Kết nối API xác thực (auth endpoints)
- Database schema trên Supabase

### 🔴 Chưa làm
- API endpoints đầy đủ
- Upload CV thật
- Camera + mic + ghi hình thật
- Speech-to-text
- AI evaluation
- Eye-tracking module
- Xuất báo cáo PDF
