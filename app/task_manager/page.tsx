// app/components/Tasks.tsx or wherever appropriate
'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // adjust path if needed

interface Task {
  id: number
  title: string
  completed: boolean
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*')
      if (error) {
        console.error('Failed to fetch tasks:', error.message)
      } else {
        setTasks(data as Task[])
      }
      setLoading(false)
    }

    fetchTasks()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-3 rounded-md border ${
                task.completed ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{task.title}</span>
                <span className="text-sm text-gray-600">
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Tasks
