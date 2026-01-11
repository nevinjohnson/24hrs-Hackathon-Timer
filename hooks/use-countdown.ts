"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getStoredEndTime, setStoredEndTime, clearStoredEndTime } from "@/lib/countdown-store"

export interface CountdownState {
  hours: number
  minutes: number
  seconds: number
  isRunning: boolean
  isFinished: boolean
}

export function useCountdown() {
  const [state, setState] = useState<CountdownState>({
    hours: 24,
    minutes: 0,
    seconds: 0,
    isRunning: false,
    isFinished: false,
  })
  const [minutePulse, setMinutePulse] = useState(false)
  const lastMinuteRef = useRef<number | null>(null)

  const calculateTimeRemaining = useCallback((endTime: number) => {
    const now = Date.now()
    const remaining = Math.max(0, endTime - now)

    const totalSeconds = Math.floor(remaining / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return { hours, minutes, seconds, remaining }
  }, [])

  const syncFromStorage = useCallback(() => {
    const endTime = getStoredEndTime()
    if (endTime) {
      const { hours, minutes, seconds, remaining } = calculateTimeRemaining(endTime)
      if (remaining <= 0) {
        setState({ hours: 0, minutes: 0, seconds: 0, isRunning: false, isFinished: true })
      } else {
        setState({ hours, minutes, seconds, isRunning: true, isFinished: false })
      }
    }
  }, [calculateTimeRemaining])

  useEffect(() => {
    syncFromStorage()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hackathon-countdown-end-time") {
        syncFromStorage()
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [syncFromStorage])

  useEffect(() => {
    if (!state.isRunning || state.isFinished) return

    const interval = setInterval(() => {
      const endTime = getStoredEndTime()
      if (!endTime) {
        setState((prev) => ({ ...prev, isRunning: false }))
        return
      }

      const { hours, minutes, seconds, remaining } = calculateTimeRemaining(endTime)

      // Trigger pulse on minute change
      if (lastMinuteRef.current !== null && lastMinuteRef.current !== minutes) {
        setMinutePulse(true)
        setTimeout(() => setMinutePulse(false), 300)
      }
      lastMinuteRef.current = minutes

      if (remaining <= 0) {
        setState({ hours: 0, minutes: 0, seconds: 0, isRunning: false, isFinished: true })
        clearInterval(interval)
      } else {
        setState({ hours, minutes, seconds, isRunning: true, isFinished: false })
      }
    }, 100) // Update frequently for accurate sync

    return () => clearInterval(interval)
  }, [state.isRunning, state.isFinished, calculateTimeRemaining])

  const start = useCallback(
    (durationMs: number = 24 * 60 * 60 * 1000) => {
      const endTime = Date.now() + durationMs
      setStoredEndTime(endTime)
      const { hours, minutes, seconds } = calculateTimeRemaining(endTime)
      lastMinuteRef.current = minutes
      setState({ hours, minutes, seconds, isRunning: true, isFinished: false })
    },
    [calculateTimeRemaining],
  )

  const pause = useCallback(() => {
    const endTime = getStoredEndTime()
    if (endTime) {
      const remaining = Math.max(0, endTime - Date.now())
      // Store remaining time as negative to indicate paused state
      setStoredEndTime(-remaining)
    }
    setState((prev) => ({ ...prev, isRunning: false }))
  }, [])

  const resume = useCallback(() => {
    const stored = getStoredEndTime()
    if (stored && stored < 0) {
      // Negative value means paused, restore remaining time
      const remaining = -stored
      const newEndTime = Date.now() + remaining
      setStoredEndTime(newEndTime)
      setState((prev) => ({ ...prev, isRunning: true }))
    }
  }, [])

  const reset = useCallback(() => {
    clearStoredEndTime()
    lastMinuteRef.current = null
    setState({ hours: 24, minutes: 0, seconds: 0, isRunning: false, isFinished: false })
  }, [])

  return { ...state, minutePulse, start, pause, resume, reset }
}
