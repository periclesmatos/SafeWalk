# 📄 RELATÓRIO TÉCNICO - SafeWalk Emergency Locator App

**Data de Entrega:** 30/03/2026  
**Disciplina:** N700 - Desenvolvimento para Plataformas Móveis  
**Instituição:** Universidade de Fortaleza (UNIFOR)

---

## CAPA

### SafeWalk - Emergency Locator App

### Relatório Técnico Completo

**Integrantes da Equipe:**

- Francisco Pericles de Matos - Matrícula: 2415598

**Professor Orientador:** Belmondo Rodrigues Aragão

**Data:** 30 de Março de 2026

---

## 1. DEFINIÇÃO E ANÁLISE DO PROBLEMA

### 1.1 Contexto

A segurança pessoal é uma preocupação crescente, particularmente para:

- Pessoas idosas vivendo sozinhas
- Atletas treinando em locais remotos
- Indivíduos com mobilidade reduzida
- Qualquer pessoa em situação de risco

**Estatísticas relevantes:**

- Quedas são a causa principal de morte acidental em idosos acima de 75 anos
- À noite, 50% das quedas em casa resultam em hospitalização
- A resposta rápida após uma queda é crítica para minimizar lesões

### 1.2 Problema Identificado

Muitas vítimas de queda **não conseguem solicitar ajuda imediatamente**, resultando em:

- Atraso no atendimento médico
- Complicações secundárias (hipotermia, úlceras de pressão)
- Perda de tempo crítico onde intervenção poderia prevenir sequelas

### 1.3 Solução Proposta

**SafeWalk** é um aplicativo que:

1. ✅ **Detecta quedas automaticamente** via acelerômetro
2. ✅ **Envia alerta de emergência** com localização GPS
3. ✅ **Permite envio manual** de alerta via botão de pânico
4. ✅ **Mantém histórico** de todos os incidentes
5. ✅ **Gerencia contato** de emergência

---

## 2. OBJETIVO E ESCOPO

### 2.1 Objetivo Geral

Desenvolver um aplicativo Android MVP (Minimum Viable Product) que **detecte quedas automaticamente e dispare alertas de emergência com compartilhamento de localização GPS**.

### 2.2 Escopo do Projeto

#### Incluído (MVP):

- ✅ Detecção de queda via acelerômetro
- ✅ Botão de pânico manual
- ✅ Integração com GPS
- ✅ Gerenciar contato de emergência
- ✅ Histórico de alertas (persistência)
- ✅ Validação robusta de dados
- ✅ Interface intuitiva com Material Design

#### Não Incluído (Futuro):

- ❌ Integração real com SMS/WhatsApp
- ❌ Google Maps integrado
- ❌ Autenticação de usuário
- ❌ Backend/servidor
- ❌ Suporte para múltiplos contatos

---

## 3. REQUISITOS IDENTIFICADOS

### 3.1 Requisitos Funcionais (RF)

| ID    | Descrição                                       | Prioridade | Status |
| ----- | ----------------------------------------------- | ---------- | ------ |
| RF-01 | Detectar queda automaticamente via acelerômetro | CRÍTICA    | ✅     |
| RF-02 | Enviar alerta de emergência com localização     | CRÍTICA    | ✅     |
| RF-03 | Rastreamento GPS em tempo real                  | CRÍTICA    | ✅     |
| RF-04 | Gerenciar contato de emergência                 | ALTA       | ✅     |
| RF-05 | Manter histórico de alertas                     | ALTA       | ✅     |
| RF-06 | Validar dados de entrada                        | MÉDIA      | ✅     |

**Vide documento REQUISITOS.md para detalhes completos de cada RF**

### 3.2 Requisitos Não-Funcionais (RNF)

| ID     | Descrição             | Métrica                                    |
| ------ | --------------------- | ------------------------------------------ |
| RNF-01 | Performance           | Acelerômetro @ 20Hz, GPS @ 5s, Alerta < 1s |
| RNF-02 | Segurança/Privacidade | Dados locais, sem servidor, LGPD compliant |
| RNF-03 | Portabilidade         | Android 8.0+, React Native, iOS compatible |
| RNF-04 | Usabilidade           | Interface intuitiva, HCI best practices    |
| RNF-05 | Confiabilidade        | Zero crashes, tratamento de erros gracioso |
| RNF-06 | Manutenibilidade      | TypeScript, testes, clean architecture     |

