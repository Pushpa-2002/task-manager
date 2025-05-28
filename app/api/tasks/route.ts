import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET all tasks
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error("GET /api/tasks error:", error.message, error.stack)
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 })
  }
}

// POST a new task
export async function POST(req: NextRequest) {
  try {
    const { title, description, priority, category, status, dueDate } = await req.json()

    // Validate required fields
    if (!title || !priority || !category || !status) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const result = await pool.query(
      `
        INSERT INTO tasks (title, description, priority, category, status, created_at, due_date)
        VALUES ($1, $2, $3, $4, $5, NOW(), $6)
        RETURNING *
      `,
      [
        title,
        description,
        priority,
        category,
        status,
        dueDate ? new Date(dueDate) : null,
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error("POST /api/tasks error:", error.message, error.stack)
    return new NextResponse("Internal Server Error: " + error.message, { status: 500 })
  }
}
