# PBL6 - AI Interview Platform

Dự án gồm 2 phần chính: **Frontend** (React + Vite) và **Backend** (Python + FastAPI).

## Cấu trúc dự án

```
PBL6/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Python + FastAPI
└── docs/              # Tài liệu chung của dự án
```

---

## 🚀 Chạy dự án

### Frontend

```bash
cd frontend
npm install
npm run dev
# Truy cập: http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
# Truy cập: http://localhost:8000
# API docs: http://localhost:8000/docs
```

## Demo Speech-to-Text

Xem hướng dẫn đầy đủ cho máy mới tại
[docs/STT_LOCAL_SETUP.md](docs/STT_LOCAL_SETUP.md).

Luồng demo đã kết nối giao diện phòng phỏng vấn với Faster-Whisper:

1. Đăng nhập bằng tài khoản demo và mở phòng phỏng vấn.
2. Nhấn **Bắt đầu trả lời**, nói vào microphone rồi nhấn **Kết thúc câu trả lời**.
3. Frontend upload audio, trang Processing theo dõi STT job và tự mở kết quả khi hoàn tất.
4. Tab **Đánh giá câu hỏi** hiển thị raw transcript, corrected transcript và edit log thuật ngữ.

Chạy backend bằng môi trường riêng:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Chạy frontend ở terminal khác:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Backend mặc định dùng model `turbo`, CPU INT8 và datastore nhỏ tại
`backend/data/verified_aliases.jsonl`. Có thể đổi `STT_MODEL=small` để smoke test
nhanh hơn. Khi bổ sung datastore đầy đủ, đặt `STT_DATASTORE_PATH` trỏ tới file
JSONL. API chấp nhận cả schema alias (`aliases`) và schema datastore mở rộng
(`observed_asr_variants`). Model có thể cần tải ở lần chạy đầu tiên.

Các endpoint demo:

```text
POST /api/v1/stt/jobs
GET  /api/v1/stt/jobs/{job_id}
GET  /api/v1/stt/config
```

---

## 📁 Chi tiết cấu trúc

### Frontend (`/frontend`)
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v7
- **Styling**: CSS thuần

### Backend (`/backend`)
- **Framework**: Python + FastAPI
- **Entry point**: `app/main.py`
- **Cấu trúc**:
  - `app/api/` - Router và endpoints
  - `app/models/` - Database models
  - `app/services/` - Business logic
  - `app/core/` - Config, security, utils

### Docs (`/docs`)
- Tài liệu thiết kế UI/UX
- API documentation
- Kiến trúc hệ thống
