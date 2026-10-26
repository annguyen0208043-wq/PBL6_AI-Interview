const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

export type TranscriptEdit = {
  start: number
  end: number
  before: string
  after: string
  method: string
  evidence: string
}

export type TranscriptResult = {
  raw_transcript: string
  corrected_transcript: string
  segments: { start: number; end: number; text: string }[]
  edits: TranscriptEdit[]
  needs_review: boolean
  language: string
  language_probability?: number | null
  latency_ms: number
  model: string
}

export type SttJob = {
  id: string
  interview_id: string
  question_id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  stage: string
  progress: number
  result: TranscriptResult | null
  error: string | null
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>
  let message = `HTTP ${response.status}`
  try {
    const body = await response.json()
    message = body.detail || message
  } catch {
    // Keep the HTTP status if the backend did not return JSON.
  }
  throw new Error(message)
}

export async function createSttJob(audio: Blob, context: string): Promise<SttJob> {
  const form = new FormData()
  const extension = audio.type.includes('ogg') ? 'ogg' : audio.type.includes('mp4') ? 'm4a' : 'webm'
  form.append('audio', audio, `answer.${extension}`)
  form.append('interview_id', 'demo')
  form.append('question_id', 'question-04')
  form.append('context', context)
  const response = await fetch(`${API_BASE}/api/v1/stt/jobs`, { method: 'POST', body: form })
  return parseResponse<SttJob>(response)
}

export async function getSttJob(jobId: string): Promise<SttJob> {
  const response = await fetch(`${API_BASE}/api/v1/stt/jobs/${jobId}`)
  return parseResponse<SttJob>(response)
}

export const STT_JOB_STORAGE_KEY = 'pbl6-demo-stt-job-id'
export const STT_RESULT_STORAGE_KEY = 'pbl6-demo-stt-result'
