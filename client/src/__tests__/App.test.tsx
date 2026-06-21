import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from '../App'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  ))
})

describe('App', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByText('Todo App')).toBeInTheDocument()
  })

  it('renders the input and add button', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('adds a todo when form is submitted', async () => {
    const newTodo = { _id: '1', title: 'Buy milk', completed: false }
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(newTodo) })
    )

    render(<App />)
    await userEvent.type(screen.getByPlaceholderText('Add a new todo...'), 'Buy milk')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(await screen.findByText('Buy milk')).toBeInTheDocument()
  })
})
