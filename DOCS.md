# Spółka ZOO - Bot Pomocnik

## 🎯 Plan rozwoju - przyszłe wersje

| Wersja | Status       | Opis                          | Szczegóły techniczne                       |
| ------ | ------------ | ----------------------------- | ------------------------------------------ |
| 0.3.0  | ✅ Aktualna  | Wsparcie dla wielu botów      | Multi-bot architecture z jedną talią       |
| 0.3.1  | 🔜 Planowana | Poprawki multi-bot            | Bug fixes, UX improvements dla wielu botów |
| 0.4.0  | 🔜 Planowana | Osobne talie dla każdego bota | Individual bot decks                       |
| 0.5.0  | 🔜 Planowana | Wizualizacja kart             | Card visualization system                  |

### v0.3.1 - Poprawki multi-bot 🔜

**Cel**: Polerowanie funkcjonalności wielu botów i poprawki UX

- [ ] **Potencjalne poprawki multi-bot**
  - Optymalizacja przełączania botów na mobile
  - Lepsze visual feedback przy zmianie bota
  - Edge case handling (np. przełączanie przy wyczerpaniu talii)
- [ ] **UX improvements**
  - Keyboard shortcuts dla przełączania botów (1-4)
  - Better accessibility dla screen readers
  - Tooltip hints dla nowych użytkowników
- [ ] **Code quality**
  - Refaktoring multi-bot logic
  - Performance optimization
  - Extended test coverage

### v0.4.0 - Osobne talie 🔜

**Cel**: Opcja osobnych talii dla każdego bota

- [ ] **Wybór trybu gry**
  - "Wspólna talia" (obecny system v0.3.0)
  - "Osobne talie" (nowy system v0.4.0)
- [ ] **Zarządzanie wieloma taliami**
  - Każdy bot ma własną sekwencję kart
  - Niezależne `currentCardIndex` dla każdego bota
  - Osobne `usedCards` tracking
- [ ] **Rozszerzone kodowanie v2**
  - 17-19 znaków: wspólna talia (v0.3.0)
  - 29/44/57 znaków: osobne talie (v0.4.0)
  - Format: [Bot1Sequence][Bot1Pos][Bot2Sequence][Bot2Pos]...[CurrentBot]
- [ ] **UI mode selection**
  - Radio buttons w bot selection
  - Visual indicators dla aktywnego trybu
  - Tooltip z wyjaśnieniem różnic

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

## � Dokumentacja techniczna

### 🏗️ Architektura

- **Frontend**: React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- **Style**: CSS Modules
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

### 🔧 Aktualna architektura GameState (v0.3.0)

```typescript
interface GameState {
  currentCardIndex: number; // 0-12, pozycja w talii
  cardSequence: number[]; // 13 kart, permutacja 0-12
  usedCards: number[]; // karty użyte w bieżącej rundzie
  botsSelected?: boolean; // Czy wybrano liczbę botów (v0.3.0+)
  botCount?: number; // Liczba botów 1-4 (v0.3.0+)
  currentBot?: number; // Aktualny bot 1-X (v0.3.0+)
}
```

### 🎮 GameContext Actions

- `DRAW_CARD` - dobieranie karty
- `SHUFFLE_DECK` - tasowanie talii
- `RESET_GAME` - reset do stanu początkowego
- `NEW_GAME` - nowa gra
- `LOAD_GAME` - wczytywanie stanu gry
- `SELECT_BOTS` - wybór liczby botów (v0.3.0+)
- `SWITCH_BOT` - przełączanie aktualnego bota (v0.3.0+)

### 💾 System kodów gry

- **Format**: `ZOO` + sekwencja kart + pozycja + multi-bot data
- **Długość**: 17 znaków (1 bot) | 19 znaków (2-4 boty)
- **Przykład**: `ZOOA0CB5938416274`
- **Cross-device**: Pełna kompatybilność między urządzeniami
