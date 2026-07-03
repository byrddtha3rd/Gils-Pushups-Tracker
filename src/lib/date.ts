export const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayKey = (): string => toDateKey(new Date())
export const monthKey = (dateKey: string): string => dateKey.slice(0, 7)

export const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const daysInMonthKey = (month: string): number => {
  const [year, monthNumber] = month.split('-').map(Number)
  return new Date(year, monthNumber, 0).getDate()
}

export const dateKeyForDay = (month: string, day: number): string =>
  `${month}-${String(day).padStart(2, '0')}`

export const shiftMonth = (month: string, amount: number): string => {
  const [year, monthNumber] = month.split('-').map(Number)
  const shifted = new Date(year, monthNumber - 1 + amount, 1)
  return toDateKey(shifted).slice(0, 7)
}

export const formatMonth = (month: string): string => {
  const [year, monthNumber] = month.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, monthNumber - 1, 1),
  )
}

export const formatDay = (dateKey: string): string =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(
    parseDateKey(dateKey),
  )

export const addDays = (dateKey: string, amount: number): string => {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + amount)
  return toDateKey(date)
}

export const isSunday = (dateKey: string): boolean => parseDateKey(dateKey).getDay() === 0

export const nextWorkoutDay = (dateKey: string): string => {
  let next = addDays(dateKey, 1)
  while (isSunday(next)) next = addDays(next, 1)
  return next
}

export const previousWorkoutDay = (dateKey: string): string => {
  let previous = addDays(dateKey, -1)
  while (isSunday(previous)) previous = addDays(previous, -1)
  return previous
}

export const workoutDaysInRange = (month: string, startDay: number, endDay: number): number => {
  let count = 0
  for (let day = startDay; day <= endDay; day += 1) {
    if (!isSunday(dateKeyForDay(month, day))) count += 1
  }
  return count
}
