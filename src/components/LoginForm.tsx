'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface LoginFormProps {
  onLogin: (dni: string, secreto: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [step, setStep] = useState(1);
  const [dni, setDni] = useState('');
  const [secreto, setSecreto] = useState('');

  const handleNext = () => {
    if (!secreto.trim()) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!dni.trim()) return;
    await onLogin(dni.trim(), secreto.trim());
  };

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Dólar Blue Hoy</CardTitle>
        {step === 1 ? (
          <CardDescription>Ingresa tu Palabra Secreta</CardDescription>
        ) : (
          <CardDescription>Ingresa tu DNI</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm" role="alert">
            {error}
          </div>
        )}
        {step === 1 ? (
          <div className="space-y-4">
            <Input
              label="Palabra Secreta"
              type="password"
              value={secreto}
              onChange={(e) => setSecreto(e.target.value)}
              placeholder="Ingresa tu palabra secreta"
              disabled={isLoading}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
            />
            <Button onClick={handleNext} className="w-full" size="lg" disabled={!secreto.trim()}>
              Siguiente
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <Input
              label="DNI"
              type="text"
              inputMode="numeric"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ej: 12345678"
              disabled={isLoading}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && dni.trim()) handleSubmit(); }}
            />
            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="ghost" disabled={isLoading}>
                Atrás
              </Button>
              <Button onClick={handleSubmit} className="flex-1" size="lg" loading={isLoading} disabled={!dni.trim()}>
                Ver cotización
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}