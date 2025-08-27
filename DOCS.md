# Spółka ZOO - Bot Pomocnik

## 🎯 Plan rozwoju - przyszłe wersje

| Wersja | Status | Opis | Szczegóły techniczne |
| ------ | ------------ | ---------------------------------------- | ---------------------------------------------- | |
| 0.2.3 | ✅ Ukończona | Live preview stanu gry + modal improvements | Game state detection + dedykowane CSS + UX |
| 0.2.4 | 🔜 Planowana | Poprawki UI/UX | Toast animations, button styling improvements |
| 0.3.0 | 🔜 Planowana | Wsparcie dla wielu botów | Multi-bot architecture |
| 0.4.0 | 🔜 Planowana | Osobne talie dla każdego bota | Individual bot decks |
| 0.5.0 | 🔜 Planowana | Wizualizacja kart | Card visualization system |

### 🎯 Plan rozwoju - szczegóły techniczne

## 📚 Dokumentacja techniczna

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

## 🎯 Plan rozwoju - szczegóły techniczne

### v0.2.3 - Live preview stanu gry + modal improvements ✅

**Cel**: Wykrywanie stanu gry przed wczytaniem + poprawa UX LoadGameModal

- ✅ **Wykrywanie stanu gry na podstawie kodu**
  - Dekodowanie kodu bez pełnego wczytywania gry (previewGameCode funkcja)
  - Podgląd informacji: liczba botów, aktualny bot, postęp gry, status talii
  - Live preview podczas wpisywania kodu w czasie rzeczywistym
  - Walidacja czy kod jest prawidłowy przed próbą wczytania
- ✅ **Poprawki modalu wczytywania**
  - Lepszy interfejs wprowadzania kodu z live preview
  - Inteligentna walidacja od pierwszego znaku (prefix "ZOO")
  - Filtrowanie nieprawidłowych znaków w czasie rzeczywistym
  - Zachowanie pozycji kursora podczas edycji
  - Uproszczone komunikaty błędów
  - Przycisk aktywny tylko przy prawidłowym kodzie
- ✅ **Dedykowany CSS module**
  - LoadGameModal.module.css - własny plik stylów
  - Zastąpienie inline styles klasami CSS
  - Responsive design z mobile-first approach
  - Lepsza organizacja stylów
- ✅ **Przygotowanie pod multi-bot format v0.3.0**
  - Rozpoznawanie kodów 1-4 botów
  - Wyświetlanie aktualnego bota dla multi-bot
  - Rozszerzone GameCodePreview interface (currentBot field)
  - Infrastructure dla przyszłych rozszerzeń

### v0.2.4 - Poprawki UI/UX 🔜

**Cel**: Polerowanie interfejsu użytkownika

- [ ] **Poprawki toastu kopiowania**
  - Animacja znikania (fade out)
  - Lepszy wygląd (cień, zaokrąglenia)
  - Responsywność na małych ekranach
- [ ] **Styling przycisków kopiowania**
  - Lepsze pozycjonowanie w modalu wyjścia
  - Konsystentne ikony i kolory
  - Hover effects i animacje
- [ ] **Drobne poprawki UX**
  - Lepsze komunikaty błędów
  - Improved accessibility

### v0.3.0 - Wiele botów 🔜

**Cel**: Support dla 1-4 botów na jednej talii

- [ ] Wybór liczby botów (1-4) w menu
- [ ] Generowanie imion botów z puli tematycznej
- [ ] Przełączanie między botami (tabs/swipe)
- [ ] Rozszerzone kodowanie stanu dla wielu botów

### v0.4.0 - Osobne talie 🔜

**Cel**: Opcja osobnych talii dla każdego bota

- [ ] Wybór trybu: "Jedna talia" vs "Osobne talie"
- [ ] Zarządzanie wieloma taliami
- [ ] Format kodu gry v2 dla wielu talii

### v0.5.0 - Wizualizacja kart 🔜

**Cel**: Graficzne przedstawienie kart

- [ ] Design kart botów (CSS/SVG)
- [ ] Ikony dla różnych efektów kart
- [ ] Animacje dobierania kart

## 🔧 Save/Load System Architecture

### v0.2.3 (current) - Ultra-kompaktowy system kodów + live preview

**Cel**: Kody gry z live preview i inteligentną walidacją. System automatycznie wykrywa stan gry przed wczytaniem.

- Format: 17 znaków (1 bot) lub 19 znaków (2-4 boty)
- Przykład: `ZOOA0CB5938416274`
- Live preview: liczba botów, aktualny bot, postęp gry
- Walidacja w czasie rzeczywistym od pierwszego znaku
- System automatycznie rozpoznaje tryb gry na podstawie długości kodu

### GameState Structure

```typescript
interface GameState {
  currentCardIndex: number; // 0-12
  cardSequence: number[]; // 13 kart, permutacja 0-12
  usedCards: number[]; // karty użyte w bieżącej rundzie
  botCount?: number; // liczba botów (opcjonalnie)
  currentBot?: number; // aktualny bot (opcjonalnie)
}
```

## 🎮 Komponenty

### BaseModal

Uniwersalny modal bazujący na ConfirmModal.module.css

### LoadGameModal

Modal do wczytywania gry z:
- Live preview stanu gry (GameCodePreview)
- Inteligentną walidacją w czasie rzeczywistym  
- Dedykowanymi stylami CSS (LoadGameModal.module.css)
- Obsługą multi-bot format (currentBot detection)

### GameContext

State management z useReducer:

- `DRAW_CARD` - dobieranie karty
- `SHUFFLE_DECK` - tasowanie talii
- `RESET_GAME` - reset do stanu początkowego
- `LOAD_GAME` - wczytywanie stanu gry

## 🎨 Design System

### Kolory (z instrukcji gry)

- **Tło**: Żółto-zielone gradientowe
- **Nagłówki**: Brązowe (#8B4513)
- **Karty**: Kremowe tło z pomarańczowo-brązowymi ramkami
- **Przyciski**: Brązowe z hover effects

### Layout

- **Mobile-first**: 320px+ portrait mode
- **Desktop**: max-width 480px, wycentrowane
- **Responsywność**: WCAG 2.1 compliance

### CSS Architecture

- CSS Modules dla komponentów
- CSS Custom Properties dla kolorów
- Utility classes dla backgroundów
- BEM-like naming w modułach
