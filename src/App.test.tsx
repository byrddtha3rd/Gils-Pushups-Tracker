import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('core logging flow', () => {
  beforeEach(() => localStorage.clear())

  it('quick-adds, edits, and deletes an entry', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Log Push-Ups' }))
    await user.click(screen.getByRole('button', { name: 'Add 25 push-ups' }))
    expect(screen.getByText('25 reps')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit 25 rep entry' }))
    const reps = screen.getByLabelText('Reps')
    await user.clear(reps)
    await user.type(reps, '40')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByText('40 reps')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete 40 rep entry' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.queryByText('40 reps')).not.toBeInTheDocument()
    expect(screen.getByText('40 reps deleted')).toBeInTheDocument()
  })

  it('opens calendar and stats views from the bottom navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Calendar' }))
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Stats' }))
    expect(screen.getByRole('heading', { name: 'Stats & archive' })).toBeInTheDocument()
  })
})
