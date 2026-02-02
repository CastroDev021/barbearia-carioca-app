import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useGallery } from "@/lib/gallery-context";
import * as Haptics from "expo-haptics";

const CATEGORIES = [
  { id: "corte", label: "✂️ Cortes", color: "#3498db" },
  { id: "barba", label: "💈 Barbas", color: "#e74c3c" },
  { id: "design", label: "🎨 Design", color: "#9b59b6" },
  { id: "outros", label: "📸 Outros", color: "#95a5a6" },
];

export default function GalleryScreen() {
  const colors = useColors();
  const { gallery } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState<string>("corte");
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  const filteredPhotos = gallery.fotos.filter(
    (photo) => photo.categoria === selectedCategory
  );

  const handleLike = (photoId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newLiked = new Set(likedPhotos);
    if (newLiked.has(photoId)) {
      newLiked.delete(photoId);
    } else {
      newLiked.add(photoId);
    }
    setLikedPhotos(newLiked);
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: colors.primary }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">📸</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Galeria de Trabalhos
            </Text>
            <Text className="text-base text-white opacity-90 mt-1">
              Conheça nossos trabalhos
            </Text>
          </View>
        </View>

        {/* Filtro de Categorias */}
        <View className="p-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {CATEGORIES.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={({ pressed }) => [
                    {
                      backgroundColor:
                        selectedCategory === category.id
                          ? category.color
                          : colors.surface,
                      borderColor:
                        selectedCategory === category.id
                          ? category.color
                          : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  className="border rounded-full px-4 py-2"
                >
                  <Text
                    style={{
                      color:
                        selectedCategory === category.id
                          ? "#ffffff"
                          : colors.foreground,
                    }}
                    className="font-semibold text-sm"
                  >
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Lista de Fotos */}
        <View className="px-6 pb-6">
          {filteredPhotos.length === 0 ? (
            <View className="items-center py-20">
              <Text className="text-5xl mb-4">📭</Text>
              <Text className="text-xl font-semibold text-foreground">
                Sem fotos nesta categoria
              </Text>
              <Text className="text-base text-muted mt-2">
                Volte em breve para ver novos trabalhos
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredPhotos.map((photo) => {
                const isLiked = likedPhotos.has(photo.id);

                return (
                  <View
                    key={photo.id}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                    className="border rounded-2xl overflow-hidden"
                  >
                    {/* Imagem */}
                    <Image
                      source={{ uri: photo.imagem }}
                      style={{ width: "100%", height: 250 }}
                      resizeMode="cover"
                    />

                    {/* Informações */}
                    <View className="p-4">
                      <Text className="text-lg font-bold text-foreground">
                        {photo.titulo}
                      </Text>

                      <Text className="text-sm text-muted mt-1">
                        👨‍💼 {photo.barbeiro}
                      </Text>

                      <Text className="text-sm text-muted mt-1">
                        📅 {photo.data}
                      </Text>

                      {photo.descricao && (
                        <Text className="text-sm text-muted mt-3">
                          {photo.descricao}
                        </Text>
                      )}

                      {/* Botão de Curtir */}
                      <Pressable
                        onPress={() => handleLike(photo.id)}
                        style={({ pressed }) => [
                          {
                            backgroundColor: isLiked
                              ? colors.error
                              : colors.surface,
                            borderColor: colors.error,
                            opacity: pressed ? 0.7 : 1,
                          },
                        ]}
                        className="border rounded-lg py-3 items-center mt-4 flex-row justify-center gap-2"
                      >
                        <Text
                          style={{
                            color: isLiked ? "#ffffff" : colors.error,
                          }}
                          className="text-lg"
                        >
                          {isLiked ? "❤️" : "🤍"}
                        </Text>
                        <Text
                          style={{
                            color: isLiked ? "#ffffff" : colors.error,
                          }}
                          className="font-bold"
                        >
                          {photo.curtidas + (isLiked ? 1 : 0)} curtidas
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
