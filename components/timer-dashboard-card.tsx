"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface TimerDashboardCardProps {
  hours: number
  minutes: number
  seconds: number
  isRunning: boolean
  isFinished: boolean
  minutePulse: boolean
}

export default function TimerDashboardCard({
  hours,
  minutes,
  seconds,
  isRunning,
  isFinished,
  minutePulse,
}: TimerDashboardCardProps) {
  const formatNumber = (n: number) => n.toString().padStart(2, "0")

  const tickAudioRef = useRef<HTMLAudioElement | null>(null)
  const finishAudioRef = useRef<HTMLAudioElement | null>(null)
  const hourChimeAudioRef = useRef<HTMLAudioElement | null>(null)
  const prevSecondsRef = useRef(seconds)
  const prevHoursRef = useRef(hours)

  useEffect(() => {
    tickAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3")
    tickAudioRef.current.volume = 0.2

    finishAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3")
    finishAudioRef.current.volume = 0.4

    hourChimeAudioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vecnas%20Clock-%204%20Chimes%20-%20Cain%20%28youtube%29-ZbZAHw7yypsyPV7CFiThZk8UT36N8n.wav")
    hourChimeAudioRef.current.volume = 0.5

    return () => {
      tickAudioRef.current = null
      finishAudioRef.current = null
      hourChimeAudioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    if (prevSecondsRef.current !== seconds && tickAudioRef.current) {
      const totalSecondsRemaining = hours * 3600 + minutes * 60 + seconds
      const totalDuration = 24 * 3600
      const percentRemaining = totalSecondsRemaining / totalDuration

      let volume = 0.15 + (1 - percentRemaining) * 0.25

      if (hours === 0) {
        volume = Math.min(0.5, volume + 0.1)
      }

      if (hours === 0 && minutes < 5) {
        volume = 0.6
      }

      tickAudioRef.current.volume = volume
      tickAudioRef.current.currentTime = 0
      tickAudioRef.current.play().catch(() => {})
    }

    prevSecondsRef.current = seconds
  }, [seconds, hours, minutes, isRunning])

  useEffect(() => {
    if (!isRunning) return

    if (prevHoursRef.current !== hours && prevHoursRef.current > hours && hourChimeAudioRef.current) {
      hourChimeAudioRef.current.currentTime = 0
      hourChimeAudioRef.current.play().catch(() => {})
    }

    prevHoursRef.current = hours
  }, [hours, isRunning])

  if (isFinished) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5" />

        <div className="text-center relative z-10">
          <div className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-wider text-white drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] animate-pulse">
            {"TIME'S UP"}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm tracking-widest text-white/70 uppercase">Hackathon Complete</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-50 bg-transparent" />

      <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl animate-blob delay-2000" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full shadow-lg",
              isRunning ? "bg-cyan-400 animate-pulse shadow-cyan-400/50" : "bg-white/40",
            )}
          />
          <span className="text-xs tracking-widest text-white/60 uppercase font-medium">
            {isRunning ? "Live" : "Paused"}
          </span>
        </div>
        <span className="text-xs tracking-widest text-white/60 uppercase font-medium">Remaining</span>
      </div>

      <div className="flex items-baseline justify-center gap-2 md:gap-4 relative z-10">
        <div className="text-center">
          <div
            className={cn(
              "text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white tabular-nums transition-all duration-300",
              "drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] [text-shadow:0_0_60px_rgba(34,211,238,0.3)]",
              minutePulse && "brightness-150 drop-shadow-[0_0_60px_rgba(34,211,238,0.8)] scale-105",
            )}
          >
            {formatNumber(hours)}
          </div>
          <div className="text-xs tracking-widest text-white/50 mt-2 uppercase font-medium">Hours</div>
        </div>

        <span
          className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-extrabold text-white/70 mb-8 transition-all duration-300",
            "drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]",
            isRunning && "animate-pulse",
          )}
        >
          :
        </span>

        <div className="text-center relative">
          <div
            className={cn(
              "text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white tabular-nums transition-all duration-300",
              "drop-shadow-[0_0_30px_rgba(34,211,238,0.4)] [text-shadow:0_0_60px_rgba(34,211,238,0.3)]",
              minutePulse && "brightness-150 scale-110",
            )}
          >
            {formatNumber(minutes)}
          </div>
          <div className="text-xs tracking-widest text-white/50 mt-2 uppercase font-medium">Minutes</div>
          <div className="absolute -top-2 -right-12 md:-right-16">
            <div
              className={cn(
                "text-2xl md:text-3xl lg:text-4xl font-extrabold text-cyan-300 tabular-nums transition-all duration-300",
                "drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] [text-shadow:0_0_30px_rgba(34,211,238,0.4)]",
                minutePulse && "brightness-150 scale-110",
              )}
            >
              {formatNumber(seconds)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 h-1.5 bg-white/5 rounded-full overflow-hidden relative z-10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400/80 via-teal-400/80 to-cyan-400/80 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(34,211,238,0.6)]"
          style={{
            width: `${((24 * 3600 - (hours * 3600 + minutes * 60 + seconds)) / (24 * 3600)) * 100}%`,
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
        <span className="text-xs tracking-widest text-white/50 uppercase font-medium">Powered by</span>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 rounded-md flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all w-[90px] h-[30px]">
            <img src="/logos/talentcity.png" alt="TalentCity Logo" className="object-contain w-[90px] h-[50px]" />
          </div>
          <div className="bg-white/10 rounded-md flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all w-[90px] h-[35px]">
            <img src="/logos/fmtglobal.png" alt="FMT Global Logo" className="object-contain w-[50px] h-[33px]" />
          </div>
          <div className="bg-white/10 rounded-md flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all w-[90px] h-[45px]">
            <img src="/logos/ey.png" alt="EY Logo" className="object-contain w-[90px] h-10" />
          </div>
        </div>
      </div>
    </div>
  )
}
