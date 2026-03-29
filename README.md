# 🚨 SafeWalk - Aplicativo Localizador de Emergências

**Um aplicativo móvel para detecção de quedas e alertas de emergência usando React Native + Expo**

[![Expo](https://img.shields.io/badge/Expo-v54-black?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/Testes-26%20Aprovados-green?style=flat-square&logo=jest)](./src/services/__tests__)

## 📱 Visão Geral

SafeWalk é um MVP funcional (Produto Viável Mínimo) projetado para ajudar usuários a permanecer seguros por:

- ✅ **Detecção Automática de Quedas** - Usando acelerômetro do dispositivo (20Hz, janela de 750ms)
- ✅ **Alertas de Emergência** - Com coordenadas GPS em tempo real
- ✅ **Botão de Pânico Manual** - Acionamento de emergência com um toque
- ✅ **Gerenciamento de Contatos** - Armazenar informações de contatos de emergência
- ✅ **Histórico de Alertas** - Rastrear todos os alertas com timestamps e dados de localização
- ✅ **Persistência de Dados** - AsyncStorage para funcionalidade offline-first
- ✅ **Visualização em Mapa** - Ver alertas com cálculos de distância

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **Android Studio** (para emulador) ou app **Expo Go**

### Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start

# 3. Executar no seu dispositivo
#    Pressione 'a' para emulador Android
#    Pressione 'i' para simulador iOS
#    Ou escaneie código QR com app Expo Go
```

### Executar Testes

```bash
# Executar todos os 26 testes
npx jest

# Modo watch (reexecutar ao alterar arquivos)
npx jest --watch

# Com relatório de cobertura
npx jest --coverage
```

---

## 📂 Estrutura do Projeto

```
SafewalkApp/
├── src/
│   ├── components/              # Componentes React UI
│   │   ├── PanicButton.tsx      # Botão de gatilho de emergência
│   │   ├── AlertOverlay.tsx     # Modal de alerta com contagem regressiva
│   │   └── DataCards.tsx        # Exibição de dados de sensores
│   │
│   ├── screens/                 # Telas da aplicação
│   │   ├── HomeScreen.tsx       # Tela principal de monitoramento
│   │   ├── MapScreen.tsx        # Mapa de alertas com histórico
│   │   ├── SettingsScreen.tsx   # Configurações de contatos de emergência
│   │   └── HistoryScreen.tsx    # Histórico detalhado de alertas
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useFallDetection.ts  # Algoritmo de detecção de quedas
│   │   ├── useLocation.ts       # Rastreamento de GPS
│   │   └── useSensorsAndLocation.ts # Hook sensor combinado
│   │
│   ├── services/                # Lógica de negócio
│   │   ├── alertService.ts      # Gerenciamento de alertas
│   │   ├── validationService.ts # Validação de dados
│   │   ├── logService.ts        # Log de debug
│   │   └── __tests__/           # Testes unitários (26 testes)
│   │
│   ├── context/                 # Gerenciamento de estado
│   │   └── AlertContext.tsx     # Estado global + AsyncStorage
│   │
│   ├── types/                   # Definições TypeScript
│   ├── utils/                   # Funções auxiliares
│   └── styles/                  # Tema e tokens de design
│
├── app/                         # Configuração Expo router
├── assets/                      # Ícones e telas iniciais
├── REQUISITOS.md                # Especificação de requisitos (RF + RNF)
├── RELATORIO_TECNICO.md         # Relatório técnico com arquitetura
├── jest.config.js               # Configuração Jest
├── .babelrc                     # Configuração Babel
├── tsconfig.json                # Configuração TypeScript
├── app.json                     # Configuração Expo
├── eas.json                     # Configuração EAS build
└── package.json                 # Dependências e scripts
```

---

## 🛠️ Stack Tecnológico

| Categoria                | Tecnologia                 | Versão   | Propósito                      |
| ------------------------ | -------------------------- | -------- | ------------------------------ |
| **Framework**            | React Native               | 0.81.5   | Mobile multiplataforma         |
| **Ferramenta Build**     | Expo                       | 54.0.33  | Desenvolvimento e deploy       |
| **Linguagem**            | TypeScript                 | Latest   | Type safety                    |
| **Gerenciamento Estado** | Context API + AsyncStorage | Built-in | Estado global + persistência   |
| **Sensores**             | expo-sensors               | 55.0.9   | Acesso acelerômetro            |
| **Localização**          | expo-location              | 55.1.4   | Rastreamento GPS               |
| **Testes**               | Jest + Babel               | 30.2.0   | Testes unitários               |
| **UI**                   | NativeWind                 | 4.2.3    | Tailwind CSS para React Native |

---

## 🧪 Testes

### Cobertura de Testes

**26 Testes Unitários** cobrindo:

- ✅ Validação de contatos (nome, telefone, email)
- ✅ Validação de localização (limites lat/long)
- ✅ Gerenciamento de histórico de alertas
- ✅ Formatação e normalização de números de telefone
- ✅ Cenários de integração do serviço de alertas

### Executar Testes

```bash
npx jest                    # Executar todos os testes
npx jest --watch           # Modo contínuo
npx jest --coverage        # Relatório de cobertura
```

**Últimos Resultados:**

```
Test Suites: 2 passed, 2 total
Tests:       26 passed, 26 total ✅
Snapshots:   0 total
Time:        1.654 s
```

---

## 🔑 Recursos Principais

### Algoritmo de Detecção de Quedas

```
Entrada:  Acelerômetro @ 20Hz
Janela:   Histórico de 750ms (15 leituras)
Disparo:  2+ picos > 5.5 m/s²
Debounce: Timeout de 3000ms
```

### Persistência de Dados

```
Chaves AsyncStorage:
- @safewalk_contact → Info de contato de emergência
- @safewalk_history → Últimos 50 alertas

Carrega automaticamente na inicialização
Salva automaticamente ao alterar
```

### Integração GPS

```
Intervalo de Atualização: A cada 5 segundos
Precisão: ~5-10m (ACCESS_FINE_LOCATION)
Fallback: Localização aproximada se indisponível
```

---

## 📦 Compilação para Produção

### Validar Antes da Compilação

```bash
npm run validate-build
```

### Gerar APK

```bash
# Build preview (para testes)
npm run build:android:preview

# Build de produção
npm run build:android:production
```

**Requisitos:**

- Expo CLI: `eas-cli` instalado
- Conta Expo: `eas login`
- Tempo de compilação: ~10-15 minutos

---

## 🔐 Permissões Android

Todas as permissões declaradas em `app.json`:

```json
{
  "ACCESS_FINE_LOCATION": "GPS de alta precisão",
  "ACCESS_COARSE_LOCATION": "GPS de fallback",
  "BODY_SENSORS": "Acelerômetro",
  "INTERNET": "Conectividade de rede",
  "ACCESS_NETWORK_STATE": "Status de rede"
}
```

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                           # Iniciar servidor dev Expo
npm run android                     # Executar no emulador Android
npm run ios                         # Executar no simulador iOS
npm run web                         # Executar no navegador web

# Testes e Qualidade
npm test                            # Executar testes Jest
npm run test:watch                  # Modo watch
npm run test:coverage               # Relatório de cobertura
npm run lint                        # Validação ESLint

# Compilação
npm run validate-build              # Validação pré-compilação
npm run build:android:preview       # Build preview APK
npm run build:android:production    # Build production APK
npm run build:status                # Verificar status de compilação
npm run build:list                  # Listar compilações anteriores
```

---

## 🤝 Contribuição

Este é um projeto acadêmico para **Unifor - Universidade de Fortaleza** (Disciplina N700 - Desenvolvimento para Plataformas Móveis).

### Equipe do Projeto

- **Disciplina:** N700 - Desenvolvimento para Plataformas Móveis
- **Instituição:** Unifor - Universidade de Fortaleza
- **Data de Entrega:** 30 de março de 2026


