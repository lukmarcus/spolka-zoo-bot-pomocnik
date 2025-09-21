# Spółka ZOO - Bot Pomocnik - Plan Rozwoju

## 🎯 Roadmapa przyszłych wersji

| Wersja | Status        | Opis                              | Szczegóły techniczne                                          |
| ------ | ------------- | --------------------------------- | ------------------------------------------------------------- |
| 0.4.0  | ✅ Aktualna   | Osobne talie dla każdego bota     | Individual bot decks                                          |
| 0.4.1  | 🔜 Planowana  | System zapisu i odczytu stanu gry | Save/load system (export/import kompaktowych kodów, autosave) |
| 0.5.0  | 🔜 Planowana  | Wizualizacja kart                 | Card visualization system                                     |
| 0.6.0+ | 🔮 Przyszłość | Zaawansowane funkcje              | Statistics, tournaments, cloud sync                           |

## 📋 Szczegółowe plany rozwoju

### v0.4.0 - Osobne talie dla każdego bota 🔜

**Cel**: Opcja osobnych talii dla każdego bota

- [x] **Wybór trybu gry**

  - [x] "Wspólna talia" (obecny system)
  - [x] "Osobne talie" (nowy system) — implemented: per-bot decks, per-bot current index and usedCards
  - [x] Radio buttons / mode chooser in the selection UI (shown for 2-4 bots)

- [x] **Zarządzanie wieloma taliami**

  - [x] Każdy bot ma własną sekwencję kart (`botDecks` implemented)
  - [x] Niezależne `currentCardIndex` dla każdego bota
  - [x] Osobne `usedCards` tracking per bot

- [ ] **Rozszerzone kodowanie v2**

  - [ ] Rozszerzone kodowanie v2: planowane (kodowanie kompaktowe dla osobnych talii) — not yet implemented

- [ ] **UI mode selection**

  - [x] UI mode selection: visual mode chooser and indicators are implemented
  - [x] Removed top-line remaining cards & deck-exhausted visuals as per UX decision
  - [x] Per-mode action buttons and per-bot shuffle behavior implemented in GameContext and UI

  ### v0.4.1

  Prace związane z systemem zapisu i odczytu stanu gry (eksport/import kompaktowych kodów dla osobnych talii, autosave, walidacja) oraz drobne refaktory reducer'a.

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
