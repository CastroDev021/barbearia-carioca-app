import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import {
  generateAppointmentId,
  formatDate,
  formatDateTime,
  getDayName,
  generateTimeSlots,
  isTimeSlotAvailable,
} from "@/lib/storage";
import * as Haptics from "expo-haptics";

export default function BookingScreen() {
  const colors = useColors();
  const { data, addAppointment } = useAppData();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Gerar próximos 7 dias
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: formatDate(date),
      label: `${formatDate(date)} - ${getDayName(date)}`,
    };
  });

  // Gerar horários
  const timeSlots = generateTimeSlots(
    data.config.horario_inicio,
    data.config.horario_fim
  );

  const handleSubmit = async () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu nome");
      return;
    }

    if (!telefone.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu telefone");
      return;
    }

    if (!selectedService) {
      Alert.alert("Atenção", "Por favor, selecione um serviço");
      return;
    }

    if (!selectedDate) {
      Alert.alert("Atenção", "Por favor, selecione uma data");
      return;
    }

    if (!selectedTime) {
      Alert.alert("Atenção", "Por favor, selecione um horário");
      return;
    }

    // Verificar disponibilidade
    if (!isTimeSlotAvailable(data.agendamentos, selectedDate, selectedTime)) {
      Alert.alert("Atenção", "Este horário já está ocupado. Escolha outro.");
      return;
    }

    const service = data.servicos[selectedService];
    const newAppointment = {
      id: generateAppointmentId(data.agendamentos),
      cliente: nome,
      telefone: telefone,
      servico: service.nome,
      servicoId: service.id,
      preco: service.preco,
      data_hora: `${selectedDate} ${selectedTime}`,
      status: "pendente" as const,
      criado_em: formatDateTime(new Date()),
    };

    try {
      await addAppointment(newAppointment);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Oferecer enviar WhatsApp
      Alert.alert(
        "Agendamento Realizado! ✅",
        `Seu agendamento foi registrado com sucesso!\n\nID: ${newAppointment.id}\nServiço: ${service.nome}\nData: ${selectedDate}\nHorário: ${selectedTime}\n\nDeseja enviar confirmação via WhatsApp?`,
        [
          {
            text: "Não",
            style: "cancel",
            onPress: () => router.back(),
          },
          {
            text: "Sim, enviar",
            onPress: () => {
              const message = `Olá! Gostaria de confirmar meu agendamento:\n\nID: ${newAppointment.id}\nNome: ${nome}\nServiço: ${service.nome}\nData: ${selectedDate}\nHorário: ${selectedTime}\nValor: R$ ${service.preco.toFixed(2)}`;
              const whatsappUrl = `https://wa.me/${data.config.whatsapp}?text=${encodeURIComponent(message)}`;
              Linking.openURL(whatsappUrl);
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o agendamento");
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
            <Text className="text-3xl">✂️</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Agende seu Horário
            </Text>
          </View>
        </View>

        {/* Formulário */}
        <View className="p-6 gap-6">
          {/* Nome */}
          <View>
            <Text className="text-base font-semibold text-foreground mb-2">
              Seu Nome
            </Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome completo"
              placeholderTextColor={colors.muted}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              className="border rounded-xl p-4 text-base"
            />
          </View>

          {/* Telefone */}
          <View>
            <Text className="text-base font-semibold text-foreground mb-2">
              Seu WhatsApp
            </Text>
            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(21) 99999-9999"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              className="border rounded-xl p-4 text-base"
            />
          </View>

          {/* Serviço */}
          <View>
            <Text className="text-base font-semibold text-foreground mb-2">
              Escolha o Serviço
            </Text>
            <View className="gap-2">
              {Object.values(data.servicos).map((service) => (
                <Pressable
                  key={service.id}
                  onPress={() => setSelectedService(service.id)}
                  style={({ pressed }) => [
                    {
                      backgroundColor:
                        selectedService === service.id
                          ? colors.primary
                          : colors.surface,
                      borderColor:
                        selectedService === service.id
                          ? colors.primary
                          : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  className="border rounded-xl p-4"
                >
                  <Text
                    style={{
                      color:
                        selectedService === service.id
                          ? "#ffffff"
                          : colors.foreground,
                    }}
                    className="font-semibold text-base"
                  >
                    {service.nome}
                  </Text>
                  <Text
                    style={{
                      color:
                        selectedService === service.id
                          ? "#ffffff"
                          : colors.muted,
                    }}
                    className="text-sm mt-1"
                  >
                    R$ {service.preco.toFixed(2)} • {service.duracao} min
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Data */}
          <View>
            <Text className="text-base font-semibold text-foreground mb-2">
              Data Desejada
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {dates.map((date) => (
                  <Pressable
                    key={date.value}
                    onPress={() => setSelectedDate(date.value)}
                    style={({ pressed }) => [
                      {
                        backgroundColor:
                          selectedDate === date.value
                            ? colors.primary
                            : colors.surface,
                        borderColor:
                          selectedDate === date.value
                            ? colors.primary
                            : colors.border,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                    className="border rounded-xl p-3 min-w-[140px]"
                  >
                    <Text
                      style={{
                        color:
                          selectedDate === date.value
                            ? "#ffffff"
                            : colors.foreground,
                      }}
                      className="font-semibold text-sm text-center"
                    >
                      {date.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Horário */}
          <View>
            <Text className="text-base font-semibold text-foreground mb-2">
              Horário Preferido
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {timeSlots.map((time) => {
                const available = isTimeSlotAvailable(
                  data.agendamentos,
                  selectedDate,
                  time
                );
                return (
                  <Pressable
                    key={time}
                    onPress={() => available && setSelectedTime(time)}
                    disabled={!available}
                    style={({ pressed }) => [
                      {
                        backgroundColor:
                          selectedTime === time
                            ? colors.primary
                            : available
                              ? colors.surface
                              : colors.border,
                        borderColor:
                          selectedTime === time
                            ? colors.primary
                            : colors.border,
                        opacity: !available ? 0.5 : pressed ? 0.7 : 1,
                      },
                    ]}
                    className="border rounded-lg px-4 py-3"
                  >
                    <Text
                      style={{
                        color:
                          selectedTime === time
                            ? "#ffffff"
                            : available
                              ? colors.foreground
                              : colors.muted,
                      }}
                      className="font-semibold text-sm"
                    >
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Botão Confirmar */}
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              {
                backgroundColor: colors.success,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-xl p-5 items-center mt-4"
          >
            <Text className="text-white text-lg font-bold">
              ✅ Confirmar Agendamento
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
