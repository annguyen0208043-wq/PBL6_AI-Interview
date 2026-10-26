# Hướng dẫn chạy module Whisper STT trên máy local

Tài liệu này hướng dẫn cài đặt và chạy luồng demo Speech-to-Text của dự án trên
một máy mới. Luồng hiện tại gồm:

```text
Microphone trên trình duyệt
  → FastAPI nhận audio
  → Faster-Whisper nhận dạng
  → Hiệu chỉnh thuật ngữ bằng datastore
  → Frontend hiển thị raw/corrected transcript và edit log
```

## 1. Cấu hình đang sử dụng

Module hiện được cấu hình mặc định như sau:

| Cấu hình | Giá trị |
|---|---|
| Model | `turbo` — Large-v3 Turbo dành cho faster-whisper |
| Runtime | `faster-whisper` / CTranslate2 |
| Thiết bị | CPU |
| Compute type | INT8 |
| Ngôn ngữ | Tiếng Việt (`vi`) |
| Beam size | 5 |
| VAD | Bật |
| Task | `transcribe` |

Các giá trị mặc định nằm trong `backend/app/core/config.py` và có thể ghi đè
bằng file `backend/.env`.

Trong môi trường đã kiểm thử ngày 26/10/2026, các phiên bản thực tế là:

```text
Python             3.10.11
faster-whisper     1.2.1
CTranslate2        4.8.4
huggingface-hub    2.3.0
PyAV               17.1.0
```

`requirements.txt` không khóa cứng toàn bộ phiên bản trên; nó cho phép
`faster-whisper >= 1.1, < 2`. Nếu cần tái hiện chính xác môi trường đã kiểm
thử, có thể khóa phiên bản sau khi cả nhóm xác nhận chạy ổn trên các máy.

## 2. Yêu cầu máy

Tối thiểu để chạy demo CPU:

- Windows 10/11 64-bit.
- Python 3.10 hoặc 3.11 64-bit.
- RAM tối thiểu 8 GB; khuyến nghị 16 GB khi dùng Turbo.
- Còn trống khoảng vài GB để chứa virtual environment và model.
- Microphone và trình duyệt Chrome/Edge.
- Internet trong lần tải model đầu tiên.

`faster-whisper` sử dụng PyAV để giải mã audio nên luồng demo hiện tại không bắt
buộc phải cài FFmpeg hệ thống. Tuy nhiên, FFmpeg vẫn hữu ích nếu cần kiểm tra,
chuyển đổi hoặc chuẩn hóa audio thủ công.

Nếu máy yếu hoặc cần smoke test nhanh, đổi model từ `turbo` sang `small` hoặc
`base`. Không nên so sánh chất lượng các model nếu chưa chạy trên cùng bộ audio.

## 3. Clone và chọn branch

```powershell
git clone https://github.com/annguyen0208043-wq/PBL6_AI-Interview.git
cd PBL6_AI-Interview
git switch An
```

## 4. Cài thư viện backend

Từ thư mục gốc của repository:

