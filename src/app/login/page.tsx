'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wind } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signup, login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
        toast({
            title: "¡Bienvenido!",
            description: "Tu cuenta ha sido creada exitosamente.",
        })
      } else {
        await login(email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error de autenticación",
            description: error.message || "Ocurrió un error. Por favor, inténtalo de nuevo.",
        })
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (user === undefined) {
      return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-body">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Wind className="h-10 w-10 text-primary" />
            </div>
          <CardTitle className="text-3xl font-headline">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Únete a Corriente Serena para empezar tu viaje.' : 'Bienvenido de nuevo. Accede a tu diario.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
            </Button>
            <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
            >
                {isSignUp
                ? '¿Ya tienes una cuenta? Inicia sesión'
                : '¿No tienes una cuenta? Regístrate'}
            </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
