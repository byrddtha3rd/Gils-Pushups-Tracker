export interface PushUpEntry {
  id: string
  date: string
  count: number
  createdAt: string
  updatedAt: string
}

export type PaceStatus = 'Ahead of Pace' | 'On Pace' | 'Behind Pace'
export type AppTab = 'dashboard' | 'log' | 'calendar' | 'stats'

export interface MonthStats {
  month: string
  total: number
  remaining: number
  percent: number
  daysInMonth: number
  elapsedDays: number
  remainingDays: number
  activeDays: number
  missedDays: number
  averagePerDay: number
  neededPerDay: number
  projectedTotal: number
  status: PaceStatus
  highOutputTarget: number
  bestDay: { date: string; count: number } | null
}
