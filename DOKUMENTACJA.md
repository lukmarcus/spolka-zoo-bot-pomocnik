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

### 🎯 Wersja 0.2.0 - Save/Load System

**Status**: ✅ Ukończona (2025-08-23)
**Cel**: Możliwość zapisywania i udostępniania stanu gry

**Funkcjonalności**:

- [x] **System zapisywania**: Automatyczne zapisywanie stanu w localStorage
- [x] **Kody gry**: Generowanie kodów z checksumami
- [x] **Modale Save/Load**: ShareGameModal i LoadGameModal z BaseModal
- [x] **Walidacja**: Bezpieczne wczytywanie z walidacją formatów i checksumów
- [x] **UX**: Kopiowanie do schowka, instrukcje użycia, komunikaty błędów
- [x] **Integracja**: Aktywne przyciski w Home.tsx i Game.tsx

**⚠️ Znane problemy v0.2.0**:

- **localStorage-only system**: Kody działają tylko w tej samej przeglądarce
- **Brak cross-device**: Nie można udostępniać kodów między urządzeniami
- **Długie kody**: Base64 format generuje długie, nieczytelne kody

**Komponenty utworzone**:

- `src/components/BaseModal.tsx` - uniwersalny modal z reużywalnymi stylami
- `src/components/ShareGameModal.tsx` - modal udostępniania gry
- `src/components/LoadGameModal.tsx` - modal wczytywania gry
- `src/utils/gameStorage.ts` - utilities dla serializacji/deserializacji stanu

**GameContext rozszerzenia**:

- `loadGame()` - akcja wczytywania stanu gry
- `LOAD_GAME` - reducer case dla ładowania stanu
- Auto-save z useEffect - automatyczne zapisywanie przy każdej zmianie

**Architektura**:

- **Serialization**: `GameState` → Base64 string z checksumami
- **Deserialization**: Base64 string → `GameState` z walidacją
- **Storage**: localStorage dla auto-save i kodów gry
- **Modular CSS**: Reużywanie ConfirmModal.module.css dla spójności

**Planowane poprawki v0.2.1+**:

- [ ] **Cross-device kody**: Embedding danych w kodach zamiast localStorage references
- [ ] **Krótsze kody**: Custom hex encoding dla optymalizacji długości
- [ ] **Lepszy UX**: Uproszczenie interfejsu modali

---

### 🎯 Wersja 0.1.4 - Complete bugfix cycle

**Status**: ✅ Ukończona (2025-08-22)
**Cel**: Rozwiązanie wszystkich znanych błędów UI/UX

**Naprawione problemy**:

- [x] **Issue #13**: Centrowanie aplikacji na ekranach desktop (>480px)
- [x] **Issue #14**: Tła nie pokrywające całego ekranu
- [x] **Issue #15**: Niespójne szerokości elementów
- [x] **Issue #16**: Brak resetu stanu gry przy powrocie do menu

**Zmiany techniczne**:

- Unified Layout system z max-width: 480px
- Dynamic background management w Layout.tsx
- CSS variables optimization dla spójności
- Game state reset w confirmExit()

---

### 🎯 Wersja 0.0.1 - Podstawowa struktura

**Status**: ✅ Ukończona (2025-08-16)
**Cel**: Setup projektu i podstawowa nawigacja

**Funkcjonalności**:

- [x] Setup React + TypeScript + Vite
- [x] Podstawowy routing (React Router)
- [x] Responsywny layout dla telefonów (portrait)
- [x] Komponenty: Header, Navigation, Layout
- [x] **Kolory tematyczne**: Żółto-zielone tło, brązowe nagłówki (jak w instrukcji)

**Pliki utworzone**:

- `src/App.tsx` - główny komponent
- `src/components/Layout.tsx` - layout aplikacji
- `src/pages/Home.tsx` - strona główna
- `src/pages/Game.tsx` - ekran gry
- `src/styles/` - style globalne

---

### 🎯 Wersja 0.0.2 - Poprawki wizualne

**Status**: ✅ Ukończona (2025-08-17)
**Cel**: Naprawienie krytycznych bugów responsywności

**Poprawione problemy**:

- [x] **Layout viewport**: Urwane tło na dole ekranu
- [x] **Content overflow**: Zawartość niewidoczna na małych ekranach
- [x] **Responsywność**: Czcionki za duże na telefonach
- [x] **Technical**: Automatyczne wersje z package.json

