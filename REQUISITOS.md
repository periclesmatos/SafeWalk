# 📋 Especificação de Requisitos - SafeWalk

**Projeto:** SafeWalk - Emergency Locator App  
**Data:** 29/03/2026  
**Instituição:** Unifor - Universidade de Fortaleza  
**Disciplina:** N700 - Desenvolvimento para Plataformas Móveis

---

## 1. Descrição do Problema

### Contexto

A segurança pessoal é uma preocupação crescente em áreas urbanas. Pessoas idosas, atletas e indivíduos com mobilidade reduzida estão vulneráveis a quedas. Muitas vezes, após uma queda, a vítima não consegue solicitar ajuda imediatamente, o que pode resultar em complicações sérias.

### Desafio

Desenvolver uma solução mobile que:

- Detecte automaticamente quedas do usuário
- Envie alertas de emergência para um contato de confiança
- Compartilhe a localização GPS em tempo real
- Forneca um registro de histórico de incidentes

---

## 2. Objetivos do Projeto

### Objetivo Geral

Desenvolver um aplicativo Android minimamente viável (MVP) que detecte quedas automaticamente e dispare alertas de emergência com localização GPS.

### Objetivos Específicos

- ✅ Implementar detecção de queda via acelerômetro
- ✅ Integrar GPS para rastreamento em tempo real
- ✅ Criar interface intuitiva para usuários
- ✅ Alertar contato de emergência em menos de 10 segundos
- ✅ Manter histórico de alertas
- ✅ Gerenciar contato de emergência
- ✅ Validar dados de entrada

---

## 3. Requisitos Funcionais

### RF-01: Detectar Queda Automaticamente

**Descrição:** O sistema deve detect ar quedas através do acelerômetro do dispositivo

**Critérios de Aceite:**

- Acelerômetro deve ser lido a 20 Hz (50ms de intervalo)
- Histórico de 15 leituras (750ms) deve ser mantido
- Must detectar magnitude de aceleração > 5.5 m/s²
- Requer 2+ picos em janela de tempo
- Valor de resetTimeout: 3 segundos
- Dispara `AlertOverlay` com contagem regressiva de 10 segundos

**Prioridade:** CRÍTICA

---

### RF-02: Enviar Alerta de Emergência

**Descrição:** O sistema deve enviar alerta com localização para contato de emergência

**Critérios de Aceite:**

- Alerta inclui nome do contato e telefone
- Coordenadas GPS são incluídas no alerta
- Botão "Botão de Pânico" permite envio manual
- Usuário pode cancelar alerta em até 10 segundos
- Alerta é registrado no histórico com timestamp

**Prioridade:** CRÍTICA

---

### RF-03: Rastreamento GPS em Tempo Real

**Descrição:** O sistema deve fornecer localização atualizada continuamente

**Critérios de Aceite:**

- GPS atualizado a cada 5 segundos
- Requer permissão de "Localização Precisa"
- Latitude/Longitude validadas (±90/±180)
- Coordenadas exibidas em tempo real na tela
- Fallback para localização aproximada se precisa falhar

**Prioridade:** CRÍTICA

---

### RF-04: Gerenciar Contato de Emergência

**Descrição:** Usuário pode visualizar e editar contato de emergência

**Critérios de Aceite:**

- Nome e telefone são obrigatórios
- Email é opcional
- Validação de telefone (mínimo 10 dígitos)
- Validação de email (formato padrão)
- Dados são persistidos no dispositivo
- Tela de configurações permite edição

**Prioridade:** ALTA

---

### RF-05: Manter Histórico de Alertas

**Descrição:** Sistema deve registrar todos os alertas disparados

**Critérios de Aceite:**

- Cada alerta inclui: ID, timestamp, latitude, longitude, status
- Máximo de 50 alertas armazenados
- Histórico exibido em tela dedicada
- Alertas permitem visualização de coordenadas no mapa
- Dados persistem entre sessões

**Prioridade:** ALTA

---

### RF-06: Validar Dados de Entrada

**Descrição:** Sistema deve validar todos os dados antes de processar

**Critérios de Aceite:**

- Contato: validar nome, telefone, email
- Localização: validar latitude/longitude
- Histórico: validar ID, timestamp, status
- Exibir mensagens de erro legíveis
- Impedir salvamento de dados inválidos

**Prioridade:** MÉDIA

---

## 4. Requisitos Não-Funcionais

### RNF-01: Performance

- Acelerômetro: lido a 20 Hz sem lag
- GPS: atualização a cada 5 segundos
- Alerta disparado em < 1 segundo após detecção
- App responsiva com tempo de resposta < 500ms

---

### RNF-02: Segurança e Privacidade

- Dados persistidos localmente (não enviados para servidor)
- Permissões solicitadas de forma clara
- Sem coleta de dados desnecessários
- Mensagens de erro não expõem dados sensíveis

---