```powershell
cd backend
py -3.10 -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Nếu máy dùng Python 3.11, thay `py -3.10` bằng `py -3.11`.

Các dependency trực tiếp của backend gồm:

- `fastapi` và `uvicorn`: HTTP API.
- `python-multipart`: nhận file audio từ form upload.
- `pydantic-settings` và `python-dotenv`: đọc cấu hình `.env`.
- `faster-whisper`: chạy Whisper bằng CTranslate2.
- `httpx`: HTTP client và kiểm thử API.
- `supabase`, `python-jose`, `passlib`: dependency cho phần backend chung; chưa
  bắt buộc phải cấu hình Supabase để chạy riêng demo STT.

Những thư viện quan trọng như `ctranslate2`, `onnxruntime`, `av`, `tokenizers`,
`huggingface-hub` và `numpy` sẽ được cài gián tiếp bởi `faster-whisper`.

Không sử dụng `frontend/venv` để chạy backend. Backend phải dùng
`backend/venv` riêng.

## 5. Cấu hình backend

Nội dung STT chính trong `backend/.env`:

```env
STT_MODEL=turbo
STT_DEVICE=cpu
STT_COMPUTE_TYPE=int8
STT_LANGUAGE=vi
STT_BEAM_SIZE=5
STT_DATASTORE_PATH=
STT_UPLOAD_DIR=data/stt_uploads
STT_MAX_UPLOAD_MB=100
```

Khi `STT_DATASTORE_PATH` để trống, backend dùng:

```text
backend/data/verified_aliases.jsonl
```

Khi muốn dùng datastore đầy đủ, đặt đường dẫn tuyệt đối hoặc tương đối tới file
JSONL, ví dụ:

```env
STT_DATASTORE_PATH=D:\D\pbl6_base\data\lexicon\term_datastore.jsonl
```

Service đọc được cả hai schema:

- Alias đơn giản trong trường `aliases`.
- Datastore mở rộng trong `observed_asr_variants`; chỉ observation có
  `verified=true` được dùng để tự động sửa.

## 6. Model được lưu ở đâu?

### Cách mặc định

Khi `STT_MODEL=turbo`, lần chạy transcript đầu tiên sẽ tải model tương ứng từ
Hugging Face. Trên Windows, cache mặc định thường nằm tại:

```text
%USERPROFILE%\.cache\huggingface\hub\
```

Model Turbo hiện được lưu trong thư mục có dạng:

```text
models--mobiuslabsgmbh--faster-whisper-large-v3-turbo
```

Ví dụ trên máy hiện tại:

```text
C:\Users\<username>\.cache\huggingface\hub\models--mobiuslabsgmbh--faster-whisper-large-v3-turbo
```

Model không được commit vào Git vì dung lượng lớn. Repository chỉ chứa code,
cấu hình và datastore.

### Chọn ổ đĩa cache khác

Đặt `HF_HOME` trước khi khởi động backend và trước lần tải model đầu tiên:

```powershell
$env:HF_HOME = 'D:\AI_CACHE\huggingface'
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Muốn lưu cấu hình lâu dài trên máy Windows:

```powershell
setx HF_HOME "D:\AI_CACHE\huggingface"
```

Sau `setx`, cần mở terminal mới. Không nên đặt model trong repository.

### Dùng model từ thư mục local

Có thể tải model vào một thư mục được quản lý riêng:

```powershell
.\venv\Scripts\hf.exe download mobiuslabsgmbh/faster-whisper-large-v3-turbo `
  --local-dir D:\AI_MODELS\faster-whisper-large-v3-turbo
```

Sau đó cấu hình:

```env
STT_MODEL=D:\AI_MODELS\faster-whisper-large-v3-turbo
```

Thư mục phải chứa đầy đủ model CTranslate2, bao gồm các file như
`model.bin`, `config.json`, tokenizer và vocabulary tương ứng.

### Chạy trên máy không có Internet

Trên máy có Internet, tải model hoàn chỉnh trước. Sau đó có thể:

1. Sao chép toàn bộ thư mục model local sang máy đích.
2. Đặt `STT_MODEL` trỏ trực tiếp tới thư mục vừa sao chép.
3. Cài trước các Python wheel/dependency cần thiết hoặc chuẩn bị mirror nội bộ.

Chỉ sao chép một phần thư mục cache Hugging Face có thể gây lỗi thiếu snapshot
hoặc symlink. Phương án thư mục local với `--local-dir` dễ kiểm soát hơn.

## 7. Chạy backend

```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Kiểm tra:

```text
http://localhost:8000/health
http://localhost:8000/api/v1/stt/config
http://localhost:8000/docs
```

Kết quả config mong đợi:

```json
{
  "model": "turbo",
  "device": "cpu",
  "compute_type": "int8",
  "language": "vi",
  "datastore_configured": true
}
```

