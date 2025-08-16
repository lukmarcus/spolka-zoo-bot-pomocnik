# TODO

Lista zadań do wykonania w projekcie Spółka ZOO Bot Pomocnik.

## 🎯 Wersja 0.0.1 - Setup projektu

### Must Have

- [ ] **Setup Vite + React + TypeScript**

  - [ ] `npm create vite@latest . -- --template react-ts`
  - [ ] Konfiguracja TypeScript
  - [ ] Konfiguracja ESLint + Prettier
  - [ ] Setup CSS Modules

- [ ] **Podstawowa struktura folderów**

  ```
  src/
  ├── components/
  ├── pages/
  ├── hooks/
  ├── context/
  ├── utils/
  ├── types/
  ├── data/
  ├── styles/
  └── assets/
      ├── icons/          # SVG/PNG ikony gry
      ├── fonts/          # Czcionki (podobne do instrukcji)
      └── images/         # Inne grafiki
  ```

- [ ] **React Router setup**

  - [ ] Instalacja `react-router-dom`
  - [ ] Routes: `/` (menu) i `/game` (gra)
  - [ ] Layout component z nawigacją

- [ ] **Responsywny design**

  - [ ] Meta viewport tag
  - [ ] CSS dla portrait mode (mobile-first)
  - [ ] Testowanie na różnych rozdzielczościach

- [ ] **Podstawowe komponenty**
  - [ ] `Layout.tsx` - główny layout
  - [ ] `Header.tsx` - nagłówek z tytułem
  - [ ] `Navigation.tsx` - nawigacja między stronami
  - [ ] `Button.tsx` - reusable button component
  - [ ] **Przygotowanie**: folder `assets/` dla ikon i czcionek

### Nice to Have

- [ ] **Konfiguracja dodatkowa**
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
