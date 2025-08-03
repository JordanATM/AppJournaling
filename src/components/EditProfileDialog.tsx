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
import { LoaderCircle } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

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
      onOpenChange(false);
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
            Realiza cambios en tu nombre de usuario aquí. Haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleNameChange} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre de Usuario</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={nameLoading}
            />
          </div>
          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={nameLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={nameLoading || !displayName.trim()}>
              {nameLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Nombre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
