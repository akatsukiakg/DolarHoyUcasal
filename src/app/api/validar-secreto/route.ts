import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { dni, secreto } = await request.json();

    if (!dni || !secreto) {
      return NextResponse.json(
        { valido: false, mensaje: 'DNI y secreto son requeridos' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api-desarrollo-aplicaciones.vercel.app/api/alumnos/${dni}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { valido: false, mensaje: 'Error al validar' },
        { status: 200 }
      );
    }

    const json = await response.json();
    const valido = json.token === secreto;

    return NextResponse.json({ valido });
  } catch (error) {
    console.error('Error validating secreto:', error);
    return NextResponse.json(
      { valido: false, mensaje: 'Error al validar secreto' },
      { status: 500 }
    );
  }
}