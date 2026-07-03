import type { MonthStats } from '../types'
import { formatMonth } from '../lib/date'
import { FlameIcon, PlusIcon, StarIcon } from '../components/Icons'
import { ProgressRing } from '../components/ProgressRing'

interface DashboardViewProps {
  stats: MonthStats
  streaks: { current: number; best: number }
  todayTotal: number
  onLog: () => void
}

const motivationFor = (stats: MonthStats): string => {
  if (stats.percent >= 100) return 'Goal line crossed. You’re built for this.'
  if (stats.percent >= 75) return 'Fourth quarter push.'
  if (stats.status === 'Ahead of Pace') return 'Game day energy.'
  if (stats.status === 'Behind Pace') return 'Keep stacking reps.'
  return '10K is coming.'
}

export function DashboardView({ stats, streaks, todayTotal, onLog }: DashboardViewProps) {
  return (
    <section className="view dashboard-view" aria-labelledby="dashboard-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{formatMonth(stats.month)}</span>
          <h2 id="dashboard-title">Monthly drive</h2>
        </div>
        <span className={`pace-pill ${stats.status.toLowerCase().replaceAll(' ', '-')}`}>{stats.status}</span>
      </div>

      <article className="hero-card">
        <div className="hero-star" aria-hidden="true"><StarIcon /></div>
        <ProgressRing percent={stats.percent} total={stats.total} />
        <div className="hero-stats">
          <div><span>Remaining</span><strong>{stats.remaining.toLocaleString()}</strong></div>
          <div><span>Per workout day</span><strong>{stats.neededPerDay.toLocaleString()}</strong></div>
        </div>
      </article>

      <button className="primary-button log-cta" onClick={onLog}>
        <PlusIcon /> Log Push-Ups
      </button>

      <div className="motivation-card">
        <StarIcon />
        <div><span>Locker room note</span><strong>{motivationFor(stats)}</strong></div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <FlameIcon />
          <span>Current streak</span>
          <strong>{streaks.current} <small>days</small></strong>
        </article>
        <article className="metric-card">
          <StarIcon />
          <span>Best streak</span>
          <strong>{streaks.best} <small>days</small></strong>
        </article>
        <article className="metric-card wide">
          <div><span>Today’s total</span><strong>{todayTotal.toLocaleString()} <small>reps</small></strong></div>
          <div className="mini-field"><i style={{ width: `${Math.min(100, (todayTotal / stats.highOutputTarget) * 100)}%` }} /></div>
          <small>{Math.max(0, stats.highOutputTarget - todayTotal)} to today’s star mark</small>
        </article>
      </div>
    </section>
  )
}