**Bug fixes dla Issues**:

- Issue #2: "Responsywność: Czcionki zbyt duże na małych ekranach" - ROZWIĄZANY ✅
- Issue #3: "Overflow: Zawartość nie mieści się na ekranie na małych urządzeniach" - ROZWIĄZANY ✅
- Issue #4: "Gradient tła nie pokrywa całego ekranu (urwane tło na dole)" - ROZWIĄZANY ✅

**Kluczowe zmiany**:

- Użycie `100dvh` zamiast `100vh` dla mobile browsers
- Responsywne czcionki z `clamp()`
- Media queries dla ekranów ≤380px
- `background-attachment: fixed` dla gradientu

---

### 🎯 Wersja 0.0.3 - Responsywność WCAG

**Status**: ✅ Ukończona (2025-08-18)
**Cel**: WCAG compliance i optymalizacja CSS

**Poprawione problemy**:

- [x] **320px WCAG requirement**: Poziomy overflow na najwęższych ekranach
- [x] **Media query conflicts**: Konflikty między różnymi zakresami CSS
- [x] **Card sizing jumps**: Skoki szerokości kart między breakpointami
- [x] **CSS architecture**: Duplikacja kodu i konfliktujące reguły

**Bug fixes dla Issues**:

- Issue #7: "Horizontal overflow na bardzo małych ekranach (≤320px)" - ROZWIĄZANY ✅

**Kluczowe zmiany**:

- Ujednolicony styl dla całego zakresu ≤360px (eliminuje konflikty)
- CSS custom properties dla responsive font-size i spacing
- Refaktor: eliminacja `clamp()` na rzecz centralnego zarządzania
- Optymalizacja bundle size (10.49kB → 10.03kB)
- Zero poziomego przewijania na wszystkich urządzeniach mobilnych

**Technical improvements**:

- Wprowadzono `--font-size-*` i `--card-padding` CSS variables
- Uproszono media queries z wielu zakresów do `@media (max-width: 360px)`
- Wyeliminowano konflikty między globals.css, Layout.module.css i Home.module.css

---

### 🎯 Wersja 0.1.0 - Podstawowa mechanika bota

**Status**: ✅ Ukończona (2025-08-19)
**Cel**: Działający bot z jedną talią 13 kart

**Zaimplementowane funkcjonalności**:

- ✅ **System 13 kart bota** (Lorem Ipsum - prawdziwe karty wkrótce)
- ✅ **Ekran gry** z automatycznym startem przy wejściu
- ✅ **Wyświetlanie karty**: Komponent `BotCard.tsx` z nazwą + efektami + zdolnością
- ✅ **Licznik kart**: Aktualna karta (X/13) + pozostałe karty
- ✅ **Kontrolki gry**: "Dobierz kartę", "Przetasuj talię", "Reset gry"
- ✅ **UX**: Animacje, disabled states, responsive design
- ✅ **Auto-tasowanie**: Automatyczne na start gry

**Zaimplementowane komponenty**:

- ✅ `Game.tsx` - główny ekran gry z pełną logiką
- ✅ `BotCard.tsx` - komponent karty z responsywnym designem
- ✅ `GameContext.tsx` - zarządzanie stanem z useReducer
- ✅ Dane `BOT_CARDS` - 13 kart Lorem Ipsum z efektami

---

### 🎯 Wersja 0.1.1 - Uproszczenie UX gry

**Status**: ✅ Ukończona (2025-08-19)
**Cel**: Poprawa doświadczenia użytkownika w grze

**Zaimplementowane ulepszenia**:

- ✅ **Konsolidacja przycisków**: Zastąpienie 3 przycisków 1 dynamicznym

  - Inteligentne komunikaty:
    - 0/13: "🎯 Dobierz pierwszą kartę"
    - 1-11/13: "🎯 Dobierz następną kartę"
    - 12/13: "🎯 Dobierz ostatnią kartę"
    - 13/13: "🔀 Przetasuj i dobierz kartę"
  - Usunięcie redundantnego przycisku "Przetasuj talię"
  - Całkowite usunięcie przycisku "Reset gry" dla czystszego interfejsu

