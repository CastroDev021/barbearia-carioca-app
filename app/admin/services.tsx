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
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAppData } from "@/lib/app-context";
import type { Service } from "@/types";
import * as Haptics from "expo-haptics";

export default function ManageServicesScreen() {
  const colors = useColors();
  const { data, addService, updateService, deleteService } = useAppData();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("");

  const openAddModal = () => {
    setEditingService(null);
    setNome("");
    setPreco("");
    setDuracao("");
    setModalVisible(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setNome(service.nome);
    setPreco(service.preco.toString());
    setDuracao(service.duracao.toString());
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Informe o nome do serviço");
      return;
    }

    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum <= 0) {
      Alert.alert("Atenção", "Informe um preço válido");
      return;
    }

    const duracaoNum = parseInt(duracao);
    if (isNaN(duracaoNum) || duracaoNum <= 0) {
      Alert.alert("Atenção", "Informe uma duração válida");
      return;
    }

    try {
      if (editingService) {
        await updateService(editingService.id, {
          nome: nome.trim(),
          preco: precoNum,
          duracao: duracaoNum,
        });
        Alert.alert("Sucesso", "✅ Serviço atualizado!");
      } else {
        const newId = (Object.keys(data.servicos).length + 1).toString();
        await addService({
          id: newId,
          nome: nome.trim(),
          preco: precoNum,
          duracao: duracaoNum,
        });
        Alert.alert("Sucesso", "✅ Serviço adicionado!");
      }

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o serviço");
    }
  };

  const handleDelete = (service: Service) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja excluir o serviço "${service.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteService(service.id);
              Alert.alert("Sucesso", "✅ Serviço excluído!");
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o serviço");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View style={{ backgroundColor: "#34495e" }} className="p-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="mb-4"
          >
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-3xl">⚙️</Text>
            <Text className="text-2xl font-bold text-white mt-2">
              Gerenciar Serviços
            </Text>
          </View>
        </View>

        {/* Botão Adicionar */}
        <View className="p-6">
          <Pressable
            onPress={openAddModal}
            style={({ pressed }) => [
              {
                backgroundColor: colors.success,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="rounded-xl p-4 items-center"
          >
            <Text className="text-white font-bold text-base">
              ➕ Adicionar Novo Serviço
            </Text>
          </Pressable>
        </View>

        {/* Lista de Serviços */}
        <View className="px-6 pb-6 gap-4">
          {Object.values(data.servicos).map((service) => (
            <View
              key={service.id}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              className="border rounded-xl p-4"
            >
              <Text className="text-lg font-bold text-foreground">
                {service.nome}
              </Text>
              <Text className="text-base text-muted mt-2">
                💰 R$ {service.preco.toFixed(2)}
              </Text>
              <Text className="text-base text-muted mt-1">
                ⏱️ {service.duracao} minutos
              </Text>

              <View className="flex-row gap-3 mt-4">
                <Pressable
                  onPress={() => openEditModal(service)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.primary,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  className="flex-1 rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-bold">✏️ Editar</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(service)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.error,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  className="flex-1 rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-bold">🗑️ Excluir</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal de Adicionar/Editar */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View
            style={{ backgroundColor: colors.background }}
            className="w-full max-w-md rounded-2xl p-6"
          >
            <Text className="text-2xl font-bold text-foreground mb-6">
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </Text>

            {/* Nome */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Nome do Serviço
              </Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Ex: Corte + Barba"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                className="border rounded-xl p-3 text-base"
              />
            </View>

            {/* Preço */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Preço (R$)
              </Text>
              <TextInput
                value={preco}
                onChangeText={setPreco}
                placeholder="Ex: 50.00"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                className="border rounded-xl p-3 text-base"
              />
            </View>

            {/* Duração */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Duração (minutos)
              </Text>
              <TextInput
                value={duracao}
                onChangeText={setDuracao}
                placeholder="Ex: 45"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                className="border rounded-xl p-3 text-base"
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                className="flex-1 border rounded-xl py-3 items-center"
              >
                <Text className="text-foreground font-bold">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.success,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                className="flex-1 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-bold">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
