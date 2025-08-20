# TODO

Lista zadań do wykonania w projekcie Spółka ZOO Bot Pomocnik.

## 🎯 Wersja 0.0.1 - Setup projektu ✅ UKOŃCZONA

### Must Have ✅

- [x] **Setup Vite + React + TypeScript**

  - [x] `npm create vite@latest . -- --template react-ts`
  - [x] Konfiguracja TypeScript (dostosowana do Node 18)
  - [x] Konfiguracja ESLint (bez Prettier na razie)
  - [x] Setup CSS Modules

- [x] **Podstawowa struktura folderów**

  ```
  src/
  ├── components/         ✅ Layout.tsx
  ├── pages/             ✅ Home.tsx, Game.tsx (placeholder)
  ├── hooks/             ✅ (gotowe na v0.1.0)
  ├── context/           ✅ (gotowe na v0.1.0)
  ├── utils/             ✅ (gotowe na v0.1.0)
  ├── types/             ✅ index.ts z interface'ami
  ├── data/              ✅ (gotowe na karty Lorem Ipsum)
  ├── styles/            ✅ globals.css z kolorami z instrukcji
  └── assets/
      ├── icons/         ✅ (gotowe na ikony gry)
      ├── fonts/         ✅ (gotowe na czcionki)
      └── images/        ✅ (gotowe na grafiki)
  ```

- [x] **React Router setup**

  - [x] Instalacja `react-router-dom`
  - [x] Routes: `/` (menu) i `/game` (gra)
  - [x] Layout component z nawigacją

- [x] **Responsywny design**

  - [x] Meta viewport tag (w index.html)
  - [x] CSS dla portrait mode (mobile-first)
  - [x] Testowanie na różnych rozdzielczościach

- [x] **Podstawowe komponenty**
  - [x] `Layout.tsx` - główny layout z kolorami z instrukcji
  - [x] `Home.tsx` - strona główna z menu
  - [x] `Game.tsx` - placeholder ekranu gry (v0.1.0)
  - [x] **Kolory tematyczne**: Żółto-zielone tło, brązowe nagłówki (jak w instrukcji)

### Nice to Have ⏳ → Przeniesione do przyszłych wersji

- [ ] **Konfiguracja dodatkowa**
  - [ ] Absolute imports (`@/components`) → v0.2.0 (ułatwi organizację kodu)
  - [ ] Husky + lint-staged → nie potrzebne (tylko jeden dev)
  - [ ] GitHub Actions workflow → v0.4.0 (automatyczne builds do GitHub Pages)
  - [ ] Env variables setup → nie potrzebne na razie (tylko LocalStorage)

### 🎉 Osiągnięcia v0.0.1 - KOMPLETNE ✅

- ✅ Działający React + TypeScript + Vite
- ✅ Responsywny design mobile-first (z drobnymi bugami do v0.0.2)
- ✅ Kolory dopasowane do instrukcji gry
- ✅ Routing między stronami
- ✅ TypeScript interfaces dla całej aplikacji
- ✅ Build i lint bez błędów
- ✅ Kod zinternacjonalizowany (komentarze po angielsku, UI po polsku)
- ✅ README.md z właściwym opisem projektu
- ✅ Kompletna dokumentacja w DOKUMENTACJA.md

---

## 🎯 Wersja 0.0.2 - Responsywność WCAG ✅ UKOŃCZONA

### Must Have (WCAG compliance) ✅

- [x] **320px Screen Support (WCAG requirement)**

  - [x] Naprawić poziomy overflow na 320px ekranach
  - [x] Zapewnić że wszystkie karty mieszczą się na ekranie
  - [x] Wyeliminować poziome przewijanie
  - [x] Testować na 320px szerokości (iPhone SE landscape)

- [x] **Media Query Conflicts**

  - [x] Naprawić konflikty między różnymi zakresami CSS
  - [x] Ujednolicić style dla małych ekranów (320px-360px)
  - [x] Wyeliminować skoki w szerokości kart
  - [x] Uprościć strukturę responsywności

