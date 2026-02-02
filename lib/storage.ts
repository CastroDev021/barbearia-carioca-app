import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppData, Service, Appointment, Config } from "@/types";

const STORAGE_KEY = "@barbearia_dados";
const CONFIG_KEY = "@barbearia_config";
const PASSWORD_KEY = "@admin_password";

// Dados iniciais
const DEFAULT_SERVICES: Record<string, Service> = {
  "1": { id: "1", nome: "Corte Simples", preco: 30.0, duracao: 30 },
  "2": { id: "2", nome: "Corte + Barba", preco: 50.0, duracao: 45 },
  "3": { id: "3", nome: "Barba", preco: 25.0, duracao: 20 },
  "4": { id: "4", nome: "Corte Desfarcado", preco: 40.0, duracao: 60 },
};

const DEFAULT_CONFIG: Config = {
  nome_barbearia: "Barbearia do Carioca",
  whatsapp: "5521971041394",
  cor_primaria: "#0a7ea4",
  horario_inicio: "09:00",
  horario_fim: "20:00",
};

const DEFAULT_PASSWORD = "1234";

// Carregar dados
export async function loadData(): Promise<AppData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  // Retornar dados padrão se não existir
  return {
    servicos: DEFAULT_SERVICES,
    agendamentos: [],
    config: DEFAULT_CONFIG,
  };
}

// Salvar dados
export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    throw error;
  }
}

// Carregar configuração
export async function loadConfig(): Promise<Config> {
  try {
    const config = await AsyncStorage.getItem(CONFIG_KEY);
    if (config) {
      return JSON.parse(config);
    }
  } catch (error) {
    console.error("Erro ao carregar configuração:", error);
  }
  return DEFAULT_CONFIG;
}

// Salvar configuração
export async function saveConfig(config: Config): Promise<void> {
  try {
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    throw error;
  }
}

// Carregar senha admin
export async function loadAdminPassword(): Promise<string> {
  try {
    const password = await AsyncStorage.getItem(PASSWORD_KEY);
    return password || DEFAULT_PASSWORD;
  } catch (error) {
    console.error("Erro ao carregar senha:", error);
    return DEFAULT_PASSWORD;
  }
}

// Salvar senha admin
export async function saveAdminPassword(password: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PASSWORD_KEY, password);
  } catch (error) {
    console.error("Erro ao salvar senha:", error);
    throw error;
  }
}

// Gerar ID único para agendamento
export function generateAppointmentId(appointments: Appointment[]): number {
  if (appointments.length === 0) return 1;
  const maxId = Math.max(...appointments.map((a) => a.id));
  return maxId + 1;
}

// Formatar data para exibição
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Formatar data e hora
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${dateStr} ${hours}:${minutes}`;
}

// Obter nome do dia da semana
export function getDayName(date: Date): string {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[date.getDay()];
}

// Gerar horários disponíveis
export function generateTimeSlots(start: string = "09:00", end: string = "20:00"): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    slots.push(`${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`);

    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }

  return slots;
}

// Verificar se horário está disponível
export function isTimeSlotAvailable(
  appointments: Appointment[],
  date: string,
  time: string
): boolean {
  const dateTime = `${date} ${time}`;
  return !appointments.some(
    (apt) =>
      apt.data_hora === dateTime && (apt.status === "agendado" || apt.status === "pendente")
  );
}