### RNF-03: Portabilidade

- Compatible com Android 8.0+
- Desenvolvido com React Native (roda em iOS/Web também)
- Testado em múltiplos dispositivos
- Suporta orientação portrait

---

### RNF-04: Usabilidade

- Interface intuitiva e clara
- Botão de pânico de fácil acesso
- Instruções visuais para cada tela
- Feedback visual e haptico ao disparar alerta

---

### RNF-05: Confiabilidade

- Zero crashes em teste manual
- Tratamento de erros gracioso
- Recuperação automática de falhas de GPS
- Logging de debug para troubleshooting

---

### RNF-06: Manutenibilidade

- Código bem estruturado e comentado
- TypeScript para type-safety
- Arquitetura limpa (separation of concerns)
- Testes automatizados para componentes críticos

---

## 5. Arquitetura

### Estrutura de Diretórios

```
src/
├── components/           # Componentes reutilizáveis
│   ├── PanicButton.tsx
│   ├── AlertOverlay.tsx
│   └── DataCards.tsx
├── screens/             # Telas principais
│   ├── HomeScreen.tsx
│   ├── MapScreen.tsx
│   ├── SettingsScreen.tsx
│   └── HistoryScreen.tsx
├── hooks/               # Custom hooks
│   ├── useFallDetection.ts
│   ├── useLocation.ts
│   └── useSensorsAndLocation.ts
├── services/            # Lógica de negócios
│   ├── alertService.ts
│   ├── logService.ts
│   └── validationService.ts
├── context/             # State management
│   └── AlertContext.tsx
├── types/               # Tipos TypeScript
│   └── index.ts
├── utils/               # Funções utilitárias
│   └── formatters.ts
└── styles/              # Design tokens
    └── theme.ts
```

### Fluxo de Dados

```
Acelerômetro + GPS → useSensorsAndLocation Hook
                              ↓
                    useFallDetection Analysis
                              ↓
                    Falls Detected? → Yes
                              ↓
                    AlertContext.triggerAlert()
                              ↓
                    AlertOverlay exibe ao usuário
                              ↓
                    Usuário confirma ou cancela
                              ↓
                    alertService.sendAlert() →  AsyncStorage.save()
```

### Tecnologias Utilizadas

- **React Native**: Framework mobile
- **Expo**: Build tools e SDK
- **TypeScript**: Type safety
- **expo-sensors**: Acelerômetro
- **expo-location**: GPS
- **expo-notifications**: Notificações push
- **AsyncStorage**: Persistência local
- **Context API**: State management
- **NativeWind**: Tailwind CSS para React Native

---

## 6. Critérios de Aceite do MVP

- [x] Detectar queda com acelerômetro
- [x] Botão de pânico funcional
- [x] GPS ativo e exibido
- [x] Contato persistido no dispositivo
- [x] Histórico de alertas
- [x] Validação de dados
- [x] Interface responsiva
- [ ] Integração real com SMS/WhatsApp (futuro)
- [ ] Google Maps integrado (futuro)
- [ ] Testes automatizados (em andamento)

---

## 7. Prototipagem

### Telas Implementadas

1. **HomeScreen**: Botão de pânico central, dados de movimento e GPS
2. **SettingsScreen**: Gerenciar contato de emergência
3. **HistoryScreen**: Listar histórico de alertas
4. **MapScreen**: Placeholder para integração de mapa (futuro)

### Mockup

Ver arquivo `Safewalk.html` para prototipagem interativa

---

## 8. Plano de Testes

### Testes Manual

- [x] Testar botão de pânico
- [x] Testar detecção de queda (simulação)
- [x] Testar GPS em múltiplos locais
- [x] Testar persistência de dados
- [x] Testar validação de contato
- [ ] Testar em dispositivo real

### Testes Automatizados (TODO)

- [ ] Validação de contato
- [ ] Validação de localização
- [ ] Detecção de queda (mock sensors)
- [ ] AlertService com mocks

---

## 9. Cronograma de Desenvolvimento

| Fase                  | Duração | Status          |
| --------------------- | ------- | --------------- |
| Análise de Requisitos | 2h      | ✅ Concluído    |
| Prototipagem          | 3h      | ✅ Concluído    |
| Desenvolvimento MVP   | 8h      | ✅ Concluído    |
| Testes e Bugs         | 2h      | 🔄 Em andamento |
| Documentação          | 2h      | 🔄 Em andamento |
| **TOTAL**             | **17h** |                 |

---

## 10. Entregáveis Finais

- [x] Código-fonte comentado (GitHub)
- [x] APK compilado (para teste em Android)
- [ ] Relatório Técnico em PDF
- [ ] Screenshots da aplicação
- [ ] Testes automatizados
- [ ] Manual do usuário

---

**Documento Versão:** 1.1  
**Última Atualização:** 29/03/2026  
**Responsável:** Equipe SafeWalk
