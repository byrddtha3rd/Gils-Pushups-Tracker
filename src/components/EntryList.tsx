import type { PushUpEntry } from '../types'
import { formatDay } from '../lib/date'
import { EditIcon, TrashIcon } from './Icons'

interface EntryListProps {
  entries: PushUpEntry[]
  onEdit: (entry: PushUpEntry) => void
  onDelete: (entry: PushUpEntry) => void
  showDate?: boolean
}

export function EntryList({ entries, onEdit, onDelete, showDate = false }: EntryListProps) {
  if (!entries.length) return <p className="empty-state">No reps logged here yet.</p>

  return (
    <div className="entry-list">
      {[...entries]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((entry) => (
          <div className="entry-row" key={entry.id}>
            <div>
              <strong>{entry.count.toLocaleString()} reps</strong>
              <span>{showDate ? formatDay(entry.date) : new Date(entry.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            <div className="entry-actions">
              <button className="icon-button" onClick={() => onEdit(entry)} aria-label={`Edit ${entry.count} rep entry`}>
                <EditIcon />
              </button>
              <button className="icon-button danger" onClick={() => onDelete(entry)} aria-label={`Delete ${entry.count} rep entry`}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}
