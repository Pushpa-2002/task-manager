"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Award, Clock, Target } from "lucide-react"
import type { Task } from "@/app/page"

interface ProductivityInsightsProps {
  tasks: Task[]
}

export function ProductivityInsights({ tasks }: ProductivityInsightsProps) {
  // Calculate insights
  const completedTasks = tasks.filter((t) => t.status === "completed")
  const pendingTasks = tasks.filter((t) => t.status === "pending")

  // Average completion time (mock data for demo)
  const avgCompletionTime = "2.3 days"

  // Most productive category
  const categoryStats = tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostProductiveCategory = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"

  // Completion streak (mock calculation)
  const completionStreak = 5

  // Weekly comparison
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)

  const tasksThisWeek = tasks.filter((t) => t.completedAt && new Date(t.completedAt) >= thisWeek).length

  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 14)
  const weekBefore = new Date()
  weekBefore.setDate(weekBefore.getDate() - 7)

  const tasksLastWeek = tasks.filter(
    (t) => t.completedAt && new Date(t.completedAt) >= lastWeek && new Date(t.completedAt) < weekBefore,
  ).length

  const weeklyChange = tasksLastWeek > 0 ? (((tasksThisWeek - tasksLastWeek) / tasksLastWeek) * 100).toFixed(1) : "0"

  const isImproving = Number(weeklyChange) > 0

  const insights = [
    {
      title: "Weekly Performance",
      value: `${weeklyChange}%`,
      description: isImproving ? "improvement from last week" : "decrease from last week",
      icon: isImproving ? TrendingUp : TrendingDown,
      color: isImproving ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      bgColor: isImproving ? "bg-green-50 dark:bg-green-950/50" : "bg-red-50 dark:bg-red-950/50",
    },
    {
      title: "Completion Streak",
      value: `${completionStreak} days`,
      description: "consecutive days with completed tasks",
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      title: "Average Completion",
      value: avgCompletionTime,
      description: "average time to complete tasks",
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Top Category",
      value: mostProductiveCategory,
      description: `${categoryStats[mostProductiveCategory] || 0} tasks completed`,
      icon: Target,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
    },
  ]

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Productivity Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {insights.map((insight) => (
          <div key={insight.title} className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${insight.bgColor}`}>
              <insight.icon className={`w-5 h-5 ${insight.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{insight.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {insight.value}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Completion Rate</span>
              <div className="font-medium">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Pending Tasks</span>
              <div className="font-medium">{pendingTasks.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Categories</span>
              <div className="font-medium">{Object.keys(categoryStats).length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">This Week</span>
              <div className="font-medium">{tasksThisWeek} completed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
