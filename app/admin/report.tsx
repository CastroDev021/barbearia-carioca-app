import { useState } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import * as Haptics from "expo-haptics";

export default function FinancialReportScreen() {
  const colors = useColors();
  const { data } = useAppData();

  // Mês atual
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const [selectedMonth] = useState(currentMonth);
  const [selectedYear] = useState(currentYear);

  // Filtrar agendamentos do mês
  const monthAppointments = data.agendamentos.filter((apt) => {
    if (apt.status !== "concluido") return false;

    const [datePart] = apt.data_hora.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);

    return month === selectedMonth && year === selectedYear;
  });

  // Calcular métricas
  const totalReceita = monthAppointments.reduce((sum, apt) => sum + apt.preco, 0);
  const totalAtendimentos = monthAppointments.length;

  // Serviço mais vendido
  const serviceCounts: Record<string, number> = {};
  monthAppointments.forEach((apt) => {
    serviceCounts[apt.servico] = (serviceCounts[apt.servico] || 0) + 1;
  });

  const mostSoldService =
    Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Receita por dia
  const dailyRevenue: Record<string, number> = {};
  monthAppointments.forEach((apt) => {
    const [datePart] = apt.data_hora.split(" ");
    dailyRevenue[datePart] = (dailyRevenue[datePart] || 0) + apt.preco;
  });

  const monthName = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ][selectedMonth - 1];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: "#27ae60" }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">💰</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Relatório Financeiro
            </Text>
            <Text className="text-base text-white opacity-90 mt-1">
              {monthName} {selectedYear}
            </Text>
          </View>
        </View>

        {/* Métricas Principais */}
        <View className="p-6 gap-4">
          {/* Receita Total */}
          <View
            style={{ backgroundColor: colors.success }}
            className="rounded-xl p-5"
          >
            <Text className="text-sm text-white opacity-90">Receita Total</Text>
            <Text className="text-4xl font-bold text-white mt-2">
              R$ {totalReceita.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row gap-4">
            {/* Total de Atendimentos */}
            <View
              style={{ backgroundColor: colors.primary }}
              className="flex-1 rounded-xl p-4"
            >
              <Text className="text-sm text-white opacity-90">Atendimentos</Text>
              <Text className="text-3xl font-bold text-white mt-2">
                {totalAtendimentos}
              </Text>
            </View>

            {/* Ticket Médio */}
            <View
              style={{ backgroundColor: colors.warning }}
              className="flex-1 rounded-xl p-4"
            >
              <Text className="text-sm text-white opacity-90">Ticket Médio</Text>
              <Text className="text-3xl font-bold text-white mt-2">
                R${" "}
                {totalAtendimentos > 0
                  ? (totalReceita / totalAtendimentos).toFixed(2)
                  : "0.00"}
              </Text>
            </View>
          </View>

          {/* Serviço Mais Vendido */}
          <View
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            className="border rounded-xl p-4"
          >
            <Text className="text-sm text-muted">Serviço Mais Vendido</Text>
            <Text className="text-xl font-bold text-foreground mt-2">
              ✂️ {mostSoldService}
            </Text>
            <Text className="text-sm text-muted mt-1">
              {serviceCounts[mostSoldService] || 0} vezes
            </Text>
          </View>
        </View>

        {/* Receita por Dia */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-foreground mb-4">
            Receita por Dia
          </Text>

          {Object.entries(dailyRevenue).length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-base text-muted">
                Nenhum atendimento concluído neste mês
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {Object.entries(dailyRevenue)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([date, revenue]) => (
                  <View
                    key={date}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                    className="border rounded-xl p-4 flex-row items-center justify-between"
                  >
                    <Text className="text-base font-semibold text-foreground">
                      📅 {date}
                    </Text>
                    <Text className="text-lg font-bold text-success">
                      R$ {revenue.toFixed(2)}
                    </Text>
                  </View>
                ))}
            </View>
          )}
        </View>

        {/* Lista Detalhada */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-foreground mb-4">
            Atendimentos Concluídos
          </Text>

          {monthAppointments.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-base text-muted">
                Nenhum atendimento concluído
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {monthAppointments
                .sort((a, b) => b.data_hora.localeCompare(a.data_hora))
                .map((apt) => (
                  <View
                    key={apt.id}
                    style={{
                      backgroundColor: "#d5f4e6",
                      borderColor: colors.success,
                    }}
                    className="border rounded-xl p-4"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-base font-bold text-foreground">
                        {apt.cliente}
                      </Text>
                      <Text className="text-lg font-bold text-success">
                        R$ {apt.preco.toFixed(2)}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted">
                      📅 {apt.data_hora}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      ✂️ {apt.servico}
                    </Text>
                  </View>
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
