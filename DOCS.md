# Spółka ZOO - Bot Pomocnik - Plan Rozwoju

## 🎯 Roadmapa przyszłych wersji

| Wersja | Status        | Opis                           | Szczegóły techniczne                |
| ------ | ------------- | ------------------------------ | ----------------------------------- |
| 0.3.4  | ✅ Aktualna   | Finalne usprawnienia mechaniki | Komunikaty gry, UX, kody kart       |
| 0.3.5  | 🎯 Następna   | Prawdziwe teksty i ikony kart  | Real card content, proper icons     |
| 0.4.0  | 🔜 Planowana  | Osobne talie dla każdego bota  | Individual bot decks                |
| 0.5.0  | 🔜 Planowana  | Wizualizacja kart              | Card visualization system           |
| 0.6.0+ | 🔮 Przyszłość | Zaawansowane funkcje           | Statistics, tournaments, cloud sync |

## 📋 Szczegółowe plany rozwoju

### v0.3.4 - Finalne usprawnienia mechaniki ✅ UKOŃCZONE

**Cel**: Finalne usprawnienia komunikatów i UX

- [x] **Ulepszenia komunikatów gry**

  - ✅ Bardziej opisowe komunikaty dla akcji botów
  - ✅ Lepsze etykiety przycisków i modali
  - ✅ Spójne ikonki w komunikatach

- [x] **Lepsze wskaźniki stanu gry**

  - ✅ Ujednolicone style wskaźników bota i karty
  - ✅ Usunięta podwójna ramka z wskaźnika bota
  - ✅ Dodany gap między dolnymi przyciskami

- [x] **Usprawienia kart botów**

  - ✅ Usunięte nazwy i numery kart z interfejsu
  - ✅ Nowa logika opisów efektów (Efekt/Pierwszy efekt/etc.)

- [x] **Oczyszczenie kodu**
  - ✅ Usunięte niepotrzebne pliki CSS
  - ✅ Zoptymalizowany bundle size

### v0.3.5 - Prawdziwe teksty i ikony kart 🎯

**Cel**: Integracja prawdziwych treści kart ze Spółki ZOO

- [ ] **Autentyczne ikony kart**

  - Ikony reprezentujące prawdziwe efekty kart
  - Spójny system wizualny dla różnych typów efektów
  - Wysokiej jakości grafiki dopasowane do stylu gry

- [ ] **Rzeczywiste opisy efektów**

  - Oryginalne teksty efektów kart z gry planszowej
  - Poprawne tłumaczenie mechanik na język cyfrowy
  - Precyzyjne opisy działania każdego efektu

- [ ] **Integracja z bazą danych kart**
  - Strukturalna organizacja danych o kartach
  - Łatwa rozszerzalność o nowe karty
  - Optymalizacja ładowania treści

### v0.4.0 - Osobne talie dla każdego bota 🔜

**Cel**: Opcja osobnych talii dla każdego bota

- [ ] **Wybór trybu gry**

  - "Wspólna talia" (obecny system)
  - "Osobne talie" (nowy system)
  - Radio buttons w interfejsie wyboru botów

- [ ] **Zarządzanie wieloma taliami**

  - Każdy bot ma własną sekwencję kart
  - Niezależne `currentCardIndex` dla każdego bota
  - Osobne `usedCards` tracking per bot

- [ ] **Rozszerzone kodowanie v2**

  - 17-19 znaków: wspólna talia (current)
  - 29/44/57 znaków: osobne talie (new)
  - Format: [Bot1Sequence][Bot1Pos][Bot2Sequence][Bot2Pos]...[CurrentBot]

- [ ] **UI mode selection**
  - Visual indicators dla aktywnego trybu
  - Tooltip z wyjaśnieniem różnic między trybami
  - Podgląd różnic w mechanice gry

**Architektura techniczna**:

```typescript
interface GameState {
  mode: "shared" | "individual";
  botDecks?: BotDeck[]; // Dla trybu individual
  // ...existing fields dla shared mode
}

interface BotDeck {
  botId: number;
  cardSequence: number[];
  currentCardIndex: number;
  usedCards: number[];
}
```

### v0.5.0 - Wizualizacja kart 🔜

**Cel**: Graficzne przedstawienie kart zamiast tekstu

- [ ] **Design systemu kart**

  - SVG/CSS design kart botów
  - Ikony dla różnych efektów kart
  - Spójny design language z grą planszową

- [ ] **Animacje kart**

  - Smooth animacje dobierania kart
  - Flip animation przy odsłanianiu karty
  - Tasowanie deck animation

- [ ] **Responsive card display**
  - Adaptive sizing dla różnych ekranów
  - Touch-friendly interactions
  - Card preview modal dla małych ekranów

### v0.6.0+ - Zaawansowane funkcje 🔮

**Cel**: Funkcje dla doświadczonych graczy

- [ ] **Game statistics**

  - Historia ruchów i częstotliwość kart
  - Analytics dashboard
  - Export danych do CSV/JSON

- [ ] **Advanced game modes**

  - Timer mode z countdown
  - Tournament mode z wieloma rundami
  - Practice mode z możliwością undo

- [ ] **Enhanced save system**
  - Multiple save slots (slot 1, 2, 3...)
  - Cloud backup integration
  - Game session replay

## 📖 Dokumentacja techniczna

### 🏗️ Aktualna architektura (v0.3.3)

- **Frontend**: React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- **Style**: CSS Modules z zoo-tematyczną paletą kolorów
- **State Management**: React Context + useReducer
- **Routing**: React Router DOM 7.8.1
- **Build**: Vite
- **Linting**: ESLint

### 📁 Struktura projektu

```
src/
├── components/         # Komponenty React (Layout, modals)
├── pages/             # Strony aplikacji (Home, Game)
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── utils/             # Funkcje pomocnicze
├── types/             # TypeScript definitions
├── data/              # Dane gry (karty, etc.)
├── styles/            # Globalne style CSS
└── assets/            # Obrazy, ikony, czcionki
```

### 🔧 GameState Interface

```typescript
interface GameState {
  currentCardIndex: number; // 0-12, pozycja w talii
  cardSequence: number[]; // 13 kart, permutacja 0-12
  usedCards: number[]; // karty użyte w bieżącej rundzie
  botsSelected?: boolean; // Czy wybrano liczbę botów
  botCount?: number; // Liczba botów 1-4
  currentBot?: number; // Aktualny bot 1-X
}
```

### 🎮 GameContext Actions

- `DRAW_CARD` - dobieranie karty
- `SHUFFLE_DECK` - tasowanie talii
- `RESET_GAME` - reset do stanu początkowego
- `NEW_GAME` - nowa gra
- `LOAD_GAME` - wczytywanie stanu gry
- `SELECT_BOTS` - wybór liczby botów
- `NEXT_BOT` - przełączanie na następnego bota (v0.3.3+)
- `NEXT_BOT_AND_DRAW` - przełączanie i dobieranie karty (v0.3.3+)

### 💾 System kodów gry

- **Format**: `ZOO` + sekwencja kart + pozycja + multi-bot data
- **Długość**: 17 znaków (1 bot) | 19 znaków (2-4 boty)
- **Przykład**: `ZOOA0CB5938416274`
- **Cross-device**: Pełna kompatybilność między urządzeniami
