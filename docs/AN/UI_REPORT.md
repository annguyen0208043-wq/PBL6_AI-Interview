# BÁO CÁO THIẾT KẾ GIAO DIỆN

## Hệ thống phỏng vấn và đánh giá ứng viên bằng AI

---

## 1. Tổng quan

Hệ thống được thiết kế để hỗ trợ doanh nghiệp tổ chức phỏng vấn, quản lý ứng viên và đánh giá năng lực bằng AI. Giao diện được chia thành hai khu vực độc lập dành cho quản trị viên và ứng viên.

- **Admin/Recruiter:** quản lý công việc, ứng viên, phiên phỏng vấn và báo cáo toàn hệ thống.
- **Candidate:** xem công việc, tạo và thực hiện phỏng vấn, theo dõi kết quả cá nhân.

Giao diện hiện tại là frontend prototype sử dụng dữ liệu mẫu. Cấu trúc route và phân quyền đã được chuẩn bị để kết nối backend trong giai đoạn tiếp theo.

---

## 2. Mục tiêu thiết kế

- Tạo cảm giác của một sản phẩm SaaS tuyển dụng chuyên nghiệp.
- Giảm số lượng màu sắc, icon và thành phần không cần thiết.
- Sử dụng khoảng trắng để phân tách nội dung rõ ràng.
- Duy trì kích thước sidebar, font chữ và khoảng cách đồng nhất giữa các trang.
- Tách rõ không gian làm việc của quản trị viên và ứng viên.
- Giúp người dùng hoàn thành quy trình phỏng vấn với ít thao tác nhất.
- Trình bày dữ liệu AI dưới dạng hỗ trợ đánh giá, không đưa ra kết luận thiếu căn cứ.

---

## 3. Công nghệ giao diện

| Thành phần | Công nghệ |
| --- | --- |
| UI Framework | React |
| Ngôn ngữ | TypeScript |
| Build Tool | Vite |
| Điều hướng | React Router |
| Icon | Lucide React |
| Styling | CSS thuần, responsive |
| Font chữ | DM Sans và Manrope |

---

## 4. Design system

### 4.1. Màu sắc

| Mục đích | Màu sắc |
| --- | --- |
| Nền chính | `#FFFFFF` |
| Nền phụ | `#F6F7F5` |
| Chữ chính | `#17201C` |
| Chữ phụ | `#7F8983` |
| Màu thương hiệu | `#1B2A23` |
| Màu xanh trạng thái | `#3F8056` |
| Màu cảnh báo | `#D19F46` |
| Màu lỗi | `#B85055` |
| Đường viền | `#E1E5E2` |

### 4.2. Typography

- **Manrope:** tiêu đề, số liệu và nội dung cần nhấn mạnh.
- **DM Sans:** nội dung, biểu mẫu, bảng và điều hướng.
- Tiêu đề trang: khoảng `27–29px`.
- Tiêu đề card: khoảng `15–20px`.
- Nội dung chính: khoảng `12–13px`.
- Chú thích: khoảng `10–11px`.

### 4.3. Thành phần dùng chung

- Sidebar cố định rộng `244px` trên desktop.
- Button chính sử dụng nền xanh đen và chữ trắng.
- Card có nền trắng, đường viền nhẹ và bo góc từ `10–15px`.
- Badge được sử dụng cho trạng thái, kỹ năng và loại câu hỏi.
- Progress bar được sử dụng trong quá trình phân tích và xử lý AI.
- Empty state được sử dụng khi màn hình chưa có dữ liệu.

---

## 5. Phân quyền giao diện

### 5.1. Quản trị viên

Quản trị viên được truy cập toàn bộ chức năng quản lý của hệ thống.

- Tổng quan tuyển dụng.
- Danh sách ứng viên.
- Danh sách và trạng thái phỏng vấn.
- Quản lý công việc.
- Báo cáo của tất cả ứng viên.
- Cài đặt hệ thống.

### 5.2. Recruiter

Recruiter được sử dụng các chức năng phục vụ tuyển dụng nhưng không được thay đổi cài đặt hệ thống.

- Quản lý ứng viên.
- Quản lý công việc.
- Quản lý phiên phỏng vấn.
- Xem báo cáo trong tổ chức.

### 5.3. Ứng viên

Ứng viên chỉ được truy cập dữ liệu thuộc về tài khoản cá nhân.

- Xem các công việc đang tuyển.
- Upload CV và tạo phiên phỏng vấn.
- Kiểm tra thiết bị và thực hiện phỏng vấn.
- Xem danh sách kết quả cá nhân.
- Xem chi tiết báo cáo của chính mình.
- Quản lý hồ sơ cá nhân.