- ✅ **Uproszczenie informacji**:

  - Usunięto redundantną informację "Pozostało: X kart"
  - Pozostawiono tylko "X/13" jako główny licznik kart
  - Lepsze wyśrodkowanie statusu gry

- ✅ **Poprawa responsywności**:
  - Większy, bardziej wyróżniony główny przycisk akcji
  - Lepsza organizacja kontrolek na urządzeniach mobilnych
  - Uproszczony układ z tylko jednym głównym przyciskiem

**Zaimplementowane komponenty**:

- ✅ `BotCard.tsx` + `BotCard.module.css` - wyświetlanie karty z efektami
- ✅ `Game.tsx` + `Game.module.css` - pełny ekran gry z kontrolkami
- ✅ `GameContext.tsx` - zarządzanie stanem z useReducer

---

### 🎯 Wersja 0.1.2 - Profesjonalny modal

**Status**: ✅ Ukończona (2025-08-20)
**Cel**: Zastąpienie natywnych modali przeglądarki i poprawa UX

**Zaimplementowane ulepszenia**:

- ✅ **System modala**:

  - Komponent `ConfirmModal.tsx` + `ConfirmModal.module.css`
  - Zastąpienie `window.confirm()` przeglądarki
  - Spójny design z kolorystyką ZOO (kremowe tło #fff8dc, brązowe elementy #8b4513)
  - Animacje fade/slide z responsive design
  - Obsługa klawisza Escape i kliknięcia poza modal

- ✅ **UX improvements**:

  - Natychmiastowe dobieranie kart dla płynnego gameplay
  - Modal tylko dla wyjścia z gry ("punkt bez powrotu")
  - Opcjonalny tytuł w komponencie - może działać z nagłówkiem lub bez

- ✅ **Uniwersalny design system**:
  - Wielokrotnego użytku komponent z konfigurowalnymi props
  - Gotowy do wykorzystania w przyszłych funkcjonalnościach
  - Spójne kolory używające zmiennych CSS z `globals.css`

**Zaimplementowane komponenty**:

- ✅ `ConfirmModal.tsx` - uniwersalny modal potwierdzenia
- ✅ `ConfirmModal.module.css` - style z animacjami i responsywnością
- ✅ Zmodyfikowane `Game.tsx` - integracja z modalem wyjścia
- ✅ `useGame()` - custom hook do dostępu do kontekstu

**Struktura stanu gry**:

```typescript
interface GameState {
  currentCardIndex: number; // aktualny indeks (0-12)
  cardSequence: number[]; // przetasowana sekwencja kart
  usedCards: number[]; // użyte karty w tej rundzie
  shuffleCount: number; // liczba przetasowań
  gameStarted: boolean; // czy gra została rozpoczęta
}

interface BotCard {
  id: number; // 1-13
  name: string; // nazwa karty
  effects: string[]; // 1-2 efekty
  ability?: string; // opcjonalna zdolność specjalna
}
```

**Technical highlights**:

- React Context + useReducer pattern dla state management
- Fisher-Yates shuffle algorithm
- CSS animations z `@keyframes slideIn`
- Mobile-first responsive design
- TypeScript full type safety

---

### 🎯 Wersja 0.1.3 - Grafiki tła i optymalizacja interfejsu

**Status**: ✅ Ukończona (2025-08-21)
**Cel**: Dodanie grafik tła i optymalizacja kompaktowości interfejsu

**Zaimplementowane ulepszenia**:

- ✅ **System grafik tła**:

  - Grafika `home-bg.jpg` na stronie głównej
  - Grafika `game-bg.jpg` na ekranie gry
  - Grafika `card-reverse.jpg` na ekranie 0/13 (symbolizuje zakryty stos kart)
  - CSS utility classes: `.bg-home`, `.bg-game` z pełnymi tłami (nie overlay)
  - CSS variables: `--home-bg`, `--game-bg` dla łatwej zmiany

- ✅ **Optymalizacja interfejsu**:

  - Drastyczne zmniejszenie odstępów między elementami
  - Header margin: 32px → 12px
  - GameStatus padding: 16px → 2px w pionie
  - Globalny --gap: 12px → 8px
  - CardArea min-height: 300px → 150px
  - Card reverse image: 250px → 200px max-width

- ✅ **Responsywność i media queries**:

  - Poprawki w `@media (max-width: 768px)` dla gameStatus
  - Spójny padding na wszystkich urządzeniach
  - Zachowana funkcjonalność przy kompaktowym designie

**Zaimplementowane komponenty**:

- ✅ Layout.tsx - rozszerzony o `backgroundType` prop
- ✅ globals.css - CSS variables i utility classes dla tła
- ✅ Game.tsx - integracja card-reverse image dla stanu 0/13
- ✅ Game.module.css - optymalizacja spacing i responsive fixes

**Technical highlights**:

- Dynamic background switching w Layout component
- CSS-in-TS import dla card-reverse.jpg
- Mobile-first compactness optimization
- Asset optimization w build pipeline

---

### 🎯 Wersja 0.1.4 - Desktop centering bugfix

**Status**: ✅ Ukończona (2025-08-22)
**Cel**: Naprawienie problemu z centrowaniem aplikacji na ekranach desktopowych

**Naprawione błędy**:

- ✅ **Desktop layout centering (Issue #13)**:

  - Problem: Na ekranach >480px aplikacja nie była poprawnie wyśrodkowana
  - Rozwiązanie: Unified max-width system - wszystkie ekrany używają spójnego 480px
  - Enhanced media queries dla desktop z explicitnym `margin: 0 auto`
  - Poprawiono CSS variables w globals.css z lepszym calc() dla narrow screens

- ✅ **Layout consistency**:

  - Usunięto conflicting max-width z Home.module.css (400px → 100%)
  - Spójny system szerokości między Home, Game i Layout components
  - Explicitne centrowanie w Layout.module.css dla ekranów >481px

**Zmodyfikowane pliki**:

- ✅ package.json - version bump do 0.1.4
- ✅ globals.css - poprawione CSS variables i media queries
- ✅ Layout.module.css - dodano explicitne `max-width: 480px` dla desktop
- ✅ Home.module.css - usunięto conflicting `max-width: 400px` z heroDescription

**Technical improvements**:

- Lepsze responsywne zachowanie na różnych szerokościach ekranu
- Spójne centrowanie między wszystkimi ekranami aplikacji
- Enhanced CSS architecture dla desktop consistency

**Dodatkowo naprawione w v0.1.4**:

- ✅ **Full-screen background coverage (Issue #14)**:

  - Problem: Grafiki tła nie pokrywały całego ekranu (tylko Layout o szerokości 480px)
  - Rozwiązanie: Przeniesiono aplikację tła z Layout component na body element
  - Dodano `background-attachment: fixed` dla stabilnych teł podczas scroll
  - Wprowadzono subtelny overlay (0.05 opacity) dla lepszej czytelności tekstu

- ✅ **Layout width consistency (Issue #15)**:

  - Problem: Niespójne szerokości elementów na różnych ekranach (BotCard 400px, Game buttons 300px)
  - Rozwiązanie: Unified Layout max-width system dla wszystkich komponentów
  - BotCard: zmieniono max-width z 400px na 100% dla pełnego wykorzystania Layout
  - Game buttons: usunięto ograniczenie max-width 300px dla spójności

- ✅ **Game state reset bug (Issue #16)**:
  - Problem: Stan gry nie był resetowany przy powrocie do menu (mimo modal warning)
  - Rozwiązanie: Dodano wywołanie `game.resetGame()` w funkcji `confirmExit()`
  - Stan gry jest teraz prawidłowo resetowany przed nawigacją do menu

**Wszystkie zmodyfikowane pliki w v0.1.4**:

- ✅ Layout.tsx - useEffect dla dynamicznego zarządzania klasami tła na body
- ✅ globals.css - refaktor background utilities, enhanced media queries
- ✅ Layout.module.css - positioning, z-index, explicitne max-width dla desktop
- ✅ BotCard.module.css - max-width 400px → 100% dla Layout consistency
- ✅ Game.module.css - usunięto max-width constraints, zwiększono card-reverse
- ✅ Game.tsx - dodano `game.resetGame()` call w `confirmExit()`

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

### Mechanika kart (z instrukcji gry)

**Źródło**: Instrukcja Spółka ZOO, strony 24-25

**Zasady botów**:

- Boty nie używają żetonów Akcji - zastępuje je talia 13 kart
- Gdy przychodzi kolej na bota, sąsiadujący gracz odkrywa wierzchnią kartę
- Karty mają 1-2 efekty (u góry karty) + ewentualną zdolność dodatkową
- Jeśli nie da się rozpatrzyć żadnego efektu, karta idzie do odrzuconych i dobiera się kolejną
- Jeśli można wykonać oba efekty, należy to zrobić
- Po wyczerpaniu talii - przetasowanie odrzuconych kart

**Aplikacja tylko WYŚWIETLA karty** - nie rozpatruje efektów (to robi fizyczna gra)

### Kolory i motywy (z instrukcji)

- **Tło**: Żółto-zielone gradient (jak w instrukcji)
- **Nagłówki**: Brązowe (#8B4513 lub podobny)
- **Karty**: Pomarańczowo-brązowe ramki, kremowe tło
- **Akcenty**: Zielone dla dodatków/efektów
- **Tekst**: Ciemnobrązowy dla dobrej czytelności

### Struktura kart (TypeScript)

```typescript
interface BotCard {
  id: number; // 1-13
  name: string;
  effects: BotEffect[]; // 1-2 efekty
  ability?: string; // dodatkowa zdolność (opcjonalna)
  description: string; // pełny opis karty
  placeholder?: boolean; // czy to tymczasowa karta Lorem Ipsum
}

interface BotEffect {
  type: "primary" | "secondary";
  description: string; // krótkie zdanie (jak w instrukcji)
  icon?: string; // własna ikona SVG/PNG specyficzna dla gry
}
```

### Tymczasowe karty (Lorem Ipsum) - do wersji 0.1.0

```typescript
// Będą używane do czasu otrzymania prawdziwych kart
const placeholderCards: BotCard[] = [
  {
    id: 1,
    name: "Karta Bota #1",
    effects: [
      {
        type: "primary",
        description: "Lorem ipsum dolor sit amet consectetur",
      },
    ],
    description:
      "Consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    placeholder: true,
  },
  {
    id: 2,
    name: "Karta Bota #2",
    effects: [
      { type: "primary", description: "Ut labore et dolore magna aliqua" },
      { type: "secondary", description: "Enim ad minim veniam quis" },
    ],
    ability: "Nostrud exercitation ullamco",
    description: "Laboris nisi ut aliquip ex ea commodo consequat.",
    placeholder: true,
  },
  // ... 11 więcej kart Lorem Ipsum
];
```

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
├── components/ # Reusable components
├── pages/ # Page components (routes)
├── hooks/ # Custom React hooks
├── context/ # React Context providers
├── utils/ # Utility functions
├── types/ # TypeScript definitions
├── data/ # Game data (cards, etc.)
├── styles/ # Global styles
└── assets/ # Images, icons, sounds

````

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

### Paleta kolorów (na podstawie instrukcji)
```css
:root {
  /* Główne kolory */
  --bg-primary: linear-gradient(135deg, #E8F5E8, #F0F8C7); /* Żółto-zielone tło */
  --text-primary: #4A2C17; /* Ciemnobrązowy tekst */
  --text-header: #8B4513; /* Brązowe nagłówki */

  /* Karty */
  --card-bg: #FFF8DC; /* Kremowe tło kart */
  --card-border: #CD853F; /* Pomarańczowo-brązowa ramka */
  --card-accent: #228B22; /* Zielone akcenty */

  /* UI elementy */
  --button-primary: #8B4513;
  --button-secondary: #CD853F;
  --success: #228B22;
  --warning: #FF8C00;
  --danger: #DC143C;
}
```

### Typografia i assets

**Czcionki** (na podstawie instrukcji):
- **Główna**: Szukać czcionek podobnych do tych w instrukcji (serif, ciepłe)
- **Nagłówki**: Mocniejsza, czytelnا waga
- **Karty**: Klasyczna, dobrze czytelna na małych ekranach
- **Backup**: Georgia, "Times New Roman", serif (dla kompatybilności)

**Ikony i grafiki**:
- **Format**: SVG (skalowalność) + PNG fallback
- **Źródło**: Własne ikony specyficzne dla gry Spółka ZOO
- **Style**: Dopasowane do estetyki gry (ciepłe, organiczne)
- **Rozmiary**: 16px, 24px, 32px, 48px (responsive)

**Teksty kart**:
- **Długość**: Krótkie (jedno zdanie na efekt)
- **Responsywność**: Optymalizacja dla mobile-first
- **Kontrast**: Wysoki kontrast na kremowym tle kart`

---

## Architektura Save/Load System (v0.2.0)

### GameStorage utilities

**Lokalizacja**: `src/utils/gameStorage.ts`

**Główne funkcje**:

```typescript
// Serializacja stanu gry do Base64 z checksumą
function serializeGameState(gameState: GameState): string

// Deserializacja z walidacją formatu i checksumą
function deserializeGameState(data: string): GameState | null

// Generowanie kodu gry do udostępniania
function generateShareableCode(gameState: GameState): string

// Wczytywanie gry z otrzymanego kodu
function loadFromShareableCode(code: string): GameState | null

// Automatyczne zapisywanie w localStorage
function autoSaveGameState(gameState: GameState): void

// Helper do kopiowania kodów do schowka
function copyToClipboard(text: string): Promise<boolean>

// Walidacja formatu kodów gry
function isValidGameCode(code: string): boolean
```

### Architektura kodów gry

**Format kodu**: `BASE64_ENCODED_JSON_WITH_CHECKSUM`

1. **GameState** → **JSON string**
2. **JSON** + **CRC32 checksum** → **Combined string**
3. **Combined string** → **Base64 encoding**
4. **Base64** → **Uppercase format** (user-friendly)

**Przykład**:
```
GameState {gameStarted: true, currentCardIndex: 5, ...}
↓
JSON: '{"gameStarted":true,"currentCardIndex":5,...}'
↓
JSON + checksum: '{"gameStarted":true,...}|CRC32:ABC123'
↓
Base64: 'eyJnYW1lU3RhcnRlZCI6dHJ1ZSwuLi59fENSQzMyOkFCQzEyMw=='
↓
Code: 'EYJNYW1lU3RhCnRlZCI6dHJ1ZSwuLi59fENSQzMyOkFCQzEyMw=='
```

### Modal Components

**BaseModal** (`src/components/BaseModal.tsx`):
- Reużywalny modal bazujący na ConfirmModal.module.css
- Uniwersalny overlay, keyboard handling, click outside
- Parametryzowalna szerokość (maxWidth prop)
- Konsystentny design system

**ShareGameModal**:
- Generowanie kodów gry z GameState
- Kopiowanie do schowka z wizualnym feedback
- Instrukcje użycia wbudowane w UI
- Error handling dla problemów z generowaniem

**LoadGameModal**:
- Input z walidacją formatu kodu gry
- Real-time walidacja podczas wpisywania
- Error states z komunikatami dla użytkownika
- Enter key support dla wygody użytkowania

### GameContext Integration

**Nowe akcje**:
```typescript
type GameAction =
  | { type: "DRAW_CARD" }
  | { type: "SHUFFLE_DECK" }
  | { type: "RESET_GAME" }
  | { type: "NEW_GAME" }
  | { type: "LOAD_GAME"; payload: GameState } // NOWA AKCJA

interface GameContextType {
  // ... istniejące funkcje
  loadGame: (gameState: GameState) => void; // NOWA FUNKCJA
}
```

**Auto-save mechanism**:
```typescript
// W GameProvider - automatyczne zapisywanie przy każdej zmianie stanu
useEffect(() => {
  autoSaveGameState(state);
}, [state]);
```

### localStorage Strategy

**Klucz**: `SPOLKA_ZOO_GAME_STATE`
**Format**: JSON string (bezpośredni GameState)
**Timing**: Auto-save po każdej akcji gry
**Recovery**: Sprawdzenie localStorage przy inicjalizacji aplikacji

### UI Integration Points

**Home.tsx**:
- Przycisk "📥 Wczytaj grę" → otwiera LoadGameModal
- onLoadGame → loadGame(gameState) → navigate("/game")

**Game.tsx**:
- Przycisk "🔗 Udostępnij grę" → otwiera ShareGameModal
- Przekazanie aktualnego game.state do ShareGameModal

### Error Handling

**Walidacja kodu gry**:
- Format check (Base64, długość)
- Checksum verification
- GameState schema validation
- User-friendly error messages

**Failsafe mechanisms**:
- Graceful degradation przy problemach z localStorage
- Backup dla starszych przeglądarek bez clipboard API
- Instrukcje manualne przy błędach kopiowania

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
````
