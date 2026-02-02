import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import { formatDate } from "@/lib/storage";
import * as Haptics from "expo-haptics";

export default function AdminDashboardScreen() {
  const colors = useColors();
  const { data } = useAppData();

  const hoje = formatDate(new Date());

  // Calcular métricas
  const agendamentosHoje = data.agendamentos.filter(
    (apt) => apt.data_hora.startsWith(hoje) && apt.status !== "cancelado"
  ).length;

  const pendentes = data.agendamentos.filter(
    (apt) => apt.status === "pendente"
  ).length;

  const receitaHoje = data.agendamentos
    .filter(
      (apt) =>
        apt.data_hora.startsWith(hoje) &&
        (apt.status === "concluido" || apt.status === "agendado")
    )
    .reduce((sum, apt) => sum + apt.preco, 0);

  const handleMenuPress = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(route as any);
  };

  const menuItems = [
    {
      icon: "✅",
      title: "Confirmar Agendamentos",
      subtitle: `${pendentes} pendentes`,
      route: "/admin/confirm",
      color: colors.warning,
    },
    {
      icon: "📅",
      title: "Ver Agenda",
      subtitle: "Visualizar por data",
      route: "/admin/schedule",
      color: colors.primary,
    },
    {
      icon: "✔️",
      title: "Finalizar Atendimento",
      subtitle: "Marcar como concluído",
      route: "/admin/finish",
      color: colors.success,
    },
    {
      icon: "🔍",
      title: "Buscar Cliente",
      subtitle: "Por nome ou telefone",
      route: "/admin/search",
      color: "#9b59b6",
    },
    {
      icon: "❌",
      title: "Cancelar Agendamento",
      subtitle: "Cancelar por ID",
      route: "/admin/cancel",
      color: colors.error,
    },
    {
      icon: "💰",
      title: "Relatório Financeiro",
      subtitle: "Análise do mês",
      route: "/admin/report",
      color: "#27ae60",
    },
    {
      icon: "⚙️",
      title: "Gerenciar Serviços",
      subtitle: "Adicionar, editar, excluir",
      route: "/admin/services",
      color: "#34495e",
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: "#02200e" }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Sair</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">💼</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Painel Administrativo
            </Text>
          </View>
        </View>

        {/* Métricas */}
        <View className="p-6 gap-4">
          <Text className="text-xl font-bold text-foreground mb-2">
            Resumo de Hoje
          </Text>

          <View className="flex-row gap-4">
            {/* Agendamentos Hoje */}
            <View
              style={{ backgroundColor: colors.primary }}
              className="flex-1 rounded-xl p-4"
            >
              <Text className="text-3xl font-bold text-white">
                {agendamentosHoje}
              </Text>
              <Text className="text-sm text-white opacity-90 mt-1">
                Agendamentos
              </Text>
            </View>

            {/* Pendentes */}
            <View
              style={{ backgroundColor: colors.warning }}
              className="flex-1 rounded-xl p-4"
            >
              <Text className="text-3xl font-bold text-white">{pendentes}</Text>
              <Text className="text-sm text-white opacity-90 mt-1">
                Pendentes
              </Text>
            </View>
          </View>

          {/* Receita */}
          <View
            style={{ backgroundColor: colors.success }}
            className="rounded-xl p-4"
          >
            <Text className="text-3xl font-bold text-white">
              R$ {receitaHoje.toFixed(2)}
            </Text>
            <Text className="text-sm text-white opacity-90 mt-1">
              Receita Hoje
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View className="p-6 pt-0 gap-3">
          <Text className="text-xl font-bold text-foreground mb-2">
            Gerenciar
          </Text>

          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => handleMenuPress(item.route)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              className="border rounded-xl p-4 flex-row items-center"
            >
              <View
                style={{ backgroundColor: item.color }}
                className="w-12 h-12 rounded-full items-center justify-center"
              >
                <Text className="text-2xl">{item.icon}</Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-base font-semibold text-foreground">
                  {item.title}
                </Text>
                <Text className="text-sm text-muted mt-1">{item.subtitle}</Text>
              </View>
              <Text className="text-2xl text-muted">›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
