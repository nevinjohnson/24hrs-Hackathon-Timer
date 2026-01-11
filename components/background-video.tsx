"use client"

import { memo } from "react"

const BackgroundVideo = memo(function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/st%20timer%201-VeFvjuwbe70KdJZpJi8nRHccnGU5ub.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  )
})

export default BackgroundVideo
