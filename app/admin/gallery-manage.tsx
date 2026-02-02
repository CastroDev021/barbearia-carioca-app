import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useGallery } from "@/lib/gallery-context";
import * as Haptics from "expo-haptics";

export default function ManageGalleryScreen() {
  const colors = useColors();
  const { gallery, removePhoto } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState<string>("corte");

  const filteredPhotos = gallery.fotos.filter(
    (photo) => photo.categoria === selectedCategory
  );

  const handleDelete = (photoId: string, titulo: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja excluir a foto "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removePhoto(photoId);
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              Alert.alert("Sucesso", "✅ Foto excluída!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a foto");
            }
          },
        },
      ]
    );
  };

  const CATEGORIES = [
    { id: "corte", label: "✂️ Cortes", color: "#3498db" },
    { id: "barba", label: "💈 Barbas", color: "#e74c3c" },
    { id: "design", label: "🎨 Design", color: "#9b59b6" },
    { id: "outros", label: "📸 Outros", color: "#95a5a6" },
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: "#f39c12" }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">🖼️</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Gerenciar Galeria
            </Text>
            <Text className="text-base text-white opacity-90 mt-1">
              {gallery.fotos.length} fotos no total
            </Text>
          </View>
        </View>

        {/* Botão Enviar Nova Foto */}
        <View className="p-6">
          <Pressable
            onPress={() => router.push("/admin/upload-photo")}
            style={({ pressed }) => [
              {
                backgroundColor: colors.success,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="rounded-xl p-4 items-center"
          >
            <Text className="text-white font-bold text-base">
              ➕ Enviar Nova Foto
            </Text>
          </Pressable>
        </View>

        {/* Filtro de Categorias */}
        <View className="px-6 pb-6">
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
                Envie uma foto para começar
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredPhotos.map((photo) => (
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
                    style={{ width: "100%", height: 200 }}
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

                    <Text className="text-sm text-muted mt-1">
                      ❤️ {photo.curtidas} curtidas
                    </Text>

                    {photo.descricao && (
                      <Text className="text-sm text-muted mt-3">
                        {photo.descricao}
                      </Text>
                    )}

                    {/* Botão Excluir */}
                    <Pressable
                      onPress={() => handleDelete(photo.id, photo.titulo)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: colors.error,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                      className="rounded-lg py-3 items-center mt-4"
                    >
                      <Text className="text-white font-bold">
                        🗑️ Excluir Foto
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
