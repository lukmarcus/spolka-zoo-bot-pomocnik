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
  └── styles/
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

  - [ ] Plik `data/botCards.ts` z 13 kartami
  - [ ] TypeScript interface dla kart
  - [ ] Tymczasowe tekstowe opisy kart

- [ ] **Stan gry**

  - [ ] React Context dla stanu gry
  - [ ] useReducer dla zarządzania kartami
  - [ ] Hook `useGameState`

- [ ] **Ekran gry**

  - [ ] Component `GameScreen.tsx`
  - [ ] Wyświetlanie aktualnej karty
  - [ ] Licznik kart (X/13)
  - [ ] Przycisk "Dobierz kartę"

- [ ] **Logika gry**
  - [ ] Tasowanie kart na start
  - [ ] Dobieranie następnej karty
  - [ ] Przetasowanie po wyczerpaniu talii
  - [ ] Walidacja czy karta może być użyta

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

1. **Styling**: CSS Modules vs Styled Components vs Tailwind?
2. **State management**: Context+Reducer vs Zustand vs Redux Toolkit?
3. **Icons**: React Icons vs własne SVG vs Font Awesome?
4. **PWA**: Od razu vs dopiero w 0.8.0?

### Pytania do wyjaśnienia:

1. Czy masz dostęp do treści 13 kart z gry?
2. Jakie dokładnie efekty mają karty?
3. Czy są jakieś specjalne zasady dla niektórych kart?
4. Preferowane kolory/motyw wizualny?

---

## 🎯 Następne kroki

1. **Teraz**: Przejść do implementacji wersji 0.0.1
2. **Po 0.0.1**: Zebrać feedback i zdefiniować konkretne karty botów
3. **Po 0.1.0**: Testowanie z prawdziwą grą planszową
4. **Długoterminowo**: Rozważyć publikację w Google Play Store

---

_Ostatnia aktualizacja: 2025-08-16_
