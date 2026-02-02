# Manual do Aplicativo - Barbearia do Carioca

## Visão Geral

O **Barbearia do Carioca** é um aplicativo móvel completo para gerenciamento de barbearia, desenvolvido com React Native e Expo. O app permite que clientes façam agendamentos de forma simples e que administradores gerenciem todo o negócio em um único lugar.

## Funcionalidades Principais

### Para Clientes

O aplicativo oferece uma experiência simplificada para agendamento de serviços:

1. **Agendamento Rápido**: O cliente acessa a tela inicial e seleciona a opção "SOU CLIENTE - Quero Agendar"
2. **Formulário Intuitivo**: Preenche nome, telefone/WhatsApp, escolhe o serviço desejado, data e horário
3. **Validação em Tempo Real**: O sistema verifica automaticamente a disponibilidade dos horários
4. **Confirmação via WhatsApp**: Após o agendamento, o cliente pode enviar uma mensagem de confirmação diretamente para a barbearia via WhatsApp

### Para Administradores

O painel administrativo oferece controle completo sobre o negócio:

#### Dashboard Principal
- **Métricas em Tempo Real**: Visualização de agendamentos do dia, pendentes e receita
- **Acesso Rápido**: Menu com todas as funcionalidades administrativas

#### Gestão de Agendamentos
- **Confirmar Agendamentos**: Lista de todos os agendamentos pendentes com opção de confirmar ou rejeitar
- **Agenda do Dia**: Visualização cronológica de todos os agendamentos confirmados, com filtro por data
- **Finalizar Atendimentos**: Marcar atendimentos como concluídos após a realização do serviço

#### Busca e Cancelamento
- **Buscar Cliente**: Sistema de busca por nome ou telefone, exibindo todo o histórico do cliente
- **Cancelar Agendamento**: Cancelamento de agendamentos por ID, com confirmação de segurança

#### Relatórios e Gestão
- **Relatório Financeiro**: Análise completa do mês com receita total, número de atendimentos, ticket médio, serviço mais vendido e receita por dia
- **Gerenciar Serviços**: CRUD completo de serviços (adicionar, editar, excluir) com nome, preço e duração

## Estrutura de Dados

### Serviços Padrão

O aplicativo vem pré-configurado com os seguintes serviços:

| Serviço | Preço | Duração |
|---------|-------|---------|
| Corte Simples | R$ 30,00 | 30 min |
| Corte + Barba | R$ 50,00 | 45 min |
| Barba | R$ 25,00 | 20 min |
| Corte Desfarcado | R$ 40,00 | 60 min |

### Status de Agendamentos

Os agendamentos podem ter os seguintes status:

- **Pendente**: Agendamento realizado pelo cliente, aguardando confirmação
- **Agendado**: Confirmado pelo administrador
- **Concluído**: Atendimento finalizado
- **Cancelado**: Agendamento cancelado

## Configurações

### Senha do Administrador

A senha padrão para acesso ao painel administrativo é **1234**. Esta senha é armazenada localmente no dispositivo.

### Horário de Funcionamento

O aplicativo está configurado com o seguinte horário padrão:
- **Início**: 09:00
- **Término**: 20:00

Os horários disponíveis para agendamento são gerados automaticamente em intervalos de 30 minutos.

### Informações da Barbearia

- **Nome**: Barbearia do Carioca
- **WhatsApp**: +55 21 97104-1394

## Armazenamento de Dados

O aplicativo utiliza **AsyncStorage** para armazenamento local de todos os dados:

- **Serviços**: Lista de serviços oferecidos
- **Agendamentos**: Histórico completo de agendamentos
- **Configurações**: Informações da barbearia e preferências
- **Senha Admin**: Senha de acesso ao painel administrativo

Todos os dados são persistidos localmente no dispositivo, permitindo que o aplicativo funcione completamente offline.

## Interface e Design

### Tema

O aplicativo suporta modo claro e escuro, adaptando-se automaticamente às preferências do sistema operacional do dispositivo.

### Cores Principais

- **Primary**: Azul profissional (#0a7ea4)
- **Admin**: Verde escuro (#02200e)
- **Client**: Roxo (#5355c2)
- **Success**: Verde (#22C55E)
- **Warning**: Amarelo (#F59E0B)
- **Error**: Vermelho (#EF4444)

### Feedback Tátil

O aplicativo utiliza feedback háptico (vibração) em ações importantes:
- Toque em botões principais
- Confirmação de ações
- Alertas de sucesso ou erro

## Navegação

### Fluxo do Cliente

1. Tela Inicial → Botão "SOU CLIENTE"
2. Tela de Agendamento → Preencher formulário
3. Confirmação → Opção de enviar WhatsApp
4. Retorno à tela inicial

### Fluxo do Administrador

1. Tela Inicial → Botão "ADMINISTRADOR"
2. Tela de Login → Inserir senha
3. Dashboard → Escolher função desejada
4. Executar tarefa específica
5. Retornar ao dashboard ou continuar gerenciando

## Requisitos Técnicos

### Plataformas Suportadas

- **iOS**: iPhone e iPad
- **Android**: Smartphones e tablets
- **Web**: Navegadores modernos

### Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo SDK 54**: Ferramentas e APIs nativas
- **TypeScript**: Tipagem estática
- **NativeWind**: Estilização com Tailwind CSS
- **AsyncStorage**: Armazenamento local
- **React Navigation**: Navegação entre telas

## Dicas de Uso

### Para Clientes

- Sempre verifique a disponibilidade do horário antes de confirmar
- Guarde o ID do seu agendamento para facilitar consultas
- Use a opção de WhatsApp para confirmar com a barbearia

### Para Administradores

- Confirme os agendamentos pendentes regularmente
- Finalize os atendimentos assim que concluídos para manter a agenda atualizada
- Consulte o relatório financeiro ao final de cada mês
- Mantenha os serviços atualizados com preços e durações corretas

## Suporte

Para dúvidas ou problemas com o aplicativo, entre em contato através do WhatsApp: **+55 21 97104-1394**

---

**Desenvolvido com React Native • © 2024 Barbearia do Carioca**
