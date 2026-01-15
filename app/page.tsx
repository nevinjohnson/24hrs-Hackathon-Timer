"use client"

import BackgroundVideo from "@/components/background-video"
import HeaderText from "@/components/header-text"
import TimerDashboardCard from "@/components/timer-dashboard-card"
import AdminControls from "@/components/admin-controls"
import { useCountdown } from "@/hooks/use-countdown"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HackathonCountdown() {
  const { hours, minutes, seconds, isRunning, isFinished, minutePulse, start, pause, resume, reset } = useCountdown()
  const router = useRouter()
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const handleTapUnlock = () => {
    router.push("/admin")
  }

  // Listen for admin events from the /admin page
  useEffect(() => {
    const handleAdminStart = (event: Event) => {
      const customEvent = event as CustomEvent
      start(customEvent.detail.duration)
    }

    const handleAdminPause = () => {
      pause()
    }

    const handleAdminReset = () => {
      reset()
    }

    window.addEventListener("admin-start", handleAdminStart)
    window.addEventListener("admin-pause", handleAdminPause)
    window.addEventListener("admin-reset", handleAdminReset)

    return () => {
      window.removeEventListener("admin-start", handleAdminStart)
      window.removeEventListener("admin-pause", handleAdminPause)
      window.removeEventListener("admin-reset", handleAdminReset)
    }
  }, [start, pause, reset])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundVideo />
      <HeaderText />

      <div className="relative z-10 w-full max-w-3xl px-4">
        <TimerDashboardCard
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          isRunning={isRunning}
          isFinished={isFinished}
          minutePulse={minutePulse}
          onUnlock={handleTapUnlock}
        />
      </div>

      <AdminControls
        isRunning={isRunning}
        isFinished={isFinished}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
      />
    </main>
  )
}
