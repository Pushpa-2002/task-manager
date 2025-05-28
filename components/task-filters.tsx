"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/app/page"
import { Button } from "@/components/ui/button"

interface TaskFiltersProps {
  filters: {
    status: string
    priority: string
    category: string
  }
  onFiltersChange: (filters: any) => void
  tasks: Task[]
}

export function TaskFilters({ filters, onFiltersChange, tasks }: TaskFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  // Get unique categories from tasks
  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  const getFilterCounts = () => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    }
  }

  const counts = getFilterCounts()

  return (
    <Card className="transition-all duration-200 hover:shadow-lg sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Filters
          {(filters.status !== "all" || filters.priority !== "all" || filters.category !== "all") && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Status</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger className="transition-all duration-200 hover:bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center justify-between">
                <span>All Tasks</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {counts.all}
                </Badge>
              </SelectItem>
              <SelectItem value="pending" className="flex items-center justify-between">
                <span>Pending</span>
                <Badge
                  variant="outline"
                  className="ml-2 text-xs border-yellow-500 text-yellow-700 dark:text-yellow-300"
                >
                  {counts.pending}
                </Badge>
              </SelectItem>
              <SelectItem value="completed" className="flex items-center justify-between">
                <span>Completed</span>
                <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-700 dark:text-green-300">
                  {counts.completed}
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Priority</Label>
          <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
            <SelectTrigger className="transition-all duration-200 hover:bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high" className="flex items-center justify-between">
                <span>High Priority</span>
                <Badge variant="destructive" className="ml-2 text-xs">
                  {counts.high}
                </Badge>
              </SelectItem>
              <SelectItem value="medium" className="flex items-center justify-between">
                <span>Medium Priority</span>
                <Badge variant="default" className="ml-2 text-xs">
                  {counts.medium}
                </Badge>
              </SelectItem>
              <SelectItem value="low" className="flex items-center justify-between">
                <span>Low Priority</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {counts.low}
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger className="transition-all duration-200 hover:bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(filters.status !== "all" || filters.priority !== "all" || filters.category !== "all") && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ status: "all", priority: "all", category: "all" })}
              className="w-full transition-all duration-200 hover:bg-muted"
            >
              Clear all filters
            </Button>
          </div>
        )}

        <div className="pt-4 border-t space-y-3">
          <Label className="text-sm font-medium">Quick Stats</Label>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tasks</span>
              <span className="font-medium">{counts.all}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium">
                {counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
