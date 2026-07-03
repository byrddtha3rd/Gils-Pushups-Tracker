import { useEffect, useMemo, useRef, useState } from 'react'
import type { AppTab, PushUpEntry } from './types'
import { useEntries } from './hooks/useEntries'
import { dailyTotals, getMonthStats, getStreaks } from './lib/stats'
import { monthKey, todayKey } from './lib/date'
import { CalendarIcon, ChartIcon, HomeIcon, PlusIcon, StarIcon } from './components/Icons'
import { DashboardView } from './views/DashboardView'
import { LogView } from './views/LogView'
import { CalendarView } from './views/CalendarView'
import { StatsView } from './views/StatsView'
import './styles.css'

const tabs: Array<{ id: AppTab; label: string; icon: typeof HomeIcon }> = [
  { id: 'dashboard', label: 'Home', icon: HomeIcon },
  { id: 'log', label: 'Log', icon: PlusIcon },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'stats', label: 'Stats', icon: ChartIcon },
]

export default function App() {
  const { entries, addEntry, updateEntry, removeEntry, restoreEntry, storageError } = useEntries()
  const [tab, setTab] = useState<AppTab>('dashboard')
  const [editing, setEditing] = useState<PushUpEntry | null>(null)
  const [deleting, setDeleting] = useState<PushUpEntry | null>(null)
  const [undoEntry, setUndoEntry] = useState<PushUpEntry | null>(null)
  const [editCount, setEditCount] = useState('')
  const [editDate, setEditDate] = useState('')
  const [prefillDate, setPrefillDate] = useState(todayKey())
  const undoTimer = useRef<number | null>(null)
  const currentMonth = monthKey(todayKey())
  const stats = useMemo(() => getMonthStats(entries, currentMonth), [entries, currentMonth])
  const streaks = useMemo(() => getStreaks(entries), [entries])
  const totals = useMemo(() => dailyTotals(entries), [entries])

  useEffect(() => () => {
    if (undoTimer.current) window.clearTimeout(undoTimer.current)
  }, [])

  const logEntry = (count: number, date: string) => {
    if (addEntry(count, date)) {
      setUndoEntry(null)
    }
  }

  const openEdit = (entry: PushUpEntry) => {
    setEditing(entry)
    setEditCount(String(entry.count))
    setEditDate(entry.date)
  }

  const saveEdit = (event: React.FormEvent) => {
    event.preventDefault()
    if (editing && updateEntry(editing.id, Number(editCount), editDate)) setEditing(null)
  }

  const confirmDelete = () => {
    if (!deleting) return
    const removed = removeEntry(deleting.id)
    setDeleting(null)
    if (removed) {
      setUndoEntry(removed)
      if (undoTimer.current) window.clearTimeout(undoTimer.current)
      undoTimer.current = window.setTimeout(() => setUndoEntry(null), 5000)
    }
  }

  const backdate = (date: string) => {
    setPrefillDate(date)
    setTab('log')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark"><StarIcon /></div>
        <div><h1>10K Push-Up Tracker</h1><p>Chase the Star. Hit 10K.</p></div>
      </header>

      {storageError && <div className="error-banner" role="alert">Your browser blocked local saving. Check Safari privacy settings.</div>}

      <main>
        {tab === 'dashboard' && <DashboardView stats={stats} streaks={streaks} todayTotal={totals[todayKey()] ?? 0} onLog={() => setTab('log')} />}
        {tab === 'log' && <LogView key={prefillDate} initialDate={prefillDate} entries={entries} onAdd={logEntry} onEdit={openEdit} onDelete={setDeleting} />}
        {tab === 'calendar' && <CalendarView entries={entries} onEdit={openEdit} onDelete={setDeleting} onBackdate={backdate} />}
        {tab === 'stats' && <StatsView entries={entries} stats={stats} streaks={streaks} />}
      </main>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </nav>

      {editing && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title">
            <span className="eyebrow">Adjust the play</span><h2 id="edit-title">Edit entry</h2>
            <form onSubmit={saveEdit}>
              <label>Reps<input autoFocus type="number" min="1" step="1" value={editCount} onChange={(event) => setEditCount(event.target.value)} /></label>
              <label>Date<input type="date" max={todayKey()} value={editDate} onChange={(event) => setEditDate(event.target.value)} /></label>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancel</button><button className="primary-button" type="submit">Save changes</button></div>
            </form>
          </section>
        </div>
      )}

      {deleting && (
        <div className="modal-backdrop">
          <section className="modal compact" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
            <span className="eyebrow danger-text">Remove entry</span><h2 id="delete-title">Delete {deleting.count} reps?</h2>
            <p>This will update your totals and streaks.</p>
            <div className="modal-actions"><button className="secondary-button" onClick={() => setDeleting(null)}>Keep it</button><button className="danger-button" onClick={confirmDelete}>Delete</button></div>
          </section>
        </div>
      )}

      {undoEntry && (
        <div className="toast" role="status"><span>{undoEntry.count} reps deleted</span><button onClick={() => { restoreEntry(undoEntry); setUndoEntry(null) }}>Undo</button></div>
      )}
    </div>
  )
}
