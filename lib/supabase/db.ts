import { createClient } from "./client"

export interface TimerSession {
  id: string
  end_time: number
  is_paused: boolean
  paused_remaining: number | null
  updated_at: string
}

export async function saveTimerState(endTime: number, isPaused = false, pausedRemaining: number | null = null) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("timer_session")
    .upsert(
      {
        id: "hackathon-timer",
        end_time: endTime,
        is_paused: isPaused,
        paused_remaining: pausedRemaining,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select()

  if (error) console.error("[Timer DB] Save error:", error)
  return data?.[0] as TimerSession | null
}

export async function getTimerState(): Promise<TimerSession | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("timer_session").select("*").eq("id", "hackathon-timer").single()

  if (error && error.code !== "PGRST116") {
    console.error("[Timer DB] Fetch error:", error)
  }

  return data as TimerSession | null
}

export async function clearTimerState() {
  const supabase = createClient()

  const { error } = await supabase.from("timer_session").delete().eq("id", "hackathon-timer")

  if (error) console.error("[Timer DB] Clear error:", error)
}
