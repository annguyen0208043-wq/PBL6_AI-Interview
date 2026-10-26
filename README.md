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
