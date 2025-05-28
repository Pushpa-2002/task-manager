"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/app/page"

interface TaskFormProps {
  task?: Task | null
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    // 🔁 Save task to DB here (via API call)
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
      headers: { "Content-Type": "application/json" },
    })

    // ✅ Close the dialog after creation
    setIsDialogOpen(false)
  }

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    category: task?.category || "General",
    status: task?.status || "pending",
    dueDate: task?.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority as "low" | "medium" | "high",
      category: formData.category,
      status: formData.status as "pending" | "completed",
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    });

    // Optionally reset form if you want
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "General",
      status: "pending",
      dueDate: "",
    });

    // Close the dialog/modal
    onCancel();
  }

  const categories = ["General", "Work", "Personal", "Shopping", "Health", "Finance", "Education", "Travel"]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: "low" | "medium" | "high") =>
              setFormData((prev) => ({ ...prev, priority: value }))
            }
            name="priority"
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value:"pending" | "completed") => setFormData((prev) => ({ ...prev, status: value }))
         } name ="status"
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
      </div>
    </form>
  )
}
