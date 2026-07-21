import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const query = `
      SELECT id, project_name, brand_inputs, tokens, created_at
      FROM design_systems
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      projects: result.rows,
    });
  } catch (error: unknown) {
    console.error("Error al obtener proyectos de PostgreSQL:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