Lần xử lý đầu tiên có thể chậm hơn do tải và khởi tạo model. Model được giữ trong
bộ nhớ và tái sử dụng cho các job tiếp theo.

## 8. Cài và chạy frontend

Mở terminal khác tại thư mục repository:

```powershell
cd frontend
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Mặc định frontend gọi backend tại:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Mở `http://localhost:5173`, đăng nhập bằng tài khoản demo, vào phòng phỏng vấn,
nhấn **Bắt đầu trả lời**, nói vào microphone và nhấn **Kết thúc câu trả lời**.

Trình duyệt chỉ cho dùng microphone trong secure context. `localhost` được hỗ
trợ khi chạy local; nếu truy cập từ máy khác bằng địa chỉ IP, nên cấu hình HTTPS.

## 9. API của module

### Tạo STT job

```http
POST /api/v1/stt/jobs
Content-Type: multipart/form-data
```

Các field:

- `audio`: file WAV, WebM, OGG hoặc định dạng PyAV hỗ trợ.
- `interview_id`: mã phiên phỏng vấn.
- `question_id`: mã câu hỏi.
- `context`: câu hỏi và danh sách thuật ngữ dự kiến.

### Theo dõi job

```http
GET /api/v1/stt/jobs/{job_id}
```

Trạng thái lần lượt là `queued`, `processing`, `completed` hoặc `failed`.
Kết quả hoàn tất chứa:

- `raw_transcript`
- `corrected_transcript`
- `segments`
- `edits`
- `needs_review`
- `latency_ms`
- tên model và ngôn ngữ nhận diện

## 10. File audio và dữ liệu tạm

Audio upload được lưu tại:

```text
backend/data/stt_uploads/
```

Thư mục này đã được thêm vào `.gitignore`. Bản demo hiện lưu job trong RAM, do
đó restart backend sẽ làm mất trạng thái job, nhưng file audio vẫn còn trên ổ
đĩa. Khi tích hợp production cần lưu metadata vào database và có chính sách xóa
audio theo thời hạn.

## 11. Lỗi thường gặp

### `faster-whisper chưa được cài`

Đảm bảo đang dùng đúng Python của backend:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### Model tải chậm hoặc lỗi mạng

- Kiểm tra kết nối tới Hugging Face.
- Đảm bảo ổ chứa cache còn dung lượng.
- Tải model trước bằng `hf download` rồi dùng đường dẫn local.
- Có thể đổi tạm `STT_MODEL=small` để thử luồng.

### Máy thiếu RAM hoặc inference quá chậm

Thử cấu hình:

```env
STT_MODEL=small
STT_DEVICE=cpu
STT_COMPUTE_TYPE=int8
```

### Frontend báo không kết nối được backend

- Kiểm tra backend đang chạy ở cổng 8000.
- Mở `http://localhost:8000/health`.
- Kiểm tra `VITE_API_BASE_URL`.
- Nếu đổi origin frontend, bổ sung origin đó vào CORS trong
  `backend/app/main.py`.

### Không thu được microphone

- Cho phép quyền microphone trong trình duyệt.
- Đóng các ứng dụng đang chiếm microphone nếu cần.
- Dùng `localhost` hoặc HTTPS.
- Kiểm tra thiết bị input mặc định của Windows.

## 12. Kiểm tra nhanh trước khi demo

1. Backend `/health` trả về `200`.
2. `/api/v1/stt/config` hiển thị đúng model và datastore.
3. Frontend mở được trên `localhost:5173`.
4. Trình duyệt đã được cấp quyền microphone.
5. Nói thử một câu có `ReactJS`, `FastAPI`, `PostgreSQL` hoặc `GraphQL`.
6. Trang Processing chuyển tới trạng thái hoàn tất.
7. Tab **Đánh giá câu hỏi** hiển thị cả raw transcript và corrected transcript.

Trước buổi demo trên máy mới, nên chạy thử ít nhất một audio để model được tải,
cache và khởi tạo hoàn chỉnh.
