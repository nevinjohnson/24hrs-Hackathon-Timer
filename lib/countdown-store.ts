const STORAGE_KEY = "hackathon-countdown-end-time"

export function getStoredEndTime(): number | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? Number.parseInt(stored, 10) : null
}

export function setStoredEndTime(endTime: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, endTime.toString())
}

export function clearStoredEndTime(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function startCountdown(durationMs: number = 24 * 60 * 60 * 1000): number {
  const endTime = Date.now() + durationMs
  setStoredEndTime(endTime)
  return endTime
}