Ứng viên không được truy cập danh sách ứng viên, thống kê doanh nghiệp, báo cáo của người khác hoặc cài đặt quản trị.

---

## 6. Tài khoản demo

### Quản trị viên

```text
Tên đăng nhập: admin
Mật khẩu: 123456
```

### Ứng viên

```text
Tên đăng nhập: user
Mật khẩu: 123456
```

Trang đăng nhập cung cấp nút chọn nhanh tài khoản để tự động điền thông tin.

---

## 7. Giao diện quản trị viên

### 7.1. Đăng nhập

Cho phép đăng nhập bằng tên tài khoản và mật khẩu. Sau khi xác thực, hệ thống xác định vai trò và chuyển người dùng tới đúng không gian làm việc.

### 7.2. Tổng quan

Hiển thị tổng số ứng viên, số phiên đã phỏng vấn, vị trí đang mở và điểm AI trung bình. Phần cuối trang trình bày các phiên phỏng vấn gần đây và trạng thái xử lý.

### 7.3. Danh sách phỏng vấn

Quản lý toàn bộ phiên phỏng vấn theo ứng viên, vị trí, thời gian và trạng thái. Người dùng có thể tìm kiếm, lọc và mở báo cáo của từng phiên đã hoàn thành.

### 7.4. Danh sách ứng viên

Hiển thị hồ sơ ứng viên dưới dạng card, gồm vị trí, kỹ năng, email, ngày ứng tuyển và trạng thái. Từ đây quản trị viên có thể truy cập hồ sơ hoặc báo cáo chi tiết.

### 7.5. Công việc

Trang hiện sử dụng empty state vì chức năng quản lý công việc chưa có dữ liệu. Nút tạo công việc được giữ lại để phát triển biểu mẫu và kết nối API trong giai đoạn backend.

### 7.6. Báo cáo tuyển dụng

Tổng hợp xu hướng chất lượng ứng viên, phân bổ kết quả và các báo cáo gần đây. Quản trị viên có thể mở báo cáo chi tiết của từng ứng viên.

### 7.7. Cài đặt

Cho phép cập nhật hồ sơ quản trị viên và các thiết lập không gian làm việc. Route này chỉ dành cho tài khoản có vai trò Admin.

---

## 8. Giao diện ứng viên

### 8.1. Tổng quan cá nhân

Hiển thị lời chào, kết quả gần nhất, số phiên đã hoàn thành và công việc phù hợp. Ứng viên có thể bắt đầu phiên mới hoặc truy cập nhanh kết quả cá nhân.

### 8.2. Xem công việc

Hiển thị danh sách vị trí đang tuyển cùng công ty, địa điểm, hình thức làm việc, kỹ năng và tỷ lệ phù hợp. Ứng viên có thể bắt đầu phỏng vấn trực tiếp từ một công việc.

### 8.3. Tạo phiên phỏng vấn

Ứng viên chọn vị trí muốn ứng tuyển và tải CV cá nhân. Hệ thống hiển thị thông tin phiên, số câu hỏi dự kiến và thời lượng trước khi tiếp tục.

### 8.4. Kết quả của tôi

Hiển thị điểm trung bình, số phiên đã hoàn thành và năng lực nổi bật. Danh sách chỉ bao gồm các phiên phỏng vấn thuộc ứng viên đang đăng nhập.

### 8.5. Hồ sơ cá nhân

Cho phép cập nhật tên, email, số điện thoại và vị trí mong muốn. Trong giai đoạn backend, trang này sẽ hỗ trợ lưu CV mặc định và đồng bộ thông tin tài khoản.

---

## 9. Luồng phỏng vấn

### 9.1. AI phân tích

AI phân tích CV, đối chiếu yêu cầu công việc và xác định kỹ năng cần đánh giá. Progress bar và từng bước xử lý giúp người dùng hiểu trạng thái hiện tại.

### 9.2. Kiểm tra thiết bị

Kiểm tra camera, microphone và kết nối Internet trước khi bắt đầu. Người dùng phải xác nhận quyền ghi âm và ghi hình để tiếp tục.

### 9.3. Phòng phỏng vấn

Hiển thị video ứng viên, câu hỏi hiện tại, tiến trình, thời gian và transcript. Người dùng có thể bật hoặc tắt thiết bị, bắt đầu trả lời và kết thúc phiên.

### 9.4. Xử lý kết quả

Hiển thị tiến trình chuyển giọng nói thành văn bản, đánh giá câu trả lời, phân tích âm thanh, hình ảnh và tạo báo cáo cuối cùng.

---

## 10. Báo cáo chi tiết

