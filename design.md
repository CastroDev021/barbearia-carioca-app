# Design do Aplicativo - Barbearia do Carioca

## Visão Geral
Aplicativo móvel para gerenciamento completo de barbearia, permitindo agendamentos de clientes e administração do negócio em um único app.

## Orientação e Uso
- **Orientação**: Portrait (9:16) - uso com uma mão
- **Plataforma**: iOS e Android
- **Estilo**: Seguindo Apple Human Interface Guidelines

## Lista de Telas

### 1. Tela Inicial (Home)
- **Conteúdo**: Escolha entre modo Cliente ou Administrador
- **Elementos**:
  - Logo da barbearia centralizado
  - Botão grande "Agendar Horário" (modo cliente)
  - Botão "Painel Admin" (requer senha)
  - Visual clean com ícones de tesoura e barbearia

### 2. Tela de Agendamento (Cliente)
- **Conteúdo**: Formulário de agendamento simplificado
- **Elementos**:
  - Campo: Nome do cliente
  - Campo: Telefone/WhatsApp
  - Seletor: Serviço (lista com preços)
  - Seletor: Data (próximos 7 dias)
  - Seletor: Horário disponível
  - Botão de confirmação destacado
  - Resumo do agendamento antes de confirmar

### 3. Dashboard Admin
- **Conteúdo**: Visão geral e acesso rápido às funções administrativas
- **Elementos**:
  - Cards com métricas: agendamentos hoje, pendentes, receita
  - Menu de navegação para:
    - Confirmar agendamentos pendentes
    - Ver agenda do dia
    - Finalizar atendimentos
    - Buscar cliente
    - Cancelar agendamento
    - Relatório financeiro
    - Gerenciar serviços

### 4. Confirmar Agendamentos
- **Conteúdo**: Lista de agendamentos pendentes de confirmação
- **Elementos**:
  - Cards com informações: cliente, serviço, data/hora, preço
  - Botões: Confirmar (verde) / Rejeitar (vermelho)
  - Badge de status "Pendente"

### 5. Agenda do Dia
- **Conteúdo**: Visualização cronológica dos agendamentos
- **Elementos**:
  - Seletor de data
  - Lista ordenada por horário
  - Status visual: agendado (amarelo), concluído (verde)
  - Informações: hora, cliente, serviço, valor

### 6. Finalizar Atendimento
- **Conteúdo**: Marcar atendimentos como concluídos
- **Elementos**:
  - Lista de atendimentos do dia pendentes
  - Botão "Finalizar" para cada item
  - Confirmação visual ao finalizar

### 7. Buscar Cliente
- **Conteúdo**: Busca por nome ou telefone
- **Elementos**:
  - Campo de busca
  - Resultados com histórico completo
  - Cards coloridos por status do agendamento

### 8. Cancelar Agendamento
- **Conteúdo**: Cancelamento por ID
- **Elementos**:
  - Campo para ID do agendamento
  - Confirmação com detalhes antes de cancelar
  - Feedback visual de sucesso

### 9. Relatório Financeiro
- **Conteúdo**: Análise financeira do período
- **Elementos**:
  - Seletor de mês
  - Cards com totais: receita, atendimentos, serviço mais vendido
  - Gráfico de receita por dia
  - Lista detalhada de atendimentos concluídos

### 10. Gerenciar Serviços
- **Conteúdo**: CRUD de serviços oferecidos
- **Elementos**:
  - Lista de serviços com nome, preço, duração
  - Botões: Adicionar, Editar, Excluir
  - Formulário modal para edição

## Fluxos Principais

### Fluxo Cliente
1. Abrir app → Tela Inicial
2. Tocar "Agendar Horário" → Tela de Agendamento
3. Preencher formulário → Confirmar
4. Ver confirmação → Opção de enviar WhatsApp
5. Voltar à tela inicial

### Fluxo Admin
1. Abrir app → Tela Inicial
2. Tocar "Painel Admin" → Inserir senha
3. Ver Dashboard → Escolher função
4. Executar tarefa (confirmar, finalizar, buscar, etc.)
5. Voltar ao dashboard ou continuar trabalhando

## Paleta de Cores

### Cores Primárias
- **Primary**: `#0a7ea4` (azul profissional)
- **Background**: `#ffffff` (light) / `#151718` (dark)
- **Surface**: `#f5f5f5` (light) / `#1e2022` (dark)
- **Foreground**: `#11181C` (light) / `#ECEDEE` (dark)

### Cores de Status
- **Success**: `#22C55E` (verde) - agendamentos confirmados/concluídos
- **Warning**: `#F59E0B` (amarelo) - agendamentos pendentes
- **Error**: `#EF4444` (vermelho) - cancelamentos
- **Muted**: `#687076` (light) / `#9BA1A6` (dark) - textos secundários

### Cores Específicas
- **Pending**: `#3498db` (azul claro) - status pendente
- **Admin**: `#02200e` (verde escuro) - botão admin
- **Client**: `#5355c2` (roxo) - botão cliente

## Tipografia
- **Títulos**: Bold, tamanho 24-32px
- **Subtítulos**: Semibold, tamanho 16-20px
- **Corpo**: Regular, tamanho 14-16px
- **Labels**: Medium, tamanho 12-14px

## Componentes Reutilizáveis
1. **ServiceCard**: Card de serviço com nome, preço, duração
2. **AppointmentCard**: Card de agendamento com status colorido
3. **MetricCard**: Card de métrica no dashboard
4. **ActionButton**: Botão de ação primária com feedback tátil
5. **StatusBadge**: Badge de status com cores semânticas
6. **DatePicker**: Seletor de data customizado
7. **TimePicker**: Seletor de horário customizado

## Interações
- **Feedback tátil**: Haptic em todas as ações principais
- **Animações**: Transições suaves (200-300ms)
- **Loading states**: Indicadores durante operações assíncronas
- **Confirmações**: Dialogs para ações destrutivas (cancelar, excluir)
- **Toasts**: Notificações de sucesso/erro

## Armazenamento
- **Local**: AsyncStorage para dados offline
- Estrutura de dados:
  - `services`: lista de serviços
  - `appointments`: lista de agendamentos
  - `config`: configurações da barbearia (nome, WhatsApp, horários)
  - `adminPassword`: senha do administrador

## Funcionalidades Especiais
- **Integração WhatsApp**: Enviar confirmação de agendamento via WhatsApp
- **Modo Offline**: Funciona completamente offline
- **Autenticação Admin**: Senha para acessar painel administrativo
- **Filtros e Busca**: Busca por cliente, filtro por data/status
