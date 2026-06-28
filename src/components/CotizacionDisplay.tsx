'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

interface CotizacionData {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

interface CotizacionDisplayProps {
  data: CotizacionData;
  onRefresh: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export function CotizacionDisplay({ data, onRefresh, onLogout, isLoading }: CotizacionDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const promedio = ((data.compra + data.venta) / 2).toFixed(2);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card variant="elevated" padding="lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <span className="text-green-600 dark:text-green-400">💵</span>
            {data.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">COMPRA</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{formatCurrency(data.compra)}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">VENTA</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{formatCurrency(data.venta)}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-center">
            <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">PROMEDIO</p>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{formatCurrency(Number(promedio))}</p>
          </div>
          <div className="pt-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <p>Actualizado: <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(data.fechaActualizacion)}</span></p>
            <p className="text-xs mt-1">Fuente: dolarapi.com</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={onRefresh} variant="outline" className="w-full" loading={isLoading}>
            Actualizar Cotización
          </Button>
          <Button onClick={onLogout} variant="ghost" className="w-full text-red-600 hover:text-red-700 dark:text-red-400">
            Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}