import { useState, useEffect } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface Todo {
  _id: string
  title: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    fetch(`${API}/api/todos`)
      .then((r) => r.json())
      .then(setTodos)
  }, [])

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const res = await fetch(`${API}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input.trim() }),
    })
    const todo = await res.json()
    setTodos([todo, ...todos])
    setInput('')
  }

  const toggleTodo = async (todo: Todo) => {
    const res = await fetch(`${API}/api/todos/${todo._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    const updated = await res.json()
    setTodos(todos.map((t) => (t._id === updated._id ? updated : t)))
  }

  const deleteTodo = async (id: string) => {
    await fetch(`${API}/api/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter((t) => t._id !== id))
  }

  return (
    <div className="container">
      <h1>Todo App</h1>

      <form onSubmit={addTodo} className="add-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'done' : ''}>
            <span onClick={() => toggleTodo(todo)}>{todo.title}</span>
            <button onClick={() => deleteTodo(todo._id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
