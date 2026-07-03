import type { MonthStats, PushUpEntry } from '../types'
import { formatDay, formatMonth, monthKey, todayKey } from '../lib/date'
import { getAllTimeTotal, monthSummaries } from '../lib/stats'
import { ChartIcon, FlameIcon, StarIcon } from '../components/Icons'

interface StatsViewProps {
  entries: PushUpEntry[]
  stats: MonthStats
  streaks: { current: number; best: number }
}

export function StatsView({ entries, stats, streaks }: StatsViewProps) {
  const summaries = monthSummaries(entries)
  const currentMonth = monthKey(todayKey())
  const pastMonths = summaries.filter((summary) => summary.month < currentMonth)
  const bestMonth = summaries.reduce<(typeof summaries)[number] | null>(
    (best, item) => (!best || item.total > best.total ? item : best),
    null,
  )

  const cards = [
    { label: 'Best day', value: stats.bestDay ? stats.bestDay.count.toLocaleString() : '—', detail: stats.bestDay ? formatDay(stats.bestDay.date) : 'No reps yet', icon: StarIcon },
    { label: 'Daily average', value: Math.round(stats.averagePerDay).toLocaleString(), detail: 'Workout days', icon: ChartIcon },
    { label: 'All-time reps', value: getAllTimeTotal(entries).toLocaleString(), detail: 'Every month', icon: StarIcon },
    { label: 'Active days', value: stats.activeDays.toString(), detail: 'This month', icon: FlameIcon },
    { label: 'Days missed', value: stats.missedDays.toString(), detail: 'Completed days', icon: ChartIcon },
    { label: 'Projected total', value: stats.projectedTotal.toLocaleString(), detail: 'At current pace', icon: StarIcon },
  ]

  return (
    <section className="view" aria-labelledby="stats-title">
      <div className="section-heading">
        <div><span className="eyebrow">Season numbers</span><h2 id="stats-title">Stats & archive</h2></div>
        <StarIcon className="heading-star" />
      </div>

      <div className="stats-grid">
        {cards.map(({ label, value, detail, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <Icon /><span>{label}</span><strong>{value}</strong><small>{detail}</small>
          </article>
        ))}
      </div>

      <article className="record-card">
        <div className="record-mark"><StarIcon /></div>
        <div><span>Best month ever</span><strong>{bestMonth ? bestMonth.total.toLocaleString() : 'No record yet'}</strong><small>{bestMonth ? formatMonth(bestMonth.month) : 'Your first rep starts it.'}</small></div>
      </article>

      <article className="list-card archive-card">
        <div className="card-heading"><h3>Monthly archive</h3><span>{pastMonths.length}</span></div>
        {pastMonths.length ? pastMonths.map((month) => (
          <div className="archive-row" key={month.month}>
            <div><strong>{formatMonth(month.month)}</strong><span>{Math.min(100, (month.total / 10_000) * 100).toFixed(0)}% of goal</span></div>
            <strong>{month.total.toLocaleString()}</strong>
          </div>
        )) : <p className="empty-state">Completed months will line up here.</p>}
      </article>

      <p className="best-streak-note"><FlameIcon /> All-time best streak: <strong>{streaks.best} days</strong></p>
    </section>
  )
}