- [x] **CSS Refactoring**

  - [x] Wprowadzić CSS custom properties dla responsywności
  - [x] Uprościć media queries do jednolitego systemu
  - [x] Wyeliminować konflikty między clamp() a media queries
  - [x] Zoptymalizować CSS bundle size

### 🎉 Osiągnięcia v0.0.3 - KOMPLETNE ✅

- ✅ WCAG 320px compliance - aplikacja działa idealnie na najwęższych ekranach
- ✅ Zero poziomego przewijania na wszystkich urządzeniach mobilnych
- ✅ Ujednolicony system responsywności przez CSS custom properties
- ✅ Płynne przejścia między rozmiarami ekranu bez skoków
- ✅ Refaktor CSS - mniej duplikacji, lepsza utrzymywalność
- ✅ Zoptymalizowany bundle (10.49kB → 10.03kB)

---

## 🎯 Wersja 0.0.3 - Poprawki wizualne (bugfixy) ✅ UKOŃCZONA

### Must Have (krytyczne błędy UX) ✅

- [x] **Layout viewport issues**

  - [x] Naprawić urwane tło na dole ekranu
  - [x] Naprawić overflow - zawartość nie mieści się na ekranie
  - [x] Dodać prawidłowy scroll dla małych ekranów
  - [x] Sprawdzić `min-height: 100vh` vs `height: 100vh`

- [x] **Responsive improvements**

  - [x] Dostosować rozmiary czcionek na małych ekranach
  - [x] Sprawdzić padding/margin w Layout.tsx
  - [x] Testować na różnych wysokościach ekranów (phones)

- [x] **CSS fixes**

  - [x] Upewnić się że gradient tła pokrywa cały ekran
  - [x] Dodać `overflow-y: auto` gdzie potrzeba
  - [x] Sprawdzić czy meta viewport jest prawidłowy

- [x] **Technical improvements**
  - [x] Automatyczne pobieranie wersji z package.json
  - [x] Dodanie `resolveJsonModule` w TypeScript

### 🎉 Osiągnięcia v0.0.2 - KOMPLETNE ✅

- ✅ Naprawiono wszystkie krytyczne bugi wizualne z v0.0.1
- ✅ Responsywne czcionki z `clamp()` na wszystkich ekranach
- ✅ Prawidłowe wyświetlanie tła na mobile (100dvh + background-attachment)
- ✅ Automatyczne wersje pobierane z package.json
- ✅ Lepsze wsparcie dla bardzo małych ekranów (≤380px)
- ✅ Build i lint bez błędów

### 🎯 Cel v0.0.2 - ZREALIZOWANY ✅

Naprawić krytyczne problemy wizualne z v0.0.1 które uniemożliwiały wygodne korzystanie z aplikacji na małych ekranach.

---

## 🎯 Wersja 0.1.0 - Podstawowa mechanika bota ✅ UKOŃCZONA

### Must Have (po 0.0.1) ✅

- [x] **Definicje kart botów**

  - [x] Plik `data/botCards.ts` z 13 kartami **Lorem Ipsum** (tymczasowo)
  - [x] TypeScript interface dla kart (1-2 efekty + opcjonalna zdolność)
  - [x] **Prawdziwe karty będą dostępne w ciągu tygodnia**

- [x] **Stan gry**

  - [x] React Context dla stanu gry
  - [x] useReducer dla zarządzania kartami
  - [x] Hook `useGame`

- [x] **Ekran gry**

  - [x] Component `Game.tsx` z pełną funkcjonalnością
  - [x] **Wyświetlanie karty**: komponent `BotCard.tsx` z nazwą + efektami + zdolnością
  - [x] Licznik kart (X/13) i pozostałych kart
  - [x] Przycisk "Dobierz kartę", "Przetasuj talię", "Reset gry"
  - [x] **Style**: responsywne z kolorami gry, animacje transitions

