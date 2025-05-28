"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { Task } from "@/app/page"
import { TrendingUp, PieChartIcon } from "lucide-react"

interface TaskChartProps {
  tasks: Task[]
}

// Helper to check if two dates are the same day
function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function TaskChart({ tasks }: TaskChartProps) {
  // Prepare last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const dailyData = last7Days.map((date) => {
    const created = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      return isSameDay(taskDate, date)
    }).length

    const completed = tasks.filter((task) => {
      if (!task.completedAt) return false
      const completedDate = new Date(task.completedAt)
      return isSameDay(completedDate, date)
    }).length

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      created,
      completed,
    }
  })

  const priorityData = [
    {
      name: "High",
      value: tasks.filter((t) => t.priority === "high").length,
      color: "#ef4444",
      gradient: "from-red-500 to-pink-500",
    },
    {
      name: "Medium",
      value: tasks.filter((t) => t.priority === "medium").length,
      color: "#f59e0b",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      name: "Low",
      value: tasks.filter((t) => t.priority === "low").length,
      color: "#10b981",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <>
      {/* Task Activity Chart */}
      {/* <Card className="transition-all duration-300 hover:shadow-2xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-5" />
        <CardHeader className="relative">
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Task Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dailyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:opacity-20" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "hsl(var(--card-foreground))",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
                }}
              />
              <Bar dataKey="created" fill="url(#createdGradient)" name="Created" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="url(#completedGradient)" name="Completed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* Priority Distribution Chart */}
      <Card className="transition-all duration-300 hover:shadow-2xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 opacity-5" />
        <CardHeader className="relative">
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg">
              <PieChartIcon className="w-4 h-4 text-white" />
            </div>
            Priority Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                {priorityData.map((entry, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "hsl(var(--card-foreground))",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {priorityData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.gradient} shadow-lg`} />
                <span className="text-sm font-medium text-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
