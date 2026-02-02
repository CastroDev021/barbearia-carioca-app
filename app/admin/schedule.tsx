import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import { formatDate } from "@/lib/storage";
import * as Haptics from "expo-haptics";

export default function ScheduleScreen() {
  const colors = useColors();
  const { data } = useAppData();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const agendamentos = data.agendamentos
    .filter(
      (apt) =>
        apt.data_hora.startsWith(selectedDate) &&
        (apt.status === "agendado" || apt.status === "concluido")
    )
    .sort((a, b) => a.data_hora.localeCompare(b.data_hora));

  const handleRefresh = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
            <Text className="text-3xl">📅</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Agenda Completa
            </Text>
          </View>
        </View>

        {/* Filtro de Data */}
        <View className="p-6">
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Data:
              </Text>
              <TextInput
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                className="border rounded-xl p-3 text-base"
              />
            </View>
            <Pressable
              onPress={handleRefresh}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              className="rounded-xl px-4 py-3 mt-6"
            >
              <Text className="text-white font-bold">🔄 Atualizar</Text>
            </Pressable>
          </View>
        </View>

        {/* Lista de Agendamentos */}
        <View className="px-6 pb-6">
          {agendamentos.length === 0 ? (
            <View className="items-center py-20">
              <Text className="text-5xl mb-4">📭</Text>
              <Text className="text-xl font-semibold text-foreground">
                Nenhum agendamento
              </Text>
              <Text className="text-base text-muted mt-2">
                Não há agendamentos para este dia
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {agendamentos.map((apt) => {
                const hora = apt.data_hora.split(" ")[1];
                const bgColor = apt.status === "concluido" ? "#d5f4e6" : "#fff3cd";
                const borderColor =
                  apt.status === "concluido" ? colors.success : colors.warning;

                return (
                  <View
                    key={apt.id}
                    style={{
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                    }}
                    className="border rounded-xl p-4 flex-row items-center"
                  >
                    <View
                      style={{ backgroundColor: borderColor }}
                      className="w-16 h-16 rounded-full items-center justify-center"
                    >
                      <Text className="text-white text-lg font-bold">{hora}</Text>
                    </View>

                    <View className="flex-1 ml-4">
                      <Text className="text-base font-bold text-foreground">
                        {apt.cliente}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        📞 {apt.telefone}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        ✂️ {apt.servico} • R$ {apt.preco.toFixed(2)}
                      </Text>
                    </View>

                    {apt.status === "concluido" && (
                      <View
                        style={{ backgroundColor: colors.success }}
                        className="px-3 py-1 rounded-full"
                      >
                        <Text className="text-white text-xs font-bold">✓</Text>
                      </View>
                    )}
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
