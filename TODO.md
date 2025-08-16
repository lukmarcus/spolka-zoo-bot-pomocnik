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

### Nice to Have ⏳

- [ ] **Konfiguracja dodatkowa**
  - [ ] Absolute imports (`@/components`)
  - [ ] Husky + lint-staged
  - [ ] GitHub Actions workflow
  - [ ] Env variables setup

### 🎉 Osiągnięcia v0.0.1:

- ✅ Działający React + TypeScript + Vite
- ✅ Responsywny design mobile-first
- ✅ Kolory dopasowane do instrukcji gry
- ✅ Routing między stronami
- ✅ TypeScript interfaces dla całej aplikacji
- ✅ Build i lint bez błędów
  - [ ] Absolute imports (`@/components`)
  - [ ] Husky + lint-staged
  - [ ] GitHub Actions workflow
  - [ ] Env variables setup

---

## 🎯 Wersja 0.1.0 - Podstawowa mechanika bota

### Must Have (po 0.0.1)

- [ ] **Definicje kart botów**

  - [ ] Plik `data/botCards.ts` z 13 kartami **Lorem Ipsum** (tymczasowo)
  - [ ] TypeScript interface dla kart (1-2 efekty + opcjonalna zdolność)
  - [ ] **Prawdziwe karty będą dostępne w ciągu tygodnia**

- [ ] **Stan gry**

  - [ ] React Context dla stanu gry
  - [ ] useReducer dla zarządzania kartami
  - [ ] Hook `useGameState`

- [ ] **Ekran gry**

  - [ ] Component `GameScreen.tsx`
  - [ ] **Wyświetlanie karty**: nazwa + efekty + zdolność (tylko UI!)
  - [ ] Licznik kart (X/13)
  - [ ] Przycisk "Dobierz kartę"
  - [ ] **Style**: żółto-zielone tło, brązowe nagłówki (jak w instrukcji)

- [ ] **Logika gry**
  - [ ] Tasowanie kart na start
  - [ ] Dobieranie następnej karty
  - [ ] Przetasowanie po wyczerpaniu talii
  - [ ] **Uwaga**: Aplikacja NIE rozpatruje efektów - tylko je wyświetla!

### Nice to Have

- [ ] **UX improvements**
  - [ ] Loading states
  - [ ] Smooth transitions
  - [ ] Error handling

---

## 🎯 Backlog (przyszłe wersje)

### Wersja 0.2.0 - Zapis gry

- [ ] Base64 encoding/decoding
- [ ] LocalStorage integration
- [ ] Game code generation
- [ ] Code validation with checksum

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

1. **Teraz**: Przejść do implementacji wersji 0.0.1
2. **Po 0.0.1**: Zebrać feedback i zdefiniować konkretne karty botów
3. **Po 0.1.0**: Testowanie z prawdziwą grą planszową
4. **Długoterminowo**: Rozważyć publikację w Google Play Store

---

_Ostatnia aktualizacja: 2025-08-16_
