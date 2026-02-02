import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import { formatDateTime } from "@/lib/storage";
import * as Haptics from "expo-haptics";

export default function CancelAppointmentScreen() {
  const colors = useColors();
  const { data, updateAppointment } = useAppData();
  const [appointmentId, setAppointmentId] = useState("");

  const handleCancel = async () => {
    const id = parseInt(appointmentId);

    if (isNaN(id)) {
      Alert.alert("Erro", "ID inválido!");
      return;
    }

    const appointment = data.agendamentos.find((apt) => apt.id === id);

    if (!appointment) {
      Alert.alert("Erro", "Agendamento não encontrado!");
      return;
    }

    if (appointment.status === "cancelado") {
      Alert.alert("Atenção", "Este agendamento já foi cancelado!");
      return;
    }

    Alert.alert(
      "Confirmar Cancelamento",
      `Deseja cancelar este agendamento?\n\nCliente: ${appointment.cliente}\nData/Hora: ${appointment.data_hora}\nServiço: ${appointment.servico}`,
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            await updateAppointment(id, {
              status: "cancelado",
              cancelado_em: formatDateTime(new Date()),
            });
            Alert.alert("Sucesso", "✅ Agendamento cancelado!");
            setAppointmentId("");
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="justify-center items-center p-6">
      <View className="w-full max-w-md">
        {/* Header */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className="mb-8"
        >
          <Text className="text-base text-foreground">← Voltar</Text>
        </Pressable>

        {/* Logo e Título */}
        <View className="items-center mb-8">
          <Text className="text-5xl mb-4">❌</Text>
          <Text className="text-3xl font-bold text-foreground text-center">
            Cancelar Agendamento
          </Text>
          <Text className="text-base text-muted text-center mt-2">
            Digite o ID do agendamento
          </Text>
        </View>

        {/* Campo de ID */}
        <View className="gap-6">
          <TextInput
            value={appointmentId}
            onChangeText={setAppointmentId}
            placeholder="ID do agendamento"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleCancel}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.foreground,
            }}
            className="border rounded-xl p-4 text-base text-center"
          />

          {/* Botão Cancelar */}
          <Pressable
            onPress={handleCancel}
            style={({ pressed }) => [
              {
                backgroundColor: colors.error,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-xl p-5 items-center"
          >
            <Text className="text-white text-lg font-bold">
              ❌ Cancelar Agendamento
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
