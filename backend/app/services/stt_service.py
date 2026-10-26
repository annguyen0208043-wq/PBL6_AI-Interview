from __future__ import annotations

import json
import re
import threading
import time
from pathlib import Path
from typing import Any

from app.core.config import settings


class STTService:
    """Lazy-loaded Whisper engine plus conservative terminology correction."""

    def __init__(self) -> None:
        self._model: Any | None = None
        self._model_lock = threading.Lock()

    def _get_model(self) -> Any:
        if self._model is not None:
            return self._model
        with self._model_lock:
            if self._model is None:
                try:
                    from faster_whisper import WhisperModel
                except ImportError as exc:
                    raise RuntimeError(
                        "faster-whisper chưa được cài. Chạy: pip install -r requirements.txt"
                    ) from exc
                self._model = WhisperModel(
                    settings.STT_MODEL,
                    device=settings.STT_DEVICE,
                    compute_type=settings.STT_COMPUTE_TYPE,
                )
        return self._model

    def transcribe(self, audio_path: Path, context: str = "") -> dict[str, Any]:
        started = time.perf_counter()
        model = self._get_model()
        segments_iter, info = model.transcribe(
            str(audio_path),
            language=settings.STT_LANGUAGE,
            task="transcribe",
            beam_size=settings.STT_BEAM_SIZE,
            vad_filter=True,
            initial_prompt=context.strip() or None,
        )
        segments = [
            {
                "start": round(segment.start, 3),
                "end": round(segment.end, 3),
                "text": segment.text.strip(),
            }
            for segment in segments_iter
        ]
        raw = " ".join(segment["text"] for segment in segments).strip()
        correction = self.correct_terminology(raw)
        return {
            "raw_transcript": raw,
            **correction,
            "segments": segments,
            "language": getattr(info, "language", settings.STT_LANGUAGE),
            "language_probability": getattr(info, "language_probability", None),
            "latency_ms": round((time.perf_counter() - started) * 1000, 3),
            "model": settings.STT_MODEL,
        }

    def correct_terminology(self, text: str) -> dict[str, Any]:
        aliases = self._load_verified_aliases()
        candidates: list[tuple[int, int, str, dict[str, Any]]] = []
        for item in aliases:
            canonical = item["canonical"]
            for alias in item["aliases"]:
                if alias.casefold() == canonical.casefold():
                    continue
                pattern = re.compile(r"(?<!\w)" + re.escape(alias) + r"(?!\w)", re.IGNORECASE)
                for match in pattern.finditer(text):
                    candidates.append((match.start(), match.end(), canonical, item))

        candidates.sort(key=lambda value: (value[0], -(value[1] - value[0])))
        accepted: list[tuple[int, int, str, dict[str, Any]]] = []
        cursor = -1
        needs_review = False
        for start, end, canonical, item in candidates:
            if start < cursor:
                needs_review = True
                continue
            accepted.append((start, end, canonical, item))
            cursor = end

        corrected = text
        edits: list[dict[str, Any]] = []
        for start, end, canonical, item in reversed(accepted):
            before = text[start:end]
            corrected = corrected[:start] + canonical + corrected[end:]
            edits.append(
                {
                    "start": start,
                    "end": end,
                    "before": before,
                    "after": canonical,
                    "method": "exact_verified_alias",
                    "evidence": item.get("evidence", "verified datastore alias"),
                }
            )
        edits.reverse()
        return {
            "corrected_transcript": corrected,
            "edits": edits,
            "needs_review": needs_review,
        }

    def _load_verified_aliases(self) -> list[dict[str, Any]]:
        path = self._resolve_datastore_path()
        if path is None:
            return []
        rows = []
        with path.open(encoding="utf-8") as stream:
            for line in stream:
                if not line.strip():
                    continue
                row = json.loads(line)
                aliases = list(row.get("aliases", []))
                for observation in row.get("observed_asr_variants", []):
                    if observation.get("verified"):
                        aliases.append(observation["text"])
                if row.get("verified") or aliases:
                    rows.append(
                        {
                            "canonical": row["canonical"],
                            "aliases": list(dict.fromkeys(aliases)),
                            "evidence": row.get("evidence", f"datastore:{row.get('term_id', 'unknown')}"),
                        }
                    )
        return rows

    @staticmethod
    def _resolve_datastore_path() -> Path | None:
        if settings.STT_DATASTORE_PATH:
            configured = Path(settings.STT_DATASTORE_PATH).expanduser()
            if configured.is_file():
                return configured
            raise RuntimeError(f"Không tìm thấy STT_DATASTORE_PATH: {configured}")

        bundled = Path(__file__).resolve().parents[2] / "data" / "verified_aliases.jsonl"
        return bundled if bundled.is_file() else None


stt_service = STTService()
