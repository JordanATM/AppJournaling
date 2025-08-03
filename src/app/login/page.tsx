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
import { Wind, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { user, signup, login, loading: authLoading, resetPassword } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      toast({
        title: "Correo de recuperación enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo enviar el correo de recuperación.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        if (!displayName) {
          toast({
            variant: "destructive",
            title: "Campo requerido",
            description: "Por favor, ingresa un nombre de usuario.",
          });
          setLoading(false);
          return;
        }
        await signup(email, password, displayName);
        toast({
            title: "¡Bienvenido!",
            description: "Tu cuenta ha sido creada exitosamente. Redirigiendo...",
        });
      } else {
        await login(email, password);
      }
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
  
  if (authLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-8 w-64" />
            <div className="flex justify-center pt-4">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      );
  }
  
  if (user) {
    return null;
  }

  if (isForgotPassword) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background font-body">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <Wind className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-headline">Recuperar Contraseña</CardTitle>
                    <CardDescription>
                        Ingresa tu correo para recibir un enlace de recuperación.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordReset}>
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
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Correo'}
                        </Button>
                        <Button
                            type="button"
                            variant="link"
                            onClick={() => setIsForgotPassword(false)}
                            className="text-sm"
                            disabled={loading}
                        >
                            Volver a Iniciar Sesión
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
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
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre de Usuario</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}
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
              <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  {!isSignUp && (
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-xs"
                      onClick={() => setIsForgotPassword(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  )}
              </div>
              <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
                disabled={loading}
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
