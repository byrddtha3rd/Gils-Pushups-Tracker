import { useMemo, useState } from 'react'
import type { PushUpEntry } from '../types'
import {
  dateKeyForDay,
  daysInMonthKey,
  formatDay,
  formatMonth,
  isSunday,
  monthKey,
  parseDateKey,
  shiftMonth,
  todayKey,
} from '../lib/date'
import { dailyTotals, getMonthStats } from '../lib/stats'
import { ChevronIcon, StarIcon } from '../components/Icons'
import { EntryList } from '../components/EntryList'

interface CalendarViewProps {
  entries: PushUpEntry[]
  onEdit: (entry: PushUpEntry) => void
  onDelete: (entry: PushUpEntry) => void
  onBackdate: (date: string) => void
}

export function CalendarView({ entries, onEdit, onDelete, onBackdate }: CalendarViewProps) {
  const currentMonth = monthKey(todayKey())
  const [shownMonth, setShownMonth] = useState(currentMonth)
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const totals = useMemo(() => dailyTotals(entries, shownMonth), [entries, shownMonth])
  const monthStats = getMonthStats(entries, shownMonth)
  const dayCount = daysInMonthKey(shownMonth)
  const firstWeekday = parseDateKey(`${shownMonth}-01`).getDay()
  const selectedEntries = entries.filter((entry) => entry.date === selectedDate)

  const changeMonth = (amount: number) => {
    const next = shiftMonth(shownMonth, amount)
    if (next > currentMonth) return
    setShownMonth(next)
    setSelectedDate(next === currentMonth ? todayKey() : `${next}-01`)
  }

  return (
    <section className="view" aria-labelledby="calendar-title">
      <div className="section-heading">
        <div><span className="eyebrow">The game tape</span><h2 id="calendar-title">Calendar</h2></div>
        <StarIcon className="heading-star" />
      </div>

      <article className="calendar-card">
        <div className="month-switcher">
          <button className="icon-button" onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronIcon direction="left" /></button>
          <strong>{formatMonth(shownMonth)}</strong>
          <button className="icon-button" onClick={() => changeMonth(1)} disabled={shownMonth === currentMonth} aria-label="Next month"><ChevronIcon /></button>
        </div>
        <div className="weekday-row">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
        <div className="calendar-grid">
          {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}
          {Array.from({ length: dayCount }, (_, index) => {
            const day = index + 1
            const date = dateKeyForDay(shownMonth, day)
            const count = totals[date] ?? 0
            const isFuture = date > todayKey()
            const isRestDay = isSunday(date)
            const isHigh = !isRestDay && count >= monthStats.highOutputTarget
            return (
              <button
                key={date}
                className={`calendar-day ${selectedDate === date ? 'selected' : ''} ${isHigh ? 'high-output' : ''} ${isRestDay ? 'rest-day' : ''}`}
                onClick={() => setSelectedDate(date)}
                disabled={isFuture}
                aria-label={`${formatDay(date)}, ${isRestDay ? 'rest day, ' : ''}${count} push-ups`}
              >
                <span>{day}</span>
                {isHigh && <StarIcon />}
                <strong>{count || (isRestDay ? 'REST' : '—')}</strong>
              </button>
            )
          })}
        </div>
        <div className="calendar-legend"><StarIcon /> Star day: {monthStats.highOutputTarget}+ reps · Sundays rest</div>
      </article>

      <article className="list-card">
        <div className="card-heading">
          <div><span className="eyebrow">Selected day</span><h3>{formatDay(selectedDate)}</h3></div>
          {selectedDate <= todayKey() && <button className="text-button" onClick={() => onBackdate(selectedDate)}>+ Add reps</button>}
        </div>
        <EntryList entries={selectedEntries} onEdit={onEdit} onDelete={onDelete} />
      </article>
    </section>
  )
}
