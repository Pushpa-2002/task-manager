import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { title, description, priority, category, dueDate, status } = body
  const completedAt = status === "completed" ? new Date() : null

  const res = await query(
    `UPDATE tasks
     SET title = $1, description = $2, priority = $3, category = $4, due_date = $5, status = $6, completed_at = $7
     WHERE id = $8 RETURNING *`,
    [title, description, priority, category, dueDate, status, completedAt, params.id]
  )
  return NextResponse.json(res.rows[0])
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await query(`DELETE FROM tasks WHERE id = $1`, [params.id])
  return new Response(null, { status: 204 })
}
