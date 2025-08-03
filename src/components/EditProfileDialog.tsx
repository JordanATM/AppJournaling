'use client';

import React, { useState, useEffect } from 'react';
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

  const [displayName, setDisplayName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  
  useEffect(() => {
    if (open) {
      setDisplayName(user?.displayName ?? '');
    }
  }, [open, user]);

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
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setNameLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Realiza cambios en tu perfil aquí.
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
                  <Button type="submit" disabled={nameLoading || !displayName.trim() || displayName === user?.displayName} className="px-4">
                    {nameLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Guardar'}
                  </Button>
                </div>
              </div>
            </form>
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
