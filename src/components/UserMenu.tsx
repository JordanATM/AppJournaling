'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, Image as ImageIcon, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserMenuProps {
  onLogout: () => void;
}

export default function UserMenu({ onLogout }: UserMenuProps) {
  const { user, updateProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      await updateProfile({ photoURL });
      toast({
        title: "¡Éxito!",
        description: "Tu foto de perfil ha sido actualizada.",
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar tu foto de perfil.",
      });
    } finally {
      setIsUploading(false);
    }
  };


  if (!user) return null;

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <div className="flex items-center gap-2 cursor-pointer">
              {user.displayName && (
                <span className="text-sm font-medium text-foreground hidden sm:inline-block">
                  {user.displayName}
                </span>
              )}
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuario'} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
              </Button>
           </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName || 'Usuario'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAvatarClick} disabled={isUploading}>
            {isUploading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Cambiar Foto</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span>Editar Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
