export interface DolarBlueResponse {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface ValidarSecretoResponse {
  valido: boolean;
  mensaje?: string;
}

export async function fetchDolarBlue(): Promise<DolarBlueResponse> {
  const response = await fetch('https://dolarapi.com/v1/dolares/blue', {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Error fetching dolar blue: ${response.statusText}`);
  }

  return response.json();
}

export async function validarSecretoAPI(dni: string, secreto: string): Promise<ValidarSecretoResponse> {
  const response = await fetch('https://desarrollo-aplicaciones.vercel.app/2024/code/validar-secreto.js', {
    method: 'GET',
    headers: {
      'Accept': 'application/javascript',
    },
  });

  if (!response.ok) {
    throw new Error(`Error loading validarSecreto module: ${response.statusText}`);
  }

  const moduleCode = await response.text();
  
  const func = new Function('module', 'exports', 'require', '__dirname', '__filename', moduleCode + '; return { validarSecreto };');
  const { validarSecreto } = func({}, {}, () => {}, '', '');
  
  return await validarSecreto(dni, secreto);
}

export async function obtenerJsonAPI(url: string): Promise<unknown> {
  const response = await fetch('https://desarrollo-aplicaciones.vercel.app/2024/code/obtener-json.js', {
    method: 'GET',
    headers: {
      'Accept': 'application/javascript',
    },
  });

  if (!response.ok) {
    throw new Error(`Error loading obtenerJson module: ${response.statusText}`);
  }

  const moduleCode = await response.text();
  
  const func = new Function('module', 'exports', 'require', '__dirname', '__filename', moduleCode + '; return { obtenerJson };');
  const { obtenerJson } = func({}, {}, () => {}, '', '');
  
  return await obtenerJson(url);
}