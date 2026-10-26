# NextStepAI — Tổng quan dự án PBL6

## 1. Mô tả hệ thống

Hệ thống phỏng vấn ứng viên IT sử dụng AI, trong đó AI đóng vai người phỏng vấn:
- Đặt câu hỏi tự động từ CV + JD
- Phân tích giọng nói (STT + audio features)
- Phân tích video (eye-tracking, phát hiện rời màn hình)
- Đánh giá và xuất báo cáo năng lực

---

## 2. Thành viên & phân công

| Thành viên | MSSV | Module chính |
|---|---|---|
| Nguyễn Văn An | 102230001 | STT + phân tích âm thanh |
| Mai Phúc Thịnh | 102230049 | Eye-tracking + phát hiện rời màn hình (video) |
| Nguyễn Đình Duy | 102230067 | AI tạo câu hỏi từ CV/JD + câu hỏi tiếp theo |

---

## 3. Luồng hoạt động chính

`
CV + JD → AI sinh câu hỏi → Ứng viên trả lời (video + mic)
  → STT chuyển giọng nói → AI đánh giá câu trả lời
  → Câu hỏi tiếp theo (adaptive) → Tổng hợp → Báo cáo
`

### Các bước chi tiết:
1. **Input**: Upload CV (PDF/Word) + chọn JD
2. **AI phân tích**: LLM tạo bộ câu hỏi cá nhân hóa
3. **Phòng phỏng vấn**: Video + mic, AI hỏi qua TTS
4. **Xử lý nền**: STT + audio analysis + computer vision
5. **Đánh giá**: AI chấm điểm từng câu
6. **Báo cáo**: Điểm chuyên môn, độ tự tin, cảnh báo gian lận

---

## 4. Kiến trúc hệ thống

### Roles & Routes

| Role | Routes |
|---|---|
| Public | /login |
| Admin/Recruiter | /admin/dashboard, /admin/interviews, /admin/candidates, /admin/jobs, /admin/reports, /admin/settings |
| Candidate | /app, /app/jobs, /app/interviews/new, /app/results, /app/profile |

---

## 5. Tính năng theo trạng thái

### Frontend đã hoàn thành
- Design system + responsive layout
- Giao diện login (2 tài khoản mẫu: admin / candidate)
- Phân tách Admin vs Candidate workspace
- Role guard + route theo vai trò
- Quản lý ứng viên, phỏng vấn
- Luồng tạo + thực hiện phỏng vấn (UI)
- Báo cáo dùng chung
- States: loading, processing, empty, permission

### Chưa kết nối backend
- API xác thực + refresh token
- Database: users, jobs, candidates
- Upload CV thật
- Camera + mic + ghi hình thật
- Speech-to-text + AI evaluation
- Lưu báo cáo + xuất PDF
- Quản lý công việc (backend)

---

## 6. Yêu cầu bảo mật backend

- Backend xác định role từ access token (không tin frontend)
- Candidate chỉ truy cập dữ liệu có candidate_id trùng tài khoản
- Recruiter chỉ xem dữ liệu thuộc tổ chức mình
- Admin mới được thay đổi thiết lập hệ thống
- CV, audio, video lưu trong private storage
- Tải file qua signed URL có thời hạn
- API kiểm tra ownership cho interview, transcript, report

---

## 7. Tech Stack tổng thể

| Layer | Công nghệ |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router v7 |
| Styling | CSS thuần, DM Sans + Manrope fonts |
| Backend | Python, FastAPI |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (private bucket) |
| Auth | Supabase Auth + JWT |
| AI/LLM | LLM (câu hỏi, đánh giá) |
| STT | Speech-to-Text API |
| Vision | Computer Vision (eye-tracking) |
