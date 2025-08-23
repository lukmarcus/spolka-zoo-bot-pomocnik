# Spółka ZOO - Bot Pomocnik

Aplikacja webowa pomocnicza do gry planszowej "Spółka ZOO" - cyfrowy zamiennik dla kart botów.

## 🎮 O projekcie

Ta aplikacja zastępuje fizyczne karty botów (13 kart) w grze planszowej Spółka ZOO. Umożliwia grę z botami, zarządzanie ich kartami i losowanie kart z talii.

### Główne funkcje

- 🤖 Losowanie kart botów z talii 13 kart
- 🎲 Tasowanie i dobieranie kolejnych kart
- 🔄 Reset i przetasowanie talii
- � **NOWE**: Zapisywanie i wczytywanie stanu gry
- 🔗 **NOWE**: Udostępnianie gry poprzez kody
- �📱 Responsywny design dla telefonów (320px+)
- 🎯 Licznik pozostałych kart i statystyk gry
- 📊 Wyświetlanie efektów i zdolności kart

## 🚀 Status rozwoju

**Aktualna wersja**: 0.2.0 ✅  
**Status**: Save/Load system implemented (localStorage-only)  
**Znane problemy**: Kody nie działają cross-device ⚠️  
**Następna wersja**: 0.2.1 - Cross-device functionality

## ✨ What's New v0.2.0

💾 **Save & Load System**:

- **Automatyczne zapisywanie**: Stan gry automatycznie zapisuje się w localStorage
- **Kody gry**: Generowanie kodów do zapisywania stanu gry
- **Import/Export**: Zapisywanie i wczytywanie gry w tej samej przeglądarce
- **Walidacja**: Bezpieczne wczytywanie z checksumami i walidacją

⚠️ **Znane ograniczenia v0.2.0**:

- **Kody działają tylko lokalnie**: Nie można udostępniać kodów między urządzeniami
- **localStorage dependency**: Kody wymagają danych z tej samej przeglądarki
- **Planowane naprawy w v0.2.1+**: Cross-device functionality, krótsze kody

🔗 **Nowe modale**:

- **ShareGameModal**: Generowanie kodów do zapisywania stanu gry
- **LoadGameModal**: Wczytywanie gry z lokalnych kodów
- **BaseModal**: Uniwersalny system modali z reużywalnymi stylami

🎮 **Ulepszone UX**:

- Przycisk "Udostępnij grę" dostępny podczas rozgrywki
- Przycisk "Wczytaj grę" aktywny w menu głównym
- Kopiowanie kodów do schowka jednym kliknięciem
- Instrukcje użycia wbudowane w interfejs

🏗️ **Architektura**:

- Rozbudowany GameContext z obsługą loadGame
- Nowe utilities w gameStorage.ts
- Eliminacja duplikacji CSS między modalami
- Pełna typizacja TypeScript dla nowych funkcji

🐛 **Complete bugfix cycle**:

- **Issue #13**: Naprawiono centrowanie aplikacji na ekranach desktopowych (>480px)
- **Issue #14**: Naprawiono tła nie pokrywające całego ekranu - przeniesiono na body element
- **Issue #15**: Naprawiono niespójne szerokości elementów - unified Layout max-width system
- **Issue #16**: Naprawiony reset stanu gry przy powrocie do menu

🔧 **Layout & UX improvements**:

- Unified system szerokości 480px dla wszystkich komponentów (BotCard, Game buttons)
- Full-screen background coverage z `background-attachment: fixed`
- Spójne centrowanie między wszystkimi ekranami aplikacji
- Proper game state management - reset przy powrocie do menu

🎯 **Technical enhancements**:

- Enhanced media queries dla lepszego desktop experience
- Dynamic background management z useEffect w Layout.tsx
- CSS architecture optimization dla unified layout system
- Game state reset functionality w confirmExit()

📁 **All bugs resolved**: Issues #13, #14, #15, #16 - ROZWIĄZANE ✅

## 📖 Instrukcja obsługi Save/Load

### 💾 Zapisywanie gry

Gra **automatycznie zapisuje** się w lokalnej pamięci przeglądarki podczas każdej akcji. Nie musisz niczego robić!

### 🔗 Udostępnianie gry

**⚠️ OGRANICZENIE v0.2.0**: Kody działają tylko w tej samej przeglądarce

