import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AppData, Appointment, Service, Config } from "@/types";
import { loadData, saveData, loadConfig, saveConfig } from "./storage";

interface AppContextType {
  data: AppData;
  loading: boolean;
  refreshData: () => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: number, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateConfig: (config: Config) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({
    servicos: {},
    agendamentos: [],
    config: {
      nome_barbearia: "Barbearia do Carioca",
      whatsapp: "5521971041394",
      cor_primaria: "#0a7ea4",
      horario_inicio: "09:00",
      horario_fim: "20:00",
    },
  });
  const [loading, setLoading] = useState(true);

  // Carregar dados ao iniciar
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const loadedData = await loadData();
      const loadedConfig = await loadConfig();
      setData({ ...loadedData, config: loadedConfig });
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    try {
      const loadedData = await loadData();
      const loadedConfig = await loadConfig();
      setData({ ...loadedData, config: loadedConfig });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  }

  async function addAppointment(appointment: Appointment) {
    const newData = {
      ...data,
      agendamentos: [...data.agendamentos, appointment],
    };
    setData(newData);
    await saveData(newData);
  }

  async function updateAppointment(id: number, updates: Partial<Appointment>) {
    const newData = {
      ...data,
      agendamentos: data.agendamentos.map((apt) =>
        apt.id === id ? { ...apt, ...updates } : apt
      ),
    };
    setData(newData);
    await saveData(newData);
  }

  async function deleteAppointment(id: number) {
    const newData = {
      ...data,
      agendamentos: data.agendamentos.filter((apt) => apt.id !== id),
    };
    setData(newData);
    await saveData(newData);
  }

  async function addService(service: Service) {
    const newData = {
      ...data,
      servicos: { ...data.servicos, [service.id]: service },
    };
    setData(newData);
    await saveData(newData);
  }

  async function updateService(id: string, updates: Partial<Service>) {
    const newData = {
      ...data,
      servicos: {
        ...data.servicos,
        [id]: { ...data.servicos[id], ...updates },
      },
    };
    setData(newData);
    await saveData(newData);
  }

  async function deleteService(id: string) {
    const newServicos = { ...data.servicos };
    delete newServicos[id];
    const newData = {
      ...data,
      servicos: newServicos,
    };
    setData(newData);
    await saveData(newData);
  }

  async function updateConfig(config: Config) {
    const newData = { ...data, config };
    setData(newData);
    await saveConfig(config);
  }

  return (
    <AppContext.Provider
      value={{
        data,
        loading,
        refreshData,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addService,
        updateService,
        deleteService,
        updateConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppProvider");
  }
  return context;
}
