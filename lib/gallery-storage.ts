import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GalleryPhoto, GalleryData } from "@/types";

const GALLERY_KEY = "@barbearia_galeria";

// Carregar galeria
export async function loadGallery(): Promise<GalleryData> {
  try {
    const data = await AsyncStorage.getItem(GALLERY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar galeria:", error);
  }

  return { fotos: [] };
}

// Salvar galeria
export async function saveGallery(gallery: GalleryData): Promise<void> {
  try {
    await AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
  } catch (error) {
    console.error("Erro ao salvar galeria:", error);
    throw error;
  }
}

// Adicionar foto
export async function addPhoto(photo: GalleryPhoto): Promise<void> {
  const gallery = await loadGallery();
  gallery.fotos.push(photo);
  await saveGallery(gallery);
}

// Remover foto
export async function removePhoto(photoId: string): Promise<void> {
  const gallery = await loadGallery();
  gallery.fotos = gallery.fotos.filter((p) => p.id !== photoId);
  await saveGallery(gallery);
}

// Atualizar curtidas
export async function updatePhotoLikes(photoId: string, likes: number): Promise<void> {
  const gallery = await loadGallery();
  const photo = gallery.fotos.find((p) => p.id === photoId);
  if (photo) {
    photo.curtidas = likes;
    await saveGallery(gallery);
  }
}

// Gerar ID único para foto
export function generatePhotoId(): string {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Obter fotos por categoria
export async function getPhotosByCategory(
  category: "corte" | "barba" | "design" | "outros"
): Promise<GalleryPhoto[]> {
  const gallery = await loadGallery();
  return gallery.fotos.filter((p) => p.categoria === category);
}

// Obter fotos por barbeiro
export async function getPhotosByBarber(barbeiro: string): Promise<GalleryPhoto[]> {
  const gallery = await loadGallery();
  return gallery.fotos.filter((p) => p.barbeiro === barbeiro);
}

// Obter fotos mais curtidas
export async function getTopPhotos(limit: number = 10): Promise<GalleryPhoto[]> {
  const gallery = await loadGallery();
  return gallery.fotos.sort((a, b) => b.curtidas - a.curtidas).slice(0, limit);
}
