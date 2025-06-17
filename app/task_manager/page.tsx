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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editedTask, setEditedTask] = useState<Partial<Task>>({})
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
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
      fetchTasks()
    }
  }

  const deleteTask = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this task?')
    if (!confirmDelete) return

    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      console.error('Error deleting task:', error.message)
    } else {
      fetchTasks()
    }
  }

  const updateTask = async () => {
    if (!editingTaskId) return

    const { error } = await supabase
      .from('tasks')
      .update(editedTask)
      .eq('id', editingTaskId)

    if (error) {
      console.error('Error updating task:', error.message)
    } else {
      setEditingTaskId(null)
      setEditedTask({})
      fetchTasks()
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

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Categories</option>
          {[...new Set(tasks.map((t) => t.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks
            .filter((task) =>
              filterStatus === 'all' ? true : task.status === filterStatus
            )
            .filter((task) =>
              filterCategory === 'all' ? true : task.category === filterCategory
            )
            .map((task) => (
              <li
                key={task.id}
                className={`p-4 rounded-md border shadow-sm ${
                  task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-50'
                }`}
              >
                {/* Checkbox & Title */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleTaskStatus(task)}
                      className="mr-2"
                    />
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editedTask.title || ''}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            title: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      <h2 className="text-lg font-semibold">{task.title}</h2>
                    )}
                  </div>

                  {/* Edit / Delete Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id)
                        setEditedTask(task)
                      }}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Description */}
                {task.description && editingTaskId !== task.id && (
                  <p className="text-sm text-gray-700 mb-1">
                    {task.description}
                  </p>
                )}

                {/* Fields */}
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                  <p>
                    <strong>Category:</strong>{' '}
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editedTask.category || ''}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            category: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      task.category
                    )}
                  </p>
                  <p>
                    <strong>Priority:</strong>{' '}
                    {editingTaskId === task.id ? (
                      <select
                        value={editedTask.priority || 'low'}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            priority: e.target.value as Task['priority'],
                          })
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      task.priority
                    )}
                  </p>
                  <p>
                    <strong>Due:</strong> {formatDate(task.due_date)}
                  </p>
                  <p>
                    <strong>Completed At:</strong>{' '}
                    {formatDate(task.completed_at)}
                  </p>
                </div>

                {/* Save / Cancel buttons */}
                {editingTaskId === task.id && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={updateTask}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="bg-gray-300 text-black px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
