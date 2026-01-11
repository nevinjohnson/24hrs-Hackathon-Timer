"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Clock } from "lucide-react"

interface AdminControlsProps {
  isRunning: boolean
  isFinished: boolean
  onStart: (duration?: number) => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

export default function AdminControls({
  isRunning,
  isFinished,
  onStart,
  onPause,
  onResume,
  onReset,
}: AdminControlsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [customHours, setCustomHours] = useState(24)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault()
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isVisible) return null

  const handleStart = () => {
    onStart(customHours * 60 * 60 * 1000)
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-timer-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-timer-border">
        <div className="text-xs tracking-widest text-timer-muted uppercase mb-4 text-center">Admin Controls</div>
        <div className="flex items-center gap-4">
          {/* Custom duration input */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-timer-muted" />
            <input
              type="number"
              min="1"
              max="99"
              value={customHours}
              onChange={(e) => setCustomHours(Number.parseInt(e.target.value) || 24)}
              className="w-16 bg-timer-border text-timer-text text-center rounded-lg px-2 py-1 text-sm"
            />
            <span className="text-xs text-timer-muted">hrs</span>
          </div>

          <div className="w-px h-8 bg-timer-border" />

          {/* Control buttons */}
          {!isRunning && !isFinished ? (
            <Button
              onClick={handleStart}
              variant="ghost"
              size="sm"
              className="text-timer-accent hover:text-timer-text hover:bg-timer-border"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : isRunning ? (
            <Button
              onClick={onPause}
              variant="ghost"
              size="sm"
              className="text-timer-muted hover:text-timer-text hover:bg-timer-border"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={onResume}
              variant="ghost"
              size="sm"
              className="text-timer-accent hover:text-timer-text hover:bg-timer-border"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}

          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="text-timer-muted hover:text-timer-text hover:bg-timer-border"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        <div className="text-xs text-timer-muted text-center mt-4">Press Ctrl+Shift+A to hide</div>
      </div>
    </div>
  )
}
