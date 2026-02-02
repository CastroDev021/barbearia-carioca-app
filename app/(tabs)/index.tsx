import { View, Text, Pressable, Image, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const colors = useColors();

  const handleClientPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/booking");
  };

  const handleAdminPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/admin-login");
  };

  return (
    <ScreenContainer className="justify-center items-center p-6">
      <View className="items-center gap-8 w-full max-w-md">
        {/* Logo e Título */}
        <View className="items-center gap-4">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <Text className="text-4xl font-bold text-foreground text-center">
            Barbearia do Carioca
          </Text>
          <Text className="text-base text-muted text-center">
            Sistema de Agendamentos
          </Text>
        </View>

        {/* Botões de Escolha */}
        <View className="w-full gap-4 mt-8">
          {/* Botão Cliente */}
          <Pressable
            onPress={handleClientPress}
            style={({ pressed }) => [
              {
                backgroundColor: colors.client,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="rounded-2xl p-6 items-center shadow-lg"
          >
            <Text className="text-5xl mb-2">👤</Text>
            <Text className="text-xl font-bold text-white">SOU CLIENTE</Text>
            <Text className="text-base text-white opacity-90 mt-1">
              Quero Agendar
            </Text>
          </Pressable>

          {/* Botão Admin */}
          <Pressable
            onPress={handleAdminPress}
            style={({ pressed }) => [
              {
                backgroundColor: colors.admin,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="rounded-2xl p-6 items-center shadow-lg"
          >
            <Text className="text-5xl mb-2">💼</Text>
            <Text className="text-xl font-bold text-white">ADMINISTRADOR</Text>
            <Text className="text-base text-white opacity-90 mt-1">
              Gerenciar Sistema
            </Text>
          </Pressable>
        </View>

        {/* Rodapé */}
        <Text className="text-xs text-muted text-center mt-8">
          © 2024 - Sistema desenvolvido com React Native
        </Text>
      </View>
    </ScreenContainer>
  );
}
