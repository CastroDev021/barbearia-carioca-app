import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import * as Haptics from "expo-haptics";

export default function ConfirmAppointmentsScreen() {
  const colors = useColors();
  const { data, updateAppointment } = useAppData();

  const pendentes = data.agendamentos.filter((apt) => apt.status === "pendente");

  const handleConfirm = async (id: number) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await updateAppointment(id, { status: "agendado" });
    Alert.alert("Sucesso", "✅ Agendamento confirmado!");
  };

  const handleReject = async (id: number) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    await updateAppointment(id, {
      status: "cancelado",
      cancelado_em: new Date().toISOString(),
    });
    Alert.alert("OK", "❌ Agendamento rejeitado!");
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: colors.warning }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">✅</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Confirmar Agendamentos
            </Text>
            <Text className="text-base text-white opacity-90 mt-1">
              {pendentes.length} pendentes
            </Text>
          </View>
        </View>

        {/* Lista */}
        <View className="p-6">
          {pendentes.length === 0 ? (
            <View className="items-center py-20">
              <Text className="text-5xl mb-4">✅</Text>
              <Text className="text-xl font-semibold text-foreground">
                Tudo confirmado!
              </Text>
              <Text className="text-base text-muted mt-2">
                Não há agendamentos pendentes
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {pendentes.map((apt) => (
                <View
                  key={apt.id}
                  style={{
                    backgroundColor: "#fff3cd",
                    borderColor: colors.warning,
                  }}
                  className="border rounded-xl p-4"
                >
                  <View className="flex-row items-center mb-3">
                    <View
                      style={{ backgroundColor: colors.warning }}
                      className="px-3 py-1 rounded-full"
                    >
                      <Text className="text-white font-bold text-xs">
                        ID: {apt.id}
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

                  <View className="flex-row gap-3 mt-4">
                    <Pressable
                      onPress={() => handleConfirm(apt.id)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: colors.success,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                      className="flex-1 rounded-lg py-3 items-center"
                    >
                      <Text className="text-white font-bold">✅ CONFIRMAR</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleReject(apt.id)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: colors.error,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                      className="flex-1 rounded-lg py-3 items-center"
                    >
                      <Text className="text-white font-bold">❌ REJEITAR</Text>
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
