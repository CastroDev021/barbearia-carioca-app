import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import { formatDate, formatDateTime } from "@/lib/storage";
import * as Haptics from "expo-haptics";

export default function FinishAppointmentsScreen() {
  const colors = useColors();
  const { data, updateAppointment } = useAppData();

  const hoje = formatDate(new Date());
  const pendentes = data.agendamentos.filter(
    (apt) => apt.data_hora.startsWith(hoje) && apt.status === "agendado"
  );

  const handleFinish = async (id: number) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await updateAppointment(id, {
      status: "concluido",
      finalizado_em: formatDateTime(new Date()),
    });
    Alert.alert("Sucesso", "✅ Atendimento finalizado!");
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: colors.success }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">✔️</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Finalizar Atendimento
            </Text>
            <Text className="text-base text-white opacity-90 mt-1">
              Marque como concluído
            </Text>
          </View>
        </View>

        {/* Lista */}
        <View className="p-6">
          {pendentes.length === 0 ? (
            <View className="items-center py-20">
              <Text className="text-5xl mb-4">✅</Text>
              <Text className="text-xl font-semibold text-foreground">
                Todos finalizados!
              </Text>
              <Text className="text-base text-muted mt-2">
                Não há atendimentos pendentes hoje
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {pendentes.map((apt) => {
                const hora = apt.data_hora.split(" ")[1];

                return (
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
                        className="w-16 h-16 rounded-full items-center justify-center"
                      >
                        <Text className="text-white text-lg font-bold">
                          {hora}
                        </Text>
                      </View>

                      <View className="flex-1 ml-4">
                        <Text className="text-base font-bold text-foreground">
                          {apt.cliente}
                        </Text>
                        <Text className="text-sm text-muted mt-1">
                          ✂️ {apt.servico}
                        </Text>
                        <Text className="text-sm text-muted mt-1">
                          💰 R$ {apt.preco.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => handleFinish(apt.id)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: colors.success,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                      className="rounded-lg py-3 items-center"
                    >
                      <Text className="text-white font-bold text-base">
                        ✅ FINALIZAR
                      </Text>
                    </Pressable>
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