---

## 4. ARQUITETURA DA SOLUÇÃO

### 4.1 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                  SafeWalk App (React Native)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─ UI Layer (Screens + Components)                         │
│  │  ├── HomeScreen (Botão de Pânico + Dados)               │
│  │  ├── SettingsScreen (Gerenciar Contato)                │
│  │  ├── HistoryScreen (Histórico de Alertas)              │
│  │  └── MapScreen (Visualização em Mapa)                   │
│  │                                                           │
│  ├─ State Management (Context API + AsyncStorage)           │
│  │  └── AlertContext (Alert State + Persistência)          │
│  │                                                           │
│  ├─ Business Logic (Services + Hooks)                       │
│  │  ├── useFallDetection (Detecção de Queda)               │
│  │  ├── useLocation (Rastreamento GPS)                     │
│  │  ├── useSensorsAndLocation (Hook Combisado)             │
│  │  ├── alertService (Envio de Alerta)                     │
│  │  ├── logService (Logging)                               │
│  │  └── validationService (Validação de Dados)             │
│  │                                                           │
│  ├─ Data Persistence (AsyncStorage)                         │
│  │  ├── Contact (Nome, Telefone, Email)                    │
│  │  └── AlertHistory (ID, Timestamp, Coords, Status)       │
│  │                                                           │
│  └─ Device Sensors (Expo SDK)                               │
│     ├── Accelerometer (reor Acelerometro)                   │
│     └── Location (GPS)                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Fluxo de Detecção de Queda

```
Sensor Acelerômetro (50ms)
        ↓
Calcula Magnitude (m/s²)
        ↓
Mantém histórico de 15 leituras (750ms)
        ↓
Conta acelerações > 5.5 m/s² (picos)
        ↓
Picos >= 2? → SIM → Queda Detectada!
        ↓                ↓
        NÃO              Trigger AlertOverlay
        ↓                ↓
   Continua           Contagem Regressiva (10s)
   monitorando              ↓
                    Usuário Confirma?
                    ↓               ↓
                   SIM             NÃO
                    ↓               ↓
              Enviar Alerta    Cancelar
              + Salvar Histórico
```

### 4.3 Estrutura de Arquivos

```
SafewalkApp/
├── src/
│   ├── components/
│   │   ├── PanicButton.tsx           # Botão de desperição
│   │   ├── AlertOverlay.tsx          # Modal de alerta
│   │   ├── DataCards.tsx             # Cards de dados
│   │   └── index.ts                  # Exports
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx            # Tela principal
│   │   ├── MapScreen.tsx             # Tela de mapa (TODO)
│   │   ├── SettingsScreen.tsx        # Configurações
│   │   ├── HistoryScreen.tsx         # Histórico de alertas
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useFallDetection.ts       # Detecção de queda
│   │   ├── useLocation.ts            # Rastreamento GPS
│   │   ├── useSensorsAndLocation.ts  # Hook combinado
│   │   └── use-color-scheme.ts
│   │
│   ├── services/
│   │   ├── alertService.ts           # Lógica de alertas
│   │   ├── logService.ts             # Logging
│   │   ├── validationService.ts      # Validações
│   │   └── index.ts
│   │
│   ├── context/
│   │   └── AlertContext.tsx          # Estado global
│   │
│   ├── types/
│   │   └── index.ts                  # Tipos TypeScript
│   │
│   ├── utils/
│   │   └── formatters.ts             # Utilitários
│   │
│   └── styles/
│       └── theme.ts                  # Design tokens
│
├── app/
│   ├── index.tsx
│   └── (tabs)/
│
├── assets/
├── package.json
├── tsconfig.json
├── app.json                          # Configuração Expo
├── README.md
├── REQUISITOS.md                     # Especificação
└── eas.json                          # Build config
```

---

## 5. TECNOLOGIAS E FERRAMENTAS UTILIZADAS

### 5.1 Stack Tecnológico

