"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Calendar } from "lucide-react"
import type { Task } from "@/app/page"

interface TaskListProps {
  tasks: Task[]
  onToggleStatus: (id: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({ tasks, onToggleStatus, onEditTask, onDeleteTask }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const isOverdue = (task: Task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status === "pending"
  }

  if (tasks.length === 0) {
    return (
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-6 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">Create your first task to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Tasks ({tasks.length})
            {tasks.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {tasks.filter((t) => t.status === "completed").length} completed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-start space-x-4 p-4 border rounded-xl transition-all duration-200 hover:shadow-md ${
                task.status === "completed" ? "bg-muted/30 border-muted" : "bg-background hover:bg-muted/20"
              } ${isOverdue(task) ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20" : ""}`}
            >
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={() => onToggleStatus(task.id)}
                className="mt-1 transition-all duration-200"
              />

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <h3
                    className={`font-medium transition-all duration-200 ${
                      task.status === "completed" ? "line-through text-muted-foreground" : "group-hover:text-foreground"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTask(task)}
                      className="h-8 w-8 p-0 hover:bg-muted"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
                )}

                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <Badge variant={getPriorityColor(task.priority)} className="text-xs font-medium">
                    {task.priority} priority
                  </Badge>

                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>

                  {task.dueDate && (
                    <Badge variant={isOverdue(task) ? "destructive" : "outline"} className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(task.dueDate)}
                      {isOverdue(task) && " (Overdue)"}
                    </Badge>
                  )}

                  {task.status === "completed" && task.completedAt && (
                    <Badge variant="secondary" className="text-xs">
                      Completed {formatDate(task.completedAt)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
