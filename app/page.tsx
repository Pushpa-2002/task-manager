"use client"

import { useState, useEffect } from "react"
import { TaskDashboard } from "@/components/task-dashboard"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { TaskFilters } from "@/components/task-filters"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  category: string
  status: "pending" | "completed"
  createdAt: Date
  dueDate?: Date
  completedAt?: Date
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
  })

 useEffect(() => {
  async function fetchTasks() {
    const res = await fetch('/api/tasks')
    const data: Task[] = await res.json()
    // parse date strings to Date objects:
    const parsedTasks = data.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }))
    setTasks(parsedTasks)
  }
  fetchTasks()
}, [])

  useEffect(() => {
    let filtered = tasks

    if (filters.status !== "all") {
      filtered = filtered.filter((task) => task.status === filters.status)
    }

    if (filters.priority !== "all") {
      filtered = filtered.filter((task) => task.priority === filters.priority)
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((task) => task.category === filters.category)
    }

    setFilteredTasks(filtered)
  }, [tasks, filters])

 const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error("Failed to add task:", res.status, errorText)
    return
  }

  const newTask: Task = await res.json()
  setTasks((prev) => [...prev, {
    ...newTask,
    createdAt: new Date(newTask.createdAt),
    dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
    completedAt: newTask.completedAt ? new Date(newTask.completedAt) : undefined,
  }])
  setIsDialogOpen(false)
}


const updateTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
  if (!editingTask) return

  const res = await fetch(`/api/tasks/${editingTask.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...taskData, status: editingTask.status }),
  })

  if (!res.ok) {
    console.error("Failed to update task:", await res.text())
    return
  }

  const updated = await res.json()

  setTasks((prev) =>
    prev.map((task) =>
      task.id === updated.id
        ? {
            ...task,
            ...updated,
            createdAt: new Date(updated.createdAt || updated.created_at),
            dueDate: updated.dueDate ? new Date(updated.dueDate) : undefined,
            completedAt: updated.completedAt ? new Date(updated.completedAt) : undefined,
          }
        : task
    )
  )

  setEditingTask(null)
  setIsDialogOpen(false)
}


const deleteTask = async (id: string) => {
  // 1. Remove from UI immediately
  setTasks(prev => prev.filter(task => task.id !== id))

  // 2. Send delete request
  try {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" })
  } catch (err) {
    console.error("Failed to delete task:", err)
    // Optional: You can restore the task if needed
  }
}


const toggleTaskStatus = async (id: string) => {
  const task = tasks.find((t) => t.id === id)
  if (!task) return

  const updatedStatus = task.status === "pending" ? "completed" : "pending"

  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...task, status: updatedStatus }),
  })
  const updatedTask = await res.json()

  setTasks((prev) =>
    prev.map((t) =>
      t.id === id
        ? {
            ...updatedTask,
            createdAt: new Date(updatedTask.createdAt),
            dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
            completedAt: updatedTask.completedAt ? new Date(updatedTask.completedAt) : undefined,
          }
        : t
    )
  )
}

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-muted-foreground">Organize and track your tasks with powerful analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTask(null)} size="lg" className="shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                </DialogHeader>
                <TaskForm
                  task={editingTask}
                  onSubmit={editingTask ? updateTask : addTask}
                  onCancel={handleCloseDialog}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <TaskDashboard tasks={tasks} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <TaskFilters filters={filters} onFiltersChange={setFilters} tasks={tasks} />
              </div>
              <div className="lg:col-span-3">
                <TaskList
                  tasks={filteredTasks}
                  onToggleStatus={toggleTaskStatus}
                  onEditTask={handleEditTask}
                  onDeleteTask={deleteTask}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