- [x] **Logika gry**
  - [x] Tasowanie kart na start (`newGame()`)
  - [x] Dobieranie następnej karty (`drawCard()`)
  - [x] Przetasowanie w dowolnym momencie (`shuffleDeck()`)
  - [x] Reset gry do stanu początkowego (`resetGame()`)
  - [x] **Auto-start**: gra automatycznie startuje po wejściu na stronę

### Nice to Have ✅

- [x] **UX improvements**
  - [x] Smooth transitions i animacje kart
  - [x] Disabled states dla przycisków
  - [x] Loading states w trakcie operacji

### 🎯 Cel v0.1.0 - ZREALIZOWANY ✅

Stworzyć funkcjonalną mechanikę losowania i wyświetlania kart botów z pełnym interfejsem użytkownika.

---

## 🎯 Hotfix Wersje (Post v0.1.0 UX Improvements)

### Wersja 0.1.1 - Uproszczenie interfejsu gry ✅ UKOŃCZONA

#### 🎨 UX Improvements ✅

- [x] **Konsolidacja przycisków**

  - [x] Zastąpienie 3 osobnych przycisków 1 dynamicznym
  - [x] Inteligentne komunikaty:
    - 0/13: "🎯 Dobierz pierwszą kartę"
    - 1-11/13: "🎯 Dobierz następną kartę"
    - 12/13: "🎯 Dobierz ostatnią kartę"
    - 13/13: "🔀 Przetasuj i dobierz kartę"
  - [x] Całkowite usunięcie przycisku "Reset gry"

- [x] **Uproszczenie informacji**

  - [x] Usunięcie redundantnej informacji "Pozostało: X kart"
  - [x] Pozostawienie tylko "X/13" jako główny licznik
  - [x] Lepsze wyśrodkowanie statusu gry

- [x] **Poprawa responsywności**
  - [x] Większy, bardziej wyróżniony główny przycisk
  - [x] Lepsza organizacja na urządzeniach mobilnych
  - [x] Uproszczony układ kontrolek (główny przycisk + powrót do menu)

### Wersja 0.1.2 - Niestandardowe modale ✅ UKOŃCZONA

#### 🪟 Modal Improvements

- [x] **Zastąpienie window.confirm**

  - [x] Stworzenie komponentu ConfirmModal
  - [x] Stylowanie zgodne z motywem aplikacji (kolory ZOO)
  - [x] Animacje wejścia/wyjścia (fade/slide)

- [x] **Niestandardowe dialogi**

  - [x] Modal wyjścia z gry
  - [x] Opcjonalny tytuł w komponencie
  - [x] Obsługa ESC i click outside
  - [x] Spójny design system z resztą aplikacji

- [x] **UX Improvements**
  - [x] Natychmiastowe dobieranie kart dla płynnego gameplay
  - [x] Uproszczony komunikat wyjścia z gry

### Wersja 0.1.3 - Grafiki tła ⏳ W PLANACH

#### 🎨 Visual Enhancements

- [ ] **Dodanie grafik tematycznych**

  - [ ] Delikatne grafiki zoo w tle strony głównej
  - [ ] Subtelne wzory na kartach
  - [ ] Ikony zwierząt jako accent elements

- [ ] **Poprawki wizualne**
  - [ ] Gradient transitions
  - [ ] Hover effects na kartach
  - [ ] Loading animations

---

## 🎯 Wersja 0.2.0 - Zapis i wczytywanie gry

### Must Have

- [ ] **Zapis stanu gry**

  - [ ] Serialization GameState do JSON
  - [ ] LocalStorage integration
  - [ ] Auto-save przy każdej akcji
  - [ ] Restore stanu przy reload strony

- [ ] **Share game state**

  - [ ] Base64 encoding stanu gry
  - [ ] Generator kodów gry (6-8 znaków)
  - [ ] Kopia kodu do schowka
  - [ ] Walidacja kodów z checksumą

