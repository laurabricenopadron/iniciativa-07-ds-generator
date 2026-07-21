import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project_name, brand_inputs, tokens } = body;

    if (!project_name || typeof project_name !== "string" || !project_name.trim()) {
      return NextResponse.json(
        { success: false, error: "El nombre del proyecto es obligatorio." },
        { status: 400 }
      );
    }

    if (!brand_inputs || !tokens) {
      return NextResponse.json(
        { success: false, error: "Faltan datos de marca o tokens de diseño." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO design_systems (project_name, brand_inputs, tokens)
      VALUES ($1, $2, $3)
      RETURNING id, created_at;
    `;

    const values = [
      project_name.trim(),
      JSON.stringify(brand_inputs),
      JSON.stringify(tokens),
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      created_at: result.rows[0].created_at,
    });
  } catch (error: unknown) {
    console.error("Error al guardar el sistema de diseño en PostgreSQL:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
