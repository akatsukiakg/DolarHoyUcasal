'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { CotizacionDisplay } from '@/components/CotizacionDisplay';
import { Card, CardContent } from '@/components/ui/Card';

interface CotizacionData {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cotizacion, setCotizacion] = useState<CotizacionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('dolar-blue-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchCotizacion();
    }
  }, []);

  const fetchCotizacion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dolar-blue');
      if (!response.ok) {
        throw new Error('Error al obtener la cotización');
      }
      const data = await response.json();
      setCotizacion(data);
    } catch (err) {
      setError('No se pudo cargar la cotización. Intenta nuevamente.');
      console.error('Error fetching cotización:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (dni: string, secreto: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/validar-secreto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, secreto }),
      });
      const result = await response.json();
      if (result.valido) {
        setIsAuthenticated(true);
        localStorage.setItem('dolar-blue-auth', 'true');
        await fetchCotizacion();
      } else {
        setError(result.mensaje || 'Palabra secreta inválida. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al validar. Verifica tu conexión e intenta de nuevo.');
      console.error('Error validating secreto:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCotizacion(null);
    localStorage.removeItem('dolar-blue-auth');
  };

  const handleRefresh = () => {
    fetchCotizacion();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error || undefined} />
        ) : (
          <>
            {cotizacion ? (
              <CotizacionDisplay
                data={cotizacion}
                onRefresh={handleRefresh}
                onLogout={handleLogout}
                isLoading={isLoading}
              />
            ) : (
              <Card variant="elevated" padding="lg" className="text-center">
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">Cargando cotización...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Datos proporcionados por <a href="https://dolarapi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dolarapi.com</a></p>
        <p className="mt-1">Desplegado en <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel</a></p>
      </footer>
    </div>
  );
}