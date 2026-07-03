import { useMemo, useState } from 'react'
import type { PushUpEntry } from '../types'
import { formatDay, isSunday, todayKey } from '../lib/date'
import { dailyTotals } from '../lib/stats'
import { EntryList } from '../components/EntryList'
import { PlusIcon, StarIcon } from '../components/Icons'

interface LogViewProps {
  entries: PushUpEntry[]
  initialDate?: string
  onAdd: (count: number, date: string) => void
  onEdit: (entry: PushUpEntry) => void
  onDelete: (entry: PushUpEntry) => void
}

export function LogView({ entries, initialDate = todayKey(), onAdd, onEdit, onDelete }: LogViewProps) {
  const [date, setDate] = useState(initialDate)
  const [custom, setCustom] = useState('')
  const totals = useMemo(() => dailyTotals(entries), [entries])
  const selectedEntries = entries.filter((entry) => entry.date === date)

  const submitCustom = (event: React.FormEvent) => {
    event.preventDefault()
    const count = Number(custom)
    if (Number.isInteger(count) && count > 0) {
      onAdd(count, date)
      setCustom('')
    }
  }

  return (
    <section className="view" aria-labelledby="log-title">
      <div className="section-heading">
        <div><span className="eyebrow">Add to the board</span><h2 id="log-title">Log push-ups</h2></div>
        <StarIcon className="heading-star" />
      </div>

      <article className="log-card">
        <label className="field-label" htmlFor="log-date">Workout date</label>
        <input id="log-date" className="date-input" type="date" max={todayKey()} value={date} onChange={(event) => setDate(event.target.value)} />

        {isSunday(date) && (
          <div className="rest-note">
            <StarIcon />
            <div><strong>Sunday rest day</strong><span>Optional reps count toward 10K, but Sunday never affects pace or streaks.</span></div>
          </div>
        )}

        <div className="selected-total">
          <span>{isSunday(date) ? 'Rest-day bonus' : date === todayKey() ? 'Today' : formatDay(date)}</span>
          <strong>{(totals[date] ?? 0).toLocaleString()} <small>reps</small></strong>
        </div>

        <span className="field-label">Quick add</span>
        <div className="quick-grid">
          {[25, 50, 100, 200].map((count) => (
            <button
              key={count}
              className="quick-button"
              onClick={() => onAdd(count, date)}
              aria-label={`Add ${count} push-ups`}
            >
              <PlusIcon />{count}
            </button>
          ))}
        </div>

        <form className="custom-form" onSubmit={submitCustom}>
          <label className="field-label" htmlFor="custom-count">Custom amount</label>
          <div>
            <input id="custom-count" inputMode="numeric" pattern="[0-9]*" min="1" step="1" type="number" placeholder="Enter reps" value={custom} onChange={(event) => setCustom(event.target.value)} />
            <button className="primary-button" type="submit" disabled={!custom}>Add reps</button>
          </div>
        </form>
      </article>

      <article className="list-card">
        <div className="card-heading"><h3>{date === todayKey() ? 'Today’s entries' : `${formatDay(date)} entries`}</h3><span>{selectedEntries.length}</span></div>
        <EntryList entries={selectedEntries} onEdit={onEdit} onDelete={onDelete} />
      </article>
    </section>
  )
}
