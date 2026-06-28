'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

interface LoginFormProps {
  onLogin: (dni: string, secreto: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [dni, setDni] = useState('');
  const [secreto, setSecreto] = useState('');
  const [dniError, setDniError] = useState('');
  const [secretoError, setSecretoError] = useState('');

  const validateForm = () => {
    let valid = true;
    if (!dni.trim()) {
      setDniError('El DNI es requerido');
      valid = false;
    } else if (!/^\d{7,8}$/.test(dni.trim())) {
      setDniError('El DNI debe tener 7 u 8 dígitos');
      valid = false;
    } else {
      setDniError('');
    }
    if (!secreto.trim()) {
      setSecretoError('La palabra secreta es requerida');
      valid = false;
    } else {
      setSecretoError('');
    }
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onLogin(dni.trim(), secreto.trim());
  };

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Dólar Blue Hoy</CardTitle>
        <CardDescription>Ingresa tu DNI y Palabra Secreta para ver la cotización</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm" role="alert">
              {error}
            </div>
          )}
          <Input
            label="DNI"
            type="text"
            inputMode="numeric"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            onBlur={() => {
              if (dni && !/^\d{7,8}$/.test(dni.trim())) {
                setDniError('El DNI debe tener 7 u 8 dígitos');
              } else {
                setDniError('');
              }
            }}
            error={dniError}
            placeholder="Ej: 12345678"
            disabled={isLoading}
            autoComplete="off"
            autoFocus
          />
          <Input
            label="Palabra Secreta"
            type="password"
            value={secreto}
            onChange={(e) => setSecreto(e.target.value)}
            onBlur={() => {
              if (secreto) setSecretoError('');
            }}
            error={secretoError}
            placeholder="Ingresa tu palabra secreta"
            disabled={isLoading}
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full mt-2" size="lg" loading={isLoading}>
            Ingresar
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes palabra secreta? Consúltala en el programa provisto.
        </p>
      </CardFooter>
    </Card>
  );
}