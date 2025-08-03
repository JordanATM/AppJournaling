'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Check } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const { theme: currentTheme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [nameLoading, setNameLoading] = useState(false);

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'El nombre no puede estar vacío.' });
      return;
    }
    setNameLoading(true);
    try {
      await updateProfile({ displayName });
      toast({ title: 'Éxito', description: 'Tu nombre ha sido actualizado.' });
      // Don't close the dialog on purpose, so user can change theme
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setNameLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setDisplayName(user?.displayName ?? '');
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Realiza cambios en tu perfil aquí. Haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
            <form onSubmit={handleNameChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre de Usuario</Label>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={nameLoading}
                  />
                  <Button type="submit" disabled={nameLoading || !displayName.trim()} className="px-4">
                    {nameLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Guardar'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              <Label>Tema de Color</Label>
              <div className="grid grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div key={theme.name}>
                    <button
                      onClick={() => setTheme(theme.name)}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-md border-2 p-2 transition-all',
                        currentTheme === theme.name ? 'border-primary' : 'border-transparent'
                      )}
                    >
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                       {currentTheme === theme.name && <Check className="h-6 w-6 text-primary-foreground" />}
                      </div>
                      <span className="mt-2 text-xs font-medium text-foreground">{theme.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
        </div>
        
        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={nameLoading}>
              Cerrar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
