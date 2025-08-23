# Spółka ZOO - Bot Pomocnik

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

## 🎯 Plan rozwoju

### v0.2.1 - Cross-device kody gry 🔜

**Cel**: Naprawienie systemu kodów dla działania między urządzeniami

- [ ] Usunięcie localStorage dependency z kodów gry
- [ ] Embedding rzeczywistych danych w kodach Base64
- [ ] LZ-String compression ALBO custom hex encoding
- [ ] Testy cross-device functionality

### v0.2.2 - UX improvements 🔜

**Cel**: Uproszczenie interfejsu modali

- [ ] Analiza "over-engineered" modali
- [ ] Prostszy single-button approach
- [ ] Lepsze instrukcje użycia

### v0.2.3 - Optymalizacja kodów 🔜

**Cel**: Najkrótsze możliwe kody

- [ ] Custom hex encoding (25 vs 175 znaków)
- [ ] Preparing dla multi-bot format v0.3.0

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

### v0.2.0 (current) - localStorage-only

```typescript
// ZEPSUTY SYSTEM - tylko lokalne kody
generateShareableCode() → localStorage.setItem(code, data) → zwraca krótki kod
loadFromShareableCode() → localStorage.getItem(code) → działa tylko lokalnie
```

**Problem**: Kody typu `ZOOABC123` nie zawierają danych!

### v0.2.1 (planned) - Embedded data

**Opcja A - LZ-String**:

```typescript
// 175 znaków, przetestowane
gameState → JSON → LZ.compressToBase64() → ZOO + base64string
```

**Opcja B - Custom hex**:

```typescript
// 25 znaków, ultra-kompaktowe
gameState → custom hex encoding → ZOO + hexstring
// Przykład: ZOO572B08391C64A5572B0811
```

### GameState Structure

```typescript
interface GameState {
  currentCardIndex: number; // 0-12 (4 bity)
  cardSequence: number[]; // 13 kart * 4 bity = 52 bity
  usedCards: number[]; // max 13 * 4 bity = 52 bity
  shuffleCount: number; // 0-255 (8 bitów)
  gameStarted: boolean; // 1 bit
}
// Razem: ~117 bitów = 15 bajtów = 20 znaków Base64
```

## 🎮 Komponenty

### BaseModal

Uniwersalny modal bazujący na ConfirmModal.module.css

### ShareGameModal

Modal do generowania kodów gry z przyciskiem kopiowania

### LoadGameModal

Modal do wczytywania gry z walidacją kodów

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
