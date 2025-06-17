'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Task {
  id: number
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  category: string
  status: 'pending' | 'completed'
  due_date: string | null
  completed_at: string | null
}

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching tasks:', error.message)
    } else {
      setTasks(data as Task[])
    }

    setLoading(false)
  }

  const toggleTaskStatus = async (task: Task) => {
    const isCompleted = task.status === 'completed'
    const { error } = await supabase
      .from('tasks')
      .update({
        status: isCompleted ? 'pending' : 'completed',
        completed_at: isCompleted ? null : new Date().toISOString(),
      })
      .eq('id', task.id)

    if (error) {
      console.error('Error updating task:', error.message)
    } else {
      fetchTasks() // or update state manually for better UX
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Task Manager</h1>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-4 rounded-md border shadow-sm ${
                task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleTaskStatus(task)}
                    className="mr-2"
                  />
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                </div>
                <span className="text-sm text-gray-700">{task.status}</span>
              </div>

              {task.description && (
                <p className="text-sm text-gray-700 mb-1">{task.description}</p>
              )}

              <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                <p>
                  <strong>Category:</strong> {task.category}
                </p>
                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>
                <p>
                  <strong>Due:</strong> {formatDate(task.due_date)}
                </p>
                <p>
                  <strong>Completed At:</strong>{' '}
                  {formatDate(task.completed_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
