"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertTriangle, Calendar, TrendingUp, Target, Zap } from "lucide-react"
import type { Task } from "@/app/page"
import { TaskChart } from "@/components/task-chart"
import { ProductivityInsights } from "@/components/productivity-insights"

interface TaskDashboardProps {
  tasks: Task[]
}

export function TaskDashboard({ tasks }: TaskDashboardProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && task.status === "pending").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get overdue tasks
  const overdueTasks = tasks.filter(
    (task) => task.status === "pending" && task.dueDate && new Date(task.dueDate) < new Date(),
  ).length

  // Get tasks due today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tasksDueToday = tasks.filter(
    (task) =>
      task.status === "pending" && task.dueDate && new Date(task.dueDate) >= today && new Date(task.dueDate) < tomorrow,
  ).length

  // Calculate productivity metrics
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)

  const tasksCompletedThisWeek = tasks.filter(
    (task) => task.status === "completed" && task.completedAt && task.completedAt >= last7Days,
  ).length

  const averageTasksPerDay = tasksCompletedThisWeek / 7

  // Priority distribution
  const priorityStats = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  }

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
      change: "-5%",
      changeType: "negative" as const,
    },
    {
      title: "High Priority",
      value: highPriorityTasks,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/50",
      change: "+3%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
            <div className={`absolute inset-0 ${stat.bgColor} opacity-50`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp
                  className={`w-3 h-3 mr-1 ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"}`}
                />
                <span className={stat.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress and Insights Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Weekly Productivity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{tasksCompletedThisWeek}</div>
            <div className="text-sm text-muted-foreground">{averageTasksPerDay.toFixed(1)} tasks per day average</div>
            <Progress value={(tasksCompletedThisWeek / Math.max(totalTasks, 1)) * 100} className="h-3" />
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>High Priority</span>
                <span className="font-medium">{priorityStats.high}</span>
              </div>
              <Progress value={(priorityStats.high / Math.max(totalTasks, 1)) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medium Priority</span>
                <span className="font-medium">{priorityStats.medium}</span>
              </div>
              <Progress value={(priorityStats.medium / Math.max(totalTasks, 1)) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Low Priority</span>
                <span className="font-medium">{priorityStats.low}</span>
              </div>
              <Progress value={(priorityStats.low / Math.max(totalTasks, 1)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={`transition-all duration-200 hover:shadow-lg ${tasksDueToday > 0 ? "border-yellow-200 dark:border-yellow-800" : ""}`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksDueToday}</div>
            {tasksDueToday > 0 && (
              <Badge variant="outline" className="mt-2 border-yellow-500 text-yellow-700 dark:text-yellow-300">
                Needs attention
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-200 hover:shadow-lg ${overdueTasks > 0 ? "border-red-200 dark:border-red-800" : ""}`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueTasks}</div>
            {overdueTasks > 0 && (
              <Badge variant="destructive" className="mt-2">
                Action required
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{tasksCompletedThisWeek}</div>
            <Badge variant="outline" className="mt-2 border-green-500 text-green-700 dark:text-green-300">
              Tasks completed
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TaskChart tasks={tasks} />
        <ProductivityInsights tasks={tasks} />
      </div>
    </div>
  )
}
