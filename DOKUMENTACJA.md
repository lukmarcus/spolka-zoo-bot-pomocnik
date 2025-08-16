# Spółka ZOO - Bot Pomocnik

## Dokumentacja projektu

### Opis projektu

Aplikacja webowa pomocnicza do gry planszowej "Spółka ZOO" - zastępuje fizyczne karty botów (13 kart) cyfrowym rozwiązaniem. Umożliwia grę z 1-4 botami, zarządzanie ich kartami i zapisywanie stanu gry.

### Technologie

- **Frontend**: React + TypeScript + Vite
- **Style**: CSS Modules / Styled Components (do ustalenia)
- **State Management**: React Context + useReducer
- **Build**: Vite
- **PWA**: Service Worker + Web App Manifest
- **Przyszłość**: Capacitor dla APK (Google Play Store)

---

## Funkcjonalności

### 🎯 Wersja 0.0.1 - Podstawowa struktura

**Status**: 🔜 Planowana
**Cel**: Setup projektu i podstawowa nawigacja

**Funkcjonalności**:

- [ ] Setup React + TypeScript + Vite
- [ ] Podstawowy routing (React Router)
- [ ] Responsywny layout dla telefonów (portrait)
- [ ] Komponenty: Header, Navigation, Layout
- [ ] Podstawowe style i kolory tematyczne

**Pliki do stworzenia**:

- `src/App.tsx` - główny komponent
- `src/components/Layout.tsx` - layout aplikacji
- `src/pages/Home.tsx` - strona główna
- `src/pages/Game.tsx` - ekran gry
- `src/styles/` - style globalne

---

### 🎯 Wersja 0.1.0 - Podstawowa mechanika bota

**Status**: 🔜 Planowana
**Cel**: Działający bot z jedną talią 13 kart

**Funkcjonalności**:

- [ ] System 13 kart bota (definicje kart)
- [ ] Ekran gry z jednym botem
- [ ] Wyświetlanie aktualnej karty (tekst)
- [ ] Licznik użytych kart (X/13)
- [ ] Przycisk "Dobierz kartę" z potwierdzeniem
- [ ] Przycisk powrotu do menu z ostrzeżeniem
- [ ] Automatyczne przetasowanie po wyczerpaniu talii

**Komponenty**:

- `BotCard.tsx` - wyświetlanie karty
- `GameControls.tsx` - przyciski sterowania
- `CardCounter.tsx` - licznik kart
- `ConfirmDialog.tsx` - dialogi potwierdzenia

**Stan gry**:

```typescript
interface GameState {
  currentCardIndex: number;
  cardSequence: number[]; // shuffled sequence 0-12
  usedCards: number[];
  shuffleCount: number;
}
```

---

### 🎯 Wersja 0.2.0 - Zapis i wczytywanie gry

**Status**: 🔜 Planowana
**Cel**: Możliwość zapisywania i przywracania stanu gry

**Funkcjonalności**:

- [ ] System kodowania stanu gry (Base64)
- [ ] Generowanie kodu gry (przycisk "Kopiuj stan")
- [ ] Wczytywanie gry z kodu (input w menu)
- [ ] Walidacja kodu gry z checksum
- [ ] LocalStorage - auto-save ostatniej gry
- [ ] Ostrzeżenie przy wyjściu z niezapisaną grą

**Format kodu gry v1**:

```
[wersja][bot_count][current_card][sequence][checksum]
Przykład: v1_1_03_4a7b29c15d8e639_a4b2
```

**Komponenty**:

- `GameCodeInput.tsx` - input dla kodu
- `SaveGameButton.tsx` - przycisk zapisu
- `GameCodeValidator.ts` - walidacja kodu

---

### 🎯 Wersja 0.3.0 - Wiele botów na jednej talii

**Status**: 🔜 Planowana
**Cel**: Support dla 1-4 botów korzystających z jednej talii

**Funkcjonalności**:

- [ ] Wybór liczby botów (1-4) w menu
- [ ] Generowanie imion botów z puli tematycznej
- [ ] Przełączanie między botami (tabs/swipe)
- [ ] Jeden licznik kart dla wszystkich botów
- [ ] Rozszerzone kodowanie stanu dla wielu botów

**Pula imion botów** (zwierzęca tematyka):

```javascript
const botNames = [
  "Simba",
  "Nala",
  "Pumba",
  "Timon",
  "Baloo",
  "Bagheera",
  "Mufasa",
  "Zazu",
  "Rafiki",
  "Shere Khan",
];
```

**Stan gry rozszerzony**:

```typescript
interface MultiGameState {
  bots: Bot[];
  currentBotIndex: number;
  sharedDeck: GameState;
}

interface Bot {
  id: string;
  name: string;
  currentCard?: number;
}
```

---

### 🎯 Wersja 0.4.0 - Osobne talie dla botów

**Status**: 🔜 Planowana
**Cel**: Opcja osobnych talii dla każdego bota

**Funkcjonalności**:

- [ ] Wybór trybu w menu: "Jedna talia" vs "Osobne talie"
- [ ] Zarządzanie wieloma taliami
- [ ] Osobne liczniki kart dla każdego bota
- [ ] Rozszerzone kodowanie dla wielu talii
- [ ] UI pokazujące status każdego bota

