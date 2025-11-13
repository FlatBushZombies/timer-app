// Utility functions for timer calculations

export interface TimerState {
  startTime: number
  elapsedSeconds: number
  isRunning: boolean
  isCompleted: boolean
}

export function calculateProgress(elapsedSeconds: number, totalMinutes: number): number {
  const totalSeconds = totalMinutes * 60
  const progress = (elapsedSeconds / totalSeconds) * 100
  return Math.min(progress, 100)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function isTimerComplete(elapsedSeconds: number, totalMinutes: number): boolean {
  return elapsedSeconds >= totalMinutes * 60
}
