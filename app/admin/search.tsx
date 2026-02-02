import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import * as Haptics from "expo-haptics";

export default function SearchClientScreen() {
  const colors = useColors();
  const { data } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<typeof data.agendamentos>([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      Alert.alert("Atenção", "Digite algo para buscar!");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const term = searchTerm.toLowerCase();
    const found = data.agendamentos.filter(
      (apt) =>
        apt.cliente.toLowerCase().includes(term) ||
        apt.telefone.includes(term)
    );

    setResults(found);

    if (found.length === 0) {
      Alert.alert("Busca", "❌ Nenhum resultado encontrado");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return { bg: "#fff3cd", border: colors.warning };
      case "concluido":
        return { bg: "#d5f4e6", border: colors.success };
      case "cancelado":
        return { bg: "#f8d7da", border: colors.error };
      case "pendente":
        return { bg: "#e8f4f8", border: "#3498db" };
      default:
        return { bg: colors.surface, border: colors.border };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "agendado":
        return "Agendado";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      case "pendente":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: "#9b59b6" }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">🔍</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Buscar Cliente
            </Text>
            <Text className="text-base text-white opacity-90 mt-1">
              Por nome ou telefone
            </Text>
          </View>
        </View>

        {/* Campo de Busca */}
        <View className="p-6">
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Nome ou telefone..."
                placeholderTextColor={colors.muted}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                className="border rounded-xl p-4 text-base"
              />
            </View>
            <Pressable
              onPress={handleSearch}
              style={({ pressed }) => [
                {
                  backgroundColor: "#9b59b6",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              className="rounded-xl px-4 py-4"
            >
              <Text className="text-white font-bold">🔍 Buscar</Text>
            </Pressable>
          </View>
        </View>

        {/* Resultados */}
        <View className="px-6 pb-6">
          {results.length > 0 && (
            <Text className="text-base font-semibold text-foreground mb-4">
              📋 {results.length} resultado(s) encontrado(s)
            </Text>
          )}

          <View className="gap-4">
            {results.map((apt) => {
              const statusColors = getStatusColor(apt.status);

              return (
                <View
                  key={apt.id}
                  style={{
                    backgroundColor: statusColors.bg,
                    borderColor: statusColors.border,
                  }}
                  className="border rounded-xl p-4"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View
                      style={{ backgroundColor: statusColors.border }}
                      className="px-3 py-1 rounded-full"
                    >
                      <Text className="text-white font-bold text-xs">
                        ID: {apt.id}
                      </Text>
                    </View>
                    <View
                      style={{ backgroundColor: statusColors.border }}
                      className="px-3 py-1 rounded-full"
                    >
                      <Text className="text-white font-bold text-xs">
                        {getStatusLabel(apt.status).toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-base font-bold text-foreground">
                    {apt.cliente}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    📞 {apt.telefone}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    📅 {apt.data_hora}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    ✂️ {apt.servico} • R$ {apt.preco.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
