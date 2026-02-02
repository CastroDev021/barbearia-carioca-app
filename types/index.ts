export interface Service {
  id: string;
  nome: string;
  preco: number;
  duracao: number; // em minutos
}

export interface Appointment {
  id: number;
  cliente: string;
  telefone: string;
  servico: string;
  servicoId: string;
  preco: number;
  data_hora: string; // formato: "DD/MM/YYYY HH:mm"
  status: "pendente" | "agendado" | "concluido" | "cancelado";
  criado_em: string;
  finalizado_em?: string;
  cancelado_em?: string;
}

export interface Config {
  nome_barbearia: string;
  whatsapp: string;
  cor_primaria: string;
  horario_inicio: string;
  horario_fim: string;
}

export interface AppData {
  servicos: Record<string, Service>;
  agendamentos: Appointment[];
  config: Config;
}

export interface DashboardMetrics {
  agendamentosHoje: number;
  pendentes: number;
  receitaHoje: number;
  totalMes: number;
}