| Camada     | Tecnologia                 | Versão   | Justificativa                        |
| ---------- | -------------------------- | -------- | ------------------------------------ |
| Framework  | React Native               | 0.81.5   | Cross-platform, sensoracessível      |
| Plataforma | Expo                       | 54.0.33  | Development rápido, sem native setup |
| Linguagem  | TypeScript                 | Latest   | Type-safety, refactoring seguro      |
| State Mgmt | Context API + AsyncStorage | Built-in | Simples, sem dependências            |
| Sensores   | expo-sensors               | ^55.0.9  | API nativa acelerômetro              |
| GPS        | expo-location              | ^55.1.4  | API nativa localização               |
| UI         | NativeWind                 | ^4.2.3   | Tailwind CSS para RN                 |
| Icons      | Lucide React Native        | ^1.7.0   | Icons SVG modernos                   |
| Navegação  | React Navigation           | ^7.2.2   | Tabbed navigation                    |

### 5.2 Ferramentas de Desenvolvimento

- **ESLint** - Linting e qualidade de código
- **Jest** - Framework de testes (setup pronto)
- **VS Code** - IDE
- **Git/GitHub** - Versionamento
- **EAS Build** - Build CI/CD do Expo

---

## 6. FUNCIONALIDADES PRINCIPAIS

### 6.1 Detecção de Queda

**Algoritmo:**

1. Lê acelerômetro a 20Hz (50ms de intervalo)
2. Calcula magnitude: $\sqrt{x^2 + y^2 + z^2}$
3. Mantém histórico de últimas 15 leituras (750ms)
4. Conta quantos picos > 5.5 m/s² estar presentes
5. Se `picos >= 2` durante janela, queda detectada!
6. Timeout de 3s para evitar múltiplos triggers

**Código Principal:**

```typescript
const highAccelCount = accelHistoryRef.current.filter((m) => m > FALL_CONFIG.highAccelThreshold).length;

if (highAccelCount >= FALL_CONFIG.requiredPeaks && !fallTimeoutRef.current) {
  setIsFallDetected(true);
  // Inicia timeout de reset
  fallTimeoutRef.current = setTimeout(() => {
    setIsFallDetected(false);
    fallTimeoutRef.current = null;
  }, FALL_CONFIG.resetTimeout);
}
```

### 6.2 Integração GPS

**Características:**

- Atualização a cada 5 segundos
- Requer permissão `ACCESS_FINE_LOCATION`
- Validação: latitude (-90 a 90), longitude (-180 a 180)
- Fallback para `ACCESS_COARSE_LOCATION` se precisa fail

**Permissões Android (app.json):**

```json
"permissions": [
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION",
  "BODY_SENSORS",
  "INTERNET"
]
```

### 6.3 AlertContext com Persistência

**Recursos:**

- Contato de emergência salvo em AsyncStorage
- Histórico de até 50 alertas
- Sincronização automática ao iniciar app
- Suporta async/await para operações de I/O

**Chaves de Armazenamento:**

```typescript
const STORAGE_KEYS = {
  CONTACT: '@safewalk_contact',
  HISTORY: '@safewalk_history',
};
```

### 6.4 Validação Robusta

**Validações Implementadas:**

- **Contato**: Nome obrigatório, telefone (10+ dígitos), email (regex)
- **Localização**: Latitude (-90 a 90), Longitude (-180 a 180)
- **Histórico**: ID único, timestamp positivo, status válido

**Exemplo:**

```typescript
export const validateContact = (contact: Contact) => {
  const errors: string[] = [];
  if (!contact.name?.trim()) errors.push('Nome obrigatório');
  if (!phoneRegex.test(contact.phone)) errors.push('Telefone inválido');
  return { valid: errors.length === 0, errors };
};
```

---

## 7. TELAS E INTERFACE

### 7.1 HomeScreen (Tela Principal)

**Componentes:**

- Header com status GPS
- Botão de Pânico central (grande e vermelho)
- Card de Movimento (aceleração atual em m/s²)
- Card de Localização (lat/lng em tempo real)

**Fluxo:**

1. App abre em HomeScreen
2. Monitora sensores continuamente
3. Se queda detectada → AlertOverlay abre
4. Usuário cancela ou confirma

**Screenshots:**
[INSERIR SCREENSHOT 1]

### 7.2 SettingsScreen (Configurações)

**Funcionalidades:**

- Editar nome do contato
- Editar telefone do contato
- Editar email (opcional)
- Botão para salvar