**Format kodu gry v2**:

```
v2_separate_4_bot1:03:4a7b2c_bot2:07:9d5e1f_checksum
```

---

### 🎯 Wersja 0.5.0 - Wizualizacja kart

**Status**: 🔜 Planowana
**Cel**: Graficzne przedstawienie kart zamiast tekstu

**Funkcjonalności**:

- [ ] Design kart botów (CSS/SVG)
- [ ] Ikony dla różnych efektów kart
- [ ] Animacje dobierania kart
- [ ] Lepszy UX z przejściami
- [ ] Kolory tematyczne (zoo theme)

---

### 🎯 Wersja 0.6.0 - Historia i statystyki

**Status**: 🔜 Planowana
**Cel**: Możliwość przeglądania historii użytych kart

**Funkcjonalności**:

- [ ] Historia użytych kart dla każdego bota
- [ ] Modal/strona z historią kart
- [ ] Licznik przetasowań talii
- [ ] Statystyki użycia poszczególnych kart
- [ ] Export historii do pliku

---

### 🎯 Wersja 0.7.0 - Licznik punktów

**Status**: 🔜 Planowana
**Cel**: Pomocnik do liczenia punktów graczy (ludzie + boty)

**Funkcjonalności**:

- [ ] Nowy ekran "Punkty" w menu
- [ ] Dodawanie graczy (ludzie + boty)
- [ ] Licznik punktów z +/- przyciskami
- [ ] Historia zmian punktów
- [ ] Podsumowanie końcowe gry

---

### 🎯 Wersja 0.8.0 - PWA i offline support

**Status**: 🔜 Planowana
**Cel**: Instalacja na telefonie jako aplikacja

**Funkcjonalności**:

- [ ] Service Worker dla cache'owania
- [ ] Web App Manifest
- [ ] Offline support (wszystkie funkcje dostępne bez internetu)
- [ ] Instalacja na ekranie głównym telefonu
- [ ] Push notifications (opcjonalnie)

---

### 🎯 Wersja 0.9.0 - Dźwięki i UX

**Status**: 🔜 Planowana
**Cel**: Immersyjne doświadczenie z dźwiękami

**Funkcjonalności**:

- [ ] Dźwięki: dobieranie karty, przetasowanie
- [ ] Wibracje na telefonach (Vibration API)
- [ ] Ulepszone animacje
- [ ] Loading states
- [ ] Ustawienia dźwięku/wibracji

---

### 🎯 Wersja 1.0.0 - Release ready

**Status**: 🔜 Planowana
**Cel**: Gotowa aplikacja do publikacji

**Funkcjonalności**:

- [ ] Optymalizacja performance
- [ ] Testy jednostkowe (Jest + React Testing Library)
- [ ] E2E testy (Playwright)
- [ ] Dokumentacja użytkownika
- [ ] SEO optimization
- [ ] Analytics (opcjonalnie)

---

## Przyszłe rozszerzenia

### 🔮 Rozszerzalność kart

**Projekt przygotowany na**:

- Dodawanie nowych kart przez konfigurację JSON
- Wsparcie dla "fanowskich" dodatków
- Modular card system
- Custom card packs

### 🔮 Wersja 1.1.0+ - Zaawansowane funkcje

- **Export do APK** (Capacitor + Google Play Store)
- **Ciemny/jasny motyw**
- **Backup/restore ustawień**
- **Multiplayer online** (Socket.io)
- **Statystyki zaawansowane** (wykresy, raporty)

---

## Struktura kart botów

### Lista 13 kart (do zdefiniowania)

```typescript
interface BotCard {
  id: number;
  name: string;
  effects: string[];
  description: string;
  icon?: string;
}

// Przykład struktury - do uzupełnienia rzeczywistymi kartami z gry
const botCards: BotCard[] = [
  { id: 1, name: "Karta 1", effects: ["Efekt A"], description: "..." },
  {
    id: 2,
    name: "Karta 2",
    effects: ["Efekt B", "Efekt C"],
    description: "...",
  },
  // ... 11 więcej kart
];
```

---

## Notatki techniczne

### Architektura aplikacji

```
src/
├── components/          # Reusable components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── utils/              # Utility functions
├── types/              # TypeScript definitions
├── data/               # Game data (cards, etc.)
├── styles/             # Global styles
└── assets/             # Images, icons, sounds
```

### Stan aplikacji

- **React Context** dla globalnego stanu
- **useReducer** dla złożonej logiki gry
- **localStorage** dla persistence
- **sessionStorage** dla tymczasowych danych

### Kodowanie gry

- **Base64** encoding dla kompaktowości
- **CRC32** checksum dla walidacji
- **Wersjonowanie** dla kompatybilności wstecznej
- **Kompresja** dla długich stanów (wielu botów)

---

## Kontakt i rozwój

**Repo**: lukmarcus/spolka-zoo-bot-pomocnik
**Branch**: main
**Language**: Polski (primary)
**Target**: Mobile-first web app (PWA)

### Przygotowanie do pracy

1. Każda nowa funkcja = nowy branch
2. Commit messages po polsku
3. README.md aktualny z instrukcjami
4. CHANGELOG.md dla każdej wersji