- [ ] **UI dla zapisu**
  - [ ] Przycisk "Udostępnij grę"
  - [ ] Modal z kodem do skopiowania
  - [ ] Input do wczytania kodu
  - [ ] Error handling dla błędnych kodów

### Nice to Have

- [ ] **Export/Import**
  - [ ] Eksport do pliku JSON
  - [ ] Import z pliku
  - [ ] QR kod dla mobile sharing

---

## 🎯 Backlog (przyszłe wersje)

### Wersja 0.3.0 - Wiele botów

- [ ] Multi-bot state management
- [ ] Bot names generation
- [ ] Bot switching UI
- [ ] Shared deck logic

### Wersja 0.4.0 - Osobne talie

- [ ] Multiple deck management
- [ ] Deck selection in menu
- [ ] Individual bot counters

### Wersja 0.5.0 - Wizualizacja

- [ ] Card design (CSS/SVG)
- [ ] Icons dla efektów
- [ ] Animations
- [ ] Zoo theme colors

---

## 🐛 Znane problemy

_Brak znanych problemów (projekt nie rozpoczęty)_

---

## 💡 Pomysły na przyszłość

### Funkcje użytkownika

- [ ] **Dark/Light theme**
- [ ] **Dźwięki i wibracje**
- [ ] **Historia gier**
- [ ] **Statystyki użycia kart**
- [ ] **Export/import ustawień**

### Funkcje techniczne

- [ ] **PWA setup**
- [ ] **Offline support**
- [ ] **Capacitor dla APK**
- [ ] **Unit tests**
- [ ] **E2E tests**

### Rozszerzalność

- [ ] **Plugin system dla nowych kart**
- [ ] **JSON config dla fanowskich dodatków**
- [ ] **Multiplayer online (Socket.io)**
- [ ] **Cloud save (Firebase)**

---

## 📝 Notatki

### Decyzje techniczne do podjęcia w 0.0.1:

1. **Styling**: CSS Modules ✅ (pasuje do kolorów z instrukcji)
2. **State management**: Context+Reducer ✅ (wystarczy dla tej aplikacji)
3. **Icons**: Własne SVG/PNG ✅ (specyficzne ikonki dla gry)
4. **PWA**: Dopiero w 0.8.0 ✅
5. **Fonts**: Czcionki jak w instrukcji (lub podobne darmowe alternatywy) 🔍

### ✅ Wyjaśnione pytania:

1. **Dostęp do kart**: ✅ Będzie dostępny w ciągu tygodnia, na razie używamy Lorem Ipsum
2. **Efekty kart**: ✅ Aplikacja tylko WYŚWIETLA karty, nie rozpatruje efektów (fizyczna gra)
3. **Struktura kart**: ✅ Każda karta może mieć 1-2 efekty + zdolność dodatkową
4. **Kolory/motyw**: ✅ Żółto-zielone tło, brązowe nagłówki (jak w instrukcji)
5. **Ikony**: ✅ Własne SVG/PNG (specyficzne dla gry)
6. **Czcionki**: ✅ Jak w instrukcji (lub podobne darmowe)
7. **Długość tekstów**: ✅ Krótkie (jedno zdanie jak w przykładzie)

### Zadania do badania w przyszłości:

- **Font matching**: Identyfikacja czcionek z instrukcji lub znalezienie podobnych darmowych
- **Asset extraction**: Wyciągnięcie ikon z prawdziwych kart (gdy będą dostępne)
- **Responsive text**: Optymalizacja dla krótkich tekstów (jedno zdanie)

---

## 🎯 Następne kroki

1. **Teraz**: Przejść do implementacji wersji 0.1.0 - mechanika kart botów
2. **Po 0.1.0**: Zebrać feedback i zdefiniować konkretne karty botów
3. **Po 0.2.0**: Testowanie z prawdziwą grą planszową
4. **Długoterminowo**: Rozważyć publikację w Google Play Store