Admin và Candidate sử dụng chung component báo cáo để đảm bảo dữ liệu và giao diện nhất quán. Candidate không nhìn thấy những thao tác quản trị như thêm ứng viên vào shortlist.

### 10.1. Tổng quan

Hiển thị điểm tổng, mức độ phù hợp, độ tin cậy, thời lượng, điểm năng lực, biểu đồ kỹ năng, điểm mạnh và điểm cần cải thiện.

### 10.2. Đánh giá câu hỏi

Hiển thị từng câu hỏi, câu trả lời, điểm số và nhận xét của AI. Các ý đã đề cập và nội dung còn thiếu được trình bày bằng badge.

### 10.3. Phân tích giọng nói

Trình bày tốc độ nói, tần suất ngập ngừng, thời gian dừng và thời lượng nói. Kết quả được mô tả dưới dạng dữ liệu quan sát, không suy luận tính cách.

### 10.4. Phân tích hình ảnh

Hiển thị tỷ lệ khuôn mặt xuất hiện, hướng nhìn và dòng thời gian sự kiện. Các sự kiện chỉ được ghi nhận như tín hiệu cần xem xét, không được xem là kết luận gian lận.

---

## 11. Điều hướng và route

### Route công khai

```text
/login
```

### Route Admin/Recruiter

```text
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

### Route Candidate

```text
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

`RoleGuard` kiểm tra vai trò trước khi render page. Người dùng chưa đăng nhập sẽ được chuyển về `/login`, còn người dùng truy cập sai khu vực sẽ được đưa về trang chủ tương ứng với vai trò.

---

## 12. Responsive

### Desktop

- Sidebar hiển thị cố định.
- Nội dung sử dụng tối đa chiều rộng màn hình.
- Báo cáo và danh sách có thể hiển thị nhiều cột.

### Tablet

- Sidebar chuyển thành menu ẩn.
- Các grid nhiều cột được thu gọn còn một hoặc hai cột.
- Vùng nội dung được tăng khoảng trống cho nút mở menu.

### Mobile

- Điều hướng mở bằng nút menu.
- Card và biểu mẫu được xếp thành một cột.
- Các nút hành động được rút gọn để tiết kiệm không gian.
- Phòng phỏng vấn ưu tiên video, câu hỏi và nút điều khiển thiết yếu.

---

## 13. Cấu trúc frontend

```text
src/
├── app/
│   └── AppRouter.tsx
├── auth/
│   ├── AuthContext.tsx
│   ├── RoleGuard.tsx
│   └── types.ts
├── config/
│   └── access.ts
├── admin/
│   └── pages/
├── candidate/
│   └── CandidatePages.tsx
├── interview/
│   └── pages/
├── App.tsx
├── Pages.tsx
├── main.tsx
└── styles.css
```

---

## 14. Yêu cầu khi kết nối backend

- Backend phải xác định vai trò từ access token đã xác thực.
- Không sử dụng role hoặc user ID do frontend tự gửi để quyết định quyền truy cập.
- Candidate chỉ được truy vấn dữ liệu có `candidate_id` trùng với tài khoản hiện tại.
- Recruiter chỉ được xem dữ liệu thuộc tổ chức của mình.
- Chỉ Admin được thay đổi thiết lập hệ thống.
- CV, audio và video cần được lưu trong private storage.
- File tải xuống cần sử dụng signed URL có thời hạn.
- API phải kiểm tra quyền sở hữu đối với phỏng vấn, transcript và báo cáo.

---

## 15. Trạng thái hoàn thiện

### Đã hoàn thành

- Design system và responsive layout.
- Giao diện đăng nhập với hai tài khoản mẫu.
- Phân tách không gian Admin và Candidate.
- Role guard và route theo vai trò.
- Giao diện quản lý ứng viên và phỏng vấn.
- Luồng tạo và thực hiện phỏng vấn.
- Báo cáo dùng chung giữa Admin và Candidate.
- Các trạng thái loading, processing, empty và permission.

### Chưa kết nối

- API xác thực và refresh token.
- Database người dùng, công việc và ứng viên.
- Upload CV thật.
- Camera, microphone và ghi hình thật.
- Speech-to-text và AI evaluation.
- Lưu báo cáo và tải PDF thật.
- Quản lý công việc trên backend.

---

## 16. Kết luận

Giao diện hiện tại đã mô phỏng đầy đủ luồng sử dụng chính của hệ thống và phân tách đúng nghiệp vụ giữa quản trị viên với ứng viên. Cấu trúc route, role guard và các component dùng chung tạo nền tảng phù hợp để triển khai API, cơ sở dữ liệu và các module AI trong giai đoạn tiếp theo.
