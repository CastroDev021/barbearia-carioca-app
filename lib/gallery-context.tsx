import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { GalleryPhoto, GalleryData } from "@/types";
import {
  loadGallery,
  saveGallery,
  addPhoto,
  removePhoto,
  updatePhotoLikes,
} from "./gallery-storage";

interface GalleryContextType {
  gallery: GalleryData;
  loading: boolean;
  refreshGallery: () => Promise<void>;
  addPhoto: (photo: GalleryPhoto) => Promise<void>;
  removePhoto: (photoId: string) => Promise<void>;
  updateLikes: (photoId: string, likes: number) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [gallery, setGallery] = useState<GalleryData>({ fotos: [] });
  const [loading, setLoading] = useState(true);

  // Carregar galeria ao iniciar
  useEffect(() => {
    loadInitialGallery();
  }, []);

  async function loadInitialGallery() {
    try {
      const loadedGallery = await loadGallery();
      setGallery(loadedGallery);
    } catch (error) {
      console.error("Erro ao carregar galeria inicial:", error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshGallery() {
    try {
      const loadedGallery = await loadGallery();
      setGallery(loadedGallery);
    } catch (error) {
      console.error("Erro ao atualizar galeria:", error);
    }
  }

  async function handleAddPhoto(photo: GalleryPhoto) {
    const newGallery = {
      ...gallery,
      fotos: [...gallery.fotos, photo],
    };
    setGallery(newGallery);
    await saveGallery(newGallery);
  }

  async function handleRemovePhoto(photoId: string) {
    const newGallery = {
      ...gallery,
      fotos: gallery.fotos.filter((p) => p.id !== photoId),
    };
    setGallery(newGallery);
    await saveGallery(newGallery);
  }

  async function handleUpdateLikes(photoId: string, likes: number) {
    const newGallery = {
      ...gallery,
      fotos: gallery.fotos.map((p) =>
        p.id === photoId ? { ...p, curtidas: likes } : p
      ),
    };
    setGallery(newGallery);
    await saveGallery(newGallery);
  }

  return (
    <GalleryContext.Provider
      value={{
        gallery,
        loading,
        refreshGallery,
        addPhoto: handleAddPhoto,
        removePhoto: handleRemovePhoto,
        updateLikes: handleUpdateLikes,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery deve ser usado dentro de GalleryProvider");
  }
  return context;
}