1. **Podczas gry** kliknij przycisk **"🔗 Udostępnij grę"**
2. W modalU kliknij **"📝 Wygeneruj kod gry"**
3. **Skopiuj** wygenerowany kod (przycisk 📋)
4. **Kod działa tylko w tej przeglądarce** - nie można wysłać innemu graczowi

### 📥 Wczytywanie otrzymanej gry

**⚠️ OGRANICZENIE v0.2.0**: Tylko kody z tej samej przeglądarki

1. **W menu głównym** kliknij **"📥 Wczytaj grę"**
2. **Wprowadź kod** wygenerowany wcześniej **w tej przeglądarce**
3. Kliknij **"📥 Wczytaj grę"** lub naciśnij **Enter**
4. Gra zostanie wczytana jeśli kod istnieje w pamięci przeglądarki

### 🔒 Bezpieczeństwo

- Kody gry są **zaszyfrowane** (Base64) z **checksumami**
- **Walidacja** nieprawidłowych kodów z komunikatami błędów
- **Automatyczne formatowanie** - tylko prawidłowe znaki
- **Brak możliwości** uszkodzenia stanu gry przez błędny kod

### 🚧 **Planowane poprawki w v0.2.1+**

- **Cross-device kody**: Kody będą działać między różnymi urządzeniami
- **Krótsze kody**: Optymalizacja długości kodów gry
- **Lepszy UX**: Uproszczenie interfejsu modali

## ✨ What's New v0.1.4

🎨 **Grafiki tła**:

- Dodano grafikę `home-bg.jpg` na stronie głównej
- Dodano grafikę `game-bg.jpg` na ekranie gry
- Implementacja grafiki `card-reverse.jpg` na ekranie 0/13 (symbolizuje zakryty stos kart)
- Pełne tła (nie subtelne overlay) dla lepszego efektu wizualnego

⚡ **Optymalizacja interfejsu**:

- Drastyczne zmniejszenie odstępów między elementami na ekranie gry
- Kompaktowy padding w gameStatus (2px zamiast 16px w pionie)
- Zmniejszony margines header (12px zamiast 32px)
- Responsywne media queries skorygowane dla spójności

🔧 **Usprawnienia techniczne**:

- CSS utility classes dla backgroundów (.bg-home, .bg-game)
- Zmniejszony globalny --gap (8px zamiast 12px)
- Optymalizacja Layout component z dynamicznym backgroundType
- Poprawki w Game.module.css dla lepszej responsywności

## ✨ What's New v0.1.2

🔄 **Profesjonalny modal**:

- Zastąpienie natywnego `window.confirm()` przeglądarki
- Komponent `ConfirmModal` z animacjami i responsywnością
- Spójny design z kolorystyką ZOO (kremowe tło, brązowe elementy)
- Obsługa Escape i kliknięcia poza modal

⚡ **Płynny gameplay**:

- Natychmiastowe dobieranie kart bez przeszkód
- Modal tylko dla wyjścia z gry (rzeczywisty "punkt bez powrotu")
- Krótsza, jaśniejsza wiadomość: "Czy na pewno wrócić do głównego menu? Stan gry zostanie utracony."

## ✨ What's New v0.1.1

🎨 **Uproszczony interfejs gry**:

- Konsolidacja 3 przycisków do 1 dynamicznego przycisku głównego:
  - 0/13: "🎯 Dobierz pierwszą kartę"
  - 1-11/13: "🎯 Dobierz następną kartę"
  - 12/13: "🎯 Dobierz ostatnią kartę"
  - 13/13: "🔀 Przetasuj i dobierz kartę"
- Usunięcie redundantnej informacji o pozostałych kartach
- Całkowite usunięcie przycisku "Reset gry" dla czystszego interfejsu
- Lepsze wyśrodkowanie i responsywność na urządzeniach mobilnych

## ✨ What's New v0.1.0

🎯 **Pełna mechanika gry**:

- Losowanie i wyświetlanie kart botów (13 kart Lorem Ipsum)
- Automatyczne tasowanie na start gry
- Dobieranie kolejnych kart z animacjami
- Przetasowanie talii w dowolnym momencie
- Reset gry do stanu początkowego

🎮 **Intuicyjny interfejs**:

- Auto-start gry po kliknięciu "Rozpocznij grę"
- Liczniki: aktualna karta, pozostałe karty, liczba tasowań
- Responsive design 320px+ WCAG compliance
- Smooth animations i visual feedback

🛠️ **Solidna architektura**:

