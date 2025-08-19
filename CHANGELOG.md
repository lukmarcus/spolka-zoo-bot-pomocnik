# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
projekt stosuje [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