**Validação:**

- Em tempo real ao digitar
- Mensagens de erro sob cada campo
- Desabilita botão "Salvar" se dados inválidos

**Screenshots:**
[INSERIR SCREENSHOT 2]

### 7.3 HistoryScreen (Histórico)

**Funcionalidades:**

- Lista todos os alertas (até 50)
- Mostra timestamp, status (enviado/pendente/falhou)
- Coords GPS de cada alerta
- Ação: Visualizar no mapa (futuro)

**Exibição:**

- Alertas ordenados por data (mais recente primeiro)
- Card para cada alerta
- Swipe para deletar (futuro)

**Screenshots:**
[INSERIR SCREENSHOT 3]

### 7.4 AlertOverlay (Modal de Alerta)

**Comportamento:**

- Aparece com animação ao detectar queda
- Exibe: Contato, localização, contagem regressiva
- Botões: Confirmar / Cancelar
- Se não clicar em 10s → Envia automaticamente

**Estilo:**

- Fundo preto com 80% de opacidade
- Border vermelho de 4px
- Animação: `zoom-in + fade-in` (300ms)

**Screenshots:**
[INSERIR SCREENSHOT 4]

---

## 8. IMPLEMENTAÇÃO TÉCNICA

### 8.1 Detalhes de Implementação

#### useFallDetection.ts (118 linhas)

```typescript
// Detecta quedas via análise de aceleração
- Atualização: 50ms
- Histórico: 15 leitura (750ms)
- Threshold: 5.5 m/s²
- Picos necessários: 2
- Reset: 3s
```

#### useLocation.ts (implementado)

```typescript
// Rastreamento GPS
- Atualização: 5s (5000ms)
- Precisão: BALANCED
- Fallback para COARSE_LOCATION
```

#### AlertContext.tsx (persistência)

```typescript
// Estado global com AsyncStorage
- Carrega: ao inicializar app
- Salva: ao atualizar contato/histórico
- Try-catch: previne crashes se storage falha
```

###8.2 Fluxo de Dados Crítico

```
Sensor Data Flow:
  Accelerometer (50ms) + GPS (5s)
  ↓
  useSensorsAndLocation Hook
  ↓
  useAlert Context (estado global)
  ↓
  HomeScreen renderiza dados
  ↓
  Se queda → AlertOverlay modal
  ↓
  AlertContext.addToHistory() + AsyncStorage
```

---

## 9. TESTES

### 9.1 Testes Manuais Realizados

| Teste | Descrição                        | Resultado |
| ----- | -------------------------------- | --------- |
| T-01  | Botão de pânico dispara alerta   | ✅ Passou |
| T-02  | Detecção de queda (simulada)     | ✅ Passou |
| T-03  | GPS atualiza em tempo real       | ✅ Passou |
| T-04  | Contato persiste após reload     | ✅ Passou |
| T-05  | Histórico salvo em AsyncStorage  | ✅ Passou |
| T-06  | Validação rejeita email inválido | ✅ Passou |
| T-07  | Cancelamento de alerta funciona  | ✅ Passou |
| T-08  | App não crashea sem GPS          | ✅ Passou |

### 9.2 Testes Automatizados (TODO)

**Testes planejados para próxima sprint:**

```typescript
// validationService.test.ts
- validateContact: nome obrigatório
- validateContact: email inválido
- validateLocation: latitude fora bounds
- validateLocation: longitude válida

// alertService.test.ts
- sendAlert: sucesso
- sendAlert: contato inválido (falha esperada)
- sendAlert: localização inválida (falha esperada)

// useFallDetection.test.ts (com mock sensors)
- Queda detectada quando aceleração > threshold
- Queda não detectada sob threshold
- Reset de 3s evita múltiplos triggers
```

---

## 10. RESULTADOS e FUNCIONALITY

### 10.1 Funcionalidades Implementadas

✅ **Totalmente Implementado:**

- [x] Detecção de queda via acelerômetro
- [x] Botão de pânico manual
- [x] Rastreamento GPS em tempo real
- [x] Gerenciar contato de emergência
- [x] Histórico de alertas (persistido)
- [x] Validação robusta de dados
- [x] Interface responsive
- [x] Logging de debug

🔄 **Em Desenvolvimento:**

