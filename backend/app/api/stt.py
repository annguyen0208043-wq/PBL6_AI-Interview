from __future__ import annotations

import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.core.config import settings
from app.services.stt_service import stt_service


router = APIRouter(prefix="/api/v1/stt", tags=["Speech to text"])
_jobs: dict[str, dict[str, Any]] = {}
_jobs_lock = threading.Lock()
# One worker avoids loading/running multiple large Whisper inferences on a demo CPU.
_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="stt")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _public_job(job: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in job.items() if key != "audio_path"}


def _update(job_id: str, **values: Any) -> None:
    with _jobs_lock:
        _jobs[job_id].update(values, updated_at=_now())


def _run_job(job_id: str) -> None:
    job = _jobs[job_id]
    try:
        _update(job_id, status="processing", stage="loading_model", progress=15)
        _update(job_id, stage="transcribing", progress=35)
        result = stt_service.transcribe(Path(job["audio_path"]), job["context"])
        _update(job_id, stage="correcting_text", progress=85)
        _update(
            job_id,
            status="completed",
            stage="completed",
            progress=100,
            result=result,
            completed_at=_now(),
        )
    except Exception as exc:
        _update(
            job_id,
            status="failed",
            stage="failed",
            error=str(exc),
            progress=100,
        )


@router.post("/jobs", status_code=status.HTTP_202_ACCEPTED)
async def create_job(
    audio: UploadFile = File(...),
    interview_id: str = Form("demo"),
    question_id: str = Form("question-04"),
    context: str = Form(""),
) -> dict[str, Any]:
    content = await audio.read()
    max_bytes = settings.STT_MAX_UPLOAD_MB * 1024 * 1024
    if not content:
        raise HTTPException(status_code=400, detail="Tệp audio rỗng")
    if len(content) > max_bytes:
        raise HTTPException(status_code=413, detail=f"Audio vượt quá {settings.STT_MAX_UPLOAD_MB} MB")

    job_id = uuid.uuid4().hex
    suffix = Path(audio.filename or "answer.webm").suffix.lower() or ".webm"
    upload_dir = Path(settings.STT_UPLOAD_DIR)
    if not upload_dir.is_absolute():
        upload_dir = Path(__file__).resolve().parents[2] / upload_dir
    upload_dir.mkdir(parents=True, exist_ok=True)
    audio_path = upload_dir / f"{job_id}{suffix}"
    audio_path.write_bytes(content)

    job = {
        "id": job_id,
        "interview_id": interview_id,
        "question_id": question_id,
        "status": "queued",
        "stage": "queued",
        "progress": 5,
        "context": context,
        "audio_path": str(audio_path),
        "created_at": _now(),
        "updated_at": _now(),
        "result": None,
        "error": None,
    }
    with _jobs_lock:
        _jobs[job_id] = job
    _executor.submit(_run_job, job_id)
    return _public_job(job)


@router.get("/jobs/{job_id}")
def get_job(job_id: str) -> dict[str, Any]:
    with _jobs_lock:
        job = _jobs.get(job_id)
        if job is None:
            raise HTTPException(status_code=404, detail="Không tìm thấy STT job")
        return _public_job(dict(job))


@router.get("/config")
def get_demo_config() -> dict[str, Any]:
    return {
        "model": settings.STT_MODEL,
        "device": settings.STT_DEVICE,
        "compute_type": settings.STT_COMPUTE_TYPE,
        "language": settings.STT_LANGUAGE,
        "datastore_configured": stt_service._resolve_datastore_path() is not None,
    }
