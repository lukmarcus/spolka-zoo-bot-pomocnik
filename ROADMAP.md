# Spółka ZOO - Bot Pomocnik - Roadmapa

## 🎯 Plan rozwoju 0.4.x - Kompletna implementacja kodów gry

| Wersja | Status       | Opis                           | Timeline   | Szczegóły techniczne                 |
| ------ | ------------ | ------------------------------ | ---------- | ------------------------------------ |
| 0.4.0  | ✅ Gotowe    | Osobne talie dla każdego bota  | 2025-09-13 | Individual bot decks, mode selection |
| 0.4.1  | 🎯 Aktywne   | ZS Single-Bot + stabilizacja   | 2025-09-27 | ZS format, walidacja, fixes          |
| 0.4.2  | � Planowane  | ZM Multi-Shared implementation | ~3-4 dni   | Multi-bot shared deck format         |
| 0.4.3  | 🚧 Planowane | ZP Per-Bot implementation      | ~3-4 dni   | Per-bot independent decks format     |
| 0.4.4  | � Planowane  | Tests + finalizacja            | ~2-3 dni   | Comprehensive tests, polish          |

## 🔮 Przyszłe wersje (post 0.4.x)

| Wersja | Status        | Opis                 | Szczegóły techniczne           |
| ------ | ------------- | -------------------- | ------------------------------ |
| 0.5.0  | 🔮 Przyszłość | Wizualizacja kart    | Card visualization system      |
| 0.6.0+ | 🔮 Przyszłość | Zaawansowane funkcje | Statistics, tournaments, cloud |

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

## 📋 Szczegółowy rozwój 0.4.x

### v0.4.1 - ZS Single-Bot + Stabilizacja ✅

**🎯 Główny cel**: Implementacja ZS Single-Bot format + fixes

**✅ Zrealizowane funkcje:**

- **ZS Single-Bot Format**

  - Prefix `ZS` + card sequence (0-9,A-C alphabet)
  - Human-readable format dla jednego bota
  - Dynamic length (3-15 chars) zależnie od postępu gry

- **Zaawansowana walidacja**

  - ✅ Brak duplikatów kart (np. `ZS66666` odrzucane)
  - ✅ Automatyczny zakres 0-12 (via decoding + uniqueness)
  - ✅ Kontrola liczby kart 1-13 w sekwencji
  - ✅ Eliminacja stanów ujemnych i pustych (0/13)

- **UI Improvements**

  - ✅ Real-time validation w LoadGameModal
  - ✅ Preview stanu gry (pozycja X/13) przed wczytaniem
  - ✅ Proper error messages dla różnych formatów
  - ✅ Usunięto komunikat "🏁 Talia wyczerpana"

- **Technical Fixes** (commits w v0.4.1):

  - ✅ Icon sizes optimization (`icon sizes changed`)
  - ✅ Reshuffle logic refactor (`small reshuffle refactor`)
  - ✅ GameStorage.ts rewrite (single authoritative implementation)
  - ✅ Backward compatibility z ZOO legacy format

- **Documentation**
  - ✅ GAME-CODES.md przepisane (ZS main, ZM/ZP planned, ZOO legacy)
  - ✅ README.md + CHANGELOG.md update
  - ✅ Roadmapa 0.4.x (ten plik: DOCS.md → ROADMAP.md)### v0.4.2 - ZM Multi-Shared Implementation 🚧

**🎯 Cel**: Format ZM dla wielu botów z wspólną talią  
**⏱️ Timeline**: ~3-4 dni po v0.4.1

**🚀 Planowane funkcje:**

- **ZM Format Implementation**

  - Struktura: `ZM[bots][current][card][remaining]`
  - Przykład: `ZM325AC278B6413` (3 boty, aktualny=2, obecna=5)
  - Encoding/decoding w gameStorage.ts

- **Multi-Bot Logic**

  - Parsing liczby botów (2-4)
  - Walidacja aktualnego bota (1-based index)
  - Shared deck management logic

- **UI Support**

  - LoadGameModal update dla ZM validation
  - Preview logic dla multi-bot scenarios
  - Error messages specyficzne dla ZM

- **Testing**
  - Basic round-trip tests ZM ↔ GameState
  - Edge cases: invalid bot count, out-of-range current bot

---

### v0.4.3 - ZP Per-Bot Implementation 🚧

**🎯 Cel**: Format ZP dla niezależnych talii każdego bota  
**⏱️ Timeline**: ~3-4 dni po v0.4.2

**🚀 Planowane funkcje:**

- **ZP Format Implementation**

  - Struktura: `ZP[bots][current][card]Z[bot1]Z[bot2]Z[bot3]...`
  - Przykład: `ZP321Z5Z23Z678` (per-bot sequences)
  - Complex parsing z separatorami Z

- **Per-Bot Logic**

  - Independent deck management per bot
  - Z-separator parsing algorithm
  - Cross-bot validation (no duplicate cards across bots)

- **Advanced UI**

  - Complete ZP support w LoadGameModal
  - Multi-bot preview z per-bot progress
  - Sophisticated error messages dla complex format

- **Comprehensive Testing**
  - Per-bot sequence validation
  - Cross-bot uniqueness checks
  - Complex edge cases (empty bot sequences, invalid separators)

---

### v0.4.4 - Comprehensive Tests & Finalization 🚧

**🎯 Cel**: Production-ready quality dla wszystkich formatów  
**⏱️ Timeline**: ~2-3 dni po v0.4.3

**🚀 Planowane funkcje:**

- **Full Test Suite**

  - Unit tests dla wszystkich formatów: ZS, ZOO, ZM, ZP
  - Round-trip encoding/decoding tests
  - Edge cases i boundary conditions
  - Cross-format compatibility tests

- **Performance & Polish**

  - Optimization dla większej liczby botów
  - Memory usage optimization
  - UI/UX final improvements
  - Error handling refinement

- **Final Documentation**
  - Complete GAME-CODES.md update
  - API documentation dla wszystkich functions
  - Usage examples i best practices
  - Migration guide ZOO → ZS/ZM/ZP

---

## 🔮 Post-0.4.x Development

### v0.5.0 - Wizualizacja kart �

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
