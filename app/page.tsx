"use client"

import BackgroundVideo from "@/components/background-video"
import HeaderText from "@/components/header-text"
import TimerDashboardCard from "@/components/timer-dashboard-card"
import AdminControls from "@/components/admin-controls"
import { useCountdown } from "@/hooks/use-countdown"

export default function HackathonCountdown() {
  const { hours, minutes, seconds, isRunning, isFinished, minutePulse, start, pause, resume, reset } = useCountdown()

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