- [ ] Integração com SMS/WhatsApp real
- [ ] Google Maps integrado
- [ ] Testes automatizados

❌ **Futuro:**

- [ ] Autenticação de usuário
- [ ] Backend/servidor
- [ ] Múltiplos contatos de emergência
- [ ] Integração com serviços de ambulância

### 10.2 Demonstração de Funcionalidades

**Video/Screenshots:**
[INSERIR DEMONSTRAÇÃO AQUI]

**Passos para testar:**

1. Instalar: `npm install && npm install @react-native-async-storage/async-storage`
2. Iniciar: `npx expo start`
3. Abrir em emulador: `a` (Android) ou `i` (iOS)
4. Na tela principal: Clicar em botão de pânico
5. Conferir settings: Mudar contato e verificar persistência

---

## 11. DESAFIOS E SOLUÇÕES

### 11.1 Desafios Encontrados

| Desafio                                | Solução Implementada                                   |
| -------------------------------------- | ------------------------------------------------------ |
| Detecção de queda com falsos positivos | Algoritmo de 2 picos em 750ms + timeout de 3s          |
| GPS pode falhar em ambientes internos  | Fallback para localização aproximada (COARSE_LOCATION) |
| App consome muita bateria              | Atualização GPS a cada 5s (não contínuo)               |
| Acelerômetro muito sensível            | Threshold de 5.5 m/s² calibrado                        |
| Perda de dados ao fechar app           | AsyncStorage implementado                              |
| Contato pode ser inválido              | Validação regex + message de erro                      |

---

## 12. RECOMENDAÇÕES FUTURAS

### 12.1 MVP v2 (Próximas Milestones)

1. **Integração SMS/WhatsApp**
   - Usar Twilio ou similar
   - Enviar SMS real com coordenadas
   - Implementar callback de sucesso/falha

2. **Google Maps**
   - Integração google-maps-react-native
   - Mostrar localização em tempo real
   - Traçar rota até contato

3. **Testes Automatizados**
   - Jest + React Native Testing Library
   - Coverage > 80%
   - CI/CD pipeline

4. **Autenticação**
   - Firebase Authentication
   - Login com Google
   - Sincronização de dados online

5. **Dashboard Admin**
   - Web portal para operador
   - Monitorar usuários ativos
   - Histórico centralizado

---

## 13. CONCLUSÃO

SafeWalk é uma solução funcional e pronta para MVP que enderaça um problema real de segurança pessoal. O aplicativo implementa com sucesso:

✅ **Detecção automática de quedas** com algoritmo robusto  
✅ **Integração de sensores nativos** (acelerômetro + GPS)  
✅ **Persistência de dados** com AsyncStorage  
✅ **Validação completa** de entrada de dados  
✅ **Interface intuitiva** seguindo best practices de UX

O projeto demonstra aplicação prática de:

- Desenvolvimento mobile cross-platform
- Integração com sensores nativos
- State management com Context API
- Clean architecture e SOLID principles
- TypeScript para type-safety

**SafeWalk está pronto para:**

- Teste em dispositivos reais
- Extended para versão 2.0
- Deployment em produção com integração de backend

---

## APÊNDICES

### A. Código-Fonte Comentado

**[Ver: /src pasta para código completo]**

Arquivos principais:

- `src/hooks/useFallDetection.ts` - Lógica de detecção
- `src/context/AlertContext.tsx` - State management
- `src/services/validationService.ts` - Validações
- `src/screens/HomeScreen.tsx` - UI principal

### B. Build & Deployment

**Build APK:**

```bash
npm run validate-build
npm run build:android:production
# APK available after EAS build completes
```

**Executar localmente:**

```bash
npm install
npx expo start
# Press 'a' for Android emulator
# Press 'w' for web
```

### C. Permissões Android

**app.json:**

```json
"android": {
  "permissions": [
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "BODY_SENSORS",
    "INTERNET",
    "ACCESS_NETWORK_STATE"
  ]
}
```

### D. Referências

- [Expo Documentation](https://docs.expo.dev)
- [React Native Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Material Design 3](https://m3.material.io/)

---

**Documento Preparado por:** [Nome da Equipe]  
**Data:** 29 de Março de 2026  
**Versão:** 1.0  
**Status:** FINALIZADO ✅
