import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { loadAdminPassword } from "@/lib/storage";
import * as Haptics from "expo-haptics";

export default function AdminLoginScreen() {
  const colors = useColors();
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const adminPassword = await loadAdminPassword();

    if (password === adminPassword) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace("/admin-dashboard");
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("Erro", "❌ Senha incorreta!");
      setPassword("");
    }
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
          <Text className="text-5xl mb-4">🔐</Text>
          <Text className="text-3xl font-bold text-foreground text-center">
            Acesso Restrito
          </Text>
          <Text className="text-base text-muted text-center mt-2">
            Digite a senha de administrador
          </Text>
        </View>

        {/* Campo de Senha */}
        <View className="gap-6">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor={colors.muted}
            secureTextEntry
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.foreground,
            }}
            className="border rounded-xl p-4 text-base"
          />

          {/* Botão Entrar */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              {
                backgroundColor: "#02200e",
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-xl p-5 items-center"
          >
            <Text className="text-white text-lg font-bold">
              Entrar no Painel
            </Text>
          </Pressable>
        </View>

        {/* Dica */}
        <Text className="text-xs text-muted text-center mt-8">
          Senha padrão: 1234
        </Text>
      </View>
    </ScreenContainer>
  );
}
