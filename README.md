## gs-space-dashboard — Painel de logística espacial

Este repositório contém um aplicativo multiplataforma (Expo + React Native + TypeScript) desenvolvido como um dashboard para logística espacial, com rastreamento de cargas, visualizações de telemetria e integração básica de clima.

Principais funcionalidades
- Navegação com `expo-router` (páginas: Home, Tracking, Settings, Explore)
- Context API para preferências (tema) com persistência em `AsyncStorage`
- Formulário de registro de cargas (`TrackingForm`) com validação e armazenamento local
- Dashboards com gráficos (`react-native-chart-kit`) e cartões de métricas
- Visualizador de imagens de satélite (mock) e serviço de telemetria simulado

Requisitos atendidos (resumo)
- Projeto criado com Expo e `expo-router` configurado (entry em `package.json`)
- Ao menos 3 rotas: `src/app/index.tsx`, `src/app/tracking.tsx`, `src/app/settings.tsx` (ver `src/app`)
- Uso de `useState` e `useEffect` em vários componentes
- Context API implementada em `src/context/app-preferences-context.tsx` e persistida com `AsyncStorage`
- Formulário com validação em `src/components/tracking-form.tsx`
- Dashboards e gráficos em `src/app/index.tsx` e `src/components/charts/*`

Instalação

```bash
npm install
npx expo start
```

Executando testes

```bash
npm test
```

Documentos de entrega
- `entrega.txt` — arquivo com nomes, RMs e links (modelo criado no repositório)
- `VIDEO_INSTRUCTIONS.md` — instruções para gravar e enviar o vídeo de demonstração

Screenshots e vídeo
- Adicione prints na pasta `assets/screenshots/` e atualize este README com os links das imagens.
- Grave um vídeo de até 3 minutos demonstrando o app e coloque o link no `entrega.txt`.

Notas e próximos passos
- O README atual foi expandido com o resumo do projeto; adicione prints e o link do vídeo quando disponíveis.

---

