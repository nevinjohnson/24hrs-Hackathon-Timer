"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Clock, ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [customHours, setCustomHours] = useState(24)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const handleAuth = () => {
    // Simple password check - change this to your desired password
    if (password === "ELEVEN") {
      setIsAuthenticated(true)
      setPassword("")
    }
  }

  const handleStart = () => {
    // Dispatch custom event to notify the main page
    window.dispatchEvent(
      new CustomEvent("admin-start", {
        detail: { duration: customHours * 60 * 60 * 1000 },
      }),
    )
    setIsRunning(true)
  }

  const handlePause = () => {
    window.dispatchEvent(new CustomEvent("admin-pause"))
    setIsRunning(false)
  }

  const handleReset = () => {
    window.dispatchEvent(new CustomEvent("admin-reset"))
    setIsRunning(false)
    setIsFinished(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-3xl p-8 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <h1 className="text-3xl font-extrabold text-white mb-2 text-center">Admin Access</h1>
            <p className="text-white/60 text-center text-sm mb-6">Enter password to access timer controls</p>

            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAuth()}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 text-center text-lg tracking-widest uppercase"
              />
              <Button
                onClick={handleAuth}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold h-11"
              >
                Unlock
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 h-11"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
        <div className="rounded-3xl p-8 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-white">Timer Controls</h1>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <input
                type="number"
                min="1"
                max="99"
                value={customHours}
                onChange={(e) => setCustomHours(Number.parseInt(e.target.value) || 24)}
                className="flex-1 bg-white/10 border border-white/20 text-white text-center rounded-lg px-4 py-2"
              />
              <span className="text-white/60 font-medium">hours</span>
            </div>

            <div className="flex gap-3 flex-wrap">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  className="flex-1 min-w-40 bg-green-500 hover:bg-green-600 text-white font-semibold h-11"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  className="flex-1 min-w-40 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold h-11"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Timer
                </Button>
              )}

              <Button
                onClick={handleReset}
                className="flex-1 min-w-40 bg-red-500 hover:bg-red-600 text-white font-semibold h-11"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Timer
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-cyan-300 text-sm">
                <strong>Tip:</strong> You can also unlock 5-tap mode on the countdown timer for backup access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
