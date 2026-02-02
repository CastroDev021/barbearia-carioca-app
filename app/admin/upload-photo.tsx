import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
  Platform,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useGallery } from "@/lib/gallery-context";
import { generatePhotoId } from "@/lib/gallery-storage";
import { formatDateTime } from "@/lib/storage";
// @ts-ignore
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import type { GalleryPhoto } from "@/types";

const CATEGORIES = [
  { id: "corte", label: "✂️ Cortes" },
  { id: "barba", label: "💈 Barbas" },
  { id: "design", label: "🎨 Design" },
  { id: "outros", label: "📸 Outros" },
];

export default function UploadPhotoScreen() {
  const colors = useColors();
  const { addPhoto, gallery } = useGallery();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [barbeiro, setBarbeiro] = useState("");
  const [categoria, setCategoria] = useState<"corte" | "barba" | "design" | "outros">(
    "corte"
  );
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImagemUri(result.assets[0].uri);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
    }
  };

  const handleCameraCapture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImagemUri(result.assets[0].uri);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível capturar a foto");
    }
  };

  const handleUpload = async () => {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "Informe um título para a foto");
      return;
    }

    if (!barbeiro.trim()) {
      Alert.alert("Atenção", "Informe o nome do barbeiro");
      return;
    }

    if (!imagemUri) {
      Alert.alert("Atenção", "Selecione uma imagem");
      return;
    }

    setUploading(true);

    try {
      // Converter imagem para base64 (simplificado para demonstração)
      // Em produção, você poderia usar um serviço de upload de imagens
      const newPhoto: GalleryPhoto = {
        id: generatePhotoId(),
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        barbeiro: barbeiro.trim(),
        data: formatDateTime(new Date()),
        imagem: imagemUri, // Em produção, seria base64 ou URL
        categoria: categoria,
        curtidas: 0,
      };

      await addPhoto(newPhoto);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert("Sucesso", "✅ Foto enviada com sucesso!");

      // Limpar formulário
      setTitulo("");
      setDescricao("");
      setBarbeiro("");
      setImagemUri(null);
      setCategoria("corte");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a foto");
    } finally {
      setUploading(false);
    }
  };

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
            <Text className="text-3xl">📸</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Enviar Foto
            </Text>
            <Text className="text-base text-white opacity-90 mt-1">
              Compartilhe seus trabalhos
            </Text>
          </View>
        </View>

        {/* Formulário */}
        <View className="p-6 gap-6">
          {/* Preview da Imagem */}
          {imagemUri && (
            <View className="rounded-xl overflow-hidden">
              <Image
                source={{ uri: imagemUri }}
                style={{ width: "100%", height: 250 }}
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setImagemUri(null)}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.error,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                className="p-3 items-center"
              >
                <Text className="text-white font-bold">Trocar Imagem</Text>
              </Pressable>
            </View>
          )}

          {/* Botões de Seleção de Imagem */}
          {!imagemUri && (
            <View className="gap-3">
              <Pressable
                onPress={handlePickImage}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                className="rounded-xl p-4 items-center"
              >
                <Text className="text-white font-bold text-base">
                  📁 Selecionar da Galeria
                </Text>
              </Pressable>

              <Pressable
                onPress={handleCameraCapture}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.success,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                className="rounded-xl p-4 items-center"
              >
                <Text className="text-white font-bold text-base">
                  📷 Tirar Foto
                </Text>
              </Pressable>
            </View>
          )}

          {/* Título */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Título da Foto
            </Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Corte Fade Moderno"
              placeholderTextColor={colors.muted}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              className="border rounded-xl p-4 text-base"
            />
          </View>

          {/* Barbeiro */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Nome do Barbeiro
            </Text>
            <TextInput
              value={barbeiro}
              onChangeText={setBarbeiro}
              placeholder="Ex: João Silva"
              placeholderTextColor={colors.muted}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              className="border rounded-xl p-4 text-base"
            />
          </View>

          {/* Descrição */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Descrição (Opcional)
            </Text>
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva o trabalho realizado..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              className="border rounded-xl p-4 text-base"
            />
          </View>

          {/* Categoria */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Categoria
            </Text>
            <View className="gap-2">
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() =>
                    setCategoria(
                      cat.id as "corte" | "barba" | "design" | "outros"
                    )
                  }
                  style={({ pressed }) => [
                    {
                      backgroundColor:
                        categoria === cat.id ? colors.primary : colors.surface,
                      borderColor:
                        categoria === cat.id ? colors.primary : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  className="border rounded-xl p-4"
                >
                  <Text
                    style={{
                      color:
                        categoria === cat.id ? "#ffffff" : colors.foreground,
                    }}
                    className="font-semibold text-base"
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Botão Enviar */}
          <Pressable
            onPress={handleUpload}
            disabled={uploading || !imagemUri}
            style={({ pressed }) => [
              {
                backgroundColor: uploading || !imagemUri ? colors.muted : "#f39c12",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="rounded-xl p-5 items-center mt-4"
          >
            <Text className="text-white text-lg font-bold">
              {uploading ? "Enviando..." : "✅ Enviar Foto"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