- React Context + useReducer pattern
- TypeScript full type safety
- CSS custom properties system
- Professional project structure

## 📋 Szybki start

### Wymagania

- Node.js 18+
- npm/yarn/pnpm

### Instalacja

```bash
# Klonowanie repo
git clone https://github.com/lukmarcus/spolka-zoo-bot-pomocnik.git
cd spolka-zoo-bot-pomocnik

# Instalacja zależności
npm install

# Uruchomienie dev server
npm run dev
```

### Dostępne komendy

```bash
npm run dev     # Uruchomienie serwera deweloperskiego
npm run build   # Build produkcyjny
npm run lint    # Sprawdzenie linting
npm run preview # Podgląd builda
```

## 📖 Dokumentacja

Pełna dokumentacja projektu znajduje się w pliku [`DOKUMENTACJA.md`](./DOKUMENTACJA.md).

Zawiera:

- 🎯 Plan rozwoju (wersje 0.0.1 → 1.0.0)
- 🔧 Szczegóły techniczne
- 📝 Lista funkcjonalności
- 🗂️ Struktura projektu
- 🃏 Definicje kart botów

## 🛠️ Technologie

- **Frontend**: React 19.1.1 + TypeScript 5.8.3 + Vite 5.4.19
- **Style**: CSS Modules
- **Routing**: React Router DOM 7.8.1
- **Build**: Vite
- **Linting**: ESLint

## 🗓️ Plan rozwoju

| Wersja | Status       | Opis                                                      |
| ------ | ------------ | --------------------------------------------------------- |
| 0.0.1  | ✅ Ukończona | Setup projektu i podstawowa nawigacja                     |
| 0.0.2  | ✅ Ukończona | Responsywność WCAG 320px compliance                       |
| 0.0.3  | ✅ Ukończona | Poprawki wizualne i CSS refactoring                       |
| 0.1.0  | ✅ Ukończona | **Mechanika kart - losowanie, tasowanie, dobieranie**     |
| 0.1.1  | ✅ Ukończona | **UX improvements - uproszczenie interfejsu gry**         |
| 0.1.2  | ✅ Ukończona | Niestandardowe modale (zamiast window.confirm)            |
| 0.1.3  | ✅ Ukończona | **Grafiki tła i optymalizacja interfejsu**                |
| 0.1.4  | ✅ Ukończona | **Complete bugfix cycle - 4 issues resolved**             |
| 0.2.0  | ✅ Ukończona | **Save/Load system (localStorage-only)** ⚠️ bugfix needed |
| 0.2.1  | 🔜 Planowana | Cross-device kody gry - naprawienie systemu udostępniania |
| 0.2.2  | 🔜 Planowana | UX improvements modali - uproszczenie interfejsu          |
| 0.2.3  | 🔜 Planowana | Optymalizacja długości kodów (custom encoding)            |
| 0.3.0  | 🔜 Planowana | Wsparcie dla wielu botów                                  |
| 0.4.0  | 🔜 Planowana | Osobne talie dla każdego bota                             |
| 0.5.0  | 🔜 Planowana | Wizualizacja kart                                         |
| ...    |              | Zobacz [DOKUMENTACJA.md](./DOKUMENTACJA.md)               |

## 🎨 Wygląd aplikacji

Aplikacja wykorzystuje kolory z instrukcji gry:

- 🟢 Żółto-zielone tło gradientowe
- 🟤 Brązowe nagłówki i przyciski
- 🟡 Kremowe tło kart z pomarańczowo-brązowymi ramkami
- 📱 Design mobile-first (portrait mode)

## 🤝 Rozwój

### Workflow

1. Każda nowa funkcja = nowy branch z `main`
2. Commit messages po angielsku
3. Pull request do `main` po zakończeniu funkcji
4. Dokumentacja aktualizowana z każdą wersją

### Struktura projektu

```
src/
├── components/         # Komponenty React (Layout, etc.)
├── pages/             # Strony aplikacji (Home, Game)
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── utils/             # Funkcje pomocnicze
├── types/             # TypeScript definitions
├── data/              # Dane gry (karty, etc.)
├── styles/            # Globalne style CSS
└── assets/            # Obrazy, ikony, czcionki
```

## 📄 Licencja

MIT License - projekt open source

---

**Autor**: Marek Szumny  
**Repo**: [spolka-zoo-bot-pomocnik](https://github.com/lukmarcus/spolka-zoo-bot-pomocnik)  
**Język**: Polski
