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

    if (response.status === 404) {
      return NextResponse.json(
        { valido: false, mensaje: 'DNI no encontrado. Revisá el DNI ingresado.' },
        { status: 200 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { valido: false, mensaje: 'Error al validar. Intentá de nuevo.' },
        { status: 200 }
      );
    }

    const json = await response.json();
    const valido = json.token === secreto;

    if (!valido) {
      return NextResponse.json(
        { valido: false, mensaje: 'Palabra secreta incorrecta.' },
        { status: 200 }
      );
    }

    return NextResponse.json({ valido });
  } catch (error) {
    console.error('Error validating secreto:', error);
    return NextResponse.json(
      { valido: false, mensaje: 'Error al validar secreto' },
      { status: 500 }
    );
  }
}