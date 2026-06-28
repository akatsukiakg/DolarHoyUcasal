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

    const moduleResponse = await fetch('https://desarrollo-aplicaciones.vercel.app/2024/code/validar-secreto.js', {
      headers: { 'Accept': 'application/javascript' },
    });

    if (!moduleResponse.ok) {
      throw new Error('Error loading validarSecreto module');
    }

    const moduleCode = await moduleResponse.text();
    
    const vm = await import('vm');
    const context = {
      fetch,
      console,
      module: { exports: {} },
      exports: {},
      require: (id: string) => {
        if (id === 'node:fetch') return fetch;
        throw new Error(`Module ${id} not found`);
      },
    };
    
    const script = new vm.Script(`
      ${moduleCode}
      return { validarSecreto };
    `);
    
    const result = script.runInNewContext(context);
    const { validarSecreto } = result;
    
    const valido = await validarSecreto(dni, secreto);
    
    return NextResponse.json({ valido });
  } catch (error) {
    console.error('Error validating secreto:', error);
    return NextResponse.json(
      { valido: false, mensaje: 'Error al validar secreto' },
      { status: 500 }
    );
  }
}