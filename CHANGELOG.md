# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
projekt stosuje [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2025-08-22

### 🐛 Naprawione błędy

- **🖥️ Poprawione centrowanie na desktopie**
  - Naprawiono problem z centrowaniem aplikacji na szerszych ekranach (>480px)
  - Unified szerokość aplikacji - wszystkie ekrany używają teraz spójnego systemu 480px max-width
  - Dodano lepsze media queries dla ekranów desktop z `margin: 0 auto`
  - Poprawiono CSS variables dla `--max-width` z lepszym calc() dla narrow screens
  - Home description nie używa już własnej max-width 400px (teraz 100% z Layout)

### 🔧 Zmiany techniczne

- **📦 Wersja 0.1.4** - Aktualizacja package.json
- **🎯 Layout.module.css**: Dodano explicite `max-width: 480px` i `margin: 0 auto` dla desktop, positioning i z-index
- **🌐 globals.css**: Ulepszone media queries dla spójnego centrowania, refaktor background utilities
- **🏠 Home.module.css**: Usunięto konflictujące max-width z heroDescription
- **🎯 Layout.tsx**: Dodano useEffect dla dynamicznego zarządzania klasami tła na body
- **🎨 BotCard.module.css**: Zmieniono max-width z 400px na 100% dla Layout consistency
- **🎮 Game.module.css**: Usunięto ograniczenie max-width 300px z przycisków, zwiększono card-reverse
- **⚛️ Game.tsx**: Dodano `game.resetGame()` call w `confirmExit()` dla proper state management

### 📁 Bug fix dla Issue #13

- "Ekran nie jest wyśrodkowany w wersji desktopowej" - ROZWIĄZANY ✅

### 📁 Bug fix dla Issue #14

- "Tło nie zajmuje całego ekranu i nie jest wyśrodkowane" - ROZWIĄZANY ✅

### 📁 Bug fix dla Issue #15

- "Niespójne szerokości elementów na różnych ekranach" - ROZWIĄZANY ✅

### 📁 Bug fix dla Issue #16

- "Stan gry nie jest resetowany przy powrocie do menu" - ROZWIĄZANY ✅

### 🐛 Naprawione błędy

- **🎨 Poprawione tła pełnoekranowe**

  - Naprawiono problem z tłami nie pokrywającymi całego ekranu (Issue #14)
  - Przeniesiono aplikację tła z Layout component na body element dla full-screen coverage
  - Dodano `background-attachment: fixed` dla stabilnych teł podczas scroll
  - Wprowadzono subtelny overlay (0.05 opacity) dla lepszej czytelności tekstu
  - Ulepszona hierarchia z-index (Layout z-index: 1, overlay z-index: 0)

- **� Spójność układu na różnych ekranach**

  - Naprawiono niespójne szerokości elementów między ekranami (Issue #15)
  - BotCard: zmieniono max-width z 400px na 100% dla pełnego wykorzystania Layout
  - Game buttons: usunięto ograniczenie max-width 300px dla spójności z Layout
  - Game card-reverse: zwiększono max-width z 200px na 250px dla lepszej proporcji
  - Wszystkie komponenty używają teraz unified Layout max-width system (480px)

- **🎮 Poprawiony reset stanu gry**
  - Naprawiono problem z nieresetowaniem stanu gry przy powrocie do menu (Issue #16)
  - Dodano wywołanie `game.resetGame()` w funkcji `confirmExit()` w Game.tsx
  - Modal ostrzeżenia pozostaje aktywny dla informacji użytkownika
  - Stan gry jest teraz prawidłowo resetowany przed nawigacją do menu

### 🔧 Zmiany techniczne

- **🎯 Layout.tsx**: Dodano useEffect dla dynamicznego zarządzania klasami tła na body
- **🌐 globals.css**: Refaktor background utilities - aplikacja na body, nie Layout
- **📱 Layout.module.css**: Dodano positioning i z-index dla proper layering

## [0.1.3] - 2025-08-21

### ✨ Nowe funkcjonalności

- **🎨 System grafik tła**
  - Dodano grafikę `home-bg.jpg` na stronie głównej dla lepszego efektu wizualnego
  - Dodano grafikę `game-bg.jpg` na ekranie gry jako pełne tło (nie overlay)
  - Implementacja grafiki `card-reverse.jpg` na ekranie 0/13 - symbolizuje zakryty stos kart
  - CSS utility classes: `.bg-home`, `.bg-game` dla łatwego zarządzania tłami
  - CSS variables: `--home-bg`, `--game-bg` dla elastycznej konfiguracji

### 🎨 Ulepszenia UX

- **⚡ Drastyczna optymalizacja interfejsu**
  - Zmniejszenie margin header z 32px na 12px (62% redukcja)
  - Kompaktowy padding w gameStatus z 16px na 2px w pionie (87% redukcja)
  - Globalny --gap zmniejszony z 12px na 8px (33% redukcja)
  - CardArea min-height z 300px na 150px (50% redukcja)
  - Card reverse image max-width z 250px na 200px (20% redukcja)

### 🔧 Zmiany techniczne

- **🧩 Rozszerzony Layout component**

  - Dodano `backgroundType` prop dla dynamicznego wyboru tła
  - Implementacja `getBackgroundClass()` dla type-safe background switching
  - Import CSS-in-TS dla card-reverse.jpg asset optimization

- **📱 Responsive improvements**
  - Poprawki w media query `@media (max-width: 768px)` dla gameStatus
  - Spójny padding na wszystkich urządzeniach mobilnych
  - Zachowana funkcjonalność przy maksymalnie kompaktowym designie

### 🎨 Polepszenia wizualne

- **🎨 Efektowne tła**
  - Pełne grafiki tła zamiast subtelnych overlay effects
  - Responsywne tła z `background-size: cover` i `background-position: center`
  - Professional card-reverse visualization dla stanu początkowego gry

## [0.1.2] - 2025-08-20

### ✨ Nowe funkcjonalności

- **🔄 Profesjonalny modal potwierdzenia**
  - Zastąpienie natywnego `window.confirm()` przeglądarki
  - Komponent `ConfirmModal` z pełną responsywnością i animacjami
  - Spójny design system z kolorystyką ZOO
  - Obsługa klawisza Escape i kliknięcia poza modal
  - Opcjonalny tytuł - modal może działać z nagłówkiem lub bez

### 🎨 Ulepszenia UX

- **⚡ Płynny gameplay**
  - Natychmiastowe dobieranie kart bez przeszkód
  - Modal tylko dla wyjścia z gry (rzeczywisty "punkt bez powrotu")
  - Krótsza, jaśniejsza wiadomość: "Czy na pewno wrócić do głównego menu? Stan gry zostanie utracony."

### 🎨 Polepszenia wizualne

- **🎨 Spójne kolory**
  - Modal dopasowany do kolorystyki ZOO (kremowe tło, brązowe elementy)
  - Wykorzystanie zmiennych CSS z głównego design systemu
  - Profesjonalne animacje fade/slide z responsywnym designem

### 🔧 Zmiany techniczne

- **🧩 Uniwersalny komponent ConfirmModal**
  - Wielokrotnego użytku z konfigurowalnymi props
  - Opcjonalny `title` dla różnych przypadków użycia
  - Gotowy do wykorzystania w przyszłych funkcjonalnościach

## [0.1.1] - 2025-08-19

### 🎨 Ulepszenia UX

- **🔄 Uproszczony interfejs gry**
  - Konsolidacja 3 przycisków do 1 dynamicznego przycisku głównego:
    - 0/13: "🎯 Dobierz pierwszą kartę"
    - 1-11/13: "🎯 Dobierz następną kartę"
    - 12/13: "🎯 Dobierz ostatnią kartę"
    - 13/13: "🔀 Przetasuj i dobierz kartę"
  - Usunięcie redundantnej informacji o pozostałych kartach
  - Całkowite usunięcie przycisku "Reset gry" dla czystszego interfejsu
  - Lepsze wyśrodkowanie statusu gry i informacji
  - Zwiększenie rozmiaru głównego przycisku akcji
  - Poprawiona responsywność na urządzeniach mobilnych

### 📱 Responsywność

- **📱 Optymalizacja mobilna**
  - Lepsze wyśrodkowanie elementów na małych ekranach
  - Uproszczony układ kontrolek (tylko 1 główny przycisk + powrót do menu)
  - Ulepszony układ statusu gry dla urządzeń mobilnych

## [0.1.0] - 2025-08-19

### ✨ Dodane

- **🎮 Kompletna mechanika kart**
  - 13 kart botów Lorem Ipsum z efektami i zdolnościami
  - Losowanie, tasowanie i reset kart
  - Zarządzanie stanem gry z React Context + useReducer
  - Komponent BotCard z responsywnym designem
  - Kontrolki gry: "Dobierz kartę", "Przetasuj talię", "Reset gry"
  - Auto-start gry po wejściu na stronę
  - Statystyki gry: aktualna karta, pozostałe karty, liczba tasowań

### 🎯 Doświadczenie użytkownika

- Płynne animacje kart z CSS keyframes
- Disabled states dla przycisków gdy to właściwe
- Mobile-first responsive design (320px+ WCAG compliant)
- Intuicyjny flow: Home → "Rozpocznij grę" → natychmiastowe wyświetlenie karty

### 🏗️ Techniczne

- TypeScript full type safety z custom interfaces
- System CSS custom properties dla spójnego stylingu
- Profesjonalna struktura projektu z rozdzielonymi odpowiedzialnościami
- Implementacja algorytmu Fisher-Yates shuffle
- Czyste procesy build i lint

### 🔧 Zmienione

- Game.tsx: usunięto zbędny ekran startowy, auto-start gry
- Struktura: skonsolidowano typy w /types/index.ts
- CSS: optymalizacja i usunięcie nieużywanych reguł

## [0.0.3] - 2025-08-18

### Naprawione

- 🐛 **WCAG 320px compliance**: Naprawiono poziomy overflow na ekranach 320px (wymóg dostępności)
- 🐛 **Horizontal scrolling**: Wyeliminowano poziome przewijanie na małych ekranach (320px-360px)
- 🐛 **CSS media query conflicts**: Naprawiono konflikty między różnymi zakresami responsywności
- 🐛 **Card sizing issues**: Ujednolicono szerokość kart dla płynnych przejść między rozmiarami ekranu

### 📁 Bug fixes dla Issues

- Issue #7: "Horizontal overflow na bardzo małych ekranach (≤320px)" - ROZWIĄZANY ✅

### Dodane

- ✅ **CSS custom properties**: Wprowadzono zmienne dla responsywnych font-size i spacing
- ✅ **Unified small screen support**: Jeden spójny styl dla wszystkich ekranów ≤360px
- ✅ **Responsive font system**: System zarządzania czcionkami przez CSS custom properties

### Zmienione

- 🔧 **Media queries**: Uproszczono z wielu zakresów do jednolitego `@media (max-width: 360px)`
- 🔧 **CSS architecture**: Refaktor - eliminacja `clamp()` na rzecz CSS custom properties
- 🔧 **Small screen layout**: Zoptymalizowano layout dla ekranów 320px-360px z równymi odstępami
- 🔧 **Code maintainability**: Zmniejszono duplikację CSS poprzez centralne zarządzanie responsive styles

### Techniczne

- 📦 **CSS bundle size**: Zoptymalizowano z 10.49kB → 10.03kB
- 🧹 **Code cleanup**: Usunięto konfliktujące reguły CSS i uproszono strukturę responsywności

## [0.0.2] - 2025-08-17

### Naprawione

- 🐛 **Layout viewport issues**: Naprawiono urwane tło na dole ekranu (`background-attachment: fixed`, `100dvh`)
- 🐛 **Content overflow**: Poprawiono wyświetlanie na małych ekranach - zawartość nie była w pełni widoczna
- 🐛 **Responsywność czcionek**: Zastąpiono stałe rozmiary czcionek responsywnymi (`clamp()`)
- 🐛 **Padding na małych ekranach**: Dodano responsywny padding dla urządzeń <380px

### 📁 Bug fixes dla Issues

- Issue #2: "Responsywność: Czcionki zbyt duże na małych ekranach" - ROZWIĄZANY ✅
- Issue #3: "Overflow: Zawartość nie mieści się na ekranie na małych urządzeniach" - ROZWIĄZANY ✅
- Issue #4: "Gradient tła nie pokrywa całego ekranu (urwane tło na dole)" - ROZWIĄZANY ✅

### Dodane

- ✅ **Automatyczne wersje**: Import `package.json` dla dynamicznego wyświetlania wersji
- ✅ **Media queries**: Lepsze wsparcie dla bardzo małych ekranów
- ✅ **TypeScript JSON support**: Dodano `resolveJsonModule` w konfiguracji

### Zmienione

- 🔧 **CSS**: Użyto `100dvh` zamiast `100vh` dla lepszej obsługi mobile browsers
- 🔧 **Responsywność**: Dodano `clamp()` dla wszystkich rozmiarów czcionek
- 🔧 **Base font-size**: Zrobiono responsywnym (14-16px zależnie od ekranu)

## [0.0.1] - 2025-08-16

### Dodane

- ✅ Setup React + TypeScript + Vite (dostosowany do Node 18)
- ✅ Routing z React Router (`/` i `/game`)
- ✅ Responsywny design mobile-first
- ✅ Layout z kolorami z instrukcji gry (żółto-zielone tło, brązowe nagłówki)
- ✅ Struktura folderów projektu (components, pages, hooks, etc.)
- ✅ TypeScript interfaces dla całej aplikacji
- ✅ Globalne style CSS z paletą kolorów z instrukcji
- ✅ Strona główna z menu opcji
- ✅ Placeholder ekranu gry (gotowy na v0.1.0)
- ✅ ESLint konfiguracja
- ✅ Build i lint bez błędów

### Techniczne

- React 19.1.1
- TypeScript 5.8.3
- Vite 5.4.19 (downgraded dla Node 18)
- React Router DOM 7.8.1
- CSS Modules dla stylów

## [0.0.0] - 2025-08-16

### Dodane

- Utworzenie repozytorium
- Dokumentacja projektu (`DOKUMENTACJA.md`)
- Plan rozwoju i roadmapa
- README.md z opisem projektu
- CHANGELOG.md
- TODO.md

### Uwagi

- Projekt w fazie planowania
- Setup i implementacja wersji 0.0.1
